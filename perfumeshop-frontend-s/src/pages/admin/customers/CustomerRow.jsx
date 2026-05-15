import React from 'react';

const CustomerRow = ({
  customer,
  editingCustomer,
  formData,
  onInputChange,
  onUpdateCustomer,
  onStartEditing,
  onCancelEditing,
  onResetPassword,
  onDeleteCustomer
}) => {
  const isEditing = editingCustomer === customer.idNguoiDung;

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
        {customer.idNguoiDung}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {customer.tenDangNhap}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {isEditing ? (
          <input
            type="text"
            name="hoTen"
            value={formData.hoTen}
            onChange={onInputChange}
            className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
          />
        ) : (
          customer.hoTen || 'Chưa cập nhật'
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {isEditing ? (
          <input
            type="tel"
            name="soDienThoai"
            value={formData.soDienThoai}
            onChange={onInputChange}
            className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
          />
        ) : (
          customer.soDienThoai || 'Chưa cập nhật'
        )}
      </td>
      <td className="px-6 py-4 text-sm text-gray-900 max-w-xs">
        {isEditing ? (
          <input
            type="text"
            name="diaChi"
            value={formData.diaChi}
            onChange={onInputChange}
            className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
          />
        ) : (
          <div className="truncate" title={customer.diaChi}>
            {customer.diaChi || 'Chưa cập nhật'}
          </div>
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
        {isEditing ? (
          <>
            <button
              onClick={() => onUpdateCustomer(customer.idNguoiDung)}
              className="text-green-600 hover:text-green-900"
            >
              Lưu
            </button>
            <button
              onClick={onCancelEditing}
              className="text-gray-600 hover:text-gray-900"
            >
              Hủy
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => onStartEditing(customer)}
              className="text-blue-600 hover:text-blue-900"
            >
              Sửa
            </button>
            <button
              onClick={() => onResetPassword(customer.idNguoiDung)}
              className="text-purple-600 hover:text-purple-900"
            >
              Đặt lại MK
            </button>
            <button
              onClick={() => onDeleteCustomer(customer.idNguoiDung, customer.hoTen)}
              className="text-red-600 hover:text-red-900"
            >
              Xóa
            </button>
          </>
        )}
      </td>
    </tr>
  );
};

export default CustomerRow;
