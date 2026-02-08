import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { v2 as cloudinary } from "cloudinary";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file") as File;
  const type = formData.get("type") as "profile" | "resume";

  if (!file || !type) {
    return NextResponse.json(
      { error: "Arquivo e tipo são obrigatórios" },
      { status: 400 }
    );
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const isResume = type === "resume";
  const resourceType = isResume ? "raw" : "image";
  const folder = isResume ? "portfolio/resume" : "portfolio/profile";

  // Buscar configurações atuais para deletar arquivo anterior
  const currentSettings = await prisma.siteSettings.findUnique({
    where: { id: "site-settings" },
  });

  // Deletar arquivo anterior do Cloudinary se existir
  if (currentSettings) {
    const previousId = isResume
      ? currentSettings.resumeId
      : currentSettings.profilePhotoId;

    if (previousId) {
      try {
        await cloudinary.uploader.destroy(previousId, {
          resource_type: resourceType,
        });
      } catch {
        // Ignora erro se arquivo não existir
      }
    }
  }

  const result = await new Promise<{ secure_url: string; public_id: string }>(
    (resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            resource_type: resourceType,
            folder,
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result as { secure_url: string; public_id: string });
          }
        )
        .end(buffer);
    }
  );

  // Atualizar configurações com nova URL
  const updateData = isResume
    ? { resumeUrl: result.secure_url, resumeId: result.public_id }
    : { profilePhotoUrl: result.secure_url, profilePhotoId: result.public_id };

  await prisma.siteSettings.upsert({
    where: { id: "site-settings" },
    update: updateData,
    create: { id: "site-settings", ...updateData },
  });

  return NextResponse.json({
    url: result.secure_url,
    publicId: result.public_id,
  });
}
