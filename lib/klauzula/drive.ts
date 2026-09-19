import { OAuth2Client } from "google-auth-library";
import { escapeDriveQuery, sanitizeDriveName } from "./text";

/**
 * Minimal Google Drive v3 client (REST via fetch) for archiving the PDFs.
 *
 * Layout:  <root folder> / <Imię Nazwisko> / Klauzula RODO - <Imię Nazwisko> - RRRR-MM-DD_GGMM.pdf
 *
 *  - The subfolder is reused when it exists (never duplicated).
 *  - Files are always created, never updated or overwritten.
 *  - Names go through sanitizeDriveName; folder lookups are escaped, so an
 *    apostrophe (O'Brien) cannot break out of the `q` expression.
 *  - Auth is OAuth2 with a refresh token of one company Google account and the
 *    narrowest scope, drive.file (see README-klauzula-rodo.md).
 */

const API = "https://www.googleapis.com/drive/v3";
const UPLOAD = "https://www.googleapis.com/upload/drive/v3";
const FOLDER_MIME = "application/vnd.google-apps.folder";
const REQUEST_TIMEOUT_MS = 25_000;

export class DriveError extends Error {
  constructor(
    message: string,
    readonly status?: number
  ) {
    super(message);
    this.name = "DriveError";
  }
}

export type DriveDeps = {
  /** Returns a valid OAuth access token. `forceRefresh` is used after a 401. */
  getAccessToken: (forceRefresh?: boolean) => Promise<string>;
  fetch?: typeof fetch;
};

export type SaveInput = {
  rootFolderId: string;
  /** Client's display name — becomes the subfolder and part of the file name. */
  personName: string;
  /** "2026-09-19_1432" */
  fileStamp: string;
  pdf: Uint8Array;
  /** Stored as the Drive file description — must contain no personal data. */
  description: string;
};

export type SaveResult = { folderId: string; folderName: string; fileId: string; fileName: string };

export function createDriveClient({ getAccessToken, fetch: fetchImpl = fetch }: DriveDeps) {
  async function call(url: string, init: RequestInit = {}, retryAuth = true): Promise<Response> {
    const token = await getAccessToken(!retryAuth);
    let response: Response;
    try {
      response = await fetchImpl(url, {
        ...init,
        headers: { ...(init.headers as Record<string, string>), Authorization: `Bearer ${token}` },
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      });
    } catch {
      throw new DriveError("Drive request failed (network/timeout).");
    }
    if (response.status === 401 && retryAuth) return call(url, init, false);
    if (!response.ok) throw new DriveError(`Drive request failed with status ${response.status}.`, response.status);
    return response;
  }

  async function listFolders(name: string, parentId: string) {
    const q = [
      `mimeType='${FOLDER_MIME}'`,
      `name='${escapeDriveQuery(name)}'`,
      `'${escapeDriveQuery(parentId)}' in parents`,
      "trashed=false",
    ].join(" and ");
    const params = new URLSearchParams({
      q,
      fields: "files(id,name,createdTime)",
      orderBy: "createdTime",
      pageSize: "10",
      spaces: "drive",
      supportsAllDrives: "true",
      includeItemsFromAllDrives: "true",
    });
    const response = await call(`${API}/files?${params}`);
    const body = (await response.json()) as { files?: { id: string; name: string; createdTime?: string }[] };
    return body.files ?? [];
  }

  async function createFolder(name: string, parentId: string): Promise<string> {
    const response = await call(`${API}/files?supportsAllDrives=true&fields=id`, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=UTF-8" },
      body: JSON.stringify({ name, mimeType: FOLDER_MIME, parents: [parentId] }),
    });
    return ((await response.json()) as { id: string }).id;
  }

  /** Finds the client's subfolder or creates it; tolerates a concurrent duplicate. */
  async function findOrCreateFolder(name: string, parentId: string): Promise<string> {
    const existing = await listFolders(name, parentId);
    if (existing.length) return existing[0].id;

    const createdId = await createFolder(name, parentId);
    // Two saves for a brand-new client can race and both create the folder:
    // keep the oldest one and drop ours (it is still empty).
    const all = await listFolders(name, parentId);
    const oldest = all[0]?.id;
    if (oldest && oldest !== createdId) {
      try {
        await call(`${API}/files/${createdId}?supportsAllDrives=true`, { method: "DELETE" });
      } catch {
        // An empty duplicate folder is harmless; never fail the save over it.
      }
      return oldest;
    }
    return createdId;
  }

  async function uploadPdf(
    name: string,
    parentId: string,
    pdf: Uint8Array,
    description: string
  ): Promise<string> {
    const boundary = `klauzula-${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`;
    const metadata = JSON.stringify({ name, parents: [parentId], mimeType: "application/pdf", description });
    const body = Buffer.concat([
      Buffer.from(`--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n${metadata}\r\n`),
      Buffer.from(`--${boundary}\r\nContent-Type: application/pdf\r\n\r\n`),
      Buffer.from(pdf),
      Buffer.from(`\r\n--${boundary}--`),
    ]);
    const response = await call(`${UPLOAD}/files?uploadType=multipart&supportsAllDrives=true&fields=id`, {
      method: "POST",
      headers: { "Content-Type": `multipart/related; boundary=${boundary}` },
      body,
    });
    return ((await response.json()) as { id: string }).id;
  }

  async function saveClauseFile(input: SaveInput): Promise<SaveResult> {
    const folderName = sanitizeDriveName(input.personName, 100);
    const fileName = `${sanitizeDriveName(`Klauzula RODO - ${folderName} - ${input.fileStamp}`, 200)}.pdf`;
    if (!folderName) throw new DriveError("Empty folder name after sanitising.");

    const folderId = await findOrCreateFolder(folderName, input.rootFolderId);
    const fileId = await uploadPdf(fileName, folderId, input.pdf, input.description);
    return { folderId, folderName, fileId, fileName };
  }

  return { saveClauseFile };
}

// ── Production wiring ────────────────────────────────────────────────────

let oauthClient: OAuth2Client | undefined;

function getOAuthClient(): OAuth2Client {
  if (!oauthClient) {
    const { GOOGLE_OAUTH_CLIENT_ID, GOOGLE_OAUTH_CLIENT_SECRET, GOOGLE_OAUTH_REFRESH_TOKEN } = process.env;
    if (!GOOGLE_OAUTH_CLIENT_ID || !GOOGLE_OAUTH_CLIENT_SECRET || !GOOGLE_OAUTH_REFRESH_TOKEN) {
      throw new DriveError("Google OAuth environment variables are not configured.");
    }
    oauthClient = new OAuth2Client(GOOGLE_OAUTH_CLIENT_ID, GOOGLE_OAUTH_CLIENT_SECRET);
    oauthClient.setCredentials({ refresh_token: GOOGLE_OAUTH_REFRESH_TOKEN });
  }
  return oauthClient;
}

async function getProductionAccessToken(forceRefresh = false): Promise<string> {
  const client = getOAuthClient();
  try {
    if (forceRefresh) {
      const { credentials } = await client.refreshAccessToken();
      if (credentials.access_token) return credentials.access_token;
    } else {
      const { token } = await client.getAccessToken();
      if (token) return token;
    }
  } catch {
    // fall through to the generic error below (never include token details)
  }
  throw new DriveError("Could not obtain a Google access token.");
}

/**
 * Which root folder to write to. Defaults to the TEST folder; the production
 * folder is used only when KLAUZULA_DRIVE_TARGET=prod is set deliberately.
 */
export function resolveRootFolderId(env: NodeJS.ProcessEnv = process.env): string {
  const useProduction = env.KLAUZULA_DRIVE_TARGET === "prod";
  const id = useProduction ? env.KLAUZULA_DRIVE_FOLDER_ID : env.KLAUZULA_DRIVE_FOLDER_ID_TEST;
  if (!id) {
    throw new DriveError(
      useProduction
        ? "KLAUZULA_DRIVE_FOLDER_ID is not configured."
        : "KLAUZULA_DRIVE_FOLDER_ID_TEST is not configured."
    );
  }
  return id;
}

export function getDriveClient() {
  return createDriveClient({ getAccessToken: getProductionAccessToken });
}
