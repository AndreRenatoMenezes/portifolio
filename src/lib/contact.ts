import { profile } from "@/content/profile";

/** Link do WhatsApp com mensagem inicial, ou null se não há número configurado. */
export function whatsappUrl(text: string): string | null {
  const number = profile.contacts.whatsapp.replace(/\D/g, "");
  if (!number) return null;
  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
}
