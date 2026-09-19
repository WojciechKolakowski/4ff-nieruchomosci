#!/usr/bin/env node
// One-time Google Drive authorisation for the "Klauzula RODO" archive.
//
//   node scripts/klauzula-google-setup.mjs                    # prints GOOGLE_OAUTH_REFRESH_TOKEN
//   node scripts/klauzula-google-setup.mjs --create-folders   # ...and creates the two root folders
//   node scripts/klauzula-google-setup.mjs --full-drive       # scope "drive" instead of "drive.file" (see README)
//
// Needs GOOGLE_OAUTH_CLIENT_ID and GOOGLE_OAUTH_CLIENT_SECRET (env or .env.local) of a
// "Desktop app" OAuth client. Sign in with the COMPANY Google account that will own the
// archive. Nothing is written to disk: copy the printed values into Vercel / .env.local.

import { createServer } from "node:http";
import { existsSync, readFileSync } from "node:fs";
import { randomBytes } from "node:crypto";
import { CodeChallengeMethod, OAuth2Client } from "google-auth-library";

const PORT = 53682;
const REDIRECT_URI = `http://127.0.0.1:${PORT}/callback`;
const args = new Set(process.argv.slice(2));
const SCOPE = args.has("--full-drive")
  ? "https://www.googleapis.com/auth/drive"
  : "https://www.googleapis.com/auth/drive.file";

function loadDotEnv(file = ".env.local") {
  if (!existsSync(file)) return;
  for (const line of readFileSync(file, "utf8").split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (match && process.env[match[1]] === undefined) process.env[match[1]] = match[2].replace(/^["']|["']$/g, "");
  }
}

function waitForCode(expectedState) {
  return new Promise((resolve, reject) => {
    const server = createServer((request, response) => {
      const url = new URL(request.url ?? "/", REDIRECT_URI);
      if (url.pathname !== "/callback") {
        response.writeHead(404).end();
        return;
      }
      const finish = (status, message, error) => {
        response.writeHead(status, { "Content-Type": "text/html; charset=utf-8" });
        response.end(`<!doctype html><meta charset="utf-8"><title>Klauzula RODO</title><p style="font:18px sans-serif;padding:40px">${message}</p>`);
        server.close();
        if (error) reject(error);
        else resolve(url.searchParams.get("code"));
      };
      if (url.searchParams.get("state") !== expectedState) return finish(400, "Nieprawidłowy parametr state.", new Error("state mismatch"));
      if (url.searchParams.get("error")) return finish(400, "Autoryzacja odrzucona.", new Error(url.searchParams.get("error")));
      if (!url.searchParams.get("code")) return finish(400, "Brak kodu autoryzacji.", new Error("no code"));
      finish(200, "Gotowe. Możesz zamknąć to okno i wrócić do terminala.");
    });
    server.on("error", reject);
    server.listen(PORT, "127.0.0.1");
  });
}

async function main() {
  loadDotEnv();
  const { GOOGLE_OAUTH_CLIENT_ID: clientId, GOOGLE_OAUTH_CLIENT_SECRET: clientSecret } = process.env;
  if (!clientId || !clientSecret) {
    console.error("Brak GOOGLE_OAUTH_CLIENT_ID / GOOGLE_OAUTH_CLIENT_SECRET (ustaw w .env.local lub w środowisku).");
    console.error("Patrz README-klauzula-rodo.md, część „Konfiguracja Google”.");
    process.exit(1);
  }

  const client = new OAuth2Client(clientId, clientSecret, REDIRECT_URI);
  const { codeVerifier, codeChallenge } = await client.generateCodeVerifierAsync();
  const state = randomBytes(16).toString("hex");
  const authUrl = client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent", // guarantees a refresh token
    scope: [SCOPE],
    state,
    code_challenge: codeChallenge,
    code_challenge_method: CodeChallengeMethod.S256,
  });

  console.log(`Zakres uprawnień: ${SCOPE}\n`);
  console.log("Otwórz ten adres w przeglądarce i zaloguj się kontem firmowym Google:\n");
  console.log(authUrl, "\n");
  console.log(`Czekam na autoryzację (nasłuch: ${REDIRECT_URI}) …`);

  const code = await waitForCode(state);
  const { tokens } = await client.getToken({ code, codeVerifier });
  if (!tokens.refresh_token) {
    console.error("Google nie zwrócił refresh tokena. Odbierz dostęp aplikacji na https://myaccount.google.com/permissions i uruchom skrypt ponownie.");
    process.exit(1);
  }
  client.setCredentials(tokens);

  console.log("\nDodaj do zmiennych środowiskowych (Vercel → Settings → Environment Variables oraz .env.local):\n");
  console.log(`GOOGLE_OAUTH_REFRESH_TOKEN=${tokens.refresh_token}\n`);

  if (args.has("--create-folders")) {
    // With the drive.file scope the app only sees folders it created itself,
    // so the root folders are created here, by the same OAuth client.
    for (const [variable, name] of [
      ["KLAUZULA_DRIVE_FOLDER_ID_TEST", "Klauzule RODO (TEST)"],
      ["KLAUZULA_DRIVE_FOLDER_ID", "Klauzule RODO"],
    ]) {
      const { data } = await client.request({
        url: "https://www.googleapis.com/drive/v3/files?fields=id",
        method: "POST",
        data: { name, mimeType: "application/vnd.google-apps.folder" },
      });
      console.log(`${variable}=${data.id}   # folder „${name}” na Dysku`);
    }
    console.log("\nFoldery leżą w Mój dysk konta, na które się zalogowano. Możesz je przenieść/udostępnić w Dysku Google.");
  }
}

main().catch((error) => {
  console.error("Błąd:", error.message);
  process.exit(1);
});
