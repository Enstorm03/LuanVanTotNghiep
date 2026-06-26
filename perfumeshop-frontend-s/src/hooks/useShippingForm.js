import { useState, useEffect } from 'react';
import userApi from '../services/api/userApi';

const useShippingForm = (user) => {
  const [shippingInfo, setShippingInfo] = useState({
    tenNguoiNhan: '',
    diaChiGiaoHang: '',
    soDienThoai: '',
    ghiChu: ''
  });

  // Auto-populate shipping info when user logs in
  useEffect(() => {
    if (user && user.userId) {
      const loadUserProfile = async () => {
        try {
          // Fetch full user profile to get address and phone
          // Send user ID in X-User-Id header
          const profile = await userApi.getProfile(user.userId);
          console.log('Profile loaded:', profile);
          
          setShippingInfo({
            tenNguoiNhan: profile.ho_ten || user.hoTen || user.ho_ten || '',
            diaChiGiaoHang: profile.dia_chi || '',
            soDienThoai: profile.so_dien_thoai || '',
            ghiChu: ''
          });
        } catch (error) {
          console.error('Lỗi tải thông tin cá nhân:', error);
          // Fallback to basic user info from auth (user object from login)
          setShippingInfo({
            tenNguoiNhan: user.ho_ten || user.hoTen || '',
            diaChiGiaoHang: user.dia_chi || '',
            soDienThoai: '',
            ghiChu: ''
          });
        }
      };

      loadUserProfile();
    }
  }, [user]);

  const updateShippingInfo = (field, value) => {
    setShippingInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const resetShippingInfo = () => {
    setShippingInfo({
      tenNguoiNhan: '',
      diaChiGiaoHang: '',
      soDienThoai: '',
      ghiChu: ''
    });
  };

  return {
    shippingInfo,
    updateShippingInfo,
    resetShippingInfo
  };
};

export default useShippingForm;
