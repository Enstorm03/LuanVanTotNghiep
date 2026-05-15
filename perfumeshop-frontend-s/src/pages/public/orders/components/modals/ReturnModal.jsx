import React from 'react';
import { formatCurrency, formatOrderDate } from '../../../../../utils/orderUtils';

const ReturnModal = ({
  show,
  onClose,
  order,
  returnData,
  onReturnDataChange,
  onSubmit,
  submitting
}) => {
  if (!show || !order) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-content-dark rounded-lg shadow-xl max-w-md w-full">
        <div className="p-6">
          <h3 className="text-lg font-bold mb-4">Yêu cầu đổi trả đơn hàng #{order.idDonHang}</h3>

          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 mb-4">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              <strong>Chính sách đổi trả:</strong> Chỉ nhận đổi trả trong vòng 7 ngày kể từ ngày đặt hàng cho đơn hàng đã hoàn thành.
            </p>
          </div>

          {/* Return Reason */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Lý do đổi trả:</label>
            <textarea
              value={returnData.lyDo}
              onChange={(e) => onReturnDataChange({ ...returnData, lyDo: e.target.value })}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-background-dark"
              placeholder="Vui lòng mô tả chi tiết lý do bạn muốn đổi trả..."
            />
          </div>

          {/* Order Info */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 mb-6">
            <h4 className="text-sm font-medium mb-2">Thông tin đơn hàng:</h4>
            <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
              <p><strong>Tổng tiền:</strong> {formatCurrency(order.tongTien)}</p>
              <p><strong>Ngày đặt:</strong> {formatOrderDate(order.ngayDatHang)}</p>
              <p><strong>Sản phẩm:</strong> {order.chiTiet?.length || 0} sản phẩm</p>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
            >
              Hủy
            </button>
            <button
              onClick={onSubmit}
              disabled={submitting || !returnData.lyDo.trim()}
              className="flex-1 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:opacity-50"
            >
              {submitting ? 'Đang gửi...' : 'Gửi yêu cầu'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReturnModal;
