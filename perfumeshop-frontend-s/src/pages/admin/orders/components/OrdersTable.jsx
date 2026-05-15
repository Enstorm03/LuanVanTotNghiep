import React from 'react';
import OrderRow from './OrderRow';

const OrdersTable = ({ orders }) => {
  return (
    <div className="rounded-xl border bg-surface-light text-card-foreground shadow border-border-light dark:border-border-dark dark:bg-surface-dark">
      <div className="relative w-full overflow-auto">
        <table className="w-full caption-bottom text-sm">
          <thead className="[&_tr]:border-b [&_tr]:border-border-light dark:[&_tr]:border-border-dark">
            <tr className="text-text-subtle-light dark:text-text-subtle-dark">
              <th className="h-12 px-4 text-left align-middle font-medium">Mã đơn hàng</th>
              <th className="h-12 px-4 text-left align-middle font-medium hidden md:table-cell">Khách hàng</th>
              <th className="h-12 px-4 text-left align-middle font-medium hidden md:table-cell">Ngày đặt</th>
              <th className="h-12 px-4 text-left align-middle font-medium hidden sm:table-cell">Trạng thái</th>
              <th className="h-12 px-4 text-right align-middle font-medium">Tổng tiền</th>
            </tr>
          </thead>
          <tbody className="[&_tr:last-child]:border-0">
            {orders.length > 0 ? (
              orders.map((order) => (
                <OrderRow key={order.idDonHang || order.id_don_hang || Math.random()} order={order} />
              ))
            ) : (
              <tr>
                <td colSpan="5" className="p-8 text-center text-text-subtle-light dark:text-text-subtle-dark">
                  <div className="flex flex-col items-center">
                    <span className="material-symbols-outlined text-4xl text-gray-300 mb-2">receipt_long</span>
                    <p className="text-lg font-medium">Không có đơn hàng nào</p>
                    <p className="text-sm text-gray-500">Chưa có đơn hàng nào được tạo hoặc phù hợp với bộ lọc.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrdersTable;
