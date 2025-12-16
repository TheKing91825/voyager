import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import compression from "compression";

import { authRequired } from "./middleware/authRequired.js";
import { errorHandler } from "./middleware/errorHandler.js";
import profileRoutes from "./routes/profile.routes.js";
import postRoutes from "./routes/post.routes.js";
import tripRoutes from "./routes/trip.routes.js";
import aiRoutes from "./routes/ai.routes.js";

dotenv.config();

const app = express();

// Rate limiting
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: { error: "Too many requests, please try again later." }
});

const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // stricter limit for AI endpoints
  message: { error: "Too many AI requests, please try again later." }
});

// Middleware
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: "2mb" }));
app.use(helmet());
app.use(morgan("dev"));
app.use(compression());

app.get("/health", (req, res) => res.json({ ok: true }));

// Public routes (none yet except health)
// Basic health check
app.get("/", (req, res) => {
  res.json({ status: "VoyAIger backend running 🚀" });
});

// Protected routes with rate limiting
app.use("/api/profile", generalLimiter, authRequired, profileRoutes);
app.use("/api/posts", generalLimiter, authRequired, postRoutes);
app.use("/api/trips", generalLimiter, authRequired, tripRoutes);
app.use("/api/ai", aiLimiter, authRequired, aiRoutes);

// Error handler (last)
app.use(errorHandler);

const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Backend running on http://localhost:${port}`));
