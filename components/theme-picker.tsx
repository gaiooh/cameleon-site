"use client";

import { useSyncExternalStore } from "react";
import { getThemeIndex, setTheme, subscribeTheme } from "@/lib/scene-store";
import { themes } from "@/lib/themes";

// Botões de rádio de verdade por baixo das bolinhas de cor:
// teclado (setas) e leitores de tela funcionam sem código extra.
export function ThemePicker({ className = "" }: { className?: string }) {
  const active = useSyncExternalStore(subscribeTheme, getThemeIndex, () => 0);

  return (
    <fieldset className={className}>
      <legend className="text-sm text-dim">
        Mude a cor do camaleão: <span className="text-text">{themes[active].name}</span>
      </legend>
      <div className="mt-3 flex gap-3">
        {themes.map((theme, index) => (
          <label
            key={theme.id}
            title={theme.name}
            className={`relative grid size-11 cursor-pointer place-items-center rounded-full border transition-[border-color,transform] duration-300 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-4 has-[:focus-visible]:outline-accent ${
              index === active ? "scale-110 border-text/70" : "border-hairline hover:border-text/40"
            }`}
          >
            <input
              type="radio"
              name="theme"
              value={theme.id}
              checked={index === active}
              onChange={() => setTheme(index)}
              aria-label={theme.name}
              className="sr-only"
            />
            <span
              aria-hidden
              className="size-7 rounded-full"
              style={{
                background: `conic-gradient(from 210deg, ${theme.base}, ${theme.pattern}, ${theme.glow}, ${theme.base})`,
                boxShadow: index === active ? `0 0 18px ${theme.pattern}` : undefined,
              }}
            />
          </label>
        ))}
      </div>
    </fieldset>
  );
}
