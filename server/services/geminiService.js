const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

/**
 * Generate AI-based content from a prompt.
 * @param {string} prompt - The prompt to send to the AI model.
 * @returns {Promise<string>} AI-generated response.
 */
const analyzePerformance = async (prompt) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
    });

    return response.text.trim();
  } catch (error) {
    console.error("Error generating AI insights:", error);
    return "AI insights are unavailable at the moment.";
  }
};

module.exports = { analyzePerformance };
