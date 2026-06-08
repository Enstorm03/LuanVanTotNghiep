import React from 'react';
import useAdminReviews from '../../hooks/useAdminReviews';

/* Render sao */
const StarRating = ({ score }) => (
  <div className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map(s => (
      <span
        key={s}
        className={`material-symbols-outlined text-base ${s <= score ? 'text-yellow-400' : 'text-gray-300'}`}
        style={{ fontVariationSettings: "'FILL' 1" }}
      >
        star
      </span>
    ))}
  </div>
);

const AdminReviewsPage = () => {
  const {
    reviews, totalReviews, loading, error,
    searchTerm, setSearchTerm,
    ratingFilter, setRatingFilter,
    ratingCounts, avgRating,
    handleDelete, fetchReviews,
  } = useAdminReviews();

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
    </div>
  );

  if (error) return (
    <div className="text-center py-12">
      <p className="text-red-500 mb-4">{error}</p>
      <button onClick={fetchReviews} className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90">
        Thử lại
      </button>
    </div>
  );

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <h1 className="font-semibold text-lg md:text-2xl text-text-light dark:text-text-dark flex-1">
          Quản lý Đánh Giá
        </h1>
        <span className="text-sm text-gray-500">{totalReviews} đánh giá tổng</span>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl p-4 text-center">
          <p className="text-3xl font-bold text-yellow-500">{avgRating}</p>
          <p className="text-xs text-gray-500 mt-1">Điểm trung bình</p>
          <StarRating score={Math.round(avgRating)} />
        </div>
        {[5, 4, 3, 2, 1].slice(0, 4).map(star => (
          <div key={star} className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl p-4 text-center">
            <p className="text-2xl font-bold">{ratingCounts[star] || 0}</p>
            <div className="flex items-center justify-center gap-0.5 mt-1">
              {[...Array(star)].map((_, i) => (
                <span key={i} className="material-symbols-outlined text-yellow-400 text-sm"
                  style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-0.5">{star} sao</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg">search</span>
          <input
            type="text"
            placeholder="Tìm theo nội dung, ID sản phẩm, ID khách..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <select
          value={ratingFilter}
          onChange={e => setRatingFilter(e.target.value)}
          className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="All">Tất cả số sao</option>
          {[5, 4, 3, 2, 1].map(s => (
            <option key={s} value={s}>{s} sao ({ratingCounts[s] || 0})</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-700/50">
            <tr>
              <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-300 w-14">ID</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-300">Sản phẩm</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-300">Khách hàng</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-300">Sao</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-300">Nội dung</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-300">Ngày</th>
              <th className="px-4 py-3 w-16" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border-light dark:divide-border-dark">
            {reviews.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-10 text-gray-400">
                  {searchTerm || ratingFilter !== 'All' ? 'Không tìm thấy đánh giá phù hợp' : 'Chưa có đánh giá nào'}
                </td>
              </tr>
            ) : reviews.map(r => (
              <tr key={r.idDanhGia} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                <td className="px-4 py-3 text-gray-400">#{r.idDanhGia}</td>
                <td className="px-4 py-3">
                  <span className="font-medium">{r.tenSanPham || `SP #${r.idSanPham}`}</span>
                </td>
                <td className="px-4 py-3 text-gray-500">KH #{r.idNguoiDung}</td>
                <td className="px-4 py-3">
                  <StarRating score={r.diemDanhGia} />
                </td>
                <td className="px-4 py-3 max-w-xs">
                  <p className="truncate text-gray-700 dark:text-gray-300" title={r.binhLuan}>
                    {r.binhLuan || <span className="text-gray-400 italic">Không có nội dung</span>}
                  </p>
                </td>
                <td className="px-4 py-3 text-gray-400 whitespace-nowrap">
                  {r.ngayTao ? new Date(r.ngayTao).toLocaleDateString('vi-VN') : '—'}
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => handleDelete(r.idDanhGia)}
                    className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 text-red-500 transition-colors"
                    title="Xóa đánh giá"
                  >
                    <span className="material-symbols-outlined text-base">delete</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-gray-400">{reviews.length} đánh giá đang hiển thị</p>
    </div>
  );
};

export default AdminReviewsPage;
