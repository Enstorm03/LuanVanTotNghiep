import React from 'react';
import { Link } from 'react-router-dom';

const OrdersHeader = () => (
  <>
    {/* Breadcrumbs */}
    <div className="mb-6">
      <div className="flex flex-wrap gap-2 text-sm">
        <Link className="text-text-secondary-light dark:text-text-secondary-dark hover:text-primary dark:hover:text-primary transition-colors" to="/">Trang chủ</Link>
        <span className="text-text-secondary-light dark:text-text-secondary-dark">/</span>
        <span className="font-medium text-text-primary-light dark:text-text-primary-dark">Lịch sử đơn hàng</span>
      </div>
    </div>

    {/* Page Heading */}
    <div className="mb-8">
      <h1 className="text-3xl md:text-4xl font-black tracking-[-0.033em]">Lịch sử đơn hàng</h1>
      <p className="text-text-secondary-light dark:text-text-secondary-dark mt-2">
        Theo dõi và quản lý các đơn hàng của bạn
      </p>
    </div>
  </>
);

export default OrdersHeader;
