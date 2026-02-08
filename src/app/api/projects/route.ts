import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// GET - Listar projetos (público para publicados, todos para admin)
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const onlyPublished = searchParams.get("published") === "true";
  const featured = searchParams.get("featured") === "true";
  const categorySlug = searchParams.get("category");

  const where: Record<string, unknown> = {};

  if (onlyPublished) {
    where.published = true;
  }

  if (featured) {
    where.featured = true;
  }

  if (categorySlug) {
    where.category = { slug: categorySlug };
  }

  const projects = await prisma.project.findMany({
    where,
    include: {
      category: true,
      media: {
        orderBy: { order: "asc" },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(projects);
}

// POST - Criar projeto (autenticado)
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const body = await request.json();
  const { title, description, client, year, categoryId, featured, published } = body;

  if (!title || !description || !categoryId) {
    return NextResponse.json(
      { error: "Título, descrição e categoria são obrigatórios" },
      { status: 400 }
    );
  }

  const slug = generateSlug(title);

  // Verificar se slug já existe
  const existingProject = await prisma.project.findUnique({ where: { slug } });
  const finalSlug = existingProject ? `${slug}-${Date.now()}` : slug;

  const project = await prisma.project.create({
    data: {
      title,
      slug: finalSlug,
      description,
      client,
      year: year ? parseInt(year) : null,
      categoryId,
      featured: featured ?? false,
      published: published ?? false,
    },
    include: {
      category: true,
      media: true,
    },
  });

  return NextResponse.json(project, { status: 201 });
}
