import React from 'react';
import { motion } from 'framer-motion';
import { Users, Monitor, DollarSign, Clock, CheckCircle, Star } from 'lucide-react';

const WelcomeStep = ({ onNext }) => {
  const features = [
    {
      icon: Users,
      title: 'Event Details',
      description: 'Tell us about your event requirements'
    },
    {
      icon: Monitor,
      title: 'AV Needs',
      description: 'Select the perfect audiovisual setup'
    },
    {
      icon: DollarSign,
      title: 'Get Quote',
      description: 'Receive instant pricing and recommendations'
    }
  ];

  const benefits = [
    'Professional equipment from trusted brands',
    'Expert technical support included',
    'Flexible packages for any budget',
    'Setup and breakdown included',
    'Instant quote generation',
    'No hidden fees or surprises'
  ];

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
      className="text-center space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Hero Section */}
      <motion.div variants={itemVariants} className="space-y-6">
        <div className="w-20 h-20 mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-3xl text-white shadow-lg">
          🎬
        </div>
        
        <div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Welcome to AV Planner
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Create the perfect audiovisual setup for your event in just a few minutes. 
            Get professional equipment recommendations and instant pricing.
          </p>
        </div>
      </motion.div>

      {/* Process Overview */}
      <motion.div variants={itemVariants} className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            className="bg-gray-50 rounded-xl p-6 hover:bg-gray-100 transition-colors duration-200"
            whileHover={{ y: -5 }}
            transition={{ duration: 0.2 }}
          >
            <div className="w-12 h-12 mx-auto mb-4 bg-blue-100 rounded-lg flex items-center justify-center">
              <feature.icon className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              {feature.title}
            </h3>
            <p className="text-gray-600 text-sm">
              {feature.description}
            </p>
          </motion.div>
        ))}
      </motion.div>

      {/* Benefits Section */}
      <motion.div variants={itemVariants} className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-6">
          Why Choose Our AV Planning Service?
        </h3>
        
        <div className="grid md:grid-cols-2 gap-4 max-w-2xl mx-auto">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              className="flex items-center space-x-3 text-left"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
            >
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
              <span className="text-gray-700">{benefit}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Time Estimate */}
      <motion.div variants={itemVariants} className="flex items-center justify-center space-x-2 text-gray-600">
        <Clock className="w-5 h-5" />
        <span className="text-sm">
          Takes about 3-5 minutes to complete
        </span>
      </motion.div>

      {/* Social Proof */}
      <motion.div variants={itemVariants} className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex items-center justify-center space-x-1 mb-3">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
          ))}
        </div>
        <p className="text-gray-600 text-sm mb-2">
          "The AV Planner made our event planning so much easier. Professional equipment and excellent support!"
        </p>
        <p className="text-gray-500 text-xs">
          - Sarah Johnson, Event Coordinator
        </p>
      </motion.div>

      {/* CTA Button */}
      <motion.div variants={itemVariants}>
        <motion.button
          onClick={onNext}
          className="btn-primary text-lg px-8 py-4"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Get Started - It's Free!
        </motion.button>
        <p className="text-xs text-gray-500 mt-2">
          No credit card required • Instant results
        </p>
      </motion.div>
    </motion.div>
  );
};

export default WelcomeStep;
