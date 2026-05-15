import React from 'react';

const MoveToPendingDialog = ({ show, onConfirm, onClose, orderId, processing }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
        <h3 className="text-lg font-bold mb-4">Chuyển sang đang chờ</h3>
        <p className="mb-4">Bạn có chắc muốn chuyển đơn hàng #{orderId} từ trạng thái "Chờ hàng" sang "Đang chờ" để xử lý?</p>
        <div className="flex gap-3">
          <button
            onClick={onConfirm}
            disabled={processing}
            className="flex-1 bg-cyan-500 text-white py-2 px-4 rounded hover:bg-cyan-600 disabled:opacity-50"
          >
            {processing ? 'Đang xử lý...' : 'Chuyển trạng thái'}
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

export default MoveToPendingDialog;
