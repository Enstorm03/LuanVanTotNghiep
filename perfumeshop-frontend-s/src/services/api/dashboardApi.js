import BaseApi, { API_BASE_URL } from './baseApi.js';

class DashboardApi extends BaseApi {
  async getDashboardStats() {
    try {
      return await this._fetch(`${API_BASE_URL}/admin/dashboard/stats`);
    } catch (error) {
      console.error('Lỗi lấy thống kê dashboard:', error);
      throw error;
    }
  }

  async getRecentOrders(limit = 5) {
    try {
      return await this._fetch(`${API_BASE_URL}/admin/dashboard/recent-orders?limit=${limit}`);
    } catch (error) {
      console.error('Lỗi lấy đơn hàng gần đây:', error);
      throw error;
    }
  }

  async getDashboardAlerts() {
    try {
      return await this._fetch(`${API_BASE_URL}/admin/dashboard/alerts`);
    } catch (error) {
      console.error('Lỗi lấy cảnh báo dashboard:', error);
      throw error;
    }
  }
}

const dashboardApi = new DashboardApi();
export default dashboardApi;