"use client";

import { useActionState, useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { sendContact } from "@/app/[lang]/actions";
import { validateContact, type ContactState, type ContactValues, type FieldErrors } from "@/lib/contact-form";
import type { Dictionary, Locale } from "@/lib/i18n";

type Props = { lang: Locale; dict: Dictionary["form"]; title: string };

const FIELDS = ["name", "email", "message"] as const;

/** Formulário de contato: valida no navegador, revalida no servidor e nunca perde o texto digitado. */
export function ContactForm({ lang, dict, title }: Props) {
  const [state, action, pending] = useActionState<ContactState, FormData>(sendContact, { status: "idle" });
  const [values, setValues] = useState<ContactValues>({ name: "", email: "", message: "" });
  const [clientErrors, setClientErrors] = useState<FieldErrors | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const startedAt = useRef(0);

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  const errors: FieldErrors = clientErrors ?? (state.status === "invalid" ? state.errors : {});
  const hasErrors = Object.keys(errors).length > 0;

  // Depois de uma resposta com erro, leva o foco ao primeiro campo inválido.
  useEffect(() => {
    if (state.status !== "invalid") return;
    const first = FIELDS.find((f) => state.errors[f]);
    if (first) formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
  }, [state]);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    const found = validateContact(values);
    if (Object.keys(found).length) {
      e.preventDefault();
      setClientErrors(found);
      const first = FIELDS.find((f) => found[f]);
      if (first) e.currentTarget.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    setClientErrors(null);
    const t = e.currentTarget.elements.namedItem("t") as HTMLInputElement;
    t.value = String(startedAt.current);
  };

  const update = (field: keyof ContactValues) => (e: { target: { value: string } }) => {
    setValues((v) => ({ ...v, [field]: e.target.value }));
    if (clientErrors?.[field]) setClientErrors({ ...clientErrors, [field]: undefined });
  };

  const field = (name: keyof ContactValues, label: string, input: ReactNode) => (
    <div className="field" data-invalid={errors[name] ? true : undefined}>
      <label htmlFor={`contact-${name}`}>{label}</label>
      {input}
      {errors[name] && (
        <p id={`contact-${name}-error`} className="field-error">
          {dict.errors[errors[name]!]}
        </p>
      )}
    </div>
  );
  const aria = (name: keyof ContactValues) => ({
    id: `contact-${name}`,
    name,
    "aria-invalid": errors[name] ? true : undefined,
    "aria-describedby": errors[name] ? `contact-${name}-error` : undefined,
    value: values[name],
    onChange: update(name),
    disabled: pending,
  });

  return (
    <form ref={formRef} className="contact-form dialog-frame" action={action} onSubmit={onSubmit} noValidate>
      <h3 className="subhead">{title}</h3>

      <div role="alert" className="form-alerts">
        {hasErrors && <p className="form-summary">{dict.summary}</p>}
        {state.status === "error" && !clientErrors && <p className="form-general">{dict.general}</p>}
      </div>

      <input type="hidden" name="lang" value={lang} />
      <input type="hidden" name="t" defaultValue="0" />
      {/* Armadilha para robôs: invisível para pessoas e leitores de tela. */}
      <div className="hp" aria-hidden="true">
        <label htmlFor="contact-website">Website</label>
        <input id="contact-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="field-row">
        {field("name", dict.name, <input type="text" autoComplete="name" maxLength={120} {...aria("name")} />)}
        {field("email", dict.email, <input type="email" autoComplete="email" inputMode="email" maxLength={254} {...aria("email")} />)}
      </div>
      {field("message", dict.message, <textarea rows={5} maxLength={2400} {...aria("message")} />)}

      <button type="submit" className="btn btn-primary" disabled={pending} aria-live="polite">
        {pending ? (
          <>
            <span className="spinner" aria-hidden="true" /> {dict.sending}
          </>
        ) : (
          dict.send
        )}
      </button>
    </form>
  );
}
