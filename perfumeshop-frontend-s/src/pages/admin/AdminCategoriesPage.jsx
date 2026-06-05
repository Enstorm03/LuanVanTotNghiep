import React, { useState } from 'react';
import useAdminCategories from '../../hooks/useAdminCategories';

/* ── Modal thêm / sửa danh mục ── */
const CategoryModal = ({ category, onClose, onSave, saving }) => {
  const [name, setName] = useState(category?.tenDanhMuc || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSave({ tenDanhMuc: name.trim() });
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-sm">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="font-bold text-lg">
            {category ? 'Sửa danh mục' : 'Thêm danh mục'}
          </h3>
          <button onClick={onClose} className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="px-5 py-5 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Tên danh mục</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="VD: Nước hoa nam, Nước hoa nữ..."
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-gray-700"
              autoFocus
            />
          </div>
          <div className="flex gap-3 pt-1">
            <button
              type="submit"
              disabled={saving || !name.trim()}
              className="flex-1 bg-primary text-white py-2.5 rounded-xl font-semibold hover:bg-primary/90 disabled:opacity-50 transition-colors"
            >
              {saving ? 'Đang lưu...' : 'Lưu'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 bg-gray-100 dark:bg-gray-700 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* ── Trang chính ── */
const AdminCategoriesPage = () => {
  const {
    categories, loading, error,
    searchTerm, setSearchTerm,
    isModalOpen, editingCategory, saving,
    handleOpenModal, handleCloseModal, handleSave, handleDelete,
    fetchCategories,
  } = useAdminCategories();

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
    </div>
  );

  if (error) return (
    <div className="text-center py-12">
      <p className="text-red-500 mb-4">{error}</p>
      <button onClick={fetchCategories} className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90">
        Thử lại
      </button>
    </div>
  );

  return (
    <>
      <div className="flex flex-1 flex-col gap-6 p-4 md:p-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <h1 className="font-semibold text-lg md:text-2xl text-text-light dark:text-text-dark flex-1">
            Quản lý Danh Mục
          </h1>
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary/90 transition-colors"
          >
            <span className="material-symbols-outlined text-base">add_circle</span>
            Thêm danh mục
          </button>
        </div>

        {/* Search */}
        <div className="relative max-w-sm">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg">search</span>
          <input
            type="text"
            placeholder="Tìm danh mục..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Table */}
        <div className="rounded-xl border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th className="text-left px-5 py-3 font-semibold text-gray-600 dark:text-gray-300 w-16">ID</th>
                <th className="text-left px-5 py-3 font-semibold text-gray-600 dark:text-gray-300">Tên danh mục</th>
                <th className="text-left px-5 py-3 font-semibold text-gray-600 dark:text-gray-300">Số sản phẩm</th>
                <th className="px-5 py-3 w-28" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border-light dark:divide-border-dark">
              {categories.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-10 text-gray-400">
                    {searchTerm ? 'Không tìm thấy danh mục phù hợp' : 'Chưa có danh mục nào'}
                  </td>
                </tr>
              ) : categories.map(cat => (
                <tr key={cat.idDanhMuc} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                  <td className="px-5 py-3 text-gray-500">#{cat.idDanhMuc}</td>
                  <td className="px-5 py-3 font-medium">{cat.tenDanhMuc}</td>
                  <td className="px-5 py-3 text-gray-500">
                    {cat.listSanPham?.length ?? 0} sản phẩm
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleOpenModal(cat)}
                        className="p-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 text-blue-600 transition-colors"
                        title="Sửa"
                      >
                        <span className="material-symbols-outlined text-base">edit</span>
                      </button>
                      <button
                        onClick={() => handleDelete(cat.idDanhMuc)}
                        className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 text-red-500 transition-colors"
                        title="Xóa"
                      >
                        <span className="material-symbols-outlined text-base">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="text-xs text-gray-400">{categories.length} danh mục</p>
      </div>

      {isModalOpen && (
        <CategoryModal
          category={editingCategory}
          onClose={handleCloseModal}
          onSave={handleSave}
          saving={saving}
        />
      )}
    </>
  );
};

export default AdminCategoriesPage;
