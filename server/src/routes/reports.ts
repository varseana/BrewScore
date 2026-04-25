// ⁘[ REPORT ROUTES ~ SISTEMA DE CONFIANZA ]⁘

import { Router, Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../db.js";
import { authenticate, requireRole } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { param, queryStr, queryNum } from "../utils/helpers.js";

const router = Router();

// ⁘[ CREATE REPORT ]⁘

const createSchema = z.object({
  establishmentId: z.string(),
  reason: z.enum(["MISLEADING_INFO", "FALSE_PROCEDURES", "FAKE_EQUIPMENT", "OTHER"]),
  description: z.string().min(10).max(2000),
  evidence: z.array(z.string().url()).max(5).optional(),
});

router.post(
  "/",
  authenticate,
  validate(createSchema),
  async (req: Request, res: Response): Promise<void> => {
    const est = await prisma.establishment.findUnique({ where: { id: req.body.establishmentId } });
    if (!est || est.status === "REMOVED") { res.status(404).json({ error: "no encontrado" }); return; }
    if (est.ownerId === req.user!.userId) { res.status(403).json({ error: "no puedes reportar tu propio establecimiento" }); return; }

    const report = await prisma.report.create({
      data: {
        reporterId: req.user!.userId,
        establishmentId: req.body.establishmentId,
        reason: req.body.reason,
        description: req.body.description,
        evidence: req.body.evidence || [],
      },
    });
    res.status(201).json(report);
  }
);

// ⁘[ LIST REPORTS ~ ADMIN ]⁘

router.get(
  "/",
  authenticate, requireRole("ADMIN"),
  async (req: Request, res: Response): Promise<void> => {
    const status = queryStr(req, "status");
    const limit = Math.min(queryNum(req, "limit", 20), 50);
    const cursor = queryStr(req, "cursor");

    const where: Record<string, unknown> = {};
    if (status) where.status = status;

    const reports = await prisma.report.findMany({
      where,
      take: limit + 1,
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
      orderBy: { createdAt: "desc" },
      include: {
        reporter: { select: { id: true, name: true } },
        establishment: { select: { id: true, name: true, status: true } },
        strike: true,
      },
    });

    const hasMore = reports.length > limit;
    const items = hasMore ? reports.slice(0, limit) : reports;
    res.json({ items, nextCursor: hasMore ? items[items.length - 1]!.id : null });
  }
);

// ⁘[ RESOLVE REPORT ~ ADMIN ]⁘

const resolveSchema = z.object({
  status: z.enum(["RESOLVED", "DISMISSED"]),
  adminNotes: z.string().max(1000).optional(),
  issueStrike: z.boolean().optional(),
  strikeReason: z.string().max(500).optional(),
});

router.patch(
  "/:id/resolve",
  authenticate, requireRole("ADMIN"),
  validate(resolveSchema),
  async (req: Request, res: Response): Promise<void> => {
    const id = param(req, "id");
    const report = await prisma.report.findUnique({
      where: { id },
      include: { establishment: true },
    });
    if (!report) { res.status(404).json({ error: "reporte no encontrado" }); return; }
    if (report.status !== "PENDING" && report.status !== "INVESTIGATING") {
      res.status(400).json({ error: "este reporte ya fue resuelto" }); return;
    }

    await prisma.report.update({
      where: { id },
      data: { status: req.body.status, adminNotes: req.body.adminNotes, resolvedAt: new Date() },
    });

    if (req.body.issueStrike && req.body.status === "RESOLVED") {
      await prisma.strike.create({
        data: {
          establishmentId: report.establishmentId,
          reportId: report.id,
          reason: req.body.strikeReason || report.description,
          issuedById: req.user!.userId,
        },
      });

      const strikeCount = await prisma.strike.count({ where: { establishmentId: report.establishmentId } });
      let newStatus = report.establishment.status;
      if (strikeCount >= 3) newStatus = "SUSPENDED";
      else if (strikeCount >= 2) newStatus = "FLAGGED";

      if (newStatus !== report.establishment.status) {
        await prisma.establishment.update({
          where: { id: report.establishmentId },
          data: { status: newStatus },
        });
      }

      await prisma.auditLog.create({
        data: {
          userId: req.user!.userId,
          action: "ISSUE_STRIKE",
          target: "Establishment",
          targetId: report.establishmentId,
          details: { strikeCount, newStatus, reportId: report.id },
        },
      });
    }

    res.json({ message: "reporte resuelto" });
  }
);

// ⁘[ STRIKES FOR ESTABLISHMENT ]⁘

router.get(
  "/strikes/:estId",
  authenticate,
  async (req: Request, res: Response): Promise<void> => {
    const estId = param(req, "estId");
    const est = await prisma.establishment.findUnique({ where: { id: estId } });
    if (!est) { res.status(404).json({ error: "no encontrado" }); return; }
    if (req.user!.role !== "ADMIN" && est.ownerId !== req.user!.userId) {
      res.status(403).json({ error: "no tienes permiso" }); return;
    }

    const strikes = await prisma.strike.findMany({
      where: { establishmentId: estId },
      orderBy: { issuedAt: "desc" },
      include: { report: { select: { id: true, reason: true, description: true } } },
    });
    res.json(strikes);
  }
);

export default router;
