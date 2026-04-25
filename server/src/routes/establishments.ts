// ⁘[ ESTABLISHMENT ROUTES ]⁘

import { Router, Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../db.js";
import { authenticate, optionalAuth, requireRole } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { param, queryStr, queryNum } from "../utils/helpers.js";

const router = Router();

// ⁘[ LIST / SEARCH / MAP BOUNDS ]⁘

router.get(
  "/",
  optionalAuth,
  async (req: Request, res: Response): Promise<void> => {
    const bounds = queryStr(req, "bounds");
    const q = queryStr(req, "q");
    const methods = queryStr(req, "methods");
    const hasMethod = queryStr(req, "hasMethod");
    const origins = queryStr(req, "origins");
    const minRating = queryStr(req, "minRating");
    const minScore = queryStr(req, "minScore");
    const roastsInHouse = queryStr(req, "roastsInHouse");
    const sort = queryStr(req, "sort");
    const cursor = queryStr(req, "cursor");
    const limit = Math.min(queryNum(req, "limit", 50), 100);

    const where: Record<string, unknown> = { status: "ACTIVE" };

    if (bounds) {
      const [swLat, swLng, neLat, neLng] = bounds.split(",").map(Number);
      if ([swLat, swLng, neLat, neLng].every((n) => !isNaN(n!))) {
        where.lat = { gte: swLat, lte: neLat };
        where.lng = { gte: swLng, lte: neLng };
      }
    }

    if (q) {
      where.OR = [
        { name: { contains: q, mode: "insensitive" } },
        { city: { contains: q, mode: "insensitive" } },
        { description: { contains: q, mode: "insensitive" } },
      ];
    }

    if (minRating) where.avgRating = { gte: parseFloat(minRating) };
    if (minScore) where.transparencyScore = { gte: parseFloat(minScore) };

    if (methods || origins || hasMethod || roastsInHouse) {
      const cpWhere: Record<string, unknown> = {};
      if (methods) cpWhere.brewingMethods = { hasSome: methods.split(",") };
      if (origins) cpWhere.beanOrigins = { hasSome: origins.split(",") };
      if (hasMethod) cpWhere.brewingMethods = { has: hasMethod };
      if (roastsInHouse === "true") cpWhere.roastsInHouse = true;
      where.coffeeProgram = cpWhere;
    }

    let orderBy: Record<string, string> = { avgRating: "desc" };
    if (sort === "newest") orderBy = { createdAt: "desc" };
    if (sort === "score") orderBy = { transparencyScore: "desc" };

    const establishments = await prisma.establishment.findMany({
      where,
      take: limit + 1,
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
      orderBy,
      include: {
        coffeeProgram: { select: { brewingMethods: true, beanOrigins: true, roastsInHouse: true } },
      },
    });

    const hasMore = establishments.length > limit;
    const items = hasMore ? establishments.slice(0, limit) : establishments;

    res.json({
      items,
      nextCursor: hasMore ? items[items.length - 1]!.id : null,
      total: await prisma.establishment.count({ where }),
    });
  }
);

// ⁘[ GET ONE ]⁘

router.get(
  "/:id",
  optionalAuth,
  async (req: Request, res: Response): Promise<void> => {
    const id = param(req, "id");
    const est = await prisma.establishment.findUnique({
      where: { id },
      include: {
        coffeeProgram: true,
        owner: { select: { id: true, name: true, avatar: true } },
        _count: { select: { reviews: true, favorites: true, strikes: true } },
      },
    });
    if (!est || est.status === "REMOVED") { res.status(404).json({ error: "no encontrado" }); return; }

    let isFavorited = false;
    if (req.user) {
      const fav = await prisma.favorite.findUnique({
        where: { userId_establishmentId: { userId: req.user.userId, establishmentId: est.id } },
      });
      isFavorited = !!fav;
    }
    res.json({ ...est, isFavorited });
  }
);

// ⁘[ CREATE ]⁘

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
  authenticate, requireRole("ADMIN", "OWNER"),
  validate(createSchema),
  async (req: Request, res: Response): Promise<void> => {
    const est = await prisma.establishment.create({
      data: { ...req.body, ownerId: req.user!.role === "OWNER" ? req.user!.userId : undefined },
    });
    res.status(201).json(est);
  }
);

// ⁘[ UPDATE ]⁘

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
    const id = param(req, "id");
    const est = await prisma.establishment.findUnique({ where: { id } });
    if (!est) { res.status(404).json({ error: "no encontrado" }); return; }
    if (req.user!.role !== "ADMIN" && est.ownerId !== req.user!.userId) {
      res.status(403).json({ error: "no tienes permiso" }); return;
    }
    const updated = await prisma.establishment.update({ where: { id }, data: req.body });
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
    const id = param(req, "id");
    const est = await prisma.establishment.findUnique({ where: { id } });
    if (!est) { res.status(404).json({ error: "no encontrado" }); return; }
    if (req.user!.role !== "ADMIN" && est.ownerId !== req.user!.userId) {
      res.status(403).json({ error: "no tienes permiso" }); return;
    }
    const program = await prisma.coffeeProgram.upsert({
      where: { establishmentId: id },
      update: req.body,
      create: { establishmentId: id, ...req.body },
    });
    await recalcTransparencyScore(id);
    res.json(program);
  }
);

// ⁘[ FAVORITE TOGGLE ]⁘

router.post(
  "/:id/favorite",
  authenticate,
  async (req: Request, res: Response): Promise<void> => {
    const estId = param(req, "id");
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

async function recalcTransparencyScore(establishmentId: string) {
  const cp = await prisma.coffeeProgram.findUnique({ where: { establishmentId } });
  if (!cp) return;
  const fields = [
    cp.beanOrigins.length > 0, cp.brewingMethods.length > 0,
    (cp.equipment as unknown[]).length > 0, !!cp.waterFiltration,
    cp.milkOptions.length > 0, (cp.signatureDrinks as unknown[]).length > 0,
    !!cp.roastPolicy, cp.roastsInHouse !== null, cp.daysFromRoast !== null,
  ];
  const score = Math.round((fields.filter(Boolean).length / fields.length) * 100);
  await prisma.establishment.update({ where: { id: establishmentId }, data: { transparencyScore: score } });
}

export default router;
