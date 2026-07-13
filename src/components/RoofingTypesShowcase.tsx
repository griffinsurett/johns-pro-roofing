// src/components/RoofingTypesShowcase.tsx
import { useState, useEffect, useRef } from "react";

export interface RoofingTypeItem {
  title: string;
  description?: string;
  /** Resolved image src (string) — Astro resolves the asset before passing in. */
  image?: string;
}

interface Props {
  items: RoofingTypeItem[];
  /** Seconds each slide is shown before auto-advancing. */
  interval?: number;
  /** Flip which side the image sits on (desktop). */
  reverse?: boolean;
}

export default function RoofingTypesShowcase({
  items,
  interval = 4,
  reverse = false,
}: Props) {
  const [active, setActive] = useState(0);
  // Pause auto-advance briefly after a manual click so it doesn't fight the user.
  const [paused, setPaused] = useState(false);
  const resumeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const count = items.length;

  // Auto-advance the slideshow. The underline follows `active`, so the list
  // and image stay in sync automatically.
  useEffect(() => {
    if (paused || count <= 1) return;
    const id = setInterval(
      () => setActive((i) => (i + 1) % count),
      interval * 1000,
    );
    return () => clearInterval(id);
  }, [paused, count, interval]);

  useEffect(() => () => {
    if (resumeTimer.current) clearTimeout(resumeTimer.current);
  }, []);

  function select(i: number) {
    setActive(i);
    setPaused(true);
    if (resumeTimer.current) clearTimeout(resumeTimer.current);
    // Resume auto-advance after a idle beat so the user can read.
    resumeTimer.current = setTimeout(() => setPaused(false), interval * 2500);
  }

  if (!count) return null;

  return (
    <div
      className={`grid gap-8 lg:gap-12 items-center lg:grid-cols-2 ${
        reverse ? "" : ""
      }`}
    >
      {/* Image slideshow */}
      <div
        className={`relative aspect-[4/3] overflow-hidden rounded-2xl bg-black/5 shadow-[0_12px_34px_rgba(0,0,0,0.18)] ${
          reverse ? "lg:order-2" : ""
        }`}
      >
        {items.map((it, i) => (
          <img
            key={i}
            src={it.image}
            alt={it.title}
            aria-hidden={i !== active}
            className="absolute inset-0 h-full w-full object-cover transition-opacity duration-700"
            style={{ opacity: i === active ? 1 : 0 }}
          />
        ))}
      </div>

      {/* Selectable list */}
      <ul className={`flex flex-col gap-5 ${reverse ? "lg:order-1" : ""}`}>
        {items.map((it, i) => {
          const isActive = i === active;
          return (
            <li key={i}>
              <button
                type="button"
                onClick={() => select(i)}
                aria-current={isActive ? "true" : undefined}
                className="group block w-full text-left"
              >
                <span
                  className={`text-xl md:text-2xl font-bold tracking-tight transition-all ${
                    isActive
                      ? "underline decoration-[var(--color-accent)] decoration-4 underline-offset-[6px]"
                      : "opacity-55 group-hover:opacity-90"
                  }`}
                >
                  {it.title}
                </span>
                {it.description && (
                  <span
                    className={`mt-1 block text-base leading-relaxed transition-all ${
                      isActive ? "opacity-90" : "opacity-0 max-h-0 overflow-hidden"
                    }`}
                  >
                    {it.description}
                  </span>
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
