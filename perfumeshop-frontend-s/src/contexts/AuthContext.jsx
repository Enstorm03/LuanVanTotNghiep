import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

// Auth Context để quản lý authentication cho cả user và nhân viên
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
  const [staff, setStaff] = useState(null);
  const [loading, setLoading] = useState(true);

  // Khôi phục session từ localStorage khi app khởi động
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const savedStaff = localStorage.getItem('staff');

    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    if (savedStaff) {
      setStaff(JSON.parse(savedStaff));
    }

    setLoading(false);
  }, []);

  // Login cho người dùng thông thường (từ Nguoi_Dung table)
  const loginUser = async (data) => {
    try {
      const loginData = await api.login({
        ...data,
        loai: 'customer'
      });

      const userData = {
        id_nguoi_dung: loginData.userId,
        ten_dang_nhap: data.tenDangNhap,
        ho_ten: loginData.displayName
      };

      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));

      // Clear staff login if user logs in
      setStaff(null);
      localStorage.removeItem('staff');

      return { success: true, user: userData };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Login cho nhân viên (từ Nhan_Vien table)
  const loginStaff = async (data) => {
    try {
      const loginData = await api.login({
        ...data,
        loai: 'employee'
      });

      const staffData = {
        id_nhan_vien: loginData.userId,
        ten_dang_nhap: data.tenDangNhap,
        ho_ten: loginData.displayName,
        vai_tro: loginData.role
      };

      setStaff(staffData);
      localStorage.setItem('staff', JSON.stringify(staffData));

      // Clear user login if staff logs in
      setUser(null);
      localStorage.removeItem('user');

      return { success: true, staff: staffData };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Logout
  const logout = () => {
    setUser(null);
    setStaff(null);
    localStorage.removeItem('user');
    localStorage.removeItem('staff');
  };

  // Check roles
  const isStaff = () => staff !== null;
  const isAdmin = () => staff?.vai_tro?.toLowerCase() === 'admin';
  const isUser = () => user !== null;

  // Get current user (user hoặc staff)
  const getCurrentUser = () => {
    if (staff) return { ...staff, userType: 'staff' };
    if (user) return { ...user, userType: 'customer' };
    return null;
  };

  const value = {
    user,
    staff,
    authLoading: loading, // Đổi tên để tránh trùng lặp
    loginUser,
    loginStaff,
    logout,
    isStaff,
    isAdmin,
    isUser,
    getCurrentUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
