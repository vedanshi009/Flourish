import React, { useState } from 'react';

const ChatAdvisor = ({ onAskQuestion, plantContext, isVisible }) => {
  const [question, setQuestion] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  if (!isVisible) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim() || isLoading) return;

    const userQuestion = question.trim();
    setQuestion('');
    setIsLoading(true);

    // Add user question to chat
    setChatHistory(prev => [...prev, {
      type: 'user',
      message: userQuestion,
      timestamp: new Date()
    }]);

    try {
      const response = await onAskQuestion(userQuestion);
      
      // Add AI response to chat
      setChatHistory(prev => [...prev, {
        type: 'ai',
        message: response,
        timestamp: new Date()
      }]);
    } catch (error) {
      setChatHistory(prev => [...prev, {
        type: 'error',
        message: 'Sorry, I couldn\'t process your question. Please try again.',
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const suggestedQuestions = [
    "How often should I water this plant?",
    "What kind of soil does it prefer?",
    "How much sunlight does it need?",
    "When should I repot it?",
    "How can I propagate this plant?"
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-blue-100 overflow-hidden mt-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-blue-100">
        <h2 className="text-xl font-semibold text-gray-800">💬 Chat with AI Plant Expert</h2>
        <p className="text-sm text-gray-600">Ask specific questions about your {plantContext?.plantInfo?.name || 'plant'}</p>
      </div>

      <div className="p-6">
        {/* Suggested Questions */}
        {chatHistory.length === 0 && (
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">Suggested Questions:</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {suggestedQuestions.map((suggestion, index) => (
                <button
                  key={index}
                  className="text-left p-3 text-sm bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-300 rounded-lg transition-colors"
                  onClick={() => setQuestion(suggestion)}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Chat History */}
        {chatHistory.length > 0 && (
          <div className="mb-6 space-y-4 max-h-96 overflow-y-auto">
            {chatHistory.map((chat, index) => (
              <div key={index} className={`flex ${chat.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  chat.type === 'user' 
                    ? 'bg-blue-600 text-white' 
                    : chat.type === 'error'
                    ? 'bg-red-100 text-red-700 border border-red-200'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  <div className="text-sm">
                    {chat.type === 'ai' && <span className="font-semibold">🤖 Plant Expert: </span>}
                    {chat.type === 'error' && <span className="font-semibold">❌ Error: </span>}
                    <span>{chat.message}</span>
                  </div>
                  <div className={`text-xs mt-1 opacity-70 ${
                    chat.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    {chat.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="max-w-xs lg:max-w-md px-4 py-2 rounded-lg bg-gray-100">
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                    <span className="text-sm text-gray-600">Plant expert is thinking...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Question Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="flex space-x-2">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask about watering, soil, sunlight, care tips..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isLoading}
            />
            <button 
              type="submit" 
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors shadow-md"
              disabled={!question.trim() || isLoading}
            >
              {isLoading ? '...' : 'Ask'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatAdvisor;