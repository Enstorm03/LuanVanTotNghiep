import React from 'react';

const SortBar = ({ productCount, sortBy, onSortChange, sortOptions, loading, error }) => (
  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 p-4 bg-white dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark">
    <p className="text-gray-600 dark:text-gray-400 text-sm">
      {loading ? 'Đang tải...' : error ? 'Lỗi tải sản phẩm' : `Hiển thị ${productCount} sản phẩm`}
    </p>
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Sắp xếp:</span>
      <select
        value={sortBy}
        onChange={(e) => onSortChange(e.target.value)}
        className="form-select text-sm rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-gray-200 focus:border-primary focus:ring-primary/50 py-1.5 pl-3 pr-8"
      >
        {sortOptions.map(option => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    </div>
  </div>
);

export default SortBar;
