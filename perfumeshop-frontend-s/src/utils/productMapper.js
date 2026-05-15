// Product mapping utilities for frontend-backend data transformation

export const mapProductFromBackend = (product) => {
  return {
    id_san_pham: product.idSanPham || product.id_san_pham,
    ten_san_pham: product.tenSanPham || product.ten_san_pham,
    gia_ban: product.giaBan || product.gia_ban,
    so_luong_ton_kho: product.soLuongTonKho || product.so_luong_ton_kho,
    mo_ta: product.moTa || product.mo_ta,
    dung_tich_ml: product.dungTichMl || product.dung_tich_ml,
    nong_do: product.nongDo || product.nong_do,
    url_hinh_anh: product.urlHinhAnh || product.url_hinh_anh,
    id_danh_muc: product.idDanhMuc || product.id_danh_muc,
    id_thuong_hieu: product.idThuongHieu || product.id_thuong_hieu,
    ten_thuong_hieu: product.tenThuongHieu || product.ten_thuong_hieu,
    ten_danh_muc: product.tenDanhMuc || product.ten_danh_muc
  };
};

export const mapProductToBackend = (productData) => {
  return {
    tenSanPham: productData.tenSanPham,
    giaBan: parseFloat(productData.giaBan),
    soLuongTonKho: parseInt(productData.soLuongTonKho),
    moTa: productData.moTa || '',
    dungTichMl: productData.dungTichMl ? parseFloat(productData.dungTichMl) : null,
    nongDo: productData.nongDo || '',
    urlHinhAnh: productData.urlHinhAnh || '',
    danhMuc: productData.danhMuc,
    thuongHieu: productData.thuongHieu
  };
};

export const getStockStatus = (stockQuantity) => {
  if (stockQuantity > 10) return { status: 'Còn hàng', className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' };
  if (stockQuantity > 0) return { status: 'Sắp hết', className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' };
  return { status: 'Hết hàng', className: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' };
};
