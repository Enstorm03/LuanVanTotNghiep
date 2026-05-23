import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';

const useAdminBrands = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState(null);
  const [saving, setSaving] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchBrands = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getAllBrands();
      // Ensure data is an array
      setBrands(Array.isArray(data) ? data : (data?.data || []));
    } catch (err) {
      setError(err.message || 'Lỗi khi tải danh sách thương hiệu');
      console.error('Error fetching brands:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBrands();
  }, [fetchBrands]);

  // Filter and sort brands
  const filteredBrands = brands.filter(brand => {
    const matchesSearch = brand.tenThuongHieu?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  }).sort((a, b) => b.id - a.id); // Sort by ID descending

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentBrands = filteredBrands.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredBrands.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Modal handlers
  const handleOpenModal = (brand = null) => {
    setEditingBrand(brand);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditingBrand(null);
    setIsModalOpen(false);
    setError(null);
  };

  // CRUD handlers
 const handleSaveBrand = async (brandData) => {
    try {
      setSaving(true);
      if (editingBrand) {
        // SỬA Ở ĐÂY: Lấy đúng tên ID từ database là idThuongHieu (hoặc id để phòng hờ)
        const brandId = editingBrand.idThuongHieu || editingBrand.id; 
        await api.updateBrand(brandId, brandData);
      } else {
        await api.createBrand(brandData);
      }
      await fetchBrands();
      handleCloseModal();
      return true;
    } catch (err) {
      setError(err.message || 'Lỗi khi lưu thương hiệu');
      console.error('Error saving brand:', err);
      return false;
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteBrand = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa thương hiệu này?')) {
      return;
    }

    try {
      setLoading(true);
      await api.deleteBrand(id);
      await fetchBrands();
      
    } catch (err) {
      setError(err.message || 'Lỗi khi xóa thương hiệu');
      console.error('Error deleting brand:', err);
      setLoading(false);
    }
  };

  return {
    brands: currentBrands,
    allBrands: brands,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    currentPage,
    totalPages,
    paginate,
    isModalOpen,
    editingBrand,
    saving,
    handleOpenModal,
    handleCloseModal,
    handleSaveBrand,
    handleDeleteBrand,
    fetchBrands
  };
};

export default useAdminBrands;
