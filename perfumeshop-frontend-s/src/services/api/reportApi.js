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
     const params = new URLSearchParams({ startDate, endDate, format }).toString();
     // Export usually requires blob response or downloading directly.
     // In baseApi _fetch usually parses json. If it's a file download, it should be handled specifically.
     // We will just return the URL for now or fetch as blob.
     window.open(`${API_BASE_URL}/admin/reports/export?${params}`, '_blank');
  }
}

const reportApi = new ReportApi();
export default reportApi;