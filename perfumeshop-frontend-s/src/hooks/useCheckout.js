import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import { PAYMENT_METHODS, TAX_RATE } from '../utils/posConstants';

const useCheckout = () => {
  const { staff } = useAuth();
  const [paymentMethod, setPaymentMethod] = useState(PAYMENT_METHODS.CASH);
  const [cashReceived, setCashReceived] = useState('');
  const [showCheckout, setShowCheckout] = useState(false);

  const validateCheckout = (cart, customerName) => {
    if (cart.length === 0) return { valid: false, message: 'Giỏ hàng trống' };

    if (!customerName.trim()) {
      return { valid: false, message: 'Vui lòng nhập tên khách hàng' };
    }

    if (!staff) {
      return { valid: false, message: 'Chỉ nhân viên mới được phép sử dụng POS' };
    }

    // Validate cash payment
    if (paymentMethod === PAYMENT_METHODS.CASH) {
      const cashReceivedNum = parseFloat(cashReceived) || 0;
      const total = cart.reduce((sum, item) => sum + (item.gia_ban * item.quantity), 0) * 1.1; // including tax

      if (cashReceivedNum < total) {
        return { valid: false, message: 'Số tiền nhận chưa đủ!' };
      }
    }

    return { valid: true };
  };

  const processPayment = async (cart, customerName, customerPhone) => {
    const validation = validateCheckout(cart, customerName);
    if (!validation.valid) {
      alert(validation.message);
      return { success: false };
    }

    // Validation dựa trên phương thức thanh toán
    const cashReceivedNum = parseFloat(cashReceived) || 0;
    const subtotal = cart.reduce((sum, item) => sum + (item.gia_ban * item.quantity), 0);
    const tax = subtotal * TAX_RATE;
    const total = subtotal + tax;

    if (paymentMethod === PAYMENT_METHODS.CASH && cashReceivedNum < total) {
      alert('Số tiền nhận chưa đủ!');
      return { success: false };
    }

    // Additional confirmation for pre-orders (backend tự động xử lý hoàn cọc)
    if (paymentMethod === PAYMENT_METHODS.DEPOSIT) {
      const confirm = window.confirm(
        'Đây là đơn hàng đặt trước. Việc hủy đơn sẽ được xử lý theo quy định. Bạn có chắc chắn muốn tiếp tục?'
      );
      if (!confirm) return { success: false };
    }

    try {
      console.log('Staff data:', staff);
      console.log('Staff ID:', staff?.id_nhan_vien);

      // Prepare items data for backend - matching ItemInput format
      const itemsInput = cart.map(item => ({
        sanPhamId: item.id_san_pham,
        soLuong: item.quantity,
        gia: item.gia_ban
      }));

      console.log('Items input:', itemsInput);
      console.log('Payment method:', paymentMethod);
      console.log('Customer name:', customerName);

      let orderData;

      // Call appropriate backend POS API based on payment method
      if (paymentMethod === PAYMENT_METHODS.DEPOSIT) {
        // Use POS Order API (deposit - 50% payment, wait for stock)
        console.log('Calling createPosOrder with params:', {
          employeeId: staff?.id_nhan_vien,
          customerId: null,
          customerName: customerName,
          items: itemsInput
        });
        orderData = await api.createPosOrder(
          staff?.id_nhan_vien,
          null, // No customer ID for walk-in customers
          customerName,
          itemsInput
        );
      } else {
        // Use POS Sale API (full payment, complete immediately)
        console.log('Calling createPosBanLe with params:', {
          employeeId: staff?.id_nhan_vien,
          customerId: null,
          customerName: customerName,
          items: itemsInput
        });
        orderData = await api.createPosBanLe(
          staff?.id_nhan_vien,
          null, // No customer ID for walk-in customers
          customerName,
          itemsInput
        );
      }

      console.log('Order created successfully:', orderData);

      // Calculate change for cash payments
      const change = paymentMethod === PAYMENT_METHODS.CASH ? cashReceivedNum - total : 0;

      // Create receipt data
      const receiptData = {
        customerName,
        customerPhone,
        paymentMethod,
        cart: [...cart],
        subtotal,
        tax,
        total,
        cashReceived: cashReceivedNum,
        change,
        orderId: orderData?.idDonHang || Date.now()
      };

      alert('Đơn hàng đã được tạo thành công!');

      return {
        success: true,
        receiptData
      };

    } catch (error) {
      console.error('Error creating POS order:', error);
      alert('Không thể tạo đơn hàng: ' + error.message);
      return { success: false };
    }
  };

  const resetCheckout = () => {
    setPaymentMethod(PAYMENT_METHODS.CASH);
    setCashReceived('');
    setShowCheckout(false);
  };

  return {
    paymentMethod,
    setPaymentMethod,
    cashReceived,
    setCashReceived,
    showCheckout,
    setShowCheckout,
    validateCheckout,
    processPayment,
    resetCheckout
  };
};

export default useCheckout;


