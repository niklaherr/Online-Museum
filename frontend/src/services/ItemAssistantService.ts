// API configuration
const MISTRAL_API_KEY = process.env.REACT_APP_MISTRAL_API_KEY || "nokey";
const MISTRAL_API_URL = "https://api.mistral.ai/v1/chat/completions";

class ItemAssistantService {

  // Generates a description based on title and category
  async generateDescription(title: string, category: string): Promise<string> {
    // Validate input parameters
    if (!title || !category) {
      throw new Error("Titel und Kategorie sind erforderlich");
    }
    
    // Build the prompt for the API
    const prompt = `Erstelle eine klare, informative Beschreibung für ein Item mit dem Titel "${title}" aus der Kategorie "${category}". 
  Die Beschreibung sollte informativ und sachlich sein und maximal 3 Sätze umfassen.`
    
    // Log the prompt for debugging
    console.log("Sende Anfrage an Mistral API mit Prompt:", prompt);
    
    // Send POST request to Mistral API
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
    
    // Read and log the raw response text
    const responseText = await response.text();
    console.log("Mistral API Antwort:", responseText);
    
    let data;
    try {
      // Parse the response as JSON
      data = JSON.parse(responseText);
    } catch (parseError) {
      // Handle JSON parsing errors
      throw new Error("Erhaltene Daten konnten nicht verarbeitet werden");
    }
    
    // Check for HTTP errors
    if (!response.ok) {
      throw new Error("Konnte keine gültige Antwort vom API-Server erhalten");
    }
    
    // Extract the generated description from the response
    const generatedDescription = data.choices?.[0]?.message?.content;
    
    // Handle missing description
    if (!generatedDescription) {
      throw new Error("Keine Beschreibung generiert");
    }
    
    // Return the generated description
    return generatedDescription
  }
}

// Export a singleton instance of the service
export const itemAssistantService = new ItemAssistantService();