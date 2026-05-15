import React from 'react';
import { Link } from 'react-router-dom';

const QuickActions = () => {
  return (
    <div className="rounded-xl border bg-surface-light text-card-foreground shadow border-border-light dark:border-border-dark dark:bg-surface-dark p-6">
      <h3 className="text-lg font-semibold mb-4">Thao tác nhanh</h3>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Link
          to="/admin/products"
          className="flex items-center gap-3 p-4 border border-border-light dark:border-border-dark rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          <span className="material-symbols-outlined text-blue-600">add_box</span>
          <div>
            <p className="font-medium">Thêm sản phẩm</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Thêm sản phẩm mới</p>
          </div>
        </Link>

        <Link
          to="/admin/orders"
          className="flex items-center gap-3 p-4 border border-border-light dark:border-border-dark rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          <span className="material-symbols-outlined text-green-600">shopping_cart</span>
          <div>
            <p className="font-medium">Quản lý đơn hàng</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Xem và xử lý đơn</p>
          </div>
        </Link>

        <Link
          to="/admin/returns"
          className="flex items-center gap-3 p-4 border border-border-light dark:border-border-dark rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          <span className="material-symbols-outlined text-red-600">assignment_return</span>
          <div>
            <p className="font-medium">Quản lý đổi trả</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Duyệt yêu cầu đổi trả</p>
          </div>
        </Link>

        <Link
          to="/admin/employees"
          className="flex items-center gap-3 p-4 border border-border-light dark:border-border-dark rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          <span className="material-symbols-outlined text-purple-600">people</span>
          <div>
            <p className="font-medium">Quản lý nhân viên</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Thêm/sửa nhân viên</p>
          </div>
        </Link>

        <Link
          to="/admin/pos"
          className="flex items-center gap-3 p-4 border border-border-light dark:border-border-dark rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          <span className="material-symbols-outlined text-orange-600">point_of_sale</span>
          <div>
            <p className="font-medium">POS - Bán hàng</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Bán tại quầy</p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default QuickActions;
