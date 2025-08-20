import React, { useState } from 'react';
import { useGarden } from '../contexts/GardenContext';
import Toast from './Toast';
import { X } from 'lucide-react';

export default function AnalysisResults({ plantInfo, healthInfo, initialAdvice, onClose, onChatWithAI, imageFile }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState({ isVisible: false, message: '', type: 'success' });
  const { addPlant } = useGarden();

  if (!plantInfo && !healthInfo && !initialAdvice) return null;

  const showToast = (message, type = 'success', duration = 3000) => {
    setToast({ isVisible: true, message, type });
  };

  const handleSaveToGarden = async () => {
    if (!plantInfo) return;
    
    setIsSaving(true);
    try {
      let imageData = null;
      if (imageFile) {
        imageData = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = error => reject(error);
          reader.readAsDataURL(imageFile);
        });
      }

      const plantData = {
        id: plantInfo.id || `analysis_${Date.now()}`,
        name: plantInfo.name,
        scientificName: plantInfo.scientificName,
        type: plantInfo.scientificName || plantInfo.name, // CRITICAL FIX: Added missing 'type' property
        image: imageData,
        careTips: initialAdvice,
        plantInfo: plantInfo,
        healthInfo: healthInfo,
        createdAt: new Date().toISOString()
      };

      addPlant(plantData);
      showToast('🌱 Plant successfully saved to your garden!');
      
    } catch (error) {
      console.error('Error saving plant to garden:', error);
      showToast('Failed to save plant. Please try again.', 'error');
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
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-green-100 dark:border-gray-700 overflow-hidden mt-6">
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-gray-700 dark:to-gray-600 px-6 py-4 border-b border-green-100 dark:border-gray-600 flex items-center justify-between">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
          🌿 Plant Analysis Report
        </h3>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      <div className="p-6 space-y-6">
        {plantInfo && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{plantInfo.name}</h2>
            <p className="text-gray-600 dark:text-gray-400 italic">{plantInfo.scientificName}</p>
          </div>
        )}

        {initialAdvice && (
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">🤖 AI Care Advice</h3>
            <div className="prose prose-sm dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 leading-relaxed">
               {initialAdvice.split('\n').map((para, idx) => (
                 para.trim() && <p key={idx}>{para}</p>
               ))}
            </div>
          </div>
        )}

        <div className="flex gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
          <button 
            onClick={handleSaveToGarden}
            disabled={isSaving}
            className="flex-1 px-4 py-3 rounded-lg font-medium transition-colors bg-green-600 hover:bg-green-700 text-white disabled:bg-gray-400"
          >
            {isSaving ? 'Saving...' : 'Save to My Garden'}
          </button>
          <button 
            onClick={handleChatWithAI}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-medium transition-colors"
          >
            Chat with AI Advisor
          </button>
        </div>
      </div>

      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={() => setToast({ ...toast, isVisible: false })}
      />
    </div>
  );
}
