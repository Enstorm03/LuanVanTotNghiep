import BaseApi, { API_BASE_URL } from './baseApi.js';

class CategoryApi extends BaseApi {
  async getAllCategories() {
    return this._fetch(`${API_BASE_URL}/danh-muc`);
  }

  async getCategoryById(id) {
    return this._fetch(`${API_BASE_URL}/danh-muc/${id}`);
  }
// Tạo danh mục mới
  async createCategory(data) {
    return this._fetch(`${API_BASE_URL}/danh-muc`, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async updateCategory(id, data) {
    return this._fetch(`${API_BASE_URL}/danh-muc/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }
// Xóa danh mục
async deleteCategory(id) {
    try {
      const token = this._getToken();
      const response = await fetch(`${API_BASE_URL}/danh-muc/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
      });

   

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      } else {
        return null;
      }
    } catch (error) {
      console.error('Lỗi xóa danh mục:', error);
      throw error;
    }
}
}

const categoryApi = new CategoryApi();
export default categoryApi;
