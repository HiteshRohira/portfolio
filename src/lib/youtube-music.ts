import type { ListeningSong } from "@/lib/listening";
import { SONG_LIFETIME_MS } from "@/lib/listening";

type MusicRun = {
  text?: string;
  navigationEndpoint?: {
    browseEndpoint?: {
      browseEndpointContextSupportedConfigs?: {
        browseEndpointContextMusicConfig?: { pageType?: string };
      };
    };
  };
};

type MusicTrack = {
  videoId?: string;
  title?: { runs?: MusicRun[] };
  longBylineText?: { runs?: MusicRun[] };
  thumbnail?: { thumbnails?: { url?: string; width?: number }[] };
};

function getTrack(payload: unknown, videoId: string): MusicTrack | null {
  const data = payload as {
    contents?: { singleColumnMusicWatchNextResultsRenderer?: {
      tabbedRenderer?: { watchNextTabbedResultsRenderer?: { tabs?: unknown[] } };
    } };
  };
  const tabs = data?.contents?.singleColumnMusicWatchNextResultsRenderer?.tabbedRenderer
    ?.watchNextTabbedResultsRenderer?.tabs;
  const firstTab = tabs?.[0] as { tabRenderer?: { content?: { musicQueueRenderer?: {
    content?: { playlistPanelRenderer?: { contents?: unknown[] } };
  } } } } | undefined;
  const contents = firstTab?.tabRenderer?.content?.musicQueueRenderer?.content
    ?.playlistPanelRenderer?.contents;

  if (!Array.isArray(contents)) return null;

  for (const item of contents) {
    const entry = item as { playlistPanelVideoRenderer?: MusicTrack; playlistPanelVideoWrapperRenderer?: {
      primaryRenderer?: { playlistPanelVideoRenderer?: MusicTrack };
    } };
    const track = entry?.playlistPanelVideoRenderer ?? entry?.playlistPanelVideoWrapperRenderer
      ?.primaryRenderer?.playlistPanelVideoRenderer;
    if (track?.videoId === videoId) return track;
  }

  return null;
}

function isMusicArtist(run: MusicRun) {
  return run.navigationEndpoint?.browseEndpoint?.browseEndpointContextSupportedConfigs
    ?.browseEndpointContextMusicConfig?.pageType === "MUSIC_PAGE_TYPE_ARTIST";
}

async function musicDetails(videoId: string) {
  const clientVersion = `1.${new Date().toISOString().slice(0, 10).replaceAll("-", "")}.01.00`;
  const response = await fetch("https://music.youtube.com/youtubei/v1/next?prettyPrint=false", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Origin: "https://music.youtube.com",
    },
    body: JSON.stringify({
      context: { client: { clientName: "WEB_REMIX", clientVersion }, user: {} },
      enablePersistentPlaylistPanel: true,
      isAudioOnly: true,
      tunerSettingValue: "AUTOMIX_SETTING_NORMAL",
      videoId,
      playlistId: `RDAMVM${videoId}`,
      watchEndpointMusicSupportedConfigs: {
        watchEndpointMusicConfig: {
          hasPersistentPlaylistPanel: true,
          musicVideoType: "MUSIC_VIDEO_TYPE_ATV",
        },
      },
    }),
    signal: AbortSignal.timeout(5000),
    cache: "no-store",
  });

  if (!response.ok) throw new Error(`YouTube Music metadata request failed (${response.status})`);

  const track = getTrack(await response.json(), videoId);
  if (!track) throw new Error("This link is not a playable YouTube Music song");

  const title = track.title?.runs?.map((run) => run.text ?? "").join("").trim();
  const runs = track.longBylineText?.runs ?? [];
  const artists = runs.filter(isMusicArtist).map((run) => run.text?.trim()).filter(Boolean);
  const album = runs.find((run) => run.navigationEndpoint?.browseEndpoint
    ?.browseEndpointContextSupportedConfigs?.browseEndpointContextMusicConfig?.pageType === "MUSIC_PAGE_TYPE_ALBUM")?.text ?? null;
  const artworkUrl = track.thumbnail?.thumbnails?.toSorted((a, b) => (b.width ?? 0) - (a.width ?? 0))[0]?.url;

  if (!title || artists.length === 0 || !artworkUrl) {
    throw new Error("YouTube Music did not return complete song details");
  }

  return { title, artist: artists.join(", "), album, artworkUrl };
}

async function publicDetails(videoId: string) {
  // YouTube Music's internal API can reject datacenter requests. oEmbed is a
  // separate public metadata endpoint and does not require playback access.
  const url = new URL("https://www.youtube.com/oembed");
  url.searchParams.set("url", `https://www.youtube.com/watch?v=${videoId}`);
  url.searchParams.set("format", "json");
  const response = await fetch(url, {
    signal: AbortSignal.timeout(5000),
    cache: "no-store",
  });
  if (!response.ok) throw new Error(`YouTube public metadata request failed (${response.status})`);

  const data = await response.json() as {
    title?: unknown; author_name?: unknown; thumbnail_url?: unknown;
  };
  const title = typeof data.title === "string" ? data.title.trim() : "";
  const artist = typeof data.author_name === "string"
    ? data.author_name.replace(/ - Topic$/, "").trim() : "";
  const artworkUrl = typeof data.thumbnail_url === "string" ? data.thumbnail_url.trim() : "";
  if (!title || !artist || !artworkUrl.startsWith("https://")) {
    throw new Error("YouTube did not return complete song details");
  }

  return { title, artist, album: null, artworkUrl };
}

export async function songFromVideoId(videoId: string): Promise<ListeningSong> {
  let details;
  try {
    details = await musicDetails(videoId);
  } catch (error) {
    console.warn("YouTube Music metadata unavailable; trying public metadata", { videoId, error });
    details = await publicDetails(videoId);
  }

  const sharedAt = new Date();
  return {
    ...details,
    videoId,
    url: `https://music.youtube.com/watch?v=${videoId}`,
    sharedAt: sharedAt.toISOString(),
    expiresAt: new Date(sharedAt.getTime() + SONG_LIFETIME_MS).toISOString(),
  };
}
