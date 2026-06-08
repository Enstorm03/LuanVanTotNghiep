import React from 'react';

/**
 * concentrationTypes: [{ label: string, value: number }]
 * selectedConcentrations: number[]
 */
const ConcentrationFilter = ({ concentrationTypes, selectedConcentrations, onConcentrationChange }) => (
  <div className="py-4 border-b border-gray-200 dark:border-gray-700">
    <h4 className="font-semibold mb-3 text-gray-800 dark:text-gray-200">Nồng độ</h4>
    <div className="space-y-2">
      {concentrationTypes.map(({ label, value }) => (
        <label key={value} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 cursor-pointer hover:text-gray-900 dark:hover:text-white">
          <input
            type="checkbox"
            checked={selectedConcentrations.includes(value)}
            onChange={e => onConcentrationChange(value, e.target.checked)}
            className="form-checkbox rounded text-primary focus:ring-primary/50 shrink-0"
          />
          <span>{label}</span>
        </label>
      ))}
    </div>
  </div>
);

export default ConcentrationFilter;
