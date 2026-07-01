import BaseApi, { API_BASE_URL } from './baseApi.js';

class CartApi extends BaseApi {
  // Lấy giỏ hàng
  // async getCart(userId) {
  //  
  //   try {
  //     const params = new URLSearchParams({ userId });
  //     const data = await fetch(`${API_BASE_URL}/don-hang/gio-hang-dto?${params}`).then(r => r.json());
  //     const cartData = Array.isArray(data) && data.length > 0 ? data[0] : { idDonHang: null, chiTiet: [] };

  //     return cartData;
  //   } catch (error) {
  //     // Fallback to /cart/dto
  //     try {
  //       const params = new URLSearchParams({ userId });
  //       const res = await fetch(`${API_BASE_URL}/cart/dto?${params}`);
  //       if (res.ok) {
  //         const data = await res.json();
  //         return { idDonHang: data.idDonHang || null, chiTiet: data.chiTiet || [] };
  //       }
  //     } catch (error) {
  //       // Return empty cart if all endpoints fail
  //     }
  //   }

  //   return { idDonHang: null, chiTiet: [] };
  // }
  // Lấy giỏ hàng
  async getCart(userId) {
    try {
      
      const response = await this._fetch(`${API_BASE_URL}/cart/dto?userId=${userId}`);
      
      // 3. Backend trả về Object DTO, ta chỉ cần format lại cho chắc chắn
      return { 
        idDonHang: response?.idDonHang || null, 
        chiTiet: response?.chiTiet || [] 
      };
    } catch (error) {
      console.error('Lỗi lấy dữ liệu giỏ hàng:', error);
      return { idDonHang: null, chiTiet: [] }; // Fallback an toàn
    }
  }

  // Thêm sản phẩm vào giỏ hàng
  async addCartItem({ userId, sanPhamId, soLuong }) {
    try {
      return await this._fetch(`${API_BASE_URL}/cart/items`, { method: 'POST', body: JSON.stringify({ userId, sanPhamId, soLuong }) });
    } catch (error) {
      console.error('Lỗi thêm sản phẩm vào giỏ hàng:', error);
      throw error;
    }
  }

  // Xóa sản phẩm khỏi giỏ hàng
  async removeCartItem(userId, sanPhamId) {
    try {
      const params = new URLSearchParams({ userId, sanPhamId });
      return await this._fetch(`${API_BASE_URL}/cart/items?${params}`, { method: 'DELETE' });
    } catch (error) {
      console.error('Lỗi xóa sản phẩm:', error);
      throw error;
    }
  }

  // Xóa toàn bộ giỏ hàng
  async clearCart(userId) {
    try {
      const params = new URLSearchParams({ userId });
      return await this._fetch(`${API_BASE_URL}/cart?${params}`, { method: 'DELETE' });
      
    } catch (error) {
      console.error('Lỗi xóa giỏ hàng:', error);
      throw error;
    }
  }

  // Cập nhật số lượng sản phẩm
  async updateCartItem(userId, sanPhamId, soLuong) {
    try {
      return await this._fetch(`${API_BASE_URL}/cart/items`, {
        method: 'PUT',
        body: JSON.stringify({ userId, sanPhamId, soLuong })
      });
    } catch (error) {
      console.error('Lỗi cập nhật sản phẩm:', error);
      throw error;
    }
  }

  // Thanh toán giỏ hàng
  async checkoutCart(request) {
    try {
      const orderData = {
        idNguoiDung: request.idNguoiDung,
        tenNguoiNhan: request.tenNguoiNhan,
        diaChiGiaoHang: request.diaChiGiaoHang,
        soDienThoai: request.soDienThoai || '',
        ghiChu: request.ghiChu || '',
        phuongThucThanhToan: request.phuongThucThanhToan || 'cod',
        items: request.items || [],
        idSuKien: request.idSuKien || null,
        giamGiaHangLoat: request.giamGiaHangLoat || 0,
      };

      return await this._fetch(`${API_BASE_URL}/dat-hang`, {
        method: 'POST',
        body: JSON.stringify(orderData)
      });
    } catch (error) {
      console.error('Lỗi thanh toán giỏ hàng:', error);
      throw error;
    }
  }
}

const cartApi = new CartApi();
export default cartApi;
