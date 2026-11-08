import Link from "next/link";
import { Logo } from "@/components/logo";
import { contact } from "@/lib/contact";

const linkClass = "text-dim transition-colors hover:text-text";

export function Footer() {
  return (
    <footer className="border-t border-hairline bg-void/70 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <Logo />
        <p className="text-sm text-dim">Identidade visual para empresas que querem ser reconhecidas.</p>
        <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm">
          <a href={`https://instagram.com/${contact.instagram}`} target="_blank" rel="noopener noreferrer" className={linkClass}>
            Instagram
          </a>
          <a href={`mailto:${contact.email}`} className={linkClass}>
            E-mail
          </a>
          <Link href="/privacidade" className={linkClass}>
            Política de privacidade
          </Link>
        </div>
      </div>
    </footer>
  );
}
