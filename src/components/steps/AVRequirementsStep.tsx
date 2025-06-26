import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mic, Monitor, Lightbulb, Info, HelpCircle } from 'lucide-react';

const AVRequirementsStep = ({ formData, onInputChange }) => {
  const [activeTooltip, setActiveTooltip] = useState(null);

  const requirements = [
    {
      id: 'audioNeeds',
      title: 'Audio Requirements',
      icon: Mic,
      color: 'blue',
      tooltip: 'Sound equipment for speakers, microphones, and music playback',
      options: [
        {
          value: 'basic',
          label: 'Basic Audio',
          description: '1-2 microphones, background music capability',
          details: ['Wireless lapel or handheld mic', 'Basic speaker system', 'Music playback capability'],
          suitableFor: 'Small meetings, presentations'
        },
        {
          value: 'standard',
          label: 'Professional Audio',
          description: 'Multiple microphones, full sound system',
          details: ['Multiple wireless microphones', 'Professional mixing board', 'Room-filling sound system', 'Audio recording capability'],
          suitableFor: 'Conferences, seminars, panel discussions'
        },
        {
          value: 'advanced',
          label: 'Premium Audio',
          description: 'Professional mixing, live band support',
          details: ['Complete sound system', 'Professional mixing console', 'Live band/music support', 'Multi-zone audio control', 'Backup systems'],
          suitableFor: 'Large events, concerts, galas'
        }
      ]
    },
    {
      id: 'visualNeeds',
      title: 'Visual Requirements',
      icon: Monitor,
      color: 'green',
      tooltip: 'Screens, projectors, and display equipment for presentations',
      options: [
        {
          value: 'basic',
          label: 'Single Display',
          description: 'One screen or projector for presentations',
          details: ['65" 4K display or projector', 'Wireless presentation capability', 'Multiple input options', 'Professional mounting'],
          suitableFor: 'Small groups, basic presentations'
        },
        {
          value: 'standard',
          label: 'Multi-Screen Setup',
          description: 'Multiple screens, presentation equipment',
          details: ['Dual screen configuration', 'Professional projector setup', 'Presentation switching', 'Confidence monitors for speakers'],
          suitableFor: 'Conferences, training sessions'
        },
        {
          value: 'advanced',
          label: 'LED Walls & Premium',
          description: 'LED walls, multi-camera, broadcast quality',
          details: ['Modular LED wall systems', 'Multi-camera video production', 'Professional video switching', 'Custom graphics integration'],
          suitableFor: 'Large productions, broadcast events'
        }
      ]
    },
    {
      id: 'lightingNeeds',
      title: 'Lighting Requirements',
      icon: Lightbulb,
      color: 'yellow',
      tooltip: 'Stage lighting, ambient lighting, and special effects',
      options: [
        {
          value: 'basic',
          label: 'Basic Lighting',
          description: 'Standard venue lighting enhancement',
          details: ['LED stage wash lights', 'Basic color options', 'Simple control system', 'Energy efficient fixtures'],
          suitableFor: 'Basic presentations, small events'
        },
        {
          value: 'standard',
          label: 'Professional Lighting',
          description: 'Stage lighting, spotlights, color mixing',
          details: ['RGB LED fixtures', 'DMX lighting control', 'Multiple lighting zones', 'Color mixing capabilities', 'Pre-programmed scenes'],
          suitableFor: 'Professional events, conferences'
        },
        {
          value: 'advanced',
          label: 'Production Lighting',
          description: 'Full production with effects and automation',
          details: ['Moving head intelligent fixtures', 'Professional lighting console', 'Haze/fog effects', 'Custom programming', 'Backup lighting systems'],
          suitableFor: 'Large productions, entertainment events'
        }
      ]
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

  const Tooltip = ({ content, isActive, onToggle }) => (
    <div className="relative">
      <button
        type="button"
        onClick={onToggle}
        className="text-gray-400 hover:text-gray-600 transition-colors"
      >
        <HelpCircle className="w-4 h-4" />
      </button>
      {isActive && (
        <motion.div
          className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-sm rounded-lg whitespace-nowrap z-10"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
        >
          {content}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
        </motion.div>
      )}
    </div>
  );

  return (
    <motion.div
      className="space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants} className="text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">AV Requirements</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Select your audiovisual needs for each category. We'll recommend the perfect equipment package.
        </p>
      </motion.div>

      <motion.div variants={itemVariants} className="space-y-8 max-w-4xl mx-auto">
        {requirements.map((requirement) => (
          <div key={requirement.id} className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className={`w-10 h-10 rounded-lg bg-${requirement.color}-100 flex items-center justify-center`}>
                <requirement.icon className={`w-5 h-5 text-${requirement.color}-600`} />
              </div>
              <h3 className="text-xl font-semibold text-gray-800">{requirement.title}</h3>
              <Tooltip
                content={requirement.tooltip}
                isActive={activeTooltip === requirement.id}
                onToggle={() => setActiveTooltip(activeTooltip === requirement.id ? null : requirement.id)}
              />
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              {requirement.options.map((option) => (
                <motion.div
                  key={option.value}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                    formData[requirement.id] === option.value
                      ? `border-${requirement.color}-500 bg-${requirement.color}-50`
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onInputChange(requirement.id, option.value)}
                >
                  <div className="mb-3">
                    <h4 className="font-semibold text-gray-800 mb-1">{option.label}</h4>
                    <p className="text-sm text-gray-600">{option.description}</p>
                  </div>

                  <ul className="space-y-1 mb-3">
                    {option.details.map((detail, index) => (
                      <li key={index} className="text-xs text-gray-500 flex items-start">
                        <span className="w-1 h-1 bg-gray-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                        {detail}
                      </li>
                    ))}
                  </ul>

                  <div className="text-xs text-gray-500 italic">
                    {option.suitableFor}
                  </div>

                  {formData[requirement.id] === option.value && (
                    <motion.div
                      className="mt-3 flex items-center justify-center"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <div className={`w-6 h-6 bg-${requirement.color}-500 rounded-full flex items-center justify-center`}>
                        <Info className="w-4 h-4 text-white" />
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </motion.div>

      {/* Requirements Summary */}
      {formData.audioNeeds && formData.visualNeeds && formData.lightingNeeds && (
        <motion.div
          className="max-w-4xl mx-auto bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
            <Info className="w-5 h-5 text-green-600 mr-2" />
            Your AV Requirements Summary
          </h4>
          
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-700">Audio: </span>
              <span className="text-gray-600 capitalize">{formData.audioNeeds} level</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Visual: </span>
              <span className="text-gray-600 capitalize">{formData.visualNeeds} setup</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Lighting: </span>
              <span className="text-gray-600 capitalize">{formData.lightingNeeds} package</span>
            </div>
          </div>
          
          <p className="text-sm text-gray-600 mt-3">
            Based on your selections, we'll recommend the most suitable equipment package in the next step.
          </p>
        </motion.div>
      )}

      {/* Progress Indicator */}
      <motion.div variants={itemVariants} className="text-center">
        <div className="inline-flex items-center space-x-2 text-sm text-gray-500">
          <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
          <span>Step 3 of 6 - AV Requirements</span>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AVRequirementsStep;
