import { NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
// file này để hiển thị sidebar admin, tránh gọi API nhiều lần
const AdminSidebar = () => {
  const { isAdmin, isDirector, isStoreManager, isWarehouseStaff, getRole, getRoleLabel } = useAuth();

  const navLinkClasses = ({ isActive }) =>
    `flex items-center gap-3 rounded-lg px-3 py-2 transition-all text-text-subtle-light dark:text-text-subtle-dark hover:text-text-light dark:hover:text-text-dark ${
      isActive
        ? 'bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark'
        : ''
    }`;

  const role = getRole();

  // Badge màu theo role
  const badgeClass =
    role === 'ADMIN'           ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' :
    role === 'DIRECTOR'        ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' :
    role === 'STORE_MANAGER'   ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' :
    role === 'WAREHOUSE_STAFF' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300' :
                                 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300';

  return (
    <div className="hidden border-r border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">

        {/* Logo */}
        <div className="flex h-14 items-center border-b border-border-light dark:border-border-dark px-4 lg:h-[60px] lg:px-6">
          <NavLink to="/admin" className="flex items-center gap-2 font-semibold text-text-light dark:text-text-dark">
            <span className="material-symbols-outlined text-primary">shield_person</span>
            <span>Admin CMS</span>
          </NavLink>
        </div>

        {/* Role badge */}
        <div className="px-4 py-2">
          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${badgeClass}`}>
            <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>badge</span>
            {getRoleLabel(role)}
          </span>
        </div>

        {/* Nav */}
        <div className="flex-1 py-1 overflow-y-auto">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4 gap-0.5">

            {/* Dashboard — STORE_MANAGER trở lên */}
            {isStoreManager() && (
              <NavLink to="/admin" end className={navLinkClasses}>
                <span className="material-symbols-outlined">dashboard</span>
                Dashboard
              </NavLink>
            )}

            {/* Sản phẩm — tất cả nhân viên */}
            <NavLink to="/admin/products" className={navLinkClasses}>
              <span className="material-symbols-outlined">inventory_2</span>
              Sản phẩm
            </NavLink>

            {/* Thương hiệu & Danh mục — STORE_MANAGER trở lên */}
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

            {/* Đơn hàng, đổi trả, hàng lỗi — STORE_MANAGER trở lên */}
            {isStoreManager() && (
              <NavLink to="/admin/orders" className={navLinkClasses}>
                <span className="material-symbols-outlined">receipt_long</span>
                Đơn hàng
              </NavLink>
            )}
            {isStoreManager() && (
              <NavLink to="/admin/returns" className={navLinkClasses}>
                <span className="material-symbols-outlined">assignment_return</span>
                Đổi trả
              </NavLink>
            )}
            {isStoreManager() && (
              <NavLink to="/admin/defective" className={navLinkClasses}>
                <span className="material-symbols-outlined">report</span>
                Hàng lỗi
              </NavLink>
            )}

            {/* Kho — WAREHOUSE_STAFF trở lên */}
            {isWarehouseStaff() && (
              <NavLink to="/admin/kho" className={navLinkClasses}>
                <span className="material-symbols-outlined">warehouse</span>
                Quản lý kho
              </NavLink>
            )}
            {isWarehouseStaff() && (
              <NavLink to="/admin/orders" className={navLinkClasses}>
                <span className="material-symbols-outlined">receipt_long</span>
                 Đơn hàng
              </NavLink>
            )}

            {/* Đấu thầu & NCC — STORE_MANAGER trở lên */}
            {isStoreManager() && (
              <NavLink to="/admin/procurement" className={navLinkClasses}>
                <span className="material-symbols-outlined">gavel</span>
                Đấu thầu
              </NavLink>
            )}
            {/* Đánh giá — STORE_MANAGER trở lên */}
            {isStoreManager() && (
              <NavLink to="/admin/reviews" className={navLinkClasses}>
                <span className="material-symbols-outlined">star</span>
                Đánh giá
              </NavLink>
            )}

            {/* Báo cáo — DIRECTOR (Giám đốc) trở lên */}
            {isDirector() && (
              <NavLink to="/admin/reports" className={navLinkClasses}>
                <span className="material-symbols-outlined">monitoring</span>
                Báo cáo
              </NavLink>
            )}

            {/* Chiến dịch — STORE_MANAGER trở lên */}
            {isStoreManager() && (
              <NavLink to="/admin/campaigns" className={navLinkClasses}>
                <span className="material-symbols-outlined">campaign</span>
                Chiến dịch
              </NavLink>
            )}

            {/* Tài khoản — chỉ ADMIN root */}
            {isAdmin() && (
              <NavLink to="/admin/users" className={navLinkClasses}>
                <span className="material-symbols-outlined">manage_accounts</span>
                Tài khoản
              </NavLink>
            )}

            {/* Log đăng nhập — ADMIN + DIRECTOR (Giám đốc) */}
            {isDirector() && (
              <NavLink to="/admin/login-logs" className={navLinkClasses}>
                <span className="material-symbols-outlined">manage_history</span>
                Log đăng nhập
              </NavLink>
            )}

          </nav>
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;
