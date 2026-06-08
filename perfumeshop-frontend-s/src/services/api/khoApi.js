import BaseApi, { API_BASE_URL } from './baseApi.js';

class KhoApi extends BaseApi {

  /** Upload CSV/Excel → preview staging */
  async importPreview(file) {
    const formData = new FormData();
    formData.append('file', file);
    const response = await fetch(`${API_BASE_URL}/kho/import-preview`, {
      method: 'POST',
      headers: { 'ngrok-skip-browser-warning': 'true' },
      body: formData,
    });
    if (!response.ok) throw new Error(await this._getErrorMessage(response));
    return response.json();
  }

  /** Lấy lại preview theo sessionId */
  async getPreview(sessionId) {
    return this._fetch(`${API_BASE_URL}/kho/import-preview/${sessionId}`);
  }

  /** Admin sửa toàn bộ field của dòng (không chỉ map SP) */
  async updateRow(rowId, data) {
    return this._fetch(`${API_BASE_URL}/kho/import-preview/row/${rowId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  /** Admin xóa dòng khỏi staging */
  async deleteRow(rowId) {
    const res = await fetch(`${API_BASE_URL}/kho/import-preview/row/${rowId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) throw new Error('Lỗi xóa dòng');
    return null;
  }

  /** Admin thêm dòng thủ công */
  async addRow(sessionId, data) {
    return this._fetch(`${API_BASE_URL}/kho/import-preview/${sessionId}/row`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /** Duyệt session → cộng kho */
  async confirmImport(sessionId, nhanVienId, nhaCungCap, ghiChu) {
    return this._fetch(`${API_BASE_URL}/kho/import-confirm`, {
      method: 'POST',
      body: JSON.stringify({ sessionId, nhanVienId, nhaCungCap, ghiChu }),
    });
  }

  /** Danh sách phiếu nhập đã duyệt */
  async listPhieuNhap() {
    return this._fetch(`${API_BASE_URL}/kho/phieu-nhap`);
  }

  /** Chi tiết phiếu nhập */
  async getPhieuNhap(id) {
    return this._fetch(`${API_BASE_URL}/kho/phieu-nhap/${id}`);
  }

  /** Biến động kho — truyền idSanPham để lọc theo SP */
  async getBienDong(idSanPham = null) {
    const q = idSanPham ? `?idSanPham=${idSanPham}` : '';
    return this._fetch(`${API_BASE_URL}/kho/bien-dong${q}`);
  }

  /** Thống kê sản phẩm bán chậm */
  async getBanCham(days = 30, limit = 20) {
    return this._fetch(`${API_BASE_URL}/kho/ban-cham?days=${days}&limit=${limit}`);
  }
}

const khoApi = new KhoApi();
export default khoApi;
