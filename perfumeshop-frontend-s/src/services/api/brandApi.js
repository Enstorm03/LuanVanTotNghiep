import BaseApi, {API_BASE_URL} from "./baseApi";

class BrandApi extends BaseApi {
  // Lấy tất cả thương hiệu
  async getAllBrands() {
    try {
      return await this._fetch(`${API_BASE_URL}/thuong-hieu`);
    } catch (error) {
      console.error('Lỗi lấy thương hiệu:', error);
      throw error;
    }
  }

  // Lấy thương hiệu theo id
  async getBrandById(id) {
    try {
      return await this._fetch(`${API_BASE_URL}/thuong-hieu/${id}`);
    } catch (error) {
      console.error('Lỗi lấy thông tin thương hiệu:', error);
      throw error;
    }
  }

  // Thêm thương hiệu mới
  async createBrand(brandData) {
    try {
      return await this._fetch(`${API_BASE_URL}/thuong-hieu`, {
        method: 'POST',
        body: JSON.stringify(brandData)
      });
    } catch (error) {
      console.error('Lỗi thêm thương hiệu:', error);
      throw error;
    }
  }

  // Cập nhật thương hiệu
  async updateBrand(id, brandData) {
    try {
      return await this._fetch(`${API_BASE_URL}/thuong-hieu/${id}`, {
        method: 'PUT',
        body: JSON.stringify(brandData)
      });
    } catch (error) {
      console.error('Lỗi cập nhật thương hiệu:', error);
      throw error;
    }
  }

  // Xóa thương hiệu
  
   // Sửa trong file src/services/api/brandApi.js
  async deleteBrand(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/thuong-hieu/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}` // Nếu có dùng token
        }
      });
      
      // Nếu server trả về 200 OK nhưng không có body, chúng ta trả về null
      if (response.status === 200 || response.status === 204) {
          return null; 
      }
      
      if (!response.ok) throw new Error('Lỗi xóa thương hiệu');
      return await response.json();
    } catch (error) {
      console.error('Lỗi xóa thương hiệu:', error);
      throw error;
    }
  }
}

const brandApi = new BrandApi();
export default brandApi;