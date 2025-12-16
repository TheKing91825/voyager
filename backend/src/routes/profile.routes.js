import { Router } from "express";
import { supabase } from "../supabase.js";

const router = Router();

// Get my profile
router.get("/me", async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", req.user.id)
      .single();

    if (error) throw error;
    res.json(data);
  } catch (e) {
    next(e);
  }
});

// Update my profile (partial)
router.patch("/me", async (req, res, next) => {
  try {
    const updates = req.body;

    const { data, error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", req.user.id)
      .select("*")
      .single();

    if (error) throw error;
    res.json(data);
  } catch (e) {
    next(e);
  }
});

export default router;