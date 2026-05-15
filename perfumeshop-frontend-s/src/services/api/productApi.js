import BaseApi, { API_BASE_URL } from './baseApi.js';

class ProductApi extends BaseApi {
  // Lấy tất cả sản phẩm (cơ bản)
  async getAllProducts() {
    try {
      return this._mapProducts(await this._fetch(`${API_BASE_URL}/san-pham`));
    } catch (error) {
      console.error('Lỗi lấy sản phẩm:', error);
      throw error;
    }
  }

  // Lấy sản phẩm theo ID
  async getProductById(id) {
    try {
      return this.mapProductFields(await this._fetch(`${API_BASE_URL}/san-pham/${id}`));
    } catch (error) {
      console.error('Lỗi lấy sản phẩm:', error);
      throw error;
    }
  }

  // Tạo sản phẩm mới
  async createProduct(product) {
    try {
      return await this._fetch(`${API_BASE_URL}/san-pham`, { method: 'POST', body: JSON.stringify(product) });
    } catch (error) {
      console.error('Lỗi tạo sản phẩm:', error);
      throw error;
    }
  }

  // Cập nhật sản phẩm
  async updateProduct(id, productData) {
    try {
      return await this._fetch(`${API_BASE_URL}/san-pham/${id}`, { method: 'PUT', body: JSON.stringify(productData) });
    } catch (error) {
      console.error('Lỗi cập nhật sản phẩm:', error);
      throw error;
    }
  }

  // Xóa sản phẩm
  async deleteProduct(id) {
    try {
      await this._fetch(`${API_BASE_URL}/san-pham/${id}`, { method: 'DELETE' });
    } catch (error) {
      console.error('Lỗi xóa sản phẩm:', error);
      throw error;
    }
  }

  // Lấy danh mục
  async getCategories() {
    try {
      return await this._fetch(`${API_BASE_URL}/catalog/danh-muc`);
    } catch (error) {
      console.error('Lỗi lấy danh mục:', error);
      throw error;
    }
  }

  // Lấy thương hiệu
  async getBrands() {
    try {
      return await this._fetch(`${API_BASE_URL}/catalog/thuong-hieu`);
    } catch (error) {
      console.error('Lỗi lấy thương hiệu:', error);
      throw error;
    }
  }

  // Tìm kiếm sản phẩm NÂNG CAO (BE xử lý filter + sort + paginate)
 async searchProductsAdvanced({ kw, danhMucId, thuongHieuId, nongDo, dungTich, minGia, maxGia, sortBy, sortDir, page, size } = {}) {
    try {
      const params = new URLSearchParams();
      if (kw) params.append('kw', kw);
      if (danhMucId) params.append('danhMucId', danhMucId);
      if (thuongHieuId) params.append('thuongHieuId', thuongHieuId);
      if (nongDo) params.append('nongDo', nongDo);
      if (dungTich) params.append('dungTich', dungTich);
      if (minGia) params.append('minGia', minGia);
      if (maxGia) params.append('maxGia', maxGia);
      if (sortBy) params.append('sortBy', sortBy);
      if (sortDir) params.append('sortDir', sortDir);
      if (page !== undefined) params.append('page', page); // Cho phép truyền 0
      if (size) params.append('size', size);

      const response = await this._fetch(`${API_BASE_URL}/catalog/san-pham/search?${params.toString()}`);
      
      // MẸO: Đề phòng BE bọc trong biến 'data' hoặc 'result'
      const actualData = response?.data || response?.result || response;

      // Nếu BE trả về PagedResponse { content, totalPages, totalElements }
      if (actualData && actualData.content) {
        return {
          products: this._mapProducts(actualData.content),
          totalPages: actualData.totalPages || 1,
          totalElements: actualData.totalElements || actualData.content.length
        };
      }
      
      // Fallback: response là array
      const fallbackArray = Array.isArray(actualData) ? actualData : [];
      return {
        products: this._mapProducts(fallbackArray),
        totalPages: 1,
        totalElements: fallbackArray.length
      };
    } catch (error) {
      console.error('Lỗi tìm kiếm sản phẩm:', error);
      throw error;
    }
  }

  // Tìm kiếm sản phẩm cơ bản (giữ để tương thích)
  async searchProducts(kw, danhMucId, thuongHieuId, nongDo, dungTich) {
    try {
      const params = new URLSearchParams();
      if (kw) params.append('kw', kw);
      if (danhMucId) params.append('danhMucId', danhMucId);
      if (thuongHieuId) params.append('thuongHieuId', thuongHieuId);
      if (nongDo) params.append('nongDo', nongDo);
      if (dungTich) params.append('dungTich', dungTich);

      return this._mapProducts(await this._fetch(`${API_BASE_URL}/catalog/san-pham/search?${params.toString()}`));
    } catch (error) {
      console.error('Lỗi tìm kiếm sản phẩm:', error);
      throw error;
    }
  }

  // Lấy sản phẩm liên quan (BE xử lý)
  async getRelatedProducts(productId, limit = 4) {
    try {
      return this._mapProducts(await this._fetch(`${API_BASE_URL}/san-pham/${productId}/related?limit=${limit}`));
    } catch (error) {
      console.error('Lỗi lấy sản phẩm liên quan:', error);
      return [];
    }
  }
}

const productApi = new ProductApi();
export default productApi;