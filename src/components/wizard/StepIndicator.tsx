import React from 'react';
import { motion } from 'framer-motion';
import { Check, Circle } from 'lucide-react';

const StepIndicator = ({ steps, currentStep, onStepClick, canNavigate }) => {
  const getStepStatus = (stepIndex) => {
    if (stepIndex < currentStep) return 'completed';
    if (stepIndex === currentStep) return 'active';
    return 'inactive';
  };

  const isStepClickable = (stepIndex) => {
    // Allow clicking on completed steps and current step
    return stepIndex <= currentStep;
  };

  const getStepIcon = (stepIndex, status) => {
    if (status === 'completed') {
      return <Check className="w-4 h-4" />;
    }
    return <span className="text-sm font-medium">{stepIndex + 1}</span>;
  };

  const getStepClasses = (status) => {
    const baseClasses = "step-indicator cursor-pointer";
    
    switch (status) {
      case 'completed':
        return `${baseClasses} step-completed`;
      case 'active':
        return `${baseClasses} step-active`;
      default:
        return `${baseClasses} step-inactive cursor-not-allowed`;
    }
  };

  const getConnectorClasses = (stepIndex) => {
    const isCompleted = stepIndex < currentStep;
    return `flex-1 h-0.5 transition-colors duration-300 ${
      isCompleted ? 'bg-green-500' : 'bg-gray-200'
    }`;
  };

  return (
    <div className="mb-8">
      {/* Progress Bar */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-600">
          Step {currentStep + 1} of {steps.length}
        </span>
        <span className="text-sm font-medium text-gray-600">
          {Math.round(((currentStep + 1) / steps.length) * 100)}% Complete
        </span>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
        <motion.div
          className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />
      </div>

      {/* Step Indicators */}
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const status = getStepStatus(index);
          const isClickable = isStepClickable(index);
          
          return (
            <React.Fragment key={step.id}>
              <div className="flex flex-col items-center">
                <motion.button
                  className={getStepClasses(status)}
                  onClick={() => isClickable && onStepClick(index)}
                  disabled={!isClickable}
                  whileHover={isClickable ? { scale: 1.1 } : {}}
                  whileTap={isClickable ? { scale: 0.95 } : {}}
                  initial={false}
                  animate={{
                    backgroundColor: status === 'completed' ? '#10b981' : 
                                   status === 'active' ? '#2563eb' : '#e5e7eb',
                    color: status === 'inactive' ? '#6b7280' : '#ffffff'
                  }}
                  transition={{ duration: 0.2 }}
                >
                  {getStepIcon(index, status)}
                </motion.button>
                
                <span className={`text-xs mt-2 text-center max-w-20 leading-tight ${
                  status === 'active' ? 'text-blue-600 font-medium' : 
                  status === 'completed' ? 'text-green-600 font-medium' : 
                  'text-gray-400'
                }`}>
                  {step.name}
                </span>
              </div>
              
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className={getConnectorClasses(index)} />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Mobile Step Indicator */}
      <div className="sm:hidden mt-4">
        <div className="flex items-center justify-center space-x-2">
          {steps.map((_, index) => (
            <motion.div
              key={index}
              className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                index <= currentStep ? 'bg-blue-600' : 'bg-gray-300'
              }`}
              initial={false}
              animate={{
                scale: index === currentStep ? 1.2 : 1
              }}
            />
          ))}
        </div>
        <div className="text-center mt-2">
          <span className="text-sm font-medium text-gray-700">
            {steps[currentStep].name}
          </span>
        </div>
      </div>
    </div>
  );
};

export default StepIndicator;
