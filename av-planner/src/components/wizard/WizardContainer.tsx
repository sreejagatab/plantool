import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import StepIndicator from './StepIndicator';
import NavigationButtons from './NavigationButtons';
import { calculatePackagePricing } from '../../data/pricing';

// Import step components
import WelcomeStep from '../steps/WelcomeStep';
import EventBasicsStep from '../steps/EventBasicsStep';
import EventTypeStep from '../steps/EventTypeStep';
import AVRequirementsStep from '../steps/AVRequirementsStep';
import PackageSelectionStep from '../steps/PackageSelectionStep';
import CustomizationStep from '../steps/CustomizationStep';
import SummaryStep from '../steps/SummaryStep';

const WizardContainer = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    eventName: '',
    eventDate: '',
    location: '',
    guestCount: '',
    eventType: '',
    audioNeeds: '',
    visualNeeds: '',
    lightingNeeds: '',
    specialRequests: '',
    selectedPackage: '',
    addOns: []
  });

  const [pricing, setPricing] = useState({
    subtotal: 0,
    addOnsTotal: 0,
    total: 0,
    breakdown: {}
  });

  const steps = [
    { id: 'welcome', name: 'Welcome', component: WelcomeStep },
    { id: 'basics', name: 'Event Basics', component: EventBasicsStep },
    { id: 'type', name: 'Event Type', component: EventTypeStep },
    { id: 'requirements', name: 'AV Requirements', component: AVRequirementsStep },
    { id: 'packages', name: 'Package Selection', component: PackageSelectionStep },
    { id: 'customization', name: 'Customization', component: CustomizationStep },
    { id: 'summary', name: 'Summary', component: SummaryStep }
  ];

  // Calculate pricing whenever relevant form data changes
  useEffect(() => {
    if (formData.selectedPackage) {
      const newPricing = calculatePackagePricing(formData);
      setPricing(newPricing);
    }
  }, [formData.selectedPackage, formData.addOns, formData.guestCount, formData.eventType, formData.eventDate, formData.audioNeeds, formData.visualNeeds, formData.lightingNeeds]);

  // Save form data to localStorage
  useEffect(() => {
    localStorage.setItem('av-planner-form-data', JSON.stringify(formData));
  }, [formData]);

  // Load form data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem('av-planner-form-data');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setFormData(parsedData);
      } catch (error) {
        console.error('Error loading saved form data:', error);
      }
    }
  }, []);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddOnToggle = (addOnId) => {
    setFormData(prev => ({
      ...prev,
      addOns: prev.addOns.includes(addOnId)
        ? prev.addOns.filter(id => id !== addOnId)
        : [...prev.addOns, addOnId]
    }));
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goToStep = (stepIndex) => {
    if (stepIndex >= 0 && stepIndex < steps.length) {
      setCurrentStep(stepIndex);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0: // Welcome
        return true;
      case 1: // Event Basics
        return formData.eventName && formData.eventDate && formData.location && formData.guestCount;
      case 2: // Event Type
        return formData.eventType;
      case 3: // AV Requirements
        return formData.audioNeeds && formData.visualNeeds && formData.lightingNeeds;
      case 4: // Package Selection
        return formData.selectedPackage;
      case 5: // Customization
        return true; // Optional step
      case 6: // Summary
        return true;
      default:
        return true;
    }
  };

  const resetWizard = () => {
    setCurrentStep(0);
    setFormData({
      eventName: '',
      eventDate: '',
      location: '',
      guestCount: '',
      eventType: '',
      audioNeeds: '',
      visualNeeds: '',
      lightingNeeds: '',
      specialRequests: '',
      selectedPackage: '',
      addOns: []
    });
    setPricing({
      subtotal: 0,
      addOnsTotal: 0,
      total: 0,
      breakdown: {}
    });
    localStorage.removeItem('av-planner-form-data');
  };

  const CurrentStepComponent = steps[currentStep].component;

  const stepVariants = {
    enter: {
      x: 300,
      opacity: 0
    },
    center: {
      x: 0,
      opacity: 1
    },
    exit: {
      x: -300,
      opacity: 0
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Step Indicator */}
        <StepIndicator
          steps={steps}
          currentStep={currentStep}
          onStepClick={goToStep}
          canNavigate={canProceed}
        />

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 }
              }}
              className="p-8"
            >
              <CurrentStepComponent
                formData={formData}
                pricing={pricing}
                onInputChange={handleInputChange}
                onAddOnToggle={handleAddOnToggle}
                onNext={nextStep}
                onPrev={prevStep}
                onReset={resetWizard}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <NavigationButtons
          currentStep={currentStep}
          totalSteps={steps.length}
          canProceed={canProceed()}
          pricing={pricing}
          onNext={nextStep}
          onPrev={prevStep}
          onReset={resetWizard}
        />
      </div>
    </div>
  );
};

export default WizardContainer;
