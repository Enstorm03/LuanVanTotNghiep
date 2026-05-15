import React from 'react';

const CancelOrderDialog = ({
  show,
  onConfirm,
  onClose,
  cancelReason,
  onCancelReasonChange,
  processing
}) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
        <h3 className="text-lg font-bold mb-4">Hủy đơn hàng</h3>
        <textarea
          value={cancelReason}
          onChange={(e) => onCancelReasonChange(e.target.value)}
          placeholder="Nhập lý do hủy đơn hàng"
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded mb-4"
        />
        <div className="flex gap-3">
          <button
            onClick={onConfirm}
            disabled={processing || !cancelReason.trim()}
            className="flex-1 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 disabled:opacity-50"
          >
            {processing ? 'Đang xử lý...' : 'Hủy đơn hàng'}
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

export default CancelOrderDialog;
