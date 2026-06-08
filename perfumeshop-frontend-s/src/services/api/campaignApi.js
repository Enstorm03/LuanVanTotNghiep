import BaseApi, { API_BASE_URL } from './baseApi.js';

class CampaignApi extends BaseApi {
  /** Lấy sự kiện đang chạy (public) */
  async getActiveCampaign() {
    try {
      return await this._fetch(`${API_BASE_URL}/public/campaigns/active`);
    } catch {
      return { active: false };
    }
  }

  /** Admin — danh sách tất cả chiến dịch */
  async getAllCampaigns() {
    return this._fetch(`${API_BASE_URL}/admin/campaigns`);
  }

  /** Admin — chi tiết chiến dịch (kèm danh sách sản phẩm) */
  async getCampaignById(id) {
    return this._fetch(`${API_BASE_URL}/admin/campaigns/${id}`);
  }

  /** Admin — tạo mới */
  async createCampaign(data) {
    return this._fetch(`${API_BASE_URL}/admin/campaigns`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /** Admin — cập nhật */
  async updateCampaign(id, data) {
    return this._fetch(`${API_BASE_URL}/admin/campaigns/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  /** Admin — xóa */
  async deleteCampaign(id) {
    const res = await fetch(`${API_BASE_URL}/admin/campaigns/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Lỗi xóa chiến dịch');
    return null;
  }

  /** Admin — gán sản phẩm (replace toàn bộ) */
  async setCampaignProducts(id, sanPhamIds) {
    return this._fetch(`${API_BASE_URL}/admin/campaigns/${id}/products`, {
      method: 'PUT',
      body: JSON.stringify(sanPhamIds),
    });
  }
}

const campaignApi = new CampaignApi();
export default campaignApi;
