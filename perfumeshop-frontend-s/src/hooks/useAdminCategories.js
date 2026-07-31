import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';

const useAdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getAllCategories();
      setCategories(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Lỗi khi tải danh sách danh mục');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchCategories(); }, [fetchCategories]);

  const filtered = categories.filter(c =>
    c.tenDanhMuc?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenModal = (category = null) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditingCategory(null);
    setIsModalOpen(false);
    setError(null);
  };

  const handleSave = async (formData) => {
    try {
      setSaving(true);
      if (editingCategory) {
        await api.updateCategory(editingCategory.idDanhMuc, formData);
      } else {
        await api.createCategory(formData);
      }
      await fetchCategories();
      handleCloseModal();
      return true;
    } catch (err) {
      setError(err.message || 'Lỗi khi lưu danh mục');
      return false;
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Xóa danh mục này?')) return;

    try {
      await api.deleteCategory(id);
      await fetchCategories();
    } catch (err) {
      alert('Không thể xóa: ' + err.message);
    }
  };
  return {
    categories: filtered,
    loading, error, searchTerm, setSearchTerm,
    isModalOpen, editingCategory, saving,
    handleOpenModal, handleCloseModal, handleSave, handleDelete,
    fetchCategories,
  };
};

export default useAdminCategories;
