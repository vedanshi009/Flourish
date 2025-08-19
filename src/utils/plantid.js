// FILE: src/utils/plantid.js 
// Plant.id API integration - Fully compliant with official API documentation v3

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

// MAIN ANALYSIS FUNCTION - Fully compliant with Plant.id API v3
export const analyzePlant = async (imageFile, options = {}) => {
  const startTime = Date.now();
  
  try {
    // Validate inputs
    if (!PLANTID_API_KEY) {
      throw new Error('Plant.id API key is not configured. Please add VITE_PLANTID_API_KEY to your .env file.');
    }

    console.log('🔍 Starting plant analysis...');
    console.log('📁 File info:', {
      name: imageFile.name,
      size: `${(imageFile.size / 1024 / 1024).toFixed(2)}MB`,
      type: imageFile.type
    });

    // Enhanced image preprocessing
    console.log('🖼️ Processing image...');
    const base64Image = await preprocessImage(imageFile);
    console.log('✅ Image processed successfully');
    
    // Build request body according to official API documentation
    const requestBody = {
      // REQUIRED: images array with base64 encoded strings
      images: [base64Image],
      
      // OPTIONAL: health assessment (all = both classification and health for 2 credits)
      health: "all",
      
      // OPTIONAL: similar images for each suggestion
      similar_images: true,
      
      // OPTIONAL: classification level (species is default)
      classification_level: "species",
      
      // OPTIONAL: geographic coordinates if available
      ...(options.latitude && options.longitude && {
        latitude: parseFloat(options.latitude),
        longitude: parseFloat(options.longitude)
      }),
      
      // OPTIONAL: datetime for seasonal accuracy (ISO format)
      datetime: new Date().toISOString().split('T')[0], // YYYY-MM-DD format
      
      // OPTIONAL: custom_id for tracking
      custom_id: Date.now()
    };

    console.log('🌐 Making API request to Plant.id...');
    console.log('📋 Request details:', {
      endpoint: `${PLANTID_BASE_URL}/identification`,
      imageSize: `${(base64Image.length * 0.75 / 1024).toFixed(1)}KB (base64)`,
      options: Object.keys(requestBody).filter(k => k !== 'images')
    });

    const response = await fetch(`${PLANTID_BASE_URL}/identification`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Api-Key': PLANTID_API_KEY
      },
      body: JSON.stringify(requestBody)
    });

    const responseTime = Date.now() - startTime;
    console.log(`⚡ API Response: ${response.status} (${responseTime}ms)`);
    
    if (!response.ok) {
      const errorText = await response.text();
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { error: errorText };
      }
      
      console.error('❌ API Error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorData
      });
      
      // Handle specific error codes according to documentation
      switch (response.status) {
        case 400:
          throw new Error(`Invalid input data: ${errorData.error || 'Please check your image and try again'}`);
        case 401:
          throw new Error('Invalid API key. Please check your VITE_PLANTID_API_KEY configuration.');
        case 404:
          throw new Error('Object not found. Please try again.');
        case 429:
          throw new Error('Not enough credits. Please check your Plant.id account.');
        case 500:
          throw new Error('Server error. Please try again later or contact support.');
        default:
          throw new Error(`API error (${response.status}): ${errorData.error || response.statusText}`);
      }
    }

    const data = await response.json();
    console.log('📊 Raw API Response structure:', {
      hasAccessToken: !!data.access_token,
      hasResult: !!data.result,
      hasIsPlant: !!data.result?.is_plant,
      hasClassification: !!data.result?.classification,
      hasDisease: !!data.result?.disease,
      hasIsHealthy: !!data.result?.is_healthy
    });
    
    // Process result according to official API response structure
    const analysis = extractCompleteAnalysis(data, responseTime);
    console.log('✅ Analysis completed successfully:', {
      plantDetected: analysis.isPlant.detected,
      confidence: `${(analysis.plantInfo?.confidence * 100).toFixed(1)}%`,
      species: analysis.plantInfo?.name,
      healthy: analysis.healthInfo?.isHealthy,
      processingTime: `${responseTime}ms`
    });
    
    return analysis;
    
  } catch (error) {
    const errorTime = Date.now() - startTime;
    console.error(`❌ Analysis failed after ${errorTime}ms:`, error);
    
    // Enhanced error classification
    if (error.message.includes('fetch') || error.message.includes('network')) {
      throw new Error('Network error: Unable to connect to Plant.id. Please check your internet connection and try again.');
    } else if (error.message.includes('API key')) {
      throw new Error('Authentication failed: Please verify your Plant.id API key is correct and active.');
    } else if (error.message.includes('too large') || error.message.includes('size')) {
      throw new Error('Image is too large. Please use a smaller image (under 5MB) and try again.');
    } else if (error.message.includes('Invalid image')) {
      throw new Error('Invalid image format. Please use a clear JPEG or PNG image of a plant.');
    }
    
    throw error;
  }
};

// Extract analysis according to official API response structure
const extractCompleteAnalysis = (data, responseTime) => {
  try {
    const result = data.result || {};
    const accessToken = data.access_token;
    
    console.log('🔍 Analyzing API result structure...');
    
    // Extract is_plant according to API docs: result->is_plant
    const isPlant = result.is_plant;
    if (!isPlant) {
      throw new Error('API response missing is_plant data');
    }
    
    const plantDetected = isPlant.binary;
    const plantProbability = isPlant.probability;
    
    console.log('🌱 Plant detection (result->is_plant):', {
      binary: plantDetected,
      probability: `${(plantProbability * 100).toFixed(1)}%`
    });
    
    // If binary is false, no plant detected
    if (!plantDetected) {
      throw new Error('No plant detected in the image. Please upload a clear photo of a plant and try again.');
    }
    
    // Extract plant classification according to API docs: result->classification->suggestions
    const plantInfo = extractPlantClassification(result, accessToken);
    
    // Extract health assessment according to API docs: result->is_healthy and result->disease
    const healthInfo = extractHealthAssessment(result);
    
    // Generate additional insights
    const insights = generatePlantInsights(plantInfo, healthInfo);
    
    return {
      accessToken,
      plantInfo,
      healthInfo,
      insights,
      isPlant: {
        detected: plantDetected,
        probability: plantProbability
      },
      metadata: {
        processingTime: responseTime,
        apiVersion: 'v3',
        timestamp: new Date().toISOString(),
        customId: result.custom_id || null
      }
    };
  } catch (error) {
    console.error('❌ Error in analysis extraction:', error);
    throw error;
  }
};

// Extract plant classification according to API docs: result->classification->suggestions
const extractPlantClassification = (result, accessToken) => {
  const classification = result.classification;
  if (!classification || !classification.suggestions) {
    throw new Error('No plant classification data in API response');
  }
  
  const suggestions = classification.suggestions;
  if (suggestions.length === 0) {
    throw new Error('No plant species could be identified in this image');
  }

  const bestMatch = suggestions[0];
  const alternativeMatches = suggestions.slice(1, 5);
  
  console.log('🏆 Best classification match:', {
    id: bestMatch.id,
    name: bestMatch.name,
    probability: `${(bestMatch.probability * 100).toFixed(1)}%`,
    alternatives: alternativeMatches.length
  });
  
  return {
    // Primary identification from API response
    id: bestMatch.id,
    name: bestMatch.name || 'Unknown plant',
    scientificName: bestMatch.name || 'Unknown species',
    probability: bestMatch.probability || 0,
    confidence: bestMatch.probability || 0,
    
    // Details if available (need separate request with GET parameters for full details)
    details: bestMatch.details || null,
    
    // Similar images if requested
    similarImages: bestMatch.similar_images || [],
    
    // Alternative suggestions
    alternatives: alternativeMatches.map(alt => ({
      id: alt.id,
      name: alt.name,
      probability: alt.probability
    })),
    
    // Metadata
    accessToken,
    identificationDate: new Date().toISOString()
  };
};

// Extract health assessment according to API docs: result->is_healthy and result->disease
const extractHealthAssessment = (result) => {
  // Check for health data according to API structure
  const isHealthy = result.is_healthy;
  const disease = result.disease;
  
  console.log('🏥 Health assessment data:', {
    hasIsHealthy: !!isHealthy,
    hasDisease: !!disease,
    healthyBinary: isHealthy?.binary,
    healthyProbability: isHealthy?.probability
  });
  
  // If no health data, assume healthy
  if (!isHealthy && !disease) {
    return {
      isHealthy: true,
      probability: 0.95,
      healthScore: 0.95,
      status: 'healthy',
      diseases: [],
      recommendations: ['No health assessment data available', 'Plant appears normal'],
      question: null
    };
  }
  
  const healthyBinary = isHealthy?.binary ?? true;
  const healthyProbability = isHealthy?.probability ?? 0.95;
  
  // Extract disease suggestions according to API docs: result->disease->suggestions
  const diseases = [];
  if (disease && disease.suggestions) {
    diseases.push(...disease.suggestions
      .filter(suggestion => !suggestion.redundant) // Filter redundant as per API docs
      .map(suggestion => ({
        id: suggestion.id,
        name: suggestion.name || 'Unknown issue',
        probability: suggestion.probability || 0,
        severity: categorizeSeverity(suggestion.probability),
        details: suggestion.details || null,
        similarImages: suggestion.similar_images || []
      }))
    );
  }
  
  // Extract follow-up question according to API docs: result->disease->question
  const question = disease?.question || null;
  
  console.log('🩺 Health assessment results:', {
    healthy: healthyBinary,
    probability: `${(healthyProbability * 100).toFixed(1)}%`,
    diseasesFound: diseases.length,
    hasQuestion: !!question
  });
  
  return {
    isHealthy: healthyBinary,
    probability: healthyProbability,
    healthScore: healthyProbability,
    status: healthyBinary ? 'healthy' : 'needs_attention',
    diseases,
    question,
    recommendations: generateHealthRecommendations(healthyBinary, diseases),
    overallAssessment: generateHealthSummary(healthyBinary, diseases)
  };
};

// Get detailed plant information using GET request with parameters (as per API docs)
export const getPlantDetails = async (accessToken, requestedDetails = []) => {
  try {
    if (!accessToken) {
      throw new Error('Access token required');
    }
    
    // Available details according to API documentation
    const availableDetails = [
      'common_names', 'url', 'description', 'description_gpt', 'description_all',
      'taxonomy', 'name_authority', 'rank', 'gbif_id', 'inaturalist_id',
      'image', 'images', 'synonyms', 'edible_parts', 'propagation_methods',
      'watering', 'best_watering', 'best_light_condition', 'best_soil_type',
      'common_uses', 'toxicity', 'cultural_significance', 'gpt'
    ];
    
    // Default details if none specified
    const detailsToRequest = requestedDetails.length > 0 ? requestedDetails : 
      ['common_names', 'description', 'taxonomy', 'url', 'image'];
    
    // Validate requested details
    const validDetails = detailsToRequest.filter(detail => availableDetails.includes(detail));
    
    if (validDetails.length === 0) {
      throw new Error('No valid details requested');
    }
    
    // Build query parameters according to API docs
    const params = new URLSearchParams({
      details: validDetails.join(','),
      language: 'en' // Default to English
    });
    
    console.log('📋 Requesting plant details:', {
      accessToken,
      details: validDetails,
      url: `${PLANTID_BASE_URL}/identification/${accessToken}?${params}`
    });
    
    const response = await fetch(`${PLANTID_BASE_URL}/identification/${accessToken}?${params}`, {
      method: 'GET',
      headers: {
        'Api-Key': PLANTID_API_KEY
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch details: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('📊 Plant details received:', Object.keys(data.result?.classification?.suggestions?.[0]?.details || {}));
    
    return data;
    
  } catch (error) {
    console.error('❌ Failed to get plant details:', error);
    throw error;
  }
};

// UTILITY FUNCTIONS

const categorizeSeverity = (probability) => {
  if (probability > 0.7) return 'high';
  if (probability > 0.4) return 'medium';
  if (probability > 0.1) return 'low';
  return 'minimal';
};

const generateHealthRecommendations = (isHealthy, diseases) => {
  if (isHealthy && diseases.length === 0) {
    return [
      'Your plant appears healthy! Keep up the good care.',
      'Continue with your current watering and lighting routine.',
      'Monitor regularly for any changes in appearance.'
    ];
  }
  
  const recommendations = ['Monitor plant health closely'];
  
  if (diseases.length > 0) {
    const topDisease = diseases[0];
    recommendations.push(`Address ${topDisease.name} - ${topDisease.severity} severity`);
    
    if (diseases.length > 1) {
      recommendations.push(`${diseases.length} potential issues detected - prioritize treatment`);
    }
  }
  
  return recommendations;
};

const generateHealthSummary = (isHealthy, diseases) => {
  if (isHealthy && diseases.length === 0) {
    return 'Plant appears to be in excellent health with no detected issues.';
  }
  
  if (diseases.length === 1) {
    return `Potential health concern detected: ${diseases[0].name} (${diseases[0].severity} severity).`;
  }
  
  if (diseases.length > 1) {
    return `Multiple potential health issues detected. Primary concern: ${diseases[0].name}.`;
  }
  
  return 'Health assessment completed with recommendations provided.';
};

const generatePlantInsights = (plantInfo, healthInfo) => {
  const insights = [];
  
  // Confidence insights
  if (plantInfo.confidence > 0.9) {
    insights.push('🎯 Very high confidence identification - excellent match');
  } else if (plantInfo.confidence > 0.7) {
    insights.push('✅ Good confidence identification - reliable result');
  } else if (plantInfo.confidence > 0.5) {
    insights.push('⚠️ Moderate confidence - consider clearer image for better accuracy');
  } else {
    insights.push('❓ Low confidence - image quality or rare species may be factors');
  }
  
  // Alternative suggestions insight
  if (plantInfo.alternatives && plantInfo.alternatives.length > 0) {
    insights.push(`🔍 ${plantInfo.alternatives.length} alternative species considered`);
  }
  
  // Health insights
  if (healthInfo.isHealthy) {
    insights.push('💚 No immediate health concerns detected');
  } else {
    insights.push(`🚨 ${healthInfo.diseases.length} potential health issue(s) identified`);
  }
  
  return insights;
};

// Check API usage and credits
export const checkApiUsage = async () => {
  try {
    if (!PLANTID_API_KEY) {
      throw new Error('API key not configured');
    }
    
    // Note: Plant.id doesn't provide a usage endpoint in their public API
    // This is a placeholder for future implementation
    return {
      credits: 'Check your Plant.id dashboard for credit information',
      endpoint: 'https://web.plant.id/',
      message: 'Usage information available in your Plant.id account dashboard'
    };
  } catch (error) {
    console.error('Failed to check API usage:', error);
    throw error;
  }
};

// Enhanced API testing with proper endpoint
export const testApiConnection = async () => {
  try {
    console.log('🧪 Testing Plant.id API connection...');
    
    if (!PLANTID_API_KEY) {
      throw new Error('API key not configured');
    }
    
    // Create a minimal test image (1x1 pixel)
    const testImage = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAC0lEQVQIHWNgAAIAAAUAAY27m/MAAAAASUVORK5CYII=";
    
    const response = await fetch(`${PLANTID_BASE_URL}/identification`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Api-Key': PLANTID_API_KEY
      },
      body: JSON.stringify({
        images: [testImage],
        health: "auto"
      })
    });

    console.log('📊 Test response:', {
      status: response.status,
      statusText: response.statusText
    });
    
    if (response.status === 401) {
      return false; // Invalid API key
    }
    
    if (response.status === 429) {
      console.warn('⚠️ API rate limit reached');
      return false;
    }
    
    // Any 2xx response means API key is working
    return response.status >= 200 && response.status < 300;
    
  } catch (error) {
    console.error('🚫 API test failed:', error.message);
    return false;
  }
};

// Export functions
export { analyzePlant as identifyPlant };
export { analyzePlant as assessPlantHealth };