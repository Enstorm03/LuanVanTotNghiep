import BaseApi, { API_BASE_URL } from './baseApi.js';

class AuthApi extends BaseApi {
  // Đăng nhập
  async login(credentials) {
    try {
      return await this._fetch(`${API_BASE_URL}/auth/login`, { method: 'POST', body: JSON.stringify(credentials) });
    } catch (error) {
      console.error('Lỗi đăng nhập:', error);
      throw error;
    }
  }

  // Đăng ký khách hàng
  async registerCustomer(customerData) {
    try {
      return await this._fetch(`${API_BASE_URL}/auth/register-customer`, { method: 'POST', body: JSON.stringify(customerData) });
    } catch (error) {
      console.error('Lỗi đăng ký:', error);
      throw error;
    }
  }
}

const authApi = new AuthApi();
export default authApi;
