import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

/**
 * Bảo vệ các route yêu cầu đăng nhập / phân quyền.
 *
 * requireRole:
 *   'ADMIN'           → chỉ ADMIN root
 *   'DIRECTOR'        → ADMIN + DIRECTOR
 *   'STORE_MANAGER'   → ADMIN + DIRECTOR + STORE_MANAGER
 *   'WAREHOUSE_STAFF' → ADMIN + DIRECTOR + STORE_MANAGER + WAREHOUSE_STAFF
 *   'SUPPLIER'        → chỉ SUPPLIER
 */
const ProtectedRoute = ({
  children,
  requireEmployee = false,
  requireUser = false,
  requireRole = null,
}) => {
  const {
    user, authLoading,
    isAdmin, isDirector, isStoreManager, isWarehouseStaff, isSupplier, isNhanVien,
  } = useAuth();
  const location = useLocation();

  if (authLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Chưa đăng nhập → về login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Yêu cầu nhân viên nội bộ nhưng là customer/supplier
  if (requireEmployee && !isNhanVien()) {
    return <Navigate to="/" replace />;
  }

  // Yêu cầu customer nhưng là nhân viên
  if (requireUser && user.type !== 'customer') {
    return <Navigate to={user.type === 'supplier' ? '/supplier-portal' : '/admin'} replace />;
  }

  // Kiểm tra role cụ thể
  if (requireRole) {
    let hasPermission = false;
    switch (requireRole) {
      case 'ADMIN':
        hasPermission = isAdmin();
        break;
      case 'DIRECTOR':
        hasPermission = isDirector();
        break;
      case 'STORE_MANAGER':
        hasPermission = isStoreManager();
        break;
      case 'WAREHOUSE_STAFF':
        hasPermission = isWarehouseStaff();
        break;
      case 'SUPPLIER':
        hasPermission = isSupplier();
        break;
      default:
        hasPermission = isNhanVien();
    }
    if (!hasPermission) {
      // Redirect về đúng trang chủ của từng loại user
      if (isSupplier()) return <Navigate to="/supplier-portal" replace />;
      if (isNhanVien()) return <Navigate to="/admin" replace />;
      return <Navigate to="/" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
