// backend/services/ItemAssistantService.js

const fetch = require('node-fetch');
const express = require('express');
const router = express.Router();

// API Konfiguration
const MISTRAL_API_KEY = process.env.MISTRAL_API_KEY || "SpbqZllg57jFyYGIT0PnvGzn8QPAX5Hs";
const MISTRAL_API_URL = "https://api.mistral.ai/v1/chat/completions";

// Beschreibungs-Prompt erstellen
const generateDescriptionPrompt = (title, category) => {
  return `Erstelle eine klare, informative Beschreibung für ein Item mit dem Titel "${title}" aus der Kategorie "${category}". 
  Die Beschreibung sollte informativ und sachlich sein und maximal 3 Sätze umfassen.`;
};

// Route zur Beschreibungsgenerierung
router.post('/generate-description', async (req, res) => {
  try {
    const { title, category } = req.body;
    
    if (!title || !category) {
      return res.status(400).json({ 
        error: "Titel und Kategorie sind erforderlich." 
      });
    }
    
    const prompt = generateDescriptionPrompt(title, category);
    
    // API-Anfrage an Mistral senden
    const response = await fetch(MISTRAL_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${MISTRAL_API_KEY}`
      },
      body: JSON.stringify({
        model: "mistral-tiny",
        messages: [
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7
      })
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      return res.status(response.status).json({ 
        error: data.error?.message || "API-Anfrage fehlgeschlagen" 
      });
    }
    
    const generatedDescription = data.choices?.[0]?.message?.content;
    
    if (!generatedDescription) {
      return res.status(500).json({ 
        error: "Keine Beschreibung generiert" 
      });
    }
    
    return res.json({ description: generatedDescription.trim() });
  } catch (error) {
    console.error("Fehler bei der Beschreibungsgenerierung:", error);
    return res.status(500).json({ 
      error: "Fehler bei der Beschreibungsgenerierung" 
    });
  }
});

module.exports = router;