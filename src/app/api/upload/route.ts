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

// O arquivo é enviado direto do browser para o Cloudinary (ver src/lib/uploadMedia.ts),
// então aqui só recebemos os metadados (JSON pequeno) e salvamos a mídia no banco.
// Isso evita o limite de 4.5MB do body de funções serverless da Vercel.
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const { url, publicId, type, projectId } = await request.json();

  if (!url || !publicId || !projectId || (type !== "image" && type !== "video")) {
    return NextResponse.json(
      { error: "url, publicId, type (image|video) e projectId são obrigatórios" },
      { status: 400 }
    );
  }

  // Contar mídias existentes para definir order
  const mediaCount = await prisma.media.count({ where: { projectId } });

  const media = await prisma.media.create({
    data: {
      url,
      publicId,
      type,
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
