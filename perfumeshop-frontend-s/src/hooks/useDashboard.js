import { useState, useEffect } from 'react';
import api from '../services/api';

const useDashboard = () => {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalCustomers: 0,
    totalEmployees: 0,
    pendingOrders: 0,
    confirmedOrders: 0,
    shippingOrders: 0,
    completedOrders: 0,
    pendingReturns: 0,
    approvedReturns: 0,
    totalReturns: 0
  });

  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const [statsData, recentOrdersData] = await Promise.all([
        api.getDashboardStats().catch(() => null),
        api.getRecentOrders(5).catch(() => [])
      ]);

      if (statsData) {
        setStats({
          totalRevenue: statsData.totalRevenue || 0,
          totalOrders: statsData.totalOrders || 0,
          totalProducts: statsData.totalProducts || 0,
          totalCustomers: statsData.totalCustomers || 0,
          totalEmployees: statsData.totalEmployees || 0,
          pendingOrders: statsData.pendingOrders || 0,
          confirmedOrders: statsData.confirmedOrders || 0,
          shippingOrders: statsData.shippingOrders || 0,
          completedOrders: statsData.completedOrders || 0,
          pendingReturns: statsData.pendingReturns || 0,
          approvedReturns: statsData.approvedReturns || 0,
          totalReturns: statsData.totalReturns || 0
        });
      }

      if (recentOrdersData && recentOrdersData.length > 0) {
        setRecentOrders(recentOrdersData);
      }

    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Không thể tải dữ liệu dashboard');
    } finally {
      setLoading(false);
    }
  };

  return {
    stats,
    recentOrders,
    loading,
    error,
    fetchDashboardData
  };
};

export default useDashboard;