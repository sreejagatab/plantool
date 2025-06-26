import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Monitor, Lightbulb, Video, Eye, EyeOff, Info } from 'lucide-react';
import { equipment, equipmentCategories } from '../../data/equipment';
import { packages } from '../../data/packages';

interface EquipmentVisualizerProps {
  selectedPackage?: string;
  audioNeeds?: string;
  visualNeeds?: string;
  lightingNeeds?: string;
  className?: string;
}

const EquipmentVisualizer: React.FC<EquipmentVisualizerProps> = ({
  selectedPackage,
  audioNeeds,
  visualNeeds,
  lightingNeeds,
  className = ''
}) => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  const getEquipmentForPackage = () => {
    if (!selectedPackage || !packages[selectedPackage]) return null;
    
    const pkg = packages[selectedPackage];
    return {
      audio: equipment.audio[pkg.equipment.audio as keyof typeof equipment.audio],
      visual: equipment.visual[pkg.equipment.visual as keyof typeof equipment.visual],
      lighting: equipment.lighting[pkg.equipment.lighting as keyof typeof equipment.lighting],
      streaming: pkg.equipment.streaming ? equipment.streaming[pkg.equipment.streaming as keyof typeof equipment.streaming] : null
    };
  };

  const getEquipmentByNeeds = () => {
    return {
      audio: audioNeeds ? equipment.audio[audioNeeds as keyof typeof equipment.audio] : null,
      visual: visualNeeds ? equipment.visual[visualNeeds as keyof typeof equipment.visual] : null,
      lighting: lightingNeeds ? equipment.lighting[lightingNeeds as keyof typeof equipment.lighting] : null
    };
  };

  const equipmentData = selectedPackage ? getEquipmentForPackage() : getEquipmentByNeeds();

  if (!equipmentData) {
    return (
      <div className={`bg-gray-50 rounded-lg p-6 text-center ${className}`}>
        <div className="text-4xl mb-3">🎬</div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Equipment Preview</h3>
        <p className="text-gray-600 text-sm">
          Select your AV requirements to see equipment recommendations
        </p>
      </div>
    );
  }

  const getCategoryIcon = (category: string) => {
    const icons = {
      audio: Mic,
      visual: Monitor,
      lighting: Lightbulb,
      streaming: Video
    };
    return icons[category as keyof typeof icons] || Info;
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      audio: 'blue',
      visual: 'green',
      lighting: 'yellow',
      streaming: 'purple'
    };
    return colors[category as keyof typeof colors] || 'gray';
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
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      className={`bg-white rounded-xl border border-gray-200 p-6 ${className}`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Eye className="w-4 h-4 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800">Equipment Preview</h3>
        </div>
        
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm font-medium"
        >
          {showDetails ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          <span>{showDetails ? 'Hide' : 'Show'} Details</span>
        </button>
      </div>

      {/* Equipment Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {Object.entries(equipmentData).map(([category, item]) => {
          if (!item) return null;
          
          const IconComponent = getCategoryIcon(category);
          const color = getCategoryColor(category);
          const isActive = activeCategory === category;

          return (
            <motion.div
              key={category}
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                isActive
                  ? `border-${color}-500 bg-${color}-50`
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              variants={itemVariants}
              onClick={() => setActiveCategory(isActive ? null : category)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center space-x-3 mb-3">
                <div className={`w-10 h-10 rounded-lg bg-${color}-100 flex items-center justify-center`}>
                  <IconComponent className={`w-5 h-5 text-${color}-600`} />
                </div>
                <div>
                  <h4 className="font-medium text-gray-800 text-sm">{equipmentCategories[category as keyof typeof equipmentCategories]?.name}</h4>
                  <p className="text-xs text-gray-500 capitalize">{category} equipment</p>
                </div>
              </div>
              
              <div className="mb-3">
                <h5 className="font-semibold text-gray-800 text-sm mb-1">{item.name}</h5>
                <p className="text-xs text-gray-600">{item.description}</p>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-blue-600">
                  ${item.price}/day
                </span>
                <span className="text-xs text-gray-500">
                  Up to {item.maxGuests} guests
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Active Equipment Details */}
      <AnimatePresence>
        {activeCategory && equipmentData[activeCategory as keyof typeof equipmentData] && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="border-t border-gray-200 pt-4"
          >
            {(() => {
              const item = equipmentData[activeCategory as keyof typeof equipmentData];
              if (!item) return null;
              
              return (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-3">{item.name} - Specifications</h4>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h5 className="font-medium text-gray-700 mb-2">Technical Specs:</h5>
                      <ul className="space-y-1">
                        {item.specifications.map((spec: string, index: number) => (
                          <li key={index} className="text-sm text-gray-600 flex items-start">
                            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                            {spec}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h5 className="font-medium text-gray-700 mb-2">Suitable For:</h5>
                      <div className="flex flex-wrap gap-1">
                        {item.suitableFor.map((use: string, index: number) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                          >
                            {use}
                          </span>
                        ))}
                      </div>
                      
                      <div className="mt-3 text-sm text-gray-600">
                        <span className="font-medium">Capacity:</span> Up to {item.maxGuests} guests
                      </div>
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">Daily Rate:</span> ${item.price}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Equipment Summary */}
      {showDetails && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="border-t border-gray-200 pt-4 mt-4"
        >
          <h4 className="font-medium text-gray-800 mb-3">Equipment Summary</h4>
          
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4">
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <h5 className="font-medium text-gray-700 mb-2">Included Equipment:</h5>
                <ul className="space-y-1">
                  {Object.entries(equipmentData).map(([category, item]) => {
                    if (!item) return null;
                    return (
                      <li key={category} className="text-gray-600">
                        • {item.name}
                      </li>
                    );
                  })}
                </ul>
              </div>
              
              <div>
                <h5 className="font-medium text-gray-700 mb-2">Total Value:</h5>
                <div className="text-2xl font-bold text-blue-600">
                  ${Object.values(equipmentData).reduce((total, item) => {
                    return total + (item ? item.price : 0);
                  }, 0)}
                  <span className="text-sm font-normal text-gray-500">/day</span>
                </div>
                <p className="text-xs text-gray-600 mt-1">
                  Individual equipment rental value
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default EquipmentVisualizer;
