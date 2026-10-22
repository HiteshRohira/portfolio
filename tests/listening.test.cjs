const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { test } = require("node:test");
const ts = require("typescript");
const { BlobPreconditionFailedError } = require("@vercel/blob");

// Compile the actual TS modules in memory so tests need no extra runtime package.
function loadModule(entry, overrides = {}, globals = {}) {
  const cache = new Map();
  function load(name) {
    if (Object.hasOwn(overrides, name)) return overrides[name];
    if (!name.startsWith("@/")) return require(name);
    const resolved = path.resolve(__dirname, "../src", name.slice(2));
    if (resolved.endsWith(".json")) return require(resolved);
    const file = resolved + ".ts";
    if (cache.has(file)) return cache.get(file).exports;
    const module = { exports: {} };
    cache.set(file, module);
    const code = ts.transpileModule(fs.readFileSync(file, "utf8"), {
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
    }).outputText;
    vm.runInNewContext(code, {
      module, exports: module.exports, require: load, process,
      URL, Request, Response, AbortSignal, fetch,
      console: { warn() {}, error() {} }, ...globals,
    }, { filename: file });
    return module.exports;
  }
  return load(entry);
}

const ids = ["CvlWnG1yiyQ", "IaLk90h1-oo"];
const fixtures = ids.map((id) => require(`./fixtures/${id}.json`));
const publicMetadata = {
  title: "Nafrat", author_name: "Darshan Raval - Topic",
  thumbnail_url: "https://i.ytimg.com/vi/CvlWnG1yiyQ/hqdefault.jpg",
};
const song = {
  videoId: ids[0], title: "Nafrat", artist: "Darshan Raval", album: null,
  artworkUrl: publicMetadata.thumbnail_url,
  url: `https://music.youtube.com/watch?v=${ids[0]}`,
  sharedAt: new Date().toISOString(),
  expiresAt: new Date(Date.now() + 14 * 86400000).toISOString(),
};

test("both reported share links resolve full YouTube Music details", async () => {
  for (const [i, id] of ids.entries()) {
    const api = loadModule("@/lib/youtube-music", {}, {
      fetch: async () => Response.json(fixtures[i]),
    });
    const result = await api.songFromVideoId(id);
    assert.equal(result.videoId, id);
    assert.equal(result.title, ["Nafrat", "Barsaat"][i]);
    assert.equal(result.artist, ["Darshan Raval", "Banjaare, Roni"][i]);
    assert.equal(Date.parse(result.expiresAt) - Date.parse(result.sharedAt), 14 * 86400000);
    const listening = loadModule("@/lib/listening");
    assert.equal(listening.videoIdFromMusicUrl(`https://music.youtube.com/watch?v=${id}&si=share`), id);
  }
});

for (const failure of ["http", "timeout", "missing track", "incomplete track", "invalid json"]) {
  test(`public metadata saves the song after ${failure}`, async () => {
    const requests = [];
    const api = loadModule("@/lib/youtube-music", {}, {
      fetch: async (url) => {
        requests.push(String(url));
        if (requests.length === 1) {
          if (failure === "http") return new Response("Forbidden", { status: 403 });
          if (failure === "timeout") throw new DOMException("Timeout", "TimeoutError");
          if (failure === "invalid json") return new Response("<html>blocked</html>");
          return Response.json(failure === "missing track" ? {} : {
            contents: { singleColumnMusicWatchNextResultsRenderer: { tabbedRenderer: {
              watchNextTabbedResultsRenderer: { tabs: [{ tabRenderer: { content: {
                musicQueueRenderer: { content: { playlistPanelRenderer: {
                  contents: [{ playlistPanelVideoRenderer: { videoId: ids[0] } }],
                } } },
              } } }] },
            } } },
          });
        }
        return Response.json(publicMetadata);
      },
    });
    const result = await api.songFromVideoId(ids[0]);
    assert.equal(result.title, "Nafrat");
    assert.equal(result.artist, "Darshan Raval");
    assert.equal(result.album, null);
    assert.equal(result.url, song.url);
    assert.equal(new URL(requests[1]).hostname, "www.youtube.com");
    assert.equal(new URL(requests[1]).searchParams.get("url"), `https://www.youtube.com/watch?v=${ids[0]}`);
  });
}

test("finds the requested song after another queue entry", async () => {
  const fixture = structuredClone(fixtures[0]);
  const contents = fixture.contents.singleColumnMusicWatchNextResultsRenderer.tabbedRenderer
    .watchNextTabbedResultsRenderer.tabs[0].tabRenderer.content.musicQueueRenderer.content
    .playlistPanelRenderer.contents;
  contents.unshift({ playlistPanelVideoRenderer: { videoId: ids[1], title: { runs: [{ text: "Wrong song" }] } } });
  let requests = 0;
  const api = loadModule("@/lib/youtube-music", {}, {
    fetch: async () => { requests++; return Response.json(fixture); },
  });
  assert.equal((await api.songFromVideoId(ids[0])).title, "Nafrat");
  assert.equal(requests, 1);
});

test("rejects failed or incomplete fallback metadata", async () => {
  for (const fallback of [new Response("Blocked", { status: 403 }), Response.json({ title: "Nafrat" })]) {
    let requests = 0;
    const api = loadModule("@/lib/youtube-music", {}, {
      fetch: async () => ++requests === 1 ? new Response(null, { status: 403 }) : fallback,
    });
    await assert.rejects(api.songFromVideoId(ids[0]));
  }
});

test("a conflicting save re-reads the latest list and retains both songs", async () => {
  let reads = 0;
  const writes = [];
  const other = { ...song, videoId: ids[1], title: "Barsaat" };
  const store = loadModule("@/lib/listening-store", {
    "@vercel/blob": {
      BlobPreconditionFailedError,
      get: async () => ({
        statusCode: 200, blob: { etag: `version-${++reads}` },
        stream: Response.json(reads === 1 ? [] : [other]).body,
      }),
      put: async (_path, body, options) => {
        writes.push({ songs: JSON.parse(body), etag: options.ifMatch });
        if (writes.length === 1) throw new BlobPreconditionFailedError();
      },
    },
  }, { process: { env: { BLOB_STORE_ID: "test-store" } } });
  const saved = await store.saveListeningSong(song);
  assert.equal(saved.length, 2);
  assert.deepEqual(writes.map((write) => write.etag), ["version-1", "version-2"]);
  assert.deepEqual(new Set(writes[1].songs.map((item) => item.videoId)), new Set(ids));
});

test("save retries are bounded and unrelated storage failures are not retried", async () => {
  for (const conflict of [true, false]) {
    let writes = 0;
    const store = loadModule("@/lib/listening-store", {
      "@vercel/blob": {
        BlobPreconditionFailedError,
        get: async () => ({ statusCode: 200, blob: { etag: "version" }, stream: Response.json([]).body }),
        put: async () => { writes++; throw conflict ? new BlobPreconditionFailedError() : new Error("Storage down"); },
      },
    }, { process: { env: { BLOB_STORE_ID: "test-store" } } });
    await assert.rejects(store.saveListeningSong(song));
    assert.equal(writes, conflict ? 3 : 1);
  }
});

test("route distinguishes metadata failures, storage failures, and success", async () => {
  for (const outcome of ["metadata failure", "storage failure", "success"]) {
    let saves = 0;
    const route = loadModule("@/app/api/listening/route", {
      "@/lib/youtube-music": { songFromVideoId: async () => {
        if (outcome === "metadata failure") throw new Error("Upstream down");
        return song;
      } },
      "@/lib/listening-store": {
        hasListeningStore: () => true,
        saveListeningSong: async () => {
          saves++;
          if (outcome === "storage failure") throw new Error("Storage down");
          return [song];
        },
      },
    }, { process: { env: { LISTENING_SHORTCUT_TOKEN: "test-token" } } });
    const response = await route.POST(new Request("https://example.com/api/listening", {
      method: "POST", headers: { Authorization: "Bearer test-token" },
      body: JSON.stringify({ url: song.url }),
    }));
    assert.equal(response.status, outcome === "metadata failure" ? 502 : outcome === "storage failure" ? 503 : 200);
    assert.equal(saves, outcome === "metadata failure" ? 0 : 1);
  }
});
