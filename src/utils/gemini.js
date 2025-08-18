import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Generate plant advice based on analysis
export const generatePlantAdvice = async (plantInfo, healthInfo, userQuestion = "") => {
  try {
    const context = `
You are an expert plant care advisor. Based on the following plant analysis, provide helpful, actionable advice.

PLANT IDENTIFICATION:
- Plant Name: ${plantInfo.name}
- Common Names: ${plantInfo.commonNames.join(', ')}
- Scientific Name: ${plantInfo.scientificName}
- Identification Confidence: ${(plantInfo.confidence * 100).toFixed(1)}%

HEALTH ASSESSMENT:
- Overall Health: ${healthInfo.isHealthy ? 'Healthy' : 'Issues Detected'}
- Health Score: ${healthInfo.healthScore.toFixed(2)}/1.0

${healthInfo.diseases.length > 0 ? `
DETECTED ISSUES:
${healthInfo.diseases.map(disease => `
- Issue: ${disease.name} (Confidence: ${(disease.probability * 100).toFixed(1)}%)
  Description: ${disease.description}
  Likely Cause: ${disease.cause}
  Treatment: ${disease.treatment}
`).join('')}
` : ''}

${userQuestion ? `USER QUESTION: ${userQuestion}` : ''}

Please provide:
1. A summary of the plant's current condition
2. Specific care recommendations based on identified issues (if any)
3. General care tips for this plant species
4. Answer to user question (if provided)

Keep advice practical, actionable, and beginner-friendly.
    `;

    const result = await model.generateContent(context);
    return result.response.text();
  } catch (error) {
    console.error('Error generating advice:', error);
    throw error;
  }
};