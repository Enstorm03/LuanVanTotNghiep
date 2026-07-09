/**
 * supplierApi.js
 *
 * NCC hiện dùng bảng nguoi_dung (vai_tro = SUPPLIER).
 * Đăng nhập qua /api/auth/login (dùng chung với customer).
 * Admin quản lý NCC qua /api/admin/khach-hang (duyệt / hủy vai trò).
 *
 * File cũ gọi /api/nha-cung-cap — đã xóa hoàn toàn.
 */

import BaseApi, { API_BASE_URL } from './baseApi.js';

class SupplierApi extends BaseApi {
  /**
   * Admin — lấy danh sách tất cả người dùng có vai trò SUPPLIER
   * Dùng endpoint /api/admin/khach-hang (trả toàn bộ nguoi_dung),
   * lọc phía FE hoặc BE theo vaiTro = SUPPLIER.
   */
  async getAll() {
    return this._fetch(`${API_BASE_URL}/admin/khach-hang`);
  }

  /**
   * Admin (Giám đốc) — duyệt người dùng thành NCC
   * POST /api/admin/khach-hang/{id}/duyet-ncc
   */
  async duyetNCC(id) {
    return this._fetch(`${API_BASE_URL}/admin/khach-hang/${id}/duyet-ncc`, {
      method: 'POST',
    });
  }

  /**
   * Admin (Giám đốc) — hủy vai trò NCC → trở lại CUSTOMER
   * POST /api/admin/khach-hang/{id}/huy-ncc
   */
  async huyNCC(id) {
    return this._fetch(`${API_BASE_URL}/admin/khach-hang/${id}/huy-ncc`, {
      method: 'POST',
    });
  }
}

const supplierApi = new SupplierApi();
export default supplierApi;
