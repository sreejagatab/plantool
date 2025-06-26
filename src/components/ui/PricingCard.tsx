import React from 'react';
import { motion } from 'framer-motion';
import { Check, Star, Users, Clock, Shield } from 'lucide-react';
import { formatPrice } from '../../data/pricing';

interface PricingCardProps {
  packageData: {
    id: string;
    name: string;
    basePrice: number;
    description: string;
    tagline: string;
    icon: string;
    color: string;
    maxGuests: number;
    duration: string;
    popular?: boolean;
    features: string[];
    included: string[];
    suitableFor: string[];
  };
  pricing: {
    subtotal: number;
    addOnsTotal: number;
    total: number;
  };
  isSelected: boolean;
  isRecommended: boolean;
  isSuitable: boolean;
  guestCount: number;
  onSelect: () => void;
}

const PricingCard: React.FC<PricingCardProps> = ({
  packageData,
  pricing,
  isSelected,
  isRecommended,
  isSuitable,
  guestCount,
  onSelect
}) => {
  const cardVariants = {
    unselected: {
      scale: 1,
      y: 0,
      borderColor: isSuitable ? '#e5e7eb' : '#f3f4f6'
    },
    selected: {
      scale: 1.05,
      y: -10,
      borderColor: getColorValue(packageData.color, 500)
    },
    hover: {
      scale: 1.02,
      y: -5,
      borderColor: '#9ca3af'
    }
  };

  function getColorValue(color: string, shade: number): string {
    const colors: Record<string, Record<number, string>> = {
      blue: { 500: '#3b82f6', 100: '#dbeafe', 50: '#eff6ff' },
      purple: { 500: '#8b5cf6', 100: '#e9d5ff', 50: '#faf5ff' },
      yellow: { 500: '#eab308', 100: '#fef3c7', 50: '#fefce8' },
      green: { 500: '#10b981', 100: '#d1fae5', 50: '#ecfdf5' },
      red: { 500: '#ef4444', 100: '#fecaca', 50: '#fef2f2' }
    };
    return colors[color]?.[shade] || colors.blue[shade];
  }

  const getBadgeText = () => {
    if (isRecommended) return 'Recommended for You';
    if (packageData.popular) return 'Most Popular';
    return null;
  };

  const getBadgeColor = () => {
    if (isRecommended) return 'from-green-500 to-blue-500';
    if (packageData.popular) return 'from-purple-500 to-pink-500';
    return 'from-blue-500 to-purple-500';
  };

  return (
    <motion.div
      className={`relative border-2 rounded-xl cursor-pointer transition-all duration-300 ${
        isSelected
          ? `border-${packageData.color}-500 bg-${packageData.color}-50 shadow-xl`
          : isSuitable
          ? 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-lg'
          : 'border-gray-200 bg-gray-50 opacity-60 cursor-not-allowed'
      }`}
      variants={cardVariants}
      animate={isSelected ? 'selected' : 'unselected'}
      whileHover={isSuitable && !isSelected ? 'hover' : {}}
      onClick={() => isSuitable && onSelect()}
    >
      {/* Badge */}
      {getBadgeText() && (
        <div className={`absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r ${getBadgeColor()} text-white px-4 py-1 rounded-full text-sm font-medium z-10`}>
          {getBadgeText()}
        </div>
      )}

      <div className="p-6">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="text-4xl mb-3">{packageData.icon}</div>
          <h3 className="text-2xl font-bold text-gray-800">{packageData.name}</h3>
          <p className="text-gray-600 text-sm mt-1">{packageData.description}</p>
          <p className="text-xs text-gray-500 mt-1 italic">{packageData.tagline}</p>
        </div>

        {/* Pricing */}
        <div className="text-center mb-6">
          <div className="flex items-baseline justify-center space-x-2">
            <motion.span 
              className="text-3xl font-bold text-gray-800"
              key={pricing.subtotal}
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              {formatPrice(pricing.subtotal)}
            </motion.span>
            {pricing.subtotal !== packageData.basePrice && (
              <span className="text-lg text-gray-500 line-through">
                {formatPrice(packageData.basePrice)}
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500 mt-1">
            {packageData.duration} event duration
          </p>
          {pricing.subtotal !== packageData.basePrice && (
            <p className="text-xs text-blue-600 mt-1">
              Price adjusted for {guestCount} guests
            </p>
          )}
        </div>

        {/* Features */}
        <div className="space-y-3 mb-6">
          <h4 className="font-medium text-gray-700 text-sm">Package Features:</h4>
          {packageData.features.map((feature, index) => (
            <div key={index} className="flex items-start text-sm text-gray-600">
              <Check className="w-4 h-4 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
              <span>{feature}</span>
            </div>
          ))}
        </div>

        {/* Package Details */}
        <div className="border-t border-gray-200 pt-4 space-y-3">
          <div className="flex items-center text-sm text-gray-600">
            <Users className="w-4 h-4 mr-2 text-blue-500" />
            <span>Perfect for up to {packageData.maxGuests} guests</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Clock className="w-4 h-4 mr-2 text-blue-500" />
            <span>{packageData.duration} of event coverage</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Shield className="w-4 h-4 mr-2 text-blue-500" />
            <span>Professional technical support</span>
          </div>
        </div>

        {/* Suitability Warning */}
        {!isSuitable && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              This package supports up to {packageData.maxGuests} guests. 
              Consider upgrading for your {guestCount} guest event.
            </p>
          </div>
        )}

        {/* Value Proposition */}
        {isSuitable && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center text-sm text-green-800">
              <Star className="w-4 h-4 mr-2" />
              <span className="font-medium">Great Value</span>
            </div>
            <p className="text-xs text-green-700 mt-1">
              Includes setup, breakdown, and professional support
            </p>
          </div>
        )}

        {/* Selection Indicator */}
        {isSelected && (
          <motion.div
            className="absolute top-4 right-4 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg"
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
};

export default PricingCard;
