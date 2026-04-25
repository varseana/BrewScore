// ⁘[ SEED SCRIPT ]⁘
// 1 admin, 1 owner, 3 connoisseurs, 2 explorers, 19 establecimientos, reviews, follows

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { CR_ESTABLISHMENTS, INTL_ESTABLISHMENTS, COFFEE_PROGRAMS } from "./seed-data.js";

const prisma = new PrismaClient();

// fotos de unsplash ~ coffee shops reales, sin api key
const PHOTOS: string[][] = [
  ["https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800", "https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=800", "https://images.unsplash.com/photo-1559305616-3f99cd43e353?w=800", "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800"],
  ["https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800", "https://images.unsplash.com/photo-1453614512568-c4024d13c247?w=800", "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800"],
  ["https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=800", "https://images.unsplash.com/photo-1498804103079-a6351b050096?w=800", "https://images.unsplash.com/photo-1511920170033-f8396924c348?w=800", "https://images.unsplash.com/photo-1514432324607-a09d9b4aefda?w=800", "https://images.unsplash.com/photo-1507133750040-4a8f57021571?w=800"],
  ["https://images.unsplash.com/photo-1559496417-e7f25cb247f3?w=800", "https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=800", "https://images.unsplash.com/photo-1485182708500-e8f1f318ba72?w=800"],
  ["https://images.unsplash.com/photo-1493857671505-72967e2e2760?w=800", "https://images.unsplash.com/photo-1525610553efeab8e5f5e0085bcef3d?w=800", "https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=800"],
  ["https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=800", "https://images.unsplash.com/photo-1504630083234-14187a9df0f5?w=800", "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=800", "https://images.unsplash.com/photo-1510972527921-ce03766a1cf1?w=800"],
  ["https://images.unsplash.com/photo-1559305616-3f99cd43e353?w=800", "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800", "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800"],
  ["https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800", "https://images.unsplash.com/photo-1504630083234-14187a9df0f5?w=800", "https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=800", "https://images.unsplash.com/photo-1514432324607-a09d9b4aefda?w=800", "https://images.unsplash.com/photo-1507133750040-4a8f57021571?w=800"],
  ["https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800", "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800", "https://images.unsplash.com/photo-1485182708500-e8f1f318ba72?w=800"],
  ["https://images.unsplash.com/photo-1498804103079-a6351b050096?w=800", "https://images.unsplash.com/photo-1511920170033-f8396924c348?w=800", "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=800", "https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=800"],
  ["https://images.unsplash.com/photo-1453614512568-c4024d13c247?w=800", "https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=800"],
  ["https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=800", "https://images.unsplash.com/photo-1510972527921-ce03766a1cf1?w=800", "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800", "https://images.unsplash.com/photo-1504630083234-14187a9df0f5?w=800"],
  ["https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=800", "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800", "https://images.unsplash.com/photo-1559305616-3f99cd43e353?w=800"],
  ["https://images.unsplash.com/photo-1525610553efeab8e5f5e0085bcef3d?w=800", "https://images.unsplash.com/photo-1493857671505-72967e2e2760?w=800"],
  ["https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800", "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800", "https://images.unsplash.com/photo-1514432324607-a09d9b4aefda?w=800"],
  ["https://images.unsplash.com/photo-1559496417-e7f25cb247f3?w=800", "https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=800", "https://images.unsplash.com/photo-1511920170033-f8396924c348?w=800"],
  ["https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=800", "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=800", "https://images.unsplash.com/photo-1485182708500-e8f1f318ba72?w=800"],
  ["https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800", "https://images.unsplash.com/photo-1498804103079-a6351b050096?w=800", "https://images.unsplash.com/photo-1507133750040-4a8f57021571?w=800", "https://images.unsplash.com/photo-1510972527921-ce03766a1cf1?w=800"],
  ["https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800", "https://images.unsplash.com/photo-1453614512568-c4024d13c247?w=800"],
];

async function main() {
  console.log("limpiando base de datos...");
  await prisma.auditLog.deleteMany();
  await prisma.strike.deleteMany();
  await prisma.report.deleteMany();
  await prisma.claimRequest.deleteMany();
  await prisma.favorite.deleteMany();
  await prisma.follow.deleteMany();
  await prisma.review.deleteMany();
  await prisma.coffeeProgram.deleteMany();
  await prisma.refreshToken.deleteMany();
  await prisma.establishment.deleteMany();
  await prisma.user.deleteMany();

  console.log("creando usuarios...");
  const hash = await bcrypt.hash("password123", 12);

  const admin = await prisma.user.create({
    data: { email: "admin@brewscore.dev", passwordHash: hash, name: "BrewScore Admin", role: "ADMIN", bio: "Platform administrator" },
  });
  const owner = await prisma.user.create({
    data: { email: "owner@brewscore.dev", passwordHash: hash, name: "Maria Roastera", role: "OWNER", bio: "Third-generation coffee roaster.", tastePreferences: ["single origin", "light roast", "pour-over"] },
  });
  const c1 = await prisma.user.create({
    data: { email: "oscar@brewscore.dev", passwordHash: hash, name: "Oscar Barista", role: "CONNOISSEUR", bio: "15 years in specialty coffee.", tastePreferences: ["espresso", "dark roast", "single origin"], reviewCount: 47, followerCount: 230 },
  });
  const c2 = await prisma.user.create({
    data: { email: "nazareth@brewscore.dev", passwordHash: hash, name: "Nazareth Pourover", role: "CONNOISSEUR", bio: "Pour-over evangelist.", tastePreferences: ["pour-over", "light roast", "fruity"], reviewCount: 32, followerCount: 156 },
  });
  const c3 = await prisma.user.create({
    data: { email: "steven@brewscore.dev", passwordHash: hash, name: "Steven Coldbrewer", role: "CONNOISSEUR", bio: "Cold brew or nothing.", tastePreferences: ["cold brew", "medium roast", "chocolate notes"], reviewCount: 28, followerCount: 89 },
  });
  const e1 = await prisma.user.create({
    data: { email: "sean@brewscore.dev", passwordHash: hash, name: "Sean Explorer", role: "EXPLORER", bio: "Just looking for good coffee.", tastePreferences: ["latte", "cappuccino"] },
  });
  const e2 = await prisma.user.create({
    data: { email: "eugenia@brewscore.dev", passwordHash: hash, name: "Eugenia Latte", role: "EXPLORER", bio: "Oat milk latte enthusiast.", tastePreferences: ["oat milk", "vanilla", "light roast"] },
  });

  // follows
  await prisma.follow.createMany({
    data: [
      { followerId: e1.id, followingId: c1.id }, { followerId: e1.id, followingId: c2.id },
      { followerId: e2.id, followingId: c1.id }, { followerId: e2.id, followingId: c3.id },
      { followerId: c2.id, followingId: c1.id },
    ],
  });

  console.log("creando establecimientos...");
  const allEstData = [...CR_ESTABLISHMENTS, ...INTL_ESTABLISHMENTS];
  const establishments = [];

  for (let i = 0; i < allEstData.length; i++) {
    const d = allEstData[i]!;
    const est = await prisma.establishment.create({
      data: {
        ownerId: i === 0 ? owner.id : undefined, // cafe origen owned by maria
        name: d.name, description: d.description, address: d.address,
        city: d.city, country: d.country, lat: d.lat, lng: d.lng,
        photos: PHOTOS[i % PHOTOS.length]!, hours: { mon: "7:00-18:00", tue: "7:00-18:00", wed: "7:00-18:00", thu: "7:00-18:00", fri: "7:00-18:00", sat: "8:00-16:00", sun: "closed" },
        transparencyScore: d.transparencyScore, avgRating: d.avgRating,
        reviewCount: d.reviewCount, verified: d.verified ?? false, status: "ACTIVE",
      },
    });
    establishments.push(est);

    // coffee program
    if (COFFEE_PROGRAMS[i]) {
      const cp = COFFEE_PROGRAMS[i]!;
      await prisma.coffeeProgram.create({
        data: { establishmentId: est.id, ...cp },
      });
    }
  }

  console.log("creando reviews...");
  const reviewData = [
    { userId: c1.id, estIdx: 0, bean: 5, prep: 5, equip: 5, consist: 5, overall: 5, text: "Cafeoteca is the best coffee experience in Costa Rica. The flight of origins is a must-try.", drink: "Flight of Origins" },
    { userId: c2.id, estIdx: 0, bean: 5, prep: 5, equip: 4, consist: 5, overall: 5, text: "Incredible selection of Costa Rican regions. The siphon brew was flawless.", drink: "Siphon Tarrazu" },
    { userId: c3.id, estIdx: 0, bean: 5, prep: 4, equip: 4, consist: 4, overall: 4, text: "Their cold brew is insane. Smooth, chocolatey, zero bitterness.", drink: "Cold brew" },
    { userId: c1.id, estIdx: 4, bean: 5, prep: 4, equip: 4, consist: 4, overall: 5, text: "The Bribri cacao-coffee ceremony is unlike anything else. Cultural and delicious.", drink: "Cacao-Coffee Ceremony" },
    { userId: c2.id, estIdx: 4, bean: 5, prep: 5, equip: 3, consist: 4, overall: 5, text: "Sikwa is doing something special. The Talamanca beans have a unique profile you won't find anywhere else.", drink: "Pour-over Bribri" },
    { userId: c3.id, estIdx: 5, bean: 5, prep: 4, equip: 5, consist: 4, overall: 5, text: "Doka Estate is the real deal. Bean-to-cup in 24hrs. The vintage Probat roaster is beautiful.", drink: "Estate Reserve" },
    { userId: e1.id, estIdx: 1, bean: 4, prep: 4, equip: 4, consist: 4, overall: 4, text: "Great brunch spot with solid coffee. Relaxed vibe in Escazu.", drink: "Latte" },
    { userId: e2.id, estIdx: 3, bean: 4, prep: 3, equip: 3, consist: 4, overall: 4, text: "Beautiful setting inside the National Theatre. Coffee is good, not exceptional, but the experience is worth it.", drink: "Cappuccino" },
    { userId: c1.id, estIdx: 9, bean: 5, prep: 5, equip: 4, consist: 5, overall: 5, text: "Coopedota is incredible. Carbon-neutral coffee that tastes amazing. The cooperative model is inspiring.", drink: "Pour-over Dota" },
    { userId: c2.id, estIdx: 8, bean: 5, prep: 4, equip: 4, consist: 4, overall: 4, text: "Cloud Nine cold brew at 1400m altitude. The honey makes it special.", drink: "Cloud Nine" },
    { userId: c1.id, estIdx: 6, bean: 4, prep: 3, equip: 4, consist: 4, overall: 4, text: "Britt is solid for what it is. Not artisan but consistent and educational. Great for first-timers.", drink: "Espresso Britt" },
    { userId: e1.id, estIdx: 13, bean: 4, prep: 4, equip: 5, consist: 4, overall: 4, text: "Surreal experience drinking coffee at the farm where it was grown. The Alsacia Reserve is excellent.", drink: "Alsacia Reserve" },
    { userId: c3.id, estIdx: 15, bean: 5, prep: 4, equip: 4, consist: 3, overall: 4, text: "The Gesha was mind-blowing but the espresso extraction was slightly off.", drink: "Lab Rat flight" },
    { userId: c1.id, estIdx: 17, bean: 4, prep: 5, equip: 5, consist: 5, overall: 5, text: "Flawless ristretto. The Eagle One is dialed in perfectly.", drink: "Le Noir" },
    { userId: e1.id, estIdx: 18, bean: 3, prep: 3, equip: 3, consist: 3, overall: 3, text: "Decent coffee for a quick grab. Nothing special but gets the job done.", drink: "Flat white" },
  ];

  for (const r of reviewData) {
    const est = establishments[r.estIdx];
    if (!est) continue;
    await prisma.review.create({
      data: {
        userId: r.userId, establishmentId: est.id,
        ratingBean: r.bean, ratingPrep: r.prep, ratingEquipment: r.equip,
        ratingConsist: r.consist, ratingOverall: r.overall,
        text: r.text, drinkOrdered: r.drink,
      },
    });
  }

  console.log("seed completado:");
  console.log(`  - 7 usuarios (1 admin, 1 owner, 3 connoisseurs, 2 explorers)`);
  console.log(`  - ${establishments.length} establecimientos (${CR_ESTABLISHMENTS.length} CR + ${INTL_ESTABLISHMENTS.length} international)`);
  console.log(`  - ${COFFEE_PROGRAMS.length} coffee programs`);
  console.log(`  - ${reviewData.length} reviews`);
  console.log(`  - 5 follows`);
  console.log("");
  console.log("credenciales (password: password123):");
  console.log("  admin:       admin@brewscore.dev");
  console.log("  owner:       owner@brewscore.dev");
  console.log("  connoisseur: oscar@ / nazareth@ / steven@brewscore.dev");
  console.log("  explorer:    sean@ / eugenia@brewscore.dev");
}

main()
  .catch((e) => { console.error("error en seed:", e); process.exit(1); })
  .finally(() => prisma.$disconnect());
