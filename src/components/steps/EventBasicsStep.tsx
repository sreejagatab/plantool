import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Users, Type, AlertCircle } from 'lucide-react';

const EventBasicsStep = ({ formData, onInputChange }) => {
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validateField = (field, value) => {
    const newErrors = { ...errors };

    switch (field) {
      case 'eventName':
        if (!value.trim()) {
          newErrors.eventName = 'Event name is required';
        } else if (value.trim().length < 3) {
          newErrors.eventName = 'Event name must be at least 3 characters';
        } else {
          delete newErrors.eventName;
        }
        break;

      case 'eventDate':
        if (!value) {
          newErrors.eventDate = 'Event date is required';
        } else {
          const selectedDate = new Date(value);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          
          if (selectedDate < today) {
            newErrors.eventDate = 'Event date cannot be in the past';
          } else {
            delete newErrors.eventDate;
          }
        }
        break;

      case 'location':
        if (!value.trim()) {
          newErrors.location = 'Event location is required';
        } else if (value.trim().length < 3) {
          newErrors.location = 'Location must be at least 3 characters';
        } else {
          delete newErrors.location;
        }
        break;

      case 'guestCount':
        const count = parseInt(value);
        if (!value) {
          newErrors.guestCount = 'Guest count is required';
        } else if (isNaN(count) || count < 1) {
          newErrors.guestCount = 'Please enter a valid number of guests';
        } else if (count > 1000) {
          newErrors.guestCount = 'For events over 1000 guests, please contact us directly';
        } else {
          delete newErrors.guestCount;
        }
        break;

      default:
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    onInputChange(field, value);
    
    if (touched[field]) {
      validateField(field, value);
    }
  };

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    validateField(field, formData[field]);
  };

  const getGuestCountSuggestion = (count) => {
    const num = parseInt(count);
    if (num <= 50) return 'Perfect for intimate gatherings and small meetings';
    if (num <= 200) return 'Great for conferences and professional events';
    if (num <= 500) return 'Ideal for large-scale events and productions';
    return 'Large venue events require custom solutions';
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <motion.div
      className="space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants} className="text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Event Basics</h2>
        <p className="text-gray-600">
          Tell us about your event so we can recommend the perfect AV setup
        </p>
      </motion.div>

      <motion.div variants={itemVariants} className="grid gap-6 max-w-2xl mx-auto">
        {/* Event Name */}
        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
            <Type className="w-4 h-4 mr-2 text-blue-500" />
            Event Name *
          </label>
          <input
            type="text"
            className={`input-field ${errors.eventName ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''}`}
            placeholder="e.g., Annual Company Conference"
            value={formData.eventName}
            onChange={(e) => handleInputChange('eventName', e.target.value)}
            onBlur={() => handleBlur('eventName')}
          />
          {errors.eventName && (
            <motion.div
              className="flex items-center mt-1 text-sm text-red-600"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <AlertCircle className="w-4 h-4 mr-1" />
              {errors.eventName}
            </motion.div>
          )}
        </div>

        {/* Event Date */}
        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
            <Calendar className="w-4 h-4 mr-2 text-blue-500" />
            Event Date *
          </label>
          <input
            type="date"
            className={`input-field ${errors.eventDate ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''}`}
            value={formData.eventDate}
            onChange={(e) => handleInputChange('eventDate', e.target.value)}
            onBlur={() => handleBlur('eventDate')}
            min={new Date().toISOString().split('T')[0]}
          />
          {errors.eventDate && (
            <motion.div
              className="flex items-center mt-1 text-sm text-red-600"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <AlertCircle className="w-4 h-4 mr-1" />
              {errors.eventDate}
            </motion.div>
          )}
        </div>

        {/* Location */}
        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
            <MapPin className="w-4 h-4 mr-2 text-blue-500" />
            Event Location *
          </label>
          <input
            type="text"
            className={`input-field ${errors.location ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''}`}
            placeholder="e.g., Downtown Convention Center, Hotel Ballroom"
            value={formData.location}
            onChange={(e) => handleInputChange('location', e.target.value)}
            onBlur={() => handleBlur('location')}
          />
          {errors.location && (
            <motion.div
              className="flex items-center mt-1 text-sm text-red-600"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <AlertCircle className="w-4 h-4 mr-1" />
              {errors.location}
            </motion.div>
          )}
        </div>

        {/* Guest Count */}
        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
            <Users className="w-4 h-4 mr-2 text-blue-500" />
            Expected Number of Guests *
          </label>
          <input
            type="number"
            className={`input-field ${errors.guestCount ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''}`}
            placeholder="e.g., 150"
            value={formData.guestCount}
            onChange={(e) => handleInputChange('guestCount', e.target.value)}
            onBlur={() => handleBlur('guestCount')}
            min="1"
            max="1000"
          />
          {errors.guestCount && (
            <motion.div
              className="flex items-center mt-1 text-sm text-red-600"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <AlertCircle className="w-4 h-4 mr-1" />
              {errors.guestCount}
            </motion.div>
          )}
          {formData.guestCount && !errors.guestCount && (
            <motion.div
              className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <p className="text-sm text-blue-700">
                {getGuestCountSuggestion(formData.guestCount)}
              </p>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Progress Indicator */}
      <motion.div variants={itemVariants} className="text-center">
        <div className="inline-flex items-center space-x-2 text-sm text-gray-500">
          <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
          <span>Step 1 of 6 - Event Information</span>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default EventBasicsStep;
