"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { KlHeader } from "./KlHeader";

export function LoginForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (busy || !password) return;
    setBusy(true);
    setError(null);
    try {
      const response = await fetch("/api/klauzula-rodo/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (response.ok) {
        setPassword("");
        router.refresh(); // the server now sees the session cookie and renders the form
        return;
      }
      const data = (await response.json().catch(() => null)) as { error?: string } | null;
      setError(data?.error ?? "Nie udało się zalogować. Spróbuj ponownie.");
    } catch {
      setError("Brak połączenia z serwerem. Sprawdź internet i spróbuj ponownie.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <KlHeader />
      <main className="kl-main kl-main-narrow">
        <form className="kl-card kl-login" onSubmit={submit} autoComplete="off">
          <h1>Klauzula RODO</h1>
          <p className="kl-muted">Strona wewnętrzna dla pracowników biura. Podaj hasło, aby kontynuować.</p>
          <label className="kl-field">
            <span>Hasło</span>
            <input
              type="password"
              name="klauzula-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              autoFocus
              required
              maxLength={200}
            />
          </label>
          {error && (
            <p className="kl-error" role="alert">
              {error}
            </p>
          )}
          <button type="submit" className="kl-btn kl-btn-primary" disabled={busy || !password}>
            {busy ? "Logowanie…" : "Zaloguj"}
          </button>
        </form>
      </main>
    </>
  );
}
