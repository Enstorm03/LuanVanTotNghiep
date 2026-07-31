import BaseApi, { API_BASE_URL } from './baseApi.js';

class OrderApi extends BaseApi {
  // Đặt hàng
  async placeOrder(orderData) {
    try {
      return await this._fetch(`${API_BASE_URL}/dat-hang`, {
        method: 'POST',
        body: JSON.stringify(orderData)
      });
    } catch (error) {
      console.error('Lỗi đặt hàng:', error);
      throw error;
    }
  }

  // Hủy đơn hàng
  async cancelOrder(orderId, reason) {
    try {
      return await this._fetch(`${API_BASE_URL}/don-hang/${orderId}/huy`, { method: 'POST', body: JSON.stringify({ lyDo: reason }) });
    } catch (error) {
      console.error('Lỗi hủy đơn hàng:', error);
      throw error;
    }
  }

  // Lấy lịch sử đơn hàng (cơ bản)
  async getUserOrders(userId) {
    try {
      return await this._fetch(`${API_BASE_URL}/don-hang/lich-su?userId=${userId}`);
    } catch (error) {
      console.error('Lỗi lấy lịch sử đơn hàng:', error);
      throw error;
    }
  }

  // Lấy lịch sử đơn hàng DTO
  async getUserOrdersHistoryDto(userId, trangThai = null) {
    try {
      const url = `${API_BASE_URL}/don-hang/lich-su-dto?userId=${userId}${trangThai ? `&trangThai=${encodeURIComponent(trangThai)}` : ''}`;
      const response = await this._fetch(url);
      
      // Bóc tách 'data' hoặc 'result' nếu BE bọc kết quả
      const actualData = response?.data || response?.result || response;
      return actualData;
    } catch (error) {
      console.error('Lỗi lấy lịch sử đơn hàng:', error);
      throw error;
    }
  }

  // Lấy chi tiết đơn hàng
  async getOrderDetails(orderId) {
    try {
      return await this._fetch(`${API_BASE_URL}/don-hang/${orderId}`);
    } catch (error) {
      console.error('Lỗi lấy chi tiết đơn hàng:', error);
      throw error;
    }
  }

  // Xác nhận đơn hàng (Admin)
  async confirmOrder(orderId, employeeId) {
    try {
      return await this._fetch(`${API_BASE_URL}/don-hang/${orderId}/xac-nhan`, { method: 'POST', body: JSON.stringify({ nhanVienId: employeeId }) });
    } catch (error) {
      console.error('Lỗi xác nhận đơn hàng:', error);
      throw error;
    }
  }

  // Gửi hàng — chuyển sang "Đang giao hàng", dùng mã vận đơn đã tạo sẵn
  async shipOrder(orderId) {
    try {
      return await this._fetch(`${API_BASE_URL}/don-hang/${orderId}/giao-hang`, {
        method: 'POST',
        body: JSON.stringify({})
      });
    } catch (error) {
      console.error('Lỗi gửi hàng:', error);
      throw error;
    }
  }

  // Cập nhật mã vận đơn (chỉ khi đang giao hàng)
  async updateTracking(orderId, trackingNumber) {
    try {
      return await this._fetch(`${API_BASE_URL}/don-hang/${orderId}/cap-nhat-van-don`, {
        method: 'POST',
        body: JSON.stringify({ maVanDon: trackingNumber })
      });
    } catch (error) {
      console.error('Lỗi cập nhật mã vận đơn:', error);
      throw error;
    }
  }

  // Cập nhật thông tin người nhận (Admin)
  async updateOrderRecipient(orderId, recipientData) {
    try {
      return await this._fetch(`${API_BASE_URL}/don-hang/${orderId}/cap-nhat-nguoi-nhan`, { method: 'POST', body: JSON.stringify(recipientData) });
    } catch (error) {
      console.error('Lỗi cập nhật người nhận:', error);
      throw error;
    }
  }

  // Đánh dấu đã thu tiền (Admin)
  async markPaymentCollected(orderId) {
    try {
      return await this._fetch(`${API_BASE_URL}/don-hang/${orderId}/da-thu-tien-con-lai`, { method: 'POST', body: JSON.stringify({}) });
    } catch (error) {
      console.error('Lỗi đánh dấu đã thu tiền:', error);
      throw error;
    }
  }

  // Cập nhật trạng thái thanh toán (Admin)
  async updatePaymentStatus(orderId, daThanhToan = true) {
    try {
      return await this._fetch(`${API_BASE_URL}/don-hang/${orderId}/thanh-toan?daThanhToan=${daThanhToan}`, { method: 'POST', body: JSON.stringify({}) });
    } catch (error) {
      console.error('Lỗi cập nhật trạng thái thanh toán:', error);
      throw error;
    }
  }

  // Chuyển sang trạng thái "Đang chờ" (Admin)
  async moveToPending(orderId) {
    try {
      return await this._fetch(`${API_BASE_URL}/don-hang/${orderId}/chuyen-dang-cho`, { method: 'POST', body: JSON.stringify({}) });
    } catch (error) {
      console.error('Lỗi chuyển sang Đang chờ:', error);
      throw error;
    }
  }

  // Hoàn thành đơn hàng (Admin)
  async completeOrder(orderId) {
    try {
      return await this._fetch(`${API_BASE_URL}/don-hang/${orderId}/hoan-thanh`, { method: 'POST', body: JSON.stringify({}) });
    } catch (error) {
      console.error('Lỗi hoàn thành đơn hàng:', error);
      throw error;
    }
  }

  // Đánh dấu hoàn tiền (Admin)
  async markRefunded(orderId) {
    try {
      return await this._fetch(`${API_BASE_URL}/don-hang/${orderId}/hoan-tien`, { method: 'POST', body: JSON.stringify({}) });
    } catch (error) {
      console.error('Lỗi đánh dấu hoàn tiền:', error);
      throw error;
    }
  }

  // Tìm kiếm đơn hàng theo số vận đơn
  async searchOrdersByTracking(query) {
    try {
      return await this._fetch(`${API_BASE_URL}/don-hang/search-by-tracking?q=${encodeURIComponent(query)}`);
    } catch (error) {
      console.error('Lỗi tìm kiếm theo vận đơn:', error);
      throw error;
    }
  }

  // Lấy danh sách đơn hàng (có search + paginate từ BE)
  async getOrders({ trangThai, search, page, size } = {}) {
    try {
      const params = new URLSearchParams();
      if (trangThai && trangThai !== 'All') params.append('trangThai', trangThai);
      if (search) params.append('search', search);
      if (page) params.append('page', page);
      if (size) params.append('size', size);

      const queryStr = params.toString();
      const url = `${API_BASE_URL}/don-hang${queryStr ? '?' + queryStr : ''}`;
      const response = await this._fetch(url);

      // Nếu BE trả về PagedResponse { content, totalPages, totalElements }
      if (response && response.content) {
        return {
          orders: response.content,
          totalPages: response.totalPages || 1,
          totalElements: response.totalElements || response.content.length
        };
      }
      // Fallback: array
      return {
        orders: Array.isArray(response) ? response : [],
        totalPages: 1,
        totalElements: Array.isArray(response) ? response.length : 0
      };
    } catch (error) {
      console.error('Lỗi lấy đơn hàng:', error);
      throw error;
    }
  }

  // Kiểm tra trạng thái hoàn trả của đơn hàng (dùng API chuyên dụng của BE)
  async checkOrderReturnStatus(orderId, userId) {
    try {
      return await this._fetch(`${API_BASE_URL}/doi-tra/kiem-tra?orderId=${orderId}&userId=${userId}`);
    } catch (error) {
      console.error('Lỗi kiểm tra hoàn trả:', error);
      return { hasReturnRequest: false, returnStatus: null };
    }
  }

  //  PayOS Payment 

  // Tạo link thanh toán PayOS cho đơn hàng
  async createPaymentLink(idDonHang) {
    try {
      return await this._fetch(`${API_BASE_URL}/payment/create-link`, {
        method: 'POST',
        body: JSON.stringify({ idDonHang })
      });
    } catch (error) {
      console.error('Lỗi tạo link thanh toán:', error);
      throw error;
    }
  }

  // Kiểm tra trạng thái thanh toán PayOS
  async checkPaymentStatus(orderId) {
    try {
      return await this._fetch(`${API_BASE_URL}/payment/status/${orderId}`);
    } catch (error) {
      console.error('Lỗi kiểm tra trạng thái thanh toán:', error);
      throw error;
    }
  }

  // Lấy FEFO Pick List cho đơn hàng (dùng trong Admin Order Detail)
  async getPickList(orderId) {
    try {
      return await this._fetch(`${API_BASE_URL}/don-hang/${orderId}/pick-list`);
    } catch (error) {
      console.error('Lỗi lấy pick list:', error);
      return [];
    }
  }
}

const orderApi = new OrderApi();
export default orderApi;