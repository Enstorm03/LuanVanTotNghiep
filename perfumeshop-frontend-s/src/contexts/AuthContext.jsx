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

// Danh sách vai trò hợp lệ cho nhân viên
// Hierarchy: ADMIN > STORE_MANAGER > WAREHOUSE_STAFF / SALES_STAFF
const EMPLOYEE_ROLES = ['ADMIN', 'STORE_MANAGER', 'WAREHOUSE_STAFF', 'SALES_STAFF'];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = sessionStorage.getItem('user');
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        // Nếu là nhân viên nhưng không có token → session cũ, xóa đi
        // để buộc đăng nhập lại lấy JWT mới
        if (parsed.type === 'employee' && !parsed.token) {
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

  /** Chỉ ADMIN */
  const isAdmin = () => getRole() === 'ADMIN';

  /** ADMIN + STORE_MANAGER */
  const isStoreManager = () => ['ADMIN', 'STORE_MANAGER'].includes(getRole());

  /** ADMIN + STORE_MANAGER + WAREHOUSE_STAFF */
  const isWarehouseStaff = () => ['ADMIN', 'STORE_MANAGER', 'WAREHOUSE_STAFF'].includes(getRole());

  /** ADMIN + STORE_MANAGER + SALES_STAFF */
  const isSalesStaff = () => ['ADMIN', 'STORE_MANAGER', 'SALES_STAFF'].includes(getRole());

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
      'ADMIN': 'Admin',
      'STORE_MANAGER': 'Cửa hàng trưởng',
      'WAREHOUSE_STAFF': 'Nhân viên kho',
      'SALES_STAFF': 'Nhân viên bán hàng',
      'CUSTOMER': 'Khách hàng',
      'STAFF': 'Nhân viên',       // backward compat
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
    isStoreManager,
    isWarehouseStaff,
    isSalesStaff,
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
