type MarkProps = {
  className?: string;
  /** Escamas extras para versões grandes do desenho. */
  detailed?: boolean;
  title?: string;
};

// O corpo usa `currentColor`: o camaleão assume a cor do texto ao redor,
// e por isso muda de cor junto com o resto do site.
export function ChameleonMark({ className, detailed = false, title }: MarkProps) {
  return (
    <svg
      viewBox="0 0 120 84"
      className={className}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      {/* galho */}
      <path
        d="M44 64 H114"
        stroke="var(--text)"
        strokeWidth="3.5"
        strokeLinecap="round"
        fill="none"
      />
      <g fill="currentColor" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
        {/* cauda enrolada para baixo, em espiral */}
        <path
          d="M36 54 C24 57 14 64 16 73 C18 81 30 81 31 73 C31.5 67 23 67 23.5 72.5"
          fill="none"
          strokeWidth="6.5"
        />
        {/* corpo e cabeça */}
        <path
          strokeWidth="2"
          d="M32 53 C34 40 46 30 62 29 C70 28.5 76 29 80 30 L88 18 L95 34 C101 37 106 41 109 46 C110.5 49 109 51.5 106 52 L93 54 C84 58 70 60 56 59 C44 58.5 34 58 32 53 Z"
        />
        {/* patas segurando o galho */}
        <path d="M52 58 L48 64" fill="none" strokeWidth="6" />
        <path d="M86 55 L90 64" fill="none" strokeWidth="6" />
      </g>
      {detailed && (
        <g fill="var(--void)" opacity="0.35">
          <circle cx="50" cy="42" r="3" />
          <circle cx="60" cy="36" r="2.5" />
          <circle cx="63" cy="48" r="3.5" />
          <circle cx="73" cy="40" r="2.5" />
          <circle cx="77" cy="51" r="2.2" />
          <circle cx="43" cy="51" r="2.2" />
        </g>
      )}
      {/* olho giratório: o traço marcante do camaleão */}
      <circle cx="94" cy="40" r="7" fill="var(--void)" stroke="var(--text)" strokeWidth="2.5" />
      <circle cx="96" cy="40" r="3" fill="var(--text)" />
    </svg>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className ?? ""}`}>
      <ChameleonMark className="h-8 w-auto text-accent" />
      <span className="font-display text-[1.35rem] font-bold tracking-tight">Cameleon</span>
    </span>
  );
}
