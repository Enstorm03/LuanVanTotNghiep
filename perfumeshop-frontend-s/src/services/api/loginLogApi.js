import BaseApi, { API_BASE_URL } from './baseApi.js';

class LoginLogApi extends BaseApi {
  /**
   * Lấy danh sách log đăng nhập (phân trang + tìm kiếm).
   * Chỉ ADMIN root và DIRECTOR mới gọi được.
   *
   * @param {Object} params
   * @param {string} [params.tenDangNhap]
   * @param {string} [params.vaiTro]        — ADMIN | DIRECTOR | STORE_MANAGER | ...
   * @param {string} [params.trangThai]     — SUCCESS | FAILED
   * @param {string} [params.tuNgay]        — yyyy-MM-dd
   * @param {string} [params.denNgay]       — yyyy-MM-dd
   * @param {number} [params.page=0]
   * @param {number} [params.size=20]
   */
  async getLogs({ tenDangNhap, vaiTro, trangThai, tuNgay, denNgay, page = 0, size = 20 } = {}) {
    const qs = new URLSearchParams();
    if (tenDangNhap) qs.append('tenDangNhap', tenDangNhap);
    if (vaiTro)      qs.append('vaiTro',      vaiTro);
    if (trangThai)   qs.append('trangThai',   trangThai);
    if (tuNgay)      qs.append('tuNgay',      `${tuNgay}T00:00:00`);
    if (denNgay)     qs.append('denNgay',     `${denNgay}T23:59:59`);
    qs.append('page', page);
    qs.append('size', size);

    return this._fetch(`${API_BASE_URL}/admin/login-logs?${qs.toString()}`);
  }
}

const loginLogApi = new LoginLogApi();
export default loginLogApi;
