import React from 'react';
import { Target, Users, Lightbulb, Heart, Award, Globe } from 'lucide-react';

const AboutPage = () => {
  const stats = [
    { number: "2K+", label: "Active Users" },
    { number: "50k+", label: "Conversations" },
    { number: "25+", label: "Languages" },
    { number: "99.9%", label: "Uptime" }
  ];

  const values = [
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Human-Centered",
      description: "We design AI that feels natural and puts people first"
    },
    {
      icon: <Lightbulb className="w-8 h-8" />,
      title: "Innovation",
      description: "Pushing the boundaries of what's possible with voice AI"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Accessibility",
      description: "Making advanced AI available to everyone, everywhere"
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: "Excellence",
      description: "Committed to delivering the highest quality experience"
    }
  ];

  const achievements = [
    {
      icon: "🏆",
      title: "Best AI Innovation Award",
      description: "TechCrunch Disrupt 2023",
      year: "2023"
    },
    {
      icon: "🌟",
      title: "Top Voice Assistant",
      description: "Product Hunt #1 Product of the Day",
      year: "2023"
    },
    {
      icon: "🚀",
      title: "Fastest Growing AI Startup",
      description: "Forbes 30 Under 30",
      year: "2022"
    },
    {
      icon: "💡",
      title: "Innovation in AI Speech",
      description: "MIT Technology Review",
      year: "2022"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="text-center py-16 px-6">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          About Our Mission
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          We're building the future of human-AI interaction through natural voice conversations. 
          Our goal is to make AI assistants that truly understand and help people in their daily lives.
        </p>
      </div>

      {/* Stats Section */}
      <div className="bg-blue-50 py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index}>
                <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Story Section */}
      <div className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                Started with a Simple Question
              </h3>
              <p className="text-gray-600 mb-4">
                "Why can't we just talk to computers like we talk to people?" 
                This question sparked our journey in 2020 when our founders met at a tech conference.
              </p>
              <p className="text-gray-600 mb-4">
                We saw that existing voice assistants were limited and robotic. 
                People deserved better - AI that could understand context, remember conversations, 
                and respond naturally.
              </p>
              <p className="text-gray-600">
                Today, we're proud to serve over 50,000 users worldwide with technology 
                that makes AI feel more human and helpful than ever before.
              </p>
            </div>
            <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl p-8 text-center">
              <Globe className="w-16 h-16 text-blue-600 mx-auto mb-4" />
              <h4 className="text-xl font-semibold text-gray-900 mb-2">Global Impact</h4>
              <p className="text-gray-600">
                Helping people communicate with AI in 25+ languages across 40+ countries
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="bg-gray-50 py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-xl text-gray-600">What drives us every day</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-blue-600">
                  {value.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {value.title}
                </h3>
                <p className="text-gray-600">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    
    </div>
  );
};

export default AboutPage;