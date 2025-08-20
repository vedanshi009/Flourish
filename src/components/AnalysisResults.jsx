import React, { useState } from 'react';
import { useGarden } from '../contexts/GardenContext';
import Toast from './Toast';

export default function AnalysisResults({ plantInfo, healthInfo, initialAdvice, onClose, onChatWithAI, imageFile }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const { addPlant } = useGarden();

  if (!plantInfo && !healthInfo && !initialAdvice) return null;

  const handleSaveToGarden = async () => {
    if (!plantInfo) return;
    
    setIsSaving(true);
    try {
      // Convert image file to base64 if available
      let imageData = null;
      if (imageFile) {
        imageData = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.readAsDataURL(imageFile);
        });
      }

      // Prepare plant data for saving
      const plantData = {
        name: plantInfo.name,
        scientificName: plantInfo.scientificName,
        image: imageData,
        advice: initialAdvice,
        plantInfo: plantInfo,
        healthInfo: healthInfo
      };

      // Add to garden
      addPlant(plantData);
      
      // Show success message
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
      
    } catch (error) {
      console.error('Error saving plant to garden:', error);
      alert('Failed to save plant to garden. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleChatWithAI = () => {
    if (onChatWithAI) {
      onChatWithAI();
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-green-100 overflow-hidden mt-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-6 py-4 border-b border-green-100 flex items-center justify-between">
        <h3 className="text-xl font-semibold text-gray-800 flex items-center">
          🌿 Plant Analysis Report
        </h3>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      <div className="p-6 space-y-6">
        {/* Plant Identification */}
        {plantInfo && (
          <div className="space-y-2">
            <h2 className="text-lg font-semibold text-gray-800">🌱 Plant Identification</h2>
            <p className="text-xl font-bold">{plantInfo.name}</p>
            {plantInfo.scientificName && (
              <p className="text-gray-600 italic">{plantInfo.scientificName}</p>
            )}

            {/* Confidence Score */}
            <div className="mt-2">
              <span className="text-sm text-gray-600">Confidence:</span>
              <div className="w-full bg-gray-200 h-2 rounded-lg mt-1">
                <div
                  className="bg-green-500 h-2 rounded-lg"
                  style={{ width: `${(plantInfo.confidence || 0) * 100}%` }}
                />
              </div>
              <span className="text-sm text-gray-700">{((plantInfo.confidence || 0) * 100).toFixed(1)}%</span>
            </div>

            {/* Common Names */}
            {plantInfo.commonNames?.length > 0 && (
              <p className="text-sm text-gray-600">
                <strong>Also known as:</strong> {plantInfo.commonNames.join(', ')}
              </p>
            )}
          </div>
        )}

        {/* Health Assessment */}
        {healthInfo && (
          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-gray-800">🏥 Health Assessment</h2>
            <div className="flex items-center gap-3">
              <span className="text-2xl">{healthInfo.isHealthy ? '💚' : '⚠️'}</span>
              <span className="font-medium">
                {healthInfo.isHealthy ? 'Plant Looks Healthy!' : 'Issues Detected'}
              </span>
            </div>
            <p className="text-sm text-gray-600">
              Health Score: <span className="font-medium">{(healthInfo.healthScore || 1).toFixed(2)}/1.0</span>
            </p>

            {/* Detected Issues */}
            {healthInfo.diseases?.length > 0 && (
              <div className="space-y-4 mt-3">
                <h4 className="font-semibold text-gray-700">Detected Issues:</h4>
                {healthInfo.diseases.map((disease, idx) => (
                  <div key={idx} className="p-4 rounded-lg border border-red-200 bg-red-50">
                    <div className="flex justify-between font-semibold text-red-700">
                      <span>{disease.name}</span>
                      <span>{((disease.probability || 0) * 100).toFixed(1)}%</span>
                    </div>
                    {disease.description && <p className="text-sm text-gray-600 mt-1">{disease.description}</p>}
                    {disease.cause && <p className="text-sm text-gray-600"><strong>Cause:</strong> {disease.cause}</p>}
                    {disease.treatment && <p className="text-sm text-gray-600"><strong>Treatment:</strong> {disease.treatment}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* AI Advice */}
        {initialAdvice && (
          <div className="space-y-2">
            <h2 className="text-lg font-semibold text-gray-800">🤖 AI Care Advice</h2>
            <div className={`text-gray-700 leading-relaxed ${!isExpanded && initialAdvice.length > 200 ? 'overflow-hidden' : ''}`} 
                 style={!isExpanded && initialAdvice.length > 200 ? { maxHeight: '100px' } : {}}>
              {initialAdvice.split('\n').map((para, idx) => (
                para.trim() && <p key={idx} className="mb-2">{para}</p>
              ))}
            </div>
            {initialAdvice.length > 200 && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-green-600 hover:text-green-700 text-sm font-medium"
              >
                {isExpanded ? 'Show Less' : 'Read More'}
              </button>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 border-t border-gray-100">
          <button 
            onClick={handleSaveToGarden}
            disabled={isSaving}
            className={`flex-1 px-4 py-3 rounded-lg font-medium transition-colors ${
              isSaving 
                ? 'bg-gray-400 cursor-not-allowed' 
                : saveSuccess 
                  ? 'bg-green-500 text-white' 
                  : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
          >
            {isSaving ? 'Saving...' : saveSuccess ? '✓ Saved to Garden!' : 'Save to My Garden'}
          </button>
          <button 
            onClick={handleChatWithAI}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-medium transition-colors"
          >
            Chat with AI Advisor
          </button>
        </div>

        {/* Toast Notification */}
        <Toast
          message="🌱 Plant successfully saved to your garden!"
          type="success"
          isVisible={saveSuccess}
          onClose={() => setSaveSuccess(false)}
        />

        {/* Timestamp */}
        <div className="text-xs text-gray-500 text-center pt-2">
          Analysis completed at {new Date().toLocaleString()}
        </div>
      </div>
    </div>
  );
}
