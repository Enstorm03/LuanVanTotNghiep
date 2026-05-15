import React from 'react';
import { formatCurrency } from '../../../../../utils/orderUtils';

const OrderFooter = ({ order }) => (
  <div className="mt-4 pt-4 border-t border-border-light dark:border-border-dark">
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <div className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
        <p>Giao đến: {order.tenNguoiNhan}</p>
        <p>Địa chỉ: {order.diaChiGiaoHang}</p>
        <p>SĐT: {order.soDienThoai}</p>
      </div>
      <div className="text-right mt-2 sm:mt-0">
        <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
          Phương thức: {order.phuongThucThanhToan}
        </p>
        {order.tienDatCoc > 0 && (
          <p className="text-sm text-orange-600">
            Đã cọc: {formatCurrency(order.tienDatCoc)}
          </p>
        )}
        <p className="text-lg font-bold text-primary">
          Tổng: {formatCurrency(order.tongTien)}
        </p>
      </div>
    </div>
  </div>
);

export default OrderFooter;
