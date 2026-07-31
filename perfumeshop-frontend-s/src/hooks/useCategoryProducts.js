import { useState, useEffect } from 'react';
import api from '../services/api';

export const SORT_OPTIONS = [
  'Mới nhất',
  // 'Bán chạy nhất',
  'Giá: Tăng dần',
  'Giá: Giảm dần'
];

const getDefaultFilters = () => ({
  selectedBrands: [],
  selectedConcentrations: [],
  maxPrice: 10000000,
  sortBy: 'Mới nhất'
});

const useCategoryProducts = (categoryId, brandId, searchQuery) => {
  const [products, setProducts] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const pageSize = 20;

  const [filters, setFilters] = useState(getDefaultFilters());

  // Reset page to 1 when filters or URL params change
  useEffect(() => {
    setPage(1);
  }, [categoryId, brandId, searchQuery, filters]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        // Map UI sort to API params
        let apiSortBy = 'idSanPham';
        let apiSortDir = 'desc';
        
        switch (filters.sortBy) {
          case 'Giá: Tăng dần':
            apiSortBy = 'giaBan';
            apiSortDir = 'asc';
            break;
          case 'Giá: Giảm dần':
            apiSortBy = 'giaBan';
            apiSortDir = 'desc';
            break;
          case 'Bán chạy nhất':
            apiSortBy = 'soLuongDaBan';
            apiSortDir = 'desc';
            break;
          case 'Mới nhất':
          default:
            apiSortBy = 'idSanPham';
            apiSortDir = 'desc';
            break;
        }

        const CONCENTRATION_RANGES = { 20: { min: 20, max: null }, 15: { min: 15, max: 20 }, 5: { min: 5, max: 15 }, 2: { min: 2, max: 5 } };
        let nongDoMin = undefined;
        let nongDoMax = undefined;
        if (filters.selectedConcentrations.length > 0) {
          const ranges = filters.selectedConcentrations.map(v => CONCENTRATION_RANGES[v]).filter(Boolean);
          nongDoMin = Math.min(...ranges.map(r => r.min));
          const maxes = ranges.map(r => r.max).filter(v => v != null);
          nongDoMax = maxes.length === ranges.length ? Math.max(...maxes) : undefined; // nếu có Parfum (max=null) thì bỏ maxGia
        }

        // Dùng API advanced search của BE (filter + sort + paginate ALL-IN-ONE)
        const result = await api.searchProductsAdvanced({
          kw: searchQuery || undefined,
          danhMucId: categoryId || undefined,
          thuongHieuId: (filters.selectedBrands.length > 0 ? filters.selectedBrands.join(',') : brandId) || undefined,
          nongDoMin,
          nongDoMax,
          maxGia: filters.maxPrice < 10000000 ? filters.maxPrice : undefined,
          sortBy: apiSortBy,
          sortDir: apiSortDir,
          page: page > 0 ? page - 1 : 0,
          size: pageSize
        });

        setProducts(result.products || []);
        setTotalPages(result.totalPages || 1);
        setTotalElements(result.totalElements || 0);
      } catch (err) {
        setError('Không thể tải sản phẩm. Vui lòng thử lại sau.');
        console.error('Error fetching products:', err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryId, brandId, searchQuery, page, filters]);

  const goToPage = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const updateFilters = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleBrandChange = (bId, checked) => {
    const newSelectedBrands = checked
      ? [...filters.selectedBrands, bId]
      : filters.selectedBrands.filter(id => id !== bId);
    updateFilters({ selectedBrands: newSelectedBrands });
  };

  const handleConcentrationChange = (type, checked) => {
    const newSelectedConcentrations = checked
      ? [...filters.selectedConcentrations, type]
      : filters.selectedConcentrations.filter(t => t !== type);
    updateFilters({ selectedConcentrations: newSelectedConcentrations });
  };

  const handlePriceChange = (priceRange) => {
    updateFilters({ maxPrice: priceRange });
  };

  const clearFilters = () => {
    setFilters(getDefaultFilters());
  };

  const setSortBy = (sortBy) => {
    updateFilters({ sortBy });
  };

  return {
    products,
    totalPages,
    totalElements,
    loading,
    error,
    page,
    goToPage,
    pageSize,
    
    // Filter properties
    filters,
    handleBrandChange,
    handleConcentrationChange,
    handlePriceChange,
    clearFilters,
    setSortBy,
    sortOptions: SORT_OPTIONS
  };
};

export default useCategoryProducts;
