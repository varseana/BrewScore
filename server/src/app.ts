// ⁘[ EXPRESS APP ]⁘

import express from "express";
import cors from "cors";
import { config } from "./config.js";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import establishmentRoutes from "./routes/establishments.js";
import reviewRoutes from "./routes/reviews.js";
import reportRoutes from "./routes/reports.js";
import claimRoutes from "./routes/claims.js";
import feedRoutes from "./routes/feed.js";
import adminRoutes from "./routes/admin.js";

const app = express();

// ⁘[ MIDDLEWARE GLOBAL ]⁘

app.use(cors({
  origin: config.clientUrl.split(",").map((u) => u.trim()),
  credentials: true,
}));
app.use(express.json({ limit: "5mb" }));

// ⁘[ HEALTH CHECK ]⁘

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// ⁘[ ROUTES ]⁘

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/establishments", establishmentRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/claims", claimRoutes);
app.use("/api/feed", feedRoutes);
app.use("/api/admin", adminRoutes);

// ⁘[ ERROR HANDLER ]⁘

app.use(
  (
    err: Error,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    console.error("error no manejado:", err);
    res.status(500).json({ error: "algo salio mal internamente" });
  }
);

export default app;
