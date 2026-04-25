// ⁘[ AUTH ROUTES ~ REGISTER / LOGIN / REFRESH / ME ]⁘

import { Router, Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../db.js";
import {
  hashPassword,
  verifyPassword,
  generateAuthTokens,
  rotateRefreshToken,
  revokeRefreshTokens,
} from "../auth.js";
import { authenticate } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";

const router = Router();

// ⁘[ SCHEMAS ]⁘

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "minimo 8 caracteres"),
  name: z.string().min(1).max(100),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const refreshSchema = z.object({
  refreshToken: z.string().min(1),
});

// ⁘[ REGISTER ]⁘

router.post(
  "/register",
  validate(registerSchema),
  async (req: Request, res: Response): Promise<void> => {
    const { email, password, name } = req.body;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      res.status(409).json({ error: "ese email ya esta registrado" });
      return;
    }

    const passwordHash = await hashPassword(password);
    const user = await prisma.user.create({
      data: { email, passwordHash, name },
    });

    const tokens = await generateAuthTokens(user.id, user.role);
    res.status(201).json({
      user: sanitizeUser(user),
      ...tokens,
    });
  }
);

// ⁘[ LOGIN ]⁘

router.post(
  "/login",
  validate(loginSchema),
  async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.passwordHash) {
      res.status(401).json({ error: "credenciales incorrectas" });
      return;
    }

    if (user.banned) {
      res.status(403).json({ error: "cuenta suspendida" });
      return;
    }

    const valid = await verifyPassword(password, user.passwordHash);
    if (!valid) {
      res.status(401).json({ error: "credenciales incorrectas" });
      return;
    }

    const tokens = await generateAuthTokens(user.id, user.role);
    res.json({ user: sanitizeUser(user), ...tokens });
  }
);

// ⁘[ REFRESH ]⁘

router.post(
  "/refresh",
  validate(refreshSchema),
  async (req: Request, res: Response): Promise<void> => {
    const result = await rotateRefreshToken(req.body.refreshToken);
    if (!result) {
      res.status(401).json({ error: "refresh token invalido" });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: result.userId },
    });
    if (!user || user.banned) {
      res.status(401).json({ error: "usuario no encontrado o suspendido" });
      return;
    }

    const tokens = await generateAuthTokens(user.id, user.role);
    // el nuevo refresh token ya se creo en rotateRefreshToken
    res.json({
      accessToken: tokens.accessToken,
      refreshToken: result.newToken,
    });
  }
);

// ⁘[ LOGOUT ]⁘

router.post(
  "/logout",
  authenticate,
  async (req: Request, res: Response): Promise<void> => {
    await revokeRefreshTokens(req.user!.userId);
    res.json({ message: "sesion cerrada" });
  }
);

// ⁘[ ME ~ PERFIL DEL USUARIO ACTUAL ]⁘

router.get(
  "/me",
  authenticate,
  async (req: Request, res: Response): Promise<void> => {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.userId },
    });
    if (!user) {
      res.status(404).json({ error: "usuario no encontrado" });
      return;
    }
    res.json(sanitizeUser(user));
  }
);

// ⁘[ HELPERS ]⁘

// nunca devolver el hash del password ~ por si acaso
function sanitizeUser(user: {
  id: string;
  email: string;
  name: string;
  avatar: string | null;
  bio: string | null;
  tastePreferences: string[];
  role: string;
  followerCount: number;
  followingCount: number;
  reviewCount: number;
  createdAt: Date;
}) {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    avatar: user.avatar,
    bio: user.bio,
    tastePreferences: user.tastePreferences,
    role: user.role,
    followerCount: user.followerCount,
    followingCount: user.followingCount,
    reviewCount: user.reviewCount,
    createdAt: user.createdAt,
  };
}

export default router;
