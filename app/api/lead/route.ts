import { NextRequest, NextResponse } from "next/server";
import { writeClient } from "@/sanity/lib/writeClient";

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Nieprawidłowe dane." }, { status: 400 });
  }

  const { name, phone, email, interest, marketingConsent, consentRequired } = body as Record<
    string,
    unknown
  >;

  if (
    typeof name !== "string" ||
    !name.trim() ||
    typeof phone !== "string" ||
    !phone.trim() ||
    !consentRequired
  ) {
    return NextResponse.json({ error: "Brak wymaganych danych." }, { status: 400 });
  }

  const lead = {
    name: name.trim().slice(0, 200),
    phone: phone.trim().slice(0, 60),
    email: typeof email === "string" ? email.trim().slice(0, 200) : "",
    interest: typeof interest === "string" ? interest.trim().slice(0, 200) : "",
    marketingConsent: !!marketingConsent,
  };

  await writeClient.create({
    _type: "leadSubmission",
    ...lead,
    status: "Nowe",
  });

  // Best-effort mirror to Google Sheets — Sanity above is the source of
  // truth, so a failure here must not fail the whole submission.
  const sheetsWebhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
  if (sheetsWebhookUrl) {
    try {
      await fetch(sheetsWebhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...lead,
          consentRequired: !!consentRequired,
          secret: process.env.GOOGLE_SHEETS_WEBHOOK_SECRET,
        }),
      });
    } catch (err) {
      console.error("Failed to mirror lead to Google Sheets:", err);
    }
  }

  return NextResponse.json({ ok: true });
}
