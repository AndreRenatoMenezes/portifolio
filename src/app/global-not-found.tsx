import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = { title: "404" };

export default function GlobalNotFound() {
  return (
    <html lang="pt-BR" data-theme="night">
      <body>
        <main className="section container lost">
          <p className="lost-code">404</p>
          <h1 className="section-title">Você se perdeu na floresta… / Lost in the woods…</h1>
          <Link className="btn btn-primary" href="/">
            ← Início / Home
          </Link>
        </main>
      </body>
    </html>
  );
}
