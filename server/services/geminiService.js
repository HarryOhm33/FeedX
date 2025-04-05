const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

/**
 * Generate AI-based performance insights.
 * @param {Object} dashboardData - The structured data from the database.
 * @returns {Promise<string>} AI-generated insights.
 */
const analyzePerformance = async (dashboardData) => {
  try {
    const prompt = `
      Given the following performance data:

      ${JSON.stringify(dashboardData, null, 2)}

      Provide a **concise** (1-2 small sentences with 20 words max) **performance analysis** with:
      - **Key trends** (progress, issues, improvements).
      - **Actionable recommendations** (next steps, optimizations).
      - Avoid generic statements. Make it **direct and insightful**.
    `;

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
