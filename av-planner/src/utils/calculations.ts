// Advanced calculation utilities for the AV Planning Tool

export interface EventMetrics {
  guestCount: number;
  eventType: string;
  eventDate: string;
  duration: number;
  complexity: 'basic' | 'standard' | 'advanced';
}

export interface PricingFactors {
  baseMultiplier: number;
  guestMultiplier: number;
  seasonalMultiplier: number;
  complexityMultiplier: number;
  eventTypeMultiplier: number;
  dayOfWeekMultiplier: number;
  durationMultiplier: number;
}

// Calculate guest count tier and multiplier
export const calculateGuestTier = (guestCount: number) => {
  if (guestCount <= 25) return { tier: 'small', multiplier: 0.9, description: 'Intimate gathering' };
  if (guestCount <= 50) return { tier: 'medium-small', multiplier: 1.0, description: 'Small event' };
  if (guestCount <= 100) return { tier: 'medium', multiplier: 1.15, description: 'Medium event' };
  if (guestCount <= 200) return { tier: 'medium-large', multiplier: 1.3, description: 'Large event' };
  if (guestCount <= 500) return { tier: 'large', multiplier: 1.5, description: 'Major event' };
  return { tier: 'enterprise', multiplier: 1.8, description: 'Enterprise event' };
};

// Calculate seasonal pricing adjustments
export const calculateSeasonalPricing = (eventDate: string) => {
  if (!eventDate) return { multiplier: 1.0, season: 'standard', description: 'Standard pricing' };
  
  const date = new Date(eventDate);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  
  // Holiday periods (higher demand)
  const holidays = [
    { start: { month: 12, day: 15 }, end: { month: 1, day: 15 }, multiplier: 1.25, name: 'Holiday Season' },
    { start: { month: 5, day: 1 }, end: { month: 6, day: 30 }, multiplier: 1.15, name: 'Wedding Season' },
    { start: { month: 9, day: 1 }, end: { month: 11, day: 30 }, multiplier: 1.1, name: 'Conference Season' }
  ];
  
  for (const holiday of holidays) {
    const isInPeriod = (month === holiday.start.month && day >= holiday.start.day) ||
                      (month === holiday.end.month && day <= holiday.end.day) ||
                      (month > holiday.start.month && month < holiday.end.month);
    
    if (isInPeriod) {
      return {
        multiplier: holiday.multiplier,
        season: 'peak',
        description: `${holiday.name} premium pricing`
      };
    }
  }
  
  return { multiplier: 1.0, season: 'standard', description: 'Standard seasonal pricing' };
};

// Calculate day of week pricing
export const calculateDayOfWeekPricing = (eventDate: string) => {
  if (!eventDate) return { multiplier: 1.0, dayType: 'weekday', description: 'Standard pricing' };
  
  const date = new Date(eventDate);
  const dayOfWeek = date.getDay();
  
  if (dayOfWeek === 0) { // Sunday
    return { multiplier: 1.1, dayType: 'sunday', description: 'Sunday premium' };
  } else if (dayOfWeek === 6) { // Saturday
    return { multiplier: 1.2, dayType: 'saturday', description: 'Saturday premium' };
  } else if (dayOfWeek === 5) { // Friday
    return { multiplier: 1.05, dayType: 'friday', description: 'Friday slight premium' };
  }
  
  return { multiplier: 1.0, dayType: 'weekday', description: 'Weekday standard pricing' };
};

// Calculate complexity multiplier based on AV requirements
export const calculateComplexityMultiplier = (
  audioNeeds: string,
  visualNeeds: string,
  lightingNeeds: string
) => {
  const requirements = [audioNeeds, visualNeeds, lightingNeeds];
  const advancedCount = requirements.filter(req => req === 'advanced').length;
  const standardCount = requirements.filter(req => req === 'standard').length;
  const basicCount = requirements.filter(req => req === 'basic').length;
  
  // Calculate weighted complexity score
  const complexityScore = (advancedCount * 3) + (standardCount * 2) + (basicCount * 1);
  const maxScore = 9; // 3 categories × 3 points each
  const normalizedScore = complexityScore / maxScore;
  
  if (normalizedScore >= 0.8) {
    return { multiplier: 1.5, level: 'advanced', description: 'High complexity setup' };
  } else if (normalizedScore >= 0.5) {
    return { multiplier: 1.2, level: 'standard', description: 'Standard complexity setup' };
  } else {
    return { multiplier: 1.0, level: 'basic', description: 'Basic setup' };
  }
};

// Calculate event type multiplier
export const calculateEventTypeMultiplier = (eventType: string) => {
  const multipliers = {
    'in-person': { multiplier: 1.0, description: 'Standard in-person event' },
    'virtual': { multiplier: 0.7, description: '30% reduction for virtual events' },
    'hybrid': { multiplier: 1.25, description: '25% premium for hybrid complexity' }
  };
  
  return multipliers[eventType as keyof typeof multipliers] || multipliers['in-person'];
};

// Calculate duration multiplier
export const calculateDurationMultiplier = (hours: number) => {
  if (hours <= 4) return { multiplier: 1.0, category: 'half-day', description: 'Half-day event' };
  if (hours <= 8) return { multiplier: 1.6, category: 'full-day', description: 'Full-day event' };
  if (hours <= 12) return { multiplier: 2.2, category: 'extended', description: 'Extended event' };
  return { multiplier: 3.0, category: 'multi-day', description: 'Multi-day event' };
};

// Calculate equipment utilization efficiency
export const calculateEquipmentEfficiency = (guestCount: number, packageType: string) => {
  const baseCapacities = {
    essential: 50,
    recommended: 200,
    premium: 500
  };
  
  const capacity = baseCapacities[packageType as keyof typeof baseCapacities] || 50;
  const utilization = Math.min(guestCount / capacity, 1.0);
  
  return {
    utilization: utilization * 100,
    efficiency: utilization > 0.8 ? 'high' : utilization > 0.5 ? 'medium' : 'low',
    recommendation: utilization > 1.0 ? 'upgrade' : utilization < 0.3 ? 'downgrade' : 'optimal'
  };
};

// Calculate total pricing with all factors
export const calculateComprehensivePricing = (
  basePrice: number,
  eventMetrics: EventMetrics
) => {
  const guestTier = calculateGuestTier(eventMetrics.guestCount);
  const seasonal = calculateSeasonalPricing(eventMetrics.eventDate);
  const dayOfWeek = calculateDayOfWeekPricing(eventMetrics.eventDate);
  const complexity = calculateComplexityMultiplier(
    eventMetrics.complexity,
    eventMetrics.complexity,
    eventMetrics.complexity
  );
  const eventType = calculateEventTypeMultiplier(eventMetrics.eventType);
  const duration = calculateDurationMultiplier(eventMetrics.duration);
  
  const factors: PricingFactors = {
    baseMultiplier: 1.0,
    guestMultiplier: guestTier.multiplier,
    seasonalMultiplier: seasonal.multiplier,
    complexityMultiplier: complexity.multiplier,
    eventTypeMultiplier: eventType.multiplier,
    dayOfWeekMultiplier: dayOfWeek.multiplier,
    durationMultiplier: duration.multiplier
  };
  
  const totalMultiplier = Object.values(factors).reduce((acc, mult) => acc * mult, 1);
  const finalPrice = basePrice * totalMultiplier;
  
  return {
    basePrice,
    finalPrice: Math.round(finalPrice),
    totalMultiplier,
    factors,
    breakdown: {
      guestTier,
      seasonal,
      dayOfWeek,
      complexity,
      eventType,
      duration
    }
  };
};

// Calculate cost per guest
export const calculateCostPerGuest = (totalPrice: number, guestCount: number) => {
  if (guestCount === 0) return 0;
  return Math.round(totalPrice / guestCount);
};

// Calculate potential savings vs individual equipment rental
export const calculatePackageSavings = (packagePrice: number, individualEquipmentCost: number) => {
  const savings = individualEquipmentCost - packagePrice;
  const savingsPercentage = (savings / individualEquipmentCost) * 100;
  
  return {
    absoluteSavings: Math.max(0, savings),
    percentageSavings: Math.max(0, savingsPercentage),
    isPackageBetter: savings > 0
  };
};

// Calculate ROI for different package tiers
export const calculatePackageROI = (
  packagePrices: { essential: number; recommended: number; premium: number },
  eventValue: number
) => {
  const roi = Object.entries(packagePrices).map(([tier, price]) => ({
    tier,
    price,
    roi: ((eventValue - price) / price) * 100,
    valueRatio: eventValue / price
  }));
  
  return roi.sort((a, b) => b.roi - a.roi);
};

// Calculate optimal package recommendation
export const calculateOptimalPackage = (
  guestCount: number,
  budget: number,
  requirements: { audio: string; visual: string; lighting: string }
) => {
  const guestTier = calculateGuestTier(guestCount);
  const complexity = calculateComplexityMultiplier(
    requirements.audio,
    requirements.visual,
    requirements.lighting
  );
  
  // Score each package based on suitability
  const packageScores = {
    essential: {
      guestSuitability: guestCount <= 50 ? 1.0 : Math.max(0, 1 - (guestCount - 50) / 100),
      complexitySuitability: complexity.level === 'basic' ? 1.0 : 0.5,
      budgetSuitability: budget >= 500 ? 1.0 : budget / 500
    },
    recommended: {
      guestSuitability: guestCount <= 200 ? 1.0 : Math.max(0, 1 - (guestCount - 200) / 200),
      complexitySuitability: complexity.level === 'standard' ? 1.0 : complexity.level === 'basic' ? 0.8 : 0.7,
      budgetSuitability: budget >= 1200 ? 1.0 : budget / 1200
    },
    premium: {
      guestSuitability: guestCount <= 500 ? 1.0 : 0.9,
      complexitySuitability: complexity.level === 'advanced' ? 1.0 : 0.8,
      budgetSuitability: budget >= 2500 ? 1.0 : budget / 2500
    }
  };
  
  // Calculate overall scores
  const overallScores = Object.entries(packageScores).map(([tier, scores]) => ({
    tier,
    score: (scores.guestSuitability + scores.complexitySuitability + scores.budgetSuitability) / 3,
    breakdown: scores
  }));
  
  return overallScores.sort((a, b) => b.score - a.score);
};
