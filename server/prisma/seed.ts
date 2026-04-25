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

  // no fake reviews ~ la plataforma empieza limpia, solo usuarios reales

  console.log("seed completado:");
  console.log(`  - 7 usuarios (1 admin, 1 owner, 3 connoisseurs, 2 explorers)`);
  console.log(`  - ${establishments.length} establecimientos (${CR_ESTABLISHMENTS.length} CR + ${INTL_ESTABLISHMENTS.length} international)`);
  console.log(`  - ${COFFEE_PROGRAMS.length} coffee programs`);
  console.log(`  - 0 reviews (clean start — real users only)`);
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
