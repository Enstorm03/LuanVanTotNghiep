import React from 'react';
import useProducts from '../../hooks/useProducts';
import ProductsFilter from './products/components/ProductsFilter';
import ProductsTable from './products/components/ProductsTable';
import ProductsPagination from './products/components/ProductsPagination';
import ProductModal from './products/modals/ProductModal';

const AdminProductsPage = () => {
  const {
    categories,
    brands,
    loading,
    error,
    isModalOpen,
    editingProduct,
    saving,
    searchTerm,
    categoryFilter,
    currentProducts,
    totalPages,
    currentPage,
    setSearchTerm,
    setCategoryFilter,
    setCurrentPage,
    paginate,
    fetchProducts,
    handleOpenModal,
    handleCloseModal,
    handleSaveProduct,
    handleDeleteProduct
  } = useProducts();

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
          onClick={fetchProducts}
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
            Quản Lý Sản Phẩm
          </h1>
          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={() => handleOpenModal()}
              className="flex items-center justify-center gap-2 h-9 px-4 text-sm font-medium rounded-md bg-primary text-white hover:bg-primary/90"
            >
              <span className="material-symbols-outlined text-base">add_circle</span>
              Thêm Sản Phẩm
            </button>
          </div>
        </div>

        {/* Filter and Search Controls */}
        <ProductsFilter
          searchTerm={searchTerm}
          onSearchChange={(value) => { setSearchTerm(value); setCurrentPage(1); }}
          categoryFilter={categoryFilter}
          onCategoryFilterChange={(value) => { setCategoryFilter(value); setCurrentPage(1); }}
        />

        <ProductsTable
          products={currentProducts}
          onEdit={handleOpenModal}
          onDelete={handleDeleteProduct}
        />

        {/* Pagination Controls */}
        <ProductsPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={paginate}
        />
      </div>

      {isModalOpen && (
        <ProductModal
          product={editingProduct}
          onClose={handleCloseModal}
          onSave={handleSaveProduct}
          saving={saving}
          categories={categories}
          brands={brands}
        />
      )}
    </>
  );
};

export default AdminProductsPage;
