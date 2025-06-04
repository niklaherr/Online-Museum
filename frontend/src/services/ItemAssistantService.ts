// API Konfiguration
const MISTRAL_API_KEY = process.env.MISTRAL_API_KEY || "SpbqZllg57jFyYGIT0PnvGzn8QPAX5Hs";
const MISTRAL_API_URL = "https://api.mistral.ai/v1/chat/completions";

class ItemAssistantService {

  // Generiert eine Beschreibung basierend auf Titel und Kategorie
  async generateDescription(title: string, category: string): Promise<string> {
    if (!title || !category) {
      throw new Error("Titel und Kategorie sind erforderlich");
    }
    
    const prompt = `Erstelle eine klare, informative Beschreibung für ein Item mit dem Titel "${title}" aus der Kategorie "${category}". 
  Die Beschreibung sollte informativ und sachlich sein und maximal 3 Sätze umfassen.`
    
    console.log("Sende Anfrage an Mistral API mit Prompt:", prompt);
    
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
    
    // Detaillierte Fehlerbehandlung
    const responseText = await response.text();
    console.log("Mistral API Antwort:", responseText);
    
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      throw new Error("Erhaltene Daten konnten nicht verarbeitet werden");
    }
    
    if (!response.ok) {
      throw new Error("Konnte keine gültige Antwort vom API-Server erhalten");
    }
    
    const generatedDescription = data.choices?.[0]?.message?.content;
    
    if (!generatedDescription) {
      throw new Error("Keine Beschreibung generiert");
    }
    
    return generatedDescription
  }
}

export const itemAssistantService = new ItemAssistantService();