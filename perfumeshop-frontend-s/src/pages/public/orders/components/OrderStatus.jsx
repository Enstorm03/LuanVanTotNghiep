import React, { useState } from 'react';
import OrderItems from './order-list/OrderItems';
import { formatCurrency } from '../../../../utils/checkoutCalculations';
import api from '../../../../services/api';

const OrderStatus = ({ order, onOrderUpdate }) => {
  const [updatingPayment, setUpdatingPayment] = useState(false);

  const isWaitingForStock = order.trangThaiVanHanh === 'Chờ hàng';
  const isWaitingForDeposit = order.trangThaiThanhToan === 'Chờ cọc';

  const handleConfirmDeposit = async () => {
    if (!window.confirm('Bạn có chắc chắn muốn xác nhận đã nhận cọc cho đơn hàng này?')) {
      return;
    }

    try {
      setUpdatingPayment(true);
      await api.updatePaymentStatus(order.idDonHang, true);

      // Update local order status
      const updatedOrder = {
        ...order,
        trangThaiThanhToan: 'Đã thanh toán'
      };

      if (onOrderUpdate) {
        onOrderUpdate(updatedOrder);
      }

      alert('Đã xác nhận thanh toán cọc thành công!');
    } catch (error) {
      console.error('Error updating payment status:', error);
      alert('Không thể cập nhật trạng thái thanh toán: ' + error.message);
    } finally {
      setUpdatingPayment(false);
    }
  };

  return (
    <div className={`order-status ${isWaitingForStock ? 'waiting-stock' : ''}`}>
      <div className="flex justify-between items-center mb-4">
        <h3>Trạng thái đơn hàng: {order.trangThaiVanHanh}</h3>
        {isWaitingForDeposit && (
          <button
            onClick={handleConfirmDeposit}
            disabled={updatingPayment}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
          >
            {updatingPayment ? 'Đang xử lý...' : 'Xác nhận cọc'}
          </button>
        )}
      </div>

      {/* Payment Status */}
      <div className="mb-4">
        <span className="text-sm text-gray-600 dark:text-gray-400">
          Trạng thái thanh toán: <strong>{order.trangThaiThanhToan}</strong>
        </span>
      </div>

      {isWaitingForStock && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-4">
          <div className="flex items-start gap-3">
            <i className="fas fa-clock text-yellow-600 mt-1"></i>
            <div>
              <strong className="text-yellow-800 dark:text-yellow-200">Đơn hàng đang chờ nhập thêm hàng</strong>
              <p className="text-yellow-700 dark:text-yellow-300 mt-1">Một số sản phẩm đang tạm hết hàng. Chúng tôi sẽ liên hệ ngay khi có hàng.</p>
              {order.tienDatCoc && (
                <p className="text-yellow-700 dark:text-yellow-300 mt-1">
                  Số tiền cần thanh toán trước: {formatCurrency(order.tienDatCoc)}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {isWaitingForDeposit && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-4">
          <div className="flex items-start gap-3">
            <i className="fas fa-money-bill-wave text-blue-600 mt-1"></i>
            <div>
              <strong className="text-blue-800 dark:text-blue-200">Đang chờ thanh toán cọc</strong>
              <p className="text-blue-700 dark:text-blue-300 mt-1">
                Khách hàng cần thanh toán số tiền cọc để xác nhận đơn hàng.
              </p>
              {order.tienDatCoc && (
                <p className="text-blue-700 dark:text-blue-300 mt-1">
                  Số tiền cọc: {formatCurrency(order.tienDatCoc)}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="order-items">
        <OrderItems items={order.chiTiet} />
      </div>
    </div>
  );
};

export default OrderStatus;
