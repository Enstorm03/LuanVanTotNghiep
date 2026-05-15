import BaseApi, { API_BASE_URL } from './baseApi.js';

class PosApi extends BaseApi {
  // POS - Bán lẻ (thanh toán đầy đủ)
  async createPosBanLe(employeeId, customerId, tenKhachVangLai, itemsInput) {
    try {
      return await this._fetch(`${API_BASE_URL}/pos/ban-le`, {
        method: 'POST',
        body: JSON.stringify({ nhanVienId: employeeId, khachHangId: customerId, tenKhachVangLai, items: itemsInput })
      });
    } catch (error) {
      console.error('Lỗi tạo POS bán lẻ:', error);
      throw error;
    }
  }

  // POS - Đặt hàng (thanh toán cọc)
  async createPosOrder(employeeId, customerId, tenKhachVangLai, itemsInput) {
    try {
      return await this._fetch(`${API_BASE_URL}/pos/order`, {
        method: 'POST',
        body: JSON.stringify({ nhanVienId: employeeId, khachHangId: customerId, tenKhachVangLai, items: itemsInput })
      });
    } catch (error) {
      console.error('Lỗi tạo POS đặt hàng:', error);
      throw error;
    }
  }
}

const posApi = new PosApi();
export default posApi;
