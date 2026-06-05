import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const AdminSidebar = () => {
  const { isAdmin } = useAuth();

  const navLinkClasses = ({ isActive }) =>
    `flex items-center gap-3 rounded-lg px-3 py-2 transition-all text-text-subtle-light dark:text-text-subtle-dark hover:text-text-light dark:hover:text-text-dark ${
      isActive
        ? 'bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark'
        : ''
    }`;

  return (
    <div className="hidden border-r border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b border-border-light dark:border-border-dark px-4 lg:h-[60px] lg:px-6">
          <NavLink to="/admin" className="flex items-center gap-2 font-semibold text-text-light dark:text-text-dark">
            <span className="material-symbols-outlined text-primary">shield_person</span>
            <span>Admin CMS</span>
          </NavLink>
        </div>
        <div className="flex-1 py-2">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
            <NavLink to="/admin" end className={navLinkClasses}>
              <span className="material-symbols-outlined">dashboard</span>
              Dashboard
            </NavLink>
            <NavLink to="/admin/products" className={navLinkClasses}>
              <span className="material-symbols-outlined">inventory_2</span>
              Sản phẩm
            </NavLink>
            <NavLink to="/admin/brands" className={navLinkClasses}>
              <span className="material-symbols-outlined">local_offer</span>
              Thương hiệu
            </NavLink>
            <NavLink to="/admin/categories" className={navLinkClasses}>
              <span className="material-symbols-outlined">category</span>
              Danh mục
            </NavLink>
            <NavLink to="/admin/orders" className={navLinkClasses}>
              <span className="material-symbols-outlined">receipt_long</span>
              Đơn hàng
            </NavLink>
            <NavLink to="/admin/returns" className={navLinkClasses}>
              <span className="material-symbols-outlined">assignment_return</span>
              Đổi trả
            </NavLink>
            <NavLink to="/admin/reviews" className={navLinkClasses}>
              <span className="material-symbols-outlined">star</span>
              Đánh giá
            </NavLink>
            
            {/* Đã gộp chung Nhân viên & Khách hàng thành 1 mục Tài khoản */}
            {isAdmin() && (
              <NavLink to="/admin/users" className={navLinkClasses}>
                <span className="material-symbols-outlined">manage_accounts</span>
                Tài khoản
              </NavLink>
            )}
            
            <NavLink to="/admin/reports" className={navLinkClasses}>
              <span className="material-symbols-outlined">monitoring</span>
              Báo cáo
            </NavLink>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;