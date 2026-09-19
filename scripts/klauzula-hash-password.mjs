#!/usr/bin/env node
// Generates the values for the password gate of /klauzula-rodo.
//
//   node scripts/klauzula-hash-password.mjs            # asks for the password (hidden), prints KLAUZULA_PASSWORD_HASH
//   node scripts/klauzula-hash-password.mjs --secret   # prints a random KLAUZULA_SESSION_SECRET
//
// Only the hash is ever stored (Vercel env / .env.local); the password itself is not.
// Format: scrypt:N:r:p:salt:hash (base64url, no "$" — safe in .env files).

import { randomBytes, scrypt } from "node:crypto";
import { pathToFileURL } from "node:url";
import readline from "node:readline";

const N = 16384;
const R = 8;
const P = 1;
const KEY_LENGTH = 64;
export const MIN_PASSWORD_LENGTH = 12;

export function hashPassword(password) {
  return new Promise((resolve, reject) => {
    const salt = randomBytes(16);
    scrypt(password, salt, KEY_LENGTH, { N, r: R, p: P }, (error, key) => {
      if (error) return reject(error);
      resolve(["scrypt", N, R, P, salt.toString("base64url"), key.toString("base64url")].join(":"));
    });
  });
}

export function generateSecret() {
  return randomBytes(48).toString("base64url");
}

function askHidden(question) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: true });
    let muted = false;
    const write = rl._writeToOutput;
    rl._writeToOutput = (text) => {
      if (!muted) write.call(rl, text);
      else if (/[\r\n]/.test(text)) rl.output.write("\n");
    };
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer);
    });
    muted = true;
  });
}

async function main() {
  if (process.argv.includes("--secret")) {
    console.log(`KLAUZULA_SESSION_SECRET=${generateSecret()}`);
    return;
  }

  const password = await askHidden("Nowe hasło (min. 12 znaków): ");
  if (password.length < MIN_PASSWORD_LENGTH) {
    console.error(`Hasło musi mieć co najmniej ${MIN_PASSWORD_LENGTH} znaków.`);
    process.exit(1);
  }
  if (password !== (await askHidden("Powtórz hasło: "))) {
    console.error("Hasła nie są takie same.");
    process.exit(1);
  }
  console.log("\nWklej do zmiennych środowiskowych (Vercel → Settings → Environment Variables, oraz .env.local):\n");
  console.log(`KLAUZULA_PASSWORD_HASH=${await hashPassword(password)}\n`);
  console.log("Po zmianie na Vercelu wykonaj Redeploy. Hasło nie jest nigdzie zapisane — tylko jego skrót.");
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
