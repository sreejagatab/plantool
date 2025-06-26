// Responsive design utilities for the AV Planning Tool

export interface BreakpointConfig {
  mobile: number;
  tablet: number;
  desktop: number;
  wide: number;
}

export const breakpoints: BreakpointConfig = {
  mobile: 320,
  tablet: 768,
  desktop: 1024,
  wide: 1440
};

// Detect current device type
export const getDeviceType = (): 'mobile' | 'tablet' | 'desktop' => {
  if (typeof window === 'undefined') return 'desktop';
  
  const width = window.innerWidth;
  
  if (width < breakpoints.tablet) return 'mobile';
  if (width < breakpoints.desktop) return 'tablet';
  return 'desktop';
};

// Check if device supports touch
export const isTouchDevice = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  return 'ontouchstart' in window || 
         navigator.maxTouchPoints > 0 || 
         (navigator as any).msMaxTouchPoints > 0;
};

// Get optimal grid columns based on screen size
export const getOptimalColumns = (
  itemCount: number,
  deviceType?: 'mobile' | 'tablet' | 'desktop'
): number => {
  const device = deviceType || getDeviceType();
  
  const maxColumns = {
    mobile: 1,
    tablet: 2,
    desktop: 3
  };
  
  return Math.min(itemCount, maxColumns[device]);
};

// Calculate optimal font sizes for different screen sizes
export const getResponsiveFontSize = (
  baseSize: number,
  deviceType?: 'mobile' | 'tablet' | 'desktop'
): string => {
  const device = deviceType || getDeviceType();
  
  const scaleFactor = {
    mobile: 0.875,   // 14px base becomes ~12px
    tablet: 0.9375,  // 14px base becomes ~13px
    desktop: 1       // 14px base stays 14px
  };
  
  const scaledSize = baseSize * scaleFactor[device];
  return `${scaledSize}rem`;
};

// Get touch-friendly button sizes
export const getTouchButtonSize = (
  size: 'small' | 'medium' | 'large' = 'medium'
): { width: string; height: string; padding: string } => {
  const isTouch = isTouchDevice();
  
  const sizes = {
    small: {
      touch: { width: '44px', height: '44px', padding: '8px 12px' },
      mouse: { width: 'auto', height: '32px', padding: '6px 10px' }
    },
    medium: {
      touch: { width: '48px', height: '48px', padding: '12px 16px' },
      mouse: { width: 'auto', height: '40px', padding: '10px 14px' }
    },
    large: {
      touch: { width: '56px', height: '56px', padding: '16px 20px' },
      mouse: { width: 'auto', height: '48px', padding: '14px 18px' }
    }
  };
  
  return sizes[size][isTouch ? 'touch' : 'mouse'];
};

// Generate responsive classes for Tailwind
export const getResponsiveClasses = (
  mobileClasses: string,
  tabletClasses?: string,
  desktopClasses?: string
): string => {
  const classes = [mobileClasses];
  
  if (tabletClasses) {
    classes.push(`md:${tabletClasses}`);
  }
  
  if (desktopClasses) {
    classes.push(`lg:${desktopClasses}`);
  }
  
  return classes.join(' ');
};

// Calculate optimal spacing for different screen sizes
export const getResponsiveSpacing = (
  baseSpacing: number,
  deviceType?: 'mobile' | 'tablet' | 'desktop'
): string => {
  const device = deviceType || getDeviceType();
  
  const spacingMultiplier = {
    mobile: 0.75,
    tablet: 0.875,
    desktop: 1
  };
  
  const scaledSpacing = baseSpacing * spacingMultiplier[device];
  return `${scaledSpacing}rem`;
};

// Get optimal container width
export const getContainerWidth = (
  deviceType?: 'mobile' | 'tablet' | 'desktop'
): string => {
  const device = deviceType || getDeviceType();
  
  const widths = {
    mobile: '100%',
    tablet: '90%',
    desktop: '80%'
  };
  
  return widths[device];
};

// Check if element is in viewport
export const isInViewport = (element: HTMLElement): boolean => {
  if (typeof window === 'undefined') return false;
  
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
};

// Smooth scroll to element with offset for mobile headers
export const scrollToElement = (
  elementId: string,
  offset: number = 0
): void => {
  if (typeof window === 'undefined') return;
  
  const element = document.getElementById(elementId);
  if (!element) return;
  
  const deviceType = getDeviceType();
  const mobileHeaderOffset = deviceType === 'mobile' ? 60 : 0;
  const totalOffset = offset + mobileHeaderOffset;
  
  const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
  const offsetPosition = elementPosition - totalOffset;
  
  window.scrollTo({
    top: offsetPosition,
    behavior: 'smooth'
  });
};

// Debounce function for resize events
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Hook for responsive behavior
export const useResponsive = () => {
  if (typeof window === 'undefined') {
    return {
      deviceType: 'desktop' as const,
      isMobile: false,
      isTablet: false,
      isDesktop: true,
      isTouchDevice: false,
      windowWidth: 1024,
      windowHeight: 768
    };
  }
  
  const [windowSize, setWindowSize] = React.useState({
    width: window.innerWidth,
    height: window.innerHeight
  });
  
  React.useEffect(() => {
    const handleResize = debounce(() => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    }, 150);
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  const deviceType = getDeviceType();
  
  return {
    deviceType,
    isMobile: deviceType === 'mobile',
    isTablet: deviceType === 'tablet',
    isDesktop: deviceType === 'desktop',
    isTouchDevice: isTouchDevice(),
    windowWidth: windowSize.width,
    windowHeight: windowSize.height
  };
};

// Generate responsive image sizes
export const getResponsiveImageSizes = (
  baseWidth: number
): { mobile: number; tablet: number; desktop: number } => {
  return {
    mobile: Math.round(baseWidth * 0.9),
    tablet: Math.round(baseWidth * 0.95),
    desktop: baseWidth
  };
};

// Get optimal modal size for device
export const getModalSize = (
  size: 'small' | 'medium' | 'large' | 'fullscreen',
  deviceType?: 'mobile' | 'tablet' | 'desktop'
): { width: string; height: string; maxWidth: string; maxHeight: string } => {
  const device = deviceType || getDeviceType();
  
  if (device === 'mobile') {
    return {
      width: '100vw',
      height: '100vh',
      maxWidth: '100vw',
      maxHeight: '100vh'
    };
  }
  
  const sizes = {
    small: { width: '400px', height: 'auto', maxWidth: '90vw', maxHeight: '80vh' },
    medium: { width: '600px', height: 'auto', maxWidth: '90vw', maxHeight: '80vh' },
    large: { width: '800px', height: 'auto', maxWidth: '90vw', maxHeight: '80vh' },
    fullscreen: { width: '100vw', height: '100vh', maxWidth: '100vw', maxHeight: '100vh' }
  };
  
  return sizes[size];
};

// Add React import for the hook
import React from 'react';
