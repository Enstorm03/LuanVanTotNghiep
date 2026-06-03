import React, { useState } from 'react';
import OrderItems from './OrderItems';
import OrderFooter from './OrderFooter';
import OrderStatus from '../OrderStatus';
import OrderQRModal from '../OrderQRModal';
import {
  getStatusBadgeColor,
  formatOrderDate,
  canCancelOrder,
  canWriteReview,
  canRequestReturn,
} from '../../../../../utils/orderUtils';

// Nút QR — hiện khi đơn đang giao hàng
const QRButton = ({ onClick }) => (
  <button
    onClick={onClick}
    className="px-4 py-2 bg-indigo-500 text-white text-sm rounded-lg hover:bg-indigo-600 transition-colors flex items-center gap-1"
  >
    <span className="material-symbols-outlined text-base">qr_code</span>
    QR nhận hàng
  </button>
);

// Nội dung header chung cho cả 2 loại card
const CardHeader = ({ order, returnStatuses, cancelLoading, onCancelOrder, onWriteReview, onRequestReturn, onShowQR }) => (
  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
    <div>
      <h3 className="text-lg font-bold">Đơn hàng #{order.idDonHang}</h3>
      <div className="text-sm text-text-secondary-light dark:text-text-secondary-dark space-y-1">
        <p>Ngày đặt: {formatOrderDate(order.ngayDatHang)}</p>
        {order.ngayHoanThanh && <p>Ngày hoàn thành: {formatOrderDate(order.ngayHoanThanh)}</p>}
        {order.maVanDon && <p>Mã vận đơn: {order.maVanDon}</p>}
      </div>
    </div>

    <div className="flex flex-wrap items-center gap-2 mt-2 sm:mt-0">
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(order.trangThaiVanHanh)}`}>
        {order.trangThaiVanHanh}
      </span>

      {/* Nút QR khi đang giao */}
      {order.trangThaiVanHanh === 'Đang giao hàng' && <QRButton onClick={onShowQR} />}

      {canWriteReview(order) && (
        <button
          onClick={() => onWriteReview(order)}
          className="px-4 py-2 bg-yellow-500 text-white text-sm rounded-lg hover:bg-yellow-600 transition-colors"
        >
          Viết đánh giá
        </button>
      )}

      {/* Badge trạng thái đổi trả */}
      {returnStatuses[order.idDonHang]?.hasReturnRequest && (
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
          returnStatuses[order.idDonHang]?.returnStatus === 'Hoàn tiền thành công'
            ? 'bg-teal-100 text-teal-800'
            : returnStatuses[order.idDonHang]?.returnStatus === 'Từ chối'
            ? 'bg-red-100 text-red-800'
            : 'bg-yellow-100 text-yellow-800'
        }`}>
          Đổi trả: {returnStatuses[order.idDonHang]?.returnStatus}
        </span>
      )}

      {canRequestReturn(order, order.ngayHoanThanh, returnStatuses[order.idDonHang]) && (
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
);

const OrderCard = ({
  order,
  returnStatuses,
  cancelLoading,
  onCancelOrder,
  onWriteReview,
  onRequestReturn,
  onOrderUpdate,
}) => {
  const [showQR, setShowQR] = useState(false);

  const needsSpecialHandling =
    order.trangThaiThanhToan === 'Chờ cọc' || order.trangThaiVanHanh === 'Chờ hàng';

  const sharedHeaderProps = {
    order,
    returnStatuses,
    cancelLoading,
    onCancelOrder,
    onWriteReview,
    onRequestReturn,
    onShowQR: () => setShowQR(true),
  };

  return (
    <>
      {needsSpecialHandling ? (
        <div className="bg-surface-light dark:bg-surface-dark rounded-xl p-6 shadow-sm">
          <CardHeader {...sharedHeaderProps} />
          <OrderStatus order={order} onOrderUpdate={onOrderUpdate} />
        </div>
      ) : (
        <div className="bg-surface-light dark:bg-surface-dark rounded-xl p-6 shadow-sm">
          <CardHeader {...sharedHeaderProps} />

          {order.trangThaiVanHanh === 'Đã hủy' && order.lyDoHuy && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 mb-4">
              <p className="text-sm text-red-800 dark:text-red-200">
                <strong>Lý do hủy:</strong> {order.lyDoHuy}
              </p>
            </div>
          )}

          {/* Thông báo đang giao — nhắc khách quét QR */}
          {order.trangThaiVanHanh === 'Đang giao hàng' && (
            <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg p-3 mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-indigo-500 text-base">info</span>
              <p className="text-sm text-indigo-700 dark:text-indigo-300">
                Khi nhận hàng, bấm <strong>"QR nhận hàng"</strong> để xác nhận hoặc yêu cầu đổi trả.
              </p>
            </div>
          )}

          <div className="border-t border-border-light dark:border-border-dark pt-4">
            <OrderItems items={order.chiTiet} />
            <OrderFooter order={order} />
          </div>
        </div>
      )}

      {/* Modal QR */}
      <OrderQRModal show={showQR} onClose={() => setShowQR(false)} order={order} />
    </>
  );
};

export default OrderCard;
