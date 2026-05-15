import { useState } from 'react';
import api from '../services/api';

const useCancelOrder = () => {
  const [cancelLoading, setCancelLoading] = useState(null);

  const cancelOrder = async (orderId, onSuccess, order) => {
    const reason = prompt('Vui lòng nhập lý do hủy đơn hàng:');
    if (!reason || reason.trim() === '') {
      alert('Vui lòng nhập lý do hủy đơn hàng');
      return;
    }

    // Additional confirmation for pre-orders (backend tự động xử lý hoàn cọc)
    if (order && order.trangThaiVanHanh === 'Chờ hàng') {
      const confirm = window.confirm(
        'Đây là đơn hàng đặt trước. Việc hủy đơn sẽ được xử lý theo quy định. Bạn có chắc chắn muốn hủy?'
      );
      if (!confirm) return;
    }

    try {
      setCancelLoading(orderId);
      await api.cancelOrder(orderId, reason);
      alert('Đơn hàng đã được hủy thành công');
      if (onSuccess) onSuccess();
    } catch (error) {
      alert('Hủy đơn hàng thất bại: ' + (error.message || 'Vui lòng thử lại'));
      console.error('Error canceling order:', error);
    } finally {
      setCancelLoading(null);
    }
  };

  return {
    cancelOrder,
    cancelLoading
  };
};

export default useCancelOrder;

