import BaseApi, { API_BASE_URL } from './baseApi.js';

class ReviewAdminApi extends BaseApi {
  async getAllReviews() {
    return this._fetch(`${API_BASE_URL}/reviews/all`);
  }

  async getReviewsByProduct(productId) {
    return this._fetch(`${API_BASE_URL}/reviews/product/${productId}`);
  }

  async deleteReview(id) {
    const response = await fetch(`${API_BASE_URL}/reviews/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' }
    });
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error(data.error || 'Lỗi xóa đánh giá');
    }
    return null;
  }
}

const reviewAdminApi = new ReviewAdminApi();
export default reviewAdminApi;
