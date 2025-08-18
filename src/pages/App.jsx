// FILE: src/pages/App.jsx (UPDATED FOR CORRECTED PLANT.ID API)
import React, { useState } from 'react';
import UploadForm from '../components/UploadForm';
import AnalysisResults from '../components/AnalysisResults';
import ChatAdvisor from '../components/ChatAdvisor';
import { analyzePlant } from '../utils/plantid'; // Using the unified function
import { generatePlantAdvice } from '../utils/gemini';
import '../assets/App.css';

function App() {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [analysisData, setAnalysisData] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [error, setError] = useState(null);

  const handleImageUpload = async (imageFile, action) => {
    // Handle preview (when user just uploads, before clicking analyze)
    if (!action || action !== "analyze") {
      setUploadedImage(URL.createObjectURL(imageFile));
      setError(null);
      setAnalysisData(null);
      setShowChat(false);
      return;
    }

    // Handle full analysis (when user clicks "Analyze Plant Health")
    setIsAnalyzing(true);
    setError(null);
    setShowChat(false);

    try {
      console.log('🔍 Analyzing plant (identification + health assessment)...');
      
      // Single API call gets both plant ID and health assessment
      const result = await analyzePlant(imageFile);
      
      console.log('🤖 Generating personalized advice...');
      
      // Generate initial advice based on the analysis
      const initialAdvice = await generatePlantAdvice(
        result.plantInfo,
        result.healthInfo
      );
      
      // Set analysis data
      setAnalysisData({
        ...result, // Contains plantInfo, healthInfo, accessToken, isPlant
        advice: initialAdvice,
        imageFile // Keep reference for follow-up questions
      });

      console.log('✅ Analysis complete!');

    } catch (err) {
      console.error('Analysis failed:', err);
      setError(err.message);
      
      // Show specific error messages based on error type
      if (err.message.includes('No plant detected')) {
        setError('No plant detected in the image. Please upload a clear photo of a plant.');
      } else if (err.message.includes('API key')) {
        setError('API key issue. Please check your Plant.id API configuration.');
      } else if (err.message.includes('network') || err.message.includes('fetch')) {
        setError('Network error. Please check your internet connection and try again.');
      } else {
        setError(`Analysis failed: ${err.message}`);
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleFollowUpQuestion = async (question) => {
    if (!analysisData) return;

    try {
      const advice = await generatePlantAdvice(
        analysisData.plantInfo,
        analysisData.healthInfo,
        question
      );
      
      return advice;
    } catch (err) {
      console.error('Follow-up question failed:', err);
      throw new Error('Sorry, I couldn\'t process your question. Please try again.');
    }
  };

  const handleShowChat = () => {
    setShowChat(true);
  };

  const handleNewAnalysis = () => {
    setAnalysisData(null);
    setUploadedImage(null);
    setShowChat(false);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-green-100">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-800">
              🌱 Plant Health AI Advisor
            </h1>
            <p className="text-gray-600 mt-2">
              Upload a photo to identify your plant and get expert care advice
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Upload Form - Show when no analysis or user wants new analysis */}
        {!analysisData && (
          <div className="max-w-2xl mx-auto">
            <UploadForm 
              onImageUpload={handleImageUpload}
              isAnalyzing={isAnalyzing}
            />
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="max-w-2xl mx-auto mt-6">
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
              <div className="text-red-600 text-xl mb-2">❌</div>
              <h3 className="text-lg font-semibold text-red-800 mb-2">Analysis Failed</h3>
              <p className="text-red-700 mb-4">{error}</p>
              <button
                onClick={handleNewAnalysis}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isAnalyzing && uploadedImage && (
          <div className="max-w-2xl mx-auto mt-6">
            <div className="bg-white rounded-2xl shadow-lg border border-green-100 overflow-hidden">
              <div className="p-6">
                <div className="flex items-center justify-center mb-4">
                  <div className="animate-spin h-8 w-8 border-4 border-green-600 border-t-transparent rounded-full"></div>
                  <span className="ml-3 text-lg font-semibold text-gray-700">
                    Analyzing your plant...
                  </span>
                </div>
                <img
                  src={uploadedImage}
                  alt="Plant being analyzed"
                  className="w-full max-h-64 object-contain rounded-xl"
                />
                <div className="mt-4 text-center text-sm text-gray-600">
                  <p>🔍 Identifying species...</p>
                  <p>🏥 Assessing plant health...</p>
                  <p>🤖 Generating care recommendations...</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Analysis Results */}
        {analysisData && (
          <div className="max-w-4xl mx-auto">
            <AnalysisResults 
              plantInfo={analysisData.plantInfo}
              healthInfo={analysisData.healthInfo}
              initialAdvice={analysisData.advice}
              onChatWithAI={handleShowChat}
              onClose={null} // Don't show close button in main flow
            />

            {/* New Analysis Button */}
            <div className="text-center mt-6">
              <button
                onClick={handleNewAnalysis}
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-medium transition-colors shadow-md"
              >
                🌿 Analyze Another Plant
              </button>
            </div>

            {/* Chat Advisor */}
            {showChat && (
              <ChatAdvisor 
                onAskQuestion={handleFollowUpQuestion}
                plantContext={analysisData}
                isVisible={showChat}
              />
            )}
          </div>
        )}

        {/* Plant Detection Info */}
        {analysisData?.isPlant && (
          <div className="max-w-2xl mx-auto mt-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
              <p className="text-sm text-blue-700">
                ✅ Plant detected with {(analysisData.isPlant.probability * 100).toFixed(1)}% confidence
                {analysisData.accessToken && (
                  <span className="ml-2 text-xs text-blue-600">
                    (ID: {analysisData.accessToken.slice(-8)})
                  </span>
                )}
              </p>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-6xl mx-auto px-4 py-6 text-center text-gray-600 text-sm">
          <p>Powered by Plant.id API and Google Gemini AI</p>
        </div>
      </footer>
    </div>
  );
}

export default App;