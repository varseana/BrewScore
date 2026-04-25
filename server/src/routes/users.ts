// ⁘[ USER ROUTES ~ PERFILES + FOLLOWS ]⁘

import { Router, Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../db.js";
import { authenticate, optionalAuth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";

const router = Router();

// ⁘[ GET USER PROFILE ]⁘

router.get(
  "/:id",
  optionalAuth,
  async (req: Request, res: Response): Promise<void> => {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
      select: {
        id: true,
        name: true,
        avatar: true,
        bio: true,
        tastePreferences: true,
        role: true,
        followerCount: true,
        followingCount: true,
        reviewCount: true,
        createdAt: true,
      },
    });
    if (!user) {
      res.status(404).json({ error: "usuario no encontrado" });
      return;
    }

    // si el que pide esta logueado, decirle si ya sigue a este usuario
    let isFollowing = false;
    if (req.user) {
      const follow = await prisma.follow.findUnique({
        where: {
          followerId_followingId: {
            followerId: req.user.userId,
            followingId: user.id,
          },
        },
      });
      isFollowing = !!follow;
    }

    res.json({ ...user, isFollowing });
  }
);

// ⁘[ UPDATE PROFILE ]⁘

const updateProfileSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  bio: z.string().max(500).optional(),
  avatar: z.string().url().optional(),
  tastePreferences: z.array(z.string()).max(10).optional(),
});

router.patch(
  "/me",
  authenticate,
  validate(updateProfileSchema),
  async (req: Request, res: Response): Promise<void> => {
    const user = await prisma.user.update({
      where: { id: req.user!.userId },
      data: req.body,
      select: {
        id: true,
        name: true,
        avatar: true,
        bio: true,
        tastePreferences: true,
        role: true,
        followerCount: true,
        followingCount: true,
        reviewCount: true,
        createdAt: true,
      },
    });
    res.json(user);
  }
);

// ⁘[ FOLLOW / UNFOLLOW ]⁘

router.post(
  "/:id/follow",
  authenticate,
  async (req: Request, res: Response): Promise<void> => {
    const targetId = req.params.id;
    const userId = req.user!.userId;

    if (targetId === userId) {
      res.status(400).json({ error: "no te puedes seguir a ti mismo" });
      return;
    }

    const target = await prisma.user.findUnique({ where: { id: targetId } });
    if (!target) {
      res.status(404).json({ error: "usuario no encontrado" });
      return;
    }

    // verificar si ya lo sigue
    const existing = await prisma.follow.findUnique({
      where: { followerId_followingId: { followerId: userId, followingId: targetId } },
    });

    if (existing) {
      // unfollow
      await prisma.follow.delete({ where: { id: existing.id } });
      await prisma.user.update({ where: { id: userId }, data: { followingCount: { decrement: 1 } } });
      await prisma.user.update({ where: { id: targetId }, data: { followerCount: { decrement: 1 } } });
      res.json({ following: false });
    } else {
      // follow
      await prisma.follow.create({ data: { followerId: userId, followingId: targetId } });
      await prisma.user.update({ where: { id: userId }, data: { followingCount: { increment: 1 } } });
      await prisma.user.update({ where: { id: targetId }, data: { followerCount: { increment: 1 } } });
      res.json({ following: true });
    }
  }
);

// ⁘[ LIST FOLLOWERS / FOLLOWING ]⁘

router.get(
  "/:id/followers",
  async (req: Request, res: Response): Promise<void> => {
    const limit = Math.min(parseInt(req.query.limit as string) || 20, 50);
    const cursor = req.query.cursor as string | undefined;

    const follows = await prisma.follow.findMany({
      where: { followingId: req.params.id },
      take: limit + 1,
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
      orderBy: { createdAt: "desc" },
      include: {
        follower: {
          select: { id: true, name: true, avatar: true, role: true, reviewCount: true },
        },
      },
    });

    const hasMore = follows.length > limit;
    const items = hasMore ? follows.slice(0, limit) : follows;

    res.json({
      items: items.map((f) => f.follower),
      nextCursor: hasMore ? items[items.length - 1].id : null,
    });
  }
);

router.get(
  "/:id/following",
  async (req: Request, res: Response): Promise<void> => {
    const limit = Math.min(parseInt(req.query.limit as string) || 20, 50);
    const cursor = req.query.cursor as string | undefined;

    const follows = await prisma.follow.findMany({
      where: { followerId: req.params.id },
      take: limit + 1,
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
      orderBy: { createdAt: "desc" },
      include: {
        following: {
          select: { id: true, name: true, avatar: true, role: true, reviewCount: true },
        },
      },
    });

    const hasMore = follows.length > limit;
    const items = hasMore ? follows.slice(0, limit) : follows;

    res.json({
      items: items.map((f) => f.following),
      nextCursor: hasMore ? items[items.length - 1].id : null,
    });
  }
);

export default router;
