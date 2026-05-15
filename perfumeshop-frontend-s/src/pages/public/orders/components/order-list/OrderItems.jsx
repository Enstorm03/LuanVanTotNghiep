import React from 'react';
import { getOrderItemImageUrl, calculateOrderItemTotal } from '../../../../../utils/orderUtils';

const OrderItems = ({ items }) => (
  <div className="space-y-3">
    {items?.map((item, idx) => {
      // Debug logging for item structure
      console.log('Order item:', item);

      // Handle image URL - support both relative and absolute URLs
      const imageUrl = getOrderItemImageUrl(item.urlHinhAnh);

      const price = Number(item.giaTaiThoiDiemMua || 0);
      const qty = Number(item.soLuong || 0);

      return (
        <div key={`${item.sanPhamId ?? 'x'}-${idx}`} className="flex items-center gap-4">
          <img
            src={imageUrl}
            alt={item.tenSanPham || 'Sản phẩm'}
            className="w-12 h-12 object-cover rounded"
            onError={(e) => {
              console.log('Image failed to load:', e.target.src);
              e.target.src = "https://placehold.co/60x60?text=No+Image";
            }}
          />
          <div className="flex-1 min-w-0">
            <p className="font-medium truncate">
              {item.tenSanPham || '(Sản phẩm đã không còn)'}
            </p>
            <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
              Số lượng: {qty}
            </p>
          </div>
          <div className="text-right">
            <p className="font-medium">{calculateOrderItemTotal(item).toLocaleString('vi-VN')}₫</p>
            <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">
              {price.toLocaleString('vi-VN')}₫/cái
            </p>
          </div>
        </div>
      );
    })}
  </div>
);

export default OrderItems;
