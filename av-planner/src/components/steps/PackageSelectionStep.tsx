import React from 'react';
import { motion } from 'framer-motion';
import { Check, Star, Users, Clock, Shield, Zap } from 'lucide-react';
import { packages } from '../../data/packages';
import { calculatePackagePricing, formatPrice, getPricingRecommendation } from '../../data/pricing';

const PackageSelectionStep = ({ formData, onInputChange }) => {
  const recommendedPackage = getPricingRecommendation(
    formData.guestCount,
    formData.audioNeeds,
    formData.visualNeeds,
    formData.lightingNeeds
  );

  const getPackagePricing = (packageId) => {
    const tempFormData = { ...formData, selectedPackage: packageId };
    return calculatePackagePricing(tempFormData);
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

  const cardVariants = {
    unselected: {
      scale: 1,
      y: 0
    },
    selected: {
      scale: 1.05,
      y: -10
    },
    hover: {
      scale: 1.02,
      y: -5
    }
  };

  const getPackageIcon = (packageId) => {
    const icons = {
      essential: '🎤',
      recommended: '🎬',
      premium: '🏆'
    };
    return icons[packageId] || '📦';
  };

  const getPackageColor = (packageId) => {
    const colors = {
      essential: 'blue',
      recommended: 'purple',
      premium: 'yellow'
    };
    return colors[packageId] || 'gray';
  };

  const isPackageRecommended = (packageId) => {
    return packageId === recommendedPackage;
  };

  const isPackageSuitable = (pkg) => {
    const guestCount = parseInt(formData.guestCount) || 0;
    return guestCount <= pkg.maxGuests;
  };

  return (
    <motion.div
      className="space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants} className="text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Choose Your Package</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Select the perfect AV package for your event. All packages include professional setup, 
          technical support, and equipment breakdown.
        </p>
      </motion.div>

      {/* Recommendation Banner */}
      {recommendedPackage && (
        <motion.div
          variants={itemVariants}
          className="max-w-4xl mx-auto bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-xl p-4"
        >
          <div className="flex items-center justify-center space-x-2">
            <Zap className="w-5 h-5 text-green-600" />
            <span className="text-green-800 font-medium">
              Based on your requirements, we recommend the{' '}
              <span className="font-bold capitalize">{recommendedPackage}</span> package
            </span>
          </div>
        </motion.div>
      )}

      <motion.div variants={itemVariants} className="grid lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {Object.entries(packages).map(([packageId, pkg]) => {
          const pricing = getPackagePricing(packageId);
          const isSelected = formData.selectedPackage === packageId;
          const isRecommended = isPackageRecommended(packageId);
          const isSuitable = isPackageSuitable(pkg);
          const color = getPackageColor(packageId);

          return (
            <motion.div
              key={packageId}
              className={`relative border-2 rounded-xl cursor-pointer transition-all duration-300 ${
                isSelected
                  ? `border-${color}-500 bg-${color}-50 shadow-xl`
                  : isSuitable
                  ? 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-lg'
                  : 'border-gray-200 bg-gray-50 opacity-60 cursor-not-allowed'
              }`}
              variants={cardVariants}
              animate={isSelected ? 'selected' : 'unselected'}
              whileHover={isSuitable && !isSelected ? 'hover' : {}}
              onClick={() => isSuitable && onInputChange('selectedPackage', packageId)}
            >
              {/* Popular/Recommended Badge */}
              {(pkg.popular || isRecommended) && (
                <div className={`absolute -top-3 left-1/2 transform -translate-x-1/2 px-4 py-1 rounded-full text-sm font-medium text-white ${
                  isRecommended 
                    ? 'bg-gradient-to-r from-green-500 to-blue-500' 
                    : 'bg-gradient-to-r from-purple-500 to-pink-500'
                }`}>
                  {isRecommended ? 'Recommended for You' : 'Most Popular'}
                </div>
              )}

              <div className="p-6">
                {/* Header */}
                <div className="text-center mb-6">
                  <div className="text-4xl mb-3">{getPackageIcon(packageId)}</div>
                  <h3 className="text-2xl font-bold text-gray-800">{pkg.name}</h3>
                  <p className="text-gray-600 text-sm mt-1">{pkg.description}</p>
                </div>

                {/* Pricing */}
                <div className="text-center mb-6">
                  <div className="flex items-baseline justify-center space-x-2">
                    <span className="text-3xl font-bold text-gray-800">
                      {formatPrice(pricing.subtotal)}
                    </span>
                    {pricing.subtotal !== pkg.basePrice && (
                      <span className="text-lg text-gray-500 line-through">
                        {formatPrice(pkg.basePrice)}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    {pkg.duration} event duration
                  </p>
                </div>

                {/* Features */}
                <div className="space-y-3 mb-6">
                  {pkg.features.map((feature, index) => (
                    <div key={index} className="flex items-start text-sm text-gray-600">
                      <Check className="w-4 h-4 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Package Details */}
                <div className="border-t border-gray-200 pt-4 space-y-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="w-4 h-4 mr-2" />
                    <span>Perfect for up to {pkg.maxGuests} guests</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="w-4 h-4 mr-2" />
                    <span>{pkg.duration} of event coverage</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Shield className="w-4 h-4 mr-2" />
                    <span>Professional technical support</span>
                  </div>
                </div>

                {/* Suitability Warning */}
                {!isSuitable && (
                  <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      This package supports up to {pkg.maxGuests} guests. 
                      Consider upgrading for your {formData.guestCount} guest event.
                    </p>
                  </div>
                )}

                {/* Selection Indicator */}
                {isSelected && (
                  <motion.div
                    className="absolute top-4 right-4 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Check className="w-5 h-5 text-white" />
                  </motion.div>
                )}
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Package Comparison */}
      {formData.selectedPackage && (
        <motion.div
          className="max-w-4xl mx-auto bg-white rounded-xl border border-gray-200 p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h4 className="font-semibold text-gray-800 mb-4 flex items-center">
            <Star className="w-5 h-5 text-yellow-500 mr-2" />
            Your Selected Package: {packages[formData.selectedPackage].name}
          </h4>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h5 className="font-medium text-gray-700 mb-3">What's Included:</h5>
              <ul className="space-y-2">
                {packages[formData.selectedPackage].included.map((item, index) => (
                  <li key={index} className="flex items-start text-sm text-gray-600">
                    <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h5 className="font-medium text-gray-700 mb-3">Perfect For:</h5>
              <ul className="space-y-2">
                {packages[formData.selectedPackage].suitableFor.map((use, index) => (
                  <li key={index} className="flex items-start text-sm text-gray-600">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                    {use}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      )}

      {/* Progress Indicator */}
      <motion.div variants={itemVariants} className="text-center">
        <div className="inline-flex items-center space-x-2 text-sm text-gray-500">
          <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
          <span>Step 4 of 6 - Package Selection</span>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default PackageSelectionStep;
