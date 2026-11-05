import { Logo } from "@/components/logo";
import { contact } from "@/lib/contact";

export function Footer() {
  return (
    <footer className="border-t border-hairline bg-void/70 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <Logo />
        <p className="text-sm text-dim">Identidade visual para empresas que querem ser reconhecidas.</p>
        <div className="flex gap-6 text-sm">
          <a href={`https://instagram.com/${contact.instagram}`} target="_blank" rel="noopener noreferrer" className="text-dim transition-colors hover:text-text">
            Instagram
          </a>
          <a href={`mailto:${contact.email}`} className="text-dim transition-colors hover:text-text">
            E-mail
          </a>
        </div>
      </div>
    </footer>
  );
}
