import type { Metadata } from "next";
import { getSession } from "@/lib/klauzula/auth";
import { LoginForm } from "./LoginForm";
import { Wizard } from "./Wizard";
import "./klauzula.css";

// Never indexed (the X-Robots-Tag header is set in next.config.ts as well),
// not in the sitemap, always rendered per request because it reads the session.
export const metadata: Metadata = {
  title: "Klauzula RODO – 4FF Nieruchomości",
  robots: { index: false, follow: false, nocache: true, noarchive: true, nosnippet: true },
};
export const dynamic = "force-dynamic";

export default async function KlauzulaRodoPage() {
  let signedIn = false;
  try {
    signedIn = (await getSession()) !== null;
  } catch {
    // KLAUZULA_SESSION_SECRET missing: fall through to the login form, whose
    // API answers with a clear "not configured" message.
    signedIn = false;
  }
  return signedIn ? <Wizard /> : <LoginForm />;
}
