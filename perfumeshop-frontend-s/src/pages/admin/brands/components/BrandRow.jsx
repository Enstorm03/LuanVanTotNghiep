import React from 'react';
// file này để hiển thị từng hàng của bảng danh sách thương hiệu, tránh gọi API nhiều lần
const BrandRow = ({ brand, onEdit, onDelete }) => {
  return (
    <tr className="border-b transition-colors hover:bg-surface-hover-light dark:hover:bg-surface-hover-dark data-[state=selected]:bg-gray-100 border-border-light dark:border-border-dark text-text-light dark:text-text-dark">
      <td className="p-4 align-middle">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden flex items-center justify-center">
            {brand.urlHinhAnh ? (
              <img
                src={brand.urlHinhAnh}
                alt={brand.tenThuongHieu}
                className="h-full w-full object-cover"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/48?text=Brand';
                }}
              />
            ) : (
              <span className="material-symbols-outlined text-gray-400">image</span>
            )}
          </div>
        </div>
      </td>
      <td className="p-4 align-middle font-medium">
        {brand.tenThuongHieu} 
      </td>
     
      <td className="p-4 align-middle text-right">
        <div className="flex justify-end gap-2">
          <button
            onClick={() => onEdit(brand)}
            className="p-2 rounded-md bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
            title="Chỉnh sửa"
          >
            <span className="material-symbols-outlined text-sm">edit</span>
          </button>
          <button
            onClick={() => onDelete(brand.id || brand.idThuongHieu)}
            className="p-2 rounded-md bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
            title="Xóa"
          >
            <span className="material-symbols-outlined text-sm">delete</span>
          </button>
        </div>
      </td>
    </tr>
  );
};

export default BrandRow;
