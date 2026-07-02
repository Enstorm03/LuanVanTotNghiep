import React from 'react';
import { Link } from 'react-router-dom';
import OrderStatusBadge from './OrderStatusBadge';

const OrderRow = ({ order }) => {
  const isOnlinePaid =
    (order.phuongThucThanhToan || '').toLowerCase() === 'online' &&
    order.trangThaiThanhToan === 'Đã thanh toán' &&
    order.trangThaiVanHanh === 'Đang chờ';

  return (
    <tr className={`border-b border-border-light dark:border-border-dark transition-colors hover:bg-background-light dark:hover:bg-background-dark ${
      isOnlinePaid ? 'bg-indigo-50/60 dark:bg-indigo-900/20' : ''
    }`}>
      <td className="p-4 align-middle font-medium">
        <div className="flex items-center gap-2">
          {isOnlinePaid && (
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-indigo-500 text-white text-[10px] font-bold rounded uppercase tracking-wide leading-none">
              <span className="material-symbols-outlined text-[10px]">bolt</span>
              Online
            </span>
          )}
          <Link to={`/admin/orders/${order.idDonHang || order.id_don_hang}`} className="text-primary hover:underline">
            #{order.idDonHang || order.id_don_hang || 'N/A'}
          </Link>
        </div>
      </td>
      <td className="p-4 align-middle hidden md:table-cell text-text-light dark:text-text-dark">
        {order.tenNguoiNhan || order.ten_nguoi_nhan || 'N/A'}
      </td>
      <td className="p-4 align-middle hidden md:table-cell text-text-subtle-light dark:text-text-subtle-dark">
        {order.ngayDatHang || order.ngay_dat_hang
          ? new Date(order.ngayDatHang || order.ngay_dat_hang).toLocaleDateString('vi-VN')
          : 'N/A'}
      </td>
      <td className="p-4 align-middle hidden sm:table-cell">
        <OrderStatusBadge status={order.trangThaiVanHanh || order.trang_thai_van_hanh} />
      </td>
      <td className="p-4 align-middle hidden lg:table-cell">
        <div className="flex flex-col gap-0.5">
          <span className="text-xs text-gray-500">
            {(order.phuongThucThanhToan || '').toUpperCase() || 'N/A'}
          </span>
          <span className={`text-xs font-medium ${
            order.trangThaiThanhToan === 'Đã thanh toán'
              ? 'text-green-600'
              : order.trangThaiThanhToan === 'Chờ thanh toán'
              ? 'text-orange-500'
              : 'text-gray-400'
          }`}>
            {order.trangThaiThanhToan || '—'}
          </span>
        </div>
      </td>
      <td className="p-4 align-middle text-right font-bold text-text-light dark:text-text-dark">
        {order.tongTien || order.tong_tien
          ? (order.tongTien || order.tong_tien).toLocaleString('vi-VN') + '₫'
          : '0₫'}
      </td>
    </tr>
  );
};

export default OrderRow;
