import React from 'react';

const DashboardHeader = ({ onRefresh }) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-text-light dark:text-text-dark">Dashboard</h1>
        <p className="text-text-secondary-light dark:text-text-secondary-dark mt-1">
          Tổng quan hệ thống cửa hàng nước hoa
        </p>
      </div>
      <button
        onClick={onRefresh}
        className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
      >
        <span className="material-symbols-outlined mr-2">refresh</span>
        Làm mới
      </button>
    </div>
  );
};

export default DashboardHeader;
