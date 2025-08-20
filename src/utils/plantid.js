// FILE: src/utils/plantid.js 
// Plant.id API integration - Only calls API when user explicitly uploads an image

const PLANTID_API_KEY = import.meta.env.VITE_PLANTID_API_KEY;
const PLANTID_BASE_URL = "https://plant.id/api/v3";

// Enhanced image preprocessing for better results
const preprocessImage = async (file) => {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error('No file provided'));
      return;
    }
    
    if (!file.type.startsWith('image/')) {
      reject(new Error('File must be an image'));
      return;
    }

    // Check file size (Plant.id recommends max 10MB, but 5MB is usually sufficient)
    if (file.size > 5 * 1024 * 1024) {
      reject(new Error('Image too large. Please use an image smaller than 5MB.'));
      return;
    }

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      try {
        // Optimize image dimensions (Plant.id works best with 1024-2048px on longest side)
        const maxDimension = 1536;
        let { width, height } = img;
        
        if (width > maxDimension || height > maxDimension) {
          const ratio = Math.min(maxDimension / width, maxDimension / height);
          width *= ratio;
          height *= ratio;
        }
        
        canvas.width = width;
        canvas.height = height;
        
        // Draw and enhance image
        ctx.drawImage(img, 0, 0, width, height);
        
        // Convert to base64 with optimal quality
        const base64 = canvas.toDataURL('image/jpeg', 0.85).split(',')[1];
        
        if (!base64) {
          reject(new Error('Failed to process image'));
          return;
        }
        
        resolve(base64);
      } catch (error) {
        reject(new Error('Image processing failed: ' + error.message));
      }
    };
    
    img.onerror = () => reject(new Error('Invalid image file'));
    img.src = URL.createObjectURL(file);
  });
};

// MAIN ANALYSIS FUNCTION - Only called when user uploads an image
export const analyzePlant = async (imageFile, options = {}) => {
  const startTime = Date.now();
  
  try {
    // Validate inputs
    if (!PLANTID_API_KEY) {
      throw new Error('Plant.id API key is not configured. Please add VITE_PLANTID_API_KEY to your .env file.');
    }

    console.log('🔍 Starting plant analysis (user initiated)...');
    console.log('🖼️ Processing image...');
    const base64Image = await preprocessImage(imageFile);
    console.log('✅ Image processed successfully');
    
    const requestBody = {
      images: [base64Image],
      health: "all",
      similar_images: true,
      classification_level: "species",
      ...(options.latitude && options.longitude && {
        latitude: parseFloat(options.latitude),
        longitude: parseFloat(options.longitude)
      }),
      datetime: new Date().toISOString().split('T')[0],
      custom_id: Date.now()
    };

    console.log('🌐 Making API request to Plant.id (USING CREDITS)...');
    const response = await fetch(`${PLANTID_BASE_URL}/identification`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Api-Key': PLANTID_API_KEY
      },
      body: JSON.stringify(requestBody)
    });

    const responseTime = Date.now() - startTime;
    console.log(`⚡ API Response: ${response.status} (${responseTime}ms) - Credits used`);
    
    if (!response.ok) {
      const errorText = await response.text();
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { error: errorText };
      }
      
      console.error('❌ API Error:', { status: response.status, error: errorData });
      
      switch (response.status) {
        case 400: throw new Error(`Invalid input data: ${errorData.error || 'Please check your image'}`);
        case 401: throw new Error('Invalid API key. Check your VITE_PLANTID_API_KEY.');
        case 429: throw new Error('Not enough credits. Use manual entry to save credits.');
        case 500: throw new Error('Server error. Please try again later.');
        default: throw new Error(`API error (${response.status}): ${errorData.error || response.statusText}`);
      }
    }

    const data = await response.json();
    const analysis = extractCompleteAnalysis(data, responseTime);
    console.log('✅ Analysis completed successfully:', { species: analysis.plantInfo?.name });
    
    return analysis;
    
  } catch (error) {
    const errorTime = Date.now() - startTime;
    console.error(`❌ Analysis failed after ${errorTime}ms:`, error);
    
    if (error.message.includes('fetch') || error.message.includes('network')) {
      throw new Error('Network error: Unable to connect to Plant.id. Please check your internet connection.');
    }
    
    throw error;
  }
};

// Extract analysis according to official API response structure
const extractCompleteAnalysis = (data, responseTime) => {
  try {
    const result = data.result || {};
    const accessToken = data.access_token;
    
    const isPlant = result.is_plant;
    if (!isPlant || typeof isPlant.binary === 'undefined') {
      throw new Error('API response missing is_plant data');
    }
    
    if (!isPlant.binary) {
      throw new Error('No plant detected. Please upload a clear photo of a plant or use manual entry.');
    }
    
    const plantInfo = extractPlantClassification(result, accessToken);
    const healthInfo = extractHealthAssessment(result);
    const insights = generatePlantInsights(plantInfo, healthInfo);
    
    return {
      accessToken,
      plantInfo,
      healthInfo,
      insights,
      isPlant: { detected: isPlant.binary, probability: isPlant.probability },
      metadata: { processingTime: responseTime, source: 'plant.id', creditsUsed: true }
    };
  } catch (error) {
    console.error('❌ Error in analysis extraction:', error);
    throw error;
  }
};

const extractPlantClassification = (result, accessToken) => {
  const classification = result.classification;
  if (!classification || !classification.suggestions || classification.suggestions.length === 0) {
    throw new Error('No plant species could be identified. Consider manual entry.');
  }

  const bestMatch = classification.suggestions[0];
  const alternativeMatches = classification.suggestions.slice(1, 5);
  
  return {
    id: bestMatch.id,
    name: bestMatch.name || 'Unknown plant',
    scientificName: bestMatch.name || 'Unknown species',
    probability: bestMatch.probability || 0,
    confidence: bestMatch.probability || 0,
    details: bestMatch.details || null,
    similarImages: bestMatch.similar_images || [],
    alternatives: alternativeMatches.map(alt => ({ id: alt.id, name: alt.name, probability: alt.probability })),
    accessToken,
    source: 'plant.id'
  };
};

const extractHealthAssessment = (result) => {
  const isHealthy = result.is_healthy;
  const disease = result.disease;
  
  if (!isHealthy && !disease) {
    return { isHealthy: true, probability: 0.95, status: 'healthy', diseases: [] };
  }
  
  const healthyBinary = isHealthy?.binary ?? true;
  const healthyProbability = isHealthy?.probability ?? 0.95;
  
  const diseases = (disease?.suggestions || [])
    .filter(suggestion => !suggestion.redundant)
    .map(suggestion => ({
      id: suggestion.id,
      name: suggestion.name || 'Unknown issue',
      probability: suggestion.probability || 0,
      details: suggestion.details || null,
    }));
  
  return {
    isHealthy: healthyBinary,
    probability: healthyProbability,
    healthScore: healthyProbability,
    status: healthyBinary ? 'healthy' : 'needs_attention',
    diseases,
    question: disease?.question || null
  };
};

// Get detailed plant information using GET request
export const getPlantDetails = async (accessToken, requestedDetails = []) => {
  try {
    if (!accessToken) throw new Error('Access token required');
    
    const availableDetails = ['common_names', 'url', 'description', 'watering', 'image'];
    const detailsToRequest = requestedDetails.length > 0 ? requestedDetails : availableDetails;
    const validDetails = detailsToRequest.filter(detail => availableDetails.includes(detail));
    
    if (validDetails.length === 0) throw new Error('No valid details requested');
    
    const params = new URLSearchParams({ details: validDetails.join(','), language: 'en' });
    
    const response = await fetch(`${PLANTID_BASE_URL}/identification/${accessToken}?${params}`, {
      method: 'GET',
      headers: { 'Api-Key': PLANTID_API_KEY }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch details: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
    
  } catch (error) {
    console.error('❌ Failed to get plant details:', error);
    throw error;
  }
};

const generatePlantInsights = (plantInfo, healthInfo) => {
  const insights = [];
  if (plantInfo.confidence > 0.7) insights.push('🎯 High confidence identification');
  else if (plantInfo.confidence > 0.5) insights.push('⚠️ Moderate confidence');
  else insights.push('❓ Low confidence');
  
  if (healthInfo.isHealthy) insights.push('💚 No immediate health concerns detected');
  else insights.push(`🚨 ${healthInfo.diseases.length} potential health issue(s) identified`);
  
  insights.push('🌐 Analysis powered by Plant.id API');
  return insights;
};

// Export aliases
export { analyzePlant as identifyPlant };
export { analyzePlant as assessPlantHealth };