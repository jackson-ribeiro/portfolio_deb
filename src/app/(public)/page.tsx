import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ProjectCard } from "@/components/portfolio/ProjectCard";
import { getSettings } from "@/lib/settings";
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

  const settings = await getSettings();

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <section
        className={`mb-16 grid items-end gap-x-5 md:gap-x-10 ${
          settings.profilePhotoUrl ? "grid-cols-[5.5rem_1fr] md:grid-cols-[11rem_1fr] md:grid-rows-[1fr_auto_auto]" : "grid-cols-1"
        }`}
      >
        {/* Retrato no mesmo formato 4:5 dos cards, como a primeira peça do portfólio */}
        {settings.profilePhotoUrl && (
          <Link
            href="/sobre"
            aria-label="Conhecer mais sobre a Déborah"
            className="group block self-center md:self-end md:row-span-3 animate-fade-in-up rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-zinc-900 dark:focus-visible:outline-white"
          >
            <div className="aspect-[4/5] overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-800">
              <img
                src={settings.profilePhotoUrl}
                alt={settings.name || "Foto da Déborah"}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
              />
            </div>
          </Link>
        )}
        <h1 className="text-3xl md:text-5xl font-bold text-zinc-900 dark:text-white md:mb-4 animate-fade-in-up">
          Oi, eu sou a Déborah
        </h1>
        <p className="col-span-full md:col-span-1 mt-5 md:mt-0 text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl animate-fade-in-up delay-100">
          Publicitária apaixonada por contar histórias através de imagens e vídeos.
          Confira alguns dos meus trabalhos.
        </p>
        {settings.profilePhotoUrl && (
          <Link
            href="/sobre"
            className="col-span-full md:col-span-1 justify-self-start mt-4 text-sm font-medium text-zinc-900 dark:text-white underline underline-offset-4 decoration-zinc-300 dark:decoration-zinc-600 hover:decoration-current transition-colors animate-fade-in-up delay-200"
          >
            Mais sobre mim
          </Link>
        )}
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
