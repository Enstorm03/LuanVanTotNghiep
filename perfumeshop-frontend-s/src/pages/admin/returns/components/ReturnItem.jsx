import React from 'react';

const STATUS_STYLE = {
  'Chờ duyệt':            'bg-yellow-100 text-yellow-800',
  'Chờ hoàn tiền':        'bg-orange-100 text-orange-800',
  'Hoàn tiền thành công': 'bg-teal-100 text-teal-800',
  'Từ chối':              'bg-red-100 text-red-800',
};

const ReturnItem = ({ returnItem, onApprove, onConfirmRefund, onReject, processing }) => {
  const isProcessing = processing === returnItem.idDoiTra;

  return (
    <div className="border border-border-light dark:border-border-dark rounded-lg p-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2 flex-wrap">
            <h4 className="font-semibold">Phiếu #{returnItem.idDoiTra}</h4>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_STYLE[returnItem.trangThai] || 'bg-gray-100 text-gray-800'}`}>
              {returnItem.trangThai}
            </span>
          </div>

          <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
            <p><strong>Đơn hàng:</strong> #{returnItem.idDonHang}</p>
            <p><strong>Khách hàng:</strong> ID {returnItem.idNguoiDung}</p>
            <p><strong>Lý do đổi trả:</strong> {returnItem.lyDo}</p>
            <p><strong>Ngày tạo:</strong> {returnItem.ngayTao ? new Date(returnItem.ngayTao).toLocaleDateString('vi-VN') : 'N/A'}</p>

            {/* Số tiền hoàn */}
            {returnItem.soTienHoan != null && (
              <p>
                <strong>Số tiền cần hoàn:</strong>{' '}
                <span className="text-orange-600 font-semibold">
                  {Number(returnItem.soTienHoan).toLocaleString('vi-VN')}₫
                </span>
              </p>
            )}

            {/* Ngày hoàn tiền */}
            {returnItem.ngayHoanTien && (
              <p>
                <strong>Đã hoàn tiền lúc:</strong>{' '}
                {new Date(returnItem.ngayHoanTien).toLocaleString('vi-VN')}
              </p>
            )}

            {/* Lý do từ chối */}
            {returnItem.trangThai === 'Từ chối' && returnItem.lyDoTuChoi && (
              <p className="text-red-600">
                <strong>Lý do từ chối:</strong> {returnItem.lyDoTuChoi}
              </p>
            )}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col gap-2 shrink-0">
          {/* Bước 1: Duyệt yêu cầu */}
          {returnItem.trangThai === 'Chờ duyệt' && (
            <>
              <button
                onClick={() => onApprove(returnItem.idDoiTra)}
                disabled={isProcessing}
                className="px-3 py-2 bg-green-500 text-white text-sm rounded hover:bg-green-600 disabled:opacity-50 whitespace-nowrap"
              >
                {isProcessing ? 'Đang xử lý...' : '✓ Duyệt'}
              </button>
              <button
                onClick={() => onReject(returnItem.idDoiTra)}
                disabled={isProcessing}
                className="px-3 py-2 bg-red-500 text-white text-sm rounded hover:bg-red-600 disabled:opacity-50 whitespace-nowrap"
              >
                {isProcessing ? 'Đang xử lý...' : '✗ Từ chối'}
              </button>
            </>
          )}

          {/* Bước 2: Xác nhận đã hoàn tiền */}
          {returnItem.trangThai === 'Chờ hoàn tiền' && (
            <button
              onClick={() => onConfirmRefund(returnItem.idDoiTra, returnItem.soTienHoan)}
              disabled={isProcessing}
              className="px-3 py-2 bg-orange-500 text-white text-sm rounded hover:bg-orange-600 disabled:opacity-50 whitespace-nowrap"
            >
              {isProcessing ? 'Đang xử lý...' : '💰 Đã hoàn tiền'}
            </button>
          )}
        </div>
      </div>

      {/* Hướng dẫn theo trạng thái */}
      <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
        {returnItem.trangThai === 'Chờ duyệt' && (
          <p className="text-xs text-gray-500">
            Kiểm tra lý do đổi trả. Bấm <strong>Duyệt</strong> để chuyển hàng vào mục Hàng lỗi/chờ trả NCC và tiến hành hoàn tiền cho khách.
          </p>
        )}
        {returnItem.trangThai === 'Chờ hoàn tiền' && (
          <div className="space-y-1">
            {returnItem.ghiChuNoiBo && (
              <p className="text-xs text-blue-600 font-medium">📦 {returnItem.ghiChuNoiBo}</p>
            )}
            <p className="text-xs text-orange-600 font-medium">
              ⚠ Hàng đã vào mục <strong>Hàng lỗi/chờ trả NCC</strong>. Vui lòng hoàn tiền{' '}
              <strong>{Number(returnItem.soTienHoan).toLocaleString('vi-VN')}₫</strong>{' '}
              cho khách, sau đó bấm <strong>"Đã hoàn tiền"</strong> để hoàn tất.
            </p>
          </div>
        )}
        {returnItem.trangThai === 'Hoàn tiền thành công' && (
          <p className="text-xs text-teal-600">✓ Quy trình đổi trả đã hoàn tất.</p>
        )}
        {returnItem.trangThai === 'Từ chối' && (
          <p className="text-xs text-red-500">Yêu cầu đổi trả đã bị từ chối.</p>
        )}
      </div>
    </div>
  );
};

export default ReturnItem;
