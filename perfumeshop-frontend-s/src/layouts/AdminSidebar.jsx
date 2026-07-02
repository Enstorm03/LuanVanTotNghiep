import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const AdminSidebar = () => {
  const { isAdmin, isStoreManager, isWarehouseStaff, isSalesStaff, getRole, getRoleLabel } = useAuth();

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

        {/* Hiển thị role badge */}
         

        <div className="flex-1 py-2 overflow-y-auto">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4 gap-0.5">

            {/* Dashboard — tất cả nhân viên trừ warehouse */}
            {(isAdmin() || isStoreManager() || isSalesStaff()) && (
              <NavLink to="/admin" end className={navLinkClasses}>
                <span className="material-symbols-outlined">dashboard</span>
                Dashboard
              </NavLink>
            )}

            {/* ===== SẢN PHẨM / DANH MỤC — tất cả nhân viên xem được ===== */}
            <NavLink to="/admin/products" className={navLinkClasses}>
              <span className="material-symbols-outlined">inventory_2</span>
              Sản phẩm
            </NavLink>

            {/* Thương hiệu & Danh mục — Admin + Store Manager quản lý */}
            {isStoreManager() && (
              <NavLink to="/admin/brands" className={navLinkClasses}>
                <span className="material-symbols-outlined">local_offer</span>
                Thương hiệu
              </NavLink>
            )}
            {isStoreManager() && (
              <NavLink to="/admin/categories" className={navLinkClasses}>
                <span className="material-symbols-outlined">category</span>
                Danh mục
              </NavLink>
            )}

            {/* ===== ĐƠN HÀNG — Admin, Store Manager, Sales Staff ===== */}
            {isSalesStaff() && (
              <NavLink to="/admin/orders" className={navLinkClasses}>
                <span className="material-symbols-outlined">receipt_long</span>
                Đơn hàng
              </NavLink>
            )}
            {isSalesStaff() && (
              <NavLink to="/admin/returns" className={navLinkClasses}>
                <span className="material-symbols-outlined">assignment_return</span>
                Đổi trả
              </NavLink>
            )}
            {isSalesStaff() && (
              <NavLink to="/admin/defective" className={navLinkClasses}>
                <span className="material-symbols-outlined">report</span>
                Hàng lỗi
              </NavLink>
            )}

            {/* ===== KHO — Admin, Store Manager, Warehouse Staff ===== */}
            {isWarehouseStaff() && (
              <NavLink to="/admin/kho" className={navLinkClasses}>
                <span className="material-symbols-outlined">warehouse</span>
                Quản lý kho
              </NavLink>
            )}
            {isWarehouseStaff() && (
              <NavLink to="/admin/near-expiry-products" className={navLinkClasses}>
                <span className="material-symbols-outlined">warning</span>
                Cảnh báo cận Date
              </NavLink>
            )}

            {/* ===== ĐẤU THẦU / NCC — Admin + Store Manager ===== */}
            {isStoreManager() && (
              <NavLink to="/admin/procurement" className={navLinkClasses}>
                <span className="material-symbols-outlined">gavel</span>
                Đấu thầu
              </NavLink>
            )}
            {isStoreManager() && (
              <NavLink to="/admin/suppliers" className={navLinkClasses}>
                <span className="material-symbols-outlined">business</span>
                Nhà cung cấp
              </NavLink>
            )}

            {/* ===== ĐÁNH GIÁ — Admin + Store Manager + Sales Staff ===== */}
            {isSalesStaff() && (
              <NavLink to="/admin/reviews" className={navLinkClasses}>
                <span className="material-symbols-outlined">star</span>
                Đánh giá
              </NavLink>
            )}

            {/* ===== TÀI KHOẢN — chỉ ADMIN ===== */}
            {isAdmin() && (
              <NavLink to="/admin/users" className={navLinkClasses}>
                <span className="material-symbols-outlined">manage_accounts</span>
                Tài khoản
              </NavLink>
            )}

            {/* ===== BÁO CÁO — Admin + Store Manager ===== */}
            {isStoreManager() && (
              <NavLink to="/admin/reports" className={navLinkClasses}>
                <span className="material-symbols-outlined">monitoring</span>
                Báo cáo
              </NavLink>
            )}

            {/* ===== CHIẾN DỊCH — Admin + Store Manager ===== */}
            {isStoreManager() && (
              <NavLink to="/admin/campaigns" className={navLinkClasses}>
                <span className="material-symbols-outlined">campaign</span>
                Chiến dịch
              </NavLink>
            )}

          </nav>
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;
