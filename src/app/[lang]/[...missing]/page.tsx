import { notFound } from "next/navigation";

/** Qualquer rota desconhecida dentro de /pt ou /en cai no not-found do idioma. */
export default function Missing() {
  notFound();
}
