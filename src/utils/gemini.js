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

    // Determine if this is a chat interaction or initial advice
    const isChatInteraction = !!userQuestion;

    if (isChatInteraction) {
      // CHAT MODE: Provide focused, conversational responses
      const chatContext = `
You are a friendly, knowledgeable plant care expert having a conversation with a plant owner. The user has already received comprehensive care advice for their plant, so don't repeat that information.

PLANT CONTEXT (already provided to user):
- Plant: ${plantName} (${scientificName})
- Health: ${isHealthy ? 'Healthy' : 'Has some issues'}
- Health Score: ${healthScore.toFixed(2)}/1.0

USER'S SPECIFIC QUESTION: ${userQuestion}

INSTRUCTIONS:
- Give a direct, helpful answer to their specific question
- Keep it conversational and friendly (like talking to a friend)
- Reference the plant context when relevant, but don't repeat the full care advice
- Keep responses concise (2-4 sentences max)
- Use a few relevant emojis naturally in the conversation
- Don't use formal section headers or bullet points
- Don't end with "encouraging message" - just answer naturally

Example response style:
"Based on your ${plantName}'s current health, I'd recommend watering when the top inch of soil feels dry. Since it's doing well overall, you can stick to a regular schedule. Just make sure it's not sitting in water! 💧🌱"
      `;

      console.log('Generating chat response...');
      const result = await model.generateContent(chatContext);
      const response = result.response;
      
      if (!response) {
        throw new Error('No response received from Gemini AI');
      }
      
      const text = response.text();
      
      if (!text || text.trim().length === 0) {
        throw new Error('Empty response received from Gemini AI');
      }
      
      return text;
    } else {
      // INITIAL ADVICE MODE: Provide comprehensive formatted care advice
      const context = `
You are an expert plant care advisor with a warm, encouraging personality. Based on the following plant analysis, provide helpful, actionable advice that promotes environmental awareness and sustainable living.

IMPORTANT: Format your response with these requirements:
- Use bullet points (•) for all care tips and recommendations
- Include relevant emojis for visual appeal (🌱💧☀️🌿🌍♻️ etc.)
- Organize information in clear sections with emoji headers
- End with an encouraging, motivational message
- Keep advice practical, actionable, and beginner-friendly
- Use clear, encouraging language throughout

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

Please provide your response in this exact format:

🌿 Plant Care Summary
[Brief summary of current condition]

💧 Care Recommendations
[Bullet points with emojis for specific care needs]

☀️ General Care Tips
[Bullet points with emojis for watering, lighting, soil, etc.]

🌱 Seasonal Care
[Bullet points with emojis for seasonal considerations]

🌟 Encouraging Message
[End with a motivational, encouraging message about plant care and environmental stewardship]
      `;

      console.log('Generating comprehensive AI advice...');
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
    }
  } catch (error) {
    console.error('Error generating advice:', error);
    
    // Provide fallback advice if AI fails
    if (error.message.includes('API key')) {
      throw error; // Re-throw API key errors
    }
    
    // Create appropriate fallback based on interaction type
    const plantName = plantInfo?.name || 'your plant';
    const isHealthy = healthInfo?.isHealthy ?? true;
    
    if (userQuestion) {
      // Chat mode fallback
      return `I'm having trouble accessing my full knowledge right now, but I can help with general plant care questions! For your ${plantName}, I'd recommend checking the care advice above for specific details. What would you like to know more about? 🌱`;
    } else {
      // Initial advice mode fallback
      const fallbackAdvice = `
🌿 Plant Care Summary
✅ Your ${plantName} is ready for some TLC! ${isHealthy ? 'It appears to be in good health, but there\'s always room for improvement.' : 'Some issues have been detected that need attention, but don\'t worry - we can fix this together!'}

💧 Care Recommendations
• 💧 Check soil moisture regularly - most plants prefer soil that's slightly moist but not waterlogged
• 🌱 Ensure proper drainage to prevent root rot
• 🌿 Monitor for any changes in leaf color or texture
• 🌍 Consider the plant's natural habitat when creating care routines

☀️ General Care Tips
• 💧 Water when the top inch of soil feels dry to the touch
• ☀️ Provide bright, indirect light for most houseplants
• 🌱 Use well-draining potting soil appropriate for your plant type
• 🌿 Maintain consistent room temperature (65-75°F / 18-24°C)
• 💨 Ensure good air circulation around your plant
• 🌱 Repot when roots become crowded (usually every 1-2 years)

🌱 Seasonal Care
• 🌸 Spring: Increase watering and consider repotting if needed
• ☀️ Summer: Monitor for pests and provide extra humidity if needed
• 🍂 Fall: Reduce watering as growth slows down
• ❄️ Winter: Reduce watering and avoid cold drafts

🌟 Encouraging Message
Remember, every plant parent starts somewhere! Your ${plantName} is lucky to have someone who cares enough to seek advice. Plant care is a journey of learning and growth - just like your plants, you'll get better with time. Every small step you take toward better plant care is also a step toward a greener, more sustainable world. Keep growing! 🌱✨

*Note: AI plant advisor is temporarily unavailable, but these enhanced guidelines should help keep your plant healthy and happy.*
      `;
      
      return fallbackAdvice;
    }
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