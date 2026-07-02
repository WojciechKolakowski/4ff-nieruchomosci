"use client";

import { useEffect, useState } from "react";
import type { HeroSlide } from "@/content/hero";

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
        {slides.map((slide, i) => (
          <div
            key={i}
            className={slide.type === "video" ? "slide slide-video" : "slide"}
            style={{ background: slide.placeholderGradient }}
          >
            <span className="ph-tag">{slide.tag}</span>
            {slide.type === "video" && (
              <button
                className="play-btn"
                aria-label="Odtwórz wideo powitalne"
                onClick={() =>
                  alert(
                    "Prototyp — tu docelowo odtworzy się wideo powitalne biura (autoplay, wyciszone, w pętli)."
                  )
                }
              >
                ▶
              </button>
            )}
            <span className="ph-label">{slide.placeholderLabel}</span>
          </div>
        ))}
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
