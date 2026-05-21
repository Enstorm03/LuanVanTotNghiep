import { useState, useEffect } from 'react';
import { getDefaultDateRange } from '../utils/dateRange';
import api from '../services/api';

/**
 * Map fields from BE response to FE structure.
 * Supports both English camelCase and Vietnamese camelCase field naming.
 */
const mapReportData = (summaryData, topProductsData, revenueByStatusData) => {
  // Helper to safely get value from multiple possible field names
  const getField = (obj, ...keys) => {
    if (!obj) return undefined;
    for (const key of keys) {
      const value = obj[key];
      if (value !== undefined && value !== null) return value;
    }
    return undefined;
  };

  // Map order stats - BE might return Vietnamese keys or English keys
  const orderStats = summaryData?.orderStats || {};
  const mappedOrderStats = {
    pending: getField(orderStats, 'pending', 'dangCho', 'pendingOrders', 'soLuongDangCho') ?? 0,
    confirmed: getField(orderStats, 'confirmed', 'daXacNhan', 'confirmedOrders', 'soLuongDaXacNhan') ?? 0,
    shipping: getField(orderStats, 'shipping', 'dangGiao', 'shippingOrders', 'soLuongDangGiao') ?? 0,
    completed: getField(orderStats, 'completed', 'hoanThanh', 'completedOrders', 'soLuongHoanThanh') ?? 0,
    cancelled: getField(orderStats, 'cancelled', 'daHuy', 'cancelledOrders', 'soLuongDaHuy') ?? 0,
    deposit: getField(orderStats, 'deposit', 'datCoc', 'depositOrders', 'soLuongDatCoc') ?? 0
  };

  // Map customer stats
  const customerStats = summaryData?.customerStats || {};
  const mappedCustomerStats = {
    totalCustomers: getField(customerStats, 'totalCustomers', 'tongKhachHang', 'totalCustomersCount') ?? 0,
    newCustomers: getField(customerStats, 'newCustomers', 'khachHangMoi', 'newCustomersCount') ?? 0,
    repeatCustomers: getField(customerStats, 'repeatCustomers', 'khachHangQuayLai', 'repeatCustomersCount') ?? 0
  };

  // Map top products - ensure each product has name, revenue, quantity
  const mappedTopProducts = Array.isArray(topProductsData) 
    ? topProductsData.map(p => ({
        id: getField(p, 'id', 'idSanPham', 'id_san_pham', 'productId'),
        name: getField(p, 'name', 'tenSanPham', 'ten_san_pham', 'productName') || 'Không có tên',
        revenue: getField(p, 'revenue', 'doanhThu', 'doanh_thu', 'totalRevenue') ?? 0,
        quantity: getField(p, 'quantity', 'soLuongDaBan', 'so_luong_da_ban', 'soLuong', 'so_luong', 'soldQuantity') ?? 0
      }))
    : [];

  // Map revenue by status
  const mappedRevenueByStatus = Array.isArray(revenueByStatusData)
    ? revenueByStatusData.map(item => ({
        status: getField(item, 'status', 'trangThai', 'trang_thai', 'orderStatus') || 'unknown',
        revenue: getField(item, 'revenue', 'doanhThu', 'doanh_thu', 'totalRevenue') ?? 0,
        count: getField(item, 'count', 'soLuong', 'so_luong', 'orderCount') ?? 0
      }))
    : [];

  return {
    totalRevenue: getField(summaryData, 'totalRevenue', 'tongDoanhThu', 'total_revenue', 'totalRevenueAmount') ?? 0,
    totalOrders: getField(summaryData, 'totalOrders', 'tongDonHang', 'total_orders', 'totalOrderCount') ?? 0,
    averageOrderValue: getField(summaryData, 'averageOrderValue', 'trungBinhDonHang', 'average_order_value', 'avgOrderValue') ?? 0,
    topProducts: mappedTopProducts,
    revenueByStatus: mappedRevenueByStatus,
    customerStats: mappedCustomerStats,
    orderStats: mappedOrderStats
  };
};

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
        const mapped = mapReportData(summaryData, topProductsData, revenueByStatusData);
        setReportData(mapped);
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