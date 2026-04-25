// ⁘[ ADMIN ROUTES ]⁘

import { Router, Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../db.js";
import { authenticate, requireRole } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { param, queryStr, queryNum } from "../utils/helpers.js";

const router = Router();
router.use(authenticate, requireRole("ADMIN"));

// ⁘[ DASHBOARD STATS ]⁘

router.get("/stats", async (_req: Request, res: Response): Promise<void> => {
  const [users, establishments, reviews, pendingReports, pendingClaims] = await Promise.all([
    prisma.user.count(), prisma.establishment.count(), prisma.review.count(),
    prisma.report.count({ where: { status: "PENDING" } }),
    prisma.claimRequest.count({ where: { status: "PENDING" } }),
  ]);
  const byRole = await prisma.user.groupBy({ by: ["role"], _count: true });
  const byStatus = await prisma.establishment.groupBy({ by: ["status"], _count: true });
  res.json({
    users, establishments, reviews, pendingReports, pendingClaims,
    usersByRole: Object.fromEntries(byRole.map((r) => [r.role, r._count])),
    establishmentsByStatus: Object.fromEntries(byStatus.map((s) => [s.status, s._count])),
  });
});

// ⁘[ USER MANAGEMENT ]⁘

router.get("/users", async (req: Request, res: Response): Promise<void> => {
  const limit = Math.min(queryNum(req, "limit", 20), 50);
  const cursor = queryStr(req, "cursor");
  const role = queryStr(req, "role");
  const q = queryStr(req, "q");

  const where: Record<string, unknown> = {};
  if (role) where.role = role;
  if (q) {
    where.OR = [
      { name: { contains: q, mode: "insensitive" } },
      { email: { contains: q, mode: "insensitive" } },
    ];
  }

  const users = await prisma.user.findMany({
    where, take: limit + 1,
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    orderBy: { createdAt: "desc" },
    select: {
      id: true, email: true, name: true, avatar: true, role: true,
      banned: true, reviewCount: true, followerCount: true, createdAt: true,
    },
  });

  const hasMore = users.length > limit;
  const items = hasMore ? users.slice(0, limit) : users;
  res.json({ items, nextCursor: hasMore ? items[items.length - 1]!.id : null });
});

const updateUserSchema = z.object({
  role: z.enum(["EXPLORER", "CONNOISSEUR", "OWNER", "ADMIN"]).optional(),
  banned: z.boolean().optional(),
});

router.patch("/users/:id", validate(updateUserSchema), async (req: Request, res: Response): Promise<void> => {
  const id = param(req, "id");
  const user = await prisma.user.update({
    where: { id }, data: req.body,
    select: { id: true, email: true, name: true, role: true, banned: true },
  });
  await prisma.auditLog.create({
    data: { userId: req.user!.userId, action: "UPDATE_USER", target: "User", targetId: id, details: req.body },
  });
  res.json(user);
});

// ⁘[ ESTABLISHMENT MANAGEMENT ]⁘

const updateEstSchema = z.object({
  status: z.enum(["ACTIVE", "FLAGGED", "SUSPENDED", "REMOVED"]).optional(),
  verified: z.boolean().optional(),
  ownerId: z.string().nullable().optional(),
});

router.patch("/establishments/:id", validate(updateEstSchema), async (req: Request, res: Response): Promise<void> => {
  const id = param(req, "id");
  const est = await prisma.establishment.update({ where: { id }, data: req.body });
  await prisma.auditLog.create({
    data: { userId: req.user!.userId, action: "UPDATE_ESTABLISHMENT", target: "Establishment", targetId: id, details: req.body },
  });
  res.json(est);
});

router.delete("/establishments/:id", async (req: Request, res: Response): Promise<void> => {
  const id = param(req, "id");
  await prisma.establishment.update({ where: { id }, data: { status: "REMOVED" } });
  await prisma.auditLog.create({
    data: { userId: req.user!.userId, action: "REMOVE_ESTABLISHMENT", target: "Establishment", targetId: id },
  });
  res.json({ message: "establecimiento removido" });
});

// ⁘[ CLAIM REQUESTS ]⁘

router.get("/claims", async (req: Request, res: Response): Promise<void> => {
  const status = queryStr(req, "status");
  const where: Record<string, unknown> = {};
  if (status) where.status = status;

  const claims = await prisma.claimRequest.findMany({
    where, orderBy: { createdAt: "desc" },
    include: {
      user: { select: { id: true, name: true, email: true } },
      establishment: { select: { id: true, name: true, ownerId: true } },
    },
  });
  res.json(claims);
});

const resolveClaimSchema = z.object({
  status: z.enum(["APPROVED", "REJECTED"]),
  adminNotes: z.string().max(1000).optional(),
});

router.patch("/claims/:id", validate(resolveClaimSchema), async (req: Request, res: Response): Promise<void> => {
  const id = param(req, "id");
  const claim = await prisma.claimRequest.findUnique({ where: { id } });
  if (!claim) { res.status(404).json({ error: "claim no encontrado" }); return; }
  if (claim.status !== "PENDING") { res.status(400).json({ error: "ya fue procesado" }); return; }

  await prisma.claimRequest.update({
    where: { id },
    data: { status: req.body.status, adminNotes: req.body.adminNotes, reviewedById: req.user!.userId, reviewedAt: new Date() },
  });

  if (req.body.status === "APPROVED") {
    await prisma.establishment.update({ where: { id: claim.establishmentId }, data: { ownerId: claim.userId, verified: true } });
    await prisma.user.update({ where: { id: claim.userId }, data: { role: "OWNER" } });
  }

  await prisma.auditLog.create({
    data: {
      userId: req.user!.userId, action: `CLAIM_${req.body.status}`,
      target: "ClaimRequest", targetId: id,
      details: { establishmentId: claim.establishmentId, userId: claim.userId },
    },
  });
  res.json({ message: `claim ${req.body.status.toLowerCase()}` });
});

// ⁘[ AUDIT LOG ]⁘

router.get("/audit-log", async (req: Request, res: Response): Promise<void> => {
  const limit = Math.min(queryNum(req, "limit", 50), 100);
  const cursor = queryStr(req, "cursor");

  const logs = await prisma.auditLog.findMany({
    take: limit + 1,
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    orderBy: { createdAt: "desc" },
  });

  const hasMore = logs.length > limit;
  const items = hasMore ? logs.slice(0, limit) : logs;
  res.json({ items, nextCursor: hasMore ? items[items.length - 1]!.id : null });
});

export default router;
