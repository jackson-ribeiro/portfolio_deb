import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ProjectCard } from "@/components/portfolio/ProjectCard";
import type { Project } from "@/types";

export const dynamic = "force-dynamic";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ categoria?: string }>;
}) {
  const { categoria } = await searchParams;

  const projects = await prisma.project.findMany({
    where: {
      published: true,
      ...(categoria ? { category: { slug: categoria } } : {}),
    },
    include: {
      category: true,
      media: { orderBy: { order: "asc" } },
    },
    orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
  });

  const categories = await prisma.category.findMany({
    where: {
      projects: { some: { published: true } },
    },
    orderBy: { name: "asc" },
  });

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <section className="mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-zinc-900 dark:text-white mb-4 animate-fade-in-up">
          Oi, eu sou a Déborah
        </h1>
        <p className="text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl animate-fade-in-up delay-100">
          Publicitária apaixonada por contar histórias através de imagens e vídeos.
          Confira alguns dos meus trabalhos.
        </p>
      </section>

      {categories.length > 0 && (
        <nav className="flex flex-wrap gap-2 mb-8 animate-fade-in-up delay-200">
          <Link
            href="/"
            className={`px-4 py-2 rounded-full text-sm transition-colors ${
              !categoria
                ? "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900"
                : "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700"
            }`}
          >
            Todos
          </Link>
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/?categoria=${category.slug}`}
              className={`px-4 py-2 rounded-full text-sm transition-colors ${
                categoria === category.slug
                  ? "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900"
                  : "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700"
              }`}
            >
              {category.name}
            </Link>
          ))}
        </nav>
      )}

      {projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project as unknown as Project}
              index={index}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 animate-fade-in">
          <p className="text-zinc-500 dark:text-zinc-400 text-lg">
            {categoria
              ? "Nenhum projeto encontrado nessa categoria."
              : "Em breve novos projetos."}
          </p>
        </div>
      )}
    </div>
  );
}
