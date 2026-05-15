import React from 'react';

const PaymentCollectedDialog = ({ show, onConfirm, onClose, order, processing }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
        <h3 className="text-lg font-bold mb-4">Xác nhận thu tiền còn lại</h3>
        <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-lg mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="font-medium text-emerald-800 dark:text-emerald-200">Đặt cọc đã thu:</span>
            <span className="font-bold text-emerald-900 dark:text-emerald-100">
              {order.tienDatCoc ? order.tienDatCoc.toLocaleString('vi-VN') + '₫' : '0₫'}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-medium text-emerald-800 dark:text-emerald-200">Còn lại cần thu:</span>
            <span className="font-bold text-emerald-900 dark:text-emerald-100">
              {order.tongTien && order.tienDatCoc ? (order.tongTien - order.tienDatCoc).toLocaleString('vi-VN') + '₫' : '0₫'}
            </span>
          </div>
        </div>
        <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
          Bạn có chắc đã thu đủ tiền còn lại của đơn hàng #{order.idDonHang}? Đơn hàng sẽ được chuyển sang trạng thái "Đã thanh toán".
        </p>
        <div className="flex gap-3">
          <button
            onClick={onConfirm}
            disabled={processing}
            className="flex-1 bg-emerald-500 text-white py-2 px-4 rounded hover:bg-emerald-600 disabled:opacity-50"
          >
            {processing ? 'Đang xử lý...' : 'Xác nhận đã thu'}
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
          >
            Hủy
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentCollectedDialog;
