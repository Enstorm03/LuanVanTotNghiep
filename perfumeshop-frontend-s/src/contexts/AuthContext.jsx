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

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = sessionStorage.getItem('user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
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

      // Chỉ sử dụng vai_tro, không dùng role nữa
      const userData = {
        id: loginData.userId,
        id_nguoi_dung: loginData.userId,
        id_nhan_vien: loginData.userId,
        ten_dang_nhap: data.tenDangNhap,
        ho_ten: loginData.displayName,
        type: loginData.type,            // 'employee' hoặc 'customer'
        vai_tro: loginData.role          // Lấy từ BE 'ADMIN' hoặc 'STAFF'
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

  // QUAN TRỌNG: Chỉ trả về true nếu thực sự là ADMIN
  const isAdmin = () => {
    if (!user) return false;
    const vaiTro = (user.vai_tro || '').toUpperCase();
    return vaiTro === 'ADMIN';
  };

  // Dành cho mọi nhân viên nội bộ (bao gồm cả Admin và Staff) để vào CMS
  const isNhanVien = () => {
    if (!user) return false;
    const vaiTro = (user.vai_tro || '').toUpperCase();
    return user.type === 'employee' || vaiTro === 'ADMIN' || vaiTro === 'STAFF';
  };

  const value = {
    user,
    authLoading: loading,
    loginUser,
    logout,
    isAdmin,      // Để check hiện mục "Tài khoản"
    isNhanVien,   // Để check quyền vào trang Admin CMS
    isUser: () => user !== null && user.type === 'customer',
    getCurrentUser: () => user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};