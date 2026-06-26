import BaseApi, { API_BASE_URL } from './baseApi.js';

class UserApi extends BaseApi {
  // Lấy thông tin cá nhân của user hiện tại
  async getProfile(userId) {
    try {
      // If userId is passed explicitly, use it; otherwise get from session
      let userIdToUse = userId;
      if (!userIdToUse) {
        const user = JSON.parse(sessionStorage.getItem('user') || '{}');
        userIdToUse = user.id_nguoi_dung || user.userId;
      }
      const headers = userIdToUse ? { 'X-User-Id': userIdToUse.toString() } : {};
      return await this._fetch(`${API_BASE_URL}/users/profile`, {
        method: 'GET',
        headers,
      });
    } catch (error) {
      console.error('Lỗi lấy thông tin cá nhân:', error);
      throw error;
    }
  }

  // Cập nhật thông tin cá nhân của user
  async updateProfile(data) {
    try {
      const user = JSON.parse(sessionStorage.getItem('user') || '{}');
      const headers = user.id_nguoi_dung ? { 'X-User-Id': user.id_nguoi_dung.toString() } : {};
      return await this._fetch(`${API_BASE_URL}/users/profile`, {
        method: 'PUT',
        body: JSON.stringify(data),
        headers,
      });
    } catch (error) {
      console.error('Lỗi cập nhật thông tin cá nhân:', error);
      throw error;
    }
  }

  // Thay đổi mật khẩu
  async changePassword(passwordData) {
    try {
      const user = JSON.parse(sessionStorage.getItem('user') || '{}');
      const headers = user.id_nguoi_dung ? { 'X-User-Id': user.id_nguoi_dung.toString() } : {};
      return await this._fetch(`${API_BASE_URL}/users/change-password`, {
        method: 'POST',
        body: JSON.stringify(passwordData),
        headers,
      });
    } catch (error) {
      console.error('Lỗi thay đổi mật khẩu:', error);
      throw error;
    }
  }
}

const userApi = new UserApi();
export default userApi;