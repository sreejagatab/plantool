// Equipment database with detailed specifications and pricing
export const equipment = {
  audio: {
    basic: {
      id: 'audio-basic',
      name: 'Wireless Lapel Microphone',
      price: 75,
      icon: 'mic',
      description: 'Professional wireless lapel microphone with clear audio transmission',
      specifications: [
        'Wireless range up to 100ft',
        'Battery life: 8+ hours',
        'Clear digital audio',
        'Easy clip-on design'
      ],
      suitableFor: ['presentations', 'speeches', 'interviews'],
      maxGuests: 50
    },
    standard: {
      id: 'audio-standard',
      name: 'Handheld Wireless Microphone System',
      price: 100,
      icon: 'mic-2',
      description: 'Professional handheld wireless microphone with mixing capabilities',
      specifications: [
        'Dual-channel receiver',
        'Professional-grade audio quality',
        'Anti-feedback technology',
        'Multiple frequency options'
      ],
      suitableFor: ['conferences', 'events', 'Q&A sessions'],
      maxGuests: 200
    },
    premium: {
      id: 'audio-premium',
      name: 'Professional Audio System',
      price: 200,
      icon: 'mic-premium',
      description: 'Complete professional audio system with mixing board and multiple inputs',
      specifications: [
        'Multi-channel mixing board',
        'Multiple wireless microphones',
        'Professional speakers',
        'Audio recording capability',
        'Live streaming audio feed'
      ],
      suitableFor: ['large events', 'concerts', 'conferences'],
      maxGuests: 500
    }
  },
  
  visual: {
    basic: {
      id: 'visual-basic',
      name: '65" 4K Display Screen',
      price: 150,
      icon: 'monitor',
      description: 'High-quality 65-inch 4K display perfect for presentations',
      specifications: [
        '65" 4K Ultra HD display',
        'Multiple input options (HDMI, USB-C)',
        'Wireless screen mirroring',
        'Professional mounting stand'
      ],
      suitableFor: ['small meetings', 'presentations', 'workshops'],
      maxGuests: 50
    },
    standard: {
      id: 'visual-standard',
      name: 'Projector & Screen Setup',
      price: 250,
      icon: 'projector',
      description: 'Professional projector with large screen for medium-sized venues',
      specifications: [
        '4000+ lumens brightness',
        '120" projection screen',
        'Wireless presentation capability',
        'Multiple device connectivity'
      ],
      suitableFor: ['conferences', 'training sessions', 'seminars'],
      maxGuests: 200
    },
    premium: {
      id: 'visual-premium',
      name: 'LED Wall Display System',
      price: 500,
      icon: 'led-wall',
      description: 'Modular LED wall system for stunning visual presentations',
      specifications: [
        'Modular LED panels',
        'Ultra-high resolution',
        'Seamless panel connections',
        'Custom sizing options',
        'Professional video processing'
      ],
      suitableFor: ['large events', 'trade shows', 'concerts'],
      maxGuests: 500
    }
  },
  
  lighting: {
    basic: {
      id: 'lighting-basic',
      name: 'Basic Stage Lighting',
      price: 100,
      icon: 'lightbulb',
      description: 'Essential lighting setup for basic stage illumination',
      specifications: [
        'LED stage lights',
        'Basic color options',
        'Simple control system',
        'Energy efficient'
      ],
      suitableFor: ['small events', 'presentations', 'meetings'],
      maxGuests: 50
    },
    standard: {
      id: 'lighting-standard',
      name: 'Professional Stage Lighting',
      price: 200,
      icon: 'spotlight',
      description: 'Professional lighting package with color mixing and effects',
      specifications: [
        'RGB LED fixtures',
        'DMX control system',
        'Multiple lighting zones',
        'Color mixing capabilities',
        'Pre-programmed scenes'
      ],
      suitableFor: ['conferences', 'events', 'performances'],
      maxGuests: 200
    },
    premium: {
      id: 'lighting-premium',
      name: 'Full Production Lighting',
      price: 400,
      icon: 'stage-lights',
      description: 'Complete lighting production with effects and professional control',
      specifications: [
        'Moving head fixtures',
        'Professional lighting console',
        'Haze/fog machines',
        'Intelligent lighting effects',
        'Custom programming',
        'Backup systems'
      ],
      suitableFor: ['large productions', 'concerts', 'galas'],
      maxGuests: 500
    }
  },
  
  streaming: {
    basic: {
      id: 'streaming-basic',
      name: 'Basic Live Streaming',
      price: 200,
      icon: 'video',
      description: 'Simple live streaming setup for online audiences',
      specifications: [
        'Single camera setup',
        'Basic streaming encoder',
        'Audio feed integration',
        'Platform streaming (YouTube, Facebook)'
      ],
      suitableFor: ['webinars', 'small events', 'presentations'],
      maxGuests: 100
    },
    standard: {
      id: 'streaming-standard',
      name: 'Professional Live Streaming',
      price: 400,
      icon: 'broadcast',
      description: 'Multi-camera streaming with professional switching',
      specifications: [
        'Multi-camera setup',
        'Professional video switcher',
        'Graphics overlay capability',
        'Multiple platform streaming',
        'Recording capability'
      ],
      suitableFor: ['conferences', 'hybrid events', 'webinars'],
      maxGuests: 300
    },
    premium: {
      id: 'streaming-premium',
      name: 'Broadcast Quality Streaming',
      price: 800,
      icon: 'tv',
      description: 'Broadcast-quality streaming with full production capabilities',
      specifications: [
        'Multiple professional cameras',
        'Broadcast-quality switcher',
        'Professional graphics package',
        'Multi-platform distribution',
        'Live editing capabilities',
        'Dedicated streaming team'
      ],
      suitableFor: ['large events', 'broadcasts', 'productions'],
      maxGuests: 1000
    }
  }
};

// Equipment categories for easy filtering
export const equipmentCategories = {
  audio: {
    name: 'Audio Equipment',
    icon: 'mic',
    description: 'Microphones, speakers, and sound systems'
  },
  visual: {
    name: 'Visual Equipment',
    icon: 'monitor',
    description: 'Screens, projectors, and display systems'
  },
  lighting: {
    name: 'Lighting Equipment',
    icon: 'lightbulb',
    description: 'Stage lighting and illumination systems'
  },
  streaming: {
    name: 'Streaming Equipment',
    icon: 'video',
    description: 'Live streaming and recording equipment'
  }
};

// Helper function to get equipment by category and tier
export const getEquipmentByTier = (category, tier) => {
  return equipment[category]?.[tier] || null;
};

// Helper function to get all equipment in a category
export const getEquipmentByCategory = (category) => {
  return equipment[category] || {};
};

// Helper function to find equipment by ID
export const getEquipmentById = (id) => {
  for (const category of Object.values(equipment)) {
    for (const item of Object.values(category)) {
      if (item.id === id) {
        return item;
      }
    }
  }
  return null;
};
