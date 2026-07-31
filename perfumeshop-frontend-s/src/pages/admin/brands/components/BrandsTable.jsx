import React from 'react';
import BrandRow from './BrandRow';
// file này để hiển thị bảng danh sách thương hiệu, tránh gọi API nhiều lần
const BrandsTable = ({ brands, onEdit, onDelete }) => {
  return (
    <div className="rounded-xl border bg-surface-light text-card-foreground shadow border-border-light dark:border-border-dark dark:bg-surface-dark">
      <div className="relative w-full overflow-auto">
        <table className="w-full caption-bottom text-sm">
          <thead className="[&_tr]:border-b [&_tr]:border-border-light dark:[&_tr]:border-border-dark">
            <tr className="text-text-subtle-light dark:text-text-subtle-dark">
              <th className="h-12 px-4 text-left align-middle font-medium">Hình ảnh</th>
              <th className="h-12 px-4 text-left align-middle font-medium">Tên thương hiệu</th>
              
              <th className="h-12 px-4 text-right align-middle font-medium">Hành động</th>
            </tr>
          </thead>
          <tbody className="[&_tr:last-child]:border-0">
            {brands.length > 0 ? (
              brands.map((brand) => (
                <BrandRow
                  key={brand.id || brand.maThuongHieu}
                  brand={brand}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))
            ) : (
              <tr>
                <td colSpan="4" className="p-8 text-center text-text-subtle-light dark:text-text-subtle-dark">
                  <div className="flex flex-col items-center">
                    <span className="material-symbols-outlined text-4xl text-gray-300 mb-2">branding_watermark</span>
                    <p className="text-lg font-medium">Không có thương hiệu nào</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BrandsTable;
