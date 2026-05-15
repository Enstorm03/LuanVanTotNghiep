import React from 'react';

const StatsCards = ({ stats }) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-5">
      {/* Total Revenue */}
      <div className="rounded-xl border bg-surface-light text-card-foreground shadow border-border-light dark:border-border-dark dark:bg-surface-dark">
        <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
          <h3 className="tracking-tight text-sm font-medium text-text-subtle-light dark:text-text-subtle-dark">Tổng doanh thu</h3>
          <span className="material-symbols-outlined text-green-600">paid</span>
        </div>
        <div className="p-6 pt-0">
          <div className="text-2xl font-bold text-text-light dark:text-text-dark">
            {stats.totalRevenue.toLocaleString('vi-VN')}₫
          </div>
          <p className="text-xs text-text-subtle-light dark:text-text-subtle-dark pt-1">
            Từ {stats.completedOrders} đơn hoàn thành
          </p>
        </div>
      </div>

      {/* Total Orders */}
      <div className="rounded-xl border bg-surface-light text-card-foreground shadow border-border-light dark:border-border-dark dark:bg-surface-dark">
        <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
          <h3 className="tracking-tight text-sm font-medium text-text-subtle-light dark:text-text-subtle-dark">Tổng đơn hàng</h3>
          <span className="material-symbols-outlined text-blue-600">shopping_cart</span>
        </div>
        <div className="p-6 pt-0">
          <div className="text-2xl font-bold text-text-light dark:text-text-dark">{stats.totalOrders}</div>
          <p className="text-xs text-text-subtle-light dark:text-text-subtle-dark pt-1">
            {stats.pendingOrders} đang chờ, {stats.shippingOrders} đang giao
          </p>
        </div>
      </div>

      {/* Total Products */}
      <div className="rounded-xl border bg-surface-light text-card-foreground shadow border-border-light dark:border-border-dark dark:bg-surface-dark">
        <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
          <h3 className="tracking-tight text-sm font-medium text-text-subtle-light dark:text-text-subtle-dark">Sản phẩm</h3>
          <span className="material-symbols-outlined text-purple-600">inventory_2</span>
        </div>
        <div className="p-6 pt-0">
          <div className="text-2xl font-bold text-text-light dark:text-text-dark">{stats.totalProducts}</div>
          <p className="text-xs text-text-subtle-light dark:text-text-subtle-dark pt-1">
            Đang kinh doanh
          </p>
        </div>
      </div>

      {/* Total Customers */}
      <div className="rounded-xl border bg-surface-light text-card-foreground shadow border-border-light dark:border-border-dark dark:bg-surface-dark">
        <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
          <h3 className="tracking-tight text-sm font-medium text-text-subtle-light dark:text-text-subtle-dark">Khách hàng</h3>
          <span className="material-symbols-outlined text-orange-600">people</span>
        </div>
        <div className="p-6 pt-0">
          <div className="text-2xl font-bold text-text-light dark:text-text-dark">{stats.totalCustomers}</div>
          <p className="text-xs text-text-subtle-light dark:text-text-subtle-dark pt-1">
            Đã đăng ký
          </p>
        </div>
      </div>

      {/* Returns */}
      <div className="rounded-xl border bg-surface-light text-card-foreground shadow border-border-light dark:border-border-dark dark:bg-surface-dark">
        <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
          <h3 className="tracking-tight text-sm font-medium text-text-subtle-light dark:text-text-subtle-dark">Đổi trả</h3>
          <span className="material-symbols-outlined text-red-600">assignment_return</span>
        </div>
        <div className="p-6 pt-0">
          <div className="text-2xl font-bold text-text-light dark:text-text-dark">{stats.pendingReturns}</div>
          <p className="text-xs text-text-subtle-light dark:text-text-subtle-dark pt-1">
            {stats.approvedReturns} đã duyệt, {stats.totalReturns} tổng số
          </p>
        </div>
      </div>
    </div>
  );
};

export default StatsCards;
