import React from 'react';
import { getConcentrationTypes } from '../../../../../utils/categoryHelpers';
import BrandFilter from './BrandFilter';
import PriceFilter from './PriceFilter';
import ConcentrationFilter from './ConcentrationFilter';

const FilterSidebar = ({
  brands,
  filters,
  onBrandChange,
  onConcentrationChange,
  onPriceChange,
  onClearFilters
}) => (
  <aside className="w-full lg:w-1/4 xl:w-1/5">
    <div className="sticky top-28 p-6 bg-white dark:bg-surface-dark rounded-xl shadow-sm border border-border-light dark:border-border-dark">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Bộ lọc</h3>
        <button
          onClick={onClearFilters}
          className="text-sm text-primary hover:underline"
        >
          Xóa bộ lọc
        </button>
      </div>

      <BrandFilter
        brands={brands}
        selectedBrands={filters.selectedBrands}
        onBrandChange={onBrandChange}
      />

      <PriceFilter
        maxPrice={filters.maxPrice}
        onPriceChange={onPriceChange}
      />

      <ConcentrationFilter
        concentrationTypes={getConcentrationTypes()}
        selectedConcentrations={filters.selectedConcentrations}
        onConcentrationChange={onConcentrationChange}
      />

      <div className="pt-6">
        <button
          onClick={() => {}} // Filters are applied automatically
          className="w-full h-10 flex items-center justify-center rounded-lg bg-primary text-white text-sm font-bold hover:bg-opacity-90 transition-colors"
        >
          Áp dụng
        </button>
      </div>
    </div>
  </aside>
);

export default FilterSidebar;
