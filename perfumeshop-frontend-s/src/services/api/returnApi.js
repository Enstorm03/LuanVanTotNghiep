import BaseApi, { API_BASE_URL } from './baseApi.js';

class ReturnApi extends BaseApi {
  // Lấy danh sách tất cả hoàn trả
  async getAllReturns() {
    try {
      console.log('ReturnApi - Calling /doi-tra/all');
      const result = await this._fetch(`${API_BASE_URL}/doi-tra/all`);
      console.log('ReturnApi - /doi-tra/all response:', result);
      return result;
    } catch (error) {
      console.error('Lỗi lấy danh sách hoàn trả:', error);
      throw error;
    }
  }

  // Lấy danh sách hoàn trả chờ duyệt (giữ lại để tương thích)
  async getPendingReturns() {
    try {
      console.log('ReturnApi - Calling /doi-tra/cho-duyet');
      const result = await this._fetch(`${API_BASE_URL}/doi-tra/cho-duyet`);
      console.log('ReturnApi - /doi-tra/cho-duyet response:', result);
      return result;
    } catch (error) {
      console.error('Lỗi lấy hoàn trả chờ duyệt:', error);
      throw error;
    }
  }

  // Tạo yêu cầu hoàn trả
  async createReturn(returnData) {
    try {
      return await this._fetch(`${API_BASE_URL}/doi-tra`, { method: 'POST', body: JSON.stringify(returnData) });
    } catch (error) {
      console.error('Lỗi tạo yêu cầu hoàn trả:', error);
      throw error;
    }
  }

  // Duyệt hoàn trả (bước 1 — hoàn kho, chờ hoàn tiền)
  async approveReturn(returnId, employeeId) {
    try {
      return await this._fetch(`${API_BASE_URL}/doi-tra/${returnId}/duyet`, {
        method: 'POST',
        body: JSON.stringify({ nhanVienId: employeeId })
      });
    } catch (error) {
      console.error('Lỗi duyệt hoàn trả:', error);
      throw error;
    }
  }

  // Xác nhận đã hoàn tiền (bước 2 — hoàn tất quy trình)
  async confirmRefund(returnId, employeeId) {
    try {
      return await this._fetch(`${API_BASE_URL}/doi-tra/${returnId}/xac-nhan-hoan-tien`, {
        method: 'POST',
        body: JSON.stringify({ nhanVienId: employeeId })
      });
    } catch (error) {
      console.error('Lỗi xác nhận hoàn tiền:', error);
      throw error;
    }
  }

  // Từ chối hoàn trả
  // Từ chối hoàn trả
  async rejectReturn(returnId, employeeId, reason) {
    try {
      return await this._fetch(`${API_BASE_URL}/doi-tra/${returnId}/tu-choi`, { 
        method: 'POST', 
        body: JSON.stringify({ 
          nhanVienId: employeeId, 
          lyDo: reason,          // Thêm lý do vào payload
          lyDoTuChoi: reason     // Đề phòng BE dùng tên biến này
        }) 
      });
    } catch (error) {
      console.error('Lỗi từ chối hoàn trả:', error);
      throw error;
    }
  }
}

const returnApi = new ReturnApi();
export default returnApi;
