import React from 'react';

const CustomerInsights = ({ customerStats }) => {
  return (
    <div className="rounded-xl border bg-surface-light text-card-foreground shadow border-border-light dark:border-border-dark dark:bg-surface-dark p-6">
      <h3 className="text-lg font-bold mb-4">Phân tích khách hàng</h3>
      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="text-sm">Tổng khách hàng:</span>
          <span className="font-medium text-orange-600">{customerStats.totalCustomers}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm">Khách hàng mới:</span>
          <span className="font-medium text-blue-600">{customerStats.newCustomers}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm">Khách hàng quay lại:</span>
          <span className="font-medium text-purple-600">{customerStats.repeatCustomers}</span>
        </div>
      </div>
    </div>
  );
};

export default CustomerInsights;
