export interface Package {
  name: string;
  basePrice: number;
  description: string;
  tagline: string;
  icon: string;
  color: string;
  maxGuests: number;
  duration: string;
  popular?: boolean;
  features: string[];
  included: string[];
  suitableFor: string[];
  equipment: {
    audio: string;
    visual: string;
    lighting: string;
    streaming?: string;
  };
}

export interface AddOn {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  features?: string[];
  deliverables?: string[];
  platforms?: string[];
  options?: string[];
  includes?: string[];
  quantity?: string;
}

export declare const packages: Record<string, Package>;
export declare const addOns: AddOn[];
