"use client";

import Link from "next/link";
import type { Project } from "@/types";

function getVideoPoster(url: string): string {
  return url
    .replace("/upload/", "/upload/so_auto/")
    .replace(/\.(mp4|mov|webm|ogg|avi|mkv)$/i, ".jpg");
}

interface ProjectCardProps {
  project: Project;
  index?: number;
}

export function ProjectCard({ project, index = 0 }: ProjectCardProps) {
  const thumbnail = project.media[0];

  return (
    <Link
      href={`/projetos/${project.slug}`}
      className="group block animate-fade-in-up"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="aspect-[4/3] overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-800 transition-colors">
        {thumbnail ? (
          thumbnail.type === "video" ? (
            <div className="relative w-full h-full">
              <video
                src={thumbnail.url}
                poster={getVideoPoster(thumbnail.url)}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                muted
                loop
                playsInline
                preload="metadata"
                onMouseEnter={(e) => e.currentTarget.play()}
                onMouseLeave={(e) => {
                  e.currentTarget.pause();
                  e.currentTarget.currentTime = 0;
                }}
              />
              {/* Ícone de play — some no hover quando o vídeo começa a tocar */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-300 group-hover:opacity-0">
                <span className="flex items-center justify-center w-14 h-14 rounded-full bg-black/50 backdrop-blur-sm">
                  <svg className="w-6 h-6 text-white translate-x-0.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </span>
              </div>
            </div>
          ) : (
            <img
              src={thumbnail.url}
              alt={project.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          )
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg className="w-12 h-12 text-zinc-300 dark:text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
      </div>
      <div className="mt-4">
        <h3 className="font-medium text-zinc-900 dark:text-white group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors">
          {project.title}
        </h3>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          {project.category.name}
          {project.year && ` / ${project.year}`}
        </p>
      </div>
    </Link>
  );
}
