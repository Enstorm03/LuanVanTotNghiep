import React from 'react';
import CustomerRow from './CustomerRow';

const CustomersTable = ({
  customers,
  editingCustomer,
  formData,
  onInputChange,
  onUpdateCustomer,
  onStartEditing,
  onCancelEditing,
  onResetPassword,
  onDeleteCustomer
}) => {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tên đăng nhập
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Họ tên
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                SĐT
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Địa chỉ
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {customers.map((customer) => (
              <CustomerRow
                key={customer.idNguoiDung}
                customer={customer}
                editingCustomer={editingCustomer}
                formData={formData}
                onInputChange={onInputChange}
                onUpdateCustomer={onUpdateCustomer}
                onStartEditing={onStartEditing}
                onCancelEditing={onCancelEditing}
                onResetPassword={onResetPassword}
                onDeleteCustomer={onDeleteCustomer}
              />
            ))}
          </tbody>
        </table>
      </div>

      {customers.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">Chưa có khách hàng nào</p>
        </div>
      )}
    </div>
  );
};

export default CustomersTable;
