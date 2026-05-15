import React from 'react';

const QuantitySelector = ({
  quantity,
  onQuantityChange,
  onIncrement,
  onDecrement,
  maxStock,
  stockStatus
}) => (
  <div className="flex items-center gap-4 py-4">
    <label className="font-medium">Số lượng:</label>
    <div className="flex items-center gap-2">
      <button
        onClick={onDecrement}
        className="w-8 h-8 rounded border border-border-light dark:border-border-dark flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700"
      >
        <span className="material-symbols-outlined text-sm">remove</span>
      </button>
      <input
        type="number"
        min="1"
        max={maxStock || 999}
        value={quantity}
        onChange={(e) => onQuantityChange(parseInt(e.target.value) || 1)}
        className="w-16 text-center px-2 py-1 border border-border-light dark:border-border-dark rounded focus:outline-none focus:ring-2 focus:ring-primary"
      />
      <button
        onClick={onIncrement}
        className="w-8 h-8 rounded border border-border-light dark:border-border-dark flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700"
      >
        <span className="material-symbols-outlined text-sm">add</span>
      </button>
    </div>
    <span className="text-sm text-gray-600 dark:text-gray-400">
      ({stockStatus.label})
    </span>
  </div>
);

export default QuantitySelector;
