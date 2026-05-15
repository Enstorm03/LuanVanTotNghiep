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

      if (checkoutData.isPreOrder) {
        // Pre-order items are handled in the preOrderPayload below
      } else {
        // Regular cart checkout - cart data is fetched in checkoutCart method
      }

      // Check if this is explicitly a backorder request
      const isBackorder = checkoutData.isBackorder || false;

      let stockCheck = { isAllInStock: true, outOfStockItems: [] };

      // Stock checking is now done in ThanhToanPage component
      // and passed via checkoutData.stockCheck
      if (checkoutData.stockCheck) {
        stockCheck = checkoutData.stockCheck;
      }

      // Only show confirmation dialog if not explicitly a backorder
      if (!isBackorder && stockCheck && !stockCheck.isAllInStock) {
        // Show confirmation dialog for out-of-stock items
        const confirmOrder = window.confirm(
          `Một số sản phẩm đã hết hàng:\n\n` +
          `${stockCheck.outOfStockItems.map(item =>
            `- ${item.tenSanPham} (Còn lại: ${item.soLuongConLai})`
          ).join('\n')}\n\n` +
          `Bạn có muốn đặt hàng trước không? Chúng tôi sẽ liên hệ khi có hàng.`
        );

        if (!confirmOrder) return;
      }

      let result;

      if (checkoutData.isPreOrder) {
        // Handle pre-order
        const preOrderPayload = {
          idNguoiDung: user.id_nguoi_dung,
          tenNguoiNhan: shippingInfo.tenNguoiNhan.trim(),
          diaChiGiaoHang: shippingInfo.diaChiGiaoHang.trim(),
          soDienThoai: shippingInfo.soDienThoai.trim(),
          ghiChu: checkoutData.preOrderData.ghiChu || shippingInfo.ghiChu.trim(),
          phuongThucThanhToan: paymentMethod,
          allowBackorder: isBackorder ? "true" : "false", // Add backorder flag as string
          items: checkoutData.preOrderData.items.map(item => ({
            sanPhamId: item.id_san_pham,
            soLuong: item.quantity,
            giaTaiThoiDiemMua: item.gia_ban
          }))
        };

        result = await api.placeOrder(preOrderPayload);

        // Clear pre-order data
        localStorage.removeItem('pre-order-data');
      } else {
        // Handle regular cart checkout
        console.log('User object:', user);
        console.log('User ID:', user?.id_nguoi_dung);

        const orderData = {
          userId: user?.id_nguoi_dung,
          tenNguoiNhan: shippingInfo.tenNguoiNhan.trim(),
          diaChiGiaoHang: shippingInfo.diaChiGiaoHang.trim(),
          soDienThoai: shippingInfo.soDienThoai.trim(),
          ghiChu: shippingInfo.ghiChu.trim(),
          phuongThucThanhToan: paymentMethod,
          allowBackorder: isBackorder ? "true" : "false" // Add backorder flag for regular orders too
        };

        console.log('Order data to send:', orderData);
        console.log('isBackorder:', isBackorder);
        console.log('allowBackorder flag:', orderData.allowBackorder);

        result = await api.checkoutCart(orderData);
      }

      // Show success message based on order status
      if (result.trangThaiVanHanh === 'Chờ hàng') {
        alert('Đặt hàng thành công! Đơn hàng của bạn đang chờ nhập thêm hàng. Chúng tôi sẽ liên hệ sớm nhất.');
      } else {
        alert('Đặt hàng thành công! Mã đơn hàng: ' + result.idDonHang);
      }

      // Clear cart after successful checkout (for regular orders)
      if (!checkoutData.isPreOrder) {
        try {
          await api.clearCart(user.id_nguoi_dung);
          console.log('Cart cleared after successful checkout');
        } catch (clearError) {
          console.error('Error clearing cart after checkout:', clearError);
          // Don't show error to user as checkout was successful
        }
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
