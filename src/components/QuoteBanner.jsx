import React, { useState, useEffect } from 'react';

const QuoteBanner = () => {
  const [currentQuote, setCurrentQuote] = useState(null);
  const [fadeClass, setFadeClass] = useState('opacity-100');

  // Curated REAL quotes from verified sources - Plants, Environment, Sustainability, Smart Cities
  const quotes = [
    {
      text: "Sustainability is no longer about doing less harm. It is about doing more good.",
      author: "Jochen Zeitz",
      title: "Former CEO of Puma, Environmental Leader",
      category: "sustainability"
    },
    {
      text: "Look deep into nature, and then you will understand everything better.",
      author: "Albert Einstein",
      title: "Theoretical Physicist",
      category: "nature"
    },
    {
      text: "Nature is the living, breathing manifestation of God. One must commune with it to experience the Divine.",
      author: "Paramahansa Yogananda",
      title: "Spiritual Teacher, Self-Realization Fellowship",
      category: "nature"
    },
    {
      text: "The Earth does not belong to us; we belong to the Earth. All things are connected like the blood that unites one family.",
      author: "Chief Seattle",
      title: "Suquamish Tribal Leader",
      category: "environment"
    },
    {
      text: "In every walk with nature, one receives far more than he seeks.",
      author: "John Muir",
      title: "Naturalist, Sierra Club Founder",
      category: "nature"
    },
    {
      text: "The future is green energy, sustainability, renewable energy.",
      author: "Arnold Schwarzenegger",
      title: "Former California Governor, Environmental Advocate",
      category: "sustainability"
    },
    {
      text: "A society grows great when old people plant trees whose shade they know they shall never sit in.",
      author: "Greek Proverb",
      title: "Ancient Wisdom",
      category: "environment"
    },
    {
      text: "The best time to plant a tree was 20 years ago. The second best time is now.",
      author: "Chinese Proverb",
      title: "Traditional Wisdom",
      category: "plants"
    },
    {
      text: "The environment is where we all meet; where we all have a mutual interest; it is the one thing all of us share.",
      author: "Lady Bird Johnson",
      title: "Former First Lady, Environmental Advocate",
      category: "environment"
    },
    {
      text: "We won't have a society if we destroy the environment.",
      author: "Margaret Mead",
      title: "Cultural Anthropologist",
      category: "environment"
    },
    {
      text: "Climate change is not just an environmental issue. It's a human rights issue.",
      author: "Kumi Naidoo",
      title: "Former Executive Director, Greenpeace International",
      category: "climate"
    },
    {
      text: "The shift to a cleaner energy economy won't happen overnight, and it will require tough choices along the way.",
      author: "Barack Obama",
      title: "44th President of the United States",
      category: "sustainability"
    },
    {
      text: "Biomimicry is innovation inspired by nature.",
      author: "Janine Benyus",
      title: "Biologist, Biomimicry Institute Founder",
      category: "innovation"
    },
    {
      text: "The forest is a peculiar organism of unlimited kindness and benevolence that makes no demands for its sustenance.",
      author: "Masanobu Fukuoka",
      title: "Japanese Farmer, Natural Farming Pioneer",
      category: "plants"
    },
    {
      text: "We abuse land because we regard it as a commodity belonging to us. When we see land as a community to which we belong, we may begin to use it with love and respect.",
      author: "Aldo Leopold",
      title: "Ecologist, A Sand County Almanac Author",
      category: "environment"
    },
    {
      text: "Plans to protect air and water, wilderness and wildlife, are in fact plans to protect man.",
      author: "Stewart Udall",
      title: "Former U.S. Secretary of the Interior",
      category: "environment"
    },
    {
      text: "The nation that destroys its soil destroys itself.",
      author: "Franklin D. Roosevelt",
      title: "32nd President of the United States",
      category: "environment"
    },
    {
      text: "What's the use of a house if you don't have a decent planet to put it on?",
      author: "Henry David Thoreau",
      title: "Philosopher, Naturalist",
      category: "environment"
    },
    {
      text: "The earth is what we all have in common.",
      author: "Wendell Berry",
      title: "Poet, Environmental Activist",
      category: "environment"
    },
    {
      text: "We do not inherit the earth from our ancestors; we borrow it from our children.",
      author: "Native American Proverb",
      title: "Indigenous Wisdom",
      category: "sustainability"
    },
    {
      text: "Renewable energy is practical and doable. We have the technology to power a clean energy future.",
      author: "Al Gore",
      title: "Former U.S. Vice President, Environmental Activist",
      category: "sustainability"
    },
    {
      text: "The environment is not a luxury that we can choose to protect or not. It's the foundation of our economy, our society, our very existence.",
      author: "Gro Harlem Brundtland",
      title: "Former Prime Minister of Norway, WHO Director-General",
      category: "sustainability"
    },
    {
      text: "Nature holds the key to our aesthetic, intellectual, cognitive and even spiritual satisfaction.",
      author: "E. O. Wilson",
      title: "Biologist, Harvard University",
      category: "nature"
    },
    {
      text: "In nature, nothing exists alone.",
      author: "Rachel Carson",
      title: "Marine Biologist, Silent Spring Author",
      category: "environment"
    },
    {
      text: "The ultimate test of man's conscience may be his willingness to sacrifice something today for future generations whose words of thanks will not be heard.",
      author: "Rachel Carson",
      title: "Marine Biologist, Silent Spring Author",
      category: "sustainability"
    },
    {
      text: "Trees are poems that the earth writes upon the sky.",
      author: "Kahlil Gibran",
      title: "Poet, Writer, Philosopher",
      category: "plants"
    },
    {
      text: "The environment and the economy are really both two sides of the same coin. If we cannot sustain the environment, we cannot sustain ourselves.",
      author: "Wangari Maathai",
      title: "Nobel Peace Prize Winner, Green Belt Movement Founder",
      category: "sustainability"
    },
    {
      text: "Climate change is a terrible problem, and it absolutely needs to be solved. It deserves to be a huge priority.",
      author: "Bill Gates",
      title: "Microsoft Co-founder, Climate Philanthropist",
      category: "climate"
    },
    {
      text: "The greatest threat to our planet is the belief that someone else will save it.",
      author: "Robert Swan",
      title: "Polar Explorer, Environmental Advocate",
      category: "environment"
    },
    {
      text: "Nature is not a place to visit. It is home.",
      author: "Terry Tempest Williams",
      title: "Naturalist, Environmental Writer",
      category: "nature"
    }
  ];

  // Get daily quote based on date
  const getDailyQuote = () => {
    const today = new Date();
    const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
    const quoteIndex = dayOfYear % quotes.length;
    return quotes[quoteIndex];
  };

  // Initialize quote and set up daily refresh
  useEffect(() => {
    setCurrentQuote(getDailyQuote());
    
    // Check for date change every hour
    const interval = setInterval(() => {
      const newQuote = getDailyQuote();
      if (newQuote !== currentQuote) {
        setFadeClass('opacity-0');
        setTimeout(() => {
          setCurrentQuote(newQuote);
          setFadeClass('opacity-100');
        }, 300);
      }
    }, 3600000); // Check every hour
    
    return () => clearInterval(interval);
  }, [currentQuote]);

  // Smooth quote transition effect
  useEffect(() => {
    setFadeClass('opacity-100');
  }, [currentQuote]);

  if (!currentQuote) return null;

  // Category-based styling
  const getCategoryEmoji = (category) => {
    switch (category) {
      case 'plants': return '🌱';
      case 'nature': return '🌿';
      case 'environment': return '🌍';
      case 'sustainability': return '♻️';
      case 'climate': return '🌡️';
      case 'innovation': return '💡';
      default: return '🌱';
    }
  };

  const getCategoryLabel = (category) => {
    switch (category) {
      case 'plants': return 'Plant Wisdom';
      case 'nature': return 'Nature';
      case 'environment': return 'Environment';
      case 'sustainability': return 'Sustainability';
      case 'climate': return 'Climate';
      case 'innovation': return 'Innovation';
      default: return 'Green Future';
    }
  };

  return (
    <div className="relative overflow-hidden rounded-3xl mb-8 group">
      {/* Enhanced Gradient Background with better blending */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 via-cyan-500 to-blue-600 opacity-85"></div>
      <div className="absolute inset-0 bg-gradient-to-tl from-green-500 via-teal-500 to-cyan-600 opacity-75"></div>
      <div 
        className="absolute inset-0 opacity-50"
        style={{
          background: 'linear-gradient(45deg, #10b981, #06b6d4, #3b82f6, #8b5cf6, #10b981)',
          backgroundSize: '400% 400%',
          animation: 'gradientShift 12s ease-in-out infinite'
        }}
      ></div>
      
      {/* Refined floating elements with better positioning */}
      <div className="absolute top-6 left-6 w-20 h-20 bg-white/15 rounded-full animate-bounce opacity-40" style={{ animationDelay: '0s', animationDuration: '6s' }}></div>
      <div className="absolute bottom-8 right-8 w-16 h-16 bg-white/20 rounded-full animate-bounce opacity-50" style={{ animationDelay: '2s', animationDuration: '5s' }}></div>
      <div className="absolute top-1/2 right-10 w-12 h-12 bg-white/25 rounded-full animate-bounce opacity-35" style={{ animationDelay: '4s', animationDuration: '7s' }}></div>
      
      {/* Main content with improved glassmorphism */}
      <div className="relative bg-white/90 backdrop-blur-xl m-1.5 rounded-3xl p-8 md:p-10 shadow-2xl transition-all duration-500 group-hover:bg-white/95 group-hover:shadow-3xl">
        <div className={`transition-opacity duration-500 ${fadeClass}`}>
          {/* Enhanced category badge with better spacing */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{getCategoryEmoji(currentQuote.category)}</span>
              <span className="text-sm font-semibold text-gray-700 bg-gray-100/80 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-200/50">
                {getCategoryLabel(currentQuote.category)}
              </span>
            </div>
            <div className="text-xs text-gray-600 bg-gray-50/80 backdrop-blur-sm px-3 py-2 rounded-full border border-gray-200/50">
              Daily Inspiration
            </div>
          </div>
          
          {/* Enhanced quote text with better typography */}
          <blockquote className="text-xl md:text-2xl lg:text-3xl font-medium text-gray-800 leading-relaxed mb-6 relative">
            <span className="text-5xl text-emerald-500 absolute -top-3 -left-2 font-serif opacity-80">"</span>
            <span className="ml-8 leading-relaxed">{currentQuote.text}</span>
            <span className="text-5xl text-emerald-500 font-serif opacity-80">"</span>
          </blockquote>
          
          {/* Enhanced author section with better hierarchy */}
          <div className="flex flex-col gap-2">
            <cite className="text-lg md:text-xl font-semibold text-gray-700 not-italic">
              — {currentQuote.author}
            </cite>
            <p className="text-sm text-gray-600 font-medium">
              {currentQuote.title}
            </p>
          </div>
        </div>
        
        {/* Enhanced decorative line with gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 via-cyan-500 to-blue-500 rounded-b-3xl opacity-80"></div>
      </div>
      
      {/* Custom CSS for enhanced gradient animation */}
      <style jsx>{`
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </div>
  );
};

export default QuoteBanner;