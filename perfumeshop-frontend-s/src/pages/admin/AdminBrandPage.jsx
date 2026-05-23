import React from 'react';
import useAdminBrands from '../../hooks/useAdminBrands';
import BrandsTable from './brands/components/BrandsTable';

import BrandModal from './brands/modals/BrandModal';

const AdminBrandPage = () => {
  const {
    brands,
    loading,
    error,
    isModalOpen,
    editingBrand,
    saving,
    searchTerm,
    totalPages,
    currentPage,
    setSearchTerm,
    setCurrentPage,
    paginate,
    fetchBrands,
    handleOpenModal,
    handleCloseModal,
    handleSaveBrand,
    handleDeleteBrand
  } = useAdminBrands();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={fetchBrands}
          className="bg-primary text-white font-bold py-3 px-6 rounded-lg hover:bg-primary/90 transition-colors"
        >
          Thử lại
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center">
          <h1 className="font-semibold text-lg md:text-2xl text-text-light dark:text-text-dark">
            Quản Lý Thương Hiệu
          </h1>
          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={() => handleOpenModal()}
              className="flex items-center justify-center gap-2 h-9 px-4 text-sm font-medium rounded-md bg-primary text-white hover:bg-primary/90"
            >
              <span className="material-symbols-outlined text-base">add_circle</span>
              Thêm Thương Hiệu
            </button>
          </div>
        </div>

        {/* Filter and Search Controls */}
        

        <BrandsTable
          brands={brands}
          onEdit={handleOpenModal}
          onDelete={handleDeleteBrand}
        />

       
      </div>

      {isModalOpen && (
        <BrandModal
          brand={editingBrand}
          onClose={handleCloseModal}
          onSave={handleSaveBrand}
          saving={saving}
        />
      )}
    </>
  );
};

export default AdminBrandPage;
