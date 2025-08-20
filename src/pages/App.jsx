// FILE: src/pages/App.jsx
// Main Plant Health AI Advisor application

import React, { useState } from 'react';
import SetupTest from '../components/SetUpTest';
import UploadForm from '../components/UploadForm';
import AnalysisResults from '../components/AnalysisResults';
import ChatAdvisor from '../components/ChatAdvisor';
import QuoteBanner from '../components/QuoteBanner';
import UniversalPlantChatbot from '../components/UniversalPlantChatbot';
import CareSchedulerButton from '../components/CareSchedulerButton';
import { analyzePlant } from '../utils/plantid';
import { generatePlantAdvice } from '../utils/gemini';

function App() {
  const [showTest, setShowTest] = useState(true);
  const [debugMode, setDebugMode] = useState(true);
  const [analysisData, setAnalysisData] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState(null);
  const [showChat, setShowChat] = useState(false);
  const [isUniversalChatOpen, setIsUniversalChatOpen] = useState(false);

  // Check if environment is properly configured
  const hasPlantIdKey = !!import.meta.env.VITE_PLANTID_API_KEY;
  const hasGeminiKey = !!import.meta.env.VITE_GEMINI_API_KEY;

  const handleImageUpload = async (imageFile, action) => {
    if (!action || action !== "analyze") {
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      console.log('🔍 Starting analysis...');
      
      // Test the plant analysis
      const result = await analyzePlant(imageFile);
      console.log('✅ Plant analysis result:', result);
      
      // Test advice generation
      let advice = "Basic plant care advice";
      try {
        advice = await generatePlantAdvice(result.plantInfo, result.healthInfo);
        console.log('✅ AI advice generated');
      } catch (adviceError) {
        console.warn('⚠️ AI advice failed, using basic advice:', adviceError);
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

  if (showTest) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">🧪 Plant Health AI - Debug Mode</h1>
            <p className="text-gray-600 mt-2">Testing your API connections and environment setup</p>
          </div>
          
          <SetupTest />
          
          <div className="text-center mt-8">
            <button
              onClick={() => setShowTest(false)}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-medium transition-colors shadow-md"
              disabled={!hasPlantIdKey}
            >
              {hasPlantIdKey ? '🌱 Continue to Main App' : '🔑 Fix API Keys First'}
            </button>
          </div>
          
          {!hasPlantIdKey && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg text-center">
              <p className="text-red-700">
                ⚠️ Plant.id API key is required to continue. Please follow the setup instructions above.
              </p>
            </div>
          )}
        </div>
        
        {/* Universal Plant Chatbot - Available even in test mode */}
        <UniversalPlantChatbot
          isOpen={isUniversalChatOpen}
          onToggle={() => setIsUniversalChatOpen(!isUniversalChatOpen)}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Debug Header */}
      <div className="bg-yellow-100 border-b border-yellow-300 px-4 py-2 text-center text-sm">
        <span className="text-yellow-800">
          🧪 Debug Mode Active | 
          <button
            onClick={() => setShowTest(true)}
            className="underline ml-2 hover:text-yellow-900"
          >
            Back to Setup Test
          </button>
          {debugMode && (
            <span className="ml-2">
              | Plant.id: {hasPlantIdKey ? '✅' : '❌'} | Gemini: {hasGeminiKey ? '✅' : '⚠️'}
            </span>
          )}
        </span>
      </div>

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
        {/* Quote Banner - Daily Inspiration */}
        <QuoteBanner />
        
        {/* Care Scheduler - Always Available */}
        <CareSchedulerButton plantInfo={analysisData?.plantInfo || null} />
        
        {/* Console Log Display for Debugging */}
        {debugMode && (
          <div className="max-w-2xl mx-auto mb-6">
            <div className="bg-gray-900 text-green-400 p-4 rounded-lg text-xs font-mono">
              <div className="mb-2 text-white">🖥️ Debug Console:</div>
              <div>Environment: {import.meta.env.MODE}</div>
              <div>Plant.id Key: {hasPlantIdKey ? 'Configured ✅' : 'Missing ❌'}</div>
              <div>Gemini Key: {hasGeminiKey ? 'Configured ✅' : 'Missing ⚠️'}</div>
              <div className="mt-2 text-xs text-gray-400">
                Check browser console (F12) for detailed logs during analysis
              </div>
            </div>
          </div>
        )}

        {/* Main App Content */}
        {!analysisData && (
          <div className="max-w-2xl mx-auto">
            <UploadForm 
              onImageUpload={handleImageUpload}
              isAnalyzing={isAnalyzing}
            />
          </div>
        )}

        {error && (
          <div className="max-w-2xl mx-auto mt-6">
            <div className="bg-red-50 border border-red-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-red-800 mb-2">❌ Analysis Failed</h3>
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
            <div className="bg-white rounded-2xl shadow-lg border border-green-100 p-6 text-center">
              <div className="animate-spin h-8 w-8 border-4 border-green-600 border-t-transparent rounded-full mx-auto mb-4"></div>
              <h3 className="text-lg font-semibold text-gray-700">Analyzing plant...</h3>
              <p className="text-sm text-gray-500 mt-2">Check console for detailed progress</p>
            </div>
          </div>
        )}

        {analysisData && (
          <div className="max-w-4xl mx-auto">
            <AnalysisResults 
              plantInfo={analysisData.plantInfo}
              healthInfo={analysisData.healthInfo}
              initialAdvice={analysisData.advice}
              onChatWithAI={() => setShowChat(true)}
            />

            <div className="text-center mt-6">
              <button
                onClick={() => {
                  setAnalysisData(null);
                  setError(null);
                }}
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-medium transition-colors shadow-md"
              >
                🌿 Analyze Another Plant
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
      
      {/* Universal Plant Chatbot - Always available */}
      <UniversalPlantChatbot
        plantInfo={analysisData?.plantInfo || null}
        healthInfo={analysisData?.healthInfo || null}
        isOpen={isUniversalChatOpen}
        onToggle={() => setIsUniversalChatOpen(!isUniversalChatOpen)}
      />
    </div>
  );
}

export default App;