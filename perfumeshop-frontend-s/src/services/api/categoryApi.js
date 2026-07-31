import BaseApi, { API_BASE_URL } from './baseApi.js';

class CategoryApi extends BaseApi {
  async getAllCategories() {
    return this._fetch(`${API_BASE_URL}/danh-muc`);
  }

  async getCategoryById(id) {
    return this._fetch(`${API_BASE_URL}/danh-muc/${id}`);
  }

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

  async deleteCategory(id) {
    return this._fetch(`${API_BASE_URL}/danh-muc/${id}`, {
      method: 'DELETE'
    });
  }
}

const categoryApi = new CategoryApi();
export default categoryApi;
