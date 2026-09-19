"use client";

import { useEffect, useRef, useState } from "react";
import { Acknowledgement, ClauseView, ConsentHeader, ConsentStatement } from "@/components/klauzula/ClauseView";
import { SignaturePad } from "@/components/klauzula/SignaturePad";
import {
  exportSignaturePng,
  hasInk,
  sha256HexOfDataUrl,
  type Stroke,
} from "@/components/klauzula/signature-utils";
import { normalizeEmail, normalizePersonName, normalizePolishPhone } from "@/lib/klauzula/text";
import { CURRENT_VERSION } from "@/templates/klauzula-rodo";
import type { ChannelId } from "@/templates/klauzula-rodo/2026-09-19/content";
import { KlHeader } from "./KlHeader";

const version = CURRENT_VERSION;
const { content } = version;

type Step = 1 | 2 | 3 | 4;
type Signed = { dataUrl: string; hash: string; at: string; mac: string };
type Status = "idle" | "stamping" | "saving" | "done";
type Slot = 1 | 2;

const STEP_LABELS: Record<Step, string> = { 1: "Dane", 2: "Klauzula", 3: "Zgoda", 4: "Podsumowanie" };

async function postJson(url: string, body: unknown) {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = (await response.json().catch(() => null)) as Record<string, unknown> | null;
  return { ok: response.ok, status: response.status, data };
}

const formatWarsaw = (iso: string) =>
  new Date(iso).toLocaleString("pl-PL", {
    timeZone: "Europe/Warsaw",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

export function Wizard() {
  const [step, setStep] = useState<Step>(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [showErrors, setShowErrors] = useState(false);

  const [strokes1, setStrokes1] = useState<Stroke[]>([]);
  const [signed1, setSigned1] = useState<Signed | null>(null);

  const [channels, setChannels] = useState<ChannelId[]>([]);
  const [phone, setPhone] = useState("");
  const [strokes2, setStrokes2] = useState<Stroke[]>([]);
  const [signed2, setSigned2] = useState<Signed | null>(null);

  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [errorKind, setErrorKind] = useState<"session" | "version" | null>(null);
  const [result, setResult] = useState<{ folderName: string; fileName: string } | null>(null);

  const savingRef = useRef(false);
  const headingRef = useRef<HTMLHeadingElement>(null);

  // ── Derived validation (same rules the server applies) ────────────────
  const nameCheck = normalizePersonName(name);
  const emailCheck = normalizeEmail(email);
  const needsPhone = channels.includes("phone") || channels.includes("sms");
  const phoneCheck = phone.trim() ? normalizePolishPhone(phone) : null;
  const phoneOk = needsPhone ? phoneCheck?.ok === true : phoneCheck === null || phoneCheck.ok;
  const ink1 = hasInk(strokes1);
  const ink2 = hasInk(strokes2);
  const consentReady = channels.length === 0 || (phoneOk && ink2);
  const canSave = nameCheck.ok && emailCheck.ok && ink1 && signed1 !== null && consentReady && (channels.length === 0 || signed2 !== null);
  const busy = status === "stamping" || status === "saving";
  const dirty = name !== "" || email !== "" || strokes1.length > 0;

  // New step (or a new error message at the top): scroll up and move focus to the heading.
  useEffect(() => {
    window.scrollTo({ top: 0 });
    headingRef.current?.focus();
  }, [step, error, result]);

  // Client data lives only in memory; warn before it is thrown away unsaved.
  useEffect(() => {
    if (!dirty || status === "done") return;
    const warn = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty, status]);

  // ── Actions ───────────────────────────────────────────────────────────
  function fail(message: string, kind: "session" | "version" | null = null) {
    setError(message);
    setErrorKind(kind);
  }

  function changePad(slot: Slot, next: Stroke[]) {
    // Any change to the drawing invalidates the server stamp.
    if (slot === 1) {
      setStrokes1(next);
      setSigned1(null);
    } else {
      setStrokes2(next);
      setSigned2(null);
    }
  }

  /** Confirms a signature: renders the PNG and gets the server's timestamp for it. */
  async function ensureStamp(slot: Slot): Promise<boolean> {
    if ((slot === 1 ? signed1 : signed2) !== null) return true;
    setStatus("stamping");
    setError(null);
    try {
      const dataUrl = exportSignaturePng(slot === 1 ? strokes1 : strokes2);
      const hash = await sha256HexOfDataUrl(dataUrl);
      const response = await postJson("/api/klauzula-rodo/stamp", { slot, hash });
      if (!response.ok) {
        fail(
          (response.data?.error as string | undefined) ?? "Nie udało się zatwierdzić podpisu. Spróbuj ponownie.",
          response.status === 401 ? "session" : null
        );
        return false;
      }
      const stamp = { dataUrl, hash, at: response.data?.at as string, mac: response.data?.mac as string };
      if (slot === 1) setSigned1(stamp);
      else setSigned2(stamp);
      return true;
    } catch {
      fail("Brak połączenia z serwerem. Sprawdź internet i spróbuj ponownie.");
      return false;
    } finally {
      setStatus("idle");
    }
  }

  async function next() {
    if (busy) return;
    setError(null);
    setErrorKind(null);

    if (step === 1) {
      if (!nameCheck.ok || !emailCheck.ok) return setShowErrors(true);
      setShowErrors(false);
      return setStep(2);
    }
    if (step === 2) {
      if (!ink1) return;
      if (await ensureStamp(1)) setStep(3);
      return;
    }
    if (step === 3) {
      if (channels.length === 0) return setStep(4);
      if (!phoneOk || !ink2) return setShowErrors(true);
      setShowErrors(false);
      if (await ensureStamp(2)) setStep(4);
    }
  }

  function back() {
    if (busy || step === 1) return;
    setError(null);
    setErrorKind(null);
    setStep((step - 1) as Step);
  }

  /** "Pomiń": no consent — clears everything entered on the consent step. */
  function skipConsent() {
    if (busy) return;
    setChannels([]);
    setPhone("");
    setStrokes2([]);
    setSigned2(null);
    setShowErrors(false);
    setError(null);
    setStep(4);
  }

  function toggleChannel(id: ChannelId) {
    const nextChannels = channels.includes(id) ? channels.filter((c) => c !== id) : [...channels, id];
    setChannels(nextChannels);
    if (nextChannels.length === 0) {
      // Unchecking the last channel withdraws the consent form entirely.
      setPhone("");
      setStrokes2([]);
      setSigned2(null);
      setShowErrors(false);
    }
  }

  async function save() {
    if (savingRef.current || busy || !canSave || !signed1) return;
    savingRef.current = true;
    setStatus("saving");
    setError(null);
    setErrorKind(null);
    try {
      const response = await postJson("/api/klauzula-rodo/save", {
        versionId: version.id,
        name,
        email,
        signature1: { image: signed1.dataUrl, at: signed1.at, mac: signed1.mac },
        consent:
          channels.length && signed2
            ? {
                channels,
                phone: phone.trim() || undefined,
                signature2: { image: signed2.dataUrl, at: signed2.at, mac: signed2.mac },
              }
            : null,
      });

      if (response.ok) {
        setResult({
          folderName: String(response.data?.folderName ?? ""),
          fileName: String(response.data?.fileName ?? ""),
        });
        setStatus("done");
        return;
      }

      const message = (response.data?.error as string | undefined) ?? "Nie udało się zapisać. Spróbuj ponownie.";
      const field = response.data?.field as string | undefined;
      if (response.status === 401) fail(message, "session");
      else if (response.status === 409) fail(message, "version");
      else if (field === "signature1") {
        setSigned1(null);
        setStep(2);
        fail(message);
      } else if (field === "signature2") {
        setSigned2(null);
        setStep(3);
        fail(message);
      } else if (field === "name" || field === "email") {
        setStep(1);
        setShowErrors(true);
        fail(message);
      } else if (field === "phone" || field === "channels") {
        setStep(3);
        setShowErrors(true);
        fail(message);
      } else fail(message);
      setStatus("idle");
    } catch {
      fail("Brak połączenia z serwerem. Dane w formularzu zostały zachowane – spróbuj ponownie.");
      setStatus("idle");
    } finally {
      savingRef.current = false;
    }
  }

  function reset() {
    setStep(1);
    setName("");
    setEmail("");
    setShowErrors(false);
    setStrokes1([]);
    setSigned1(null);
    setChannels([]);
    setPhone("");
    setStrokes2([]);
    setSigned2(null);
    setError(null);
    setErrorKind(null);
    setResult(null);
    setStatus("idle");
  }

  // ── Rendering ─────────────────────────────────────────────────────────
  if (status === "done" && result) {
    return (
      <>
        <KlHeader signedIn />
        <main className="kl-main kl-main-narrow">
          <section className="kl-card kl-done" aria-live="polite">
            <div className="kl-done-icon" aria-hidden="true">✓</div>
            <h1 ref={headingRef} tabIndex={-1}>Zapisano</h1>
            <p>
              Dokument został zapisany na Dysku Google w folderze <strong>{result.folderName}</strong>.
            </p>
            <p className="kl-muted">{result.fileName}</p>
            <button type="button" className="kl-btn kl-btn-primary" onClick={reset}>
              Nowy klient
            </button>
          </section>
        </main>
      </>
    );
  }

  const primaryLabel =
    step === 4
      ? status === "saving"
        ? "Zapisywanie…"
        : "Zatwierdź i zapisz"
      : status === "stamping"
        ? "Zatwierdzanie podpisu…"
        : step === 3 && channels.length === 0
          ? "Dalej bez zgody"
          : "Dalej";
  const primaryDisabled =
    busy || (step === 2 && !ink1) || (step === 3 && channels.length > 0 && !consentReady) || (step === 4 && !canSave);

  return (
    <>
      <KlHeader signedIn />
      <main className="kl-main">
        <nav className="kl-steps" aria-label="Postęp">
          <p className="kl-steps-compact">
            Krok {step} z 4 · {STEP_LABELS[step]}
          </p>
          <ol>
            {([1, 2, 3, 4] as Step[]).map((s) => (
              <li key={s} className={s === step ? "is-current" : s < step ? "is-done" : ""} aria-current={s === step ? "step" : undefined}>
                <span className="kl-steps-num">{s < step ? "✓" : s}</span>
                <span className="kl-steps-label">{STEP_LABELS[s]}</span>
              </li>
            ))}
          </ol>
        </nav>

        {error && (
          <div className="kl-alert" role="alert">
            <p>{error}</p>
            {errorKind === "session" && (
              <button type="button" className="kl-btn kl-btn-secondary" onClick={() => window.location.reload()}>
                Zaloguj ponownie (dane formularza zostaną utracone)
              </button>
            )}
            {errorKind === "version" && (
              <button type="button" className="kl-btn kl-btn-secondary" onClick={() => window.location.reload()}>
                Odśwież stronę
              </button>
            )}
          </div>
        )}

        {step === 1 && (
          <form
            className="kl-card"
            noValidate
            autoComplete="off"
            onSubmit={(event) => {
              event.preventDefault();
              void next();
            }}
          >
            <h2 ref={headingRef} tabIndex={-1}>Dane klienta</h2>
            <p className="kl-muted">Wpisz dane klienta. Wszystkie pola są wymagane.</p>

            <label className="kl-field">
              <span>Imię i nazwisko</span>
              <input
                type="text"
                name="kl-client-name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                autoComplete="off"
                autoCapitalize="words"
                spellCheck={false}
                maxLength={100}
                aria-invalid={showErrors && !nameCheck.ok}
              />
              {showErrors && !nameCheck.ok && <em className="kl-error">{nameCheck.error}</em>}
            </label>

            <label className="kl-field">
              <span>E-mail</span>
              <input
                type="email"
                name="kl-client-email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="off"
                autoCapitalize="none"
                inputMode="email"
                spellCheck={false}
                maxLength={90}
                aria-invalid={showErrors && !emailCheck.ok}
              />
              {showErrors && !emailCheck.ok && <em className="kl-error">{emailCheck.error}</em>}
            </label>
          </form>
        )}

        {step === 2 && (
          <section className="kl-card kl-doc-card">
            <h2 className="kl-sr-only" ref={headingRef} tabIndex={-1}>Klauzula informacyjna RODO</h2>
            <ClauseView content={content} />
            <div className="kl-sign-block">
              <Acknowledgement content={content} />
              <SignaturePad
                strokes={strokes1}
                onChange={(next) => changePad(1, next)}
                label="Pole podpisu pod oświadczeniem o zapoznaniu się z klauzulą"
                disabled={busy}
              />
              <p className="kl-caption">{content.signatureCaption}</p>
              <p className="kl-muted kl-small">
                {ink1
                  ? "Data i godzina zostaną nadane automatycznie przez system po kliknięciu „Dalej”."
                  : "Podpis jest wymagany, aby przejść dalej."}
              </p>
            </div>
          </section>
        )}

        {step === 3 && (
          <section className="kl-card kl-doc-card">
            <h2 className="kl-sr-only" ref={headingRef} tabIndex={-1}>Zgoda na kontakt marketingowy</h2>
            <ConsentHeader content={content} />
            <ConsentStatement content={content} />

            <fieldset className="kl-channels">
              <legend className="kl-sr-only">Kanały kontaktu</legend>
              {content.consent.channels.map((channel) => (
                <label className="kl-check" key={channel.id}>
                  <input
                    type="checkbox"
                    checked={channels.includes(channel.id)}
                    onChange={() => toggleChannel(channel.id)}
                    disabled={busy}
                  />
                  <span>{channel.label}</span>
                </label>
              ))}
            </fieldset>
            <p className="kl-muted kl-small">
              Zaznaczenie kanału oznacza wyrażenie zgody o treści powyżej. Bez zaznaczenia zgoda nie jest udzielana.
            </p>

            {channels.length > 0 && (
              <div className="kl-sign-block">
                <label className="kl-field">
                  <span>Telefon{needsPhone ? "" : " (opcjonalnie)"}</span>
                  <input
                    type="tel"
                    name="kl-client-phone"
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                    autoComplete="off"
                    inputMode="tel"
                    placeholder="np. 505 644 440"
                    maxLength={30}
                    aria-invalid={showErrors && !phoneOk}
                  />
                  <small className="kl-muted">
                    {needsPhone
                      ? "Wymagany dla rozmowy telefonicznej i SMS/MMS."
                      : "Nie jest wymagany, gdy wybrano tylko e-mail."}
                  </small>
                  {showErrors && !phoneOk && (
                    <em className="kl-error">
                      {phoneCheck && !phoneCheck.ok
                        ? phoneCheck.error
                        : "Podaj numer telefonu (wymagany dla rozmowy telefonicznej i SMS/MMS)."}
                    </em>
                  )}
                </label>

                <p className="kl-nameline">
                  <span>{content.consent.nameLabel}</span> <strong>{nameCheck.ok ? nameCheck.value : name}</strong>
                </p>
                <SignaturePad
                  strokes={strokes2}
                  onChange={(next) => changePad(2, next)}
                  label="Pole podpisu pod zgodą na kontakt marketingowy"
                  disabled={busy}
                />
                <p className="kl-caption">{content.signatureCaption}</p>
                <p className="kl-muted kl-small">
                  {ink2
                    ? "Data i godzina zostaną nadane automatycznie przez system po kliknięciu „Dalej”."
                    : "Podpis jest wymagany do udzielenia zgody."}
                  {showErrors && !ink2 && <em className="kl-error"> Złóż podpis.</em>}
                </p>
              </div>
            )}
          </section>
        )}

        {step === 4 && (
          <section className="kl-card">
            <h2 ref={headingRef} tabIndex={-1}>Podsumowanie</h2>
            <p className="kl-muted">Sprawdź dane i zatwierdź. Dokument zostanie zapisany na Dysku Google.</p>

            <dl className="kl-summary">
              <div>
                <dt>Imię i nazwisko</dt>
                <dd>{nameCheck.ok ? nameCheck.value : name}</dd>
              </div>
              <div>
                <dt>E-mail</dt>
                <dd>{emailCheck.ok ? emailCheck.value : email}</dd>
              </div>
              <div>
                <dt>Klauzula informacyjna ({version.label})</dt>
                <dd>
                  Zapoznanie potwierdzone podpisem
                  {signed1 && (
                    <>
                      <br />
                      <span className="kl-muted">{formatWarsaw(signed1.at)} (Europe/Warsaw)</span>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img className="kl-sig-preview" src={signed1.dataUrl} alt="Podpis pod oświadczeniem" />
                    </>
                  )}
                </dd>
              </div>
              <div>
                <dt>Zgoda na kontakt marketingowy</dt>
                <dd>
                  {channels.length === 0 || !signed2 ? (
                    <strong>Nie udzielono</strong>
                  ) : (
                    <>
                      <strong>Udzielono</strong>:{" "}
                      {content.consent.channels
                        .filter((channel) => channels.includes(channel.id))
                        .map((channel) => channel.label)
                        .join(", ")}
                      {phoneCheck?.ok && (
                        <>
                          <br />
                          Telefon: {phoneCheck.value.pretty}
                        </>
                      )}
                      <br />
                      <span className="kl-muted">{formatWarsaw(signed2.at)} (Europe/Warsaw)</span>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img className="kl-sig-preview" src={signed2.dataUrl} alt="Podpis pod zgodą marketingową" />
                    </>
                  )}
                </dd>
              </div>
            </dl>
            <p className="kl-muted kl-small">Zgoda marketingowa jest dobrowolna i nie jest warunkiem zapisu dokumentu.</p>
          </section>
        )}
      </main>

      <div className="kl-actions">
        <div className="kl-actions-inner">
          {step > 1 && (
            <button type="button" className="kl-btn kl-btn-secondary" onClick={back} disabled={busy}>
              Wstecz
            </button>
          )}
          <span className="kl-spacer" />
          {step === 3 && (
            <button type="button" className="kl-btn kl-btn-secondary" onClick={skipConsent} disabled={busy}>
              Pomiń – nie wyrażam zgody
            </button>
          )}
          <button type="button" className="kl-btn kl-btn-primary" onClick={step === 4 ? save : next} disabled={primaryDisabled}>
            {primaryLabel}
          </button>
        </div>
      </div>
    </>
  );
}
