// Package definitions with equipment bundles and pricing
export const packages = {
  essential: {
    id: 'essential',
    name: 'Essential',
    basePrice: 500,
    description: 'Perfect for small gatherings and basic presentations',
    tagline: 'Everything you need to get started',
    icon: '🎤',
    color: 'blue',
    maxGuests: 50,
    duration: '4 hours',
    features: [
      'Basic wireless microphone',
      'Single 65" 4K display screen',
      'Basic LED stage lighting',
      'Audio mixing board',
      'Technical support during event',
      'Setup and breakdown included'
    ],
    equipment: {
      audio: 'basic',
      visual: 'basic',
      lighting: 'basic'
    },
    included: [
      'On-site technical support',
      'Equipment setup and breakdown',
      'Basic troubleshooting',
      'Power and cable management'
    ],
    addOns: [
      'extra-mics',
      'recording',
      'backdrop'
    ],
    suitableFor: [
      'Small meetings (10-50 people)',
      'Basic presentations',
      'Workshop sessions',
      'Small corporate events',
      'Training sessions'
    ]
  },

  recommended: {
    id: 'recommended',
    name: 'Recommended',
    basePrice: 1200,
    description: 'Ideal for professional events and conferences',
    tagline: 'Professional quality for serious events',
    icon: '🎬',
    color: 'purple',
    maxGuests: 200,
    duration: '6 hours',
    popular: true,
    features: [
      'Professional wireless mic system',
      'Dual screen setup with projector',
      'Professional stage lighting package',
      'Live streaming capability',
      'On-site technician',
      'Recording equipment included',
      'Wireless presentation system'
    ],
    equipment: {
      audio: 'standard',
      visual: 'standard',
      lighting: 'standard',
      streaming: 'basic'
    },
    included: [
      'Dedicated on-site technician',
      'Professional equipment setup',
      'Live streaming to one platform',
      'Basic recording service',
      'Wireless presentation capability',
      'Technical rehearsal time'
    ],
    addOns: [
      'extra-mics',
      'recording',
      'live-stream',
      'lighting-upgrade',
      'backdrop',
      'photo-booth'
    ],
    suitableFor: [
      'Corporate conferences (50-200 people)',
      'Professional seminars',
      'Product launches',
      'Hybrid events',
      'Awards ceremonies'
    ]
  },

  premium: {
    id: 'premium',
    name: 'Premium',
    basePrice: 2500,
    description: 'Full-service production for large-scale events',
    tagline: 'Broadcast-quality production experience',
    icon: '🏆',
    color: 'gold',
    maxGuests: 500,
    duration: '8 hours',
    features: [
      'Complete professional sound system',
      'LED wall or multiple large screens',
      'Full production lighting with effects',
      'Multi-camera live streaming',
      'Dedicated production team',
      'Custom branding integration',
      'Backup equipment included',
      'Professional recording service'
    ],
    equipment: {
      audio: 'premium',
      visual: 'premium',
      lighting: 'premium',
      streaming: 'standard'
    },
    included: [
      'Dedicated production team (3+ technicians)',
      'Professional multi-camera setup',
      'Custom graphics and branding',
      'Multi-platform live streaming',
      'Professional recording and editing',
      'Full technical rehearsal',
      'Backup equipment systems',
      'Post-event video delivery'
    ],
    addOns: [
      'extra-mics',
      'recording',
      'live-stream',
      'lighting-upgrade',
      'backdrop',
      'photo-booth'
    ],
    suitableFor: [
      'Large conferences (200-500 people)',
      'Corporate galas',
      'Product launches',
      'Broadcast events',
      'Major presentations',
      'Award shows'
    ]
  }
};

// Add-on services available for all packages
export const addOns = [
  {
    id: 'extra-mics',
    name: 'Additional Wireless Microphones',
    price: 75,
    description: 'Extra wireless microphones for panel discussions or Q&A sessions',
    icon: 'mic-plus',
    category: 'audio',
    quantity: 'per microphone'
  },
  {
    id: 'recording',
    name: 'Professional Recording Service',
    price: 300,
    description: 'Multi-camera recording with professional editing and delivery',
    icon: 'video-camera',
    category: 'video',
    deliverables: ['Raw footage', 'Edited highlights', 'Full event recording']
  },
  {
    id: 'live-stream',
    name: 'Enhanced Live Streaming',
    price: 400,
    description: 'Multi-platform streaming with graphics overlay and chat moderation',
    icon: 'broadcast',
    category: 'streaming',
    platforms: ['YouTube', 'Facebook', 'LinkedIn', 'Custom RTMP']
  },
  {
    id: 'lighting-upgrade',
    name: 'Premium Lighting Package',
    price: 250,
    description: 'Advanced lighting effects with color mixing and intelligent fixtures',
    icon: 'spotlight',
    category: 'lighting',
    features: ['Moving head lights', 'Color mixing', 'Fog effects', 'Custom programming']
  },
  {
    id: 'backdrop',
    name: 'Custom Branded Backdrop',
    price: 150,
    description: 'Professional backdrop with your branding and messaging',
    icon: 'image',
    category: 'branding',
    options: ['Step-and-repeat', 'Fabric backdrop', 'LED backdrop']
  },
  {
    id: 'photo-booth',
    name: 'Interactive Photo Booth',
    price: 500,
    description: 'Professional photo booth with props and instant sharing',
    icon: 'camera',
    category: 'entertainment',
    includes: ['Professional camera', 'Props collection', 'Instant printing', 'Digital sharing']
  }
];

// Helper functions
export const getPackageById = (id) => {
  return packages[id] || null;
};

export const getAddOnById = (id) => {
  return addOns.find(addon => addon.id === id) || null;
};

export const getPackagesByGuestCount = (guestCount) => {
  const count = parseInt(guestCount) || 0;
  return Object.values(packages).filter(pkg => pkg.maxGuests >= count);
};

export const getRecommendedPackage = (guestCount) => {
  const count = parseInt(guestCount) || 0;
  
  if (count <= 50) return packages.essential;
  if (count <= 200) return packages.recommended;
  return packages.premium;
};

// Package comparison helper
export const comparePackages = () => {
  return Object.values(packages).map(pkg => ({
    id: pkg.id,
    name: pkg.name,
    basePrice: pkg.basePrice,
    maxGuests: pkg.maxGuests,
    features: pkg.features,
    popular: pkg.popular || false
  }));
};
