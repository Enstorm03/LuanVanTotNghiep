import React from 'react';

const ConcentrationFilter = ({ concentrationTypes, selectedConcentrations, onConcentrationChange }) => (
  <div className="py-4 border-b border-gray-200 dark:border-gray-700">
    <h4 className="font-semibold mb-3 text-gray-800 dark:text-gray-200">Nồng độ</h4>
    <div className="space-y-2">
      {concentrationTypes.map((type) => (
          <label key={type} className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedConcentrations.includes(type)}
                onChange={(e) => onConcentrationChange(type, e.target.checked)}
                className="form-checkbox rounded text-primary focus:ring-primary/50"
              />
              <span>{type}</span>
          </label>
      ))}
    </div>
  </div>
);

export default ConcentrationFilter;
