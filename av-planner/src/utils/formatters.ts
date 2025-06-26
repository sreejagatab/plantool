// Formatting utilities for the AV Planning Tool

// Currency formatting
export const formatCurrency = (
  amount: number,
  currency: string = 'USD',
  locale: string = 'en-US'
): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

// Compact currency formatting for large numbers
export const formatCompactCurrency = (
  amount: number,
  currency: string = 'USD',
  locale: string = 'en-US'
): string => {
  if (amount >= 1000000) {
    return `${formatCurrency(amount / 1000000, currency, locale).replace(/[^\d.,]/g, '')}M`;
  } else if (amount >= 1000) {
    return `${formatCurrency(amount / 1000, currency, locale).replace(/[^\d.,]/g, '')}K`;
  }
  return formatCurrency(amount, currency, locale);
};

// Percentage formatting
export const formatPercentage = (
  value: number,
  decimals: number = 1,
  locale: string = 'en-US'
): string => {
  return new Intl.NumberFormat(locale, {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(value / 100);
};

// Date formatting
export const formatDate = (
  date: string | Date,
  format: 'short' | 'medium' | 'long' | 'full' = 'medium',
  locale: string = 'en-US'
): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  const options: Intl.DateTimeFormatOptions = {
    short: { month: 'short', day: 'numeric', year: 'numeric' },
    medium: { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' },
    long: { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' },
    full: { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric', timeZoneName: 'short' }
  };
  
  return new Intl.DateTimeFormat(locale, options[format]).format(dateObj);
};

// Time formatting
export const formatTime = (
  date: string | Date,
  format: '12h' | '24h' = '12h',
  locale: string = 'en-US'
): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return new Intl.DateTimeFormat(locale, {
    hour: 'numeric',
    minute: '2-digit',
    hour12: format === '12h'
  }).format(dateObj);
};

// Duration formatting
export const formatDuration = (hours: number): string => {
  if (hours < 1) {
    const minutes = Math.round(hours * 60);
    return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
  } else if (hours === 1) {
    return '1 hour';
  } else if (hours < 24) {
    const wholeHours = Math.floor(hours);
    const minutes = Math.round((hours - wholeHours) * 60);
    
    if (minutes === 0) {
      return `${wholeHours} hour${wholeHours !== 1 ? 's' : ''}`;
    } else {
      return `${wholeHours}h ${minutes}m`;
    }
  } else {
    const days = Math.floor(hours / 24);
    const remainingHours = Math.round(hours % 24);
    
    if (remainingHours === 0) {
      return `${days} day${days !== 1 ? 's' : ''}`;
    } else {
      return `${days}d ${remainingHours}h`;
    }
  }
};

// Number formatting with commas
export const formatNumber = (
  number: number,
  locale: string = 'en-US'
): string => {
  return new Intl.NumberFormat(locale).format(number);
};

// Phone number formatting
export const formatPhoneNumber = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');
  
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  } else if (cleaned.length === 11 && cleaned[0] === '1') {
    return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
  }
  
  return phone; // Return original if not standard format
};

// Text truncation
export const truncateText = (
  text: string,
  maxLength: number,
  suffix: string = '...'
): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - suffix.length) + suffix;
};

// Capitalize first letter
export const capitalize = (text: string): string => {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

// Title case formatting
export const toTitleCase = (text: string): string => {
  return text.replace(/\w\S*/g, (txt) => 
    txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  );
};

// Slug formatting (for URLs)
export const toSlug = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
};

// File size formatting
export const formatFileSize = (bytes: number): string => {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (bytes === 0) return '0 Bytes';
  
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  const size = bytes / Math.pow(1024, i);
  
  return `${Math.round(size * 100) / 100} ${sizes[i]}`;
};

// Address formatting
export const formatAddress = (address: {
  street?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
}): string => {
  const parts = [
    address.street,
    address.city,
    address.state && address.zipCode ? `${address.state} ${address.zipCode}` : address.state || address.zipCode,
    address.country
  ].filter(Boolean);
  
  return parts.join(', ');
};

// Event type formatting
export const formatEventType = (eventType: string): string => {
  const types = {
    'in-person': 'In-Person Event',
    'virtual': 'Virtual Event',
    'hybrid': 'Hybrid Event'
  };
  
  return types[eventType as keyof typeof types] || toTitleCase(eventType);
};

// Package tier formatting
export const formatPackageTier = (tier: string): string => {
  const tiers = {
    essential: 'Essential Package',
    recommended: 'Recommended Package',
    premium: 'Premium Package'
  };
  
  return tiers[tier as keyof typeof tiers] || toTitleCase(tier);
};

// Guest count formatting with descriptive text
export const formatGuestCount = (count: number): string => {
  if (count === 1) return '1 guest';
  if (count <= 25) return `${count} guests (intimate)`;
  if (count <= 50) return `${count} guests (small)`;
  if (count <= 100) return `${count} guests (medium)`;
  if (count <= 200) return `${count} guests (large)`;
  if (count <= 500) return `${count} guests (major event)`;
  return `${count} guests (enterprise)`;
};

// Equipment category formatting
export const formatEquipmentCategory = (category: string): string => {
  const categories = {
    audio: 'Audio Equipment',
    visual: 'Visual Equipment',
    lighting: 'Lighting Equipment',
    streaming: 'Streaming Equipment'
  };
  
  return categories[category as keyof typeof categories] || toTitleCase(category);
};

// Pricing tier description
export const formatPricingTier = (tier: string): string => {
  const descriptions = {
    basic: 'Basic Level',
    standard: 'Professional Level',
    advanced: 'Premium Level'
  };
  
  return descriptions[tier as keyof typeof descriptions] || toTitleCase(tier);
};

// Format multiplier as percentage change
export const formatMultiplierAsPercentage = (multiplier: number): string => {
  if (multiplier === 1) return 'No change';
  
  const percentage = Math.abs((multiplier - 1) * 100);
  const direction = multiplier > 1 ? 'increase' : 'decrease';
  
  return `${percentage.toFixed(0)}% ${direction}`;
};

// Format price range
export const formatPriceRange = (min: number, max: number): string => {
  if (min === max) return formatCurrency(min);
  return `${formatCurrency(min)} - ${formatCurrency(max)}`;
};

// Format savings
export const formatSavings = (amount: number, percentage?: number): string => {
  const currencyAmount = formatCurrency(amount);
  
  if (percentage !== undefined) {
    return `${currencyAmount} (${formatPercentage(percentage)} savings)`;
  }
  
  return `${currencyAmount} savings`;
};

// Format list with proper conjunctions
export const formatList = (
  items: string[],
  conjunction: 'and' | 'or' = 'and'
): string => {
  if (items.length === 0) return '';
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} ${conjunction} ${items[1]}`;
  
  const lastItem = items[items.length - 1];
  const otherItems = items.slice(0, -1);
  
  return `${otherItems.join(', ')}, ${conjunction} ${lastItem}`;
};

// Format validation errors
export const formatValidationError = (field: string, error: string): string => {
  const fieldNames = {
    eventName: 'Event Name',
    eventDate: 'Event Date',
    location: 'Location',
    guestCount: 'Guest Count',
    eventType: 'Event Type',
    audioNeeds: 'Audio Requirements',
    visualNeeds: 'Visual Requirements',
    lightingNeeds: 'Lighting Requirements'
  };
  
  const fieldName = fieldNames[field as keyof typeof fieldNames] || toTitleCase(field);
  return `${fieldName}: ${error}`;
};
