import React, { useState, useEffect } from 'react';
import { calculateItemSubtotal } from '../../../../../utils/cartUtils';

// API base URL
const API_BASE_URL = 'http://localhost:8080/api';

// Brands cache to avoid multiple API calls
let brandsCache = null;

const getBrands = async () => {
  if (brandsCache) {
    return brandsCache;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/catalog/thuong-hieu`);
    if (!response.ok) throw new Error('Failed to fetch brands');
    brandsCache = await response.json();
    return brandsCache;
  } catch (error) {
    console.error('Error fetching brands:', error);
    return [];
  }
};

const CartItem = ({
  item,
  updatingItem,
  onUpdateQuantity,
  onRemoveItem
}) => {
  const [productInfo, setProductInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setLoading(true);

        // If we already have enriched data, use it
        if (item.tenSanPham && item.tenThuongHieu && item.dungTichMl !== undefined && item.nongDo !== undefined) {
          setProductInfo({
            tenSanPham: item.tenSanPham,
            urlHinhAnh: item.urlHinhAnh,
            tenThuongHieu: item.tenThuongHieu?.tenThuongHieu || 'N/A',
            dungTichMl: item.dungTichMl,
            nongDo: item.nongDo
          });
          setLoading(false);
          return;
        }

        // Otherwise, fetch product details directly
        const productResponse = await fetch(`${API_BASE_URL}/san-pham/${item.sanPhamId}`);
        if (!productResponse.ok) throw new Error('Failed to fetch product');
        const product = await productResponse.json();

        const brands = await getBrands();
        const brand = brands.find(b => b.idThuongHieu === product.thuongHieu?.idThuongHieu);

        setProductInfo({
          tenSanPham: product.tenSanPham,
          urlHinhAnh: product.urlHinhAnh,
          tenThuongHieu: brand ? brand.tenThuongHieu : 'N/A',
          dungTichMl: product.dungTichMl,
          nongDo: product.nongDo
        });
      } catch (error) {
        console.error('Error fetching product details for cart item:', error);
        setProductInfo({
          tenSanPham: 'Sản phẩm không xác định',
          urlHinhAnh: "https://placehold.co/80x80?text=No+Image",
          tenThuongHieu: 'N/A',
          dungTichMl: null,
          nongDo: null
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [item]);

  if (loading || !productInfo) {
    return (
      <div className="bg-white dark:bg-content-dark rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="animate-pulse flex items-center gap-4">
          <div className="w-20 h-20 bg-gray-200 rounded-lg"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            <div className="h-3 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>
      </div>
    );
  }

  const price = item.giaTaiThoiDiemMua || 0;

  return (
    <div className="bg-white dark:bg-content-dark rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center gap-4">
        {/* Product Image */}
        <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden flex-shrink-0">
          <img
            src={productInfo.urlHinhAnh}
            alt={productInfo.tenSanPham}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Product Info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-text-light dark:text-text-dark truncate">
            {productInfo.tenSanPham}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Thương hiệu: {productInfo.tenThuongHieu}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Dung tích: {productInfo.dungTichMl || 'N/A'}ml • Nồng độ: {productInfo.nongDo || 'N/A'}
          </p>
          <p className="text-lg font-bold text-primary mt-1">
            {price.toLocaleString('vi-VN')}₫
          </p>
        </div>

        {/* Quantity Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              const newQty = Math.max(0, item.soLuong - 1);
              onUpdateQuantity(item.sanPhamId, newQty);
            }}
            disabled={updatingItem === item.sanPhamId}
            className="w-8 h-8 flex items-center justify-center border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
          >
            -
          </button>
          <span className="w-12 text-center font-medium">
            {updatingItem === item.sanPhamId ? '...' : item.soLuong}
          </span>
          <button
            onClick={() => {
              const newQty = item.soLuong + 1;
              onUpdateQuantity(item.sanPhamId, newQty);
            }}
            disabled={updatingItem === item.sanPhamId}
            className="w-8 h-8 flex items-center justify-center border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
          >
            +
          </button>
        </div>

        {/* Subtotal */}
        <div className="text-right">
          <p className="font-bold text-lg text-text-light dark:text-text-dark">
            {calculateItemSubtotal(item).toLocaleString('vi-VN')}₫
          </p>
        </div>

        {/* Remove Button */}
        <button
          onClick={() => onRemoveItem(item.sanPhamId)}
          disabled={updatingItem === item.sanPhamId}
          className="w-8 h-8 flex items-center justify-center text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded disabled:opacity-50"
        >
          <span className="material-symbols-outlined text-sm">delete</span>
        </button>
      </div>
    </div>
  );
};

export default CartItem;
