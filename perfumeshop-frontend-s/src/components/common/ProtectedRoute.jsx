import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

/**
 * Bảo vệ các route yêu cầu đăng nhập / phân quyền.
 *
 * Props:
 * - requireEmployee: chỉ nhân viên (bất kỳ role nội bộ) mới được vào
 * - requireUser:     chỉ khách hàng đã đăng nhập
 * - requireRole:     role tối thiểu cần có (theo hierarchy)
 *     'ADMIN'           → chỉ ADMIN
 *     'STORE_MANAGER'   → ADMIN + STORE_MANAGER
 *     'WAREHOUSE_STAFF' → ADMIN + STORE_MANAGER + WAREHOUSE_STAFF
 *     'SALES_STAFF'     → ADMIN + STORE_MANAGER + SALES_STAFF
 *
 * Nếu chưa đăng nhập       → redirect /login
 * Nếu không đủ quyền        → redirect /admin (với thông báo)
 */
const ProtectedRoute = ({
  children,
  requireEmployee = false,
  requireUser = false,
  requireRole = null,
}) => {
  const { user, authLoading, isNhanVien, isAdmin, isStoreManager, isWarehouseStaff, isSalesStaff } = useAuth();
  const location = useLocation();

  if (authLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Chưa đăng nhập
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Yêu cầu nhân viên nhưng là khách
  if (requireEmployee && !isNhanVien()) {
    return <Navigate to="/" replace />;
  }

  // Yêu cầu khách nhưng là nhân viên
  if (requireUser && user.type !== 'customer') {
    return <Navigate to="/admin" replace />;
  }

  // Kiểm tra role cụ thể
  if (requireRole) {
    let hasPermission = false;
    switch (requireRole) {
      case 'ADMIN':
        hasPermission = isAdmin();
        break;
      case 'STORE_MANAGER':
        hasPermission = isStoreManager();
        break;
      case 'WAREHOUSE_STAFF':
        hasPermission = isWarehouseStaff();
        break;
      case 'SALES_STAFF':
        hasPermission = isSalesStaff();
        break;
      default:
        hasPermission = isNhanVien();
    }
    if (!hasPermission) {
      return <Navigate to="/admin" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
