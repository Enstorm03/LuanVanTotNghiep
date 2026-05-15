import React from 'react';

const OrderProductItem = ({ item, productDetails, brandDetails }) => {
  // Extract product info based on data structure
  let productInfo = {};
  let quantity = 0;
  let price = 0;

  if (item.tenSanPham && (item.tenThuongHieu || item.thuongHieu) && item.dungTichMl && item.nongDo) {
    // Direct product info in chiTiet (if all detailed fields exist)
    productInfo = {
      tenSanPham: item.tenSanPham,
      urlHinhAnh: item.urlHinhAnh,
      thuongHieu: item.tenThuongHieu || item.thuongHieu,
      dungTichMl: item.dungTichMl,
      nongDo: item.nongDo
    };
    quantity = item.soLuong;
    price = item.giaTaiThoiDiemMua;
  } else if (item.sanPhamId) {
    // Get basic info from order item
    const basicInfo = {
      tenSanPham: item.tenSanPham,
      urlHinhAnh: item.urlHinhAnh || item.url_hinh_anh
    };

    // Get detailed product info from fetched products
    const detailedProduct = productDetails[item.sanPhamId];
    console.log('OrderProductItem - item.sanPhamId:', item.sanPhamId);
    console.log('OrderProductItem - detailedProduct:', detailedProduct);
    console.log('OrderProductItem - productDetails keys:', Object.keys(productDetails));
    console.log('OrderProductItem - brandDetails:', brandDetails);

    productInfo = {
      ...basicInfo,
      thuongHieu: brandDetails[detailedProduct?.id_thuong_hieu] || detailedProduct?.ten_thuong_hieu || 'N/A',
      dungTichMl: detailedProduct?.dung_tich_ml || detailedProduct?.dungTichMl,
      nongDo: detailedProduct?.nong_do || detailedProduct?.nongDo
    };

    console.log('OrderProductItem - final productInfo:', productInfo);

    quantity = item.soLuong;
    price = item.giaTaiThoiDiemMua;
  }

  return (
    <div className="flex justify-between items-center p-4 border border-border-light dark:border-border-dark rounded-lg">
      <div className="flex items-center gap-4">
        <img
          src={productInfo.urlHinhAnh || "https://placehold.co/60x60?text=No+Image"}
          alt={productInfo.tenSanPham || 'Sản phẩm'}
          className="w-16 h-16 object-cover rounded-lg"
        />
        <div className="flex-1">
          <h4 className="font-semibold text-text-light dark:text-text-dark">
            {productInfo.tenSanPham || 'Sản phẩm không xác định'}
          </h4>
          <p className="text-sm text-text-subtle-light dark:text-text-subtle-dark mt-1">
            Thương hiệu: {productInfo.thuongHieu || 'N/A'}
          </p>
          <p className="text-sm text-text-subtle-light dark:text-text-subtle-dark">
            Dung tích: {productInfo.dungTichMl || 'N/A'}ml
          </p>
          <p className="text-sm text-text-subtle-light dark:text-text-subtle-dark">
            Nồng độ: {productInfo.nongDo || 'N/A'}
          </p>
          <p className="text-sm font-medium text-primary">
            Số lượng: {quantity || 0}
          </p>
        </div>
      </div>
      <div className="text-right">
        <p className="font-bold text-primary text-lg">
          {((price || 0) * (quantity || 0)).toLocaleString('vi-VN')}₫
        </p>
        <p className="text-sm text-text-subtle-light dark:text-text-subtle-dark">
          Đơn giá: {(price || 0).toLocaleString('vi-VN')}₫
        </p>
      </div>
    </div>
  );
};

export default OrderProductItem;
