// ⁘[ SEED SCRIPT ]⁘
// datos iniciales para desarrollo ~ 1 admin, 1 owner, 3 connoisseurs, 5 establecimientos

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("limpiando base de datos...");
  // borrar en orden por las foreign keys
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

  // ⁘[ ADMIN ]⁘
  const admin = await prisma.user.create({
    data: {
      email: "admin@brewscore.dev",
      passwordHash: hash,
      name: "BrewScore Admin",
      role: "ADMIN",
      bio: "Platform administrator",
    },
  });

  // ⁘[ OWNER ]⁘
  const owner = await prisma.user.create({
    data: {
      email: "owner@brewscore.dev",
      passwordHash: hash,
      name: "Maria Roastera",
      role: "OWNER",
      bio: "Third-generation coffee roaster. Running Cafe Origen since 2018.",
      tastePreferences: ["single origin", "light roast", "pour-over"],
    },
  });

  // ⁘[ CONNOISSEURS ]⁘
  const connoisseur1 = await prisma.user.create({
    data: {
      email: "oscar@brewscore.dev",
      passwordHash: hash,
      name: "Oscar Barista",
      role: "CONNOISSEUR",
      bio: "15 years in specialty coffee. I judge your latte art.",
      tastePreferences: ["espresso", "dark roast", "single origin"],
      reviewCount: 47,
      followerCount: 230,
    },
  });

  const connoisseur2 = await prisma.user.create({
    data: {
      email: "nazareth@brewscore.dev",
      passwordHash: hash,
      name: "Nazareth Pourover",
      role: "CONNOISSEUR",
      bio: "Pour-over evangelist. If your water isn't filtered, I'm leaving.",
      tastePreferences: ["pour-over", "light roast", "fruity"],
      reviewCount: 32,
      followerCount: 156,
    },
  });

  const connoisseur3 = await prisma.user.create({
    data: {
      email: "steven@brewscore.dev",
      passwordHash: hash,
      name: "Steven Coldbrewer",
      role: "CONNOISSEUR",
      bio: "Cold brew or nothing. I carry my own thermometer.",
      tastePreferences: ["cold brew", "medium roast", "chocolate notes"],
      reviewCount: 28,
      followerCount: 89,
    },
  });

  // ⁘[ EXPLORERS ]⁘
  const explorer1 = await prisma.user.create({
    data: {
      email: "sean@brewscore.dev",
      passwordHash: hash,
      name: "Sean Explorer",
      role: "EXPLORER",
      bio: "Just looking for good coffee near me.",
      tastePreferences: ["latte", "cappuccino"],
    },
  });

  const explorer2 = await prisma.user.create({
    data: {
      email: "eugenia@brewscore.dev",
      passwordHash: hash,
      name: "Eugenia Latte",
      role: "EXPLORER",
      bio: "Oat milk latte enthusiast.",
      tastePreferences: ["oat milk", "vanilla", "light roast"],
    },
  });

  // ⁘[ FOLLOWS ]⁘
  // los explorers siguen a los connoisseurs
  await prisma.follow.createMany({
    data: [
      { followerId: explorer1.id, followingId: connoisseur1.id },
      { followerId: explorer1.id, followingId: connoisseur2.id },
      { followerId: explorer2.id, followingId: connoisseur1.id },
      { followerId: explorer2.id, followingId: connoisseur3.id },
      { followerId: connoisseur2.id, followingId: connoisseur1.id },
    ],
  });

  console.log("creando establecimientos...");

  // ⁘[ ESTABLECIMIENTOS ]⁘
  // coordenadas reales de cafeterias famosas (o cercanas)

  const est1 = await prisma.establishment.create({
    data: {
      ownerId: owner.id,
      name: "Cafe Origen",
      description: "Third-wave coffee roastery and tasting room in the heart of San Jose.",
      address: "Calle 7, Barrio Amon",
      city: "San Jose",
      country: "Costa Rica",
      lat: 9.9356,
      lng: -84.0796,
      photos: [],
      hours: {
        mon: "7:00-18:00", tue: "7:00-18:00", wed: "7:00-18:00",
        thu: "7:00-18:00", fri: "7:00-18:00", sat: "8:00-16:00", sun: "closed",
      },
      transparencyScore: 92,
      avgRating: 4.6,
      reviewCount: 23,
      verified: true,
      status: "ACTIVE",
    },
  });

  const est2 = await prisma.establishment.create({
    data: {
      name: "The Roast Lab",
      description: "Experimental roastery pushing the boundaries of flavor profiles.",
      address: "456 Brew Street",
      city: "Portland",
      country: "United States",
      lat: 45.5231,
      lng: -122.6765,
      photos: [],
      hours: {
        mon: "6:30-17:00", tue: "6:30-17:00", wed: "6:30-17:00",
        thu: "6:30-17:00", fri: "6:30-17:00", sat: "7:00-15:00", sun: "7:00-15:00",
      },
      transparencyScore: 85,
      avgRating: 4.3,
      reviewCount: 15,
      verified: false,
      status: "ACTIVE",
    },
  });

  const est3 = await prisma.establishment.create({
    data: {
      name: "Kopi House",
      description: "Southeast Asian-inspired coffee house with traditional brewing methods.",
      address: "12 Jalan Bukit Bintang",
      city: "Kuala Lumpur",
      country: "Malaysia",
      lat: 3.1488,
      lng: 101.7137,
      photos: [],
      hours: {
        mon: "8:00-22:00", tue: "8:00-22:00", wed: "8:00-22:00",
        thu: "8:00-22:00", fri: "8:00-23:00", sat: "8:00-23:00", sun: "9:00-21:00",
      },
      transparencyScore: 78,
      avgRating: 4.1,
      reviewCount: 9,
      verified: false,
      status: "ACTIVE",
    },
  });

  const est4 = await prisma.establishment.create({
    data: {
      name: "Noir Espresso",
      description: "Minimalist espresso bar. No drip. No compromise.",
      address: "88 Rue de Rivoli",
      city: "Paris",
      country: "France",
      lat: 48.8606,
      lng: 2.3376,
      photos: [],
      hours: {
        mon: "7:00-19:00", tue: "7:00-19:00", wed: "7:00-19:00",
        thu: "7:00-19:00", fri: "7:00-19:00", sat: "8:00-18:00", sun: "8:00-16:00",
      },
      transparencyScore: 88,
      avgRating: 4.5,
      reviewCount: 31,
      verified: false,
      status: "ACTIVE",
    },
  });

  const est5 = await prisma.establishment.create({
    data: {
      name: "Bean & Gone",
      description: "Grab-and-go specialty coffee. Fast but never cheap.",
      address: "221B Baker Street",
      city: "London",
      country: "United Kingdom",
      lat: 51.5238,
      lng: -0.1585,
      photos: [],
      hours: {
        mon: "6:00-16:00", tue: "6:00-16:00", wed: "6:00-16:00",
        thu: "6:00-16:00", fri: "6:00-16:00", sat: "7:00-14:00", sun: "closed",
      },
      transparencyScore: 65,
      avgRating: 3.8,
      reviewCount: 7,
      verified: false,
      status: "ACTIVE",
    },
  });

  // ⁘[ COFFEE PROGRAMS ]⁘

  await prisma.coffeeProgram.createMany({
    data: [
      {
        establishmentId: est1.id,
        beanOrigins: ["Tarrazu, Costa Rica", "Huila, Colombia"],
        brewingMethods: ["espresso", "pour-over", "cold brew", "siphon"],
        equipment: [
          { name: "La Marzocco Linea PB", type: "espresso machine" },
          { name: "Mahlkonig EK43", type: "grinder" },
          { name: "Hario V60", type: "pour-over" },
        ],
        waterFiltration: "BWT Bestmax Premium",
        milkOptions: ["whole", "oat", "almond", "coconut"],
        signatureDrinks: [
          { name: "Tico Sunrise", description: "Honey-processed Costa Rican pour-over with orange zest" },
        ],
        roastPolicy: "Roasted in-house every Tuesday and Friday",
        roastsInHouse: true,
        daysFromRoast: 3,
      },
      {
        establishmentId: est2.id,
        beanOrigins: ["Yirgacheffe, Ethiopia", "Gesha, Panama", "Sidamo, Ethiopia"],
        brewingMethods: ["espresso", "pour-over", "AeroPress", "French press"],
        equipment: [
          { name: "Slayer Espresso", type: "espresso machine" },
          { name: "Niche Zero", type: "grinder" },
        ],
        waterFiltration: "Reverse osmosis + mineral dosing",
        milkOptions: ["whole", "oat"],
        signatureDrinks: [
          { name: "Lab Rat", description: "Rotating single-origin espresso flight" },
        ],
        roastPolicy: "Small batch roasted weekly by partner roastery",
        roastsInHouse: false,
        daysFromRoast: 7,
      },
      {
        establishmentId: est3.id,
        beanOrigins: ["Toraja, Indonesia", "Lam Dong, Vietnam"],
        brewingMethods: ["kopi tubruk", "Vietnamese phin", "espresso", "cold brew"],
        equipment: [
          { name: "Rancilio Classe 5", type: "espresso machine" },
          { name: "Traditional phin filters", type: "manual" },
        ],
        waterFiltration: "Carbon block filter",
        milkOptions: ["condensed milk", "whole", "coconut"],
        signatureDrinks: [
          { name: "Kopi Susu", description: "Traditional Indonesian coffee with condensed milk" },
        ],
        roastPolicy: "Beans sourced from local roasters, rotated monthly",
        roastsInHouse: false,
        daysFromRoast: 14,
      },
      {
        establishmentId: est4.id,
        beanOrigins: ["Cerrado, Brazil", "Antigua, Guatemala"],
        brewingMethods: ["espresso", "ristretto", "lungo"],
        equipment: [
          { name: "Victoria Arduino Eagle One", type: "espresso machine" },
          { name: "Mythos One", type: "grinder" },
        ],
        waterFiltration: "Everpure filtration system",
        milkOptions: ["whole", "oat"],
        signatureDrinks: [
          { name: "Le Noir", description: "Double ristretto with dark chocolate ganache" },
        ],
        roastPolicy: "Partnered with Belleville Brulerie, roasted weekly",
        roastsInHouse: false,
        daysFromRoast: 5,
      },
      {
        establishmentId: est5.id,
        beanOrigins: ["Blend - origin not disclosed"],
        brewingMethods: ["espresso", "batch brew"],
        equipment: [
          { name: "La Cimbali M100", type: "espresso machine" },
        ],
        milkOptions: ["whole", "oat", "soy"],
        signatureDrinks: [],
        roastPolicy: "Supplied by wholesale roaster",
        roastsInHouse: false,
      },
    ],
  });

  // ⁘[ REVIEWS ]⁘

  await prisma.review.createMany({
    data: [
      {
        userId: connoisseur1.id,
        establishmentId: est1.id,
        ratingBean: 5, ratingPrep: 5, ratingEquipment: 5, ratingConsist: 4, ratingOverall: 5,
        text: "Best single-origin pour-over I've had in Central America. The Tarrazu is exceptional.",
        drinkOrdered: "Tico Sunrise",
      },
      {
        userId: connoisseur2.id,
        establishmentId: est1.id,
        ratingBean: 5, ratingPrep: 4, ratingEquipment: 5, ratingConsist: 4, ratingOverall: 4,
        text: "Water filtration is on point. V60 technique could use a bit more consistency but beans are stellar.",
        drinkOrdered: "V60 Tarrazu",
      },
      {
        userId: connoisseur3.id,
        establishmentId: est2.id,
        ratingBean: 5, ratingPrep: 4, ratingEquipment: 4, ratingConsist: 3, ratingOverall: 4,
        text: "The Gesha was mind-blowing but the espresso extraction was slightly off. Still worth the trip.",
        drinkOrdered: "Lab Rat flight",
      },
      {
        userId: connoisseur1.id,
        establishmentId: est4.id,
        ratingBean: 4, ratingPrep: 5, ratingEquipment: 5, ratingConsist: 5, ratingOverall: 5,
        text: "Flawless ristretto. The Eagle One is dialed in perfectly. This is what espresso should taste like.",
        drinkOrdered: "Le Noir",
      },
      {
        userId: explorer1.id,
        establishmentId: est5.id,
        ratingBean: 3, ratingPrep: 3, ratingEquipment: 3, ratingConsist: 3, ratingOverall: 3,
        text: "Decent coffee for a quick grab. Nothing special but gets the job done.",
        drinkOrdered: "Flat white",
      },
    ],
  });

  console.log("seed completado:");
  console.log(`  - ${7} usuarios (1 admin, 1 owner, 3 connoisseurs, 2 explorers)`);
  console.log(`  - ${5} establecimientos con coffee programs`);
  console.log(`  - ${5} reviews`);
  console.log(`  - ${5} follows`);
  console.log("");
  console.log("credenciales de prueba (todos usan password: password123):");
  console.log("  admin:       admin@brewscore.dev");
  console.log("  owner:       owner@brewscore.dev");
  console.log("  connoisseur: oscar@brewscore.dev / nazareth@brewscore.dev / steven@brewscore.dev");
  console.log("  explorer:    sean@brewscore.dev / eugenia@brewscore.dev");
}

main()
  .catch((e) => {
    console.error("error en seed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
