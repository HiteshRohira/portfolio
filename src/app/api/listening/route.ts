import { NextResponse } from "next/server";
import { addSong, videoIdFromMusicUrl, visibleSongs } from "@/lib/listening";
import { hasListeningStore, readListeningSongs, writeListeningSongs } from "@/lib/listening-store";
import { songFromVideoId } from "@/lib/youtube-music";

export const runtime = "nodejs";

export async function GET() {
  try {
    const { songs } = await readListeningSongs();
    return NextResponse.json({ songs: visibleSongs(songs) }, {
      headers: { "Cache-Control": "public, max-age=0, s-maxage=60" },
    });
  } catch (error) {
    console.error("Could not read listening songs", error);
    return NextResponse.json({ error: "Songs are temporarily unavailable" }, { status: 503 });
  }
}

export async function POST(request: Request) {
  const expectedToken = process.env.LISTENING_SHORTCUT_TOKEN;
  if (!expectedToken || request.headers.get("authorization") !== `Bearer ${expectedToken}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!hasListeningStore()) {
    return NextResponse.json({ error: "Vercel Blob is not configured" }, { status: 503 });
  }

  let url: unknown;
  try {
    ({ url } = await request.json());
  } catch {
    return NextResponse.json({ error: "Expected a JSON body with a url" }, { status: 400 });
  }

  const videoId = typeof url === "string" ? videoIdFromMusicUrl(url) : null;
  if (!videoId) {
    return NextResponse.json({ error: "Share a YouTube Music song link" }, { status: 400 });
  }

  try {
    const song = await songFromVideoId(videoId);
    const { songs, etag } = await readListeningSongs();
    const updated = addSong(songs, song);
    await writeListeningSongs(updated, etag);
    return NextResponse.json({ song, songs: updated });
  } catch (error) {
    console.error("Could not add listening song", error);
    return NextResponse.json({ error: "Could not add this song" }, { status: 502 });
  }
}
