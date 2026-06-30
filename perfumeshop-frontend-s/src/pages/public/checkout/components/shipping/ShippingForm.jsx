import React from 'react';

const ShippingForm = ({ shippingInfo, onShippingInfoChange, isLoadingProfile }) => {
  const handleChange = (field, value) => {
    onShippingInfoChange(field, value);
  };

  return (
    <div className="bg-white dark:bg-content-dark rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Thông tin giao hàng</h3>
        {isLoadingProfile && (
          <span className="text-sm text-gray-500 flex items-center">
            <svg className="animate-spin h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Đang tải thông tin...
          </span>
        )}
      </div>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Tên người nhận *</label>
          <input
            type="text"
            value={shippingInfo.tenNguoiNhan}
            onChange={(e) => handleChange('tenNguoiNhan', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-background-dark"
            placeholder="Nhập tên người nhận"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Địa chỉ giao hàng *</label>
          <textarea
            value={shippingInfo.diaChiGiaoHang}
            onChange={(e) => handleChange('diaChiGiaoHang', e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-background-dark"
            placeholder="Nhập địa chỉ chi tiết"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Số điện thoại *</label>
          <input
            type="number"
            value={shippingInfo.soDienThoai}
            onChange={(e) => handleChange('soDienThoai', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-background-dark"
            placeholder="Nhập số điện thoại"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Ghi chú (tùy chọn)</label>
          <textarea
            value={shippingInfo.ghiChu}
            onChange={(e) => handleChange('ghiChu', e.target.value)}
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-background-dark"
            placeholder="Ghi chú về đơn hàng..."
          />
        </div>
      </div>
    </div>
  );
};

export default ShippingForm;
