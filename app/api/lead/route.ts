import { NextRequest, NextResponse } from "next/server";
import { writeClient } from "@/sanity/lib/writeClient";

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Nieprawidłowe dane." }, { status: 400 });
  }

  const { name, phone, interest, marketingConsent, consentRequired } = body as Record<
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

  await writeClient.create({
    _type: "leadSubmission",
    name: name.trim().slice(0, 200),
    phone: phone.trim().slice(0, 60),
    interest: typeof interest === "string" ? interest.trim().slice(0, 200) : "",
    marketingConsent: !!marketingConsent,
    status: "Nowe",
  });

  return NextResponse.json({ ok: true });
}
