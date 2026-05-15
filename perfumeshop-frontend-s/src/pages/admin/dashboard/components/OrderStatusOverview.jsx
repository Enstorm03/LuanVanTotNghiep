import React from 'react';
import { getStatusIcon, getStatusColor } from '../../../../utils/dashboardStatus';

const OrderStatusOverview = ({ stats, recentOrders }) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Pending Orders */}
      <div className="rounded-xl border bg-surface-light text-card-foreground shadow border-border-light dark:border-border-dark dark:bg-surface-dark p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-text-subtle-light dark:text-text-subtle-dark">Đang chờ</p>
            <p className={`text-2xl font-bold ${getStatusColor('Đang chờ')}`}>{stats.pendingOrders}</p>
          </div>
          <span className={`material-symbols-outlined text-3xl ${getStatusColor('Đang chờ')}`}>
            {getStatusIcon('Đang chờ')}
          </span>
        </div>
      </div>

      {/* Confirmed Orders */}
      <div className="rounded-xl border bg-surface-light text-card-foreground shadow border-border-light dark:border-border-dark dark:bg-surface-dark p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-text-subtle-light dark:text-text-subtle-dark">Đã xác nhận</p>
            <p className={`text-2xl font-bold ${getStatusColor('Đã xác nhận')}`}>{stats.confirmedOrders || 2}
            </p>
          </div>
          <span className={`material-symbols-outlined text-3xl ${getStatusColor('Đã xác nhận')}`}>
            {getStatusIcon('Đã xác nhận')}
          </span>
        </div>
      </div>

      {/* Shipping Orders */}
      <div className="rounded-xl border bg-surface-light text-card-foreground shadow border-border-light dark:border-border-dark dark:bg-surface-dark p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-text-subtle-light dark:text-text-subtle-dark">Đang giao</p>
            <p className={`text-2xl font-bold ${getStatusColor('Đang giao hàng')}`}>{stats.shippingOrders}</p>
          </div>
          <span className={`material-symbols-outlined text-3xl ${getStatusColor('Đang giao hàng')}`}>
            {getStatusIcon('Đang giao hàng')}
          </span>
        </div>
      </div>

      {/* Completed Orders */}
      <div className="rounded-xl border bg-surface-light text-card-foreground shadow border-border-light dark:border-border-dark dark:bg-surface-dark p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-text-subtle-light dark:text-text-subtle-dark">Hoàn thành</p>
            <p className={`text-2xl font-bold ${getStatusColor('Hoàn thành')}`}>{stats.completedOrders}</p>
          </div>
          <span className={`material-symbols-outlined text-3xl ${getStatusColor('Hoàn thành')}`}>
            {getStatusIcon('Hoàn thành')}
          </span>
        </div>
      </div>
    </div>
  );
};

export default OrderStatusOverview;
