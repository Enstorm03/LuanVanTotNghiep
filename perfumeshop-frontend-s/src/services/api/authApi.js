import BaseApi, { API_BASE_URL } from './baseApi.js';

const API_URL = process.env.REACT_APP_API_URL || '';

class AuthApi extends BaseApi {
  // Login method
  async login(credentials) {
    try {
      return await this._fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        body: JSON.stringify(credentials),
      });
    } catch (error) {
      console.error('Lỗi đăng nhập:', error);
      throw error;
    }
  }

  // Register customer method
  async registerCustomer(customerData) {
    try {
      return await this._fetch(`${API_BASE_URL}/auth/register-customer`, {
        method: 'POST',
        body: JSON.stringify(customerData),
      });
    } catch (error) {
      console.error('Lỗi đăng ký:', error);
      throw error;
    }
  }

  // Verify email
  async verifyEmail(token, signal) {
    const apiUrl = `${API_URL}/api/auth/verify-email?token=${token}`;
    
    const response = await fetch(apiUrl, { signal });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Lỗi từ server: ${response.status}`);
    }

    const data = await response.json();
    
    return data;
  }

  // Resend verification email
  async resendVerificationEmail(email) {
    const apiUrl = `${API_URL}/api/auth/resend-verification-email`;
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Lỗi gửi lại email');
    }
    
    return data;
  }
}

const authApi = new AuthApi();

// Export individual functions for backward compatibility
export const verifyEmail = (token, signal) => authApi.verifyEmail(token, signal);
export const resendVerificationEmail = (email) => authApi.resendVerificationEmail(email);

export default authApi;
