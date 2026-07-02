import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

const AdminHeader = () => {
  
  const { isAdmin, isStoreManager, isWarehouseStaff, isSalesStaff, getRole, getRoleLabel } = useAuth();
  const [pendingOrders, setPendingOrders] = useState(0);
  const [lowStockItems, setLowStockItems] = useState(0);
  const [loading, setLoading] = useState(true);

  // Load backend data on component mount
  useEffect(() => {
    
    const loadDashboardData = async () => {
      try {
        setLoading(true);

        const alerts = await api.getDashboardAlerts();
        if (alerts) {
          setPendingOrders(alerts.pendingOrders || 0);
          setLowStockItems(alerts.lowStockItems || 0);
        }

      } catch (error) {
        console.error('Error loading dashboard data:', error);
        // Set defaults on error
        setPendingOrders(0);
        setLowStockItems(0);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();

    // Refresh data every 30 seconds
    
    const interval = setInterval(loadDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);
  const role = getRole();
  return (
    <header className="flex h-14 items-center gap-4 border-b bg-surface-light dark:bg-surface-dark px-4 lg:h-[60px] lg:px-6">
      {/* Có thể thêm nút mở/đóng sidebar trên mobile ở đây */}
      <div className="w-full flex-1 flex items-center gap-4">
        
      </div>
        <div className="px-4 py-2">
          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
            isAdmin()        ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' :
            isStoreManager() ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' :
            isWarehouseStaff() && role === 'WAREHOUSE_STAFF' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300' :
            'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
          }`}>
            <span className="material-symbols-outlined text-sm">badge</span>
            {getRoleLabel(role)}
          </span>
        </div>
      <div className="flex items-center gap-4">
        {/* Dashboard Alerts - Only show if there are alerts */}
        {(pendingOrders > 0 || lowStockItems > 0) && !loading && (
          <div className="flex items-center gap-2">
            {pendingOrders > 0 && (
              <Link
                to="/admin/orders"
                className="flex items-center gap-1 bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200 px-3 py-1 rounded-full text-xs font-medium hover:bg-orange-200 dark:hover:bg-orange-900/50 transition-colors"
                title={`${pendingOrders} đơn hàng đang chờ xác nhận`}
              >
                <span className="material-symbols-outlined text-sm">schedule</span>
                {pendingOrders}
              </Link>
            )}
            {lowStockItems > 0 && (
              <Link
                to="/admin/products"
                className="flex items-center gap-1 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 px-3 py-1 rounded-full text-xs font-medium hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                title={`${lowStockItems} sản phẩm sắp hết hàng (< 5)`}
              >
                <span className="material-symbols-outlined text-sm">inventory_2</span>
                {lowStockItems}
              </Link>
            )}
          </div>
        )}
        <Link to="/" title="Quay về trang chủ" className="hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded-lg transition-colors">
          <span className="material-symbols-outlined">home</span>
        </Link>
      </div>
    </header>
  );
};

export default AdminHeader;
