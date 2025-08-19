// FILE: src/utils/gemini.js
import { GoogleGenerativeAI } from "@google/generative-ai";

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.warn('Gemini API key is not configured. Please add VITE_GEMINI_API_KEY to your .env file.');
}

const genAI = GEMINI_API_KEY ? new GoogleGenerativeAI(GEMINI_API_KEY) : null;
const model = genAI ? genAI.getGenerativeModel({ model: "gemini-1.5-flash" }) : null;

// Generate plant advice based on analysis
export const generatePlantAdvice = async (plantInfo, healthInfo, userQuestion = "") => {
  try {
    // Check if Gemini is configured
    if (!GEMINI_API_KEY || !model) {
      throw new Error('Gemini API key is not configured. Please add VITE_GEMINI_API_KEY to your .env file.');
    }

    // Validate input data
    if (!plantInfo && !healthInfo) {
      throw new Error('No plant or health information provided');
    }

    // Safely extract information with fallbacks
    const plantName = plantInfo?.name || 'Unknown plant';
    const commonNames = plantInfo?.commonNames || [];
    const scientificName = plantInfo?.scientificName || 'Unknown species';
    const confidence = plantInfo?.confidence || 0;
    
    const isHealthy = healthInfo?.isHealthy ?? true;
    const healthScore = healthInfo?.healthScore || 1.0;
    const diseases = healthInfo?.diseases || [];

    const context = `
You are an expert plant care advisor. Based on the following plant analysis, provide helpful, actionable advice.

PLANT IDENTIFICATION:
- Plant Name: ${plantName}
- Common Names: ${commonNames.length > 0 ? commonNames.join(', ') : 'None available'}
- Scientific Name: ${scientificName}
- Identification Confidence: ${(confidence * 100).toFixed(1)}%

HEALTH ASSESSMENT:
- Overall Health: ${isHealthy ? 'Healthy' : 'Issues Detected'}
- Health Score: ${healthScore.toFixed(2)}/1.0

${diseases.length > 0 ? `
DETECTED ISSUES:
${diseases.map(disease => `
- Issue: ${disease.name || 'Unknown issue'} (Confidence: ${((disease.probability || 0) * 100).toFixed(1)}%)
  Description: ${disease.description || 'No description available'}
  Likely Cause: ${disease.cause || 'Cause unknown'}
  Treatment: ${disease.treatment || 'Treatment information not available'}
`).join('')}
` : ''}

${userQuestion ? `USER QUESTION: ${userQuestion}` : ''}

Please provide:
1. A brief summary of the plant's current condition
2. Specific care recommendations based on identified issues (if any)
3. General care tips for this plant species (watering, lighting, soil, etc.)
4. Seasonal care advice if relevant
${userQuestion ? '5. A direct answer to the user\'s specific question' : ''}

Keep advice practical, actionable, and beginner-friendly. Use clear, encouraging language.
Format your response in a readable way with clear sections.
    `;

    console.log('Generating AI advice...');
    const result = await model.generateContent(context);
    const response = result.response;
    
    if (!response) {
      throw new Error('No response received from Gemini AI');
    }
    
    const text = response.text();
    
    if (!text || text.trim().length === 0) {
      throw new Error('Empty response received from Gemini AI');
    }
    
    return text;
  } catch (error) {
    console.error('Error generating advice:', error);
    
    // Provide fallback advice if AI fails
    if (error.message.includes('API key')) {
      throw error; // Re-throw API key errors
    }
    
    // Create fallback advice
    const plantName = plantInfo?.name || 'your plant';
    const isHealthy = healthInfo?.isHealthy ?? true;
    
    const fallbackAdvice = `
# Plant Care Advice for ${plantName}

## Current Condition
${isHealthy ? 
  '✅ Your plant appears to be in good health!' : 
  '⚠️ Some issues have been detected that need attention.'}

## General Care Tips
- **Watering**: Check soil moisture regularly. Most plants prefer soil that's slightly moist but not waterlogged.
- **Lighting**: Ensure your plant gets appropriate light for its species. Most houseplants prefer bright, indirect light.
- **Humidity**: Many plants benefit from increased humidity, especially in dry indoor environments.
- **Temperature**: Keep your plant in a stable temperature range, away from drafts and heating/cooling vents.

${healthInfo?.diseases?.length > 0 ? `
## Detected Issues
${healthInfo.diseases.map(disease => `- **${disease.name}**: ${disease.description || 'Monitor this condition and consider appropriate treatment.'}`).join('\n')}
` : ''}

## Next Steps
1. Monitor your plant daily for any changes
2. Adjust care routine based on the plant's response
3. Consider consulting local gardening resources for species-specific advice

*Note: AI plant advisor is temporarily unavailable, but these general guidelines should help keep your plant healthy.*
    `;
    
    return fallbackAdvice;
  }
};

// Test Gemini connection
export const testGeminiConnection = async () => {
  try {
    if (!GEMINI_API_KEY || !model) {
      throw new Error('Gemini API key not configured');
    }
    
    const result = await model.generateContent('Hello, this is a test message. Please respond with "Connection successful".');
    const response = result.response.text();
    console.log('Gemini connection test:', response);
    return true;
  } catch (error) {
    console.error('Gemini connection test failed:', error);
    return false;
  }
};