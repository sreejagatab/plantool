import React from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, MapPin, Users, Download, Share2, Phone, 
  Mail, CheckCircle, Star, Clock, Shield 
} from 'lucide-react';
import { packages, addOns } from '../../data/packages';
import { formatPrice } from '../../data/pricing';

const SummaryStep = ({ formData, pricing, onReset }) => {
  const selectedPackage = packages[formData.selectedPackage];

  const generatePDF = () => {
    // This would integrate with a PDF generation library
    alert('PDF generation would be implemented here with jsPDF or similar library');
  };

  const shareQuote = () => {
    // This would open sharing options
    alert('Share functionality would open email/social sharing options');
  };

  const bookConsultation = () => {
    // This would open booking modal or redirect to booking page
    alert('Booking consultation would open scheduling interface');
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
        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center">
          <CheckCircle className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Your AV Quote Summary</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Here's your complete audiovisual package quote. Ready to make your event amazing!
        </p>
      </motion.div>

      {/* Event Details Card */}
      <motion.div variants={itemVariants} className="max-w-4xl mx-auto">
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Event Details</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5 text-blue-500" />
                <div>
                  <span className="font-medium text-gray-800">{formData.eventName}</span>
                  <p className="text-sm text-gray-600">{formData.eventDate}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-blue-500" />
                <span className="text-gray-700">{formData.location}</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Users className="w-5 h-5 text-blue-500" />
                <span className="text-gray-700">{formData.guestCount} guests</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="w-5 h-5 text-center text-blue-500">🎭</span>
                <span className="text-gray-700 capitalize">{formData.eventType} event</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Package Details */}
      <motion.div variants={itemVariants} className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Selected Package</h3>
          {selectedPackage && (
            <div className="flex items-start space-x-4">
              <div className="text-4xl">{selectedPackage.icon}</div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-lg font-semibold text-gray-800">{selectedPackage.name}</h4>
                  <span className="text-2xl font-bold text-blue-600">{formatPrice(pricing.subtotal)}</span>
                </div>
                <p className="text-gray-600 mb-4">{selectedPackage.description}</p>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="font-medium text-gray-700 mb-2">Package Features:</h5>
                    <ul className="space-y-1">
                      {selectedPackage.features.slice(0, 4).map((feature, index) => (
                        <li key={index} className="text-sm text-gray-600 flex items-start">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-medium text-gray-700 mb-2">Service Details:</h5>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock className="w-4 h-4 mr-2" />
                        <span>{selectedPackage.duration} event coverage</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Shield className="w-4 h-4 mr-2" />
                        <span>Professional technical support</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Users className="w-4 h-4 mr-2" />
                        <span>Up to {selectedPackage.maxGuests} guests</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Add-ons */}
      {formData.addOns.length > 0 && (
        <motion.div variants={itemVariants} className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Selected Add-ons</h3>
            <div className="space-y-3">
              {formData.addOns.map(addOnId => {
                const addOn = addOns.find(a => a.id === addOnId);
                return addOn ? (
                  <div key={addOnId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <span className="font-medium text-gray-800">{addOn.name}</span>
                      <p className="text-sm text-gray-600">{addOn.description}</p>
                    </div>
                    <span className="font-semibold text-blue-600">{formatPrice(addOn.price)}</span>
                  </div>
                ) : null;
              })}
            </div>
          </div>
        </motion.div>
      )}

      {/* Special Requests */}
      {formData.specialRequests && (
        <motion.div variants={itemVariants} className="max-w-4xl mx-auto">
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
            <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
              <Star className="w-5 h-5 text-yellow-500 mr-2" />
              Special Requests
            </h4>
            <p className="text-gray-700">{formData.specialRequests}</p>
          </div>
        </motion.div>
      )}

      {/* Pricing Summary */}
      <motion.div variants={itemVariants} className="max-w-4xl mx-auto">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl p-6">
          <h3 className="text-xl font-bold mb-4">Quote Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-lg">Package Subtotal:</span>
              <span className="text-lg font-semibold">{formatPrice(pricing.subtotal)}</span>
            </div>
            {pricing.addOnsTotal > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-lg">Add-ons Total:</span>
                <span className="text-lg font-semibold">{formatPrice(pricing.addOnsTotal)}</span>
              </div>
            )}
            <div className="border-t border-white/20 pt-3">
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold">Total Investment:</span>
                <span className="text-3xl font-bold">{formatPrice(pricing.total)}</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Action Buttons */}
      <motion.div variants={itemVariants} className="max-w-4xl mx-auto">
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <motion.button
            onClick={generatePDF}
            className="flex items-center justify-center bg-blue-600 text-white px-6 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Download className="w-5 h-5 mr-2" />
            Download PDF Quote
          </motion.button>
          <motion.button
            onClick={shareQuote}
            className="flex items-center justify-center bg-purple-600 text-white px-6 py-4 rounded-lg font-semibold hover:bg-purple-700 transition-colors duration-200"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Share2 className="w-5 h-5 mr-2" />
            Share Quote
          </motion.button>
        </div>

        {/* Primary CTA */}
        <div className="text-center">
          <motion.button
            onClick={bookConsultation}
            className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-8 py-4 rounded-lg font-bold text-lg hover:from-green-700 hover:to-blue-700 transition-colors duration-200 shadow-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Phone className="w-6 h-6 mr-2 inline" />
            Book a Consultation Call
          </motion.button>
          <p className="text-sm text-gray-600 mt-3">
            Ready to move forward? Let's discuss your event in detail!
          </p>
          
          <div className="mt-4 flex items-center justify-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center">
              <Mail className="w-4 h-4 mr-1" />
              <span>info@avplanner.com</span>
            </div>
            <div className="flex items-center">
              <Phone className="w-4 h-4 mr-1" />
              <span>(555) 123-4567</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Progress Indicator */}
      <motion.div variants={itemVariants} className="text-center">
        <div className="inline-flex items-center space-x-2 text-sm text-gray-500">
          <div className="w-2 h-2 bg-green-600 rounded-full"></div>
          <span>Complete - Your quote is ready!</span>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SummaryStep;
