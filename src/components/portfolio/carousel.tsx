"use client";

import { useRef, useState } from "react";

export function useCarousel() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState(0);

  const goTo = (index: number) => {
    const track = trackRef.current;
    if (!track) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    track.scrollTo({ left: index * track.clientWidth, behavior: reduceMotion ? "auto" : "smooth" });
  };

  const onScroll = () => {
    const track = trackRef.current;
    if (!track) return;
    setCurrent(Math.round(track.scrollLeft / track.clientWidth));
  };

  return { trackRef, current, goTo, onScroll };
}

export const trackClass =
  "flex h-full snap-x snap-mandatory overflow-x-auto overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden";

interface CarouselArrowProps {
  direction: "prev" | "next";
  hidden: boolean;
  onClick: () => void;
  size?: "sm" | "md";
}

export function CarouselArrow({ direction, hidden, onClick, size = "md" }: CarouselArrowProps) {
  const sizeClass = size === "sm" ? "w-8 h-8" : "w-9 h-9";
  const sideClass = direction === "prev" ? "left-3" : "right-3";

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={direction === "prev" ? "Anterior" : "Próxima"}
      className={`absolute top-1/2 ${sideClass} -translate-y-1/2 hidden sm:flex items-center justify-center ${sizeClass} rounded-full bg-white/90 text-zinc-900 shadow-md transition-opacity duration-300 ease-out hover:bg-white pointer-fine:opacity-0 group-hover:opacity-100 group-hover:duration-150 group-has-focus-visible:opacity-100 group-has-focus-visible:duration-150 motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${hidden ? "invisible" : ""}`}
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2.5}
          d={direction === "prev" ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"}
        />
      </svg>
    </button>
  );
}
