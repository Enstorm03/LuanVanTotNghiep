import { useState, useEffect } from 'react';
import api from '../services/api';

const usePosProducts = () => {
  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadProductsAndBrands = async () => {
    try {
      setLoading(true);
      setError('');

      // Load products and brands in parallel
      const [productsData, brandsData] = await Promise.all([
        api.getAllProducts(),
        api.getBrands()
      ]);

      // Create brand mapping
      const brandMap = {};
      brandsData.forEach(brand => {
        brandMap[brand.idThuongHieu] = brand.tenThuongHieu;
      });

      setProducts(productsData);
      setBrands(brandMap);
    } catch (err) {
      setError('Không thể tải dữ liệu sản phẩm');
      console.error('Error loading products/brands:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProductsAndBrands();
  }, []);

  const filterProducts = (searchTerm) => {
    return products.filter(product =>
      product.ten_san_pham.toLowerCase().includes(searchTerm.toLowerCase()) ||
      brands[product.id_thuong_hieu]?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  return {
    products,
    brands,
    loading,
    error,
    filterProducts,
    reloadProducts: loadProductsAndBrands
  };
};

export default usePosProducts;


