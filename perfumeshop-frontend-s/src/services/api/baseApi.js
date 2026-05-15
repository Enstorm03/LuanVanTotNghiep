const API_BASE_URL = 'http://localhost:8080/api';

class BaseApi {
  // Hàm helper để thực hiện fetch request với xử lý lỗi
  async _fetch(url, options = {}) {
    const response = await fetch(url, {
      headers: { 'Content-Type': 'application/json', ...options.headers },
      ...options
    });
    if (!response.ok) throw new Error(await this._getErrorMessage(response));
    return response.json();
  }

  // Lấy thông báo lỗi từ response
  async _getErrorMessage(response) {
    try {
      const data = await response.json();
      return data.message || data.error || 'Có lỗi xảy ra';
    } catch {
      return await response.text() || `Lỗi HTTP ${response.status}`;
    }
  }

  // Ánh xạ dữ liệu sản phẩm từ backend
  mapProductFields(product) {
    return {
      id_san_pham: product.idSanPham,
      ten_san_pham: product.tenSanPham,
      gia_ban: product.giaBan,
      url_hinh_anh: product.urlHinhAnh,
      id_thuong_hieu: product.thuongHieu?.idThuongHieu || product.idThuongHieu || 1,
      id_danh_muc: product.danhMuc?.idDanhMuc || product.idDanhMuc || 1,
      so_luong_ton_kho: product.soLuongTonKho,
      mo_ta: product.moTa,
      dung_tich_ml: product.dungTichMl,
      nong_do: product.nongDo
    };
  }

  // Chuyển đổi mảng sản phẩm thành định dạng frontend
  _mapProducts(data) {
    return (Array.isArray(data) ? data : [data]).map(p => this.mapProductFields(p));
  }
}

export { API_BASE_URL };
export default BaseApi;
