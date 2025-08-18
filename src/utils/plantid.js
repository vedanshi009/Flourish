// FILE: src/utils/plantid.js 
// Plant.id API integration utilities - Updated to match official API documentation

const PLANTID_API_KEY = import.meta.env.VITE_PLANTID_API_KEY;
const PLANTID_BASE_URL = "https://api.plant.id/v3";

// Convert file to base64
const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64 = reader.result.split(',')[1]; // Remove data:image/jpeg;base64,
      resolve(base64);
    };
    reader.onerror = error => reject(error);
  });
};

// UNIFIED FUNCTION: Get both plant identification AND health assessment in one call
export const analyzePlant = async (imageFile) => {
  try {
    const base64Image = await fileToBase64(imageFile);
    
    const response = await fetch(`${PLANTID_BASE_URL}/identification`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Api-Key': PLANTID_API_KEY
      },
      body: JSON.stringify({
        images: [base64Image],
        // Request both plant identification AND health assessment
        health: "all", // Returns both classification and health assessment (2 credits)
        // Enable similar images for better results
        similar_images: true,
        // Request detailed plant information
        plant_details: ["common_names", "taxonomy", "description", "url", "gbif_id"],
        // Request disease details for health assessment
        disease_details: ["description", "treatment", "classification", "cause", "common_names", "url"],
        // Set classification level to species (most detailed)
        classification_level: "species"
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Plant analysis failed: ${response.status} ${response.statusText}. ${errorData.error || ''}`);
    }

    const data = await response.json();
    return extractCompleteAnalysis(data);
  } catch (error) {
    console.error('Plant analysis error:', error);
    throw error;
  }
};

// SEPARATE FUNCTION: Plant identification only (if you need it separately)
export const identifyPlantOnly = async (imageFile) => {
  try {
    const base64Image = await fileToBase64(imageFile);
    
    const response = await fetch(`${PLANTID_BASE_URL}/identification`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Api-Key': PLANTID_API_KEY
      },
      body: JSON.stringify({
        images: [base64Image],
        // No health assessment, only plant identification
        similar_images: true,
        plant_details: ["common_names", "taxonomy", "description", "url"],
        classification_level: "species"
      })
    });

    if (!response.ok) {
      throw new Error(`Plant identification failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return extractPlantInfo(data);
  } catch (error) {
    console.error('Plant identification error:', error);
    throw error;
  }
};

// SEPARATE FUNCTION: Health assessment only (if you need it separately)
export const assessPlantHealthOnly = async (imageFile) => {
  try {
    const base64Image = await fileToBase64(imageFile);
    
    const response = await fetch(`${PLANTID_BASE_URL}/health_assessment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Api-Key': PLANTID_API_KEY
      },
      body: JSON.stringify({
        images: [base64Image],
        similar_images: true,
        disease_details: ["description", "treatment", "classification", "cause", "common_names", "url"]
      })
    });

    if (!response.ok) {
      throw new Error(`Health assessment failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return extractHealthInfo(data);
  } catch (error) {
    console.error('Health assessment error:', error);
    throw error;
  }
};

// Extract complete analysis (plant + health) from unified API response
const extractCompleteAnalysis = (data) => {
  const result = data.result || {};
  
  // Check if plant is detected
  const isPlant = result.is_plant?.binary;
  const plantProbability = result.is_plant?.probability || 0;
  
  if (!isPlant || plantProbability < 0.5) {
    throw new Error('No plant detected in the image. Please upload a clear photo of a plant.');
  }

  // Extract plant identification
  const plantInfo = extractPlantInfoFromResult(result);
  
  // Extract health assessment (if available)
  const healthInfo = extractHealthInfoFromResult(result);
  
  return {
    accessToken: data.access_token,
    plantInfo,
    healthInfo,
    isPlant: {
      detected: isPlant,
      probability: plantProbability
    }
  };
};

// Extract plant information from result object
const extractPlantInfoFromResult = (result) => {
  const suggestions = result.classification?.suggestions || [];
  if (suggestions.length === 0) {
    throw new Error('No plant species identified');
  }

  const bestMatch = suggestions[0];
  
  return {
    id: bestMatch.id,
    name: bestMatch.name || 'Unknown plant',
    commonNames: bestMatch.details?.common_names || [],
    scientificName: bestMatch.name || 'Unknown species',
    probability: bestMatch.probability || 0,
    confidence: bestMatch.probability || 0, // Alias for backward compatibility
    description: bestMatch.details?.description || 'No description available',
    taxonomy: bestMatch.details?.taxonomy || {},
    url: bestMatch.details?.url || null,
    gbifId: bestMatch.details?.gbif_id || null,
    similarImages: bestMatch.similar_images || []
  };
};

// Extract health information from result object
const extractHealthInfoFromResult = (result) => {
  // Check if health assessment is available
  if (!result.disease) {
    return {
      isHealthy: true,
      probability: 1.0,
      healthScore: 1.0,
      diseases: []
    };
  }

  const isHealthy = result.is_healthy?.binary ?? true;
  const healthProbability = result.is_healthy?.probability ?? 1.0;
  const suggestions = result.disease?.suggestions || [];
  
  const diseases = suggestions
    .filter(suggestion => !suggestion.redundant) // Filter out redundant suggestions
    .map(suggestion => ({
      id: suggestion.id,
      name: suggestion.name || 'Unknown issue',
      probability: suggestion.probability || 0,
      description: suggestion.details?.description || '',
      treatment: suggestion.details?.treatment || '',
      cause: suggestion.details?.cause || '',
      classification: suggestion.details?.classification || '',
      commonNames: suggestion.details?.common_names || [],
      url: suggestion.details?.url || null,
      similarImages: suggestion.similar_images || []
    }));

  return {
    isHealthy,
    probability: healthProbability,
    healthScore: healthProbability, // Use health probability as score
    diseases,
    question: result.disease?.question || null // Follow-up questions if available
  };
};

// LEGACY FUNCTIONS (for backward compatibility with existing code)
// Extract plant information from full API response
const extractPlantInfo = (data) => {
  const result = data.result || {};
  return extractPlantInfoFromResult(result);
};

// Extract health information from health assessment response
const extractHealthInfo = (data) => {
  const result = data.result || {};
  return extractHealthInfoFromResult(result);
};

// Utility function to check API credits/usage
export const checkApiUsage = async () => {
  try {
    const response = await fetch(`${PLANTID_BASE_URL}/usage`, {
      method: 'GET',
      headers: {
        'Api-Key': PLANTID_API_KEY
      }
    });

    if (!response.ok) {
      throw new Error(`Usage check failed: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API usage check error:', error);
    throw error;
  }
};

// Export the main function that should be used
export { analyzePlant as identifyPlant }; // Alias for backward compatibility
export { analyzePlant as assessPlantHealth }; // Alias for backward compatibility