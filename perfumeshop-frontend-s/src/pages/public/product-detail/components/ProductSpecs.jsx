import React from 'react';

const ProductSpecs = ({ product, brandName, isOutOfStock }) => (
  <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
    <div className="flex items-center gap-2">
      <span className="material-symbols-outlined text-sm text-gray-500">local_shipping</span>
      <div>
        <p className="text-xs text-gray-500 uppercase tracking-wide">Vận chuyển</p>
        <p className="text-sm font-medium">Miễn phí giao hàng</p>
      </div>
    </div>
    <div className="flex items-center gap-2">
      <span className="material-symbols-outlined text-sm text-gray-500">verified</span>
      <div>
        <p className="text-xs text-gray-500 uppercase tracking-wide">Bảo hành</p>
        <p className="text-sm font-medium">12 tháng</p>
      </div>
    </div>
    <div className="flex items-center gap-2">
      <span className="material-symbols-outlined text-sm text-gray-500">local_mall</span>
      <div>
        <p className="text-xs text-gray-500 uppercase tracking-wide">Thương hiệu</p>
        <p className="text-sm font-medium">{brandName}</p>
      </div>
    </div>
    <div className="flex items-center gap-2">
      <span className="material-symbols-outlined text-sm text-gray-500">science</span>
      <div>
        <p className="text-xs text-gray-500 uppercase tracking-wide">Nồng độ</p>
        <p className="text-sm font-medium">{product.nong_do}</p>
      </div>
    </div>
  </div>
);

export default ProductSpecs;
