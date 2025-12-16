import { Router } from "express";
import { supabase } from "../supabase.js";
import { createTripSchema } from "../schemas/trip.schema.js";

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 20, 50);
    const offset = (page - 1) * limit;

    const { data, error, count } = await supabase
      .from("trips")
      .select("*", { count: 'exact' })
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;
    
    res.json({
      data,
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil(count / limit)
      }
    });
  } catch (e) {
    next(e);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("trips")
      .select("*, profiles:profiles(username, profile_image_url)")
      .eq("id", id)
      .single();

    if (error) throw error;
    if (!data) {
      return res.status(404).json({ error: "Trip not found" });
    }
    
    res.json(data);
  } catch (e) {
    next(e);
  }
});

router.post("/", async (req, res, next) => {
  try {
    // Validate input
    const validated = createTripSchema.parse(req.body);

    const { data, error } = await supabase
      .from("trips")
      .insert({
        owner_id: req.user.id,
        name: validated.name,
        location: validated.location,
        start_date: validated.start_date,
        end_date: validated.end_date,
        description: validated.description || null
      })
      .select("*")
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (e) {
    next(e);
  }
});

export default router;
