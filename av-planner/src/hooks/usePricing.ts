import { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  calculatePackagePricing, 
  calculateAllPackagesPricing,
  getPricingRecommendation,
  formatPrice,
  getGuestCountMultiplier,
  getEventTypeMultiplier,
  getComplexityMultiplier,
  getSeasonalMultiplier,
  getDayOfWeekMultiplier
} from '../data/pricing';
import { packages, addOns } from '../data/packages';
import type { FormData } from './useWizard';

export interface PricingBreakdown {
  subtotal: number;
  addOnsTotal: number;
  total: number;
  breakdown: {
    basePrice: number;
    guestMultiplier: number;
    eventTypeMultiplier: number;
    complexityMultiplier: number;
    seasonalMultiplier: number;
    dayMultiplier: number;
    addOns: Array<{
      id: string;
      name: string;
      price: number;
    }>;
  };
}

export interface PricingComparison {
  essential: PricingBreakdown;
  recommended: PricingBreakdown;
  premium: PricingBreakdown;
}

export const usePricing = (formData: FormData) => {
  const [pricing, setPricing] = useState<PricingBreakdown>({
    subtotal: 0,
    addOnsTotal: 0,
    total: 0,
    breakdown: {
      basePrice: 0,
      guestMultiplier: 1,
      eventTypeMultiplier: 1,
      complexityMultiplier: 1,
      seasonalMultiplier: 1,
      dayMultiplier: 1,
      addOns: []
    }
  });

  const [allPackagesPricing, setAllPackagesPricing] = useState<PricingComparison | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  // Calculate pricing whenever relevant form data changes
  useEffect(() => {
    const calculatePricing = async () => {
      setIsCalculating(true);
      
      try {
        // Calculate current package pricing
        if (formData.selectedPackage) {
          const currentPricing = calculatePackagePricing(formData);
          setPricing(currentPricing);
        }

        // Calculate all packages pricing for comparison
        if (formData.guestCount && formData.eventType) {
          const allPricing = calculateAllPackagesPricing(formData);
          setAllPackagesPricing(allPricing as PricingComparison);
        }
      } catch (error) {
        console.error('Error calculating pricing:', error);
      } finally {
        setIsCalculating(false);
      }
    };

    calculatePricing();
  }, [
    formData.selectedPackage,
    formData.addOns,
    formData.guestCount,
    formData.eventType,
    formData.eventDate,
    formData.audioNeeds,
    formData.visualNeeds,
    formData.lightingNeeds
  ]);

  // Get recommended package based on requirements
  const recommendedPackage = useMemo(() => {
    if (!formData.guestCount || !formData.audioNeeds || !formData.visualNeeds || !formData.lightingNeeds) {
      return null;
    }
    
    return getPricingRecommendation(
      formData.guestCount,
      formData.audioNeeds,
      formData.visualNeeds,
      formData.lightingNeeds
    );
  }, [formData.guestCount, formData.audioNeeds, formData.visualNeeds, formData.lightingNeeds]);

  // Get pricing multipliers breakdown
  const multipliers = useMemo(() => {
    return {
      guest: getGuestCountMultiplier(formData.guestCount),
      eventType: getEventTypeMultiplier(formData.eventType),
      complexity: getComplexityMultiplier(formData.audioNeeds, formData.visualNeeds, formData.lightingNeeds),
      seasonal: getSeasonalMultiplier(formData.eventDate),
      dayOfWeek: getDayOfWeekMultiplier(formData.eventDate)
    };
  }, [formData]);

  // Calculate potential savings
  const calculateSavings = useCallback((packageId: string) => {
    if (!allPackagesPricing) return 0;
    
    const packagePricing = allPackagesPricing[packageId as keyof PricingComparison];
    if (!packagePricing) return 0;
    
    // Calculate individual equipment cost
    const pkg = packages[packageId];
    if (!pkg) return 0;
    
    // Estimate individual rental costs (this would be more sophisticated in a real app)
    const individualCost = packagePricing.subtotal * 1.3; // Assume 30% markup for individual rentals
    const savings = individualCost - packagePricing.total;
    
    return Math.max(0, savings);
  }, [allPackagesPricing]);

  // Get price comparison with other packages
  const getPriceComparison = useCallback(() => {
    if (!allPackagesPricing || !formData.selectedPackage) return null;
    
    const currentPrice = pricing.total;
    const allPrices = Object.values(allPackagesPricing).map(p => p.total);
    const minPrice = Math.min(...allPrices);
    const maxPrice = Math.max(...allPrices);
    const avgPrice = allPrices.reduce((sum, price) => sum + price, 0) / allPrices.length;
    
    return {
      current: currentPrice,
      min: minPrice,
      max: maxPrice,
      average: avgPrice,
      isLowest: currentPrice === minPrice,
      isHighest: currentPrice === maxPrice,
      percentageFromAverage: ((currentPrice - avgPrice) / avgPrice) * 100,
      savings: calculateSavings(formData.selectedPackage)
    };
  }, [allPackagesPricing, formData.selectedPackage, pricing.total, calculateSavings]);

  // Get budget range for the event
  const getBudgetRange = useCallback(() => {
    if (!allPackagesPricing) return null;
    
    const prices = Object.values(allPackagesPricing).map(p => p.total);
    return {
      min: Math.min(...prices),
      max: Math.max(...prices),
      recommended: recommendedPackage ? allPackagesPricing[recommendedPackage]?.total : null
    };
  }, [allPackagesPricing, recommendedPackage]);

  // Format pricing for display
  const formatPricing = useCallback((amount: number) => {
    return formatPrice(amount);
  }, []);

  // Get add-on details with pricing
  const getAddOnDetails = useCallback(() => {
    return formData.addOns.map(addOnId => {
      const addOn = addOns.find(a => a.id === addOnId);
      return addOn ? {
        ...addOn,
        formattedPrice: formatPrice(addOn.price)
      } : null;
    }).filter(Boolean);
  }, [formData.addOns]);

  // Check if package is suitable for guest count
  const isPackageSuitable = useCallback((packageId: string) => {
    const pkg = packages[packageId];
    const guestCount = parseInt(formData.guestCount) || 0;
    return pkg ? guestCount <= pkg.maxGuests : false;
  }, [formData.guestCount]);

  // Get pricing alerts/warnings
  const getPricingAlerts = useCallback(() => {
    const alerts = [];
    
    // High guest count warning
    const guestCount = parseInt(formData.guestCount) || 0;
    if (guestCount > 500) {
      alerts.push({
        type: 'warning',
        message: 'Large events may require custom pricing. Contact us for a detailed quote.'
      });
    }
    
    // Peak season notice
    if (multipliers.seasonal > 1) {
      alerts.push({
        type: 'info',
        message: 'Peak season pricing applies to your event date.'
      });
    }
    
    // Weekend premium notice
    if (multipliers.dayOfWeek > 1) {
      alerts.push({
        type: 'info',
        message: 'Weekend premium pricing applies to your event.'
      });
    }
    
    // Package suitability warning
    if (formData.selectedPackage && !isPackageSuitable(formData.selectedPackage)) {
      alerts.push({
        type: 'warning',
        message: 'Selected package may not be suitable for your guest count. Consider upgrading.'
      });
    }
    
    return alerts;
  }, [multipliers, formData.selectedPackage, isPackageSuitable, formData.guestCount]);

  return {
    // Current pricing
    pricing,
    allPackagesPricing,
    isCalculating,
    
    // Recommendations
    recommendedPackage,
    
    // Analysis
    multipliers,
    priceComparison: getPriceComparison(),
    budgetRange: getBudgetRange(),
    
    // Utilities
    formatPricing,
    getAddOnDetails,
    isPackageSuitable,
    calculateSavings,
    getPricingAlerts,
    
    // Raw data access
    packages,
    addOns
  };
};
