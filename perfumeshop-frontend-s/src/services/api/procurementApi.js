import BaseApi, { API_BASE_URL } from './baseApi.js';

class ProcurementApi extends BaseApi {

  // ── Public / NCC ───────────────────────────────────────────────────────

  /** Lấy danh sách phiếu đang mở (NCC xem) */
  async getOpenRequests() {
    return this._fetch(`${API_BASE_URL}/procurement/public`);
  }

  /** Chi tiết phiếu (NCC xem) */
  async getPublicDetail(id) {
    return this._fetch(`${API_BASE_URL}/procurement/public/${id}`);
  }

  /** NCC gửi báo giá — endpoint mới: /bao-gia */
  async submitOffer(idPhieu, data) {
    return this._fetch(`${API_BASE_URL}/procurement/${idPhieu}/bao-gia`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /** NCC đề xuất sản phẩm mới trong đợt gọi thầu */
  async submitProposedProduct(idPhieu, data) {
    return this._fetch(`${API_BASE_URL}/procurement/${idPhieu}/de-xuat-san-pham`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // ── Admin ───────────────────────────────────────────────────────────────

  /** Tất cả phiếu gọi thầu */
  async getAllRequests() {
    return this._fetch(`${API_BASE_URL}/procurement`);
  }

  /** Chi tiết phiếu (admin) */
  async getDetail(id) {
    return this._fetch(`${API_BASE_URL}/procurement/${id}`);
  }

  /** SP sắp hết kho — endpoint mới: /sap-het-kho */
  async getLowStock(nguong = 5) {
    return this._fetch(`${API_BASE_URL}/procurement/sap-het-kho?nguong=${nguong}`);
  }

  /** Admin tạo phiếu gọi thầu — endpoint mới: /tao-phieu */
  async createRequest(data) {
    // Map field names từ tiếng Anh (FE) sang tiếng Việt (BE)
    const payload = {
      idNhanVien:      data.adminId,
      ghiChu:          data.note,
      hanChot:         data.deadline,
      danhSachSanPham: (data.items || []).map(it => ({
        idSanPham:       it.productId,
        soLuongCanNhap:  it.qtyNeeded,
        ghiChu:          it.note,
      })),
    };
    return this._fetch(`${API_BASE_URL}/procurement/tao-phieu`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  /** Tất cả báo giá của 1 phiếu — endpoint mới: /bao-gia */
  async getOffers(idPhieu) {
    return this._fetch(`${API_BASE_URL}/procurement/${idPhieu}/bao-gia`);
  }

  /** Admin chốt thầu — endpoint mới: /chot-thau */
  async chooseOffer(idPhieu, idBaoGia, phanTramBienDo, idNhanVien) {
    return this._fetch(`${API_BASE_URL}/procurement/${idPhieu}/chot-thau/${idBaoGia}`, {
      method: 'POST',
      body: JSON.stringify({ phanTramBienDo, idNhanVien }),
    });
  }

  // ── Sản phẩm đề xuất (Admin) ──────────────────────────────────────────

  /** Lấy tất cả sản phẩm đề xuất đang chờ duyệt */
  async getAllProposedProducts() {
    return this._fetch(`${API_BASE_URL}/procurement/san-pham-de-xuat/cho-duyet`);
  }

  /** Lấy danh sách sản phẩm đề xuất của một phiếu */
  async getProposedProductsOfRequest(idPhieu) {
    return this._fetch(`${API_BASE_URL}/procurement/${idPhieu}/san-pham-de-xuat`);
  }

  /** Admin duyệt đề xuất — tạo sản phẩm mới */
  async approveProposedProduct(idSanPhamDeXuat, data) {
    return this._fetch(`${API_BASE_URL}/procurement/san-pham-de-xuat/${idSanPhamDeXuat}/duyet`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /** Admin từ chối đề xuất */
  async rejectProposedProduct(idSanPhamDeXuat, data) {
    return this._fetch(`${API_BASE_URL}/procurement/san-pham-de-xuat/${idSanPhamDeXuat}/tu-choi`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // ── Đề xuất sản phẩm độc lập (không cần phiếu gọi thầu) ────────────────

  /** NCC tự đề xuất sản phẩm mới — không cần phiếu gọi thầu */
  async submitIndependentProposal(data) {
    return this._fetch(`${API_BASE_URL}/procurement/de-xuat-san-pham-doc-lap`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /** Admin lấy tất cả đề xuất độc lập (có filter theo trạng thái) */
  async getIndependentProposals(trangThai = '') {
    const params = trangThai ? `?trangThai=${trangThai}` : '';
    return this._fetch(`${API_BASE_URL}/procurement/de-xuat-doc-lap${params}`);
  }

  // ── NCC đề xuất hàng loạt qua Excel/CSV ─────────────────────────────────

  /**
   * Bước 1: Upload file → preview (chưa commit).
   * Trả về { sessionId, rows, tongDong, ok, loi }
   */
  async bulkPreview(file, tenNCC, lienHeNCC = '') {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('tenNCC', tenNCC);
    formData.append('lienHeNCC', lienHeNCC);
    // Không set Content-Type — browser tự thêm boundary cho multipart
    const token = this._getToken();
    const response = await fetch(`${API_BASE_URL}/procurement/bulk-preview`, {
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

  /**
   * Bước 2: Xác nhận gửi — commit các dòng OK thành SanPhamDeXuat.
   */
  async bulkConfirm(sessionId) {
    return this._fetch(`${API_BASE_URL}/procurement/bulk-confirm`, {
      method: 'POST',
      body: JSON.stringify({ sessionId }),
    });
  }

  /**
   * Admin duyệt hàng loạt nhiều đề xuất cùng lúc.
   * items: [{ idSanPhamDeXuat, idDanhMuc?, idThuongHieu?, phanTramBienDo, soLuongNhap?, phanHoi? }]
   * Trả về: { thanhCong, thatBai, tong, chiTiet }
   */
  async bulkApprove(idNhanVien, items) {
    return this._fetch(`${API_BASE_URL}/procurement/san-pham-de-xuat/duyet-hang-loat`, {
      method: 'POST',
      body: JSON.stringify({ idNhanVien, items }),
    });
  }
}

const procurementApi = new ProcurementApi();
export default procurementApi;
