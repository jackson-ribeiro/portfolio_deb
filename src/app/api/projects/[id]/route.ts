import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

// GET - Buscar projeto por ID ou slug
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const project = await prisma.project.findFirst({
    where: {
      OR: [{ id }, { slug: id }],
    },
    include: {
      category: true,
      media: {
        orderBy: { order: "asc" },
      },
    },
  });

  if (!project) {
    return NextResponse.json({ error: "Projeto não encontrado" }, { status: 404 });
  }

  return NextResponse.json(project);
}

// PUT - Atualizar projeto
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const { title, description, client, year, categoryId, featured, published } = body;

  const project = await prisma.project.update({
    where: { id },
    data: {
      title,
      description,
      client,
      year: year ? parseInt(year) : null,
      categoryId,
      featured,
      published,
    },
    include: {
      category: true,
      media: true,
    },
  });

  return NextResponse.json(project);
}

// DELETE - Excluir projeto
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const { id } = await params;

  await prisma.project.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
