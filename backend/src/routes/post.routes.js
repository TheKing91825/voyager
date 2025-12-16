import { Router } from "express";
import { supabase } from "../supabase.js";
import { createPostSchema } from "../schemas/post.schema.js";

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 20, 50);
    const offset = (page - 1) * limit;

    const { data, error, count } = await supabase
      .from("posts")
      .select("*, profiles:profiles(username, profile_image_url)", { count: 'exact' })
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
      .from("posts")
      .select("*, profiles:profiles(username, profile_image_url)")
      .eq("id", id)
      .single();

    if (error) throw error;
    if (!data) {
      return res.status(404).json({ error: "Post not found" });
    }
    
    res.json(data);
  } catch (e) {
    next(e);
  }
});

router.post("/", async (req, res, next) => {
  try {
    // Validate input
    const validated = createPostSchema.parse(req.body);

    const { data, error } = await supabase
      .from("posts")
      .insert({ 
        user_id: req.user.id, 
        content: validated.content, 
        image_url: validated.image_url || null 
      })
      .select("*, profiles:profiles(username, profile_image_url)")
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (e) {
    next(e);
  }
});

// Get comments for a post
router.get("/:id/comments", async (req, res, next) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("comments")
      .select("*, profiles:profiles(username, profile_image_url)")
      .eq("post_id", id)
      .order("created_at", { ascending: true });

    if (error) throw error;
    res.json(data);
  } catch (e) {
    next(e);
  }
});

// Add a comment to a post
router.post("/:id/comments", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    if (!content || typeof content !== 'string' || content.trim().length === 0) {
      return res.status(400).json({ error: "Comment content is required" });
    }

    if (content.length > 1000) {
      return res.status(400).json({ error: "Comment too long (max 1000 characters)" });
    }

    const { data, error } = await supabase
      .from("comments")
      .insert({
        post_id: id,
        user_id: req.user.id,
        content: content.trim()
      })
      .select("*, profiles:profiles(username, profile_image_url)")
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (e) {
    next(e);
  }
});

export default router;
