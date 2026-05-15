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

  // Duyệt hoàn trả
  async approveReturn(returnId, employeeId) {
    try {
      return await this._fetch(`${API_BASE_URL}/doi-tra/${returnId}/duyet`, { method: 'POST', body: JSON.stringify({ nhanVienId: employeeId }) });
    } catch (error) {
      console.error('Lỗi duyệt hoàn trả:', error);
      throw error;
    }
  }

  // Từ chối hoàn trả
  async rejectReturn(returnId, employeeId) {
    try {
      return await this._fetch(`${API_BASE_URL}/doi-tra/${returnId}/tu-choi`, { method: 'POST', body: JSON.stringify({ nhanVienId: employeeId }) });
    } catch (error) {
      console.error('Lỗi từ chối hoàn trả:', error);
      throw error;
    }
  }
}

const returnApi = new ReturnApi();
export default returnApi;
