// ⁘[ SEED SCRIPT ]⁘
// 1 admin, 1 owner, 3 connoisseurs, 2 explorers, 19 establecimientos, reviews, follows

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { CR_ESTABLISHMENTS, INTL_ESTABLISHMENTS, COFFEE_PROGRAMS } from "./seed-data.js";

const prisma = new PrismaClient();

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
        photos: [], hours: { mon: "7:00-18:00", tue: "7:00-18:00", wed: "7:00-18:00", thu: "7:00-18:00", fri: "7:00-18:00", sat: "8:00-16:00", sun: "closed" },
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
    { userId: c1.id, estIdx: 0, bean: 5, prep: 5, equip: 5, consist: 4, overall: 5, text: "Best single-origin pour-over I've had in Central America. The Tarrazu is exceptional.", drink: "Tico Sunrise" },
    { userId: c2.id, estIdx: 0, bean: 5, prep: 4, equip: 5, consist: 4, overall: 4, text: "Water filtration is on point. V60 technique could use a bit more consistency but beans are stellar.", drink: "V60 Tarrazu" },
    { userId: c2.id, estIdx: 2, bean: 5, prep: 5, equip: 5, consist: 5, overall: 5, text: "Cafeoteca is the best coffee experience in Costa Rica. The flight of origins is a must.", drink: "Flight of Origins" },
    { userId: c3.id, estIdx: 2, bean: 5, prep: 5, equip: 4, consist: 5, overall: 5, text: "Their cold brew is insane. Smooth, chocolatey, zero bitterness.", drink: "Cold brew" },
    { userId: c1.id, estIdx: 5, bean: 5, prep: 4, equip: 4, consist: 4, overall: 5, text: "The Bribri cacao-coffee ceremony is unlike anything else. Cultural and delicious.", drink: "Cacao-Coffee Ceremony" },
    { userId: c3.id, estIdx: 7, bean: 5, prep: 4, equip: 5, consist: 4, overall: 5, text: "Doka Estate is the real deal. Bean-to-cup in 24hrs. The Probat roaster is beautiful.", drink: "Estate Reserve" },
    { userId: e1.id, estIdx: 1, bean: 4, prep: 4, equip: 4, consist: 4, overall: 4, text: "Great brunch spot with solid coffee. The Cascara Fizz is refreshing.", drink: "Cascara Fizz" },
    { userId: e2.id, estIdx: 6, bean: 4, prep: 3, equip: 3, consist: 4, overall: 4, text: "Cute spot near UCR. The honey bee drink is sweet but good.", drink: "Honey Bee" },
    { userId: c1.id, estIdx: 12, bean: 5, prep: 5, equip: 5, consist: 5, overall: 5, text: "Tarrazu Black is perfection. No milk, no sugar, just pure coffee excellence.", drink: "Tarrazu Black" },
    { userId: c2.id, estIdx: 11, bean: 5, prep: 4, equip: 4, consist: 4, overall: 4, text: "Cloud Nine cold brew at 1400m altitude. The honey makes it special.", drink: "Cloud Nine" },
    { userId: c3.id, estIdx: 15, bean: 5, prep: 4, equip: 4, consist: 3, overall: 4, text: "The Gesha was mind-blowing but the espresso extraction was slightly off.", drink: "Lab Rat flight" },
    { userId: c1.id, estIdx: 17, bean: 4, prep: 5, equip: 5, consist: 5, overall: 5, text: "Flawless ristretto. The Eagle One is dialed in perfectly.", drink: "Le Noir" },
    { userId: e1.id, estIdx: 18, bean: 3, prep: 3, equip: 3, consist: 3, overall: 3, text: "Decent coffee for a quick grab. Nothing special but gets the job done.", drink: "Flat white" },
    { userId: e2.id, estIdx: 14, bean: 4, prep: 4, equip: 3, consist: 3, overall: 4, text: "The Cacao Caribe is amazing. Caribbean vibes with great coffee.", drink: "Cacao Caribe" },
    { userId: c1.id, estIdx: 9, bean: 4, prep: 3, equip: 4, consist: 4, overall: 4, text: "Britt is solid for what it is. Not artisan but consistent and educational.", drink: "Espresso Britt" },
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
