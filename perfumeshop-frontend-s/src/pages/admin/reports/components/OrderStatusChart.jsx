import React from 'react';

const OrderStatusChart = ({ orderStats }) => {
  const statusNames = {
    pending: 'Đang chờ',
    confirmed: 'Đã xác nhận',
    shipping: 'Đang giao hàng',
    completed: 'Hoàn thành',
    cancelled: 'Đã hủy',
    deposit: 'Chờ hàng'
  };

  const statusColors = {
    pending: 'bg-yellow-500',
    confirmed: 'bg-purple-500',
    shipping: 'bg-blue-500',
    completed: 'bg-green-500',
    cancelled: 'bg-red-500',
    deposit: 'bg-orange-500'
  };

  const totalOrders = Object.values(orderStats).reduce((sum, count) => sum + count, 0);

  return (
    <div className="rounded-xl border bg-surface-light text-card-foreground shadow border-border-light dark:border-border-dark dark:bg-surface-dark p-6">
      <h3 className="text-lg font-bold mb-4">Trạng thái đơn hàng</h3>
      <div className="space-y-3">
        {Object.entries(orderStats).map(([status, count]) => {
          const percentage = totalOrders > 0 ? (count / totalOrders) * 100 : 0;

          return (
            <div key={status} className="flex items-center justify-between">
              <div className="flex items-center gap-3 flex-1">
                <div className={`w-4 h-4 rounded ${statusColors[status]}`}></div>
                <span className="text-sm">{statusNames[status]}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${statusColors[status]}`}
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium w-12 text-right">{count}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrderStatusChart;
