import React from 'react';

const PreOrderNotice = () => {
  return (
    <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4 mb-6">
      <div className="flex items-center gap-2">
        <span className="text-orange-600">🛒</span>
        <h3 className="font-medium text-orange-800 dark:text-orange-200">Đơn hàng đặt trước</h3>
      </div>
      <p className="text-sm text-orange-700 dark:text-orange-300 mt-1">
        Sản phẩm sẽ về trong 7-10 ngày. Bạn chỉ cần thanh toán 50% giá trị trước.
      </p>
    </div>
  );
};

export default PreOrderNotice;
