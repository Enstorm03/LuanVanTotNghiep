import React from 'react';
import { Link } from 'react-router-dom';
import { getStatusBadgeColor } from '../../../../utils/dashboardStatus';

const RecentOrders = ({ recentOrders }) => {
  return (
    <div className="rounded-xl border bg-surface-light text-card-foreground shadow border-border-light dark:border-border-dark dark:bg-surface-dark">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Đơn hàng gần đây</h3>
          <Link
            to="/admin/orders"
            className="text-primary hover:underline text-sm"
          >
            Xem tất cả
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="text-center py-8">
            <span className="material-symbols-outlined text-4xl text-gray-300 mb-2 block">shopping_cart</span>
            <p className="text-gray-500 dark:text-gray-400">Chưa có đơn hàng nào</p>
          </div>
        ) : (
          <div className="space-y-4">
            {recentOrders.map((order) => (
              <div key={order.idDonHang} className="flex items-center justify-between p-4 border border-border-light dark:border-border-dark rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                    <span className="material-symbols-outlined text-gray-600">shopping_bag</span>
                  </div>
                  <div>
                    <p className="font-medium">Đơn hàng #{order.idDonHang}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {order.tenNguoiNhan} • {order.tongTien?.toLocaleString('vi-VN')}₫
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(order.trangThaiVanHanh)}`}>
                    {order.trangThaiVanHanh}
                  </span>
                  <Link
                    to={`/admin/orders/${order.idDonHang}`}
                    className="text-primary hover:underline text-sm"
                  >
                    Chi tiết
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentOrders;
