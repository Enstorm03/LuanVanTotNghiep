import BaseApi, { API_BASE_URL } from './baseApi.js';

class CustomerApi extends BaseApi {
  // Lấy danh sách khách hàng
  async getCustomers() {
    try {
      return await this._fetch(`${API_BASE_URL}/admin/khach-hang`);
    } catch (error) {
      console.error('Lỗi lấy khách hàng:', error);
      throw error;
    }
  }

  // Lấy khách hàng theo ID
  async getCustomer(id) {
    try {
      return await this._fetch(`${API_BASE_URL}/admin/khach-hang/${id}`);
    } catch (error) {
      console.error('Lỗi lấy khách hàng:', error);
      throw error;
    }
  }

  // Tạo khách hàng
  async createCustomer(customerData) {
    try {
      return await this._fetch(`${API_BASE_URL}/admin/khach-hang`, { method: 'POST', body: JSON.stringify(customerData) });
    } catch (error) {
      console.error('Lỗi tạo khách hàng:', error);
      throw error;
    }
  }

  // Cập nhật khách hàng
  async updateCustomer(id, customerData) {
    try {
      return await this._fetch(`${API_BASE_URL}/admin/khach-hang/${id}`, { method: 'PUT', body: JSON.stringify(customerData) });
    } catch (error) {
      console.error('Lỗi cập nhật khách hàng:', error);
      throw error;
    }
  }

  // Đặt lại mật khẩu khách hàng
  async resetCustomerPassword(id, passwordData) {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/khach-hang/${id}/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(passwordData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Handle empty response (204 No Content)
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      } else {
        return {}; // Return empty object for non-JSON responses
      }
    } catch (error) {
      console.error('Lỗi đặt lại mật khẩu khách hàng:', error);
      throw error;
    }
  }

  // Xóa khách hàng
  async deleteCustomer(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/khach-hang/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          // Add auth header if needed
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Handle empty response (204 No Content)
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      } else {
        return {}; // Return empty object for non-JSON responses
      }
    } catch (error) {
      console.error('Lỗi xóa khách hàng:', error);
      throw error;
    }
  }
}

const customerApi = new CustomerApi();
export default customerApi;
