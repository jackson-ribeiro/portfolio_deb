import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

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

      <header className="mb-12 animate-fade-in-up">
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
        <div className="space-y-6 mb-12">
          {project.media.map((item, index) => (
            <div
              key={item.id}
              className="rounded-lg overflow-hidden bg-zinc-100 dark:bg-zinc-800 animate-fade-in-up"
              style={{ animationDelay: `${(index + 1) * 0.1}s` }}
            >
              {item.type === "video" ? (
                <video
                  src={item.url}
                  controls
                  className="w-full"
                  playsInline
                />
              ) : (
                <img
                  src={item.url}
                  alt={project.title}
                  className="w-full"
                />
              )}
            </div>
          ))}
        </div>
      )}

      <div className="prose prose-zinc dark:prose-invert max-w-none animate-fade-in-up delay-300">
        <p className="text-lg text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap">
          {project.description}
        </p>
      </div>
    </div>
  );
}
