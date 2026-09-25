"use client";

import { useEffect } from "react";
import { getVideoPoster } from "@/lib/media";
import { CarouselArrow, trackClass, useCarousel } from "./carousel";

interface CarouselItem {
  id: string;
  url: string;
  type: string;
}

interface ProjectCarouselProps {
  media: CarouselItem[];
  title: string;
}

const frameSize = {
  image: {
    width: "w-[min(100%,calc((100dvh_-_12rem)*4/5))] lg:w-[min(36rem,calc((100dvh_-_12rem)*4/5))]",
    aspect: "aspect-[4/5]",
  },
  video: {
    width: "w-[min(100%,calc((100dvh_-_12rem)*9/16))] lg:w-[min(36rem,calc((100dvh_-_12rem)*9/16))]",
    aspect: "aspect-[9/16]",
  },
};

export function ProjectCarousel({ media, title }: ProjectCarouselProps) {
  const { trackRef, current, goTo, onScroll } = useCarousel();
  const total = media.length;
  const frame = media[0].type === "video" ? frameSize.video : frameSize.image;

  useEffect(() => {
    trackRef.current?.querySelectorAll("video").forEach((video, i) => {
      if (i !== current) video.pause();
    });
  }, [current, trackRef]);

  return (
    <div className={`mx-auto mb-12 animate-fade-in-up lg:col-start-1 lg:row-span-2 lg:row-start-1 lg:mx-0 lg:mb-0 ${frame.width}`}>
      <div className={`group relative ${frame.aspect}`}>
        <div
          ref={trackRef}
          onScroll={onScroll}
          tabIndex={total > 1 ? 0 : undefined}
          role="region"
          aria-roledescription="carrossel"
          aria-label={title}
          className={`${trackClass} rounded-lg bg-zinc-100 dark:bg-zinc-800 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-zinc-900 dark:focus-visible:outline-white`}
        >
          {media.map((item, index) => (
            <div
              key={item.id}
              role="group"
              aria-roledescription="slide"
              aria-label={`${index + 1} de ${total}`}
              className="h-full w-full shrink-0 snap-center"
            >
              {item.type === "video" ? (
                <video
                  src={item.url}
                  poster={getVideoPoster(item.url)}
                  className="h-full w-full object-contain"
                  controls
                  playsInline
                  preload="metadata"
                />
              ) : (
                <img
                  src={item.url}
                  alt={`${title}, ${index + 1} de ${total}`}
                  className="h-full w-full object-contain"
                  loading={index === 0 ? "eager" : "lazy"}
                />
              )}
            </div>
          ))}
        </div>

        {total > 1 && (
          <>
            <span className="absolute top-3 right-3 rounded-full bg-black/60 px-2.5 py-1 text-xs font-medium tabular-nums text-white pointer-events-none">
              {current + 1}/{total}
            </span>
            <CarouselArrow direction="prev" hidden={current === 0} onClick={() => goTo(current - 1)} />
            <CarouselArrow direction="next" hidden={current === total - 1} onClick={() => goTo(current + 1)} />
          </>
        )}
      </div>

      {total > 1 && (
        <div className="mt-3 flex justify-center gap-1.5" aria-hidden="true">
          {media.map((item, index) => (
            <span
              key={item.id}
              className={`h-1.5 w-1.5 rounded-full transition-colors ${
                index === current ? "bg-zinc-900 dark:bg-white" : "bg-zinc-300 dark:bg-zinc-600"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
