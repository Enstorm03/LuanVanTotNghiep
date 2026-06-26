import BaseApi, { API_BASE_URL } from './baseApi.js';

class UserApi extends BaseApi {
  // Lấy thông tin cá nhân của user hiện tại
  async getProfile() {
    try {
      return await this._fetch(`${API_BASE_URL}/users/profile`, {
        method: 'GET',
      });
    } catch (error) {
      console.error('Lỗi lấy thông tin cá nhân:', error);
      throw error;
    }
  }

  // Cập nhật thông tin cá nhân của user
  async updateProfile(data) {
    try {
      return await this._fetch(`${API_BASE_URL}/users/profile`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    } catch (error) {
      console.error('Lỗi cập nhật thông tin cá nhân:', error);
      throw error;
    }
  }

  // Thay đổi mật khẩu
  async changePassword(passwordData) {
    try {
      return await this._fetch(`${API_BASE_URL}/users/change-password`, {
        method: 'POST',
        body: JSON.stringify(passwordData),
      });
    } catch (error) {
      console.error('Lỗi thay đổi mật khẩu:', error);
      throw error;
    }
  }
}

const userApi = new UserApi();
export default userApi;