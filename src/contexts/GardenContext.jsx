import React, { createContext, useContext, useState, useEffect } from 'react';

const GardenContext = createContext();

export const useGarden = () => {
  const context = useContext(GardenContext);
  if (!context) {
    throw new Error('useGarden must be used within a GardenProvider');
  }
  return context;
};

export const GardenProvider = ({ children }) => {
  const [plants, setPlants] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load plants from localStorage on component mount
  useEffect(() => {
    const savedPlants = localStorage.getItem('gardenPlants');
    if (savedPlants) {
      try {
        setPlants(JSON.parse(savedPlants));
      } catch (error) {
        console.error('Error loading garden plants:', error);
        setPlants([]);
      }
    }
  }, []);

  // Save plants to localStorage whenever plants change
  useEffect(() => {
    localStorage.setItem('gardenPlants', JSON.stringify(plants));
  }, [plants]);

  const addPlant = (plantData) => {
    const newPlant = {
      id: Date.now().toString(),
      name: plantData.name || 'Unknown Plant',
      image: plantData.image || null,
      type: plantData.scientificName || plantData.name || 'Unknown',
      careTips: plantData.advice || 'No care tips available',
      createdAt: new Date().toISOString(),
      plantInfo: plantData.plantInfo || {},
      healthInfo: plantData.healthInfo || {},
      lastWatered: null,
      lastFertilized: null,
      lastPruned: null
    };

    setPlants(prev => [newPlant, ...prev]);
    return newPlant;
  };

  const removePlant = (plantId) => {
    setPlants(prev => prev.filter(plant => plant.id !== plantId));
  };

  const updatePlant = (plantId, updates) => {
    setPlants(prev => prev.map(plant => 
      plant.id === plantId ? { ...plant, ...updates } : plant
    ));
  };

  const getPlantById = (plantId) => {
    return plants.find(plant => plant.id === plantId);
  };

  const getPlantsByType = (type) => {
    return plants.filter(plant => plant.type.toLowerCase().includes(type.toLowerCase()));
  };

  const getTotalPlants = () => plants.length;

  const getHealthyPlants = () => plants.filter(plant => 
    !plant.healthInfo?.diseases || plant.healthInfo.diseases.length === 0
  );

  const getPlantsNeedingCare = () => {
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    return plants.filter(plant => {
      const lastWatered = plant.lastWatered ? new Date(plant.lastWatered) : null;
      return !lastWatered || lastWatered < oneWeekAgo;
    });
  };

  const value = {
    plants,
    isLoading,
    addPlant,
    removePlant,
    updatePlant,
    getPlantById,
    getPlantsByType,
    getTotalPlants,
    getHealthyPlants,
    getPlantsNeedingCare
  };

  return (
    <GardenContext.Provider value={value}>
      {children}
    </GardenContext.Provider>
  );
};
