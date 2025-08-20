"use client"

import React, { useState } from 'react';

import { Mic, MessageSquare, Zap, Brain, Shield, Headphones } from 'lucide-react';

const FeaturesPage = () => {
  const [isListening, setIsListening] = useState(false);

  const features = [
    {
      icon: <Mic className="w-8 h-8" />,
      title: "Voice Recognition",
      description: "Talk naturally and I'll understand you perfectly"
    },
    {
      icon: <MessageSquare className="w-8 h-8" />,
      title: "Smart Conversations", 
      description: "I remember what we talked about and learn from you"
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Instant Responses",
      description: "Get answers in seconds, not minutes"
    },
    {
      icon: <Brain className="w-8 h-8" />,
      title: "Gets Smarter",
      description: "Adapts to your style and preferences over time"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Private & Secure",
      description: "Your conversations stay between us, always encrypted"
    },
    {
      icon: <Headphones className="w-8 h-8" />,
      title: "Natural Voice",
      description: "Realistic speech that sounds human, not robotic"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="text-center py-16 px-6">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          Agent-Sync Features
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Experience AI that actually understands and responds like a human
        </p>
      </div>

      {/* Voice Demo */}
      <div className="max-w-md mx-auto mb-16 px-6">
        <div className="bg-gray-50 rounded-3xl p-8 text-center">
          <button
            onClick={() => setIsListening(!isListening)}
            className={`w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center transition-all ${
              isListening 
                ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
                : 'bg-blue-500 hover:bg-blue-600'
            }`}
          >
            <Mic className="w-8 h-8 text-white" />
          </button>
          <p className="text-gray-700 font-medium">
            {isListening ? 'Listening...' : 'Click to try voice'}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            "Hey assistant, what can you help me with?"
          </p>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-6xl mx-auto px-6 pb-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="text-center group">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-blue-600 group-hover:bg-blue-200 transition-colors">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      
    </div>
  );
};

export default FeaturesPage;