"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import type { HeroSlide } from "@/content/hero";
import { PLACEHOLDER_LABEL } from "@/content/placeholders";

export function HeroCarousel({ slides }: { slides: HeroSlide[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [index, slides.length]);

  const move = (dir: number) => {
    setIndex((prev) => (prev + dir + slides.length) % slides.length);
  };

  return (
    <div className="hero-carousel">
      <div
        className="carousel-track"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {slides.map((slide, i) => {
          const hasMedia = slide.type === "video" ? Boolean(slide.videoUrl) : Boolean(slide.image);
          return (
            <div
              key={i}
              className={slide.type === "video" ? "slide slide-video" : "slide"}
              style={hasMedia ? undefined : { background: slide.placeholderGradient }}
            >
              {slide.type === "video" && slide.videoUrl && (
                <video
                  className="slide-video-el"
                  src={slide.videoUrl}
                  autoPlay
                  muted
                  loop
                  playsInline
                />
              )}
              {slide.type === "image" && slide.image && (
                <Image
                  src={slide.image.src}
                  alt={slide.image.alt || slide.tag}
                  fill
                  style={{ objectFit: "cover" }}
                  sizes="100vw"
                  priority={i === 0}
                />
              )}
              <span className="ph-tag">{slide.tag}</span>
              {!hasMedia && <span className="ph-label">{PLACEHOLDER_LABEL}</span>}
            </div>
          );
        })}
      </div>
      <button className="car-arrow prev" aria-label="Poprzedni slajd" onClick={() => move(-1)}>
        ‹
      </button>
      <button className="car-arrow next" aria-label="Następny slajd" onClick={() => move(1)}>
        ›
      </button>
      <div className="car-dots">
        {slides.map((_, i) => (
          <button
            key={i}
            className={i === index ? "active" : undefined}
            onClick={() => setIndex(i)}
            aria-label={`Przejdź do slajdu ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
