import React from 'react';

const OrderActions = ({
  order,
  processing,
  onConfirmOrder,
  onShipOrder,
  onUpdateTracking,
  onCompleteOrder,
  onCancelOrder,
  onUpdateRecipient,
  onPaymentCollected,
  onUpdatePaymentStatus,
  setShowConfirmDialog,
  setShowShipDialog,
  setShowTrackingDialog,
  setShowCancelDialog,
  setShowUpdateRecipientDialog,
  setShowPaymentCollectedDialog,
  setRecipientName,
  setRecipientAddress
}) => {
  return (
    <div className="rounded-xl border bg-surface-light text-card-foreground shadow border-border-light dark:border-border-dark dark:bg-surface-dark p-6">
      <h3 className="text-lg font-bold mb-4">Thao tác</h3>
      <div className="space-y-3">
        {/* Buttons for "Chờ hàng" orders */}
        {order.trangThaiVanHanh === 'Chờ hàng' && (
          <>
            <button
              onClick={() => {
                setRecipientName(order.tenNguoiNhan || '');
                setRecipientAddress(order.diaChiGiaoHang || '');
                setShowUpdateRecipientDialog(true);
              }}
              disabled={processing}
              className="w-full bg-indigo-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-600 transition-colors disabled:opacity-50"
            >
              Cập nhật thông tin nhận hàng
            </button>

            {order.trangThaiThanhToan === 'Đã cọc' && (
              <button
                onClick={() => setShowPaymentCollectedDialog(true)}
                disabled={processing}
                className="w-full bg-emerald-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-emerald-600 transition-colors disabled:opacity-50"
              >
                Đã thu đủ tiền còn lại
              </button>
            )}
          </>
        )}

        {/* Payment status update button for unpaid orders - chỉ hiển thị khi thực sự cần */}
        {order.trangThaiThanhToan === 'Chưa thanh toán' &&
         order.trangThaiVanHanh === 'Đang giao hàng' &&
         order.phuongThucThanhToan === 'cod' && (  // Chỉ hiển thị cho COD
          <button
            onClick={onUpdatePaymentStatus}
            disabled={processing}
            className="w-full bg-green-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
          >
            Đánh dấu đã thanh toán
          </button>
        )}

        {(order.trangThaiVanHanh === 'Đang chờ' || order.trangThaiVanHanh === 'Chờ hàng') && (
          <button
            onClick={() => setShowConfirmDialog(true)}
            disabled={processing}
            className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
          >
            Xác nhận đơn hàng
          </button>
        )}

        {order.trangThaiVanHanh === 'Đã xác nhận' && (
          <button
            onClick={() => setShowShipDialog(true)}
            disabled={processing}
            className="w-full bg-orange-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50"
          >
            Gửi hàng
          </button>
        )}

        {/* {order.trangThaiVanHanh === 'Đang giao hàng' && (
          <button
            onClick={() => setShowTrackingDialog(true)}
            disabled={processing}
            className="w-full bg-purple-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-purple-600 transition-colors disabled:opacity-50"
          >
            Cập nhật mã vận đơn
          </button>
        )} */}

        {order.trangThaiVanHanh === 'Đang giao hàng' && (
          <button
            onClick={onCompleteOrder}
            disabled={processing}
            className="w-full bg-green-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
          >
            Hoàn thành đơn hàng
          </button>
        )}

        {/* Chỉ hiện nút hủy khi đơn chưa ở trạng thái cuối */}
        {!['Hoàn thành', 'Đã hủy', 'Đã hoàn trả', 'Chờ hoàn tiền'].includes(order.trangThaiVanHanh) && (
          <button
            onClick={() => setShowCancelDialog(true)}
            disabled={processing}
            className="w-full bg-red-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
          >
            Hủy đơn hàng
          </button>
        )}
      </div>
    </div>
  );
};

export default OrderActions;
