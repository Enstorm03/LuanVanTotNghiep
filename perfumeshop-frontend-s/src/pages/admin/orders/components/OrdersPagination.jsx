import React from 'react';

// file này để hiển thị phân trang trên trang danh sách đơn hàng admin, tránh gọi API nhiều lần
const OrdersPagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;


  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 7; // Số trang tối đa hiển thị

    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
      return pages;
    }

    // Luôn thêm trang đầu
    pages.push(1);

    // Tính toán range xung quanh trang hiện tại
    const leftSide = currentPage - 2;
    const rightSide = currentPage + 2;

    // Thêm dấu ... nếu cần (bên trái)
    if (leftSide > 2) {
      pages.push('...');
    }

    // Thêm các trang xung quanh trang hiện tại
    for (let i = Math.max(2, leftSide); i <= Math.min(totalPages - 1, rightSide); i++) {
      pages.push(i);
    }

    // Thêm dấu ... nếu cần (bên phải)
    if (rightSide < totalPages - 1) {
      pages.push('...');
    }

    // Luôn thêm trang cuối (nếu > 1)
    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <nav aria-label="Pagination" className="flex justify-center mt-4">
      <ul className="inline-flex items-center -space-x-px text-sm">
        {/* Nút Previous */}
        <li>
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-s-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700"
            aria-label="Previous page"
          >
            <span className="material-symbols-outlined text-base">chevron_left</span>
          </button>
        </li>

        {/* Các nút trang */}
        {pageNumbers.map((page, index) => {
          if (page === '...') {
            return (
              <li key={`ellipsis-${index}`}>
                <span className="px-3 h-8 flex items-center text-gray-500 dark:text-gray-400">
                  ...
                </span>
              </li>
            );
          }

          return (
            <li key={page}>
              <button
                onClick={() => onPageChange(page)}
                className={`px-3 h-8 border ${
                  currentPage === page
                    ? 'text-white bg-primary border-primary'
                    : 'text-gray-500 bg-white border-gray-300 hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700'
                }`}
                aria-label={`Go to page ${page}`}
                aria-current={currentPage === page ? 'page' : undefined}
              >
                {page}
              </button>
            </li>
          );
        })}

        {/* Nút Next */}
        <li>
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700"
            aria-label="Next page"
          >
            <span className="material-symbols-outlined text-base">chevron_right</span>
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default OrdersPagination;
