import React, { useState } from 'react';
import { Flower2, Trash2, Edit, Plus, X } from 'lucide-react';
import { useGarden } from '../contexts/GardenContext';
import ManualPlantForm from './ManualPlantForm'; // Uses the unified form

const MyGarden = ({ isOpen, onClose }) => {
  const { plants, removePlant, addPlant } = useGarden();
  const [showManualForm, setShowManualForm] = useState(false);

  const handleAddPlant = (formData) => {
    const plantData = {
      id: `manual_${Date.now()}`,
      name: formData.commonName,
      scientificName: formData.scientificName || formData.commonName,
      type: formData.scientificName || formData.commonName,
      careTips: formData.notes || 'Manually added plant.',
      createdAt: new Date().toISOString(),
    };
    addPlant(plantData);
    setShowManualForm(false); // Close form on submit
  };
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-6 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Flower2 className="w-8 h-8" />
            <h2 className="text-2xl font-bold">My Garden ({plants.length})</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 flex-1 overflow-y-auto">
          <div className="flex justify-end mb-4">
            <button
              onClick={() => setShowManualForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Plant
            </button>
          </div>
          
          {plants.length === 0 ? (
            <div className="text-center py-16 text-gray-500">
              <h3 className="text-lg">Your garden is empty.</h3>
              <p>Add a plant to get started!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {plants.map(plant => (
                <div key={plant.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border dark:border-gray-600">
                   <div className="h-40 bg-gray-200 dark:bg-gray-600 rounded-md mb-2 flex items-center justify-center">
                      {plant.image ? <img src={plant.image} alt={plant.name} className="w-full h-full object-cover rounded-md"/> : <Flower2 className="w-12 h-12 text-gray-400"/>}
                   </div>
                   <h3 className="font-bold text-gray-800 dark:text-white">{plant.name}</h3>
                   <p className="text-sm text-gray-500 dark:text-gray-400 italic">{plant.scientificName}</p>
                   <button onClick={() => removePlant(plant.id)} className="text-red-500 hover:text-red-700 text-xs mt-2">Remove</button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <ManualPlantForm 
        isOpen={showManualForm}
        onClose={() => setShowManualForm(false)}
        onSubmit={handleAddPlant}
      />
    </div>
  );
};

export default MyGarden;
