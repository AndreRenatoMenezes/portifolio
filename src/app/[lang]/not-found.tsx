"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import pt from "@/dictionaries/pt.json";
import en from "@/dictionaries/en.json";

/** 404 dentro do layout: a floresta que dá voltas. */
export default function NotFound() {
  const lang = usePathname().startsWith("/en") ? "en" : "pt";
  const dict = (lang === "en" ? en : pt).notFound;

  return (
    <section className="section container lost">
      <div className="lost-woods" aria-hidden="true">
        {Array.from({ length: 7 }, (_, i) => (
          <span key={i} className="lost-tree" style={{ animationDelay: `${i * -1.1}s` }} />
        ))}
      </div>
      <p className="lost-code">404</p>
      <h1 className="section-title">{dict.title}</h1>
      <p>{dict.text}</p>
      <Link className="btn btn-primary" href={`/${lang}`}>
        {dict.back}
      </Link>
    </section>
  );
}
