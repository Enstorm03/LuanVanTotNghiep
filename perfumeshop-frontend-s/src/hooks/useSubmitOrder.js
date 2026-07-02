import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import { validateShippingForm } from '../utils/checkoutUtils';

const useSubmitOrder = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(false);

  const submitOrder = async (checkoutData, shippingInfo, paymentMethod, campaign) => {
    if (!validateShippingForm(shippingInfo)) return;
    
    // Validate user đã đăng nhập
    if (!user || !user.id_nguoi_dung) {
      alert('Vui lòng đăng nhập để đặt hàng');
      return;
    }

    try {
      setProcessing(true);

      // Chuyển đổi items thành định dạng API mong đợi
      // checkoutData come from cart.chiTiet which uses camelCase: sanPhamId, soLuong
      const items = (Array.isArray(checkoutData) ? checkoutData : []).map(item => ({
        sanPhamId: item.sanPhamId || item.id_san_pham,
        soLuong: item.soLuong || item.so_luong
      }));
      
      // Validate items không rỗng
      if (!items || items.length === 0) {
        alert('Giỏ hàng rỗng, vui lòng thêm sản phẩm');
        setProcessing(false);
        return;
      }

      const orderData = {
        idNguoiDung: user.id_nguoi_dung,
        tenNguoiNhan: shippingInfo.tenNguoiNhan.trim(),
        diaChiGiaoHang: shippingInfo.diaChiGiaoHang.trim(),
        soDienThoai: shippingInfo.soDienThoai.trim(),
        ghiChu: shippingInfo.ghiChu.trim(),
        phuongThucThanhToan: paymentMethod,
        items: items,
        idSuKien: campaign?.idSuKien || null,
        giamGiaHangLoat: campaign?.giamGiaHangLoat || 0,
      };

      // Bước 1: Tạo đơn hàng
      const result = await api.checkoutCart(orderData);
      const idDonHang = result.idDonHang;

      // Bước 2: Xử lý theo phương thức thanh toán
      if (paymentMethod === 'online') {
        // Tạo link PayOS và redirect
        const paymentRes = await api.createPaymentLink(idDonHang);
        if (paymentRes?.checkoutUrl) {
          // Redirect sang trang thanh toán PayOS (VietQR / các ví điện tử)
          window.location.href = paymentRes.checkoutUrl;
          return; // Dừng tại đây, không navigate
        } else {
          throw new Error('Không tạo được link thanh toán');
        }
      }

      // COD hoặc phương thức khác: xử lý bình thường
      alert('Đặt hàng thành công! Mã đơn hàng: ' + idDonHang);

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

  return { submitOrder, processing };
};

export default useSubmitOrder;
