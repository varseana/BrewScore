// ⁘[ CONFIG ~ VARIABLES DE ENTORNO ]⁘

function required(key: string): string {
  const val = process.env[key];
  if (!val) throw new Error(`falta variable de entorno: ${key}`);
  return val;
}

export const config = {
  port: parseInt(process.env.PORT || "3001", 10),
  clientUrl: process.env.CLIENT_URL || "http://localhost:5173",
  jwt: {
    secret: required("JWT_SECRET"),
    refreshSecret: required("JWT_REFRESH_SECRET"),
    // access token corto, refresh token largo
    accessExpiresIn: "15m",
    refreshExpiresIn: "7d",
    refreshExpiresMs: 7 * 24 * 60 * 60 * 1000,
  },
} as const;
