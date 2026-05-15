import React from 'react';

const RevenueBreakdown = ({ reportData }) => {
  return (
    <div className="rounded-xl border bg-surface-light text-card-foreground shadow border-border-light dark:border-border-dark dark:bg-surface-dark p-6">
      <h3 className="text-lg font-bold mb-4">Phân tích doanh thu</h3>
      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="text-sm">Doanh thu thực tế:</span>
          <span className="font-medium text-green-600">{reportData.totalRevenue.toLocaleString('vi-VN')}₫</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm">Giá trị trung bình/đơn:</span>
          <span className="font-medium">{reportData.averageOrderValue.toLocaleString('vi-VN')}₫</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm">Số đơn hoàn thành:</span>
          <span className="font-medium">{reportData.orderStats.completed}</span>
        </div>
      </div>
    </div>
  );
};

export default RevenueBreakdown;
