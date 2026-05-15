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
            <NavLink to="/admin/orders" className={navLinkClasses}>
              <span className="material-symbols-outlined">receipt_long</span>
              Đơn hàng
            </NavLink>
            <NavLink to="/admin/returns" className={navLinkClasses}>
              <span className="material-symbols-outlined">assignment_return</span>
              Đổi trả
            </NavLink>
            {isAdmin() && (
              <>
                <NavLink to="/admin/employees" className={navLinkClasses}>
                  <span className="material-symbols-outlined">group</span>
                  Nhân viên
                </NavLink>
                <NavLink to="/admin/customers" className={navLinkClasses}>
                  <span className="material-symbols-outlined">people</span>
                  Khách hàng
                </NavLink>
              </>
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
