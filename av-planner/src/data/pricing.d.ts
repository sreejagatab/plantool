export interface PricingResult {
  subtotal: number;
  taxes: number;
  total: number;
  breakdown: {
    basePrice: number;
    guestMultiplier: number;
    seasonalAdjustment: number;
    dayOfWeekPremium: number;
    complexityFactor: number;
    eventTypeModifier: number;
  };
}

export interface PricingComparison {
  [key: string]: PricingResult;
}

export declare function calculatePackagePricing(
  packageId: string,
  guestCount: number,
  eventDate: string,
  eventType: string,
  avRequirements: any
): PricingResult;

export declare function formatPrice(amount: number): string;

export declare function getPricingRecommendation(
  guestCount: number,
  eventType: string,
  avRequirements: any
): string;

export declare function calculateAllPackagesPricing(
  guestCount: number,
  eventDate: string,
  eventType: string,
  avRequirements: any
): PricingComparison;
