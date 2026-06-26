import { useState, useEffect } from 'react';
import api from '../services/api';

const useShippingForm = (user) => {
  const [shippingInfo, setShippingInfo] = useState({
    tenNguoiNhan: '',
    diaChiGiaoHang: '',
    soDienThoai: '',
    ghiChu: ''
  });

  // Auto-populate shipping info when user logs in
  useEffect(() => {
    if (user) {
      const loadUserProfile = async () => {
        try {
          // Fetch full user profile to get address and phone
          const profile = await api.getProfile();
          setShippingInfo({
            tenNguoiNhan: profile.ho_ten || user.ho_ten || '',
            diaChiGiaoHang: profile.dia_chi || '',
            soDienThoai: profile.so_dien_thoai || '',
            ghiChu: ''
          });
        } catch (error) {
          console.error('Lỗi tải thông tin cá nhân:', error);
          // Fallback to basic user info from auth
          setShippingInfo({
            tenNguoiNhan: user.ho_ten || '',
            diaChiGiaoHang: '',
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
