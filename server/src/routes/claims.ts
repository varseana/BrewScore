// ⁘[ CLAIM ROUTES ~ PARA OWNERS ]⁘

import { Router, Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../db.js";
import { authenticate } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";

const router = Router();

const createSchema = z.object({
  establishmentId: z.string(),
  proofDocuments: z.array(z.string().url()).min(1, "al menos un documento de prueba"),
  message: z.string().max(1000).optional(),
});

router.post(
  "/",
  authenticate,
  validate(createSchema),
  async (req: Request, res: Response): Promise<void> => {
    const est = await prisma.establishment.findUnique({
      where: { id: req.body.establishmentId },
    });
    if (!est) { res.status(404).json({ error: "establecimiento no encontrado" }); return; }
    if (est.ownerId) {
      res.status(409).json({ error: "este establecimiento ya tiene owner" });
      return;
    }

    // verificar que no tenga un claim pendiente
    const pending = await prisma.claimRequest.findFirst({
      where: {
        userId: req.user!.userId,
        establishmentId: req.body.establishmentId,
        status: "PENDING",
      },
    });
    if (pending) {
      res.status(409).json({ error: "ya tienes un claim pendiente para este establecimiento" });
      return;
    }

    const claim = await prisma.claimRequest.create({
      data: {
        userId: req.user!.userId,
        establishmentId: req.body.establishmentId,
        proofDocuments: req.body.proofDocuments,
        message: req.body.message,
      },
    });

    res.status(201).json(claim);
  }
);

// ver mis claims
router.get(
  "/mine",
  authenticate,
  async (req: Request, res: Response): Promise<void> => {
    const claims = await prisma.claimRequest.findMany({
      where: { userId: req.user!.userId },
      orderBy: { createdAt: "desc" },
      include: {
        establishment: { select: { id: true, name: true, city: true } },
      },
    });
    res.json(claims);
  }
);

export default router;
