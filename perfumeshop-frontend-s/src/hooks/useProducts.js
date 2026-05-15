import { useState, useEffect } from 'react';
import api from '../services/api';

const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Fetch products, categories, and brands in parallel
      const [productsData, categoriesData, brandsData] = await Promise.all([
        api.getAllProducts(),
        api.getCategories(),
        api.getBrands()
      ]);

      setProducts(productsData || []);
      setCategories(categoriesData || []);
      setBrands(brandsData || []);
    } catch (err) {
      setError('Không thể tải dữ liệu');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await api.getAllProducts();
      setProducts(data || []);
    } catch (err) {
      setError('Không thể tải danh sách sản phẩm');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (product = null) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleSaveProduct = async (productData) => {
    try {
      setSaving(true);
      if (editingProduct) {
        // Update existing product - remove IDs since we're sending full objects
        const { idDanhMuc, idThuongHieu, ...updateData } = productData;
        await api.updateProduct(editingProduct.id_san_pham, updateData);
        alert('Cập nhật sản phẩm thành công!');
        handleCloseModal();
        fetchData(); // Refresh all data
      } else {
        // Create new product - remove IDs since we're sending full objects
        const { idDanhMuc, idThuongHieu, ...createData } = productData;
        await api.createProduct(createData);
        alert('Thêm sản phẩm thành công!');
        handleCloseModal();
        fetchData(); // Refresh all data
      }
    } catch (error) {
      alert('Lỗi khi lưu sản phẩm: ' + (error.message || 'Vui lòng thử lại'));
      console.error('Error saving product:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
      return;
    }

    try {
      await api.deleteProduct(productId);
      alert('Xóa sản phẩm thành công!');
      fetchProducts(); // Refresh list
    } catch (error) {
      alert('Lỗi khi xóa sản phẩm: ' + (error.message || 'Vui lòng thử lại'));
      console.error('Error deleting product:', error);
    }
  };

  // Lọc và tìm kiếm
  const filteredProducts = products
    .filter(product => {
      if (categoryFilter === 'All') return true;
      return product.ten_san_pham?.toLowerCase().includes(searchTerm.toLowerCase());
    })
    .filter(product =>
      product.ten_san_pham?.toLowerCase().includes(searchTerm.toLowerCase())
    );

  // Phân trang
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) setCurrentPage(pageNumber);
  };

  return {
    products,
    categories,
    brands,
    loading,
    error,
    isModalOpen,
    editingProduct,
    saving,
    searchTerm,
    categoryFilter,
    currentPage,
    currentProducts,
    totalPages,
    filteredProducts,
    setSearchTerm,
    setCategoryFilter,
    setCurrentPage,
    paginate,
    fetchData,
    fetchProducts,
    handleOpenModal,
    handleCloseModal,
    handleSaveProduct,
    handleDeleteProduct
  };
};

export default useProducts;
