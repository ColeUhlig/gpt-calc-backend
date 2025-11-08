// routes/googleApi.ts
import express from "express";
import { GoogleGenAI } from "@google/genai";

const GEMINI_API_KEY = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY;
const MODEL = "gemini-2.5-flash";

if (!GEMINI_API_KEY) {
  throw new Error("set ur api key in ur env file");
}

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

export async function googleApi() {
  const routes = express.Router();

  routes.get("/ask", async (req, res) => {
    const questionParam = req.query.question ?? "";
    if (Array.isArray(questionParam)) return res.sendStatus(400);
    const question = String(questionParam);

    try {
      const response = await ai.models.generateContent({
        model: MODEL,
        contents: question,
        systemInstruction: "Do not use emojis. Do not use symbols.",
        config: {
          temperature: 1,
          topK: 64,
          topP: 0.95,
          maxOutputTokens: 1024,
          responseMimeType: "text/plain",
        },
      });

      res.send(response.text ?? "No response (EMPTY)");
    } catch (err) {
      console.error(err);
      res.sendStatus(500);
    }
  });

  return routes;
}
