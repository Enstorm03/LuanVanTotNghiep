import React from 'react';

const OrderCustomerInfo = ({ order }) => {
  return (
    <div className="rounded-xl border bg-surface-light text-card-foreground shadow border-border-light dark:border-border-dark dark:bg-surface-dark p-6">
      <h3 className="text-lg font-bold mb-4">Thông tin khách hàng</h3>
      <div className="space-y-2 text-sm">
        <p><span className="font-medium">ID Người dùng:</span> {order.idNguoiDung || 'N/A'}</p>
        <p><span className="font-medium">Tên người nhận:</span> {order.tenNguoiNhan || 'N/A'}</p>
        <p><span className="font-medium">Địa chỉ giao hàng:</span> {order.diaChiGiaoHang || 'N/A'}</p>
      </div>
    </div>
  );
};

export default OrderCustomerInfo;
