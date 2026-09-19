import { describe, expect, it, vi } from "vitest";
import { createDriveClient, DriveError, resolveRootFolderId } from "@/lib/klauzula/drive";

type Folder = { id: string; name: string; parent: string; createdTime: string };
type File = { id: string; name: string; parent: string; description: string; mimeType: string; size: number };
type Call = { method: string; url: URL; body?: unknown };

/** In-memory stand-in for the parts of Drive v3 the client uses. */
function fakeDrive(options: { onFolderCreated?: (folders: Folder[]) => void; failWith?: number[] } = {}) {
  const folders: Folder[] = [];
  const files: File[] = [];
  const calls: Call[] = [];
  const failures = [...(options.failWith ?? [])];
  let seq = 0;

  const reply = (body: unknown, status = 200) =>
    new Response(status === 204 ? null : JSON.stringify(body), { status });

  const fetchFn = (async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = new URL(String(input));
    const method = init?.method ?? "GET";
    calls.push({ method, url, body: init?.body });

    const failure = failures.shift();
    if (failure) return reply({ error: "boom" }, failure);

    if (method === "GET" && url.pathname === "/drive/v3/files") {
      const q = url.searchParams.get("q") ?? "";
      const name = q.match(/name='((?:\\.|[^'\\])*)'/)?.[1].replace(/\\(.)/g, "$1");
      const parent = q.match(/(?:^| and )'((?:\\.|[^'\\])*)' in parents/)?.[1].replace(/\\(.)/g, "$1");
      const matching = folders
        .filter((f) => f.name === name && f.parent === parent)
        .sort((a, b) => a.createdTime.localeCompare(b.createdTime));
      return reply({ files: matching });
    }
    if (method === "POST" && url.pathname === "/drive/v3/files") {
      const meta = JSON.parse(String(init?.body));
      const folder: Folder = {
        id: `folder-${++seq}`,
        name: meta.name,
        parent: meta.parents[0],
        createdTime: new Date(1_000_000 + seq * 1000).toISOString(),
      };
      folders.push(folder);
      options.onFolderCreated?.(folders);
      return reply({ id: folder.id });
    }
    if (method === "POST" && url.pathname === "/upload/drive/v3/files") {
      const raw = Buffer.from(init?.body as Buffer);
      const meta = JSON.parse(
        raw.toString("utf8").match(/Content-Type: application\/json; charset=UTF-8\r\n\r\n([\s\S]*?)\r\n--/)![1]
      );
      const file: File = {
        id: `file-${++seq}`,
        name: meta.name,
        parent: meta.parents[0],
        description: meta.description,
        mimeType: meta.mimeType,
        size: raw.length,
      };
      files.push(file);
      return reply({ id: file.id });
    }
    if (method === "DELETE") {
      const id = url.pathname.split("/").pop()!;
      folders.splice(folders.findIndex((f) => f.id === id), 1);
      return reply(null, 204);
    }
    return reply({ error: "unhandled" }, 500);
  }) as typeof fetch;

  return { folders, files, calls, fetchFn };
}

const ROOT = "root-folder";
const pdf = new Uint8Array([0x25, 0x50, 0x44, 0x46, 0x2d, 1, 2, 3]);
const input = (personName: string, fileStamp = "2026-09-19_1432") => ({
  rootFolderId: ROOT,
  personName,
  fileStamp,
  pdf,
  description: "Wersja klauzuli: wersja z 19.09.2026. Zgoda marketingowa: nie.",
});

function client(drive: ReturnType<typeof fakeDrive>, getAccessToken = vi.fn(async () => "token")) {
  return { drive: createDriveClient({ getAccessToken, fetch: drive.fetchFn }), getAccessToken };
}

describe("Drive archive", () => {
  it("creates the client's folder and uploads the PDF into it", async () => {
    const fake = fakeDrive();
    const result = await client(fake).drive.saveClauseFile(input("Zażółć Gęślą"));

    expect(result.folderName).toBe("Zażółć Gęślą");
    expect(result.fileName).toBe("Klauzula RODO - Zażółć Gęślą - 2026-09-19_1432.pdf");
    expect(fake.folders).toEqual([expect.objectContaining({ name: "Zażółć Gęślą", parent: ROOT })]);
    expect(fake.files).toEqual([
      expect.objectContaining({
        name: "Klauzula RODO - Zażółć Gęślą - 2026-09-19_1432.pdf",
        parent: fake.folders[0].id,
        mimeType: "application/pdf",
        description: "Wersja klauzuli: wersja z 19.09.2026. Zgoda marketingowa: nie.",
      }),
    ]);
  });

  it("reuses an existing folder instead of creating a duplicate", async () => {
    const fake = fakeDrive();
    const { drive } = client(fake);
    await drive.saveClauseFile(input("Jan Kowalski", "2026-09-19_1000"));
    await drive.saveClauseFile(input("Jan Kowalski", "2026-09-19_1100"));

    expect(fake.folders).toHaveLength(1);
    expect(fake.files.map((f) => f.parent)).toEqual([fake.folders[0].id, fake.folders[0].id]);
  });

  it("signing again creates a NEW file — it never overwrites or updates", async () => {
    const fake = fakeDrive();
    const { drive } = client(fake);
    await drive.saveClauseFile(input("Jan Kowalski", "2026-09-19_1000"));
    await drive.saveClauseFile(input("Jan Kowalski", "2026-09-19_1000")); // even the same minute

    expect(fake.files).toHaveLength(2);
    const methods = new Set(fake.calls.map((c) => c.method));
    expect([...methods].sort()).toEqual(["GET", "POST"]);
    expect(fake.calls.some((c) => /PATCH|PUT/.test(c.method))).toBe(false);
  });

  it("handles apostrophes: the query is escaped and the same folder is found again", async () => {
    const fake = fakeDrive();
    const { drive } = client(fake);
    await drive.saveClauseFile(input("Patrick O'Brien", "2026-09-19_1000"));
    await drive.saveClauseFile(input("Patrick O'Brien", "2026-09-19_1100"));

    expect(fake.folders).toHaveLength(1);
    expect(fake.folders[0].name).toBe("Patrick O'Brien");
    const queries = fake.calls.filter((c) => c.method === "GET").map((c) => c.url.searchParams.get("q")!);
    expect(queries.every((q) => q.includes("name='Patrick O\\'Brien'"))).toBe(true);
  });

  it("cannot be injected into through a crafted name", async () => {
    const fake = fakeDrive();
    await client(fake).drive.saveClauseFile(input("x' or name contains '"));
    const q = fake.calls.find((c) => c.method === "GET")!.url.searchParams.get("q")!;
    expect(q).toContain("name='x\\' or name contains \\''");
    expect(fake.folders).toHaveLength(1);
  });

  it("sanitises unsafe characters and limits the length of names", async () => {
    const fake = fakeDrive();
    const result = await client(fake).drive.saveClauseFile(input(`Jan/Kowalski:*?"<>|${"a".repeat(300)}`));
    expect(result.folderName).not.toMatch(/[\\/:*?"<>|]/);
    expect(result.folderName.length).toBeLessThanOrEqual(100);
    expect(result.fileName.length).toBeLessThanOrEqual(204);
    expect(result.fileName.endsWith("2026-09-19_1432.pdf")).toBe(true);
  });

  it("resolves a concurrent duplicate by keeping the oldest folder", async () => {
    const fake = fakeDrive({
      onFolderCreated: (folders) => {
        // another request created the same folder slightly earlier
        if (folders.length === 1) {
          folders.push({ id: "folder-older", name: folders[0].name, parent: ROOT, createdTime: new Date(1).toISOString() });
        }
      },
    });
    const result = await client(fake).drive.saveClauseFile(input("Jan Kowalski"));

    expect(result.folderId).toBe("folder-older");
    expect(fake.calls.some((c) => c.method === "DELETE")).toBe(true);
    expect(fake.folders.map((f) => f.id)).toEqual(["folder-older"]);
    expect(fake.files[0].parent).toBe("folder-older");
  });

  it("refreshes the access token once after a 401", async () => {
    const fake = fakeDrive({ failWith: [401] });
    const getAccessToken = vi.fn(async (force?: boolean) => (force ? "fresh" : "stale"));
    await client(fake, getAccessToken).drive.saveClauseFile(input("Jan Kowalski"));

    expect(getAccessToken).toHaveBeenCalledWith(false);
    expect(getAccessToken).toHaveBeenCalledWith(true);
    expect(fake.files).toHaveLength(1);
  });

  it("surfaces Drive failures as DriveError without leaking details", async () => {
    const fake = fakeDrive({ failWith: [500] });
    await expect(client(fake).drive.saveClauseFile(input("Jan Kowalski"))).rejects.toMatchObject({
      name: "DriveError",
      status: 500,
    });
    const network = createDriveClient({
      getAccessToken: async () => "t",
      fetch: (async () => {
        throw new Error("socket hang up token=abc");
      }) as typeof fetch,
    });
    const error = await network.saveClauseFile(input("Jan Kowalski")).catch((e) => e);
    expect(error).toBeInstanceOf(DriveError);
    expect(error.message).not.toContain("token=abc");
  });

  it("rejects a name that is empty after sanitising", async () => {
    const fake = fakeDrive();
    await expect(client(fake).drive.saveClauseFile(input("///"))).rejects.toBeInstanceOf(DriveError);
    expect(fake.calls).toHaveLength(0);
  });
});

describe("resolveRootFolderId", () => {
  it("uses the TEST folder by default", () => {
    expect(resolveRootFolderId({ KLAUZULA_DRIVE_FOLDER_ID: "prod", KLAUZULA_DRIVE_FOLDER_ID_TEST: "test" } as never)).toBe("test");
  });

  it("uses the production folder only when explicitly switched", () => {
    expect(
      resolveRootFolderId({ KLAUZULA_DRIVE_TARGET: "prod", KLAUZULA_DRIVE_FOLDER_ID: "prod", KLAUZULA_DRIVE_FOLDER_ID_TEST: "test" } as never)
    ).toBe("prod");
    expect(
      resolveRootFolderId({ KLAUZULA_DRIVE_TARGET: "PROD ", KLAUZULA_DRIVE_FOLDER_ID: "prod", KLAUZULA_DRIVE_FOLDER_ID_TEST: "test" } as never)
    ).toBe("test");
  });

  it("fails clearly when the chosen folder is not configured", () => {
    expect(() => resolveRootFolderId({} as never)).toThrow(/KLAUZULA_DRIVE_FOLDER_ID_TEST/);
    expect(() => resolveRootFolderId({ KLAUZULA_DRIVE_TARGET: "prod" } as never)).toThrow(/KLAUZULA_DRIVE_FOLDER_ID is not/);
  });
});
