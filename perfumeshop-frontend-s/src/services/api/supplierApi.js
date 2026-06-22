import BaseApi, { API_BASE_URL } from './baseApi.js';

class SupplierApi extends BaseApi {
  /** NCC đăng nhập */
  async login(tenDangNhap, matKhau) {
    return this._fetch(`${API_BASE_URL}/nha-cung-cap/login`, {
      method: 'POST',
      body: JSON.stringify({ tenDangNhap, matKhau }),
    });
  }

  /** Admin — danh sách NCC */
  async getAll() {
    return this._fetch(`${API_BASE_URL}/nha-cung-cap`);
  }

  /** Admin — tạo NCC */
  async create(data) {
    return this._fetch(`${API_BASE_URL}/nha-cung-cap`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /** Admin — cập nhật NCC */
  async update(id, data) {
    return this._fetch(`${API_BASE_URL}/nha-cung-cap/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  /** Admin — xóa NCC */
  async remove(id) {
    const res = await fetch(`${API_BASE_URL}/nha-cung-cap/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Lỗi xóa NCC');
    return null;
  }
}

const supplierApi = new SupplierApi();
export default supplierApi;
