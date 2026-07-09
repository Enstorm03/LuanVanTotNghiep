import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Danh sách vai trò hợp lệ cho nhân viên nội bộ
const EMPLOYEE_ROLES = ['ADMIN', 'DIRECTOR', 'STORE_MANAGER', 'WAREHOUSE_STAFF', 'SUPPLIER'];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = sessionStorage.getItem('user');
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        // Session cũ không có token (employee/supplier) → xóa để buộc login lại
        if ((parsed.type === 'employee' || parsed.type === 'supplier') && !parsed.token) {
          sessionStorage.removeItem('user');
        } else {
          setUser(parsed);
        }
      } catch (e) {
        sessionStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const loginUser = async (data) => {
    try {
      const loginData = await api.login({
        tenDangNhap: data.tenDangNhap,
        matKhau: data.matKhau
      });

      const userData = {
        id: loginData.userId,
        id_nguoi_dung: loginData.userId,
        id_nhan_vien: loginData.userId,
        ten_dang_nhap: data.tenDangNhap,
        ho_ten: loginData.displayName,
        type: loginData.type,       // 'employee' hoặc 'customer'
        vai_tro: loginData.role,    // 'ADMIN' | 'STORE_MANAGER' | 'WAREHOUSE_STAFF' | 'SALES_STAFF' | 'CUSTOMER'
        token: loginData.token,     // JWT token
      };

      setUser(userData);
      sessionStorage.setItem('user', JSON.stringify(userData));

      return { success: true, ...userData };
    } catch (error) {
      console.error('Lỗi đăng nhập:', error);
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem('user');
    window.location.href = '/';
  };

  // ========== Role Helpers ==========

  const getRole = () => (user?.vai_tro || '').toUpperCase();

  /** Chỉ ADMIN root */
  const isAdmin = () => getRole() === 'ADMIN';

  /** ADMIN + DIRECTOR — xem báo cáo, dashboard toàn hệ thống */
  const isDirector = () => ['ADMIN', 'DIRECTOR'].includes(getRole());

  /** ADMIN + DIRECTOR + STORE_MANAGER — quản lý vận hành */
  const isStoreManager = () => ['ADMIN', 'DIRECTOR', 'STORE_MANAGER'].includes(getRole());

  /** ADMIN + DIRECTOR + STORE_MANAGER + WAREHOUSE_STAFF — quản lý kho */
  const isWarehouseStaff = () => ['ADMIN', 'DIRECTOR', 'STORE_MANAGER', 'WAREHOUSE_STAFF'].includes(getRole());

  /** Nhà cung cấp */
  const isSupplier = () => getRole() === 'SUPPLIER';

  /** Bất kỳ nhân viên nội bộ nào (để vào CMS) */
  const isNhanVien = () => {
    if (!user) return false;
    return user.type === 'employee' || EMPLOYEE_ROLES.includes(getRole());
  };

  /** Khách hàng đã đăng nhập */
  const isUser = () => user !== null && user.type === 'customer';

  // ========== Helpers lấy nhãn hiển thị của vai trò ==========
  const getRoleLabel = (vaiTro) => {
    const map = {
      'ADMIN':           'Admin Root',
      'DIRECTOR':        'Giám đốc',
      'STORE_MANAGER':   'Cửa hàng trưởng',
      'WAREHOUSE_STAFF': 'Nhân viên kho',
      'SUPPLIER':        'Nhà cung cấp',
      'CUSTOMER':        'Khách hàng',
      'STAFF':           'Nhân viên',   // backward compat
    };
    return map[(vaiTro || '').toUpperCase()] || vaiTro || 'Không xác định';
  };

  const value = {
    user,
    authLoading: loading,
    loginUser,
    logout,
    // Role checks
    isAdmin,
    isDirector,
    isStoreManager,
    isWarehouseStaff,
    isSupplier,
    isNhanVien,
    isUser,
    getRole,
    getRoleLabel,
    getCurrentUser: () => user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
