import BaseApi, { API_BASE_URL } from './baseApi.js';

class ReportApi extends BaseApi {
  async getReportSummary(startDate, endDate) {
    try {
      const params = new URLSearchParams({ startDate, endDate }).toString();
      return await this._fetch(`${API_BASE_URL}/admin/reports/summary?${params}`);
    } catch (error) {
      console.error('Lỗi lấy report summary:', error);
      throw error;
    }
  }

  async getTopProducts(startDate, endDate, limit = 10) {
    try {
      const params = new URLSearchParams({ startDate, endDate, limit }).toString();
      return await this._fetch(`${API_BASE_URL}/admin/reports/top-products?${params}`);
    } catch (error) {
      console.error('Lỗi lấy top products:', error);
      throw error;
    }
  }

  async getRevenueByStatus(startDate, endDate) {
    try {
      const params = new URLSearchParams({ startDate, endDate }).toString();
      return await this._fetch(`${API_BASE_URL}/admin/reports/revenue-by-status?${params}`);
    } catch (error) {
      console.error('Lỗi lấy revenue by status:', error);
      throw error;
    }
  }
  
async exportReport(startDate, endDate, format = 'csv') {
  try {
    const params = new URLSearchParams({ startDate, endDate, format }).toString();
    const token = this._getToken();
    
    const response = await fetch(`${API_BASE_URL}/admin/reports/export?${params}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'ngrok-skip-browser-warning': 'true',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Lỗi khi xuất báo cáo');
    }

    // Lấy nội dung CSV
    const blob = await response.blob();
    
    // Tạo link download
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bao-cao-${startDate}-${endDate}.csv`;
    document.body.appendChild(a);
    a.click();
    
    // Cleanup
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  } catch (error) {
    console.error('Lỗi xuất báo cáo:', error);
    throw error;
  }
}

}

const reportApi = new ReportApi();
export default reportApi;