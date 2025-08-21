// FILE: src/pages/App.jsx
// Flourish - AI-Powered Plant Care & Health Advisor

import React, { useState } from 'react';
import UploadForm from '../components/UploadForm';
import AnalysisResults from '../components/AnalysisResults';
import ChatAdvisor from '../components/ChatAdvisor';
import QuoteBanner from '../components/QuoteBanner';
import UniversalPlantChatbot from '../components/UniversalPlantChatbot';
import CareSchedulerButton from '../components/CareSchedulerButton';
import GardenButton from '../components/GardenButton';
import DarkModeToggle from '../components/DarkModeToggle';
import CreditWarning from '../components/CreditWarning';
import ManualPlantForm from '../components/ManualPlantForm';
import { GardenProvider } from '../contexts/GardenContext';
import { DarkModeProvider } from '../contexts/DarkModeContext';
import { analyzePlant } from '../utils/plantid';
import { generatePlantAdvice } from '../utils/gemini';

function App() {
  const [analysisData, setAnalysisData] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState(null);
  const [showChat, setShowChat] = useState(false);
  const [isUniversalChatOpen, setIsUniversalChatOpen] = useState(false);
  const [showManualEntry, setShowManualEntry] = useState(false);

  const handleImageUpload = async (imageFile, action) => {
    if (action !== "analyze") {
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setImageFile(imageFile);

    try {
      console.log('🔍 Starting analysis...');
      const result = await analyzePlant(imageFile);
      console.log('✅ Plant analysis result:', result);
      
      let advice = "Basic plant care advice";
      try {
        advice = await generatePlantAdvice(result.plantInfo, result.healthInfo);
        console.log('✅ AI advice generated');
      } catch (adviceError) {
        console.warn('⚠️ AI advice failed, using fallback advice:', adviceError);
        advice = adviceError.fallbackAdvice || "Could not generate AI advice. Please check your Gemini API key.";
      }
      
      setAnalysisData({
        ...result,
        advice: advice
      });
      
    } catch (err) {
      console.error('❌ Analysis failed:', err);
      setError(err.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleManualPlantEntry = async (plantData) => {
    setIsAnalyzing(true);
    setError(null);

    try {
      console.log('📝 Processing manual plant entry...');
      
      const mockPlantInfo = {
        id: `manual_${Date.now()}`,
        name: plantData.commonName || plantData.scientificName,
        scientificName: plantData.scientificName,
        confidence: 1.0,
        source: 'manual_entry'
      };

      const mockHealthInfo = {
        isHealthy: plantData.healthStatus === 'healthy',
        status: plantData.healthStatus || 'healthy',
        diseases: plantData.issues ? plantData.issues.map(issue => ({ name: issue })) : [],
      };
      
      let advice = "Basic plant care advice for manually entered plant.";
      try {
        advice = await generatePlantAdvice(mockPlantInfo, mockHealthInfo);
        console.log('✅ AI advice generated for manual entry');
      } catch (adviceError) {
        console.warn('⚠️ AI advice failed, using fallback advice:', adviceError);
        advice = adviceError.fallbackAdvice || "Could not generate AI advice. Please check your Gemini API key.";
      }
      
      setAnalysisData({
        plantInfo: mockPlantInfo,
        healthInfo: mockHealthInfo,
        advice: advice,
        isPlant: { detected: true, probability: 1.0 },
        insights: ['📝 Manually entered plant - no credits used'],
        metadata: { timestamp: new Date().toISOString() }
      });

      setShowManualEntry(false);
      
    } catch (err) {
      console.error('❌ Manual entry failed:', err);
      setError(err.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleFollowUpQuestion = async (question) => {
    try {
      const advice = await generatePlantAdvice(
        analysisData.plantInfo,
        analysisData.healthInfo,
        question
      );
      return advice;
    } catch (err) {
      throw new Error('Follow-up question failed: ' + err.message);
    }
  };

  return (
    <DarkModeProvider>
      <GardenProvider>
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
          
          {/* Header */}
          <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-green-100 dark:border-gray-700">
            <div className="max-w-6xl mx-auto px-4 py-6">
              <div className="flex items-center justify-between">
                <div className="text-center flex-1">
                  <h1 className="text-4xl font-bold text-gray-800 dark:text-white">
                    🌸 Flourish
                  </h1>
                  <p className="text-gray-600 dark:text-gray-300 mt-2">
                    Your AI-powered plant care companion
                  </p>
                  <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                    Plant identification • Health analysis • Care scheduling • Expert advice
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <DarkModeToggle />
                </div>
              </div>
            </div>
          </header>

          <main className="max-w-6xl mx-auto px-4 py-8">
            <QuoteBanner />
            <CreditWarning />
            <CareSchedulerButton plantInfo={analysisData?.plantInfo || null} />
            <GardenButton />

            {/* Main App Content */}
            {!analysisData && (
              <div className="max-w-2xl mx-auto space-y-6">
                <UploadForm 
                  onImageUpload={handleImageUpload}
                  isAnalyzing={isAnalyzing}
                />
                
                <div className="text-center">
                  <div className="flex items-center justify-center mb-4">
                    <div className="border-t border-gray-300 dark:border-gray-600 flex-1"></div>
                    <span className="px-4 text-gray-500 dark:text-gray-400 text-sm">or</span>
                    <div className="border-t border-gray-300 dark:border-gray-600 flex-1"></div>
                  </div>
                  
                  <button
                    onClick={() => setShowManualEntry(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-md inline-flex items-center gap-2"
                  >
                    📝 Add Plant Manually
                    <span className="text-xs bg-blue-500 px-2 py-1 rounded-full">Save Credits</span>
                  </button>
                  
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    Know your plant? Add it manually to avoid using Plant.id credits
                  </p>
                </div>
              </div>
            )}

            {showManualEntry && (
              <ManualPlantForm
                isOpen={showManualEntry}
                onClose={() => setShowManualEntry(false)}
                onSubmit={handleManualPlantEntry}
                isSubmitting={isAnalyzing}
              />
            )}

            {error && (
              <div className="max-w-2xl mx-auto mt-6">
                <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-red-800 mb-2">❌ Error</h3>
                  <p className="text-red-700 mb-4">{error}</p>
                  <button
                    onClick={() => {
                      setError(null);
                      setAnalysisData(null);
                    }}
                    className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            )}

            {isAnalyzing && (
              <div className="max-w-2xl mx-auto mt-6">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-green-100 dark:border-gray-700 p-6 text-center">
                  <div className="animate-spin h-8 w-8 border-4 border-green-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                  <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                    {showManualEntry ? 'Processing manual entry...' : 'Analyzing plant...'}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    Please wait while Flourish works its magic...
                  </p>
                </div>
              </div>
            )}

            {analysisData && (
              <div className="max-w-4xl mx-auto">
                <AnalysisResults 
                  plantInfo={analysisData.plantInfo}
                  healthInfo={analysisData.healthInfo}
                  initialAdvice={analysisData.advice}
                  imageFile={imageFile}
                  onChatWithAI={() => setShowChat(true)}
                />

                <div className="text-center mt-6 space-x-4">
                  <button
                    onClick={() => {
                      setAnalysisData(null);
                      setError(null);
                      setImageFile(null);
                    }}
                    className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-medium transition-colors shadow-md"
                  >
                    🌿 Analyze Another Plant
                  </button>
                  
                  <button
                    onClick={() => setShowManualEntry(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors shadow-md"
                  >
                    📝 Add Manually
                  </button>
                </div>

                {showChat && (
                  <ChatAdvisor 
                    onAskQuestion={handleFollowUpQuestion}
                    plantContext={analysisData}
                    isVisible={showChat}
                  />
                )}
              </div>
            )}
          </main>
          
          <UniversalPlantChatbot
            plantInfo={analysisData?.plantInfo || null}
            healthInfo={analysisData?.healthInfo || null}
            isOpen={isUniversalChatOpen}
            onToggle={() => setIsUniversalChatOpen(!isUniversalChatOpen)}
          />
        </div>
      </GardenProvider>
    </DarkModeProvider>
  );
}

export default App;