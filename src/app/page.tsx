"use client"
import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  Sparkles,
  Code,
  BarChart3,
  TrendingUp,
  Menu,
  Star,
  ArrowRight,
  X,
  Check,
  Brain,
  Lightbulb,
  Zap,
  Shield,
  Users,
  Play
} from 'lucide-react';

const AgentsYUCLanding = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Material UI App Bar */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded mr-3 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-semibold text-gray-900">Agent-Sync</span>
            </div>

            <nav className="hidden md:flex items-center space-x-8">
              <a className="text-gray-600 hover:text-blue-600 transition-colors"  
               onClick={() => (window.location.href = "/pages/component/landingpages/feature")}>Features</a>

              <a className="text-gray-600 hover:text-blue-600 transition-colors"
               onClick={() => (window.location.href = "/pages/component/landingpages/pricing")}>Pricing</a>
               
              <a href="#about" className="text-gray-600 hover:text-blue-600 transition-colors"
                onClick={() => (window.location.href = "/pages/component/landingpages/about")}>About</a>
            </nav>

          
          </div>
        </div>
      </header>

      {/* Hero Section - Inspired by AI Assistant Interface */}
      <main className="flex-1 flex items-center justify-center min-h-screen py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          {/* Main Avatar/Icon */}
          <div className={`transform transition-all duration-1000 ${isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
          <div 
  className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg"
  style={{ backgroundColor: '#6366f1' }}
>
  <MessageSquare className="w-12 h-12 text-white" />
</div>

            {/* Main Title */}
            <h1 className="text-4xl md:text-5xl font-normal text-gray-900 mb-6 tracking-tight">
              AI-Powered Agent Platform
            </h1>

            {/* Description */}
            <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
              Start a conversation by speaking or typing. I can help with creative ideas, code problems, analysis, and strategic planning.
            </p>

            {/* Capability Chips */}
            <div className="flex flex-wrap justify-center gap-3 mb-12">
              <div className="flex items-center bg-orange-50 text-orange-600 px-4 py-2 rounded-full border border-orange-200">
                <Lightbulb className="w-4 h-4 mr-2" />
                Creative Ideas
              </div>
              <div className="flex items-center bg-blue-50 text-blue-600 px-4 py-2 rounded-full border border-blue-200">
                <Code className="w-4 h-4 mr-2" />
                Code Help
              </div>
              <div className="flex items-center bg-purple-50 text-purple-600 px-4 py-2 rounded-full border border-purple-200">
                <BarChart3 className="w-4 h-4 mr-2" />
                Analysis
              </div>
              <div className="flex items-center bg-green-50 text-green-600 px-4 py-2 rounded-full border border-green-200">
                <TrendingUp className="w-4 h-4 mr-2" />
                Strategy
              </div>
            </div>

            {/* CTA Button */}
            <button
              onClick={() => (window.location.href = "/pages/auth/login")}
              className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-medium hover:bg-blue-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 mb-16"
              style={{ backgroundColor: '#6366f1' }}
            >
              Get Started Free
            </button>

          </div>
        </div>
      </main>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-normal text-gray-900 mb-4">
              Why Choose Agent-Sync?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Experience the next generation of AI-powered automation
            </p>
          </div>

          {/* Features without grid - using flex */}
          <div className="flex flex-wrap justify-center gap-8">
            <div className="bg-white rounded-lg p-8 shadow-md border border-gray-100 max-w-sm flex-1 min-w-72 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                <Brain className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Intelligent Learning
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Our AI agents learn from your interactions and adapt to your workflow patterns for personalized automation.
              </p>
            </div>

            <div className="bg-white rounded-lg p-8 shadow-md border border-gray-100 max-w-sm flex-1 min-w-72 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-6">
                <Zap className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Lightning Fast
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Process complex tasks in seconds with our optimized AI infrastructure built for enterprise scale.
              </p>
            </div>

            <div className="bg-white rounded-lg p-8 shadow-md border border-gray-100 max-w-sm flex-1 min-w-72 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-6">
                <Shield className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Secure & Compliant
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Enterprise-grade security with end-to-end encryption and compliance with industry standards.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-normal text-gray-900 mb-16">
            How It Works
          </h2>

          {/* Steps - using flex column */}
          <div className="flex flex-col space-y-12">
            <div className="flex flex-col md:flex-row items-center md:space-x-8">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mb-4 md:mb-0 text-white font-bold text-xl">
                1
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Connect Your Tools</h3>
                <p className="text-gray-600">Seamlessly integrate with your existing workflow and applications.</p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center md:space-x-8">
              <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mb-4 md:mb-0 text-white font-bold text-xl">
                2
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Configure Agents</h3>
                <p className="text-gray-600">Set up intelligent agents tailored to your specific business needs.</p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center md:space-x-8">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-4 md:mb-0 text-white font-bold text-xl">
                3
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Watch Magic Happen</h3>
                <p className="text-gray-600">Let AI agents automate tasks while you focus on strategic work.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-normal text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-lg text-gray-600">
              Choose the plan that fits your needs
            </p>
          </div>

          {/* Pricing Cards - using flex */}
          <div className="flex flex-wrap justify-center gap-8">
            <div className="bg-white rounded-lg p-8 shadow-md border border-gray-200 max-w-sm flex-1 min-w-80">
              <div className="text-center mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Starter</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-gray-900">$0</span>
                  <span className="text-gray-600">/month</span>
                </div>
                <p className="text-gray-600">Perfect for small teams</p>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-gray-700">5 AI Agents</span>
                </div>
                <div className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-gray-700">Basic Analytics</span>
                </div>
                <div className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-gray-700">Email Support</span>
                </div>
              </div>

              <button className="w-full bg-gray-100 text-gray-900 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            onClick={()=>(window.location.href='/pages/auth/login')} >
                Start Free Trial
              </button>
            </div>

            <div className="bg-white rounded-lg p-8 shadow-lg border-2 border-blue-500 max-w-sm flex-1 min-w-80 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                  Most Popular
                </span>
              </div>

              <div className="text-center mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Professional</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-gray-900">$19</span>
                  <span className="text-gray-600">/month</span>
                </div>
                <p className="text-gray-600">Best for growing businesses</p>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-gray-700">25 AI Agents</span>
                </div>
                <div className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-gray-700">Advanced Analytics</span>
                </div>
                <div className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-gray-700">Priority Support</span>
                </div>
                <div className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-gray-700">API Access</span>
                </div>
              </div>

              <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
               onClick={()=>(window.location.href='/pages/auth/login')}>
                Start Trial
              </button>
            </div>

            <div className="bg-white rounded-lg p-8 shadow-md border border-gray-200 max-w-sm flex-1 min-w-80">
              <div className="text-center mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Enterprise</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-gray-900">$99</span>
                  <span className="text-gray-600">/month</span>
                </div>
                <p className="text-gray-600">For large organizations</p>
              </div>
{/* ol */}
              <div className="space-y-4 mb-8">
                <div className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-gray-700">Unlimited Agents</span>
                </div>
                <div className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-gray-700">Custom Analytics</span>
                </div>
                <div className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-gray-700">24/7 Support</span>
                </div>
                <div className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-gray-700">White Label</span>
                </div>
              </div>

              <button className="w-full bg-gray-100 text-gray-900 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
               onClick={()=>(window.location.href='/pages/auth/login')}>
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-normal text-gray-900 mb-4">
              What Our Users Say
            </h2>
          </div>

          {/* Testimonials - using flex */}
          <div className="flex flex-wrap justify-center gap-8">
            <div className="bg-white rounded-lg p-8 shadow-md border border-gray-100 max-w-sm flex-1 min-w-80">
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 mb-6 italic">
                "Agent-Sync transformed our workflow. Our productivity increased by 300% within the first month!"
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold mr-4">
                  SC
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Sarah Chen</div>
                  <div className="text-gray-600 text-sm">Product Manager • TechCorp</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-8 shadow-md border border-gray-100 max-w-sm flex-1 min-w-80">
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 mb-6 italic">
                "The most intuitive AI platform I've ever used. Integration was seamless and immediate."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold mr-4">
                  MR
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Michael Rodriguez</div>
                  <div className="text-gray-600 text-sm">CTO • StartupXYZ</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-8 shadow-md border border-gray-100 max-w-sm flex-1 min-w-80">
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 mb-6 italic">
                "Revolutionary technology that actually delivers on its promises. Highly recommended!"
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-bold mr-4">
                  EW
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Emily Watson</div>
                  <div className="text-gray-600 text-sm">Operations Director • GlobalInc</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Footer */}

    </div>
  );
};

export default AgentsYUCLanding;