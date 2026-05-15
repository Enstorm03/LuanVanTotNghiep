import React from 'react';
import { Link } from 'react-router-dom';
import OrderStatusBadge from './OrderStatusBadge';

const OrderRow = ({ order }) => {
  return (
    <tr className="border-b border-border-light dark:border-border-dark transition-colors hover:bg-background-light dark:hover:bg-background-dark">
      <td className="p-4 align-middle font-medium">
        <Link to={`/admin/orders/${order.idDonHang || order.id_don_hang}`} className="text-primary hover:underline">
          #{order.idDonHang || order.id_don_hang || 'N/A'}
        </Link>
      </td>
      <td className="p-4 align-middle hidden md:table-cell text-text-light dark:text-text-dark">
        {order.tenNguoiNhan || order.ten_nguoi_nhan || order.tenKhachVangLai || order.ten_khach_vang_lai || 'N/A'}
      </td>
      <td className="p-4 align-middle hidden md:table-cell text-text-subtle-light dark:text-text-subtle-dark">
        {order.ngayDatHang || order.ngay_dat_hang ? new Date(order.ngayDatHang || order.ngay_dat_hang).toLocaleDateString('vi-VN') : 'N/A'}
      </td>
      <td className="p-4 align-middle hidden sm:table-cell">
        <OrderStatusBadge status={order.trangThaiVanHanh || order.trang_thai_van_hanh} />
      </td>
      <td className="p-4 align-middle text-right font-bold text-text-light dark:text-text-dark">
        {order.tongTien || order.tong_tien ? (order.tongTien || order.tong_tien).toLocaleString('vi-VN') + '₫' : 'N/A'}
      </td>
    </tr>
  );
};

export default OrderRow;
