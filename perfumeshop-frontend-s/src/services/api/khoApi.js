import BaseApi, { API_BASE_URL } from './baseApi.js';

class KhoApi extends BaseApi {

  /** Upload CSV/Excel → preview staging */
  async importPreview(file) {
    const formData = new FormData();
    formData.append('file', file);
    // Không set Content-Type — browser tự thêm boundary cho multipart
    const token = this._getToken();
    const response = await fetch(`${API_BASE_URL}/kho/import-preview`, {
      method: 'POST',
      headers: {
        'ngrok-skip-browser-warning': 'true',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      },
      body: formData,
    });
    if (!response.ok) throw new Error(await this._getErrorMessage(response));
    return response.json();
  }

  async getPreview(sessionId) {
    return this._fetch(`${API_BASE_URL}/kho/import-preview/${sessionId}`);
  }

  async updateRow(rowId, data) {
    return this._fetch(`${API_BASE_URL}/kho/import-preview/row/${rowId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteRow(rowId) {
    const token = this._getToken();
    const res = await fetch(`${API_BASE_URL}/kho/import-preview/row/${rowId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      },
    });
    if (!res.ok) throw new Error(await this._getErrorMessage(res));
    return null;
  }

  async addRow(sessionId, data) {
    return this._fetch(`${API_BASE_URL}/kho/import-preview/${sessionId}/row`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async confirmImport(sessionId, nhanVienId, nhaCungCap, ghiChu) {
    return this._fetch(`${API_BASE_URL}/kho/import-confirm`, {
      method: 'POST',
      body: JSON.stringify({ sessionId, nhanVienId, nhaCungCap, ghiChu }),
    });
  }

  async listPhieuNhap() {
    return this._fetch(`${API_BASE_URL}/kho/phieu-nhap`);
  }

  async getPhieuNhap(id) {
    return this._fetch(`${API_BASE_URL}/kho/phieu-nhap/${id}`);
  }

  async getBienDong(idSanPham = null) {
    const q = idSanPham ? `?idSanPham=${idSanPham}` : '';
    return this._fetch(`${API_BASE_URL}/kho/bien-dong${q}`);
  }

  async getBanCham(days = 30, limit = 20) {
    return this._fetch(`${API_BASE_URL}/kho/ban-cham?days=${days}&limit=${limit}`);
  }

  async getNearExpiryProducts(days = 180, limit = 10) {
    return this._fetch(`${API_BASE_URL}/kho/near-expiry?days=${days}&limit=${limit}`);
  }

  async getNearExpiryBatches(limit = 10) {
    return this._fetch(`${API_BASE_URL}/kho/near-expiry?limit=${limit}`);
  }

  // ── PO Workflow ────────────────────────────────────────────────────────

  /** PO đang chờ kho kiểm tra */
  async getPoChoKiemTra() {
    return this._fetch(`${API_BASE_URL}/kho/po-cho-kiem-tra`);
  }

  /** PO đang chờ admin duyệt cuối */
  async getPoChoAdminDuyet() {
    return this._fetch(`${API_BASE_URL}/kho/po-cho-admin-duyet`);
  }

  /** Kho xác nhận kiểm hàng */
  async khoXacNhan(idPhieu, nhanVienId, chiTiet) {
    return this._fetch(`${API_BASE_URL}/kho/po/${idPhieu}/kho-xac-nhan`, {
      method: 'POST',
      body: JSON.stringify({ nhanVienId, chiTiet }),
    });
  }

  /** Admin duyệt cuối → cộng kho + áp giá */
  async adminDuyetCuoi(idPhieu, nhanVienId) {
    return this._fetch(`${API_BASE_URL}/kho/po/${idPhieu}/admin-duyet-cuoi`, {
      method: 'POST',
      body: JSON.stringify({ nhanVienId }),
    });
  }

  /** Admin từ chối PO */
  async adminTuChoi(idPhieu, lyDo, nhanVienId) {
    return this._fetch(`${API_BASE_URL}/kho/po/${idPhieu}/admin-tu-choi`, {
      method: 'POST',
      body: JSON.stringify({ lyDo, nhanVienId }),
    });
  }

  /** Validate HSD — kiểm tra hạn sử dụng hợp lệ */
  async validateHSD(hanSuDung) {
    return this._fetch(`${API_BASE_URL}/kho/validate-hsd`, {
      method: 'POST',
      body: JSON.stringify({ hanSuDung }),
    });
  }

  /** Lấy toàn bộ lô hàng (group theo SP), filter tuỳ chọn */
  async getLoHang(idSanPham = null, conHang = false) {
    const params = new URLSearchParams();
    if (idSanPham) params.set('idSanPham', idSanPham);
    if (conHang) params.set('conHang', 'true');
    return this._fetch(`${API_BASE_URL}/kho/lo-hang?${params.toString()}`);
  }
}

const khoApi = new KhoApi();
export default khoApi;
