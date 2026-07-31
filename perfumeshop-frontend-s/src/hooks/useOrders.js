import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';
// file này để lấy dữ liệu danh sách đơn hàng, tránh gọi API nhiều lần
const useOrders = (isAdmin = false) => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const itemsPerPage = 10;

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      if (isAdmin) {
        // Admin mode: Phân trang qua Backend
        const result = await api.getOrders({
          trangThai: statusFilter === 'All' ? null : statusFilter,
          search: searchTerm || null,
          page: currentPage > 0 ? currentPage - 1 : 0, // BE dùng 0-index
          size: itemsPerPage
        });
        
        setOrders(result.orders || []);
        setTotalPages(result.totalPages || 1);
        setTotalElements(result.totalElements || 0);
      } else {
        // User mode: Lấy thẳng danh sách lịch sử DTO, không tự phân trang client
        if (user && (user.id_nguoi_dung || user.id)) {
          const userId = user.id_nguoi_dung || user.id;
          const statusParam = statusFilter === 'All' ? null : statusFilter;
          
          const data = await api.getUserOrdersHistoryDto(userId, statusParam);
          
          let ordersArray = [];
          if (Array.isArray(data)) {
            ordersArray = data;
          } else if (data && typeof data === 'object' && data.content) {
             // Đề phòng BE bọc trong PagedResponse
             ordersArray = data.content;
          } else if (data && typeof data === 'object') {
            ordersArray = [data];
          }
          
          // Lọc cơ bản theo tên nếu user gõ search (an toàn hơn, tránh lỗi null)
          let filtered = ordersArray;
          if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filtered = ordersArray.filter(order => {
                const idStr = (order.idDonHang || order.id_don_hang || '').toString().toLowerCase();
                const nameStr = (order.tenNguoiNhan || order.ten_nguoi_nhan || '').toLowerCase();
                return idStr.includes(term) || nameStr.includes(term);
            });
          }
          
          // Gán thẳng toàn bộ mảng đã lọc vào state, KHÔNG DÙNG slice()
          setOrders(filtered);
          setTotalElements(filtered.length);
          setTotalPages(1); // Trang user không cần phân trang
        } else {
          setOrders([]);
          setTotalPages(1);
          setTotalElements(0);
        }
      }
    } catch (err) {
      setError('Không thể tải danh sách đơn hàng');
      console.error('Error fetching orders:', err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, [isAdmin, user, statusFilter, searchTerm, currentPage]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Reset page khi filter đổi
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return {
    orders: isAdmin ? orders : undefined, 
    currentOrders: orders, 
    loading,
    error,
    searchTerm,
    statusFilter,
    currentPage,
    totalPages,
    totalElements,
    setSearchTerm,
    setStatusFilter,
    paginate,
    fetchOrders
  };
};

export default useOrders;