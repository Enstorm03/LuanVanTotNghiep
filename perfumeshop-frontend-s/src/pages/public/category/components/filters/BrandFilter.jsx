import React from 'react';

const BrandFilter = ({ brands, selectedBrands, onBrandChange }) => (
  <div className="py-4 border-b border-gray-200 dark:border-gray-700">
    <h4 className="font-semibold mb-3 text-gray-800 dark:text-gray-200">Thương hiệu</h4>
    <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
      {brands.map((brand) => (
         <label key={brand.idThuongHieu} className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300 cursor-pointer">
            <input
              type="checkbox"
              checked={selectedBrands.includes(brand.idThuongHieu)}
              onChange={(e) => onBrandChange(brand.idThuongHieu, e.target.checked)}
              className="form-checkbox rounded text-primary focus:ring-primary/50"
            />
            <span>{brand.tenThuongHieu}</span>
         </label>
      ))}
    </div>
  </div>
);

export default BrandFilter;
