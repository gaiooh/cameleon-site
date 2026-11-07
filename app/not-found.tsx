import Link from "next/link";
import { ChameleonMark } from "@/components/logo";

// Aparece quando o endereço não existe (ex.: um projeto que foi removido).
export default function NotFound() {
  return (
    <main className="grid min-h-svh place-items-center px-5 text-center">
      <div className="max-w-md">
        <ChameleonMark className="mx-auto h-16 w-auto text-accent" />
        <h1 className="mt-8 font-display text-[clamp(2.2rem,6vw,3.4rem)] leading-none font-light tracking-[-0.03em]">
          Esta página se camuflou.
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-dim">
          Não encontramos o endereço que você procurou. Ele pode ter mudado ou não existir mais.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex h-12 items-center justify-center rounded-full bg-accent px-6 font-medium text-accent-ink"
          >
            Voltar para o início
          </Link>
          <Link
            href="/#projetos"
            className="inline-flex h-12 items-center justify-center rounded-full border border-hairline px-6 font-medium hover:bg-white/5"
          >
            Ver projetos
          </Link>
        </div>
      </div>
    </main>
  );
}
