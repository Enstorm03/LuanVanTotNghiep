// Khi dùng CRA proxy: dùng đường dẫn tương đối /api/...
// → request tự động forward đến localhost:8080/api/... mà không bị Mixed Content
const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';

class BaseApi {
  // Lấy JWT token từ sessionStorage
  _getToken() {
    try {
      const user = sessionStorage.getItem('user');
      if (user) {
        const parsed = JSON.parse(user);
        return parsed.token || null;
      }
    } catch {
      // ignore
    }
    return null;
  }

  // Hàm helper để thực hiện fetch request với xử lý lỗi
  async _fetch(url, options = {}) {
    const { headers: extraHeaders, ...restOptions } = options;
    const token = this._getToken();
    const authHeaders = token ? { 'Authorization': `Bearer ${token}` } : {};

    const response = await fetch(url, {
      ...restOptions,
      headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true',
        ...authHeaders,
        ...extraHeaders,
      },
    });

    // Token hết hạn hoặc không hợp lệ → xóa session và redirect login
    if (response.status === 401) {
      sessionStorage.removeItem('user');
      window.location.href = '/login';
      throw new Error('Phiên đăng nhập hết hạn, vui lòng đăng nhập lại');
    }

    // Forbidden — token không có quyền hoặc thiếu token với protected route
    if (response.status === 403) {
      const token = this._getToken();
      if (!token) {
        // Chưa login hoặc session cũ không có token → force re-login
        sessionStorage.removeItem('user');
        window.location.href = '/login';
        throw new Error('Vui lòng đăng nhập lại');
      }
      throw new Error(await this._getErrorMessage(response));
    }

    if (!response.ok) throw new Error(await this._getErrorMessage(response));
    
    // Xử lý 204 No Content (DELETE thành công không có body)
    if (response.status === 204) return null;
    
    // Kiểm tra có content để parse JSON
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return response.json();
    }
    
    return null;
  }

  // Lấy thông báo lỗi từ response
  // Chỉ đọc body 1 lần (text), sau đó thử parse JSON — tránh lỗi "body stream already read"
  async _getErrorMessage(response) {
    let text = '';
    try {
      text = await response.text();
    } catch {
      return `Lỗi HTTP ${response.status}`;
    }
    try {
      const data = JSON.parse(text);
      return data.message || data.error || 'Có lỗi xảy ra';
    } catch {
      return text || `Lỗi HTTP ${response.status}`;
    }
  }

  // Ánh xạ dữ liệu sản phẩm từ backend
  mapProductFields(product) {
    const phanTramGiam = product.phanTramGiam || null;
    const angGiamGia = product.angGiamGia || false;
    // Ưu tiên giaHienTai từ BE (đã tính sẵn), fallback về giaBan
    const giaHienTai = angGiamGia && product.giaHienTai
      ? Number(product.giaHienTai)
      : Number(product.giaBan);

    return {
      id_san_pham: product.idSanPham,
      ten_san_pham: product.tenSanPham,
      gia_ban: Number(product.giaBan),          // Giá gốc (để hiển thị gạch ngang)
      gia_hien_tai: giaHienTai,                 // Giá thực tế khách trả
      url_hinh_anh: product.urlHinhAnh,
      id_thuong_hieu: product.thuongHieu?.idThuongHieu || product.idThuongHieu || null,
      id_danh_muc: product.danhMuc?.idDanhMuc || product.idDanhMuc || null,
      so_luong_ton_kho: product.soLuongTonKho,
      mo_ta: product.moTa,
      dung_tich_ml: product.dungTichMl,
      nong_do: product.nongDo,
      phan_tram_giam: phanTramGiam,             // % giảm (null nếu không giảm)
      ang_giam_gia: angGiamGia,                 // true nếu đang trong thời gian sale
      ngay_bat_dau_giam: product.ngayBatDauGiam || null,
      ngay_ket_thuc_giam: product.ngayKetThucGiam || null,
    };
  }

  // Chuyển đổi mảng sản phẩm thành định dạng frontend
  _mapProducts(data) {
    return (Array.isArray(data) ? data : [data]).map(p => this.mapProductFields(p));
  }
}

export { API_BASE_URL };
export default BaseApi;
