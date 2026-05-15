import React from 'react';
import { getReturnStatusBadgeColor } from '../../../../utils/returnStatus';

const ReturnItem = ({ returnItem, onApprove, onReject, processing }) => {
  return (
    <div className="border border-border-light dark:border-border-dark rounded-lg p-4">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h4 className="font-semibold">Phiếu #{returnItem.idDoiTra}</h4>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getReturnStatusBadgeColor(returnItem.trangThai)}`}>
              {returnItem.trangThai}
            </span>
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
            <p><strong>Đơn hàng:</strong> #{returnItem.idDonHang}</p>
            <p><strong>Khách hàng:</strong> ID {returnItem.idNguoiDung}</p>
            <p><strong>Lý do:</strong> {returnItem.lyDo}</p>
            <p><strong>Ngày tạo:</strong> {returnItem.ngayTao ? new Date(returnItem.ngayTao).toLocaleDateString('vi-VN') : 'N/A'}</p>
          </div>
        </div>

        {returnItem.trangThai === 'Chờ duyệt' && (
          <div className="flex gap-2 ml-4">
            <button
              onClick={() => onApprove(returnItem.idDoiTra)}
              disabled={processing === returnItem.idDoiTra}
              className="px-3 py-2 bg-green-500 text-white text-sm rounded hover:bg-green-600 disabled:opacity-50"
            >
              {processing === returnItem.idDoiTra ? 'Đang xử lý...' : 'Duyệt'}
            </button>
            <button
              onClick={() => onReject(returnItem.idDoiTra)}
              disabled={processing === returnItem.idDoiTra}
              className="px-3 py-2 bg-red-500 text-white text-sm rounded hover:bg-red-600 disabled:opacity-50"
            >
              {processing === returnItem.idDoiTra ? 'Đang xử lý...' : 'Từ chối'}
            </button>
          </div>
        )}
      </div>

      {/* Order details could be expanded here */}
      <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Nhấp vào "Duyệt" để hoàn kho và xử lý đổi trả. Nhấp vào "Từ chối" nếu không đủ điều kiện.
        </p>
      </div>
    </div>
  );
};

export default ReturnItem;
