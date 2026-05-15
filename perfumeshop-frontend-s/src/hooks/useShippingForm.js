import { useState } from 'react';

const useShippingForm = () => {
  const [shippingInfo, setShippingInfo] = useState({
    tenNguoiNhan: '',
    diaChiGiaoHang: '',
    soDienThoai: '',
    ghiChu: ''
  });

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
