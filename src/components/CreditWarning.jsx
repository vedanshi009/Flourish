//File: src/components/CreditWarning.jsx
import React, { useState, useEffect } from 'react';
import { AlertTriangle, X, Info } from 'lucide-react';

const CreditWarning = ({ creditsRemaining, onDismiss }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Show warning if credits are low (less than 10)
    if (creditsRemaining !== null && creditsRemaining < 10 && !isDismissed) {
      setIsVisible(true);
    }
  }, [creditsRemaining, isDismissed]);

  const handleDismiss = () => {
    setIsVisible(false);
    setIsDismissed(true);
    if (onDismiss) {
      onDismiss();
    }
  };

  if (!isVisible) return null;

  const getWarningLevel = () => {
    if (creditsRemaining <= 0) return 'critical';
    if (creditsRemaining <= 5) return 'high';
    if (creditsRemaining <= 10) return 'medium';
    return 'low';
  };

  const warningLevel = getWarningLevel();
  
  const getWarningConfig = () => {
    switch (warningLevel) {
      case 'critical':
        return {
          bgColor: 'bg-red-50 dark:bg-red-900/20',
          borderColor: 'border-red-200 dark:border-red-800',
          textColor: 'text-red-800 dark:text-red-200',
          iconColor: 'text-red-500',
          title: 'No Credits Remaining',
          message: 'Plant.id API credits have expired. Image analysis is temporarily unavailable.'
        };
      case 'high':
        return {
          bgColor: 'bg-orange-50 dark:bg-orange-900/20',
          borderColor: 'border-orange-200 dark:border-orange-800',
          textColor: 'text-orange-800 dark:text-orange-200',
          iconColor: 'text-orange-500',
          title: 'Low Credits Warning',
          message: `Only ${creditsRemaining} Plant.id API credits remaining. Consider upgrading your plan.`
        };
      case 'medium':
        return {
          bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
          borderColor: 'border-yellow-200 dark:border-yellow-800',
          textColor: 'text-yellow-800 dark:text-yellow-200',
          iconColor: 'text-yellow-500',
          title: 'Credit Usage Notice',
          message: `${creditsRemaining} Plant.id API credits remaining.`
        };
      default:
        return {
          bgColor: 'bg-blue-50 dark:bg-blue-900/20',
          borderColor: 'border-blue-200 dark:border-blue-800',
          textColor: 'text-blue-800 dark:text-blue-200',
          iconColor: 'text-blue-500',
          title: 'Credit Status',
          message: `${creditsRemaining} Plant.id API credits remaining.`
        };
    }
  };

  const config = getWarningConfig();

  return (
    <div className={`${config.bgColor} border ${config.borderColor} rounded-lg p-4 mb-6`}>
      <div className="flex items-start">
        <div className="flex-shrink-0">
          {warningLevel === 'critical' ? (
            <AlertTriangle className={`h-5 w-5 ${config.iconColor}`} />
          ) : (
            <Info className={`h-5 w-5 ${config.iconColor}`} />
          )}
        </div>
        <div className="ml-3 flex-1">
          <h3 className={`text-sm font-medium ${config.textColor}`}>
            {config.title}
          </h3>
          <div className={`mt-2 text-sm ${config.textColor}`}>
            <p>{config.message}</p>
            {warningLevel === 'critical' && (
              <div className="mt-2 p-2 bg-red-100 dark:bg-red-900/30 rounded border border-red-200 dark:border-red-800">
                <p className="text-xs">
                  💡 <strong>Tip:</strong> You can still use the manual plant entry feature and chat with the AI advisor for general plant care advice.
                </p>
              </div>
            )}
            {warningLevel === 'high' && (
              <div className="mt-2 p-2 bg-orange-100 dark:bg-orange-900/30 rounded border border-orange-200 dark:border-orange-800">
                <p className="text-xs">
                  💡 <strong>Tip:</strong> Consider using manual plant entry for plants you can identify yourself to conserve credits.
                </p>
              </div>
            )}
          </div>
        </div>
        <div className="ml-auto pl-3">
          <button
            onClick={handleDismiss}
            className={`inline-flex ${config.bgColor} rounded-md p-1.5 ${config.textColor} hover:bg-opacity-75 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-${warningLevel === 'critical' ? 'red' : warningLevel === 'high' ? 'orange' : 'yellow'}-50 focus:ring-${warningLevel === 'critical' ? 'red' : warningLevel === 'high' ? 'orange' : 'yellow'}-600`}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreditWarning;


