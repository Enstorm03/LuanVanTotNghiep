import { useState, useEffect } from 'react';
import { getDefaultDateRange } from '../utils/dateRange';
import api from '../services/api';

// file này để lấy dữ liệu báo cáo, tránh gọi API nhiều lần
const mapReportData = (summaryDataRaw, topProductsDataRaw, revenueByStatusDataRaw) => {
  // Unwrap 'data' if backend uses a wrapper like { data: { ... } } or { result: { ... } }
  const summaryData = summaryDataRaw?.data || summaryDataRaw?.result || summaryDataRaw || {};
  const topProductsData = topProductsDataRaw?.data || topProductsDataRaw?.result || topProductsDataRaw || [];
  const revenueByStatusData = revenueByStatusDataRaw?.data || revenueByStatusDataRaw?.result || revenueByStatusDataRaw || [];

  // lấy giá trị từ nhiều key khác nhau để đảm bảo tương thích với các phiên bản backend khác nhau
  const getField = (obj, ...keys) => {
    if (!obj) return undefined;
    for (const key of keys) {
      const value = obj[key];
      if (value !== undefined && value !== null) return value;
    }
    return undefined;
  };

  // Map order stats - Lấy từ object root (summaryData) nếu orderStats không tồn tại (đối với JSON phẳng từ BE)
  const orderStats = summaryData?.orderStats || summaryData || {};
  const mappedOrderStats = {
    pending: getField(orderStats, 'pending', 'dangCho', 'pendingOrders', 'soLuongDangCho') ?? 0,
    confirmed: getField(orderStats, 'confirmed', 'daXacNhan', 'confirmedOrders', 'soLuongDaXacNhan') ?? 0,
    shipping: getField(orderStats, 'shipping', 'dangGiao', 'shippingOrders', 'soLuongDangGiao') ?? 0,
    completed: getField(orderStats, 'completed', 'hoanThanh', 'completedOrders', 'soLuongHoanThanh') ?? 0,
    cancelled: getField(orderStats, 'cancelled', 'daHuy', 'cancelledOrders', 'soLuongDaHuy') ?? 0,
    deposit: getField(orderStats, 'deposit', 'datCoc', 'depositOrders', 'soLuongDatCoc') ?? 0
  };

  // Map customer stats - Lấy từ object root (summaryData) nếu customerStats không tồn tại
  const customerStats = summaryData?.customerStats || summaryData || {};
  const mappedCustomerStats = {
    totalCustomers: getField(customerStats, 'totalCustomers', 'tongKhachHang', 'totalCustomersCount', 'newCustomers') ?? 0,
    newCustomers: getField(customerStats, 'newCustomers', 'khachHangMoi', 'newCustomersCount') ?? 0,
    repeatCustomers: getField(customerStats, 'repeatCustomers', 'khachHangQuayLai', 'repeatCustomersCount') ?? 0
  };

  // sử dụng getField để lấy dữ liệu từ nhiều key khác nhau, đảm bảo tương thích với các phiên bản backend khác nhau
  const mappedTopProducts = Array.isArray(topProductsData) 
    ? topProductsData.map(p => ({
        id: getField(p, 'id', 'idSanPham', 'id_san_pham', 'productId'),
        name: getField(p, 'name', 'tenSanPham', 'ten_san_pham', 'productName') || 'Không có tên',
        revenue: getField(p, 'revenue', 'doanhThu', 'doanh_thu', 'totalRevenue') ?? 0,
        quantity: getField(p, 'quantity', 'soLuongDaBan', 'so_luong_da_ban', 'soLuong', 'so_luong', 'soldQuantity', 'totalQuantity') ?? 0
      }))
    : [];

  // sử dụng getField để lấy dữ liệu từ nhiều key khác nhau, đảm bảo tương thích với các phiên bản backend khác nhau
  let mappedRevenueByStatus = [];
  if (Array.isArray(revenueByStatusData)) {
    mappedRevenueByStatus = revenueByStatusData.map(item => ({
        status: getField(item, 'status', 'trangThai', 'trang_thai', 'orderStatus') || 'unknown',
        revenue: getField(item, 'revenue', 'doanhThu', 'doanh_thu', 'totalRevenue') ?? 0,
        count: getField(item, 'count', 'soLuong', 'so_luong', 'orderCount') ?? 0
      }));
  } else if (revenueByStatusData && typeof revenueByStatusData === 'object') {
    const revMap = revenueByStatusData.revenueByStatus || revenueByStatusData;
    mappedRevenueByStatus = Object.keys(revMap).map(key => ({
      status: key,
      revenue: revMap[key],
      count: 0
    }));
  }

  return {
    totalRevenue: getField(summaryData, 'totalRevenue', 'tongDoanhThu', 'total_revenue', 'totalRevenueAmount') ?? 0,
    totalOrders: getField(summaryData, 'totalOrders', 'tongDonHang', 'total_orders', 'totalOrderCount') ?? 0,
    averageOrderValue: getField(summaryData, 'averageOrderValue', 'avgOrderValue', 'trungBinhDonHang', 'average_order_value') ?? 0,
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
        api.getReportSummary(startDate, endDate).catch((e) => { console.error('Summary API Error:', e); return null; }),
        api.getTopProducts(startDate, endDate, 10).catch((e) => { console.error('Top Products API Error:', e); return []; }),
        api.getRevenueByStatus(startDate, endDate).catch((e) => { console.error('Revenue API Error:', e); return []; })
      ]);

      if (summaryData) {
        const mapped = mapReportData(summaryData, topProductsData, revenueByStatusData);
        setReportData(mapped);
      } else {
        setError('Dữ liệu báo cáo chưa sẵn sàng. Vui lòng kiểm tra Console (F12) để xem chi tiết lỗi.');
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