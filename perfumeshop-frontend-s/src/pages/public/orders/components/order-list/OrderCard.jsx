import React from 'react';
import OrderItems from './OrderItems';
import OrderFooter from './OrderFooter';
import OrderStatus from '../OrderStatus';
import { getStatusBadgeColor, formatOrderDate, canCancelOrder, canWriteReview, canRequestReturn } from '../../../../../utils/orderUtils';

const OrderCard = ({
  order,
  returnStatuses,
  cancelLoading,
  onCancelOrder,
  onWriteReview,
  onRequestReturn,
  onOrderUpdate
}) => {
  // Use OrderStatus for orders that need special handling (waiting for deposit/stock)
  const needsSpecialHandling = order.trangThaiThanhToan === 'Chờ cọc' || order.trangThaiVanHanh === 'Chờ hàng';

  if (needsSpecialHandling) {
    return (
      <div className="bg-surface-light dark:bg-surface-dark rounded-xl p-6 shadow-sm">
        {/* Order Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold">
              Đơn hàng #{order.idDonHang}
            </h3>
            <div className="text-sm text-text-secondary-light dark:text-text-secondary-dark space-y-1">
              <p>Ngày đặt: {formatOrderDate(order.ngayDatHang)}</p>
              {order.ngayHoanThanh && (
                <p>Ngày hoàn thành: {formatOrderDate(order.ngayHoanThanh)}</p>
              )}
              {order.maVanDon && (
                <p>Mã vận đơn: {order.maVanDon}</p>
              )}
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 mt-2 sm:mt-0">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(order.trangThaiVanHanh)}`}>
              {order.trangThaiVanHanh}
            </span>
            {canWriteReview(order) && (
              <button
                onClick={() => onWriteReview(order)}
                className="px-4 py-2 bg-yellow-500 text-white text-sm rounded-lg hover:bg-yellow-600 transition-colors"
              >
                Viết đánh giá
              </button>
            )}
            {canRequestReturn(order, order.ngayDatHang, returnStatuses[order.idDonHang]) && (
              <button
                onClick={() => onRequestReturn(order)}
                className="px-4 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors"
              >
                Yêu cầu đổi trả
              </button>
            )}
            {canCancelOrder(order) && (
              <button
                onClick={() => onCancelOrder(order.idDonHang)}
                disabled={cancelLoading === order.idDonHang}
                className="px-4 py-2 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition-colors disabled:bg-gray-400"
              >
                {cancelLoading === order.idDonHang ? 'Đang hủy...' : 'Hủy đơn'}
              </button>
            )}
          </div>
        </div>

        {/* Use OrderStatus for special handling */}
        <OrderStatus order={order} onOrderUpdate={onOrderUpdate} />
      </div>
    );
  }

  // Default order card for normal orders
  return (
    <div className="bg-surface-light dark:bg-surface-dark rounded-xl p-6 shadow-sm">
      {/* Order Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold">
            Đơn hàng #{order.idDonHang}
          </h3>
          <div className="text-sm text-text-secondary-light dark:text-text-secondary-dark space-y-1">
            <p>Ngày đặt: {formatOrderDate(order.ngayDatHang)}</p>
            {order.ngayHoanThanh && (
              <p>Ngày hoàn thành: {formatOrderDate(order.ngayHoanThanh)}</p>
            )}
            {order.maVanDon && (
              <p>Mã vận đơn: {order.maVanDon}</p>
            )}
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2 mt-2 sm:mt-0">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(order.trangThaiVanHanh)}`}>
            {order.trangThaiVanHanh}
          </span>
          {canWriteReview(order) && (
            <button
              onClick={() => onWriteReview(order)}
              className="px-4 py-2 bg-yellow-500 text-white text-sm rounded-lg hover:bg-yellow-600 transition-colors"
            >
              Viết đánh giá
            </button>
          )}
          {canRequestReturn(order, order.ngayDatHang, returnStatuses[order.idDonHang]) && (
            <button
              onClick={() => onRequestReturn(order)}
              className="px-4 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors"
            >
              Yêu cầu đổi trả
            </button>
          )}
          {canCancelOrder(order) && (
            <button
              onClick={() => onCancelOrder(order.idDonHang)}
              disabled={cancelLoading === order.idDonHang}
              className="px-4 py-2 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition-colors disabled:bg-gray-400"
            >
              {cancelLoading === order.idDonHang ? 'Đang hủy...' : 'Hủy đơn'}
            </button>
          )}
        </div>
      </div>

      {/* Cancellation Reason */}
      {order.trangThaiVanHanh === 'Đã hủy' && order.lyDoHuy && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 mb-4">
          <p className="text-sm text-red-800 dark:text-red-200">
            <strong>Lý do hủy:</strong> {order.lyDoHuy}
          </p>
        </div>
      )}

      {/* Order Items */}
      <div className="border-t border-border-light dark:border-border-dark pt-4">
        <OrderItems items={order.chiTiet} />
        <OrderFooter order={order} />
      </div>
    </div>
  );
};

export default OrderCard;
