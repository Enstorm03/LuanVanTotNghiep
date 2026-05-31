import React from 'react';
import ProductStockBadge from './ProductStockBadge';

const ProductRow = ({ product, onEdit, onDelete }) => {
  return (
    <tr className="border-b border-border-light dark:border-border-dark transition-colors hover:bg-background-light dark:hover:bg-background-dark">
      <td className="p-4 align-middle font-medium text-text-light dark:text-text-dark">{product.ten_san_pham}</td>
      <td className="p-4 align-middle hidden md:table-cell">
        <ProductStockBadge stockQuantity={product.so_luong_ton_kho || 0} />
      </td>
      <td className="p-4 align-middle hidden md:table-cell">
        {product.ang_giam_gia ? (
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-primary text-sm">
                {Number(product.gia_hien_tai).toLocaleString('vi-VN')}₫
              </span>
              <span className="bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                -{product.phan_tram_giam}%
              </span>
            </div>
            <span className="text-xs text-gray-400 line-through">
              {Number(product.gia_ban).toLocaleString('vi-VN')}₫
            </span>
          </div>
        ) : (
          <span className="text-text-subtle-light dark:text-text-subtle-dark text-sm">
            {product.gia_ban ? Number(product.gia_ban).toLocaleString('vi-VN') + '₫' : 'Liên hệ'}
          </span>
        )}
      </td>
      <td className="p-4 align-middle hidden sm:table-cell text-text-subtle-light dark:text-text-subtle-dark">{product.so_luong_ton_kho || 0}</td>
      <td className="p-4 align-middle text-right">
        <div className="flex gap-2 justify-end">
          <button
            onClick={() => onEdit(product)}
            className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
            title="Sửa"
          >
            <span className="material-symbols-outlined text-lg text-blue-500">edit</span>
          </button>
          <button
            onClick={() => onDelete(product.id_san_pham)}
            className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
            title="Xóa"
          >
            <span className="material-symbols-outlined text-lg text-red-500">delete</span>
          </button>
        </div>
      </td>
    </tr>
  );
};

export default ProductRow;
