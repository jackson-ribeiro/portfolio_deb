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
  const projectId = formData.get("projectId") as string;

  if (!file || !projectId) {
    return NextResponse.json(
      { error: "Arquivo e projectId são obrigatórios" },
      { status: 400 }
    );
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const isVideo = file.type.startsWith("video/");
  const resourceType = isVideo ? "video" : "image";

  const result = await new Promise<{ secure_url: string; public_id: string }>(
    (resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            resource_type: resourceType,
            folder: "portfolio",
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result as { secure_url: string; public_id: string });
          }
        )
        .end(buffer);
    }
  );

  // Contar mídias existentes para definir order
  const mediaCount = await prisma.media.count({ where: { projectId } });

  const media = await prisma.media.create({
    data: {
      url: result.secure_url,
      publicId: result.public_id,
      type: isVideo ? "video" : "image",
      order: mediaCount,
      projectId,
    },
  });

  return NextResponse.json(media, { status: 201 });
}

// DELETE - Remover mídia
export async function DELETE(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const mediaId = searchParams.get("id");

  if (!mediaId) {
    return NextResponse.json({ error: "ID da mídia é obrigatório" }, { status: 400 });
  }

  const media = await prisma.media.findUnique({ where: { id: mediaId } });

  if (!media) {
    return NextResponse.json({ error: "Mídia não encontrada" }, { status: 404 });
  }

  // Deletar do Cloudinary
  const resourceType = media.type === "video" ? "video" : "image";
  await cloudinary.uploader.destroy(media.publicId, { resource_type: resourceType });

  // Deletar do banco
  await prisma.media.delete({ where: { id: mediaId } });

  return NextResponse.json({ success: true });
}
