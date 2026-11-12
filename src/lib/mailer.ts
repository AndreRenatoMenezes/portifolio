import { createHash } from "node:crypto";
import type { ContactValues } from "@/lib/contact-form";

export type SendResult = "sent" | "unconfigured" | "failed";

const RESEND_URL = "https://api.resend.com/emails";

/**
 * Entrega a mensagem do formulário por e-mail via API REST do Resend (spec 002, WP-05).
 * Variáveis: RESEND_API_KEY (criada pela integração da Vercel — ACOES-PENDENTES T4),
 * CONTACT_TO e CONTACT_FROM. Sem elas retorna "unconfigured" e o formulário mostra o erro geral.
 */
export async function sendContactEmail(values: ContactValues): Promise<SendResult> {
  const { RESEND_API_KEY, CONTACT_TO, CONTACT_FROM } = process.env;
  if (!RESEND_API_KEY || !CONTACT_TO || !CONTACT_FROM) {
    console.warn("[contato] envio desligado: faltam RESEND_API_KEY, CONTACT_TO ou CONTACT_FROM");
    return "unconfigured";
  }

  const name = values.name.replace(/\s+/g, " ");
  // Mesmo conteúdo reenviado (duplo clique, retry) em até 24 h não gera e-mail duplicado.
  const idempotencyKey = createHash("sha256").update(`${values.email}\n${values.message}`).digest("hex");

  try {
    const res = await fetch(RESEND_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
        "Idempotency-Key": idempotencyKey,
      },
      body: JSON.stringify({
        from: CONTACT_FROM,
        to: CONTACT_TO,
        reply_to: values.email,
        subject: `Portfólio: mensagem de ${name}`,
        // Só texto puro: nada do que o visitante escreveu vira HTML.
        text: `Nome: ${name}\nE-mail: ${values.email}\n\n${values.message}\n\n— enviado pelo formulário do portfólio`,
      }),
      signal: AbortSignal.timeout(10_000),
    });
    if (res.ok) return "sent";
    console.error(`[contato] Resend respondeu ${res.status}: ${(await res.text()).slice(0, 300)}`);
    return "failed";
  } catch (error) {
    console.error("[contato] falha ao chamar o Resend:", error instanceof Error ? error.message : error);
    return "failed";
  }
}
