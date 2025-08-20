import React, { useState, useEffect } from 'react';
import { Calendar, Bell, Droplets, Sprout, Scissors } from 'lucide-react';
import CareScheduler from './CareScheduler';

const CareSchedulerButton = ({ plantInfo = null }) => {
  const [showScheduler, setShowScheduler] = useState(false);
  const [schedules, setSchedules] = useState([]);
  const [urgentTasks, setUrgentTasks] = useState(0);

  // Load schedules from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('plantCareSchedules');
    if (saved) {
      const parsedSchedules = JSON.parse(saved);
      setSchedules(parsedSchedules);
      
      // Calculate urgent tasks (overdue or due today)
      const urgent = parsedSchedules.filter(schedule => {
        const lastDone = new Date(schedule.lastDone);
        const nextDue = new Date(lastDone);
        nextDue.setDate(lastDone.getDate() + schedule.frequency);
        const today = new Date();
        const diffTime = nextDue - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays <= 0; // Overdue or due today
      }).length;
      
      setUrgentTasks(urgent);
    }
  }, []);

  // Listen for storage changes (when schedules are updated in another component)
  useEffect(() => {
    const handleStorageChange = () => {
      const saved = localStorage.getItem('plantCareSchedules');
      if (saved) {
        const parsedSchedules = JSON.parse(saved);
        setSchedules(parsedSchedules);
        
        const urgent = parsedSchedules.filter(schedule => {
          const lastDone = new Date(schedule.lastDone);
          const nextDue = new Date(lastDone);
          nextDue.setDate(lastDone.getDate() + schedule.frequency);
          const today = new Date();
          const diffTime = nextDue - today;
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          return diffDays <= 0;
        }).length;
        
        setUrgentTasks(urgent);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const getNextDueTask = () => {
    if (schedules.length === 0) return null;
    
    const now = new Date();
    let nextTask = null;
    let earliestDate = null;
    
    schedules.forEach(schedule => {
      const lastDone = new Date(schedule.lastDone);
      const nextDue = new Date(lastDone);
      nextDue.setDate(lastDone.getDate() + schedule.frequency);
      
      if (nextDue > now && (!earliestDate || nextDue < earliestDate)) {
        earliestDate = nextDue;
        nextTask = schedule;
      }
    });
    
    return nextTask;
  };

  const nextTask = getNextDueTask();

  return (
    <>
      {/* Care Scheduler Button */}
      <div className="bg-white rounded-2xl shadow-lg border border-green-100 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-800">Care Scheduler</h3>
              <p className="text-gray-600">Never miss plant care again!</p>
            </div>
          </div>
          
          <button
            onClick={() => setShowScheduler(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-medium transition-colors shadow-md flex items-center space-x-2"
          >
            <Calendar className="w-5 h-5" />
            <span>Open Scheduler</span>
            {urgentTasks > 0 && (
              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                {urgentTasks}
              </span>
            )}
          </button>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-3 gap-4 mb-4">
          <div className="text-center p-4 bg-blue-50 rounded-xl border border-blue-200">
            <Droplets className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-800">
              {schedules.filter(s => s.type === 'watering').length}
            </div>
            <div className="text-sm text-blue-600">Watering</div>
          </div>
          
          <div className="text-center p-4 bg-green-50 rounded-xl border border-green-200">
            <Sprout className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-800">
              {schedules.filter(s => s.type === 'fertilizing').length}
            </div>
            <div className="text-sm text-green-600">Fertilizing</div>
          </div>
          
          <div className="text-center p-4 bg-purple-50 rounded-xl border border-purple-200">
            <Scissors className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-purple-800">
              {schedules.filter(s => s.type === 'pruning').length}
            </div>
            <div className="text-sm text-purple-600">Pruning</div>
          </div>
        </div>

        {/* Next Due Task */}
        {nextTask && (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-green-800 mb-1">
                  Next Due: {nextTask.plantName}
                </h4>
                <p className="text-sm text-green-600 capitalize">
                  {nextTask.type} - {new Date(nextTask.lastDone).toLocaleDateString()}
                </p>
              </div>
              <button
                onClick={() => setShowScheduler(true)}
                className="text-green-600 hover:text-green-700 text-sm font-medium underline"
              >
                View Details
              </button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {schedules.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h4 className="font-medium text-lg mb-2">No care schedules yet</h4>
            <p className="text-sm mb-4">Create your first care schedule to get started!</p>
            <button
              onClick={() => setShowScheduler(true)}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Create First Schedule
            </button>
          </div>
        )}
      </div>

      {/* Care Scheduler Modal */}
      <CareScheduler
        isOpen={showScheduler}
        onClose={() => setShowScheduler(false)}
        plantInfo={plantInfo}
      />
    </>
  );
};

export default CareSchedulerButton;
