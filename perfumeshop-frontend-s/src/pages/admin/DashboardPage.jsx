import React from 'react';
import useDashboard from '../../hooks/useDashboard';
import DashboardHeader from './dashboard/components/DashboardHeader';
import StatsCards from './dashboard/components/StatsCards';
import QuickActions from './dashboard/components/QuickActions';
import RecentOrders from './dashboard/components/RecentOrders';
import OrderStatusOverview from './dashboard/components/OrderStatusOverview';

const DashboardPage = () => {
  const { stats, recentOrders, loading, error, fetchDashboardData } = useDashboard();

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
            onClick={fetchDashboardData}
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
      <DashboardHeader onRefresh={fetchDashboardData} />

      <StatsCards stats={stats} />

      <QuickActions />

      <RecentOrders recentOrders={recentOrders} />

      <OrderStatusOverview stats={stats} recentOrders={recentOrders} />
    </div>
  );
};

export default DashboardPage;
