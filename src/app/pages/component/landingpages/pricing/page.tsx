"use client"
import React, { useState } from 'react';
import { Check, Star, Zap, Crown } from 'lucide-react';

const PricingPage = () => {
  const [isAnnual, setIsAnnual] = useState(false);

  const plans = [
    {
      name: "Free",
      icon: <Star className="w-6 h-6" />,
      price: { monthly: 0, annual: 0 },
      description: "Perfect for trying out our voice assistant",
      features: [
        "100 voice messages per month",
        "Basic voice recognition",
        "Text responses",
        "Mobile app access",
        "Community support"
      ],
      buttonText: "Get Started Free",
      buttonStyle: "border border-gray-300 text-gray-700 hover:bg-gray-50",
      popular: false
    },
    {
      name: "Pro",
      icon: <Zap className="w-6 h-6" />,
      price: { monthly: 19, annual: 15 },
      description: "Best for regular users and professionals",
      features: [
        "Unlimited voice messages",
        "Advanced voice recognition",
        "Voice & text responses",
        "Conversation memory",
        "Custom voice settings",
        "Priority support",
        "Multiple languages"
      ],
      buttonText: "Start Pro Trial",
      buttonStyle: "bg-blue-600 text-white hover:bg-blue-700",
      popular: true
    },
    {
      name: "Enterprise",
      icon: <Crown className="w-6 h-6" />,
      price: { monthly: 99, annual: 79 },
      description: "For teams and businesses",
      features: [
        "Everything in Pro",
        "Team collaboration",
        "Custom integrations",
        "Advanced analytics",
        "White-label options",
        "Dedicated support",
        "SLA guarantee",
        "Custom training"
      ],
      buttonText: "Contact Sales",
      buttonStyle: "bg-purple-600 text-white hover:bg-purple-700",
      popular: false
    }
  ];

  const faqs = [
    {
      question: "Can I change plans anytime?",
      answer: "Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately."
    },
    {
      question: "Is there a free trial?",
      answer: "Yes, Pro and Enterprise plans come with a 14-day free trial. No credit card required."
    },
    {
      question: "How does voice recognition work?",
      answer: "Our AI uses advanced speech processing to understand natural language in real-time with 99% accuracy."
    },
    {
      question: "What languages are supported?",
      answer: "We support 25+ languages including English, Spanish, French, German, Chinese, and more."
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="text-center py-16 px-6">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          Simple, Transparent Pricing
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
          Choose the perfect plan for your voice assistant needs
        </p>

        {/* Billing Toggle */}
        <div className="flex items-center justify-center gap-4 mb-12">
          <span className={`text-sm ${!isAnnual ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
            Monthly
          </span>
          <button
            onClick={() => setIsAnnual(!isAnnual)}
            className="relative w-12 h-6 bg-gray-200 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <div className={`absolute w-5 h-5 bg-white rounded-full shadow-md transition-transform top-0.5 ${
              isAnnual ? 'translate-x-6 bg-blue-600' : 'translate-x-0.5'
            }`} />
          </button>
          <span className={`text-sm ${isAnnual ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
            Annual
          </span>
          {isAnnual && (
            <span className="text-sm bg-green-100 text-green-700 px-2 py-1 rounded-full">
              Save 20%
            </span>
          )}
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-6xl mx-auto px-6 pb-16">
        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div 
              key={index}
              className={`relative bg-white rounded-2xl p-8 shadow-lg ${
                plan.popular ? 'ring-2 ring-blue-600 scale-105' : 'hover:shadow-xl'
              } transition-all`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-6">
                <div className={`w-12 h-12 mx-auto mb-4 rounded-full flex items-center justify-center ${
                  plan.popular ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                }`}>
                  {plan.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <p className="text-gray-600 mb-4">{plan.description}</p>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-gray-900">
                    ${isAnnual ? plan.price.annual : plan.price.monthly}
                  </span>
                  <span className="text-gray-600">
                    {plan.price.monthly === 0 ? '' : '/month'}
                  </span>
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <button onClick={()=>(window.location.href='/pages/auth/login')} className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${plan.buttonStyle}`}>
                {plan.buttonText}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-gray-50 py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Frequently Asked Questions
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  {faq.question}
                </h3>
                <p className="text-gray-600">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
};

export default PricingPage;