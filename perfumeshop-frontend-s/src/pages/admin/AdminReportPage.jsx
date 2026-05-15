import React from 'react';
import useReport from '../../hooks/useReport';
import api from '../../services/api';
import ReportHeader from './reports/components/ReportHeader';
import SummaryCards from './reports/components/SummaryCards';
import OrderStatusChart from './reports/components/OrderStatusChart';
import TopProducts from './reports/components/TopProducts';
import RevenueBreakdown from './reports/components/RevenueBreakdown';
import CustomerInsights from './reports/components/CustomerInsights';
import PeriodSummary from './reports/components/PeriodSummary';

const AdminReportPage = () => {
  const {
    loading,
    error,
    dateRange,
    reportData,
    fetchReportData,
    handleDateRangeChange,
    getConversionRate
  } = useReport();

  const handleExport = () => {
    api.exportReport(dateRange.startDate, dateRange.endDate, 'csv');
  };

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
            onClick={fetchReportData}
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
      {/* Page Header */}
      <ReportHeader
        dateRange={dateRange}
        onDateRangeChange={handleDateRangeChange}
        onExport={handleExport}
      />

      {/* Summary Cards */}
      <SummaryCards
        reportData={reportData}
        conversionRate={getConversionRate()}
      />

      {/* Charts Section */}
      <div className="grid gap-8 md:grid-cols-2">
        <OrderStatusChart orderStats={reportData.orderStats} />
        <TopProducts topProducts={reportData.topProducts} />
      </div>

      {/* Detailed Statistics */}
      <div className="grid gap-8 md:grid-cols-3">
        <RevenueBreakdown reportData={reportData} />
        <CustomerInsights customerStats={reportData.customerStats} />
        <PeriodSummary dateRange={dateRange} totalOrders={reportData.totalOrders} />
      </div>
    </div>
  );
};

export default AdminReportPage;
