"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import type { Project } from "@/types";
import { getVideoPoster } from "@/lib/media";
import { CarouselArrow, trackClass, useCarousel } from "./carousel";

interface ProjectCardProps {
  project: Project;
  index?: number;
}

export function ProjectCard({ project, index = 0 }: ProjectCardProps) {
  const { trackRef, current, goTo, onScroll } = useCarousel();
  const hovered = useRef(false);
  const media = project.media;
  const total = media.length;
  const href = `/projetos/${project.slug}`;

  const syncVideos = (playing: boolean, active: number) => {
    trackRef.current?.querySelectorAll("video").forEach((video) => {
      if (playing && Number(video.dataset.index) === active) {
        video.play().catch(() => {});
      } else {
        video.pause();
        if (!playing) video.currentTime = 0;
      }
    });
  };

  useEffect(() => {
    trackRef.current?.querySelectorAll("video").forEach((video) => {
      if (hovered.current && Number(video.dataset.index) === current) {
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    });
  }, [current, trackRef]);

  return (
    <div
      className="group/card animate-fade-in-up"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div
        className="group relative aspect-[4/5] overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-800 transition-colors"
        onMouseEnter={() => {
          hovered.current = true;
          syncVideos(true, current);
        }}
        onMouseLeave={() => {
          hovered.current = false;
          syncVideos(false, current);
        }}
      >
        {total > 0 ? (
          <div ref={trackRef} onScroll={onScroll} tabIndex={-1} className={trackClass}>
            {media.map((item, i) => (
              <Link
                key={item.id}
                href={href}
                tabIndex={-1}
                aria-hidden="true"
                className="relative block h-full w-full shrink-0 snap-center overflow-hidden"
              >
                {item.type === "video" ? (
                  <>
                    <video
                      data-index={i}
                      src={item.url}
                      poster={getVideoPoster(item.url)}
                      className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-500"
                      muted
                      loop
                      playsInline
                      preload={i === 0 ? "metadata" : "none"}
                    />
                    <span className="absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-300 group-hover/card:opacity-0">
                      <span className="flex items-center justify-center w-14 h-14 rounded-full bg-black/50 backdrop-blur-sm">
                        <svg className="w-6 h-6 text-white translate-x-0.5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </span>
                    </span>
                  </>
                ) : (
                  <img
                    src={item.url}
                    alt=""
                    loading={i === 0 ? undefined : "lazy"}
                    className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-500"
                  />
                )}
              </Link>
            ))}
          </div>
        ) : (
          <Link href={href} tabIndex={-1} aria-hidden="true" className="w-full h-full flex items-center justify-center">
            <svg className="w-12 h-12 text-zinc-300 dark:text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </Link>
        )}

        {total > 1 && (
          <>
            <CarouselArrow size="sm" direction="prev" hidden={current === 0} onClick={() => goTo(current - 1)} />
            <CarouselArrow size="sm" direction="next" hidden={current === total - 1} onClick={() => goTo(current + 1)} />
            <div className="pointer-events-none absolute inset-x-0 bottom-3 flex justify-center gap-1.5" aria-hidden="true">
              {media.map((item, i) => (
                <span
                  key={item.id}
                  className={`h-1.5 w-1.5 rounded-full shadow-[0_0_3px_rgba(0,0,0,0.5)] transition-colors ${
                    i === current ? "bg-white" : "bg-white/50"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      <Link
        href={href}
        className="mt-4 block rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-zinc-900 dark:focus-visible:outline-white"
      >
        <h3 className="font-medium text-zinc-900 dark:text-white group-hover/card:text-zinc-600 dark:group-hover/card:text-zinc-300 transition-colors">
          {project.title}
        </h3>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          {project.category.name}
          {project.year && ` / ${project.year}`}
        </p>
      </Link>
    </div>
  );
}
