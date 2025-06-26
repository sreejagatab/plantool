import { useState, useEffect, useCallback } from 'react';

export interface FormData {
  eventName: string;
  eventDate: string;
  location: string;
  guestCount: string;
  eventType: string;
  audioNeeds: string;
  visualNeeds: string;
  lightingNeeds: string;
  specialRequests: string;
  selectedPackage: string;
  addOns: string[];
}

export interface WizardStep {
  id: string;
  name: string;
  isValid: boolean;
  isOptional: boolean;
}

const STORAGE_KEY = 'av-planner-form-data';
const PROGRESS_KEY = 'av-planner-progress';

const initialFormData: FormData = {
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
};

export const useWizard = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [visitedSteps, setVisitedSteps] = useState<Set<number>>(new Set([0]));
  const [isLoading, setIsLoading] = useState(false);

  const steps: WizardStep[] = [
    { id: 'welcome', name: 'Welcome', isValid: true, isOptional: false },
    { id: 'basics', name: 'Event Basics', isValid: false, isOptional: false },
    { id: 'type', name: 'Event Type', isValid: false, isOptional: false },
    { id: 'requirements', name: 'AV Requirements', isValid: false, isOptional: false },
    { id: 'packages', name: 'Package Selection', isValid: false, isOptional: false },
    { id: 'customization', name: 'Customization', isValid: true, isOptional: true },
    { id: 'summary', name: 'Summary', isValid: true, isOptional: false }
  ];

  // Load saved data on mount
  useEffect(() => {
    try {
      const savedData = localStorage.getItem(STORAGE_KEY);
      const savedProgress = localStorage.getItem(PROGRESS_KEY);
      
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        setFormData(parsedData);
      }
      
      if (savedProgress) {
        const { step, visited } = JSON.parse(savedProgress);
        setCurrentStep(step);
        setVisitedSteps(new Set(visited));
      }
    } catch (error) {
      console.error('Error loading saved wizard data:', error);
    }
  }, []);

  // Save data whenever form data or progress changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
      localStorage.setItem(PROGRESS_KEY, JSON.stringify({
        step: currentStep,
        visited: Array.from(visitedSteps)
      }));
    } catch (error) {
      console.error('Error saving wizard data:', error);
    }
  }, [formData, currentStep, visitedSteps]);

  // Validation functions
  const validateStep = useCallback((stepIndex: number): boolean => {
    switch (stepIndex) {
      case 0: // Welcome
        return true;
      case 1: // Event Basics
        return !!(
          formData.eventName.trim() &&
          formData.eventDate &&
          formData.location.trim() &&
          formData.guestCount &&
          parseInt(formData.guestCount) > 0
        );
      case 2: // Event Type
        return !!formData.eventType;
      case 3: // AV Requirements
        return !!(
          formData.audioNeeds &&
          formData.visualNeeds &&
          formData.lightingNeeds
        );
      case 4: // Package Selection
        return !!formData.selectedPackage;
      case 5: // Customization
        return true; // Optional step
      case 6: // Summary
        return true;
      default:
        return false;
    }
  }, [formData]);

  const canProceed = useCallback((stepIndex?: number): boolean => {
    const step = stepIndex ?? currentStep;
    return validateStep(step);
  }, [currentStep, validateStep]);

  const canNavigateToStep = useCallback((stepIndex: number): boolean => {
    // Can always go back to visited steps
    if (visitedSteps.has(stepIndex)) return true;
    
    // Can only go forward if all previous steps are valid
    for (let i = 0; i < stepIndex; i++) {
      if (!validateStep(i) && !steps[i].isOptional) {
        return false;
      }
    }
    return true;
  }, [visitedSteps, validateStep, steps]);

  // Navigation functions
  const nextStep = useCallback(() => {
    if (currentStep < steps.length - 1 && canProceed()) {
      const newStep = currentStep + 1;
      setCurrentStep(newStep);
      setVisitedSteps(prev => new Set([...prev, newStep]));
    }
  }, [currentStep, steps.length, canProceed]);

  const prevStep = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  }, [currentStep]);

  const goToStep = useCallback((stepIndex: number) => {
    if (stepIndex >= 0 && stepIndex < steps.length && canNavigateToStep(stepIndex)) {
      setCurrentStep(stepIndex);
      setVisitedSteps(prev => new Set([...prev, stepIndex]));
    }
  }, [steps.length, canNavigateToStep]);

  // Form data management
  const updateFormData = useCallback((field: keyof FormData, value: string | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  const toggleAddOn = useCallback((addOnId: string) => {
    setFormData(prev => ({
      ...prev,
      addOns: prev.addOns.includes(addOnId)
        ? prev.addOns.filter(id => id !== addOnId)
        : [...prev.addOns, addOnId]
    }));
  }, []);

  // Reset wizard
  const resetWizard = useCallback(() => {
    setCurrentStep(0);
    setFormData(initialFormData);
    setVisitedSteps(new Set([0]));
    
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(PROGRESS_KEY);
    } catch (error) {
      console.error('Error clearing wizard data:', error);
    }
  }, []);

  // Progress calculation
  const getProgress = useCallback(() => {
    const completedSteps = steps.filter((_, index) => validateStep(index)).length;
    const totalSteps = steps.length;
    return {
      completed: completedSteps,
      total: totalSteps,
      percentage: Math.round((completedSteps / totalSteps) * 100)
    };
  }, [steps, validateStep]);

  // Get step validation status
  const getStepStatus = useCallback((stepIndex: number) => {
    if (stepIndex < currentStep || visitedSteps.has(stepIndex)) {
      return validateStep(stepIndex) ? 'completed' : 'error';
    }
    if (stepIndex === currentStep) {
      return 'active';
    }
    return 'inactive';
  }, [currentStep, visitedSteps, validateStep]);

  // Check if form is complete
  const isFormComplete = useCallback(() => {
    return steps.every((step, index) => 
      step.isOptional || validateStep(index)
    );
  }, [steps, validateStep]);

  return {
    // State
    currentStep,
    formData,
    visitedSteps,
    isLoading,
    steps,
    
    // Navigation
    nextStep,
    prevStep,
    goToStep,
    canProceed,
    canNavigateToStep,
    
    // Form management
    updateFormData,
    toggleAddOn,
    resetWizard,
    
    // Validation and progress
    validateStep,
    getProgress,
    getStepStatus,
    isFormComplete,
    
    // Utilities
    setIsLoading
  };
};
