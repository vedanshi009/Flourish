import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Bell, 
  Droplets, 
  Sprout, 
  Scissors, 
  Plus, 
  X, 
  Edit, 
  Trash2, 
  CheckCircle2,
  AlertCircle,
  Clock
} from 'lucide-react';
import { useGarden } from '../contexts/GardenContext'; 

// Care Scheduler Component
const CareScheduler = ({ isOpen, onClose, plantInfo = null }) => {
  // All state management is handled by the GardenContext
  const { schedules, addSchedule, updateSchedule, deleteSchedule, markScheduleAsDone } = useGarden();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    type: 'watering',
    plantName: plantInfo?.name || 'My Plant',
    frequency: 7,
    lastDone: new Date().toISOString().split('T')[0],
    notes: ''
  });


  //useEffect helps to pre-fill the form if a plant is passed in
  useEffect(() => {
    if (plantInfo?.name) {
      setFormData(prev => ({ ...prev, plantName: plantInfo.name }));
    }
  }, [plantInfo]);

  // Request notification permission on component mount
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  const careTypes = [
    { value: 'watering', label: 'Watering', icon: Droplets, color: 'blue' },
    { value: 'fertilizing', label: 'Fertilizing', icon: Sprout, color: 'green' },
    { value: 'pruning', label: 'Pruning', icon: Scissors, color: 'purple' },
    { value: 'repotting', label: 'Repotting', icon: Calendar, color: 'orange' }
  ];

  const calculateNextDue = (lastDone, frequency) => {
    const last = new Date(lastDone);
    const next = new Date(last);
    next.setDate(last.getDate() + frequency);
    return next;
  };

  const getDaysUntilDue = (lastDone, frequency) => {
    const nextDue = calculateNextDue(lastDone, frequency);
    const today = new Date();
    const diffTime = nextDue - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const scheduleNotification = (schedule) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      const nextDue = calculateNextDue(schedule.lastDone, schedule.frequency);
      const now = new Date();
      const timeDiff = nextDue.getTime() - now.getTime();
      if (timeDiff > 0) {
        setTimeout(() => {
          new Notification(`🌱 Plant Care Reminder`, {
            body: `Time to ${schedule.type} your ${schedule.plantName}!`,
            icon: '/plant-icon.png'
          });
        }, timeDiff);
      }
    }
  };

  const handleSubmit = () => {
    if (editingId) {
      updateSchedule({ id: editingId, ...formData });
      setEditingId(null);
    } else {
      addSchedule(formData);
    }
    scheduleNotification(formData); // Schedule notification for the new/updated task
    resetForm();
  };
  
  const resetForm = () => {
    setFormData({
      type: 'watering',
      plantName: plantInfo?.name || 'My Plant',
      frequency: 7,
      lastDone: new Date().toISOString().split('T')[0],
      notes: ''
    });
    setShowAddForm(false);
    setEditingId(null);
  };

  const startEditing = (schedule) => {
    setFormData(schedule);
    setEditingId(schedule.id);
    setShowAddForm(true);
  };
  
  if (!isOpen) return null;

  //onClick handlers now use context functions
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      {/* DARK MODE STYLES */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {}
        <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-6 text-white"><div className="flex items-center justify-between"><div className="flex items-center space-x-3"><Calendar className="w-8 h-8" /><div><h2 className="text-2xl font-bold">Care Scheduler</h2><p className="text-green-100">Never miss plant care again!</p></div></div><button onClick={onClose} className="w-10 h-10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"><X className="w-6 h-6" /></button></div></div>

        <div className="p-6 max-h-[calc(90vh-120px)] overflow-y-auto">
          {/* ... "Add New" Button and Form JSX */}
          <button onClick={() => setShowAddForm(!showAddForm)} className="w-full mb-6 p-4 border-2 border-dashed border-green-300 dark:border-green-700 hover:border-green-400 rounded-xl flex items-center justify-center space-x-2 text-green-600 dark:text-green-400 hover:text-green-700 transition-colors"><Plus className="w-5 h-5" /><span className="font-medium">Add New Care Schedule</span></button>
          {showAddForm && (<div className="bg-green-50 dark:bg-gray-900 rounded-xl p-6 mb-6 border border-green-200 dark:border-green-800"><h3 className="font-semibold text-lg mb-4 text-green-800 dark:text-green-200">{editingId ? 'Edit Schedule' : 'Create New Schedule'}</h3><div className="space-y-4"><div className="grid grid-cols-2 gap-4"><div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Care Type</label><select value={formData.type} onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))} className="w-full p-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">{careTypes.map(type => (<option key={type.value} value={type.value}>{type.label}</option>))}</select></div><div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Plant Name</label><input type="text" value={formData.plantName} onChange={(e) => setFormData(prev => ({ ...prev, plantName: e.target.value }))} className="w-full p-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" placeholder="My Plant" /></div></div><div className="grid grid-cols-2 gap-4"><div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Frequency (days)</label><input type="number" value={formData.frequency} onChange={(e) => setFormData(prev => ({ ...prev, frequency: parseInt(e.target.value) }))} className="w-full p-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" min="1" /></div><div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Last Done</label><input type="date" value={formData.lastDone} onChange={(e) => setFormData(prev => ({ ...prev, lastDone: e.target.value }))} className="w-full p-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" /></div></div><div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Notes (optional)</label><textarea value={formData.notes} onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))} className="w-full p-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" rows="2" placeholder="Special instructions or notes..." /></div><div className="flex space-x-3"><button onClick={handleSubmit} className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-medium transition-colors">{editingId ? 'Update Schedule' : 'Create Schedule'}</button><button onClick={resetForm} className="px-6 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-200 py-3 rounded-lg font-medium transition-colors">Cancel</button></div></div></div>)}

          {/* Schedules List */}
          <div className="space-y-4">
            {schedules.length === 0 ? (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400"><Calendar className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" /><h3 className="font-medium text-lg mb-2">No schedules yet</h3><p className="text-sm">Create your first care schedule to get started!</p></div>
            ) : (
              schedules.map(schedule => {
                const CareIcon = careTypes.find(t => t.value === schedule.type)?.icon || Calendar;
                const daysUntil = getDaysUntilDue(schedule.lastDone, schedule.frequency);
                const isOverdue = daysUntil < 0;
                const isDueToday = daysUntil === 0;
                
                return (
                  // ADDED DARK MODE STYLES
                  <div key={schedule.id} className={`bg-white dark:bg-gray-700/50 border-2 rounded-xl p-4 transition-colors ${ isOverdue ? 'border-red-200 dark:border-red-500/30 bg-red-50 dark:bg-red-500/10' : isDueToday ? 'border-orange-200 dark:border-orange-500/30 bg-orange-50 dark:bg-orange-500/10' : 'border-gray-200 dark:border-gray-600' }`}>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <div className={`p-2 rounded-lg ${ isOverdue ? 'bg-red-100 text-red-600' : isDueToday ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-600' }`}>
                          <CareIcon className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          {/* ADDED DARK MODE STYLES */}
                          <h4 className="font-semibold text-lg text-gray-800 dark:text-gray-200 capitalize">{schedule.type} - {schedule.plantName}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Every {schedule.frequency} days</p>
                          {schedule.notes && (<p className="text-sm text-gray-500 dark:text-gray-400 italic">{schedule.notes}</p>)}
                          <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
                            <span>Last done: {new Date(schedule.lastDone).toLocaleDateString()}</span>
                            <span className={`font-medium ${ isOverdue ? 'text-red-600' : isDueToday ? 'text-orange-600' : 'text-green-600' }`}>
                              {isOverdue ? `Overdue by ${Math.abs(daysUntil)} days` : isDueToday ? 'Due today!' : `Due in ${daysUntil} days`}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {/* UPDATED onClick handlers */}
                        <button onClick={() => markScheduleAsDone(schedule.id)} className="p-2 text-green-600 hover:bg-green-100 dark:hover:bg-green-900/50 rounded-lg transition-colors" title="Mark as done"><CheckCircle2 className="w-5 h-5" /></button>
                        <button onClick={() => startEditing(schedule)} className="p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-lg transition-colors" title="Edit"><Edit className="w-5 h-5" /></button>
                        <button onClick={() => deleteSchedule(schedule.id)} className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-lg transition-colors" title="Delete"><Trash2 className="w-5 h-5" /></button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CareScheduler;