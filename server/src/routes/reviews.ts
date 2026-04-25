// ⁘[ REVIEW ROUTES ]⁘

import { Router, Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../db.js";
import { authenticate, optionalAuth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";

const router = Router();

// ⁘[ LIST REVIEWS FOR ESTABLISHMENT ]⁘

router.get(
  "/establishment/:estId",
  optionalAuth,
  async (req: Request, res: Response): Promise<void> => {
    const limit = Math.min(parseInt(req.query.limit as string) || 20, 50);
    const cursor = req.query.cursor as string | undefined;
    const sort = req.query.sort as string;

    let orderBy: Record<string, string> = { createdAt: "desc" };
    if (sort === "rating-high") orderBy = { ratingOverall: "desc" };
    if (sort === "rating-low") orderBy = { ratingOverall: "asc" };

    const reviews = await prisma.review.findMany({
      where: { establishmentId: req.params.estId },
      take: limit + 1,
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
      orderBy,
      include: {
        user: { select: { id: true, name: true, avatar: true, role: true } },
      },
    });

    const hasMore = reviews.length > limit;
    const items = hasMore ? reviews.slice(0, limit) : reviews;

    res.json({
      items,
      nextCursor: hasMore ? items[items.length - 1].id : null,
    });
  }
);

// ⁘[ CREATE REVIEW ]⁘

const createSchema = z.object({
  establishmentId: z.string(),
  ratingBean: z.number().int().min(1).max(5),
  ratingPrep: z.number().int().min(1).max(5),
  ratingEquipment: z.number().int().min(1).max(5),
  ratingConsist: z.number().int().min(1).max(5),
  ratingOverall: z.number().int().min(1).max(5),
  text: z.string().max(2000).optional(),
  photos: z.array(z.string().url()).max(5).optional(),
  drinkOrdered: z.string().max(100).optional(),
});

router.post(
  "/",
  authenticate,
  validate(createSchema),
  async (req: Request, res: Response): Promise<void> => {
    const userId = req.user!.userId;
    const { establishmentId } = req.body;

    // verificar que el establecimiento existe
    const est = await prisma.establishment.findUnique({ where: { id: establishmentId } });
    if (!est || est.status !== "ACTIVE") {
      res.status(404).json({ error: "establecimiento no encontrado o no activo" });
      return;
    }

    // no puedes reviewear tu propio establecimiento
    if (est.ownerId === userId) {
      res.status(403).json({ error: "no puedes reviewear tu propio establecimiento" });
      return;
    }

    const review = await prisma.review.create({
      data: { ...req.body, userId },
      include: {
        user: { select: { id: true, name: true, avatar: true, role: true } },
      },
    });

    // actualizar contadores y promedio
    await updateEstablishmentStats(establishmentId);
    await updateUserReviewCount(userId);

    res.status(201).json(review);
  }
);

// ⁘[ OWNER REPLY ]⁘

const replySchema = z.object({
  ownerReply: z.string().min(1).max(1000),
});

router.post(
  "/:id/reply",
  authenticate,
  validate(replySchema),
  async (req: Request, res: Response): Promise<void> => {
    const review = await prisma.review.findUnique({
      where: { id: req.params.id },
      include: { establishment: { select: { ownerId: true } } },
    });
    if (!review) { res.status(404).json({ error: "review no encontrado" }); return; }

    if (req.user!.role !== "ADMIN" && review.establishment.ownerId !== req.user!.userId) {
      res.status(403).json({ error: "solo el owner puede responder" });
      return;
    }

    const updated = await prisma.review.update({
      where: { id: req.params.id },
      data: { ownerReply: req.body.ownerReply, ownerReplyAt: new Date() },
    });
    res.json(updated);
  }
);

// ⁘[ DELETE REVIEW ~ SOLO AUTOR O ADMIN ]⁘

router.delete(
  "/:id",
  authenticate,
  async (req: Request, res: Response): Promise<void> => {
    const review = await prisma.review.findUnique({ where: { id: req.params.id } });
    if (!review) { res.status(404).json({ error: "review no encontrado" }); return; }

    if (req.user!.role !== "ADMIN" && review.userId !== req.user!.userId) {
      res.status(403).json({ error: "no tienes permiso" });
      return;
    }

    await prisma.review.delete({ where: { id: req.params.id } });
    await updateEstablishmentStats(review.establishmentId);
    await updateUserReviewCount(review.userId);

    res.json({ message: "review eliminado" });
  }
);

// ⁘[ USER REVIEWS ~ FEED DE UN USUARIO ]⁘

router.get(
  "/user/:userId",
  async (req: Request, res: Response): Promise<void> => {
    const limit = Math.min(parseInt(req.query.limit as string) || 20, 50);
    const cursor = req.query.cursor as string | undefined;

    const reviews = await prisma.review.findMany({
      where: { userId: req.params.userId },
      take: limit + 1,
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
      orderBy: { createdAt: "desc" },
      include: {
        establishment: { select: { id: true, name: true, city: true, avgRating: true } },
      },
    });

    const hasMore = reviews.length > limit;
    const items = hasMore ? reviews.slice(0, limit) : reviews;

    res.json({
      items,
      nextCursor: hasMore ? items[items.length - 1].id : null,
    });
  }
);

// ⁘[ HELPERS ]⁘

async function updateEstablishmentStats(establishmentId: string) {
  const agg = await prisma.review.aggregate({
    where: { establishmentId },
    _avg: { ratingOverall: true },
    _count: true,
  });
  await prisma.establishment.update({
    where: { id: establishmentId },
    data: {
      avgRating: Math.round((agg._avg.ratingOverall || 0) * 10) / 10,
      reviewCount: agg._count,
    },
  });
}

async function updateUserReviewCount(userId: string) {
  const count = await prisma.review.count({ where: { userId } });
  const data: { reviewCount: number; role?: "CONNOISSEUR" } = { reviewCount: count };

  // auto-promote a connoisseur si llega a 10 reviews
  if (count >= 10) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (user && user.role === "EXPLORER") data.role = "CONNOISSEUR";
  }

  await prisma.user.update({ where: { id: userId }, data });
}

export default router;
