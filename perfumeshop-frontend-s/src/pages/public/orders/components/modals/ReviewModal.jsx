import React from 'react';

const ReviewModal = ({
  show,
  onClose,
  order,
  reviewData,
  onReviewDataChange,
  onSubmit,
  submitting
}) => {
  if (!show || !order) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-content-dark rounded-lg shadow-xl max-w-md w-full">
        <div className="p-6">
          <h3 className="text-lg font-bold mb-4">Đánh giá đơn hàng #{order.idDonHang}</h3>

          {/* Rating Stars */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Đánh giá:</label>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => onReviewDataChange({ ...reviewData, rating: star })}
                  className={`w-8 h-8 ${
                    star <= reviewData.rating
                      ? 'text-yellow-400'
                      : 'text-gray-300'
                  }`}
                >
                  <span className="material-symbols-outlined text-2xl">star</span>
                </button>
              ))}
              <span className="ml-2 text-sm text-gray-600">
                {reviewData.rating}/5 sao
              </span>
            </div>
          </div>

          {/* Comment */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Nội dung đánh giá:</label>
            <textarea
              value={reviewData.comment}
              onChange={(e) => onReviewDataChange({ ...reviewData, comment: e.target.value })}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-background-dark"
              placeholder="Chia sẻ trải nghiệm của bạn với đơn hàng này..."
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
            >
              Hủy
            </button>
            <button
              onClick={onSubmit}
              disabled={submitting || !reviewData.comment.trim()}
              className="flex-1 bg-primary text-white py-2 px-4 rounded hover:bg-primary/90 disabled:opacity-50"
            >
              {submitting ? 'Đang gửi...' : 'Gửi đánh giá'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;
