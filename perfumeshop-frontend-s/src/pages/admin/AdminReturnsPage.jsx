import React from 'react';
import useReturns from '../../hooks/useReturns';
import ReturnsHeader from './returns/components/ReturnsHeader';
import ReturnsSummary from './returns/components/ReturnsSummary';
import ReturnsList from './returns/components/ReturnsList';

const AdminReturnsPage = () => {
  const {
    returns,
    loading,
    error,
    processing,
    fetchAllReturns,
    handleApproveReturn,
    handleRejectReturn,
    getPendingCount,
    getApprovedCount,
    getRejectedCount
  } = useReturns();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-bold text-red-600 mb-4">Lỗi tải dữ liệu</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchAllReturns}
            className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <ReturnsHeader onRefresh={fetchAllReturns} />

      <ReturnsSummary
        pendingCount={getPendingCount()}
        approvedCount={getApprovedCount()}
        rejectedCount={getRejectedCount()}
      />

      <ReturnsList
        returns={returns}
        onApprove={handleApproveReturn}
        onReject={handleRejectReturn}
        processing={processing}
      />
    </div>
  );
};

export default AdminReturnsPage;
