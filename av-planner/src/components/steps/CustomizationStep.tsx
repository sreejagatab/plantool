import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, Check, Info, MessageSquare, Sparkles } from 'lucide-react';
import { addOns } from '../../data/packages';
import { formatPrice } from '../../data/pricing';

const CustomizationStep = ({ formData, pricing, onInputChange, onAddOnToggle }) => {
  const [expandedAddOn, setExpandedAddOn] = useState(null);

  const getAddOnIcon = (category) => {
    const icons = {
      audio: '🎤',
      video: '📹',
      streaming: '📡',
      lighting: '💡',
      branding: '🎨',
      entertainment: '📸'
    };
    return icons[category] || '⚡';
  };

  const getAddOnColor = (category) => {
    const colors = {
      audio: 'blue',
      video: 'purple',
      streaming: 'green',
      lighting: 'yellow',
      branding: 'pink',
      entertainment: 'indigo'
    };
    return colors[category] || 'gray';
  };

  const isAddOnSelected = (addOnId) => {
    return formData.addOns.includes(addOnId);
  };

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

  const addOnVariants = {
    unselected: {
      scale: 1,
      borderColor: '#e5e7eb'
    },
    selected: {
      scale: 1.02,
      borderColor: '#3b82f6'
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
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Customize Your Package</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Enhance your event with optional add-on services. All add-ons include professional setup and support.
        </p>
      </motion.div>

      {/* Current Package Summary */}
      <motion.div
        variants={itemVariants}
        className="max-w-4xl mx-auto bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              Selected Package: {formData.selectedPackage?.charAt(0).toUpperCase() + formData.selectedPackage?.slice(1)}
            </h3>
            <p className="text-gray-600">Base package price: {formatPrice(pricing.subtotal)}</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-800">
              {formatPrice(pricing.total)}
            </div>
            <div className="text-sm text-gray-600">Total with add-ons</div>
          </div>
        </div>
      </motion.div>

      {/* Add-ons Grid */}
      <motion.div variants={itemVariants} className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {addOns.map((addOn) => {
            const isSelected = isAddOnSelected(addOn.id);
            const color = getAddOnColor(addOn.category);
            const isExpanded = expandedAddOn === addOn.id;

            return (
              <motion.div
                key={addOn.id}
                className={`border-2 rounded-xl transition-all duration-200 ${
                  isSelected
                    ? `border-${color}-500 bg-${color}-50 shadow-lg`
                    : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
                }`}
                variants={addOnVariants}
                animate={isSelected ? 'selected' : 'unselected'}
                layout
              >
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-lg bg-${color}-100 flex items-center justify-center text-xl`}>
                        {getAddOnIcon(addOn.category)}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800">{addOn.name}</h4>
                        <p className="text-lg font-bold text-blue-600">
                          +{formatPrice(addOn.price)}
                        </p>
                      </div>
                    </div>
                    
                    <motion.button
                      className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors ${
                        isSelected
                          ? `border-${color}-500 bg-${color}-500`
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                      onClick={() => onAddOnToggle(addOn.id)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      {isSelected ? (
                        <Check className="w-5 h-5 text-white" />
                      ) : (
                        <Plus className="w-5 h-5 text-gray-400" />
                      )}
                    </motion.button>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-gray-600 mb-4">{addOn.description}</p>

                  {/* Features/Details */}
                  {(addOn.features || addOn.deliverables || addOn.platforms || addOn.options || addOn.includes) && (
                    <div className="mb-4">
                      <button
                        className="flex items-center text-sm text-blue-600 hover:text-blue-700 transition-colors"
                        onClick={() => setExpandedAddOn(isExpanded ? null : addOn.id)}
                      >
                        <Info className="w-4 h-4 mr-1" />
                        {isExpanded ? 'Hide details' : 'Show details'}
                      </button>
                      
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            className="mt-3 p-3 bg-gray-50 rounded-lg"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            {addOn.features && (
                              <div>
                                <h6 className="font-medium text-gray-700 mb-2">Features:</h6>
                                <ul className="space-y-1">
                                  {addOn.features.map((feature, index) => (
                                    <li key={index} className="text-xs text-gray-600 flex items-start">
                                      <span className="w-1 h-1 bg-gray-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                                      {feature}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            
                            {addOn.deliverables && (
                              <div>
                                <h6 className="font-medium text-gray-700 mb-2">Deliverables:</h6>
                                <ul className="space-y-1">
                                  {addOn.deliverables.map((item, index) => (
                                    <li key={index} className="text-xs text-gray-600 flex items-start">
                                      <span className="w-1 h-1 bg-gray-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                                      {item}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            
                            {addOn.platforms && (
                              <div>
                                <h6 className="font-medium text-gray-700 mb-2">Platforms:</h6>
                                <div className="flex flex-wrap gap-1">
                                  {addOn.platforms.map((platform, index) => (
                                    <span key={index} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                                      {platform}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                            
                            {addOn.options && (
                              <div>
                                <h6 className="font-medium text-gray-700 mb-2">Options:</h6>
                                <div className="flex flex-wrap gap-1">
                                  {addOn.options.map((option, index) => (
                                    <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                                      {option}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                            
                            {addOn.includes && (
                              <div>
                                <h6 className="font-medium text-gray-700 mb-2">Includes:</h6>
                                <ul className="space-y-1">
                                  {addOn.includes.map((item, index) => (
                                    <li key={index} className="text-xs text-gray-600 flex items-start">
                                      <span className="w-1 h-1 bg-gray-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                                      {item}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}

                  {/* Category Badge */}
                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-1 bg-${color}-100 text-${color}-700 text-xs rounded-full capitalize`}>
                      {addOn.category}
                    </span>
                    {addOn.quantity && (
                      <span className="text-xs text-gray-500">{addOn.quantity}</span>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Special Requests */}
      <motion.div variants={itemVariants} className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center space-x-2 mb-4">
            <MessageSquare className="w-5 h-5 text-blue-500" />
            <h3 className="text-lg font-semibold text-gray-800">Special Requests or Notes</h3>
          </div>
          <textarea
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            rows="4"
            placeholder="Any specific requirements, questions, or special requests for your event? Our team will review and contact you with solutions."
            value={formData.specialRequests}
            onChange={(e) => onInputChange('specialRequests', e.target.value)}
          />
          <p className="text-xs text-gray-500 mt-2">
            Optional: Tell us about any unique requirements or questions you have
          </p>
        </div>
      </motion.div>

      {/* Add-ons Summary */}
      {formData.addOns.length > 0 && (
        <motion.div
          className="max-w-4xl mx-auto bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center space-x-2 mb-4">
            <Sparkles className="w-5 h-5 text-green-600" />
            <h4 className="font-semibold text-gray-800">Selected Add-ons</h4>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            {formData.addOns.map(addOnId => {
              const addOn = addOns.find(a => a.id === addOnId);
              return addOn ? (
                <div key={addOnId} className="flex items-center justify-between bg-white rounded-lg p-3">
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">{getAddOnIcon(addOn.category)}</span>
                    <span className="font-medium text-gray-800">{addOn.name}</span>
                  </div>
                  <span className="font-semibold text-green-600">{formatPrice(addOn.price)}</span>
                </div>
              ) : null;
            })}
          </div>
          
          <div className="border-t border-gray-200 mt-4 pt-4 flex justify-between items-center">
            <span className="font-semibold text-gray-800">Add-ons Total:</span>
            <span className="text-xl font-bold text-green-600">{formatPrice(pricing.addOnsTotal)}</span>
          </div>
        </motion.div>
      )}

      {/* Progress Indicator */}
      <motion.div variants={itemVariants} className="text-center">
        <div className="inline-flex items-center space-x-2 text-sm text-gray-500">
          <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
          <span>Step 5 of 6 - Customization</span>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CustomizationStep;
