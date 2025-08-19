# Plant Health AI Advisor - Setup Guide

## Required Environment Variables

Create a `.env` file in your project root with the following variables:

```bash
# Plant.id API Configuration
# Get your API key from: https://web.plant.id/api-access-request/
VITE_PLANTID_API_KEY=your_plant_id_api_key_here

# Google Gemini API Configuration (Optional)
# Get your API key from: https://makersuite.google.com/app/apikey
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

## Plant.id API Setup

1. **Get API Key**: Visit [Plant.id API Access Request](https://web.plant.id/api-access-request/)
2. **Request Access**: Fill out the form to get your API key
3. **Add to .env**: Copy your API key to the `VITE_PLANTID_API_KEY` variable
4. **Restart Dev Server**: Stop and restart your development server

## API Compliance

The `plantid.js` file is fully compliant with the [Plant.id API v3 documentation](https://github.com/flowerchecker/Plant-id-API/wiki):

✅ **Authentication**: Uses `Api-Key` header as required  
✅ **Request Format**: JSON body with base64 encoded images  
✅ **Response Parsing**: Follows official API response structure  
✅ **Error Handling**: Handles all documented HTTP status codes  
✅ **Health Assessment**: Supports both plant identification and health analysis  

## Troubleshooting

### "Unable to identify plant image" Error

This error typically occurs due to:

1. **Missing API Key**: Ensure `VITE_PLANTID_API_KEY` is set in your `.env` file
2. **Invalid API Key**: Verify your API key is correct and active
3. **No Credits**: Check your Plant.id account has available credits
4. **Image Quality**: Ensure the image contains a clear, visible plant
5. **File Size**: Images should be under 5MB for optimal processing

### Common Issues

- **401 Unauthorized**: Check your API key configuration
- **429 Too Many Requests**: You've exceeded your API rate limit
- **400 Bad Request**: Image format or size issues
- **500 Server Error**: Plant.id server issues, try again later

### Debug Mode

The app includes a debug mode that shows:
- API key configuration status
- Detailed console logs during analysis
- API response structure information

## API Endpoints Used

- **POST** `/identification` - Main plant identification endpoint
- **GET** `/identification/{access_token}` - Retrieve detailed plant information

## Request Parameters

- `images`: Base64 encoded image strings (required)
- `health`: "all" for both classification and health assessment
- `similar_images`: true to get similar plant images
- `classification_level`: "species" for genus and species identification
- `datetime`: ISO format date for seasonal accuracy

## Response Structure

The API returns:
- `access_token`: Unique identification identifier
- `result.is_plant`: Plant detection with binary flag and probability
- `result.classification.suggestions`: Plant species suggestions
- `result.is_healthy`: Health assessment with binary flag and probability
- `result.disease.suggestions`: Disease identification if applicable

## Testing

Use the built-in API connection test to verify your setup:

```javascript
import { testApiConnection } from './src/utils/plantid.js';

const isConnected = await testApiConnection();
console.log('API Connection:', isConnected ? '✅ Success' : '❌ Failed');
```

## Support

- **Plant.id API**: [Documentation](https://github.com/flowerchecker/Plant-id-API/wiki)
- **API Access**: [Request Form](https://web.plant.id/api-access-request/)
- **Account Management**: [Plant.id Dashboard](https://web.plant.id/)
