// ⁘[ VALIDATION MIDDLEWARE ]⁘

import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";

// valida body contra un schema de zod ~ si falla devuelve 400 con los errores
export function validate(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        res.status(400).json({
          error: "datos invalidos",
          details: err.errors.map((e) => ({
            field: e.path.join("."),
            message: e.message,
          })),
        });
        return;
      }
      next(err);
    }
  };
}
