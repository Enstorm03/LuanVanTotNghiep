// Product utilities for product detail page

export const formatPrice = (price) => {
  return price ? price.toLocaleString('vi-VN') : 'Liên hệ';
};

export const getStockStatus = (stockQuantity) => {
  if (stockQuantity === 0) return { status: 'out_of_stock', label: 'Hết hàng' };
  if (stockQuantity < 10) return { status: 'low_stock', label: 'Sắp hết hàng' };
  return { status: 'in_stock', label: 'Còn hàng' };
};

export const validateQuantity = (quantity, maxStock) => {
  const num = parseInt(quantity) || 1;
  return Math.max(1, Math.min(num, maxStock || 999));
};

export const createPreOrderData = (product, quantity = 1) => {
  return {
    isPreOrder: true,
    items: [{
      id_san_pham: product.id_san_pham,
      ten_san_pham: product.ten_san_pham,
      url_hinh_anh: product.url_hinh_anh,
      gia_ban: product.gia_ban,
      quantity: quantity
    }],
    paymentMethod: 'deposit',
    depositAmount: product.gia_ban * 0.5,
    total: product.gia_ban,
    ghiChu: `Đặt hàng trước - ${product.ten_san_pham}`
  };
};

export const formatCartItem = (product, quantity) => {
  return {
    userId: null, // Will be set by caller
    sanPhamId: product.id_san_pham,
    soLuong: quantity
  };
};

export const getRelatedProducts = (allProducts, currentProductId, brandId, limit = 4) => {
  return allProducts
    .filter(p => p.id_thuong_hieu === brandId && p.id_san_pham !== parseInt(currentProductId))
    .slice(0, limit)
    .map(p => ({
      id_san_pham: p.id_san_pham,
      ten_san_pham: p.ten_san_pham,
      gia_ban: p.gia_ban,
      url_hinh_anh: p.url_hinh_anh,
      so_luong_ton_kho: p.so_luong_ton_kho
    }));
};

export const createBrandMap = (brands) => {
  const brandMap = {};
  brands.forEach(brand => {
    brandMap[brand.idThuongHieu] = brand.tenThuongHieu;
  });
  return brandMap;
};
