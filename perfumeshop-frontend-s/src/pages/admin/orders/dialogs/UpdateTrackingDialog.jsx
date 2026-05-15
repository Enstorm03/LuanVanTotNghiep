import React from 'react';

const UpdateTrackingDialog = ({
  show,
  onConfirm,
  onClose,
  trackingNumber,
  onTrackingNumberChange,
  processing
}) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
        <h3 className="text-lg font-bold mb-4">Cập nhật mã vận đơn</h3>
        <input
          type="text"
          value={trackingNumber}
          onChange={(e) => onTrackingNumberChange(e.target.value)}
          placeholder="Nhập mã vận đơn"
          className="w-full px-3 py-2 border border-gray-300 rounded mb-4"
        />
        <div className="flex gap-3">
          <button
            onClick={onConfirm}
            disabled={processing || !trackingNumber.trim()}
            className="flex-1 bg-purple-500 text-white py-2 px-4 rounded hover:bg-purple-600 disabled:opacity-50"
          >
            {processing ? 'Đang xử lý...' : 'Cập nhật'}
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

export default UpdateTrackingDialog;
