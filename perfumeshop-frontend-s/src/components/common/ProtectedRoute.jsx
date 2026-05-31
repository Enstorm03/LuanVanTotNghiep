import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

/**
 * Bảo vệ các route yêu cầu đăng nhập.
 * - requireEmployee: chỉ cho phép nhân viên (ADMIN / STAFF) truy cập
 * - requireUser: chỉ cho phép khách hàng đã đăng nhập truy cập
 * Nếu chưa đăng nhập → redirect về /login (kèm returnUrl để quay lại sau khi login)
 * Nếu không đủ quyền → redirect về /
 */
const ProtectedRoute = ({ children, requireEmployee = false, requireUser = false }) => {
  const { user, authLoading, isNhanVien } = useAuth();
  const location = useLocation();

  // Chờ AuthContext khởi tạo xong (đọc localStorage)
  if (authLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Chưa đăng nhập → về trang login, lưu lại URL để redirect sau
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Yêu cầu là nhân viên (admin/staff) nhưng user là khách hàng
  if (requireEmployee && !isNhanVien()) {
    return <Navigate to="/" replace />;
  }

  // Yêu cầu là khách hàng nhưng user là nhân viên (edge case)
  if (requireUser && user.type !== 'customer') {
    return <Navigate to="/admin" replace />;
  }

  return children;
};

export default ProtectedRoute;
