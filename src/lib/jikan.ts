const JIKAN_BASE = "https://api.jikan.moe/v4";

export interface JikanAnime {
  mal_id: number;
  title: string;
  title_japanese: string | null;
  images: { jpg: { large_image_url: string } };
  synopsis: string | null;
  episodes: number | null;
  status: string | null;
  score: number | null;
  genres: { name: string }[];
  year: number | null;
  season: string | null;
}

export async function fetchTopAnime(page = 1): Promise<JikanAnime[]> {
  const res = await fetch(`${JIKAN_BASE}/top/anime?page=${page}&limit=25`, {
    next: { revalidate: 86400 },
  });
  const data = await res.json();
  return data.data ?? [];
}

export async function fetchAnimeById(malId: number): Promise<JikanAnime | null> {
  const res = await fetch(`${JIKAN_BASE}/anime/${malId}`, {
    next: { revalidate: 86400 },
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data.data ?? null;
}

export async function searchAnime(query: string): Promise<JikanAnime[]> {
  const res = await fetch(
    `${JIKAN_BASE}/anime?q=${encodeURIComponent(query)}&limit=20&sfw=true`,
    { next: { revalidate: 3600 } }
  );
  const data = await res.json();
  return data.data ?? [];
}

export function jikanToDb(a: JikanAnime) {
  return {
    malId: a.mal_id,
    title: a.title,
    titleJapanese: a.title_japanese,
    coverImage: a.images?.jpg?.large_image_url ?? null,
    synopsis: a.synopsis,
    episodes: a.episodes,
    status: a.status,
    score: a.score,
    genres: a.genres?.map((g) => g.name) ?? [],
    year: a.year,
    season: a.season,
  };
}
