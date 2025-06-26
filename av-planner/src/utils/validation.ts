// Form validation utilities for the AV Planning Tool

export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  min?: number;
  max?: number;
  custom?: (value: any) => string | null;
}

export interface ValidationError {
  field: string;
  message: string;
  type: 'required' | 'minLength' | 'maxLength' | 'pattern' | 'min' | 'max' | 'custom';
}

export interface FormValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  fieldErrors: Record<string, string>;
}

// Validation rules for each form field
export const validationRules: Record<string, ValidationRule> = {
  eventName: {
    required: true,
    minLength: 3,
    maxLength: 100,
    pattern: /^[a-zA-Z0-9\s\-_.,!()]+$/,
    custom: (value: string) => {
      if (value && value.trim().length < 3) {
        return 'Event name must be at least 3 characters long';
      }
      return null;
    }
  },
  
  eventDate: {
    required: true,
    custom: (value: string) => {
      if (!value) return 'Event date is required';
      
      const selectedDate = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (isNaN(selectedDate.getTime())) {
        return 'Please enter a valid date';
      }
      
      if (selectedDate < today) {
        return 'Event date cannot be in the past';
      }
      
      // Check if date is too far in the future (2 years)
      const maxDate = new Date();
      maxDate.setFullYear(maxDate.getFullYear() + 2);
      
      if (selectedDate > maxDate) {
        return 'Event date cannot be more than 2 years in the future';
      }
      
      return null;
    }
  },
  
  location: {
    required: true,
    minLength: 3,
    maxLength: 200,
    custom: (value: string) => {
      if (value && value.trim().length < 3) {
        return 'Location must be at least 3 characters long';
      }
      return null;
    }
  },
  
  guestCount: {
    required: true,
    min: 1,
    max: 1000,
    custom: (value: string) => {
      if (!value) return 'Guest count is required';
      
      const count = parseInt(value);
      
      if (isNaN(count)) {
        return 'Please enter a valid number';
      }
      
      if (count < 1) {
        return 'Guest count must be at least 1';
      }
      
      if (count > 1000) {
        return 'For events over 1000 guests, please contact us directly';
      }
      
      return null;
    }
  },
  
  eventType: {
    required: true,
    custom: (value: string) => {
      const validTypes = ['in-person', 'virtual', 'hybrid'];
      if (!validTypes.includes(value)) {
        return 'Please select a valid event type';
      }
      return null;
    }
  },
  
  audioNeeds: {
    required: true,
    custom: (value: string) => {
      const validNeeds = ['basic', 'standard', 'advanced'];
      if (!validNeeds.includes(value)) {
        return 'Please select your audio requirements';
      }
      return null;
    }
  },
  
  visualNeeds: {
    required: true,
    custom: (value: string) => {
      const validNeeds = ['basic', 'standard', 'advanced'];
      if (!validNeeds.includes(value)) {
        return 'Please select your visual requirements';
      }
      return null;
    }
  },
  
  lightingNeeds: {
    required: true,
    custom: (value: string) => {
      const validNeeds = ['basic', 'standard', 'advanced'];
      if (!validNeeds.includes(value)) {
        return 'Please select your lighting requirements';
      }
      return null;
    }
  },
  
  selectedPackage: {
    required: true,
    custom: (value: string) => {
      const validPackages = ['essential', 'recommended', 'premium'];
      if (!validPackages.includes(value)) {
        return 'Please select a package';
      }
      return null;
    }
  },
  
  specialRequests: {
    required: false,
    maxLength: 1000,
    custom: (value: string) => {
      if (value && value.length > 1000) {
        return 'Special requests cannot exceed 1000 characters';
      }
      return null;
    }
  }
};

// Validate a single field
export const validateField = (field: string, value: any): ValidationError | null => {
  const rules = validationRules[field];
  if (!rules) return null;
  
  // Required validation
  if (rules.required && (!value || (typeof value === 'string' && !value.trim()))) {
    return {
      field,
      message: `${getFieldDisplayName(field)} is required`,
      type: 'required'
    };
  }
  
  // Skip other validations if field is empty and not required
  if (!value || (typeof value === 'string' && !value.trim())) {
    return null;
  }
  
  // String validations
  if (typeof value === 'string') {
    // Min length validation
    if (rules.minLength && value.trim().length < rules.minLength) {
      return {
        field,
        message: `${getFieldDisplayName(field)} must be at least ${rules.minLength} characters long`,
        type: 'minLength'
      };
    }
    
    // Max length validation
    if (rules.maxLength && value.length > rules.maxLength) {
      return {
        field,
        message: `${getFieldDisplayName(field)} cannot exceed ${rules.maxLength} characters`,
        type: 'maxLength'
      };
    }
    
    // Pattern validation
    if (rules.pattern && !rules.pattern.test(value)) {
      return {
        field,
        message: `${getFieldDisplayName(field)} contains invalid characters`,
        type: 'pattern'
      };
    }
  }
  
  // Number validations
  if (typeof value === 'number' || (typeof value === 'string' && !isNaN(Number(value)))) {
    const numValue = typeof value === 'number' ? value : Number(value);
    
    // Min value validation
    if (rules.min !== undefined && numValue < rules.min) {
      return {
        field,
        message: `${getFieldDisplayName(field)} must be at least ${rules.min}`,
        type: 'min'
      };
    }
    
    // Max value validation
    if (rules.max !== undefined && numValue > rules.max) {
      return {
        field,
        message: `${getFieldDisplayName(field)} cannot exceed ${rules.max}`,
        type: 'max'
      };
    }
  }
  
  // Custom validation
  if (rules.custom) {
    const customError = rules.custom(value);
    if (customError) {
      return {
        field,
        message: customError,
        type: 'custom'
      };
    }
  }
  
  return null;
};

// Validate entire form
export const validateForm = (formData: Record<string, any>): FormValidationResult => {
  const errors: ValidationError[] = [];
  const fieldErrors: Record<string, string> = {};
  
  // Validate each field
  Object.keys(validationRules).forEach(field => {
    const error = validateField(field, formData[field]);
    if (error) {
      errors.push(error);
      fieldErrors[field] = error.message;
    }
  });
  
  return {
    isValid: errors.length === 0,
    errors,
    fieldErrors
  };
};

// Validate specific step
export const validateStep = (step: number, formData: Record<string, any>): FormValidationResult => {
  const stepFields = getStepFields(step);
  const errors: ValidationError[] = [];
  const fieldErrors: Record<string, string> = {};
  
  stepFields.forEach(field => {
    const error = validateField(field, formData[field]);
    if (error) {
      errors.push(error);
      fieldErrors[field] = error.message;
    }
  });
  
  return {
    isValid: errors.length === 0,
    errors,
    fieldErrors
  };
};

// Get fields for each step
export const getStepFields = (step: number): string[] => {
  const stepFieldMap: Record<number, string[]> = {
    0: [], // Welcome step
    1: ['eventName', 'eventDate', 'location', 'guestCount'], // Event Basics
    2: ['eventType'], // Event Type
    3: ['audioNeeds', 'visualNeeds', 'lightingNeeds'], // AV Requirements
    4: ['selectedPackage'], // Package Selection
    5: ['specialRequests'], // Customization (optional)
    6: [] // Summary
  };
  
  return stepFieldMap[step] || [];
};

// Get user-friendly field names
export const getFieldDisplayName = (field: string): string => {
  const displayNames: Record<string, string> = {
    eventName: 'Event Name',
    eventDate: 'Event Date',
    location: 'Location',
    guestCount: 'Guest Count',
    eventType: 'Event Type',
    audioNeeds: 'Audio Requirements',
    visualNeeds: 'Visual Requirements',
    lightingNeeds: 'Lighting Requirements',
    selectedPackage: 'Package Selection',
    specialRequests: 'Special Requests'
  };
  
  return displayNames[field] || field;
};

// Real-time validation hook
export const useFormValidation = (formData: Record<string, any>) => {
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [touched, setTouched] = React.useState<Record<string, boolean>>({});
  
  const validateFieldRealTime = React.useCallback((field: string, value: any) => {
    const error = validateField(field, value);
    setErrors(prev => ({
      ...prev,
      [field]: error ? error.message : ''
    }));
  }, []);
  
  const markFieldTouched = React.useCallback((field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  }, []);
  
  const getFieldError = React.useCallback((field: string) => {
    return touched[field] ? errors[field] : '';
  }, [errors, touched]);
  
  const isFieldValid = React.useCallback((field: string) => {
    return !errors[field] || !touched[field];
  }, [errors, touched]);
  
  const validateAllFields = React.useCallback(() => {
    const result = validateForm(formData);
    setErrors(result.fieldErrors);
    
    // Mark all fields as touched
    const allTouched: Record<string, boolean> = {};
    Object.keys(validationRules).forEach(field => {
      allTouched[field] = true;
    });
    setTouched(allTouched);
    
    return result;
  }, [formData]);
  
  return {
    errors,
    touched,
    validateFieldRealTime,
    markFieldTouched,
    getFieldError,
    isFieldValid,
    validateAllFields
  };
};

// Add React import for the hook
import React from 'react';
