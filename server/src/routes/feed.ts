// ⁘[ FEED ROUTES ]⁘
// feed personalizado + global

import { Router, Request, Response } from "express";
import { prisma } from "../db.js";
import { authenticate, optionalAuth } from "../middleware/auth.js";

const router = Router();

// ⁘[ FEED PERSONALIZADO ~ REVIEWS DE GENTE QUE SIGUES ]⁘

router.get(
  "/following",
  authenticate,
  async (req: Request, res: Response): Promise<void> => {
    const limit = Math.min(parseInt(req.query.limit as string) || 20, 50);
    const cursor = req.query.cursor as string | undefined;

    // obtener ids de gente que sigo
    const follows = await prisma.follow.findMany({
      where: { followerId: req.user!.userId },
      select: { followingId: true },
    });
    const followingIds = follows.map((f) => f.followingId);

    if (followingIds.length === 0) {
      res.json({ items: [], nextCursor: null });
      return;
    }

    const reviews = await prisma.review.findMany({
      where: { userId: { in: followingIds } },
      take: limit + 1,
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { id: true, name: true, avatar: true, role: true } },
        establishment: { select: { id: true, name: true, city: true, avgRating: true } },
      },
    });

    const hasMore = reviews.length > limit;
    const items = hasMore ? reviews.slice(0, limit) : reviews;

    res.json({ items, nextCursor: hasMore ? items[items.length - 1].id : null });
  }
);

// ⁘[ FEED GLOBAL ~ ULTIMAS REVIEWS ]⁘

router.get(
  "/global",
  optionalAuth,
  async (req: Request, res: Response): Promise<void> => {
    const limit = Math.min(parseInt(req.query.limit as string) || 20, 50);
    const cursor = req.query.cursor as string | undefined;

    const reviews = await prisma.review.findMany({
      take: limit + 1,
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { id: true, name: true, avatar: true, role: true } },
        establishment: { select: { id: true, name: true, city: true, avgRating: true } },
      },
    });

    const hasMore = reviews.length > limit;
    const items = hasMore ? reviews.slice(0, limit) : reviews;

    res.json({ items, nextCursor: hasMore ? items[items.length - 1].id : null });
  }
);

// ⁘[ TOP CONNOISSEURS ]⁘

router.get(
  "/top-connoisseurs",
  async (_req: Request, res: Response): Promise<void> => {
    const users = await prisma.user.findMany({
      where: { role: "CONNOISSEUR", banned: false },
      orderBy: { followerCount: "desc" },
      take: 10,
      select: {
        id: true, name: true, avatar: true, bio: true,
        followerCount: true, reviewCount: true, tastePreferences: true,
      },
    });
    res.json(users);
  }
);

export default router;
