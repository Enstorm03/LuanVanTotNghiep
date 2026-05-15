import React from 'react';

const Breadcrumbs = ({ productName }) => (
  <nav className="mb-8">
    <ol className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
      <li><a href="/" className="hover:text-primary">Trang chủ</a></li>
      <li><span className="material-symbols-outlined text-xs">chevron_right</span></li>
      <li><a href="/products" className="hover:text-primary">Sản phẩm</a></li>
      <li><span className="material-symbols-outlined text-xs">chevron_right</span></li>
      <li className="text-gray-900 dark:text-gray-100 font-medium">{productName}</li>
    </ol>
  </nav>
);

export default Breadcrumbs;
