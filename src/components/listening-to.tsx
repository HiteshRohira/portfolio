"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight, Music2 } from "lucide-react";
import { type ListeningSong, visibleSongs } from "@/lib/listening";

export function ListeningTo() {
  const [songs, setSongs] = useState<ListeningSong[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [loadFailed, setLoadFailed] = useState(false);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    let active = true;

    fetch("/api/listening")
      .then((response) => {
        if (!response.ok) throw new Error("Could not load songs");
        return response.json();
      })
      .then((data: { songs: ListeningSong[] }) => {
        if (active) setSongs(data.songs);
      })
      .catch(() => {
        if (active) setLoadFailed(true);
      })
      .finally(() => {
        if (active) setLoaded(true);
      });

    return () => { active = false; };
  }, []);

  useEffect(() => {
    const nextExpiry = songs
      .map((song) => Date.parse(song.expiresAt))
      .filter((expiry) => expiry > now)
      .sort((a, b) => a - b)[0];

    if (!nextExpiry) return;
    const timer = setTimeout(() => setNow(Date.now()), nextExpiry - now + 25);
    return () => clearTimeout(timer);
  }, [songs, now]);

  const currentSongs = visibleSongs(songs, now);

  return (
    <div className="space-y-4">
      <div>
        <h2 id="listening-title" className="text-xl font-bold">
          Listening to
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Songs I can&apos;t get out of my head right now
        </p>
      </div>

      <div aria-live="polite" aria-busy={!loaded}>
        {currentSongs.length > 0 ? (
          <ul className="divide-y divide-border/70">
            {currentSongs.map((song, index) => (
              <li key={song.videoId}>
                <a
                  href={song.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex min-w-0 items-center gap-3 py-2.5 first:pt-0 last:pb-0"
                  aria-label={`Listen to ${song.title} by ${song.artist} on YouTube Music`}
                >
                  <span className="w-5 shrink-0 text-[10px] tabular-nums text-muted-foreground/50">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="size-12 shrink-0 overflow-hidden rounded-md border border-border/70 bg-muted">
                    <img src={song.artworkUrl} alt="" className="size-full object-cover" loading="lazy" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium leading-snug transition-colors group-hover:text-foreground/70">
                      {song.title}
                    </span>
                    <span className="mt-0.5 block truncate text-xs text-muted-foreground" title={song.artist}>
                      {song.artist}
                    </span>
                  </span>
                  <ArrowUpRight aria-hidden="true" className="size-3.5 shrink-0 text-muted-foreground/40 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground" />
                </a>
              </li>
            ))}
          </ul>
        ) : loadFailed ? (
          <div className="flex min-h-16 items-center gap-2 text-xs text-muted-foreground/70">
            <Music2 aria-hidden="true" className="size-4" />
            Couldn&apos;t load songs right now.
          </div>
        ) : loaded ? (
          <div className="flex min-h-16 items-center gap-2 text-xs text-muted-foreground/70">
            <Music2 aria-hidden="true" className="size-4" />
            A new rotation is on its way.
          </div>
        ) : (
          <div className="h-32 animate-pulse rounded-md bg-muted/50" />
        )}
      </div>
    </div>
  );
}
