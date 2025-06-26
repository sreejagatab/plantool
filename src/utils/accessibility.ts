// Accessibility utilities for the AV Planning Tool

export interface AccessibilityOptions {
  highContrast: boolean;
  reducedMotion: boolean;
  largeText: boolean;
  screenReader: boolean;
}

// Check if user prefers reduced motion
export const prefersReducedMotion = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

// Check if user prefers high contrast
export const prefersHighContrast = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-contrast: high)').matches;
};

// Check if user has large text preference
export const prefersLargeText = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-data: reduce)').matches;
};

// Detect screen reader usage
export const isScreenReaderActive = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  // Check for common screen reader indicators
  const indicators = [
    'speechSynthesis' in window,
    navigator.userAgent.includes('NVDA'),
    navigator.userAgent.includes('JAWS'),
    navigator.userAgent.includes('VoiceOver')
  ];
  
  return indicators.some(indicator => indicator);
};

// Generate accessible IDs
export const generateAccessibleId = (prefix: string = 'element'): string => {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
};

// ARIA label generators
export const generateAriaLabel = (
  element: string,
  context?: string,
  state?: string
): string => {
  let label = element;
  
  if (context) {
    label += ` for ${context}`;
  }
  
  if (state) {
    label += `, ${state}`;
  }
  
  return label;
};

// Focus management
export const trapFocus = (container: HTMLElement): (() => void) => {
  const focusableElements = container.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  
  const firstElement = focusableElements[0] as HTMLElement;
  const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;
  
  const handleTabKey = (e: KeyboardEvent) => {
    if (e.key !== 'Tab') return;
    
    if (e.shiftKey) {
      if (document.activeElement === firstElement) {
        lastElement.focus();
        e.preventDefault();
      }
    } else {
      if (document.activeElement === lastElement) {
        firstElement.focus();
        e.preventDefault();
      }
    }
  };
  
  container.addEventListener('keydown', handleTabKey);
  
  // Focus first element
  if (firstElement) {
    firstElement.focus();
  }
  
  // Return cleanup function
  return () => {
    container.removeEventListener('keydown', handleTabKey);
  };
};

// Keyboard navigation helpers
export const handleKeyboardNavigation = (
  e: KeyboardEvent,
  options: {
    onEnter?: () => void;
    onSpace?: () => void;
    onEscape?: () => void;
    onArrowUp?: () => void;
    onArrowDown?: () => void;
    onArrowLeft?: () => void;
    onArrowRight?: () => void;
  }
) => {
  switch (e.key) {
    case 'Enter':
      options.onEnter?.();
      break;
    case ' ':
      e.preventDefault();
      options.onSpace?.();
      break;
    case 'Escape':
      options.onEscape?.();
      break;
    case 'ArrowUp':
      e.preventDefault();
      options.onArrowUp?.();
      break;
    case 'ArrowDown':
      e.preventDefault();
      options.onArrowDown?.();
      break;
    case 'ArrowLeft':
      e.preventDefault();
      options.onArrowLeft?.();
      break;
    case 'ArrowRight':
      e.preventDefault();
      options.onArrowRight?.();
      break;
  }
};

// Announce to screen readers
export const announceToScreenReader = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
  if (typeof document === 'undefined') return;
  
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;
  
  document.body.appendChild(announcement);
  
  // Remove after announcement
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
};

// Color contrast utilities
export const getContrastRatio = (color1: string, color2: string): number => {
  const getLuminance = (color: string): number => {
    const rgb = color.match(/\d+/g);
    if (!rgb) return 0;
    
    const [r, g, b] = rgb.map(c => {
      const val = parseInt(c) / 255;
      return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
    });
    
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  
  const lum1 = getLuminance(color1);
  const lum2 = getLuminance(color2);
  
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  
  return (brightest + 0.05) / (darkest + 0.05);
};

// Check if color combination meets WCAG standards
export const meetsWCAGStandards = (
  foreground: string,
  background: string,
  level: 'AA' | 'AAA' = 'AA',
  size: 'normal' | 'large' = 'normal'
): boolean => {
  const ratio = getContrastRatio(foreground, background);
  
  const requirements = {
    AA: { normal: 4.5, large: 3 },
    AAA: { normal: 7, large: 4.5 }
  };
  
  return ratio >= requirements[level][size];
};

// High contrast theme utilities
export const applyHighContrastTheme = () => {
  if (typeof document === 'undefined') return;
  
  document.documentElement.classList.add('high-contrast');
  localStorage.setItem('accessibility-high-contrast', 'true');
};

export const removeHighContrastTheme = () => {
  if (typeof document === 'undefined') return;
  
  document.documentElement.classList.remove('high-contrast');
  localStorage.setItem('accessibility-high-contrast', 'false');
};

// Large text utilities
export const applyLargeTextTheme = () => {
  if (typeof document === 'undefined') return;
  
  document.documentElement.classList.add('large-text');
  localStorage.setItem('accessibility-large-text', 'true');
};

export const removeLargeTextTheme = () => {
  if (typeof document === 'undefined') return;
  
  document.documentElement.classList.remove('large-text');
  localStorage.setItem('accessibility-large-text', 'false');
};

// Reduced motion utilities
export const applyReducedMotionTheme = () => {
  if (typeof document === 'undefined') return;
  
  document.documentElement.classList.add('reduced-motion');
  localStorage.setItem('accessibility-reduced-motion', 'true');
};

export const removeReducedMotionTheme = () => {
  if (typeof document === 'undefined') return;
  
  document.documentElement.classList.remove('reduced-motion');
  localStorage.setItem('accessibility-reduced-motion', 'false');
};

// Load accessibility preferences
export const loadAccessibilityPreferences = (): AccessibilityOptions => {
  if (typeof localStorage === 'undefined') {
    return {
      highContrast: false,
      reducedMotion: prefersReducedMotion(),
      largeText: false,
      screenReader: isScreenReaderActive()
    };
  }
  
  return {
    highContrast: localStorage.getItem('accessibility-high-contrast') === 'true' || prefersHighContrast(),
    reducedMotion: localStorage.getItem('accessibility-reduced-motion') === 'true' || prefersReducedMotion(),
    largeText: localStorage.getItem('accessibility-large-text') === 'true' || prefersLargeText(),
    screenReader: isScreenReaderActive()
  };
};

// Apply all accessibility preferences
export const applyAccessibilityPreferences = (options: AccessibilityOptions) => {
  if (options.highContrast) {
    applyHighContrastTheme();
  } else {
    removeHighContrastTheme();
  }
  
  if (options.reducedMotion) {
    applyReducedMotionTheme();
  } else {
    removeReducedMotionTheme();
  }
  
  if (options.largeText) {
    applyLargeTextTheme();
  } else {
    removeLargeTextTheme();
  }
};

// Validate form accessibility
export const validateFormAccessibility = (form: HTMLFormElement): string[] => {
  const issues: string[] = [];
  
  // Check for labels
  const inputs = form.querySelectorAll('input, select, textarea');
  inputs.forEach((input) => {
    const id = input.getAttribute('id');
    const ariaLabel = input.getAttribute('aria-label');
    const ariaLabelledBy = input.getAttribute('aria-labelledby');
    
    if (!id || (!ariaLabel && !ariaLabelledBy && !form.querySelector(`label[for="${id}"]`))) {
      issues.push(`Input element missing proper label: ${input.tagName}`);
    }
  });
  
  // Check for fieldsets in groups
  const radioGroups = form.querySelectorAll('input[type="radio"]');
  const checkboxGroups = form.querySelectorAll('input[type="checkbox"]');
  
  if (radioGroups.length > 1 && !form.querySelector('fieldset')) {
    issues.push('Radio button groups should be wrapped in fieldset elements');
  }
  
  if (checkboxGroups.length > 1 && !form.querySelector('fieldset')) {
    issues.push('Checkbox groups should be wrapped in fieldset elements');
  }
  
  return issues;
};
