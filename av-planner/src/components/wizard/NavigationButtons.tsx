import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, DollarSign, RotateCcw } from 'lucide-react';
import { formatPrice } from '../../data/pricing';

const NavigationButtons = ({ 
  currentStep, 
  totalSteps, 
  canProceed, 
  pricing, 
  onNext, 
  onPrev, 
  onReset 
}) => {
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === totalSteps - 1;
  const showPricing = currentStep >= 4 && pricing.total > 0;

  const buttonVariants = {
    hover: { scale: 1.02 },
    tap: { scale: 0.98 }
  };

  const priceVariants = {
    initial: { scale: 0.8, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0.8, opacity: 0 }
  };

  return (
    <>
      {/* Desktop Navigation */}
      <div className="flex justify-between items-center">
        {/* Previous Button */}
        <motion.button
          onClick={onPrev}
          disabled={isFirstStep}
          className={`flex items-center px-6 py-3 rounded-lg font-semibold transition-colors duration-200 ${
            isFirstStep
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'btn-secondary'
          }`}
          variants={buttonVariants}
          whileHover={!isFirstStep ? "hover" : {}}
          whileTap={!isFirstStep ? "tap" : {}}
        >
          <ChevronLeft className="w-5 h-5 mr-2" />
          Previous
        </motion.button>

        {/* Pricing Display (visible from step 4 onwards) */}
        {showPricing && (
          <motion.div
            className="hidden sm:flex items-center bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg shadow-lg"
            variants={priceVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.3 }}
          >
            <DollarSign className="w-5 h-5 mr-2" />
            <div className="text-right">
              <div className="text-sm opacity-90">Current Quote</div>
              <motion.div 
                className="font-bold text-lg"
                key={pricing.total}
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                {formatPrice(pricing.total)}
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* Next/Reset Button */}
        {!isLastStep ? (
          <motion.button
            onClick={onNext}
            disabled={!canProceed}
            className={`flex items-center px-6 py-3 rounded-lg font-semibold transition-colors duration-200 ${
              canProceed
                ? 'btn-primary'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
            variants={buttonVariants}
            whileHover={canProceed ? "hover" : {}}
            whileTap={canProceed ? "tap" : {}}
          >
            Next
            <ChevronRight className="w-5 h-5 ml-2" />
          </motion.button>
        ) : (
          <motion.button
            onClick={onReset}
            className="flex items-center bg-gradient-to-r from-green-600 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-green-700 hover:to-blue-700 transition-colors duration-200"
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <RotateCcw className="w-5 h-5 mr-2" />
            Start New Quote
          </motion.button>
        )}
      </div>

      {/* Mobile Pricing Display */}
      {showPricing && (
        <motion.div
          className="sm:hidden mt-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-lg text-center shadow-lg"
          variants={priceVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center justify-center mb-1">
            <DollarSign className="w-6 h-6 mr-2" />
            <motion.span 
              className="font-bold text-xl"
              key={pricing.total}
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              {formatPrice(pricing.total)}
            </motion.span>
          </div>
          <span className="text-sm opacity-90">Current Quote Total</span>
        </motion.div>
      )}

      {/* Progress Hint */}
      {!canProceed && currentStep > 0 && currentStep < totalSteps - 1 && (
        <motion.div
          className="mt-4 text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-sm text-gray-500">
            {getProgressHint(currentStep)}
          </p>
        </motion.div>
      )}
    </>
  );
};

// Helper function to provide context-specific hints
const getProgressHint = (currentStep) => {
  const hints = {
    1: "Please fill in all event details to continue",
    2: "Please select your event type to proceed",
    3: "Please specify your AV requirements for all categories",
    4: "Please select a package that fits your needs"
  };
  
  return hints[currentStep] || "Please complete the required fields to continue";
};

export default NavigationButtons;
