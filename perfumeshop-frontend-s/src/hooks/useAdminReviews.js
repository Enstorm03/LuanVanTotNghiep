import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';

const useAdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [ratingFilter, setRatingFilter] = useState('All'); // 'All' | 1–5

  const fetchReviews = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getAllReviews();
      // Sắp xếp mới nhất trước
      const sorted = (Array.isArray(data) ? data : []).sort(
        (a, b) => new Date(b.ngayTao) - new Date(a.ngayTao)
      );
      setReviews(sorted);
    } catch (err) {
      setError(err.message || 'Lỗi khi tải đánh giá');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchReviews(); }, [fetchReviews]);

  const handleDelete = async (id) => {
    if (!window.confirm('Xóa đánh giá này?')) return;
    try {
      await api.deleteReview(id);
      setReviews(prev => prev.filter(r => r.idDanhGia !== id));
    } catch (err) {
      alert('Không thể xóa: ' + err.message);
    }
  };

  const filtered = reviews.filter(r => {
    const matchSearch =
      r.binhLuan?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(r.idSanPham).includes(searchTerm) ||
      String(r.idNguoiDung).includes(searchTerm);
    const matchRating = ratingFilter === 'All' || r.diemDanhGia === Number(ratingFilter);
    return matchSearch && matchRating;
  });

  // Tổng hợp số sao
  const ratingCounts = [1, 2, 3, 4, 5].reduce((acc, star) => {
    acc[star] = reviews.filter(r => r.diemDanhGia === star).length;
    return acc;
  }, {});

  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + (r.diemDanhGia || 0), 0) / reviews.length).toFixed(1)
    : '0.0';

  return {
    reviews: filtered,
    totalReviews: reviews.length,
    loading, error,
    searchTerm, setSearchTerm,
    ratingFilter, setRatingFilter,
    ratingCounts, avgRating,
    handleDelete, fetchReviews,
  };
};

export default useAdminReviews;
