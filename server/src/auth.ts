// ⁘[ AUTH UTILS ~ JWT + HASHING ]⁘

import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { config } from "./config.js";
import { prisma } from "./db.js";

// ⁘[ TIPOS ]⁘

export interface TokenPayload {
  userId: string;
  role: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

// ⁘[ PASSWORD ]⁘

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// ⁘[ TOKENS ]⁘

export function generateAccessToken(payload: TokenPayload): string {
  return jwt.sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.accessExpiresIn,
  });
}

export function verifyAccessToken(token: string): TokenPayload {
  return jwt.verify(token, config.jwt.secret) as TokenPayload;
}

export async function generateRefreshToken(userId: string): Promise<string> {
  const token = crypto.randomBytes(40).toString("hex");
  await prisma.refreshToken.create({
    data: {
      token,
      userId,
      expiresAt: new Date(Date.now() + config.jwt.refreshExpiresMs),
    },
  });
  return token;
}

export async function rotateRefreshToken(
  oldToken: string
): Promise<{ userId: string; newToken: string } | null> {
  const record = await prisma.refreshToken.findUnique({
    where: { token: oldToken },
  });
  if (!record || record.expiresAt < new Date()) {
    // token invalido o expirado ~ limpiar si existe
    if (record) await prisma.refreshToken.delete({ where: { id: record.id } });
    return null;
  }
  // borrar el viejo y crear uno nuevo ~ rotacion
  await prisma.refreshToken.delete({ where: { id: record.id } });
  const newToken = await generateRefreshToken(record.userId);
  return { userId: record.userId, newToken };
}

export async function revokeRefreshTokens(userId: string): Promise<void> {
  await prisma.refreshToken.deleteMany({ where: { userId } });
}

// ⁘[ TOKENS COMBO ]⁘

export async function generateAuthTokens(
  userId: string,
  role: string
): Promise<AuthTokens> {
  const accessToken = generateAccessToken({ userId, role });
  const refreshToken = await generateRefreshToken(userId);
  return { accessToken, refreshToken };
}
