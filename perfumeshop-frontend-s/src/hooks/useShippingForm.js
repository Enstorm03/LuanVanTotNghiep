import { useState, useEffect } from 'react';
import userApi from '../services/api/userApi';

const useShippingForm = (user) => {
  const [shippingInfo, setShippingInfo] = useState({
    tenNguoiNhan: '',
    diaChiGiaoHang: '',
    soDienThoai: '',
    ghiChu: ''
  });
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);

  // Auto-populate shipping info when user logs in
  useEffect(() => {
    if (user) {
      const loadUserProfile = async () => {
        setIsLoadingProfile(true);
        try {
          // Get userId from various possible field names
          const userId = user.id_nguoi_dung || user.userId || user.id;
          
          if (!userId) {
            console.warn('No userId found in user object:', user);
            // Use whatever info is available from auth
            setShippingInfo({
              tenNguoiNhan: user.ho_ten || user.hoTen || '',
              diaChiGiaoHang: user.dia_chi || user.diaChi || '',
              soDienThoai: user.so_dien_thoai || user.soDienThoai || '',
              ghiChu: ''
            });
            return;
          }

          // Fetch full user profile to get complete address and phone
          const profile = await userApi.getProfile(userId);
          console.log('✅ Auto-filled shipping info from profile:', {
            name: profile.ho_ten,
            hasAddress: !!profile.dia_chi,
            hasPhone: !!profile.so_dien_thoai
          });
          
          setShippingInfo({
            tenNguoiNhan: profile.ho_ten || user.ho_ten || user.hoTen || '',
            diaChiGiaoHang: profile.dia_chi || '',
            soDienThoai: profile.so_dien_thoai || '',
            ghiChu: ''
          });
        } catch (error) {
          console.error('❌ Lỗi tải thông tin cá nhân:', error);
          // Fallback to basic user info from auth
          setShippingInfo({
            tenNguoiNhan: user.ho_ten || user.hoTen || '',
            diaChiGiaoHang: user.dia_chi || user.diaChi || '',
            soDienThoai: user.so_dien_thoai || user.soDienThoai || '',
            ghiChu: ''
          });
        } finally {
          setIsLoadingProfile(false);
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
    resetShippingInfo,
    isLoadingProfile
  };
};

export default useShippingForm;
