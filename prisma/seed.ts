import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// Embedded seed dataset — no external API calls needed
const SEED_ANIME = [
  {
    malId: 5114,
    title: "Fullmetal Alchemist: Brotherhood",
    titleJapanese: "鋼の錬金術師 FULLMETAL ALCHEMIST",
    coverImage: "https://cdn.myanimelist.net/images/anime/1208/94745l.jpg",
    synopsis: "After a failed alchemical ritual leaves brothers Edward and Alphonse Elric with devastating consequences, they embark on a journey to find the Philosopher's Stone to restore their bodies.",
    episodes: 64,
    status: "Finished Airing",
    score: 9.1,
    genres: ["Action", "Adventure", "Drama", "Fantasy"],
    year: 2009,
    season: "spring",
  },
  {
    malId: 11061,
    title: "Hunter x Hunter (2011)",
    titleJapanese: "HUNTER×HUNTER(2011)",
    coverImage: "https://cdn.myanimelist.net/images/anime/1337/99013l.jpg",
    synopsis: "Gon Freecss discovers his absent father is a world-renowned Hunter. Setting out to become a Hunter himself, Gon encounters friends, rivals, and dark challenges along the way.",
    episodes: 148,
    status: "Finished Airing",
    score: 9.04,
    genres: ["Action", "Adventure", "Fantasy"],
    year: 2011,
    season: "fall",
  },
  {
    malId: 9253,
    title: "Steins;Gate",
    titleJapanese: "STEINS;GATE",
    coverImage: "https://cdn.myanimelist.net/images/anime/1935/127974l.jpg",
    synopsis: "Self-proclaimed mad scientist Rintarou Okabe accidentally discovers a method of time travel using a modified microwave. What starts as playful experimentation spirals into a desperate struggle against fate.",
    episodes: 24,
    status: "Finished Airing",
    score: 9.07,
    genres: ["Drama", "Sci-Fi", "Suspense"],
    year: 2011,
    season: "spring",
  },
  {
    malId: 16498,
    title: "Attack on Titan",
    titleJapanese: "進撃の巨人",
    coverImage: "https://cdn.myanimelist.net/images/anime/10/47347l.jpg",
    synopsis: "Centuries ago, mankind was slaughtered to near extinction by monstrous humanoid creatures called Titans. Eren Yeager vows to exterminate every Titan after witnessing the destruction of his hometown.",
    episodes: 25,
    status: "Finished Airing",
    score: 8.54,
    genres: ["Action", "Drama", "Suspense"],
    year: 2013,
    season: "spring",
  },
  {
    malId: 1535,
    title: "Death Note",
    titleJapanese: "デスノート",
    coverImage: "https://cdn.myanimelist.net/images/anime/9/9453l.jpg",
    synopsis: "A shinigami drops a notebook of death into the human world. High school genius Light Yagami finds it and decides to create a new world free of crime by killing criminals — but a mysterious detective known only as L is hot on his trail.",
    episodes: 37,
    status: "Finished Airing",
    score: 8.62,
    genres: ["Supernatural", "Suspense"],
    year: 2006,
    season: "fall",
  },
  {
    malId: 21,
    title: "One Punch Man",
    titleJapanese: "ワンパンマン",
    coverImage: "https://cdn.myanimelist.net/images/anime/12/76049l.jpg",
    synopsis: "Saitama is a hero who can defeat any opponent with a single punch. But being devastatingly powerful is actually kind of boring. Can he find an opponent who can give him a real fight?",
    episodes: 12,
    status: "Finished Airing",
    score: 8.5,
    genres: ["Action", "Comedy"],
    year: 2015,
    season: "fall",
  },
  {
    malId: 1,
    title: "Cowboy Bebop",
    titleJapanese: "カウボーイビバップ",
    coverImage: "https://cdn.myanimelist.net/images/anime/4/19644l.jpg",
    synopsis: "In 2071, the crew of the spaceship Bebop travel the solar system trying to catch bounties. Spike Spiegel, a laid-back bounty hunter with a deadly past, leads this ragtag team through stylish adventures.",
    episodes: 26,
    status: "Finished Airing",
    score: 8.75,
    genres: ["Action", "Award Winning", "Sci-Fi"],
    year: 1998,
    season: "spring",
  },
  {
    malId: 38000,
    title: "Demon Slayer",
    titleJapanese: "鬼滅の刃",
    coverImage: "https://cdn.myanimelist.net/images/anime/1286/99889l.jpg",
    synopsis: "After his family is slaughtered by demons and his sister Nezuko is turned into one, young Tanjiro Kamado sets out to become a demon slayer and find a cure for his sister.",
    episodes: 26,
    status: "Finished Airing",
    score: 8.45,
    genres: ["Action", "Fantasy"],
    year: 2019,
    season: "spring",
  },
  {
    malId: 5258,
    title: "Hajime no Ippo",
    titleJapanese: "はじめの一歩",
    coverImage: "https://cdn.myanimelist.net/images/anime/1490/172498l.jpg",
    synopsis: "Makunouchi Ippo is a shy high schooler who gets bullied constantly. After being saved by a boxer, he discovers a talent for the sport and begins his journey to become the Japanese featherweight champion.",
    episodes: 75,
    status: "Finished Airing",
    score: 8.74,
    genres: ["Comedy", "Drama", "Sports"],
    year: 2000,
    season: "fall",
  },
  {
    malId: 28977,
    title: "Gintama°",
    titleJapanese: "銀魂°",
    coverImage: "https://cdn.myanimelist.net/images/anime/3/72078l.jpg",
    synopsis: "Gintoki, Shinpachi, and Kagura continue their odd-jobs adventures in an Edo-period Japan conquered by aliens. Expect absurd comedy mixed with surprisingly emotional arcs.",
    episodes: 51,
    status: "Finished Airing",
    score: 9.06,
    genres: ["Action", "Comedy", "Sci-Fi"],
    year: 2015,
    season: "spring",
  },
];

async function main() {
  console.log("🌱 Seeding RayaNime database...\n");

  // 1. Demo users
  const hashed = await bcrypt.hash("password123", 12);
  const users = await Promise.all([
    prisma.user.upsert({
      where: { email: "sakura@rayanime.dev" },
      update: {},
      create: { email: "sakura@rayanime.dev", password: hashed, name: "Sakura", bio: "Anime enthusiast & reviewer" },
    }),
    prisma.user.upsert({
      where: { email: "naruto@rayanime.dev" },
      update: {},
      create: { email: "naruto@rayanime.dev", password: hashed, name: "Naruto Fan", bio: "Believe it!" },
    }),
    prisma.user.upsert({
      where: { email: "demo@rayanime.dev" },
      update: {},
      create: { email: "demo@rayanime.dev", password: hashed, name: "Demo User", bio: "Just exploring RayaNime" },
    }),
  ]);
  console.log(`✓ ${users.length} demo users`);

  // 2. Anime from embedded dataset
  const animeRecords = [];
  for (const a of SEED_ANIME) {
    const record = await prisma.anime.upsert({
      where: { malId: a.malId },
      update: {},
      create: a,
    });
    animeRecords.push(record);
  }
  console.log(`✓ ${animeRecords.length} anime`);

  // 3. Reviews
  const reviewTexts = [
    "An absolute masterpiece. Every episode kept me on the edge of my seat.",
    "Beautiful animation and compelling story. Must watch.",
    "Good but not great. The pacing could be better in the middle arc.",
    "One of the best anime I've ever seen. The character development is phenomenal.",
    "Solid entry in the genre. Enjoyable from start to finish.",
    "Exceeded all my expectations. The soundtrack alone is worth it.",
    "A bit overhyped but still a great watch overall.",
    "Incredible world-building and attention to detail.",
    "The ending hit me hard. Truly unforgettable.",
    "Peak fiction. Nothing else comes close.",
  ];

  let reviewCount = 0;
  for (let i = 0; i < animeRecords.length; i++) {
    const user = users[i % users.length];
    const anime = animeRecords[i];
    const rating = Math.floor(Math.random() * 4) + 7; // 7–10

    await prisma.review.upsert({
      where: { userId_animeId: { userId: user.id, animeId: anime.id } },
      update: {},
      create: { userId: user.id, animeId: anime.id, rating, content: reviewTexts[i % reviewTexts.length] },
    });
    reviewCount++;

    await prisma.watchedAnime.upsert({
      where: { userId_animeId: { userId: user.id, animeId: anime.id } },
      update: {},
      create: { userId: user.id, animeId: anime.id, status: "COMPLETED" },
    });

    if (rating >= 9) {
      await prisma.favorite.upsert({
        where: { userId_animeId: { userId: user.id, animeId: anime.id } },
        update: {},
        create: { userId: user.id, animeId: anime.id },
      });
    }
  }
  console.log(`✓ ${reviewCount} reviews + watched entries`);

  // 4. A sample list
  await prisma.list.create({
    data: {
      title: "All-Time Favorites",
      description: "The best anime ever made, no debate.",
      userId: users[0].id,
      items: {
        create: animeRecords.slice(0, 5).map((a, i) => ({ animeId: a.id, order: i })),
      },
    },
  });
  console.log("✓ 1 sample list");

  // 5. Follow relationships
  await prisma.follow.upsert({
    where: { followerId_followingId: { followerId: users[0].id, followingId: users[1].id } },
    update: {},
    create: { followerId: users[0].id, followingId: users[1].id },
  });
  await prisma.follow.upsert({
    where: { followerId_followingId: { followerId: users[1].id, followingId: users[0].id } },
    update: {},
    create: { followerId: users[1].id, followingId: users[0].id },
  });
  console.log("✓ Follow relationships");

  console.log("\n🎉 Seed complete!");
  console.log("\nDemo accounts (password: password123):");
  console.log("  sakura@rayanime.dev");
  console.log("  naruto@rayanime.dev");
  console.log("  demo@rayanime.dev");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
