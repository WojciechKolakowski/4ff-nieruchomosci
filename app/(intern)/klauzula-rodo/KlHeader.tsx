"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

/** Top bar of the internal page; shows "Wyloguj" once signed in. */
export function KlHeader({ signedIn = false }: { signedIn?: boolean }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function logout() {
    if (busy) return;
    if (!window.confirm("Wylogować? Niezapisane dane formularza zostaną utracone.")) return;
    setBusy(true);
    try {
      await fetch("/api/klauzula-rodo/logout", { method: "POST" });
    } finally {
      // Drop the page's in-memory state completely (client data must not linger).
      window.location.reload();
      router.refresh();
    }
  }

  return (
    <header className="kl-header">
      <div className="kl-header-inner">
        <Image src="/logo.png" alt="4FF Nieruchomości" width={48} height={48} className="kl-logo" priority />
        <span className="kl-header-title">Klauzula RODO</span>
        {signedIn && (
          <button type="button" className="kl-header-btn" onClick={logout} disabled={busy}>
            Wyloguj
          </button>
        )}
      </div>
    </header>
  );
}
