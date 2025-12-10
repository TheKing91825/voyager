import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { supabase } from "./supabase.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Basic health check
app.get("/", (req, res) => {
  res.json({ status: "VoyAIger backend running 🚀" });
});

// Example test route with DB query
app.get("/test", async (req, res) => {
  const { data, error } = await supabase.from("users").select("*");

  if (error) return res.status(500).json({ error });
  res.json(data);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Backend running at http://localhost:${PORT}`));