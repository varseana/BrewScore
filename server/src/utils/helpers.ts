// ⁘[ HELPERS ]⁘

import { Request } from "express";

// express 5 types req.params values as string | string[]
// esto lo castea a string para que typescript no llore
export function param(req: Request, key: string): string {
  const val = req.params[key];
  return Array.isArray(val) ? val[0]! : val ?? "";
}

export function queryStr(req: Request, key: string): string | undefined {
  const val = req.query[key];
  if (!val) return undefined;
  return Array.isArray(val) ? String(val[0]) : String(val);
}

export function queryNum(req: Request, key: string, fallback: number): number {
  const val = queryStr(req, key);
  if (!val) return fallback;
  const n = parseInt(val, 10);
  return isNaN(n) ? fallback : n;
}
