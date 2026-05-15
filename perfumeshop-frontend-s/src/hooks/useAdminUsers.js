import { useState, useEffect } from 'react';
import api from '../services/api';

const useAdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterRole, setFilterRole] = useState('All');

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [formData, setFormData] = useState({
    id: null, type: 'staff', role: 'Nhân viên', hoTen: '', tenDangNhap: '', matKhau: '', soDienThoai: ''
  });

  const fetchAllAccounts = async () => {
    try {
      setLoading(true);
      const [staffres, customersRes] = await Promise.all([
        api.getEmployees(),
        api.getCustomers()
      ]);

      const staffList = staffres.map(s => {
        const roleStr = s.vaiTro || s.vai_tro || '';
        return {
          ...s,
          id: s.idNhanVien || s.id_nhan_vien,
          role: roleStr.toUpperCase() === 'ADMIN' ? 'Admin' : 'Nhân viên',
          type: 'staff'
        };
      });

      const customerList = customersRes.map(c => ({
        ...c, 
        id: c.idNguoiDung,
        role: 'Khách hàng',
        type: 'customer'
      }));

      setUsers([...staffList, ...customerList].sort((a, b) => b.id - a.id));
    } catch (error) {
      console.error("Lỗi tải danh sách tài khoản:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllAccounts();
  }, []);

  const handleOpenAdd = () => {
    setModalMode('add');
    setFormData({ id: null, type: 'staff', role: 'Nhân viên', hoTen: '', tenDangNhap: '', matKhau: '', soDienThoai: '' });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (user) => {
    setModalMode('edit');
    setFormData({
      id: user.id, type: user.type, role: user.role, hoTen: user.hoTen || '',
      tenDangNhap: user.tenDangNhap || '', soDienThoai: user.soDienThoai || '', matKhau: ''
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (user) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa tài khoản: ${user.hoTen} (${user.tenDangNhap})?`)) return;
    try {
      if (user.type === 'staff') await api.deleteEmployee(user.id);
      else await api.deleteCustomer(user.id);
      alert('Đã xóa tài khoản thành công!');
      fetchAllAccounts();
    } catch (error) {
      alert('Không thể xóa tài khoản: ' + error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (modalMode === 'add') {
        if (formData.type === 'staff') {
          await api.createEmployee({
             hoTen: formData.hoTen, tenDangNhap: formData.tenDangNhap, matKhau: formData.matKhau,
             soDienThoai: formData.soDienThoai, vaiTro: formData.role === 'Admin' ? 'ADMIN' : 'STAFF'
          });
        } else {
          await api.createCustomer({
             hoTen: formData.hoTen, tenDangNhap: formData.tenDangNhap, matKhau: formData.matKhau, soDienThoai: formData.soDienThoai
          });
        }
        alert('Đã thêm tài khoản mới thành công!');
      } else {
        if (formData.type === 'staff') {
          await api.updateEmployee(formData.id, {
             hoTen: formData.hoTen, soDienThoai: formData.soDienThoai,
             vaiTro: formData.role === 'Admin' ? 'ADMIN' : 'STAFF', matKhau: formData.matKhau || undefined
          });
        } else {
          await api.updateCustomer(formData.id, {
             hoTen: formData.hoTen, soDienThoai: formData.soDienThoai, matKhau: formData.matKhau || undefined
          });
        }
        alert('Cập nhật tài khoản thành công!');
      }
      setIsModalOpen(false);
      fetchAllAccounts();
    } catch (error) {
      alert('Có lỗi xảy ra: ' + error.message);
    }
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const filteredUsers = users.filter(u => filterRole === 'All' ? true : u.role === filterRole);

  // Trả về những data và function mà UI cần dùng
  return {
    loading,
    filterRole, setFilterRole, filteredUsers,
    isModalOpen, setIsModalOpen, modalMode, formData,
    handleOpenAdd, handleOpenEdit, handleDelete, handleSubmit, handleChange
  };
};

export default useAdminUsers;