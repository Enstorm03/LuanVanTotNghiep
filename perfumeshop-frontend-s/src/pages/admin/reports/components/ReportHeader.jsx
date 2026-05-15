import React from 'react';

const ReportHeader = ({ dateRange, onDateRangeChange, onExport }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <h1 className="font-semibold text-lg md:text-2xl text-text-light dark:text-text-dark">
        Báo cáo & Thống kê
      </h1>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={dateRange.startDate}
            onChange={(e) => onDateRangeChange('startDate', e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-sm"
          />
          <span className="text-text-subtle-light dark:text-text-subtle-dark">-</span>
          <input
            type="date"
            value={dateRange.endDate}
            onChange={(e) => onDateRangeChange('endDate', e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-sm"
          />
        </div>
        <button
          onClick={onExport}
          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
        >
          <span className="material-symbols-outlined mr-2">download</span>
          Xuất báo cáo
        </button>
      </div>
    </div>
  );
};

export default ReportHeader;
