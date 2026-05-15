import React from 'react';

const PeriodSummary = ({ dateRange, totalOrders }) => {
  return (
    <div className="rounded-xl border bg-surface-light text-card-foreground shadow border-border-light dark:border-border-dark dark:bg-surface-dark p-6">
      <h3 className="text-lg font-bold mb-4">Tóm tắt kỳ</h3>
      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="text-sm">Từ ngày:</span>
          <span className="font-medium">{new Date(dateRange.startDate).toLocaleDateString('vi-VN')}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm">Đến ngày:</span>
          <span className="font-medium">{new Date(dateRange.endDate).toLocaleDateString('vi-VN')}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm">Tổng đơn:</span>
          <span className="font-medium text-blue-600">{totalOrders}</span>
        </div>
      </div>
    </div>
  );
};

export default PeriodSummary;
