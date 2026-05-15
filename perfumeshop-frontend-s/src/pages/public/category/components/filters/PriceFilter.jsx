import React from 'react';

const PriceFilter = ({ maxPrice, onPriceChange }) => (
  <div className="py-4 border-b border-gray-200 dark:border-gray-700">
    <h4 className="font-semibold mb-4 text-gray-800 dark:text-gray-200">Mức giá tối đa</h4>
    <input
      type="range"
      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-primary"
      min="0" max="10000000" step="100000"
      value={maxPrice}
      onChange={(e) => onPriceChange(e.target.value)}
    />
    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-2">
      <span>0đ</span>
      <span className="font-bold text-primary">{parseInt(maxPrice).toLocaleString()}đ</span>
    </div>
  </div>
);

export default PriceFilter;
