import React from 'react';
import useOrders from '../../hooks/useOrders';
import OrdersFilter from './orders/components/OrdersFilter';
import OrdersTable from './orders/components/OrdersTable';
import OrdersPagination from './orders/components/OrdersPagination';

const AdminOrdersPage = () => {
  const {
    loading,
    error,
    searchTerm,
    statusFilter,
    currentOrders,
    totalPages,
    currentPage,
    setSearchTerm,
    setStatusFilter,
    paginate,
    fetchOrders
  } = useOrders(true); // isAdmin = true

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
          onClick={fetchOrders}
          className="bg-primary text-white font-bold py-3 px-6 rounded-lg hover:bg-primary/90 transition-colors"
        >
          Thử lại
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center">
        <h1 className="font-semibold text-lg md:text-2xl text-text-light dark:text-text-dark">
          Quản Lý Đơn Hàng
        </h1>
      </div>

      {/* Filter and Search Controls */}
      <OrdersFilter
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
      />

      <OrdersTable orders={currentOrders} />

      {/* Pagination Controls */}
      <OrdersPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={paginate}
      />
    </div>
  );
};

export default AdminOrdersPage;
