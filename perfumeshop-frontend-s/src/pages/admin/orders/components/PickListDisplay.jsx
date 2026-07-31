import React from 'react';

// file này để hiển thị thông tin FEFO pick list trên trang chi tiết đơn hàng admin, tránh gọi API nhiều lần
const PickListDisplay = ({ pickList = [] }) => {
  if (!pickList || pickList.length === 0) {
    return (
      <div className="p-3 bg-gray-50 dark:bg-gray-700/20 rounded border border-gray-200 dark:border-gray-600 text-sm text-gray-500 italic">
        Chưa có thông tin FEFO pick list
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {pickList.map((item, idx) => (
        <div key={idx} className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800">
          <div className="flex items-start gap-2">
            <span className="text-lg flex-shrink-0">📋</span>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-blue-900 dark:text-blue-100 text-sm mb-1">
                {item.tenSanPham}
              </p>
              <div className="space-y-1 text-xs text-blue-800 dark:text-blue-200">
                {item.details && item.details.length > 0 ? (
                  item.details.map((detail, didx) => (
                    <div key={didx} className="flex items-center gap-2 p-1.5 bg-white/50 dark:bg-gray-700/50 rounded">
                      <span className="font-mono font-bold text-blue-600 dark:text-blue-400">
                        {detail.soLuong}x
                      </span>
                      <span className="text-gray-700 dark:text-gray-300">chai/ml</span>
                      <span className="text-gray-500">từ </span>
                      <span className="font-semibold text-blue-700 dark:text-blue-300">
                        Lô {detail.soLo || 'N/A'}
                      </span>
                      <span className="text-gray-500">-</span>
                      <span className="font-semibold text-red-600 dark:text-red-400">
                        HSD: {detail.hanSuDung ? new Date(detail.hanSuDung).toLocaleDateString('vi-VN') : 'N/A'}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 italic">Không có chi tiết lô hàng</p>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PickListDisplay;