import initialSongs from "@/data/listening-to.json";

export const MAX_SONGS = 5;
export const SONG_LIFETIME_MS = 14 * 24 * 60 * 60 * 1000;

export type ListeningSong = {
  videoId: string;
  title: string;
  artist: string;
  album: string | null;
  artworkUrl: string;
  url: string;
  sharedAt: string;
  expiresAt: string;
};

export const initialListeningSongs: ListeningSong[] = initialSongs;

export function visibleSongs(songs: ListeningSong[], now = Date.now()) {
  const seen = new Set<string>();

  return songs
    .toSorted((a, b) => Date.parse(b.sharedAt) - Date.parse(a.sharedAt))
    .filter((song) => {
      if (
        !song.videoId ||
        !song.title ||
        !song.artist ||
        !Number.isFinite(Date.parse(song.sharedAt)) ||
        !Number.isFinite(Date.parse(song.expiresAt)) ||
        Date.parse(song.expiresAt) <= now ||
        seen.has(song.videoId)
      ) {
        return false;
      }

      seen.add(song.videoId);
      return true;
    })
    .slice(0, MAX_SONGS);
}

export function addSong(songs: ListeningSong[], song: ListeningSong) {
  return visibleSongs([song, ...songs.filter((item) => item.videoId !== song.videoId)]);
}

export function videoIdFromMusicUrl(input: string) {
  let url: URL;

  try {
    url = new URL(input);
  } catch {
    return null;
  }

  if (url.protocol !== "https:" || url.hostname !== "music.youtube.com" || url.pathname !== "/watch") {
    return null;
  }

  const videoId = url.searchParams.get("v");
  return videoId && /^[\w-]{11}$/.test(videoId) ? videoId : null;
}
