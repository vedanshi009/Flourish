// FILE: src/utils/gemini.js
// ... (imports and constants at the top remain the same)

// Generate plant advice based on analysis
export const generatePlantAdvice = async (plantInfo, healthInfo, userQuestion = "") => {
  try {
    if (!GEMINI_API_KEY || !model) {
      throw new Error('Gemini API key is not configured.');
    }

    if (!plantInfo && !healthInfo) {
      throw new Error('No plant or health information provided');
    }

    const plantName = plantInfo?.name || 'Unknown plant';
    const scientificName = plantInfo?.scientificName || 'Unknown species';
    const confidence = plantInfo?.confidence || 0;
    const isHealthy = healthInfo?.isHealthy ?? true;
    const diseases = healthInfo?.diseases || [];

    const isChatInteraction = !!userQuestion;

    if (isChatInteraction) {
      // Chat interaction 
      const chatContext = `
        You are a friendly, knowledgeable plant care expert in a conversation.
        PLANT CONTEXT: ${plantName} (${scientificName}), Health: ${isHealthy ? 'Healthy' : 'Has issues'}.
        USER'S QUESTION: ${userQuestion}
        INSTRUCTIONS: Give a direct, helpful, and concise answer (2-4 sentences max). Use a few emojis naturally. Do not repeat full care advice.
      `;
      const result = await model.generateContent(chatContext);
      return result.response.text();
    } else {
      
      const context = `
        You are an expert plant care advisor. Provide helpful, actionable advice with a warm, encouraging tone.
        
        IMPORTANT: Format your response using Markdown. Use bold for headings (e.g., **🌿 Plant Care Summary**). Use bullet points (•) for lists. Use emojis like 🌱💧☀️ naturally.

        PLANT ID: ${plantName} (${scientificName}), Confidence: ${(confidence * 100).toFixed(1)}%
        HEALTH: ${isHealthy ? 'Healthy' : `Issues Detected: ${diseases.map(d => d.name).join(', ')}`}

        Please provide your response in this exact format:
        **🌿 Plant Care Summary**
        [Brief summary]
        **💧 Care Recommendations**
        [Bullet points]
        **☀️ General Care Tips**
        [Bullet points]
        🌟
        [Motivational message]
      `;
      
      const result = await model.generateContent(context);
      return result.response.text();
    }
  } catch (error) {
    console.error('Error generating advice:', error);
    
    if (error.message.includes('API key')) {
      throw error;
    }
    
    const plantName = plantInfo?.name || 'your plant';
    if (userQuestion) {
      return `I'm having trouble accessing my full knowledge right now, but I can help with general questions about your ${plantName}! What would you like to know? 🌱`;
    }
    
    
    return `
      **🌿 Plant Care Summary**
      ✅ Your ${plantName} is ready for some TLC! 
      
      **💧 Care Recommendations**
      • 💧 Check soil moisture regularly.
      • 🌱 Ensure proper drainage to prevent root rot.

      **☀️ General Care Tips**
      • 💧 Water when the top inch of soil feels dry.
      • ☀️ Provide bright, indirect light.

      🌟
      Plant care is a journey of learning and growth. Keep going! 🌱✨

      *Note: AI advisor is temporarily unavailable, but these general guidelines should help.*
    `;
    
  }
};