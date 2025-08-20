import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Leaf, User, MessageCircle, Minimize2, Sparkles, Camera, BookOpen, Recycle } from 'lucide-react';
import { generatePlantAdvice } from '../utils/gemini';

// Enhanced MessageBubble Component with modern 2025 design
const MessageBubble = ({ message, isUser, isTyping = false }) => {
  const formatMessageContent = (content) => {
    if (isTyping) {
      return (
        <div className="flex items-center space-x-2">
          <Loader2 className="w-4 h-4 animate-spin text-green-500" />
          <span className="text-sm text-green-600">PlantCare AI is thinking...</span>
        </div>
      );
    }

    // Parse markdown-style formatting
    const lines = content.split('\n');
    return lines.map((line, index) => {
      if (line.trim() === '') return <br key={index} />;
      
      // Headers with **text**
      if (line.includes('**') && !line.startsWith('•')) {
        const parts = line.split('**');
        return (
          <p key={index} className="font-semibold text-green-800 mb-2">
            {parts.map((part, i) => 
              i % 2 === 1 ? <span key={i} className="font-bold">{part}</span> : part
            )}
          </p>
        );
      }
      
      // Bullet points
      if (line.startsWith('•')) {
        return (
          <div key={index} className="flex items-start space-x-2 mb-1">
            <span className="text-green-500 mt-1 font-bold">•</span>
            <span className="flex-1">{line.substring(1).trim()}</span>
          </div>
        );
      }
      
      return <p key={index} className="mb-1">{line}</p>;
    });
  };

  return (
    <div className={`flex items-start space-x-3 mb-4 ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
      {/* Avatar */}
      <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center shadow-lg ${
        isUser 
          ? 'bg-gradient-to-r from-blue-500 to-purple-500' 
          : 'bg-gradient-to-r from-green-500 to-emerald-500'
      }`}>
        {isUser ? (
          <User className="w-5 h-5 text-white" />
        ) : (
          <Leaf className="w-5 h-5 text-white" />
        )}
      </div>

      {/* Message Content */}
      <div className={`max-w-sm lg:max-w-md px-4 py-3 rounded-2xl shadow-md ${
        isUser
          ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-br-md'
          : 'bg-white border border-green-100 text-gray-800 rounded-bl-md'
      }`}>
        <div className={`${isUser ? 'text-white' : 'text-gray-700'} leading-relaxed`}>
          {formatMessageContent(message.content)}
        </div>
        
        {!isTyping && (
          <div className={`text-xs mt-2 ${isUser ? 'text-blue-100' : 'text-gray-400'}`}>
            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        )}
      </div>
    </div>
  );
};

// Main Universal Plant Care ChatBot
const UniversalPlantChatbot = ({ 
  plantInfo = null, // Optional - works without it!
  healthInfo = null, // Optional - works without it!
  isOpen = false, 
  onToggle = () => {} 
}) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: plantInfo && plantInfo.name !== 'Unknown plant' 
        ? `🌱 Hi! I can see you have a ${plantInfo.name}! I'm here to help with:\n\n• 💧 Specific care advice for your plant\n• 🌿 General plant care questions\n• ♻️ Sustainable gardening tips\n• 🔍 Plant identification help\n\nWhat would you like to know?`
        : `🌱 Welcome to PlantCare AI! I'm your personal plant expert ready to help with:\n\n• 💧 Watering schedules & techniques\n• ☀️ Lighting requirements\n• 🌿 Plant identification\n• 🐛 Pest & disease solutions\n• ♻️ Sustainable gardening practices\n• 🌱 Propagation & care tips\n\nNo plant photo needed - just ask me anything about plants, gardening, or sustainable living! What's on your mind? 🤔`,
      timestamp: new Date()
    }
  ]);
  
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    // Add typing indicator
    const typingMessage = {
      id: Date.now() + 1,
      type: 'bot',
      content: '',
      timestamp: new Date(),
      isTyping: true
    };
    setMessages(prev => [...prev, typingMessage]);

    try {
      // Use actual plant data if available, otherwise use defaults
      const response = await generatePlantAdvice(
        plantInfo || { name: 'Unknown plant' },
        healthInfo || { isHealthy: true },
        inputMessage.trim()
      );

      // Remove typing indicator and add real response
      setMessages(prev => {
        const filtered = prev.filter(msg => !msg.isTyping);
        return [...filtered, {
          id: Date.now() + 2,
          type: 'bot',
          content: response,
          timestamp: new Date()
        }];
      });
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => {
        const filtered = prev.filter(msg => !msg.isTyping);
        return [...filtered, {
          id: Date.now() + 2,
          type: 'bot',
          content: '🌱 Oops! I encountered an issue. But I\'m still here to help with your plant questions! Try asking again - I love talking about plants, gardening, and sustainable living! 💚',
          timestamp: new Date()
        }];
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Universal quick questions that work with or without plant data
  const quickQuestions = plantInfo && plantInfo.name !== 'Unknown plant' ? [
    `How do I care for my ${plantInfo.name}?`,
    "What's wrong with my plant's leaves?",
    "When should I repot this plant?",
    "How do I make my plant healthier?"
  ] : [
    "How often should I water houseplants?",
    "What are the best beginner plants?", 
    "How do I know if my plant is healthy?",
    "What's sustainable plant care?",
    "How do I propagate plants?",
    "Best plants for clean air?"
  ];

  const handleQuickQuestion = (question) => {
    setInputMessage(question);
    setTimeout(() => handleSendMessage(), 100);
  };

  if (!isOpen) {
    return (
      <button
        onClick={onToggle}
        className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110 z-50 group"
        aria-label="Open plant care chatbot"
      >
        <div className="relative">
          <div className="flex items-center justify-center">
            <MessageCircle className="w-7 h-7" />
          </div>
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full animate-pulse flex items-center justify-center">
            <Sparkles className="w-3 h-3 text-white" />
          </div>
          
          {/* Hover tooltip */}
          <div className="absolute right-full mr-4 top-1/2 transform -translate-y-1/2 bg-black text-white px-3 py-2 rounded-lg text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            Ask about plants & sustainability!
            <div className="absolute left-full top-1/2 transform -translate-y-1/2 w-0 h-0 border-l-4 border-l-black border-t-4 border-t-transparent border-b-4 border-b-transparent"></div>
          </div>
        </div>
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-96 h-[650px] bg-white rounded-2xl shadow-2xl border border-green-100 flex flex-col z-50 overflow-hidden">
      {/* Enhanced Header */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-4 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <Leaf className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg">PlantCare AI</h3>
              <p className="text-xs text-green-100">
                {plantInfo && plantInfo.name !== 'Unknown plant' 
                  ? `Caring for your ${plantInfo.name}` 
                  : 'Your plant & sustainability expert'
                }
              </p>
            </div>
          </div>
          <div className="flex space-x-1">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></div>
              <span className="text-xs text-green-100">Online</span>
            </div>
            <button
              onClick={onToggle}
              className="w-8 h-8 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors ml-2"
              aria-label="Minimize chat"
            >
              <Minimize2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 bg-gradient-to-b from-green-50/30 to-white">
        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            message={message}
            isUser={message.type === 'user'}
            isTyping={message.isTyping}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Questions - Different based on context */}
      {messages.length <= 2 && !isLoading && (
        <div className="px-4 py-2 border-t border-green-100 bg-gradient-to-r from-green-50 to-emerald-50">
          <p className="text-xs text-gray-600 mb-2 font-medium">💡 Try asking:</p>
          <div className="grid grid-cols-1 gap-1 max-h-20 overflow-hidden">
            {quickQuestions.slice(0, 3).map((question, index) => (
              <button
                key={index}
                onClick={() => handleQuickQuestion(question)}
                className="text-left text-xs bg-white hover:bg-green-100 border border-green-200 hover:border-green-300 rounded-lg px-3 py-2 transition-all duration-200 hover:scale-[1.02]"
              >
                {question}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Enhanced Input Area */}
      <div className="p-4 border-t border-green-100 bg-white">
        {/* Action buttons for context */}
        <div className="flex space-x-2 mb-3">
          <button 
            onClick={() => handleQuickQuestion("Tell me about sustainable gardening")}
            className="flex items-center space-x-1 px-2 py-1 bg-green-100 hover:bg-green-200 text-green-700 rounded-full text-xs transition-colors"
          >
            <Recycle className="w-3 h-3" />
            <span>Sustainability</span>
          </button>
          <button 
            onClick={() => handleQuickQuestion("What are good beginner plants?")}
            className="flex items-center space-x-1 px-2 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-full text-xs transition-colors"
          >
            <BookOpen className="w-3 h-3" />
            <span>Beginners</span>
          </button>
          {!plantInfo || plantInfo.name === 'Unknown plant' ? (
            <button 
              onClick={() => handleQuickQuestion("I have a plant photo to identify")}
              className="flex items-center space-x-1 px-2 py-1 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-full text-xs transition-colors"
            >
              <Camera className="w-3 h-3" />
              <span>Identify</span>
            </button>
          ) : null}
        </div>
        
        <div className="flex items-end space-x-2">
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={plantInfo && plantInfo.name !== 'Unknown plant' 
                ? `Ask about your ${plantInfo.name}...` 
                : "Ask about plants, gardening, sustainability..."
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none text-sm"
              rows="1"
              disabled={isLoading}
              style={{ minHeight: '44px', maxHeight: '120px' }}
            />
          </div>
          <button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isLoading}
            className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-2">
          Press Enter to send • Works with or without plant photos • Powered by Gemini AI
        </p>
      </div>
    </div>
  );
};

export default UniversalPlantChatbot;
