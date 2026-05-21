import React from 'react';

const OrderStatusChart = ({ orderStats = {} }) => {
  
  const stats = {
    pending: orderStats.pending || 0,
    confirmed: orderStats.confirmed || 0,
    shipping: orderStats.shipping || 0,
    completed: orderStats.completed || 0,
    cancelled: orderStats.cancelled || 0,
  };

  const statusNames = {
    pending: 'Đang chờ',
    confirmed: 'Đã xác nhận',
    shipping: 'Đang giao hàng',
    completed: 'Hoàn thành',
    cancelled: 'Đã hủy',
  };

  const statusColors = {
    pending: 'bg-yellow-500',
    confirmed: 'bg-purple-500',
    shipping: 'bg-blue-500',
    completed: 'bg-green-500',
    cancelled: 'bg-red-500',
  };

  // Tính tổng để chia phần trăm, đảm bảo không bị NaN
  const totalOrders = Object.values(stats).reduce((sum, count) => sum + Number(count), 0);

  return (
    <div className="rounded-xl border bg-surface-light text-card-foreground shadow border-border-light dark:border-border-dark dark:bg-surface-dark p-6">
      <h3 className="text-lg font-bold mb-4">Trạng thái đơn hàng</h3>
      <div className="space-y-3">
        {Object.entries(stats).map(([status, count]) => {
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