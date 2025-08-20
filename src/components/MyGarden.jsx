import React, { useState } from 'react';
import { 
  Flower2, 
  Trash2, 
  Edit, 
  Droplets, 
  Sprout, 
  Scissors, 
  Calendar,
  Plus,
  Search,
  Filter,
  Grid3X3,
  List
} from 'lucide-react';
import { useGarden } from '../contexts/GardenContext';

const MyGarden = ({ isOpen, onClose }) => {
  const { 
    plants, 
    removePlant, 
    updatePlant, 
    getTotalPlants, 
    getHealthyPlants, 
    getPlantsNeedingCare 
  } = useGarden();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [editingPlant, setEditingPlant] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);

  if (!isOpen) return null;

  const filteredPlants = plants.filter(plant => {
    const matchesSearch = plant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         plant.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || 
                         (filterType === 'healthy' && !plant.healthInfo?.diseases?.length) ||
                         (filterType === 'needsCare' && getPlantsNeedingCare().includes(plant));
    return matchesSearch && matchesFilter;
  });

  const handleRemovePlant = (plantId) => {
    if (window.confirm('Are you sure you want to remove this plant from your garden?')) {
      removePlant(plantId);
    }
  };

  const handleUpdatePlant = (plantId, updates) => {
    updatePlant(plantId, updates);
    setEditingPlant(null);
  };

  const markCareAsDone = (plantId, careType) => {
    const now = new Date().toISOString();
    updatePlant(plantId, { [`last${careType}`]: now });
  };

  const getCareStatus = (plant, careType) => {
    const lastDone = plant[`last${careType}`];
    if (!lastDone) return 'never';
    
    const daysSince = Math.floor((new Date() - new Date(lastDone)) / (1000 * 60 * 60 * 24));
    if (daysSince === 0) return 'today';
    if (daysSince === 1) return 'yesterday';
    if (daysSince < 7) return `${daysSince} days ago`;
    return `${daysSince} days ago`;
  };

  const getCareIcon = (careType) => {
    switch (careType) {
      case 'Watered': return <Droplets className="w-4 h-4" />;
      case 'Fertilized': return <Sprout className="w-4 h-4" />;
      case 'Pruned': return <Scissors className="w-4 h-4" />;
      default: return <Calendar className="w-4 h-4" />;
    }
  };

  const PlantCard = ({ plant }) => (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
      {/* Plant Image */}
      <div className="h-48 bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center">
        {plant.image ? (
          <img 
            src={plant.image} 
            alt={plant.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <Flower2 className="w-16 h-8 text-green-600" />
        )}
      </div>

      {/* Plant Info */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="font-semibold text-lg text-gray-800 mb-1">{plant.name}</h3>
            <p className="text-sm text-gray-600 italic">{plant.type}</p>
          </div>
          <div className="flex space-x-1">
            <button
              onClick={() => setEditingPlant(plant)}
              className="p-1 text-blue-600 hover:bg-blue-100 rounded transition-colors"
              title="Edit plant"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleRemovePlant(plant.id)}
              className="p-1 text-red-600 hover:bg-red-100 rounded transition-colors"
              title="Remove plant"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Care Tips */}
        <div className="mb-4">
          <p className="text-sm text-gray-700 line-clamp-3">
            {plant.careTips.length > 150 
              ? `${plant.careTips.substring(0, 150)}...` 
              : plant.careTips
            }
          </p>
        </div>

        {/* Care Actions */}
        <div className="space-y-2">
          {['Watered', 'Fertilized', 'Pruned'].map(careType => (
            <div key={careType} className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                {getCareIcon(careType)}
                <span className="capitalize">{careType.toLowerCase()}</span>
                <span className="text-xs text-gray-500">
                  {getCareStatus(plant, careType)}
                </span>
              </div>
              <button
                onClick={() => markCareAsDone(plant.id, careType)}
                className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded-full hover:bg-green-200 transition-colors"
              >
                Mark Done
              </button>
            </div>
          ))}
        </div>

        {/* Health Status */}
        {plant.healthInfo?.diseases?.length > 0 && (
          <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-xs text-red-700 font-medium">
              ⚠️ {plant.healthInfo.diseases.length} health issue(s) detected
            </p>
          </div>
        )}

        {/* Added Date */}
        <div className="mt-3 pt-3 border-t border-gray-100">
          <p className="text-xs text-gray-500">
            Added {new Date(plant.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );

  const PlantList = ({ plant }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center space-x-4">
        {/* Plant Image */}
        <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
          {plant.image ? (
            <img 
              src={plant.image} 
              alt={plant.name}
              className="w-full h-full object-cover rounded-lg"
            />
          ) : (
            <Flower2 className="w-8 h-4 text-green-600" />
          )}
        </div>

        {/* Plant Info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-800 mb-1">{plant.name}</h3>
          <p className="text-sm text-gray-600 italic mb-2">{plant.type}</p>
          <p className="text-sm text-gray-700 line-clamp-2">{plant.careTips}</p>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2 flex-shrink-0">
          <button
            onClick={() => setEditingPlant(plant)}
            className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleRemovePlant(plant.id)}
            className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-7xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Flower2 className="w-8 h-8" />
              <div>
                <h2 className="text-2xl font-bold">My Garden</h2>
                <p className="text-green-100">
                  {getTotalPlants()} plant{getTotalPlants() !== 1 ? 's' : ''} • 
                  {getHealthyPlants().length} healthy • 
                  {getPlantsNeedingCare().length} need care
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6 max-h-[calc(90vh-120px)] overflow-y-auto">
          {/* Controls */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search plants..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            {/* Filter */}
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="all">All Plants</option>
              <option value="healthy">Healthy Only</option>
              <option value="needsCare">Needs Care</option>
            </select>

            {/* View Mode */}
            <div className="flex border border-gray-300 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-green-500 text-white' : 'bg-white text-gray-600'}`}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-green-500 text-white' : 'bg-white text-gray-600'}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Plants Grid/List */}
          {filteredPlants.length === 0 ? (
            <div className="text-center py-16 text-gray-500">
              <Flower2 className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="font-medium text-lg mb-2">
                {plants.length === 0 ? 'Your garden is empty' : 'No plants found'}
              </h3>
              <p className="text-sm">
                {plants.length === 0 
                  ? 'Analyze a plant to add it to your garden!' 
                  : 'Try adjusting your search or filters'
                }
              </p>
            </div>
          ) : (
            <div className={viewMode === 'grid' 
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
              : 'space-y-4'
            }>
              {filteredPlants.map(plant => (
                viewMode === 'grid' ? (
                  <PlantCard key={plant.id} plant={plant} />
                ) : (
                  <PlantList key={plant.id} plant={plant} />
                )
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyGarden;
