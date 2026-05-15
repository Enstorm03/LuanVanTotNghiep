import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

const useReviewOrder = () => {
  const { user } = useAuth();
  const [submittingReview, setSubmittingReview] = useState(false);

  const submitReview = async (order, reviewData, onSuccess) => {
    if (!reviewData.comment.trim()) {
      alert('Vui lòng nhập nội dung đánh giá');
      return;
    }

    if (!order || !order.chiTiet || order.chiTiet.length === 0) {
      alert('Không có sản phẩm nào để đánh giá');
      return;
    }

    try {
      setSubmittingReview(true);

      // Submit review for each product in the completed order
      const reviewPromises = order.chiTiet.map(async (item) => {
        const reviewPayload = {
          idNguoiDung: user.id_nguoi_dung,     // Customer ID
          idSanPham: item.sanPhamId,           // Product ID
          idDonHang: order.idDonHang, // Order ID (for reference)
          diemDanhGia: reviewData.rating,      // Rating (1-5) - backend expects "diemDanhGia"
          binhLuan: reviewData.comment         // Comment - backend expects "binhLuan"
        };

        console.log('Submitting review for product:', item.sanPhamId, reviewPayload);
        return api.createReview(reviewPayload);
      });

      // Wait for all reviews to be submitted
      await Promise.all(reviewPromises);

      alert(`Đánh giá đã được gửi thành công!\nSố sao: ${reviewData.rating}\nNội dung: ${reviewData.comment}`);

      if (onSuccess) onSuccess();

    } catch (error) {
      console.error('Error submitting reviews:', error);
      alert('Không thể gửi đánh giá: ' + error.message);
    } finally {
      setSubmittingReview(false);
    }
  };

  return {
    submitReview,
    submittingReview
  };
};

export default useReviewOrder;

