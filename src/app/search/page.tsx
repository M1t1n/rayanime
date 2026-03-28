import { prisma } from "@/lib/prisma";
import { searchAnime, jikanToDb } from "@/lib/jikan";
import AnimeCard from "@/components/AnimeCard";

export const dynamic = "force-dynamic";

export default async function SearchPage({ searchParams }: { searchParams: { q?: string; genre?: string } }) {
  const query = searchParams.q?.trim();
  const genre = searchParams.genre?.trim();

  let anime: any[] = [];

  if (query) {
    // Search Jikan API and upsert results into our DB
    const jikanResults = await searchAnime(query);
    for (const a of jikanResults) {
      await prisma.anime.upsert({
        where: { malId: a.mal_id },
        create: jikanToDb(a),
        update: jikanToDb(a),
      });
    }
    anime = await prisma.anime.findMany({
      where: { title: { contains: query, mode: "insensitive" } },
      orderBy: { score: "desc" },
      take: 30,
    });
  } else if (genre) {
    anime = await prisma.anime.findMany({
      where: { genres: { has: genre } },
      orderBy: { score: "desc" },
      take: 30,
    });
  } else {
    anime = await prisma.anime.findMany({
      orderBy: { score: "desc" },
      take: 30,
    });
  }

  // Get genres for discovery
  const allAnime = await prisma.anime.findMany({ select: { genres: true } });
  const genreSet = new Set(allAnime.flatMap((a) => a.genres));
  const genres = Array.from(genreSet).sort();

  return (
    <div className="animate-fade-in space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">
          {query ? `Results for "${query}"` : genre ? `Genre: ${genre}` : "Browse Anime"}
        </h1>
        <p className="mt-1 text-sm text-text-secondary">
          {anime.length} anime found
        </p>
      </div>

      {/* Search */}
      <form action="/search" method="GET">
        <input
          type="text"
          name="q"
          defaultValue={query}
          placeholder="Search anime by title..."
          className="w-full max-w-md rounded-lg border border-white/10 bg-bg-tertiary px-4 py-2.5 text-sm text-text-primary placeholder-text-muted outline-none transition focus:border-accent-primary/50"
        />
      </form>

      {/* Genre tags */}
      {genres.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {genres.map((g) => (
            <a
              key={g}
              href={`/search?genre=${encodeURIComponent(g)}`}
              className={`rounded-full px-3 py-1 text-xs transition ${
                genre === g
                  ? "bg-accent-primary text-white"
                  : "bg-bg-tertiary text-text-secondary hover:bg-bg-tertiary/80"
              }`}
            >
              {g}
            </a>
          ))}
        </div>
      )}

      {/* Results */}
      {anime.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {anime.map((a: any) => (
            <AnimeCard
              key={a.id}
              id={a.id}
              title={a.title}
              coverImage={a.coverImage}
              score={a.score}
              genres={a.genres}
              year={a.year}
            />
          ))}
        </div>
      ) : (
        <p className="text-sm text-text-muted">
          {query ? "No results found. Try a different search term." : "No anime in the database yet. Search for something!"}
        </p>
      )}
    </div>
  );
}
