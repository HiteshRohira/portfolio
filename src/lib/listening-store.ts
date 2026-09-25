import { get, put } from "@vercel/blob";
import { initialListeningSongs, type ListeningSong } from "@/lib/listening";

const BLOB_PATH = "listening-to.json";

export function hasListeningStore() {
  return Boolean(process.env.BLOB_STORE_ID || process.env.BLOB_READ_WRITE_TOKEN);
}

export async function readListeningSongs(): Promise<{ songs: ListeningSong[]; etag?: string }> {
  if (!hasListeningStore()) {
    return { songs: initialListeningSongs };
  }

  const result = await get(BLOB_PATH, { access: "private", useCache: false });
  if (!result || result.statusCode !== 200) {
    return { songs: initialListeningSongs };
  }

  const value: unknown = await new Response(result.stream).json();
  if (!Array.isArray(value)) throw new Error("Listening data is invalid");

  return { songs: value as ListeningSong[], etag: result.blob.etag };
}

export async function writeListeningSongs(songs: ListeningSong[], etag?: string) {
  if (!hasListeningStore()) {
    throw new Error("Vercel Blob is not configured");
  }

  await put(BLOB_PATH, JSON.stringify(songs), {
    access: "private",
    allowOverwrite: true,
    ifMatch: etag,
    contentType: "application/json",
    cacheControlMaxAge: 60,
  });
}
