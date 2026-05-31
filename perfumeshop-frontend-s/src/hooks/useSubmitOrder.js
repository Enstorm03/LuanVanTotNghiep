import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import { validateShippingForm } from '../utils/checkoutUtils';

const useSubmitOrder = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(false);

  const submitOrder = async (checkoutData, shippingInfo, paymentMethod) => {
    if (!validateShippingForm(shippingInfo)) return;

    try {
      setProcessing(true);

      const orderData = {
        userId: user?.id_nguoi_dung,
        tenNguoiNhan: shippingInfo.tenNguoiNhan.trim(),
        diaChiGiaoHang: shippingInfo.diaChiGiaoHang.trim(),
        soDienThoai: shippingInfo.soDienThoai.trim(),
        ghiChu: shippingInfo.ghiChu.trim(),
        phuongThucThanhToan: paymentMethod,
      };

      const result = await api.checkoutCart(orderData);

      alert('Đặt hàng thành công! Mã đơn hàng: ' + result.idDonHang);

      // Xóa giỏ hàng sau khi đặt hàng thành công
      try {
        await api.clearCart(user.id_nguoi_dung);
      } catch (clearError) {
        console.error('Lỗi xóa giỏ hàng sau thanh toán:', clearError);
      }

      navigate('/lich-su-don-hang');

    } catch (error) {
      alert('Không thể đặt hàng: ' + error.message);
    } finally {
      setProcessing(false);
    }
  };

  return {
    submitOrder,
    processing
  };
};

export default useSubmitOrder;
