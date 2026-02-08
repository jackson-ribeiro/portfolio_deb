import { prisma } from "@/lib/prisma";
import { ProjectCard } from "@/components/portfolio/ProjectCard";
import type { Project } from "@/types";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const projects = await prisma.project.findMany({
    where: { published: true },
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
          <span className="px-4 py-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-full text-sm cursor-pointer transition-colors">
            Todos
          </span>
          {categories.map((category) => (
            <span
              key={category.id}
              className="px-4 py-2 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-full text-sm hover:bg-zinc-200 dark:hover:bg-zinc-700 cursor-pointer transition-colors"
            >
              {category.name}
            </span>
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
          <p className="text-zinc-500 dark:text-zinc-400 text-lg">Em breve novos projetos.</p>
        </div>
      )}
    </div>
  );
}
