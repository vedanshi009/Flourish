// FILE: src/components/SetupTest.jsx (Optional - for testing your setup)
import React, { useState, useEffect } from 'react';
import { testApiConnection, checkApiUsage } from '../utils/plantid';
import { testGeminiConnection } from '../utils/gemini';

const SetupTest = () => {
  const [testResults, setTestResults] = useState({
    plantId: { status: 'testing', message: 'Testing...' },
    gemini: { status: 'testing', message: 'Testing...' },
    usage: null
  });

  useEffect(() => {
    runTests();
  }, []);

  const runTests = async () => {
    // Test Plant.id API
    try {
      const plantIdResult = await testApiConnection();
      setTestResults(prev => ({
        ...prev,
        plantId: {
          status: plantIdResult ? 'success' : 'error',
          message: plantIdResult ? 'Plant.id API connected successfully!' : 'Plant.id API connection failed'
        }
      }));

      // Get usage info if connection successful
      if (plantIdResult) {
        try {
          const usage = await checkApiUsage();
          setTestResults(prev => ({
            ...prev,
            usage: usage
          }));
        } catch (err) {
          console.warn('Could not fetch usage info:', err);
        }
      }
    } catch (err) {
      setTestResults(prev => ({
        ...prev,
        plantId: {
          status: 'error',
          message: `Plant.id error: ${err.message}`
        }
      }));
    }

    // Test Gemini API
    try {
      const geminiResult = await testGeminiConnection();
      setTestResults(prev => ({
        ...prev,
        gemini: {
          status: geminiResult ? 'success' : 'warning',
          message: geminiResult ? 'Gemini AI connected successfully!' : 'Gemini AI connection failed (app will use basic advice)'
        }
      }));
    } catch (err) {
      setTestResults(prev => ({
        ...prev,
        gemini: {
          status: 'warning',
          message: `Gemini warning: ${err.message} (app will use basic advice)`
        }
      }));
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'success': return 'bg-green-100 border-green-300 text-green-800';
      case 'error': return 'bg-red-100 border-red-300 text-red-800';
      case 'warning': return 'bg-yellow-100 border-yellow-300 text-yellow-800';
      default: return 'bg-gray-100 border-gray-300 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'warning': return '⚠️';
      default: return '🔄';
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-lg border">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">🧪 Setup Test Results</h2>
      
      <div className="space-y-4">
        {/* Plant.id Test */}
        <div className={`p-4 rounded-lg border-2 ${getStatusColor(testResults.plantId.status)}`}>
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Plant.id API</h3>
            <span className="text-2xl">{getStatusIcon(testResults.plantId.status)}</span>
          </div>
          <p className="text-sm mt-1">{testResults.plantId.message}</p>
          
          {testResults.usage && (
            <div className="mt-3 text-xs space-y-1">
              <p><strong>Plan:</strong> {testResults.usage.plan}</p>
              <p><strong>Credits used:</strong> {testResults.usage.used || 0} / {testResults.usage.total || 'unlimited'}</p>
              {testResults.usage.remaining && (
                <p><strong>Credits remaining:</strong> {testResults.usage.remaining}</p>
              )}
            </div>
          )}
        </div>

        {/* Gemini Test */}
        <div className={`p-4 rounded-lg border-2 ${getStatusColor(testResults.gemini.status)}`}>
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Google Gemini AI</h3>
            <span className="text-2xl">{getStatusIcon(testResults.gemini.status)}</span>
          </div>
          <p className="text-sm mt-1">{testResults.gemini.message}</p>
        </div>
      </div>

      {/* Environment Variables Check */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold text-gray-800 mb-3">Environment Variables</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>VITE_PLANTID_API_KEY:</span>
            <span className={import.meta.env.VITE_PLANTID_API_KEY ? 'text-green-600' : 'text-red-600'}>
              {import.meta.env.VITE_PLANTID_API_KEY ? '✅ Set' : '❌ Missing'}
            </span>
          </div>
          <div className="flex justify-between">
            <span>VITE_GEMINI_API_KEY:</span>
            <span className={import.meta.env.VITE_GEMINI_API_KEY ? 'text-green-600' : 'text-yellow-600'}>
              {import.meta.env.VITE_GEMINI_API_KEY ? '✅ Set' : '⚠️ Missing (optional)'}
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-6 flex gap-3">
        <button
          onClick={runTests}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          🔄 Re-test APIs
        </button>
        
        {testResults.plantId.status === 'success' && (
          <button
            onClick={() => window.location.reload()}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            🚀 Start Using App
          </button>
        )}
      </div>

      {/* Setup Instructions */}
      {(testResults.plantId.status === 'error' || !import.meta.env.VITE_PLANTID_API_KEY) && (
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-semibold text-blue-800 mb-2">Setup Instructions:</h4>
          <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
            <li>Create a <code>.env</code> file in your project root</li>
            <li>Get a free API key from <a href="https://plant.id" target="_blank" rel="noopener noreferrer" className="underline">plant.id</a></li>
            <li>Add <code>VITE_PLANTID_API_KEY=your_key_here</code> to the .env file</li>
            <li>Optionally, get a Gemini API key from <a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="underline">Google AI Studio</a></li>
            <li>Add <code>VITE_GEMINI_API_KEY=your_key_here</code> to the .env file</li>
            <li>Restart your development server</li>
          </ol>
        </div>
      )}
    </div>
  );
};

export default SetupTest;