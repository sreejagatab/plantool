import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DollarSign, TrendingUp, TrendingDown, Info, Calculator } from 'lucide-react';
import { formatPrice, calculateAllPackagesPricing } from '../../data/pricing';

interface BudgetEstimatorProps {
  formData: {
    guestCount: string;
    eventType: string;
    eventDate: string;
    audioNeeds: string;
    visualNeeds: string;
    lightingNeeds: string;
    selectedPackage?: string;
    addOns: string[];
  };
  onPackageRecommendation?: (packageId: string) => void;
}

const BudgetEstimator: React.FC<BudgetEstimatorProps> = ({
  formData,
  onPackageRecommendation
}) => {
  const [budgetRange, setBudgetRange] = useState<{ min: number; max: number } | null>(null);
  const [packagePricing, setPackagePricing] = useState<Record<string, any>>({});
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    if (formData.guestCount && formData.eventType) {
      const pricing = calculateAllPackagesPricing(formData);
      setPackagePricing(pricing);
      
      const prices = Object.values(pricing).map((p: any) => p.total);
      setBudgetRange({
        min: Math.min(...prices),
        max: Math.max(...prices)
      });
    }
  }, [formData]);

  const getBudgetRecommendation = () => {
    const guestCount = parseInt(formData.guestCount) || 0;
    
    if (guestCount <= 50) {
      return {
        package: 'essential',
        reason: 'Perfect for intimate gatherings',
        savings: 'Most cost-effective option'
      };
    } else if (guestCount <= 200) {
      return {
        package: 'recommended',
        reason: 'Ideal balance of features and value',
        savings: 'Best value for professional events'
      };
    } else {
      return {
        package: 'premium',
        reason: 'Required for large-scale events',
        savings: 'Comprehensive solution included'
      };
    }
  };

  const getPriceComparison = () => {
    if (!budgetRange) return null;
    
    const currentPrice = formData.selectedPackage ? packagePricing[formData.selectedPackage]?.total : 0;
    const midRange = (budgetRange.min + budgetRange.max) / 2;
    
    if (currentPrice === 0) return null;
    
    return {
      isAboveAverage: currentPrice > midRange,
      percentageDiff: Math.abs(((currentPrice - midRange) / midRange) * 100),
      comparison: currentPrice > midRange ? 'above' : 'below'
    };
  };

  const recommendation = getBudgetRecommendation();
  const priceComparison = getPriceComparison();

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  if (!budgetRange) {
    return (
      <div className="bg-gray-50 rounded-lg p-4 text-center">
        <Calculator className="w-8 h-8 text-gray-400 mx-auto mb-2" />
        <p className="text-gray-600 text-sm">
          Complete event details to see budget estimates
        </p>
      </div>
    );
  }

  return (
    <motion.div
      className="bg-white rounded-xl border border-gray-200 p-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <DollarSign className="w-5 h-5 text-green-600" />
          <h3 className="text-lg font-semibold text-gray-800">Budget Estimator</h3>
        </div>
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
        >
          {showDetails ? 'Hide Details' : 'Show Details'}
        </button>
      </div>

      {/* Budget Range */}
      <motion.div variants={itemVariants} className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600">Estimated Budget Range</span>
          <span className="text-sm text-gray-500">
            {formData.guestCount} guests • {formData.eventType}
          </span>
        </div>
        
        <div className="bg-gradient-to-r from-green-100 to-blue-100 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="text-center">
              <div className="text-sm text-gray-600 mb-1">Starting from</div>
              <div className="text-2xl font-bold text-green-600">
                {formatPrice(budgetRange.min)}
              </div>
            </div>
            <div className="text-gray-400">—</div>
            <div className="text-center">
              <div className="text-sm text-gray-600 mb-1">Up to</div>
              <div className="text-2xl font-bold text-blue-600">
                {formatPrice(budgetRange.max)}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Current Selection Comparison */}
      {formData.selectedPackage && priceComparison && (
        <motion.div variants={itemVariants} className="mb-6">
          <div className="flex items-center space-x-2 mb-2">
            {priceComparison.comparison === 'above' ? (
              <TrendingUp className="w-4 h-4 text-orange-500" />
            ) : (
              <TrendingDown className="w-4 h-4 text-green-500" />
            )}
            <span className="text-sm font-medium text-gray-700">
              Your Selection: {formatPrice(packagePricing[formData.selectedPackage].total)}
            </span>
          </div>
          
          <div className={`p-3 rounded-lg ${
            priceComparison.comparison === 'above' 
              ? 'bg-orange-50 border border-orange-200' 
              : 'bg-green-50 border border-green-200'
          }`}>
            <p className={`text-sm ${
              priceComparison.comparison === 'above' ? 'text-orange-800' : 'text-green-800'
            }`}>
              {priceComparison.percentageDiff.toFixed(0)}% {priceComparison.comparison} average range
              {priceComparison.comparison === 'below' && ' - Great value!'}
            </p>
          </div>
        </motion.div>
      )}

      {/* Recommendation */}
      <motion.div variants={itemVariants} className="mb-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-800 mb-1">
                Recommended: {recommendation.package.charAt(0).toUpperCase() + recommendation.package.slice(1)} Package
              </h4>
              <p className="text-sm text-blue-700 mb-2">{recommendation.reason}</p>
              <p className="text-xs text-blue-600">{recommendation.savings}</p>
              
              {onPackageRecommendation && formData.selectedPackage !== recommendation.package && (
                <button
                  onClick={() => onPackageRecommendation(recommendation.package)}
                  className="mt-2 text-xs bg-blue-600 text-white px-3 py-1 rounded-full hover:bg-blue-700 transition-colors"
                >
                  Select This Package
                </button>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Detailed Breakdown */}
      <AnimatePresence>
        {showDetails && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="border-t border-gray-200 pt-4"
          >
            <h4 className="font-medium text-gray-800 mb-3">Package Comparison</h4>
            <div className="space-y-3">
              {Object.entries(packagePricing).map(([packageId, pricing]: [string, any]) => (
                <div
                  key={packageId}
                  className={`flex items-center justify-between p-3 rounded-lg ${
                    formData.selectedPackage === packageId
                      ? 'bg-blue-50 border border-blue-200'
                      : 'bg-gray-50'
                  }`}
                >
                  <div>
                    <span className="font-medium text-gray-800 capitalize">
                      {packageId}
                    </span>
                    {packageId === recommendation.package && (
                      <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                        Recommended
                      </span>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-800">
                      {formatPrice(pricing.total)}
                    </div>
                    {pricing.subtotal !== pricing.total && (
                      <div className="text-xs text-gray-500">
                        Base: {formatPrice(pricing.subtotal)}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default BudgetEstimator;
