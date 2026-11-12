"use server";

import { redirect } from "next/navigation";
import { MIN_FILL_MS, validateContact, type ContactState } from "@/lib/contact-form";
import { hasLocale } from "@/lib/i18n";
import { sendContactEmail } from "@/lib/mailer";

const text = (form: FormData, key: string) => {
  const value = form.get(key);
  return typeof value === "string" ? value : "";
};

/** Recebe o formulário de contato. Revalida tudo: nada do navegador é confiável. */
export async function sendContact(_prev: ContactState, form: FormData): Promise<ContactState> {
  const raw = text(form, "lang");
  const lang = hasLocale(raw) ? raw : "pt";
  const values = { name: text(form, "name"), email: text(form, "email"), message: text(form, "message") };

  // Anti-spam: campo armadilha preenchido ou envio rápido demais → finge sucesso, não envia.
  // Sem JS o `t` fica 0: aí só a armadilha vale (não descartamos mensagem de gente de verdade).
  const startedAt = Number(text(form, "t")) || 0;
  const tooFast = startedAt > 0 && Date.now() - startedAt < MIN_FILL_MS;
  const bot = text(form, "website") !== "" || tooFast;
  if (bot) redirect(`/${lang}/thanks`);

  const errors = validateContact(values);
  if (Object.keys(errors).length) return { status: "invalid", errors };

  const result = await sendContactEmail({
    name: values.name.trim(),
    email: values.email.trim(),
    message: values.message.trim(),
  });
  if (result !== "sent") return { status: "error" };

  // `?sent=1` só no envio real: o robô descartado acima não conta como lead no Analytics.
  redirect(`/${lang}/thanks?sent=1`);
}
