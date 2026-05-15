import { useState, useEffect } from 'react';
import { getDefaultDateRange } from '../utils/dateRange';
import api from '../services/api';

const useReport = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dateRange, setDateRange] = useState(getDefaultDateRange());

  const [reportData, setReportData] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    averageOrderValue: 0,
    topProducts: [],
    revenueByStatus: [],
    customerStats: {
      totalCustomers: 0,
      newCustomers: 0,
      repeatCustomers: 0
    },
    orderStats: {
      pending: 0,
      confirmed: 0,
      shipping: 0,
      completed: 0,
      cancelled: 0,
      deposit: 0
    }
  });

  useEffect(() => {
    fetchReportData();
  }, [dateRange]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchReportData = async () => {
    try {
      setLoading(true);
      setError('');

      const { startDate, endDate } = dateRange;

      const [summaryData, topProductsData, revenueByStatusData] = await Promise.all([
        api.getReportSummary(startDate, endDate).catch(() => null),
        api.getTopProducts(startDate, endDate, 10).catch(() => []),
        api.getRevenueByStatus(startDate, endDate).catch(() => [])
      ]);

      if (summaryData) {
        setReportData({
          totalRevenue: summaryData.totalRevenue || 0,
          totalOrders: summaryData.totalOrders || 0,
          averageOrderValue: summaryData.averageOrderValue || 0,
          topProducts: Array.isArray(topProductsData) ? topProductsData : [],
          revenueByStatus: Array.isArray(revenueByStatusData) ? revenueByStatusData : [],
          customerStats: summaryData.customerStats || { totalCustomers: 0, newCustomers: 0, repeatCustomers: 0 },
          orderStats: summaryData.orderStats || { pending: 0, confirmed: 0, shipping: 0, completed: 0, cancelled: 0, deposit: 0 }
        });
      } else {
        setError('Dữ liệu báo cáo chưa sẵn sàng');
      }
    } catch (err) {
      console.error('Error fetching report data:', err);
      setError('Không thể tải dữ liệu báo cáo');
    } finally {
      setLoading(false);
    }
  };

  const handleDateRangeChange = (field, value) => {
    setDateRange(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const getConversionRate = () => {
    const total = reportData.totalOrders || 0;
    const completed = reportData.orderStats?.completed || 0;
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  };

  return {
    loading,
    error,
    dateRange,
    reportData,
    fetchReportData,
    handleDateRangeChange,
    getConversionRate
  };
};

export default useReport;