// ⁘[ SEED SCRIPT ]⁘
// usuarios de prueba + establecimientos reales (solo nombre, direccion, coords)
// todo lo demas lo llenan los owners/usuarios

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { CR_ESTABLISHMENTS, INTL_ESTABLISHMENTS } from "./seed-data.js";

const prisma = new PrismaClient();

// fotos genericas de unsplash para que no se vea vacio
const PHOTO_SETS = [
  ["https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800", "https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=800", "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800"],
  ["https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800", "https://images.unsplash.com/photo-1453614512568-c4024d13c247?w=800"],
  ["https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=800", "https://images.unsplash.com/photo-1498804103079-a6351b050096?w=800", "https://images.unsplash.com/photo-1511920170033-f8396924c348?w=800"],
  ["https://images.unsplash.com/photo-1559496417-e7f25cb247f3?w=800", "https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=800"],
  ["https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=800", "https://images.unsplash.com/photo-1504630083234-14187a9df0f5?w=800"],
  ["https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800", "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800"],
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

  console.log("creando usuarios de prueba...");
  const hash = await bcrypt.hash("password123", 12);

  await prisma.user.create({ data: { email: "admin@brewscore.dev", passwordHash: hash, name: "BrewScore Admin", role: "ADMIN", bio: "Platform administrator" } });
  await prisma.user.create({ data: { email: "owner@brewscore.dev", passwordHash: hash, name: "Maria Roastera", role: "OWNER", bio: "Coffee shop owner test account" } });
  await prisma.user.create({ data: { email: "oscar@brewscore.dev", passwordHash: hash, name: "Oscar Barista", role: "CONNOISSEUR", bio: "Test connoisseur account" } });
  await prisma.user.create({ data: { email: "sean@brewscore.dev", passwordHash: hash, name: "Sean Explorer", role: "EXPLORER", bio: "Test explorer account" } });

  console.log("creando establecimientos...");
  const allEst = [...CR_ESTABLISHMENTS, ...INTL_ESTABLISHMENTS];

  for (let i = 0; i < allEst.length; i++) {
    const d = allEst[i]!;
    await prisma.establishment.create({
      data: {
        name: d.name,
        address: d.address,
        city: d.city,
        country: d.country,
        lat: d.lat,
        lng: d.lng,
        photos: PHOTO_SETS[i % PHOTO_SETS.length]!,
        hours: {},
        transparencyScore: 0,
        avgRating: 0,
        reviewCount: 0,
        verified: false,
        status: "ACTIVE",
      },
    });
  }

  console.log("seed completado:");
  console.log(`  - 4 usuarios de prueba (admin, owner, connoisseur, explorer)`);
  console.log(`  - ${allEst.length} establecimientos (${CR_ESTABLISHMENTS.length} CR + ${INTL_ESTABLISHMENTS.length} international)`);
  console.log(`  - 0 reviews, 0 coffee programs (clean start)`);
  console.log("");
  console.log("credenciales (password: password123):");
  console.log("  admin:       admin@brewscore.dev");
  console.log("  owner:       owner@brewscore.dev");
  console.log("  connoisseur: oscar@brewscore.dev");
  console.log("  explorer:    sean@brewscore.dev");
}

main()
  .catch((e) => { console.error("error en seed:", e); process.exit(1); })
  .finally(() => prisma.$disconnect());
