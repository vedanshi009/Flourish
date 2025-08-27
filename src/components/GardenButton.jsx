import React, { useState } from 'react';
import { Flower2 } from 'lucide-react';
import MyGarden from './MyGarden';
import { useGarden } from '../contexts/GardenContext';

const GardenButton = () => {
  const [isGardenOpen, setIsGardenOpen] = useState(false);
  const { getTotalPlants, getPlantsNeedingCare } = useGarden();

  const totalPlants = getTotalPlants();
  const plantsNeedingCareCount = getPlantsNeedingCare().length;

  return (
    <>
      <button
        onClick={() => setIsGardenOpen(true)}
        className="fixed top-6 right-6 z-40 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-4 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center space-x-2 group"
      >
        <Flower2 className="w-5 h-5" />
        <span className="font-medium">My Garden</span>
        {plantsNeedingCareCount > 0 ? (
          // 1. If plants need care, show the urgent orange badge.
          <span className="bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full min-w-[24px] text-center animate-pulse">
            {plantsNeedingCareCount}
          </span>
        ) : totalPlants > 0 ? (
          // 2. Otherwise, if there are any plants, show the standard white badge.
          <span className="bg-white text-green-600 text-xs font-bold px-2 py-1 rounded-full min-w-[24px] text-center">
            {totalPlants}
          </span>
        ) : null} 
        {/* 3. If neither condition is met, show nothing. */}

      </button>

      <MyGarden 
        isOpen={isGardenOpen} 
        onClose={() => setIsGardenOpen(false)} 
      />
    </>
  );
};

export default GardenButton;
