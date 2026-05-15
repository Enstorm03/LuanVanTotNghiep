import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';

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
        // Admin mode: Use backend pagination and search
        const result = await api.getOrders({
          trangThai: statusFilter === 'All' ? null : statusFilter,
          search: searchTerm || null,
          page: currentPage,
          size: itemsPerPage
        });
        
        setOrders(result.orders || []);
        setTotalPages(result.totalPages || 1);
        setTotalElements(result.totalElements || 0);
      } else {
        // User mode: Fetch history (no pagination/search in BE yet)
        if (user && user.id_nguoi_dung) {
          const data = await api.getUserOrdersHistoryDto(user.id_nguoi_dung, statusFilter === 'All' ? null : statusFilter);
          
          let ordersArray = [];
          if (Array.isArray(data)) {
            ordersArray = data;
          } else if (data && typeof data === 'object') {
            ordersArray = [data];
          }
          
          // Client-side search & pagination for user orders
          const term = searchTerm.toLowerCase();
          const filtered = ordersArray.filter(order => 
            (order.idDonHang || order.id_don_hang)?.toString().toLowerCase().includes(term) ||
            (order.tenNguoiNhan || order.ten_nguoi_nhan)?.toLowerCase().includes(term)
          );
          
          setTotalElements(filtered.length);
          setTotalPages(Math.ceil(filtered.length / itemsPerPage));
          
          const indexOfLastItem = currentPage * itemsPerPage;
          const indexOfFirstItem = indexOfLastItem - itemsPerPage;
          setOrders(filtered.slice(indexOfFirstItem, indexOfLastItem));
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

  // Reset page to 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return {
    orders: isAdmin ? orders : undefined, // For backwards compatibility or direct access
    currentOrders: orders, // Provide standardized currentOrders
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
