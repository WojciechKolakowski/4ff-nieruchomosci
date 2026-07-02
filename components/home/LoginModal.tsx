"use client";

import { useState } from "react";
import { useLoginModal } from "./LoginModalProvider";

export function LoginModal() {
  const { isOpen, close } = useLoginModal();
  const [tab, setTab] = useState<"login" | "register">("login");
  const [submitted, setSubmitted] = useState(false);

  return (
    <div
      className={`modal-backdrop${isOpen ? " open" : ""}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <div className="modal-box">
        <button className="modal-close" onClick={close} aria-label="Zamknij">
          ✕
        </button>
        <h3>Wcześniejszy dostęp 4FF VIP</h3>
        <p className="sub">
          Zaloguj się lub załóż darmowe konto, by zobaczyć oferty 7 dni przed publikacją.
        </p>
        <div className="modal-tabs">
          <button className={tab === "login" ? "active" : undefined} onClick={() => setTab("login")}>
            Logowanie
          </button>
          <button
            className={tab === "register" ? "active" : undefined}
            onClick={() => setTab("register")}
          >
            Rejestracja
          </button>
        </div>
        {submitted ? (
          <p>Dziękujemy! Funkcja logowania zostanie podłączona wkrótce.</p>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSubmitted(true);
            }}
          >
            <div className="field">
              <label htmlFor="m-email">E-mail</label>
              <input id="m-email" type="email" placeholder="jan@przyklad.pl" required />
            </div>
            <div className="field">
              <label htmlFor="m-pass">Hasło</label>
              <input id="m-pass" type="password" placeholder="••••••••" required />
            </div>
            <button
              type="submit"
              className="btn btn-gold"
              style={{ width: "100%", justifyContent: "center", marginTop: "8px" }}
            >
              Zaloguj się
            </button>
            <p className="rodo-note">
              Zakładając konto akceptujesz{" "}
              <a href="#" style={{ color: "var(--gold-dark)" }}>
                Regulamin
              </a>{" "}
              i{" "}
              <a href="#" style={{ color: "var(--gold-dark)" }}>
                Politykę prywatności
              </a>
              .
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
