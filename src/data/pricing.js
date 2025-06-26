// Pricing logic and calculation utilities
import { packages, addOns } from './packages.js';

// Pricing multipliers based on various factors
export const pricingMultipliers = {
  guestCount: {
    small: { min: 1, max: 50, multiplier: 1.0 },
    medium: { min: 51, max: 200, multiplier: 1.15 },
    large: { min: 201, max: 500, multiplier: 1.3 },
    extraLarge: { min: 501, max: 1000, multiplier: 1.5 }
  },
  
  duration: {
    halfDay: { hours: 4, multiplier: 1.0 },
    fullDay: { hours: 8, multiplier: 1.6 },
    extended: { hours: 12, multiplier: 2.2 },
    multiDay: { hours: 24, multiplier: 3.5 }
  },
  
  eventType: {
    'in-person': { multiplier: 1.0 },
    'virtual': { multiplier: 0.7 },
    'hybrid': { multiplier: 1.25 }
  },
  
  complexity: {
    basic: { multiplier: 1.0 },
    standard: { multiplier: 1.2 },
    advanced: { multiplier: 1.5 }
  },
  
  season: {
    peak: { months: [5, 6, 9, 10, 11], multiplier: 1.1 }, // May, June, Sept, Oct, Nov
    standard: { months: [1, 2, 3, 4, 7, 8, 12], multiplier: 1.0 }
  },
  
  dayOfWeek: {
    weekend: { multiplier: 1.15 },
    weekday: { multiplier: 1.0 }
  }
};

// Calculate guest count multiplier
export const getGuestCountMultiplier = (guestCount) => {
  const count = parseInt(guestCount) || 0;
  
  for (const tier of Object.values(pricingMultipliers.guestCount)) {
    if (count >= tier.min && count <= tier.max) {
      return tier.multiplier;
    }
  }
  
  // For counts above 1000
  return 1.8;
};

// Calculate event type multiplier
export const getEventTypeMultiplier = (eventType) => {
  return pricingMultipliers.eventType[eventType]?.multiplier || 1.0;
};

// Calculate complexity multiplier based on AV requirements
export const getComplexityMultiplier = (audioNeeds, visualNeeds, lightingNeeds) => {
  const requirements = [audioNeeds, visualNeeds, lightingNeeds];
  const advancedCount = requirements.filter(req => req === 'advanced').length;
  const standardCount = requirements.filter(req => req === 'standard').length;
  
  if (advancedCount >= 2) return pricingMultipliers.complexity.advanced.multiplier;
  if (advancedCount >= 1 || standardCount >= 2) return pricingMultipliers.complexity.standard.multiplier;
  return pricingMultipliers.complexity.basic.multiplier;
};

// Calculate seasonal multiplier
export const getSeasonalMultiplier = (eventDate) => {
  if (!eventDate) return 1.0;
  
  const date = new Date(eventDate);
  const month = date.getMonth() + 1; // JavaScript months are 0-indexed
  
  if (pricingMultipliers.season.peak.months.includes(month)) {
    return pricingMultipliers.season.peak.multiplier;
  }
  
  return pricingMultipliers.season.standard.multiplier;
};

// Calculate day of week multiplier
export const getDayOfWeekMultiplier = (eventDate) => {
  if (!eventDate) return 1.0;
  
  const date = new Date(eventDate);
  const dayOfWeek = date.getDay(); // 0 = Sunday, 6 = Saturday
  
  if (dayOfWeek === 0 || dayOfWeek === 6) {
    return pricingMultipliers.dayOfWeek.weekend.multiplier;
  }
  
  return pricingMultipliers.dayOfWeek.weekday.multiplier;
};

// Main pricing calculation function
export const calculatePackagePricing = (formData) => {
  const {
    selectedPackage,
    guestCount,
    eventType,
    eventDate,
    audioNeeds,
    visualNeeds,
    lightingNeeds,
    addOns: selectedAddOns = []
  } = formData;

  if (!selectedPackage || !packages[selectedPackage]) {
    return {
      subtotal: 0,
      addOnsTotal: 0,
      total: 0,
      breakdown: {}
    };
  }

  const packageData = packages[selectedPackage];
  let subtotal = packageData.basePrice;

  // Apply multipliers
  const guestMultiplier = getGuestCountMultiplier(guestCount);
  const eventTypeMultiplier = getEventTypeMultiplier(eventType);
  const complexityMultiplier = getComplexityMultiplier(audioNeeds, visualNeeds, lightingNeeds);
  const seasonalMultiplier = getSeasonalMultiplier(eventDate);
  const dayMultiplier = getDayOfWeekMultiplier(eventDate);

  // Calculate adjusted subtotal
  subtotal = subtotal * guestMultiplier * eventTypeMultiplier * complexityMultiplier * seasonalMultiplier * dayMultiplier;

  // Calculate add-ons total
  let addOnsTotal = 0;
  const addOnBreakdown = [];

  selectedAddOns.forEach(addOnId => {
    const addOn = addOns.find(a => a.id === addOnId);
    if (addOn) {
      addOnsTotal += addOn.price;
      addOnBreakdown.push({
        id: addOn.id,
        name: addOn.name,
        price: addOn.price
      });
    }
  });

  const total = subtotal + addOnsTotal;

  return {
    subtotal: Math.round(subtotal),
    addOnsTotal,
    total: Math.round(total),
    breakdown: {
      basePrice: packageData.basePrice,
      guestMultiplier,
      eventTypeMultiplier,
      complexityMultiplier,
      seasonalMultiplier,
      dayMultiplier,
      addOns: addOnBreakdown
    }
  };
};

// Calculate pricing for all packages (for comparison)
export const calculateAllPackagesPricing = (formData) => {
  const results = {};
  
  Object.keys(packages).forEach(packageId => {
    const packageFormData = { ...formData, selectedPackage: packageId };
    results[packageId] = calculatePackagePricing(packageFormData);
  });
  
  return results;
};

// Get pricing tier recommendation based on guest count and requirements
export const getPricingRecommendation = (guestCount, audioNeeds, visualNeeds, lightingNeeds) => {
  const count = parseInt(guestCount) || 0;
  const requirements = [audioNeeds, visualNeeds, lightingNeeds];
  const advancedCount = requirements.filter(req => req === 'advanced').length;
  const standardCount = requirements.filter(req => req === 'standard').length;

  // If guest count is high or requirements are advanced, recommend premium
  if (count > 200 || advancedCount >= 2) {
    return 'premium';
  }
  
  // If medium guest count or some advanced requirements, recommend recommended
  if (count > 50 || advancedCount >= 1 || standardCount >= 2) {
    return 'recommended';
  }
  
  // Otherwise, essential is sufficient
  return 'essential';
};

// Format price for display
export const formatPrice = (price) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price);
};

// Calculate savings compared to individual equipment rental
export const calculatePackageSavings = (packageId, formData) => {
  // This would calculate individual equipment costs vs package price
  // For now, return a placeholder savings percentage
  const savingsPercentage = {
    essential: 15,
    recommended: 20,
    premium: 25
  };
  
  return savingsPercentage[packageId] || 0;
};
