import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ProjectCarousel } from "@/components/portfolio/ProjectCarousel";

export const dynamic = "force-dynamic";

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const project = await prisma.project.findFirst({
    where: { slug, published: true },
    include: {
      category: true,
      media: { orderBy: { order: "asc" } },
    },
  });

  if (!project) {
    notFound();
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white mb-8 transition-colors animate-fade-in"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Voltar
      </Link>

      <div className="grid lg:grid-cols-[auto_minmax(0,1fr)] lg:grid-rows-[auto_1fr] lg:gap-x-12">
        <header className="mb-12 animate-fade-in-up lg:col-start-2 lg:row-start-1 lg:mb-6">
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-2">
            {project.category.name}
            {project.year && ` / ${project.year}`}
          </p>
          <h1 className="text-4xl font-bold text-zinc-900 dark:text-white mb-4">{project.title}</h1>
          {project.client && (
            <p className="text-zinc-600 dark:text-zinc-400">Cliente: {project.client}</p>
          )}
        </header>

        {project.media.length > 0 && (
          <ProjectCarousel media={project.media} title={project.title} />
        )}

        <div className="prose prose-zinc dark:prose-invert max-w-none animate-fade-in-up delay-300 lg:col-start-2 lg:row-start-2">
          <p className="text-lg text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap">
            {project.description}
          </p>
        </div>
      </div>
    </div>
  );
}
