import React from 'react';

const EmployeeRow = ({ employee, onUpdateRole, onResetPassword, onDeleteEmployee }) => {
  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
        {employee.idNhanVien}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {employee.tenDangNhap}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {employee.hoTen}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <select
          value={employee.vaiTro}
          onChange={(e) => onUpdateRole(employee.idNhanVien, e.target.value)}
          className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="NhanVien">Nhân viên</option>
          <option value="Admin">Admin</option>
        </select>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
        <button
          onClick={() => onResetPassword(employee.idNhanVien)}
          className="text-blue-600 hover:text-blue-900"
        >
          Đặt lại MK
        </button>
        <button
          onClick={() => onDeleteEmployee(employee.idNhanVien, employee.hoTen)}
          className="text-red-600 hover:text-red-900"
        >
          Xóa
        </button>
      </td>
    </tr>
  );
};

export default EmployeeRow;
