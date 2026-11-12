/**
 * Regras do formulário de contato. Usadas no navegador (retorno imediato)
 * e no servidor (fronteira de confiança) — os mesmos limites nos dois lados.
 */
export const LIMITS = { name: [2, 80], message: [10, 2000] } as const;
/** Envio mais rápido que isso (ms desde que o formulário apareceu) é tratado como robô. */
export const MIN_FILL_MS = 3000;

export type ContactValues = { name: string; email: string; message: string };
export type FieldErrorCode = "nameShort" | "nameLong" | "emailInvalid" | "messageShort" | "messageLong";
export type FieldErrors = Partial<Record<keyof ContactValues, FieldErrorCode>>;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validateContact(v: ContactValues): FieldErrors {
  const errors: FieldErrors = {};
  const name = v.name.trim();
  const message = v.message.trim();
  if (name.length < LIMITS.name[0]) errors.name = "nameShort";
  else if (name.length > LIMITS.name[1]) errors.name = "nameLong";
  if (!EMAIL.test(v.email.trim()) || v.email.length > 254) errors.email = "emailInvalid";
  if (message.length < LIMITS.message[0]) errors.message = "messageShort";
  else if (message.length > LIMITS.message[1]) errors.message = "messageLong";
  return errors;
}

export type ContactState =
  | { status: "idle" }
  | { status: "invalid"; errors: FieldErrors }
  | { status: "error" };
