import BaseApi, { API_BASE_URL } from './baseApi.js';

class ReviewApi extends BaseApi {
  // Tạo đánh giá
  async createReview(reviewData) {
    try {
      return await this._fetch(`${API_BASE_URL}/reviews`, { method: 'POST', body: JSON.stringify(reviewData) });
    } catch (error) {
      console.error('Lỗi tạo đánh giá:', error);
      throw error;
    }
  }
}

const reviewApi = new ReviewApi();
export default reviewApi;
