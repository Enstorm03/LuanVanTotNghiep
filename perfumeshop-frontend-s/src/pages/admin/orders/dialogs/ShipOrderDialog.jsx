import React from 'react';

const ShipOrderDialog = ({ show, onConfirm, onClose, orderId, maVanDon, processing }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
        <h3 className="text-lg font-bold mb-4">Xác nhận gửi hàng</h3>
        <p className="mb-3">
          Chuyển đơn hàng <span className="font-semibold">#{orderId}</span> sang trạng thái{' '}
          <span className="text-orange-600 font-semibold">Đang giao hàng</span>?
        </p>
        {maVanDon && (
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg px-4 py-3 mb-4">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Mã vận đơn</p>
            <p className="font-mono font-semibold text-gray-800 dark:text-gray-100">{maVanDon}</p>
          </div>
        )}
        {/* <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Mã vận đơn đã được tạo tự động. Bạn có thể cập nhật lại sau khi gửi hàng.
        </p> */}
        <div className="flex gap-3">
          <button
            onClick={onConfirm}
            disabled={processing}
            className="flex-1 bg-orange-500 text-white py-2 px-4 rounded hover:bg-orange-600 disabled:opacity-50"
          >
            {processing ? 'Đang xử lý...' : 'Xác nhận gửi hàng'}
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

export default ShipOrderDialog;
