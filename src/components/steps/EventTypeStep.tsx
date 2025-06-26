import React from 'react';
import { motion } from 'framer-motion';
import { Users, Monitor, Globe, Check, Info } from 'lucide-react';

const EventTypeStep = ({ formData, onInputChange }) => {
  const eventTypes = [
    {
      value: 'in-person',
      label: 'In-Person Only',
      icon: Users,
      emoji: '👥',
      description: 'Traditional event with physical attendance',
      features: [
        'Focus on room acoustics and lighting',
        'Large screens for audience visibility',
        'Professional sound system',
        'Stage lighting for presentations'
      ],
      pricing: 'Standard pricing',
      recommended: 'Best for networking and interactive sessions'
    },
    {
      value: 'virtual',
      label: 'Virtual Only',
      icon: Monitor,
      emoji: '💻',
      description: 'Online event with remote participation',
      features: [
        'Professional streaming setup',
        'Multi-camera angles',
        'High-quality audio capture',
        'Interactive streaming platform'
      ],
      pricing: '30% cost reduction',
      recommended: 'Perfect for webinars and online conferences'
    },
    {
      value: 'hybrid',
      label: 'Hybrid Event',
      icon: Globe,
      emoji: '🌐',
      description: 'Combination of in-person and virtual attendees',
      features: [
        'Complete AV production setup',
        'Live streaming capabilities',
        'Interactive audience engagement',
        'Professional recording for later use'
      ],
      pricing: '25% premium for dual setup',
      recommended: 'Maximize reach with both audiences',
      popular: true
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  const cardVariants = {
    unselected: {
      scale: 1,
      borderColor: '#e5e7eb'
    },
    selected: {
      scale: 1.02,
      borderColor: '#3b82f6'
    },
    hover: {
      scale: 1.01,
      borderColor: '#9ca3af'
    }
  };

  return (
    <motion.div
      className="space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants} className="text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Event Type</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Choose your event format to help us recommend the right AV equipment and setup
        </p>
      </motion.div>

      <motion.div variants={itemVariants} className="grid lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {eventTypes.map((option) => (
          <motion.div
            key={option.value}
            className={`relative p-6 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
              formData.eventType === option.value
                ? 'border-blue-500 bg-blue-50 shadow-lg'
                : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
            }`}
            variants={cardVariants}
            animate={formData.eventType === option.value ? 'selected' : 'unselected'}
            whileHover={formData.eventType !== option.value ? 'hover' : {}}
            onClick={() => onInputChange('eventType', option.value)}
          >
            {/* Popular Badge */}
            {option.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                Most Popular
              </div>
            )}

            {/* Header */}
            <div className="text-center mb-4">
              <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center text-3xl">
                {option.emoji}
              </div>
              <h3 className="text-xl font-bold text-gray-800">{option.label}</h3>
              <p className="text-gray-600 text-sm mt-1">{option.description}</p>
            </div>

            {/* Features */}
            <div className="space-y-3 mb-4">
              {option.features.map((feature, index) => (
                <div key={index} className="flex items-start text-sm text-gray-600">
                  <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>

            {/* Pricing Info */}
            <div className="border-t border-gray-200 pt-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Pricing:</span>
                <span className="font-medium text-gray-700">{option.pricing}</span>
              </div>
              <div className="mt-2 p-2 bg-gray-50 rounded-lg">
                <div className="flex items-start">
                  <Info className="w-4 h-4 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-xs text-gray-600">{option.recommended}</span>
                </div>
              </div>
            </div>

            {/* Selection Indicator */}
            {formData.eventType === option.value && (
              <motion.div
                className="absolute top-4 right-4 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                <Check className="w-4 h-4 text-white" />
              </motion.div>
            )}
          </motion.div>
        ))}
      </motion.div>

      {/* Additional Information */}
      {formData.eventType && (
        <motion.div
          className="max-w-4xl mx-auto bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h4 className="font-semibold text-gray-800 mb-3">
            Great choice! Here's what to expect with {eventTypes.find(t => t.value === formData.eventType)?.label}:
          </h4>
          
          <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-700">
            <div>
              <h5 className="font-medium mb-2">Equipment Focus:</h5>
              <ul className="space-y-1">
                {formData.eventType === 'in-person' && (
                  <>
                    <li>• Professional sound reinforcement</li>
                    <li>• Large display screens or projectors</li>
                    <li>• Stage and ambient lighting</li>
                  </>
                )}
                {formData.eventType === 'virtual' && (
                  <>
                    <li>• Multi-camera streaming setup</li>
                    <li>• Professional audio capture</li>
                    <li>• Streaming platform integration</li>
                  </>
                )}
                {formData.eventType === 'hybrid' && (
                  <>
                    <li>• Complete production setup</li>
                    <li>• Live streaming + in-room AV</li>
                    <li>• Interactive audience tools</li>
                  </>
                )}
              </ul>
            </div>
            
            <div>
              <h5 className="font-medium mb-2">Technical Support:</h5>
              <ul className="space-y-1">
                <li>• Dedicated technician on-site</li>
                <li>• Pre-event technical rehearsal</li>
                <li>• Real-time monitoring and support</li>
                <li>• Backup equipment available</li>
              </ul>
            </div>
          </div>
        </motion.div>
      )}

      {/* Progress Indicator */}
      <motion.div variants={itemVariants} className="text-center">
        <div className="inline-flex items-center space-x-2 text-sm text-gray-500">
          <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
          <span>Step 2 of 6 - Event Format</span>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default EventTypeStep;
