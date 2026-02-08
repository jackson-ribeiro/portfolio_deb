import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

// GET - Obter categoria com contagem de projetos
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const category = await prisma.category.findUnique({
    where: { id },
    include: {
      _count: {
        select: { projects: true },
      },
    },
  });

  if (!category) {
    return NextResponse.json({ error: "Categoria não encontrada" }, { status: 404 });
  }

  return NextResponse.json(category);
}

// DELETE - Excluir categoria e seus projetos
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const { id } = await params;

  // Verificar se a categoria existe
  const category = await prisma.category.findUnique({
    where: { id },
    include: {
      projects: {
        include: {
          media: true,
        },
      },
    },
  });

  if (!category) {
    return NextResponse.json({ error: "Categoria não encontrada" }, { status: 404 });
  }

  // Deletar as mídias dos projetos primeiro (se houver)
  for (const project of category.projects) {
    if (project.media.length > 0) {
      await prisma.media.deleteMany({
        where: { projectId: project.id },
      });
    }
  }

  // Deletar os projetos da categoria
  await prisma.project.deleteMany({
    where: { categoryId: id },
  });

  // Deletar a categoria
  await prisma.category.delete({
    where: { id },
  });

  return NextResponse.json({
    message: "Categoria excluída com sucesso",
    deletedProjects: category.projects.length
  });
}
