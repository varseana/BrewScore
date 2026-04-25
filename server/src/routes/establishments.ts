// ⁘[ ESTABLISHMENT ROUTES ]⁘
// crud + busqueda por bounds para el mapa + filtros

import { Router, Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../db.js";
import { authenticate, optionalAuth, requireRole } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";

const router = Router();

// ⁘[ LIST / SEARCH / MAP BOUNDS ]⁘

router.get(
  "/",
  optionalAuth,
  async (req: Request, res: Response): Promise<void> => {
    const {
      bounds, q, methods, origins, equipment,
      minRating, minScore, hasMethod, roastsInHouse,
      limit: limitStr, cursor, sort,
    } = req.query;

    const limit = Math.min(parseInt(limitStr as string) || 50, 100);

    // construir where dinamico
    const where: Record<string, unknown> = { status: "ACTIVE" };

    // bounds para el mapa ~ sw_lat,sw_lng,ne_lat,ne_lng
    if (bounds) {
      const [swLat, swLng, neLat, neLng] = (bounds as string).split(",").map(Number);
      if ([swLat, swLng, neLat, neLng].every((n) => !isNaN(n))) {
        where.lat = { gte: swLat, lte: neLat };
        where.lng = { gte: swLng, lte: neLng };
      }
    }

    // busqueda por texto
    if (q) {
      where.OR = [
        { name: { contains: q as string, mode: "insensitive" } },
        { city: { contains: q as string, mode: "insensitive" } },
        { description: { contains: q as string, mode: "insensitive" } },
      ];
    }

    // filtros de rating y score
    if (minRating) where.avgRating = { gte: parseFloat(minRating as string) };
    if (minScore) where.transparencyScore = { gte: parseFloat(minScore as string) };

    // filtros de coffee program
    if (methods || origins || equipment || hasMethod || roastsInHouse) {
      const cpWhere: Record<string, unknown> = {};
      if (methods) cpWhere.brewingMethods = { hasSome: (methods as string).split(",") };
      if (origins) cpWhere.beanOrigins = { hasSome: (origins as string).split(",") };
      if (hasMethod) cpWhere.brewingMethods = { has: hasMethod as string };
      if (roastsInHouse === "true") cpWhere.roastsInHouse = true;
      where.coffeeProgram = cpWhere;
    }

    // ordenamiento
    let orderBy: Record<string, string> = { avgRating: "desc" };
    if (sort === "newest") orderBy = { createdAt: "desc" };
    if (sort === "score") orderBy = { transparencyScore: "desc" };
    if (sort === "rating") orderBy = { avgRating: "desc" };

    const establishments = await prisma.establishment.findMany({
      where,
      take: limit + 1,
      ...(cursor ? { cursor: { id: cursor as string }, skip: 1 } : {}),
      orderBy,
      include: {
        coffeeProgram: {
          select: {
            brewingMethods: true,
            beanOrigins: true,
            roastsInHouse: true,
          },
        },
      },
    });

    const hasMore = establishments.length > limit;
    const items = hasMore ? establishments.slice(0, limit) : establishments;

    res.json({
      items,
      nextCursor: hasMore ? items[items.length - 1].id : null,
      total: await prisma.establishment.count({ where }),
    });
  }
);

// ⁘[ GET ONE ]⁘

router.get(
  "/:id",
  optionalAuth,
  async (req: Request, res: Response): Promise<void> => {
    const est = await prisma.establishment.findUnique({
      where: { id: req.params.id },
      include: {
        coffeeProgram: true,
        owner: { select: { id: true, name: true, avatar: true } },
        _count: { select: { reviews: true, favorites: true, strikes: true } },
      },
    });
    if (!est || est.status === "REMOVED") {
      res.status(404).json({ error: "establecimiento no encontrado" });
      return;
    }

    // si esta logueado, decirle si lo tiene en favoritos
    let isFavorited = false;
    if (req.user) {
      const fav = await prisma.favorite.findUnique({
        where: {
          userId_establishmentId: {
            userId: req.user.userId,
            establishmentId: est.id,
          },
        },
      });
      isFavorited = !!fav;
    }

    res.json({ ...est, isFavorited });
  }
);

// ⁘[ CREATE ~ ADMIN ONLY ]⁘

const createSchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string().max(1000).optional(),
  address: z.string().min(1),
  city: z.string().min(1),
  country: z.string().min(1),
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  phone: z.string().optional(),
  website: z.string().url().optional(),
  photos: z.array(z.string().url()).optional(),
  hours: z.record(z.string()).optional(),
});

router.post(
  "/",
  authenticate,
  requireRole("ADMIN", "OWNER"),
  validate(createSchema),
  async (req: Request, res: Response): Promise<void> => {
    const est = await prisma.establishment.create({
      data: {
        ...req.body,
        ownerId: req.user!.role === "OWNER" ? req.user!.userId : undefined,
      },
    });
    res.status(201).json(est);
  }
);

// ⁘[ UPDATE ~ OWNER O ADMIN ]⁘

const updateSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  description: z.string().max(1000).optional(),
  address: z.string().min(1).optional(),
  city: z.string().min(1).optional(),
  country: z.string().min(1).optional(),
  lat: z.number().min(-90).max(90).optional(),
  lng: z.number().min(-180).max(180).optional(),
  phone: z.string().optional(),
  website: z.string().url().optional(),
  photos: z.array(z.string().url()).optional(),
  hours: z.record(z.string()).optional(),
});

router.patch(
  "/:id",
  authenticate,
  validate(updateSchema),
  async (req: Request, res: Response): Promise<void> => {
    const est = await prisma.establishment.findUnique({ where: { id: req.params.id } });
    if (!est) { res.status(404).json({ error: "no encontrado" }); return; }

    // solo el owner o admin pueden editar
    if (req.user!.role !== "ADMIN" && est.ownerId !== req.user!.userId) {
      res.status(403).json({ error: "no tienes permiso" });
      return;
    }

    const updated = await prisma.establishment.update({
      where: { id: req.params.id },
      data: req.body,
    });
    res.json(updated);
  }
);

// ⁘[ COFFEE PROGRAM ~ UPSERT ]⁘

const coffeeProgramSchema = z.object({
  beanOrigins: z.array(z.string()).optional(),
  brewingMethods: z.array(z.string()).optional(),
  equipment: z.array(z.object({ name: z.string(), type: z.string() })).optional(),
  waterFiltration: z.string().optional(),
  milkOptions: z.array(z.string()).optional(),
  signatureDrinks: z.array(z.object({ name: z.string(), description: z.string() })).optional(),
  roastPolicy: z.string().optional(),
  roastsInHouse: z.boolean().optional(),
  daysFromRoast: z.number().int().min(0).optional(),
});

router.put(
  "/:id/coffee-program",
  authenticate,
  validate(coffeeProgramSchema),
  async (req: Request, res: Response): Promise<void> => {
    const est = await prisma.establishment.findUnique({ where: { id: req.params.id } });
    if (!est) { res.status(404).json({ error: "no encontrado" }); return; }
    if (req.user!.role !== "ADMIN" && est.ownerId !== req.user!.userId) {
      res.status(403).json({ error: "no tienes permiso" });
      return;
    }

    const program = await prisma.coffeeProgram.upsert({
      where: { establishmentId: req.params.id },
      update: req.body,
      create: { establishmentId: req.params.id, ...req.body },
    });

    // recalcular transparency score
    await recalcTransparencyScore(req.params.id);

    res.json(program);
  }
);

// ⁘[ FAVORITE TOGGLE ]⁘

router.post(
  "/:id/favorite",
  authenticate,
  async (req: Request, res: Response): Promise<void> => {
    const estId = req.params.id;
    const userId = req.user!.userId;

    const existing = await prisma.favorite.findUnique({
      where: { userId_establishmentId: { userId, establishmentId: estId } },
    });

    if (existing) {
      await prisma.favorite.delete({ where: { id: existing.id } });
      res.json({ favorited: false });
    } else {
      await prisma.favorite.create({ data: { userId, establishmentId: estId } });
      res.json({ favorited: true });
    }
  }
);

// ⁘[ HELPERS ]⁘

// calcula el score basado en cuantos campos del coffee program estan llenos
async function recalcTransparencyScore(establishmentId: string) {
  const cp = await prisma.coffeeProgram.findUnique({
    where: { establishmentId },
  });
  if (!cp) return;

  const fields = [
    cp.beanOrigins.length > 0,
    cp.brewingMethods.length > 0,
    (cp.equipment as unknown[]).length > 0,
    !!cp.waterFiltration,
    cp.milkOptions.length > 0,
    (cp.signatureDrinks as unknown[]).length > 0,
    !!cp.roastPolicy,
    cp.roastsInHouse !== null,
    cp.daysFromRoast !== null,
  ];

  const filled = fields.filter(Boolean).length;
  const score = Math.round((filled / fields.length) * 100);

  await prisma.establishment.update({
    where: { id: establishmentId },
    data: { transparencyScore: score },
  });
}

export default router;
