import React from 'react';
import { useSearchParams } from 'react-router-dom';
import useCategoryMetadata from '../../hooks/useCategoryMetadata';
import useCategoryProducts from '../../hooks/useCategoryProducts';
import CategoryBreadcrumb from './category/components/CategoryBreadcrumb';
import CategoryHeader from './category/components/CategoryHeader';
import FilterSidebar from './category/components/filters/FilterSidebar';
import SortBar from './category/components/SortBar';
import ProductGrid from './category/components/ProductGrid';
import ProductGridSkeleton from './category/components/ProductGridSkeleton';
import EmptyProductState from './category/components/EmptyProductState';
import { getCategoryTitle } from '../../utils/categoryHelpers';
import { useState, useEffect } from 'react';
import api from '../../services/api';

const CategoryPage = () => {
  const [searchParams] = useSearchParams();
  const [campaign, setCampaign] = useState(null);
  const categoryId = searchParams.get('category');
  const brandId = searchParams.get('brand');
  const searchQuery = searchParams.get('search');

  const { categories, brands } = useCategoryMetadata();
  const { 
    products, 
    loading: productsLoading, 
    error: productsError,
    totalPages,
    page,
    goToPage,
    filters,
    handleBrandChange,
    handleConcentrationChange,
    handlePriceChange,
    clearFilters,
    setSortBy,
    sortOptions
  } = useCategoryProducts(categoryId, brandId, searchQuery);

  const categoryTitle = getCategoryTitle(categoryId, brandId, searchQuery, categories, brands);

  // Lấy campaign active
  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        const campaignData = await api.getActiveCampaign();
        if (campaignData?.active) {
          setCampaign(campaignData);
        }
      } catch (err) {
        console.log('No active campaign');
      }
    };
    fetchCampaign();
  }, []);

  return (
    <main className="container mx-auto px-4 py-8 min-h-screen bg-background-light dark:bg-background-dark">
      <CategoryBreadcrumb categoryTitle="Sản phẩm" />

      <CategoryHeader title={categoryTitle} />

      <div className="flex flex-col lg:flex-row gap-8">
        <FilterSidebar
          brands={brands}
          filters={filters}
          onBrandChange={handleBrandChange}
          onConcentrationChange={handleConcentrationChange}
          onPriceChange={handlePriceChange}
          onClearFilters={clearFilters}
        />

        <div className="w-full lg:w-3/4 xl:w-4/5">
          <SortBar
            productCount={products.length}
            sortBy={filters.sortBy}
            onSortChange={setSortBy}
            sortOptions={sortOptions}
            loading={productsLoading}
            error={productsError}
          />

          {productsLoading && <ProductGridSkeleton />}

          {productsError && (
            <div className="text-center py-12">
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 max-w-md mx-auto">
                <p className="text-red-800 dark:text-red-200 font-medium mb-2">Lỗi tải sản phẩm</p>
                <p className="text-red-600 dark:text-red-300 text-sm">{productsError}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
                >
                  Thử lại
                </button>
              </div>
            </div>
          )}

          {!productsLoading && !productsError && (
            products.length === 0 ? (
              <EmptyProductState />
            ) : (
              <ProductGrid products={products} campaign={campaign} />
            )
          )}

          {/* Pagination from BE */}
          {totalPages > 1 && (
            <nav aria-label="Pagination" className="flex justify-center mt-12">
              <ul className="inline-flex items-center -space-x-px text-sm">
                <li>
                  <button
                    onClick={() => goToPage(page - 1)}
                    disabled={page <= 1}
                    className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="material-symbols-outlined text-base">chevron_left</span>
                  </button>
                </li>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
                  <li key={pageNum}>
                    <button
                      onClick={() => goToPage(pageNum)}
                      className={`px-3 h-8 border ${pageNum === page ? 'text-white bg-primary border-primary' : 'text-gray-500 bg-white border-gray-300 hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400'}`}
                    >
                      {pageNum}
                    </button>
                  </li>
                ))}
                <li>
                  <button
                    onClick={() => goToPage(page + 1)}
                    disabled={page >= totalPages}
                    className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="material-symbols-outlined text-base">chevron_right</span>
                  </button>
                </li>
              </ul>
            </nav>
          )}
        </div>
      </div>
    </main>
  );
};

export default CategoryPage;
