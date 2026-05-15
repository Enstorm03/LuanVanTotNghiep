import React from 'react';

const UpdateRecipientDialog = ({
  show,
  onConfirm,
  onClose,
  recipientName,
  recipientAddress,
  onRecipientNameChange,
  onRecipientAddressChange,
  processing
}) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
        <h3 className="text-lg font-bold mb-4">Cập nhật thông tin người nhận</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Tên người nhận:</label>
            <input
              type="text"
              value={recipientName}
              onChange={(e) => onRecipientNameChange(e.target.value)}
              placeholder="Nhập tên người nhận"
              className="w-full px-3 py-2 border border-gray-300 rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Địa chỉ giao hàng:</label>
            <textarea
              value={recipientAddress}
              onChange={(e) => onRecipientAddressChange(e.target.value)}
              placeholder="Nhập địa chỉ giao hàng"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded"
            />
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button
            onClick={onConfirm}
            disabled={processing || !recipientName.trim() || !recipientAddress.trim()}
            className="flex-1 bg-indigo-500 text-white py-2 px-4 rounded hover:bg-indigo-600 disabled:opacity-50"
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

export default UpdateRecipientDialog;
