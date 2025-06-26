import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft, Download, Share2, Mic, Monitor, Lightbulb, Users, Calendar, MapPin, DollarSign, Check, Info } from 'lucide-react';

const AVPlannerTool = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    eventName: '',
    eventDate: '',
    location: '',
    guestCount: '',
    eventType: '',
    audioNeeds: '',
    visualNeeds: '',
    lightingNeeds: '',
    specialRequests: '',
    selectedPackage: '',
    addOns: []
  });

  const [pricing, setPricing] = useState({
    subtotal: 0,
    addOnsTotal: 0,
    total: 0
  });

  const steps = [
    'Welcome',
    'Event Basics',
    'Event Type',
    'AV Requirements',
    'Package Selection',
    'Customization',
    'Summary'
  ];

  const packages = {
    essential: {
      name: 'Essential',
      basePrice: 500,
      description: 'Perfect for small gatherings and basic presentations',
      features: [
        'Basic wireless microphone',
        'Single 65" display screen',
        'Basic lighting setup',
        'Audio mixing board',
        'Technical support'
      ],
      icon: '🎤',
      maxGuests: 50
    },
    recommended: {
      name: 'Recommended',
      basePrice: 1200,
      description: 'Ideal for professional events and conferences',
      features: [
        'Professional wireless mic system',
        'Dual screen setup with projector',
        'Stage lighting package',
        'Live streaming capability',
        'On-site technician',
        'Recording equipment'
      ],
      icon: '🎬',
      maxGuests: 200,
      popular: true
    },
    premium: {
      name: 'Premium',
      basePrice: 2500,
      description: 'Full-service production for large-scale events',
      features: [
        'Complete sound system with mixing',
        'LED wall or multiple large screens',
        'Professional stage lighting',
        'Multi-camera live streaming',
        'Dedicated production team',
        'Custom branding integration',
        'Backup equipment included'
      ],
      icon: '🏆',
      maxGuests: 500
    }
  };

  const addOns = [
    { id: 'extra-mics', name: 'Additional Wireless Microphones', price: 75 },
    { id: 'recording', name: 'Professional Recording Service', price: 300 },
    { id: 'live-stream', name: 'Enhanced Live Streaming', price: 400 },
    { id: 'lighting-upgrade', name: 'Premium Lighting Package', price: 250 },
    { id: 'backdrop', name: 'Custom Branded Backdrop', price: 150 },
    { id: 'photo-booth', name: 'Interactive Photo Booth', price: 500 }
  ];

  useEffect(() => {
    calculatePricing();
  }, [formData.selectedPackage, formData.addOns, formData.guestCount]);

  const calculatePricing = () => {
    let subtotal = 0;
    let addOnsTotal = 0;

    if (formData.selectedPackage && packages[formData.selectedPackage]) {
      subtotal = packages[formData.selectedPackage].basePrice;
      
      // Adjust price based on guest count
      const guestCount = parseInt(formData.guestCount) || 0;
      if (guestCount > 100) {
        subtotal *= 1.3;
      } else if (guestCount > 50) {
        subtotal *= 1.15;
      }
    }

    // Calculate add-ons
    formData.addOns.forEach(addOnId => {
      const addOn = addOns.find(a => a.id === addOnId);
      if (addOn) {
        addOnsTotal += addOn.price;
      }
    });

    setPricing({
      subtotal: Math.round(subtotal),
      addOnsTotal,
      total: Math.round(subtotal + addOnsTotal)
    });
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddOnToggle = (addOnId) => {
    setFormData(prev => ({
      ...prev,
      addOns: prev.addOns.includes(addOnId)
        ? prev.addOns.filter(id => id !== addOnId)
        : [...prev.addOns, addOnId]
    }));
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.eventName && formData.eventDate && formData.location && formData.guestCount;
      case 2:
        return formData.eventType;
      case 3:
        return formData.audioNeeds && formData.visualNeeds && formData.lightingNeeds;
      case 4:
        return formData.selectedPackage;
      default:
        return true;
    }
  };

  const generatePDF = () => {
    alert('PDF generation would be implemented here with a library like jsPDF or Puppeteer');
  };

  const shareQuote = () => {
    alert('Share functionality would open email/social sharing options');
  };

  const Tooltip = ({ children, content }) => (
    <div className="relative group">
      {children}
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
        {content}
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
      </div>
    </div>
  );

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="text-center space-y-6">
            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-3xl text-white">
              🎬
            </div>
            <h2 className="text-3xl font-bold text-gray-800">Welcome to AV Planner</h2>
            <p className="text-lg text-gray-600 max-w-md mx-auto">
              Let's create the perfect audiovisual setup for your event. This will take about 3-5 minutes.
            </p>
            <div className="grid grid-cols-3 gap-4 max-w-md mx-auto text-sm text-gray-500">
              <div className="text-center">
                <Users className="w-6 h-6 mx-auto mb-2 text-blue-500" />
                <span>Event Details</span>
              </div>
              <div className="text-center">
                <Monitor className="w-6 h-6 mx-auto mb-2 text-blue-500" />
                <span>AV Needs</span>
              </div>
              <div className="text-center">
                <DollarSign className="w-6 h-6 mx-auto mb-2 text-blue-500" />
                <span>Get Quote</span>
              </div>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 text-center">Event Basics</h2>
            <div className="grid gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Event Name</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Annual Company Conference"
                  value={formData.eventName}
                  onChange={(e) => handleInputChange('eventName', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Event Date</label>
                <input
                  type="date"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.eventDate}
                  onChange={(e) => handleInputChange('eventDate', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Downtown Convention Center"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Expected Number of Guests</label>
                <input
                  type="number"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., 150"
                  value={formData.guestCount}
                  onChange={(e) => handleInputChange('guestCount', e.target.value)}
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 text-center">Event Type</h2>
            <p className="text-gray-600 text-center">What type of event are you planning?</p>
            <div className="grid gap-4">
              {[
                { value: 'in-person', label: 'In-Person Only', icon: '👥', desc: 'Traditional event with physical attendance' },
                { value: 'virtual', label: 'Virtual Only', icon: '💻', desc: 'Online event with remote participation' },
                { value: 'hybrid', label: 'Hybrid Event', icon: '🌐', desc: 'Combination of in-person and virtual attendees' }
              ].map((option) => (
                <div
                  key={option.value}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                    formData.eventType === option.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handleInputChange('eventType', option.value)}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{option.icon}</span>
                    <div>
                      <div className="font-semibold text-gray-800">{option.label}</div>
                      <div className="text-sm text-gray-600">{option.desc}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 text-center">AV Requirements</h2>
            <div className="space-y-6">
              <div>
                <div className="flex items-center space-x-2 mb-3">
                  <Mic className="w-5 h-5 text-blue-500" />
                  <label className="block text-sm font-medium text-gray-700">Audio Needs</label>
                  <Tooltip content="Sound equipment for speakers, microphones, and music">
                    <Info className="w-4 h-4 text-gray-400" />
                  </Tooltip>
                </div>
                <select
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.audioNeeds}
                  onChange={(e) => handleInputChange('audioNeeds', e.target.value)}
                >
                  <option value="">Select audio requirements</option>
                  <option value="basic">Basic (1-2 mics, background music)</option>
                  <option value="standard">Standard (Multiple mics, full sound system)</option>
                  <option value="advanced">Advanced (Professional mixing, live band support)</option>
                </select>
              </div>

              <div>
                <div className="flex items-center space-x-2 mb-3">
                  <Monitor className="w-5 h-5 text-blue-500" />
                  <label className="block text-sm font-medium text-gray-700">Visual Needs</label>
                  <Tooltip content="Screens, projectors, and display equipment">
                    <Info className="w-4 h-4 text-gray-400" />
                  </Tooltip>
                </div>
                <select
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.visualNeeds}
                  onChange={(e) => handleInputChange('visualNeeds', e.target.value)}
                >
                  <option value="">Select visual requirements</option>
                  <option value="basic">Basic (Single screen/projector)</option>
                  <option value="standard">Standard (Multiple screens, presentation setup)</option>
                  <option value="advanced">Advanced (LED walls, multi-camera setup)</option>
                </select>
              </div>

              <div>
                <div className="flex items-center space-x-2 mb-3">
                  <Lightbulb className="w-5 h-5 text-blue-500" />
                  <label className="block text-sm font-medium text-gray-700">Lighting Needs</label>
                  <Tooltip content="Stage lighting, ambient lighting, and special effects">
                    <Info className="w-4 h-4 text-gray-400" />
                  </Tooltip>
                </div>
                <select
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.lightingNeeds}
                  onChange={(e) => handleInputChange('lightingNeeds', e.target.value)}
                >
                  <option value="">Select lighting requirements</option>
                  <option value="basic">Basic (Standard venue lighting)</option>
                  <option value="standard">Standard (Stage lighting, spotlights)</option>
                  <option value="advanced">Advanced (Color-changing, effects, full production)</option>
                </select>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 text-center">Choose Your Package</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {Object.entries(packages).map(([key, pkg]) => (
                <div
                  key={key}
                  className={`relative p-6 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                    formData.selectedPackage === key
                      ? 'border-blue-500 bg-blue-50 shadow-lg'
                      : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                  }`}
                  onClick={() => handleInputChange('selectedPackage', key)}
                >
                  {pkg.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </div>
                  )}
                  <div className="text-center mb-4">
                    <div className="text-4xl mb-2">{pkg.icon}</div>
                    <h3 className="text-xl font-bold text-gray-800">{pkg.name}</h3>
                    <p className="text-gray-600 text-sm mt-1">{pkg.description}</p>
                  </div>
                  <div className="text-center mb-4">
                    <span className="text-3xl font-bold text-gray-800">${pkg.basePrice.toLocaleString()}</span>
                    <span className="text-gray-500 text-sm"> starting</span>
                  </div>
                  <ul className="space-y-2 mb-4">
                    {pkg.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-sm text-gray-600">
                        <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <div className="text-center text-sm text-gray-500">
                    Perfect for up to {pkg.maxGuests} guests
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 text-center">Customize Your Package</h2>
            <p className="text-gray-600 text-center">Add optional services to enhance your event</p>
            
            <div className="grid md:grid-cols-2 gap-4">
              {addOns.map((addOn) => (
                <div
                  key={addOn.id}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                    formData.addOns.includes(addOn.id)
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handleAddOnToggle(addOn.id)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-800">{addOn.name}</h4>
                      <p className="text-lg font-bold text-blue-600">+${addOn.price}</p>
                    </div>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      formData.addOns.includes(addOn.id)
                        ? 'border-blue-500 bg-blue-500'
                        : 'border-gray-300'
                    }`}>
                      {formData.addOns.includes(addOn.id) && (
                        <Check className="w-4 h-4 text-white" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Special Requests or Notes</label>
              <textarea
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows="3"
                placeholder="Any specific requirements or questions?"
                value={formData.specialRequests}
                onChange={(e) => handleInputChange('specialRequests', e.target.value)}
              />
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 text-center">Your AV Quote Summary</h2>
            
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-xl">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-bold text-gray-800 mb-3">Event Details</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 text-gray-500 mr-2" />
                      <span className="font-medium">{formData.eventName}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 text-gray-500 mr-2" />
                      <span>{formData.eventDate}</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 text-gray-500 mr-2" />
                      <span>{formData.location}</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="w-4 h-4 text-gray-500 mr-2" />
                      <span>{formData.guestCount} guests</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-bold text-gray-800 mb-3">Selected Package</h3>
                  {formData.selectedPackage && (
                    <div className="bg-white p-4 rounded-lg">
                      <div className="flex items-center mb-2">
                        <span className="text-2xl mr-2">{packages[formData.selectedPackage].icon}</span>
                        <span className="font-semibold">{packages[formData.selectedPackage].name}</span>
                      </div>
                      <div className="text-sm text-gray-600 mb-2">
                        {packages[formData.selectedPackage].description}
                      </div>
                      <div className="text-lg font-bold text-blue-600">
                        ${pricing.subtotal.toLocaleString()}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {formData.addOns.length > 0 && (
              <div className="bg-white p-6 rounded-xl border border-gray-200">
                <h3 className="font-bold text-gray-800 mb-3">Add-ons</h3>
                <div className="space-y-2">
                  {formData.addOns.map(addOnId => {
                    const addOn = addOns.find(a => a.id === addOnId);
                    return (
                      <div key={addOnId} className="flex justify-between items-center text-sm">
                        <span>{addOn.name}</span>
                        <span className="font-semibold">${addOn.price}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-xl">
              <div className="flex justify-between items-center mb-2">
                <span className="text-lg">Package Subtotal:</span>
                <span className="text-lg">${pricing.subtotal.toLocaleString()}</span>
              </div>
              {pricing.addOnsTotal > 0 && (
                <div className="flex justify-between items-center mb-2">
                  <span className="text-lg">Add-ons:</span>
                  <span className="text-lg">${pricing.addOnsTotal.toLocaleString()}</span>
                </div>
              )}
              <div className="border-t border-white/20 pt-2">
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold">Total:</span>
                  <span className="text-3xl font-bold">${pricing.total.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {formData.specialRequests && (
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <h4 className="font-semibold text-gray-800 mb-2">Special Requests:</h4>
                <p className="text-sm text-gray-700">{formData.specialRequests}</p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={generatePDF}
                className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center"
              >
                <Download className="w-5 h-5 mr-2" />
                Download PDF Quote
              </button>
              <button
                onClick={shareQuote}
                className="flex-1 bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors duration-200 flex items-center justify-center"
              >
                <Share2 className="w-5 h-5 mr-2" />
                Share Quote
              </button>
            </div>

            <div className="text-center">
              <button className="bg-green-600 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-green-700 transition-colors duration-200">
                📞 Book a Consultation Call
              </button>
              <p className="text-sm text-gray-600 mt-2">
                Ready to move forward? Let's discuss your event in detail!
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">
              Step {currentStep + 1} of {steps.length}
            </span>
            <span className="text-sm font-medium text-gray-600">
              {Math.round(((currentStep + 1) / steps.length) * 100)}% Complete
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            ></div>
          </div>
          <div className="flex justify-between mt-2">
            {steps.map((step, index) => (
              <span
                key={index}
                className={`text-xs ${
                  index <= currentStep ? 'text-blue-600 font-medium' : 'text-gray-400'
                }`}
              >
                {step}
              </span>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          {renderStep()}
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <button
            onClick={prevStep}
            disabled={currentStep === 0}
            className={`flex items-center px-6 py-3 rounded-lg font-semibold transition-colors duration-200 ${
              currentStep === 0
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <ChevronLeft className="w-5 h-5 mr-2" />
            Previous
          </button>

          {/* Pricing Display (visible from step 4 onwards) */}
          {currentStep >= 4 && pricing.total > 0 && (
            <div className="hidden sm:flex items-center bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg">
              <DollarSign className="w-5 h-5 mr-2" />
              <span className="font-bold text-lg">${pricing.total.toLocaleString()}</span>
            </div>
          )}

          {currentStep < steps.length - 1 ? (
            <button
              onClick={nextStep}
              disabled={!canProceed()}
              className={`flex items-center px-6 py-3 rounded-lg font-semibold transition-colors duration-200 ${
                canProceed()
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              Next
              <ChevronRight className="w-5 h-5 ml-2" />
            </button>
          ) : (
            <button
              onClick={() => setCurrentStep(0)}
              className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-green-700 hover:to-blue-700 transition-colors duration-200"
            >
              Start New Quote
            </button>
          )}
        </div>

        {/* Mobile Pricing Display */}
        {currentStep >= 4 && pricing.total > 0 && (
          <div className="sm:hidden mt-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-lg text-center">
            <div className="flex items-center justify-center">
              <DollarSign className="w-6 h-6 mr-2" />
              <span className="font-bold text-xl">${pricing.total.toLocaleString()}</span>
            </div>
            <span className="text-sm opacity-90">Current Quote Total</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default AVPlannerTool;