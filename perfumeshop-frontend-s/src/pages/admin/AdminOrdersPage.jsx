import React, { useEffect } from 'react';
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
    totalElements,
    currentPage,
    setSearchTerm,
    setStatusFilter,
    paginate,
    fetchOrders
  } = useOrders(true); // isAdmin = true

  // Auto-refresh mỗi 30 giây để admin thấy đơn mới / đơn hủy
  useEffect(() => {
    const interval = setInterval(() => {
      fetchOrders();
    }, 30000);
    return () => clearInterval(interval);
  }, [fetchOrders]);

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
      <div className="flex items-center justify-between">
        <h1 className="font-semibold text-lg md:text-2xl text-text-light dark:text-text-dark">
          Quản Lý Đơn Hàng
        </h1>
        <button
          onClick={fetchOrders}
          disabled={loading}
          className="flex items-center gap-2 px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
        >
          <span className="material-symbols-outlined text-base">refresh</span>
          Làm mới
        </button>
      </div>

      {/* Filter and Search Controls */}
      <OrdersFilter
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
      />

      <OrdersTable orders={currentOrders} />

      {/* Tổng số + Phân trang */}
      <div className="flex items-center justify-between text-sm text-gray-500">
        <span>
          {totalElements > 0
            ? `Hiển thị trang ${currentPage}/${totalPages} — ${totalElements} đơn hàng`
            : 'Không có đơn hàng nào'}
        </span>
        <OrdersPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={paginate}
        />
      </div>
    </div>
  );
};

export default AdminOrdersPage;
