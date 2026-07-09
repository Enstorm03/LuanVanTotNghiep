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
      const token = this._getToken();
      const response = await fetch(`${API_BASE_URL}/admin/khach-hang/${id}/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(passwordData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      } else {
        return {};
      }
    } catch (error) {
      console.error('Lỗi đặt lại mật khẩu khách hàng:', error);
      throw error;
    }
  }

  // Xóa khách hàng
  async deleteCustomer(id) {
    try {
      const token = this._getToken();
      const response = await fetch(`${API_BASE_URL}/admin/khach-hang/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      } else {
        return {};
      }
    } catch (error) {
      console.error('Lỗi xóa khách hàng:', error);
      throw error;
    }
  }

  // Giám đốc duyệt khách hàng thành NCC
  async duyetNCC(id) {
    try {
      return await this._fetch(`${API_BASE_URL}/admin/khach-hang/${id}/duyet-ncc`, {
        method: 'POST',
      });
    } catch (error) {
      console.error('Lỗi duyệt NCC:', error);
      throw error;
    }
  }

  // Hủy vai trò NCC → trở lại CUSTOMER
  async huyNCC(id) {
    try {
      return await this._fetch(`${API_BASE_URL}/admin/khach-hang/${id}/huy-ncc`, {
        method: 'POST',
      });
    } catch (error) {
      console.error('Lỗi hủy NCC:', error);
      throw error;
    }
  }
}

const customerApi = new CustomerApi();
export default customerApi;
