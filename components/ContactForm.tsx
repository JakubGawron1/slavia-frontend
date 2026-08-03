"use client";

import { FormEvent, useId, useState } from "react";
import { useSubmitContact } from "@/lib/api/generated/contact/contact";
import { useToast } from "@/components/toast/ToastProvider";

type FormState = "idle" | "submitting" | "success" | "error";

const PHONE_CODES = [
  { code: "+48", label: "PL +48" },
  { code: "+49", label: "DE +49" },
  { code: "+420", label: "CZ +420" },
  { code: "+421", label: "SK +421" },
  { code: "+43", label: "AT +43" },
  { code: "+44", label: "UK +44" },
] as const;

const fieldClass =
  "mt-1.5 w-full border border-paper/20 bg-chrome/40 px-3.5 py-2.5 text-sm text-paper outline-none transition-[border-color,background-color] placeholder:text-paper/35 focus:border-brand focus:bg-chrome/60 disabled:opacity-60";

const labelClass =
  "font-display text-[0.65rem] tracking-[0.16em] text-paper/65 uppercase";

export function ContactForm() {
  const toast = useToast();
  const nameId = useId();
  const emailId = useId();
  const phoneId = useId();
  const phoneCodeId = useId();
  const subjectId = useId();
  const bodyId = useId();
  const errorId = useId();
  const successId = useId();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneCode, setPhoneCode] = useState("+48");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [state, setState] = useState<FormState>("idle");
  const [error, setError] = useState<string | null>(null);

  const submitMutation = useSubmitContact();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const digits = phoneNumber.replace(/[\s\-()]/g, "");
    const trimmedSubject = subject.trim();
    const trimmedBody = body.trim();

    if (trimmedName.length < 2) {
      setState("error");
      setError("Podaj imię i nazwisko.");
      toast.error("Formularz", "Podaj imię i nazwisko.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setState("error");
      setError("Podaj poprawny adres e-mail.");
      toast.error("Formularz", "Podaj poprawny adres e-mail.");
      return;
    }
    if (digits.length < 6) {
      setState("error");
      setError("Podaj poprawny numer telefonu.");
      toast.error("Formularz", "Podaj poprawny numer telefonu.");
      return;
    }
    if (!trimmedSubject) {
      setState("error");
      setError("Podaj tytuł wiadomości.");
      toast.error("Formularz", "Podaj tytuł wiadomości.");
      return;
    }
    if (!trimmedBody) {
      setState("error");
      setError("Podaj treść wiadomości.");
      toast.error("Formularz", "Podaj treść wiadomości.");
      return;
    }

    setState("submitting");

    try {
      await submitMutation.mutateAsync({
        data: {
          name: trimmedName,
          email: trimmedEmail,
          phone: `${phoneCode} ${digits}`,
          subject: trimmedSubject,
          body: trimmedBody,
        },
      });
      setName("");
      setEmail("");
      setPhoneCode("+48");
      setPhoneNumber("");
      setSubject("");
      setBody("");
      setState("success");
      toast.success("Wysłano wiadomość", "Odpowiemy tak szybko, jak to możliwe.");
    } catch (err) {
      setState("error");
      const msg =
        err instanceof Error
          ? err.message
          : "Nie udało się wysłać wiadomości. Spróbuj ponownie.";
      setError(msg);
      toast.error("Wysyłanie", msg);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="animate-rise-delay-1 w-full"
      noValidate
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor={nameId} className={labelClass}>
            Imię i nazwisko
          </label>
          <input
            id={nameId}
            name="name"
            type="text"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={state === "submitting"}
            className={fieldClass}
            placeholder="Jan Kowalski"
          />
        </div>

        <div>
          <label htmlFor={emailId} className={labelClass}>
            Adres e-mail
          </label>
          <input
            id={emailId}
            name="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={state === "submitting"}
            className={fieldClass}
            placeholder="jan@example.com"
          />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor={phoneId} className={labelClass}>
            Nr telefonu
          </label>
          <div className="mt-1.5 flex items-stretch gap-2">
            <label htmlFor={phoneCodeId} className="sr-only">
              Numer kierunkowy
            </label>
            <select
              id={phoneCodeId}
              name="phone_code"
              value={phoneCode}
              onChange={(e) => setPhoneCode(e.target.value)}
              disabled={state === "submitting"}
              className="h-[2.625rem] shrink-0 border border-paper/20 bg-chrome/40 px-2.5 text-sm text-paper outline-none focus:border-brand disabled:opacity-60"
            >
              {PHONE_CODES.map((item) => (
                <option key={item.code} value={item.code}>
                  {item.label}
                </option>
              ))}
            </select>
            <input
              id={phoneId}
              name="phone"
              type="tel"
              autoComplete="tel-national"
              inputMode="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              disabled={state === "submitting"}
              className="h-[2.625rem] w-full border border-paper/20 bg-chrome/40 px-3.5 text-sm text-paper outline-none transition-[border-color,background-color] placeholder:text-paper/35 focus:border-brand focus:bg-chrome/60 disabled:opacity-60"
              placeholder="500 123 456"
            />
          </div>
        </div>

        <div className="sm:col-span-2">
          <label htmlFor={subjectId} className={labelClass}>
            Tytuł wiadomości
          </label>
          <input
            id={subjectId}
            name="subject"
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            disabled={state === "submitting"}
            className={fieldClass}
            placeholder="Chcę dołączyć do klubu"
          />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor={bodyId} className={labelClass}>
            Treść wiadomości
          </label>
          <textarea
            id={bodyId}
            name="body"
            rows={4}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            disabled={state === "submitting"}
            className={`${fieldClass} resize-y`}
            placeholder="Napisz, w czym możemy pomóc…"
          />
        </div>
      </div>

      {error ? (
        <p
          id={errorId}
          role="alert"
          className="mt-4 border-l-2 border-brand bg-brand/10 px-3 py-2.5 text-sm leading-relaxed text-paper/90"
        >
          {error}
        </p>
      ) : null}

      {state === "success" ? (
        <p
          id={successId}
          role="status"
          className="mt-4 border-l-2 border-paper/40 bg-paper/5 px-3 py-2.5 text-sm leading-relaxed text-paper/90"
        >
          Wiadomość wysłana. Kadra odebrała ją w skrzynce — skontaktujemy się w
          razie potrzeby.
        </p>
      ) : null}

      <button
        type="submit"
        disabled={state === "submitting"}
        className="mt-5 bg-brand px-6 py-2.5 font-display text-xs tracking-[0.14em] text-paper uppercase transition-colors hover:bg-brand-deep disabled:cursor-wait disabled:opacity-70"
      >
        {state === "submitting" ? "Wysyłanie…" : "Wyślij wiadomość"}
      </button>
    </form>
  );
}
