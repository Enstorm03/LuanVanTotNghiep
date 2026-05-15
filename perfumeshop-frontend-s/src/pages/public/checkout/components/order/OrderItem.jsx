import React, { useState, useEffect } from 'react';
import { getOrderItemImageUrl, getOrderItemName, getOrderItemQuantity, getOrderItemPrice } from '../../../../../utils/checkoutUtils';
import api from '../../../../../services/api';

const OrderItem = ({ item, isPreOrder }) => {
  const [productDetails, setProductDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Lấy thông tin chi tiết sản phẩm nếu có sanPhamId hoặc id_san_pham
  useEffect(() => {
    const fetchProductDetails = async () => {
      // Nếu đã có đủ thông tin thì không cần gọi API
      const hasName = item.tenSanPham || item.ten_san_pham;
      const hasImage = item.urlHinhAnh || item.url_hinh_anh;

      if (hasName && hasImage) {
        return;
      }

      const productId = item.sanPhamId || item.id_san_pham;
      if (productId) {
        setLoading(true);
        try {
          const product = await api.getProductById(productId);
          setProductDetails(product);
        } catch (error) {
          console.error('Lỗi khi lấy thông tin sản phẩm:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchProductDetails();
  }, [item.sanPhamId, item.id_san_pham]);

  // Kết hợp thông tin từ item và productDetails
  const mergedItem = {
    ...item,
    tenSanPham: item.tenSanPham || item.ten_san_pham || (productDetails?.tenSanPham || productDetails?.ten_san_pham || 'Sản phẩm không tên'),
    urlHinhAnh: item.urlHinhAnh || item.url_hinh_anh || productDetails?.urlHinhAnh || productDetails?.hinh_anh || productDetails?.anh_dai_dien || 'https://placehold.co/80x80?text=No+Image'
  };

  const imageUrl = getOrderItemImageUrl(mergedItem, isPreOrder);
  const name = getOrderItemName(mergedItem, isPreOrder);
  const quantity = getOrderItemQuantity(mergedItem, isPreOrder);
  const price = getOrderItemPrice(mergedItem, isPreOrder);

  if (loading) {
    return (
      <div className="flex items-center gap-4 py-2">
        <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4 py-2">
      <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden flex-shrink-0">
        <img
          src={imageUrl}
          alt={name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://placehold.co/80x80?text=No+Image';
          }}
        />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-text-light dark:text-text-dark truncate">
          {name}
        </h4>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Số lượng: {quantity}
        </p>
      </div>
      <div className="text-right">
        <p className="font-bold text-primary">
          {(price * quantity).toLocaleString('vi-VN')}₫
        </p>
      </div>
    </div>
  );
};

export default OrderItem;
