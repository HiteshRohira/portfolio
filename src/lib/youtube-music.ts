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

function getTrack(payload: unknown): MusicTrack | null {
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
    if (track?.videoId) return track;
  }

  return null;
}

function isMusicArtist(run: MusicRun) {
  return run.navigationEndpoint?.browseEndpoint?.browseEndpointContextSupportedConfigs
    ?.browseEndpointContextMusicConfig?.pageType === "MUSIC_PAGE_TYPE_ARTIST";
}

export async function songFromVideoId(videoId: string): Promise<ListeningSong> {
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
    signal: AbortSignal.timeout(10000),
    cache: "no-store",
  });

  if (!response.ok) throw new Error("YouTube Music metadata request failed");

  const track = getTrack(await response.json());
  if (!track || track.videoId !== videoId) throw new Error("This link is not a playable YouTube Music song");

  const title = track.title?.runs?.map((run) => run.text ?? "").join("").trim();
  const runs = track.longBylineText?.runs ?? [];
  const artists = runs.filter(isMusicArtist).map((run) => run.text?.trim()).filter(Boolean);
  const album = runs.find((run) => run.navigationEndpoint?.browseEndpoint
    ?.browseEndpointContextSupportedConfigs?.browseEndpointContextMusicConfig?.pageType === "MUSIC_PAGE_TYPE_ALBUM")?.text ?? null;
  const artworkUrl = track.thumbnail?.thumbnails?.toSorted((a, b) => (b.width ?? 0) - (a.width ?? 0))[0]?.url;

  if (!title || artists.length === 0 || !artworkUrl) {
    throw new Error("YouTube Music did not return complete song details");
  }

  const sharedAt = new Date();
  return {
    videoId,
    title,
    artist: artists.join(", "),
    album,
    artworkUrl,
    url: `https://music.youtube.com/watch?v=${videoId}`,
    sharedAt: sharedAt.toISOString(),
    expiresAt: new Date(sharedAt.getTime() + SONG_LIFETIME_MS).toISOString(),
  };
}
