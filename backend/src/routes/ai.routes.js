import { Router } from "express";
import fetch from "node-fetch";

const router = Router();

router.post("/explore", async (req, res, next) => {
  try {
    const { prompt, numActivities } = req.body;

    // Validation
    if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
      return res.status(400).json({ error: 'Valid prompt is required' });
    }
    
    const num = parseInt(numActivities) || 5;
    if (num < 1 || num > 20) {
      return res.status(400).json({ error: 'numActivities must be between 1 and 20' });
    }

    const finalPrompt = `
You are Voyager, a travel assistant.
User wants ${num} activities for: ${prompt.trim()}
Return a JSON array with exactly ${num} activities.
Each activity must have: name (string), description (string), category (string), latitude (number, optional), longitude (number, optional).
Respond ONLY with valid JSON array, no markdown, no code blocks, no extra text.
`;

    const url =
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" +
      process.env.GEMINI_API_KEY;

    const r = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: finalPrompt }] }]
      })
    });

    if (!r.ok) {
      throw new Error(`Gemini API error: ${r.status} ${r.statusText}`);
    }

    const json = await r.json();
    
    // Extract the text response from Gemini's structure
    const text = json.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
      throw new Error('Invalid response structure from Gemini API');
    }

    // Try to parse the response as JSON
    try {
      // Remove any markdown code blocks if present
      const cleanedText = text.replace(/```json\n?|\n?```/g, '').trim();
      const activities = JSON.parse(cleanedText);
      
      // Validate it's an array
      if (!Array.isArray(activities)) {
        throw new Error('Response is not an array');
      }
      
      res.json({ activities });
    } catch (parseError) {
      // If JSON parsing fails, return the raw text
      console.error('Failed to parse Gemini response:', parseError);
      res.json({ 
        activities: [], 
        rawResponse: text,
        error: 'Failed to parse AI response as JSON'
      });
    }
  } catch (e) {
    next(e);
  }
});

export default router;
