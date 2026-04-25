// ⁘[ MIDDLEWARE ~ AUTH + ROLES ]⁘

import { Request, Response, NextFunction } from "express";
import { verifyAccessToken, TokenPayload } from "../auth.js";

// extender request para que typescript no llore
declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

// ⁘[ AUTHENTICATE ]⁘
// verifica que el token sea valido ~ no importa el rol

export function authenticate(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    res.status(401).json({ error: "token requerido" });
    return;
  }
  try {
    req.user = verifyAccessToken(header.slice(7));
    next();
  } catch {
    res.status(401).json({ error: "token invalido o expirado" });
  }
}

// ⁘[ OPTIONAL AUTH ]⁘
// si hay token lo parsea, si no pues sigue sin user

export function optionalAuth(
  req: Request,
  _res: Response,
  next: NextFunction
): void {
  const header = req.headers.authorization;
  if (header?.startsWith("Bearer ")) {
    try {
      req.user = verifyAccessToken(header.slice(7));
    } catch {
      // token malo pero no importa ~ es opcional
    }
  }
  next();
}

// ⁘[ REQUIRE ROLE ]⁘
// solo deja pasar si el usuario tiene el rol correcto

export function requireRole(...roles: string[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: "no autenticado" });
      return;
    }
    if (!roles.includes(req.user.role)) {
      res.status(403).json({ error: "no tienes permiso para esto" });
      return;
    }
    next();
  };
}
