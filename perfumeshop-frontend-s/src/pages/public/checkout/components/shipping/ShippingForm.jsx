import React from 'react';

const ShippingForm = ({ shippingInfo, onShippingInfoChange }) => {
  const handleChange = (field, value) => {
    onShippingInfoChange(field, value);
  };

  return (
    <div className="bg-white dark:bg-content-dark rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <h3 className="text-lg font-semibold mb-4">Thông tin giao hàng</h3>
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
