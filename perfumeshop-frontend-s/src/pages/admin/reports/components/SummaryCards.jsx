import React from 'react';

const SummaryCards = ({ reportData, conversionRate }) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
      {/* Total Revenue */}
      <div className="rounded-xl border bg-surface-light text-card-foreground shadow border-border-light dark:border-border-dark dark:bg-surface-dark p-6">
        <div className="flex items-center justify-between pb-2">
          <h3 className="tracking-tight text-sm font-medium text-text-subtle-light dark:text-text-subtle-dark">Tổng doanh thu</h3>
          <span className="material-symbols-outlined text-green-600">paid</span>
        </div>
        <div className="pt-0">
          <div className="text-2xl font-bold text-text-light dark:text-text-dark">
            {reportData.totalRevenue.toLocaleString('vi-VN')}₫
          </div>
          <p className="text-xs text-green-600 pt-1">
            Từ {reportData.orderStats.completed} đơn hoàn thành
          </p>
        </div>
      </div>

      {/* Total Orders */}
      <div className="rounded-xl border bg-surface-light text-card-foreground shadow border-border-light dark:border-border-dark dark:bg-surface-dark p-6">
        <div className="flex items-center justify-between pb-2">
          <h3 className="tracking-tight text-sm font-medium text-text-subtle-light dark:text-text-subtle-dark">Tổng đơn hàng</h3>
          <span className="material-symbols-outlined text-blue-600">shopping_cart</span>
        </div>
        <div className="pt-0">
          <div className="text-2xl font-bold text-text-light dark:text-text-dark">{reportData.totalOrders}</div>
          <p className="text-xs text-blue-600 pt-1">
            Trung bình: {reportData.averageOrderValue.toLocaleString('vi-VN')}₫/đơn
          </p>
        </div>
      </div>

      {/* Total Customers */}
      <div className="rounded-xl border bg-surface-light text-card-foreground shadow border-border-light dark:border-border-dark dark:bg-surface-dark p-6">
        <div className="flex items-center justify-between pb-2">
          <h3 className="tracking-tight text-sm font-medium text-text-subtle-light dark:text-text-subtle-dark">Khách hàng</h3>
          <span className="material-symbols-outlined text-orange-600">people</span>
        </div>
        <div className="pt-0">
          <div className="text-2xl font-bold text-text-light dark:text-text-dark">{reportData.customerStats.totalCustomers}</div>
          <p className="text-xs text-orange-600 pt-1">
            Trong khoảng thời gian
          </p>
        </div>
      </div>

      {/* Conversion Rate */}
      <div className="rounded-xl border bg-surface-light text-card-foreground shadow border-border-light dark:border-border-dark dark:bg-surface-dark p-6">
        <div className="flex items-center justify-between pb-2">
          <h3 className="tracking-tight text-sm font-medium text-text-subtle-light dark:text-text-subtle-dark">Tỷ lệ hoàn thành</h3>
          <span className="material-symbols-outlined text-purple-600">trending_up</span>
        </div>
        <div className="pt-0">
          <div className="text-2xl font-bold text-text-light dark:text-text-dark">
            {conversionRate}%
          </div>
          <p className="text-xs text-purple-600 pt-1">
            {reportData.orderStats.completed}/{reportData.totalOrders} đơn
          </p>
        </div>
      </div>
    </div>
  );
};

export default SummaryCards;
