import React from 'react';
import OrderStatusBadge from './OrderStatusBadge';

const OrderInfoCard = ({ order }) => {
  return (
    <div className="rounded-xl border bg-surface-light text-card-foreground shadow border-border-light dark:border-border-dark dark:bg-surface-dark p-6">
      <h3 className="text-lg font-bold mb-4">Thông tin đơn hàng</h3>
      <div className="space-y-2 text-sm">
        <p className="flex justify-between">
          <span>ID Đơn hàng:</span>
          <span className="font-mono">#{order.idDonHang}</span>
        </p>
        <p className="flex justify-between">
          <span>Ngày đặt:</span>
          <span>{order.ngayDatHang ? new Date(order.ngayDatHang).toLocaleDateString('vi-VN') : 'N/A'}</span>
        </p>
        {order.ngayHoanThanh && (
          <p className="flex justify-between">
            <span>Ngày hoàn thành:</span>
            <span>{new Date(order.ngayHoanThanh).toLocaleDateString('vi-VN')}</span>
          </p>
        )}
        <p className="flex justify-between">
          <span>Mã vận đơn:</span>
          <span className="font-mono">{order.maVanDon || 'Chưa có'}</span>
        </p>
        <div className="flex justify-between items-center pt-2">
          <span>Trạng thái:</span>
          <OrderStatusBadge status={order.trangThaiVanHanh} />
        </div>
        <div className="flex justify-between items-center pt-2">
          <span>Thanh toán:</span>
          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
            order.trangThaiThanhToan === 'Đã thanh toán'   ? 'bg-green-100 text-green-800'  :
            
            order.trangThaiThanhToan === 'Chờ thanh toán'  ? 'bg-yellow-100 text-yellow-800' :
                                                             'bg-gray-100 text-gray-800'
          }`}>
            {order.trangThaiThanhToan || 'N/A'}
          </span>
        </div>
        <p className="flex justify-between text-base font-bold mt-4 pt-4 border-t border-border-light dark:border-border-dark">
          <span>Tổng tiền:</span>
          <span className="text-primary">{order.tongTien ? order.tongTien.toLocaleString('vi-VN') + '₫' : 'N/A'}</span>
        </p>
        
        {/* Lý do hủy */}
        {order.trangThaiVanHanh === 'Đã hủy' && order.lyDoHuy && (
          <div className="mt-3 pt-3 border-t border-border-light dark:border-border-dark">
            <p className="text-xs text-gray-500 mb-1">Lý do hủy:</p>
            <p className="text-sm text-red-600 dark:text-red-400 font-medium">{order.lyDoHuy}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderInfoCard;
