import { useState, useEffect } from 'react';
import api from '../services/api';

// Helper: map từ BE role (ADMIN, STORE_MANAGER...) sang nhãn hiển thị
const getRoleLabel = (vaiTro) => {
  const map = {
    'ADMIN': 'Admin',
    'STORE_MANAGER': 'Cửa hàng trưởng',
    'WAREHOUSE_STAFF': 'Nhân viên kho',
    'SALES_STAFF': 'Nhân viên bán hàng',
    'CUSTOMER': 'Khách hàng',
    'STAFF': 'Nhân viên',  // backward compat
  };
  return map[(vaiTro || '').toUpperCase()] || vaiTro || 'Nhân viên';
};

// Helper: từ nhãn UI → role BE
const getRoleCode = (label) => {
  const map = {
    'Admin': 'ADMIN',
    'Cửa hàng trưởng': 'STORE_MANAGER',
    'Nhân viên kho': 'WAREHOUSE_STAFF',
    'Nhân viên bán hàng': 'SALES_STAFF',
    'Nhân viên': 'STAFF',  // fallback
  };
  return map[label] || 'SALES_STAFF';  // mặc định là SALES_STAFF
};

const useAdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterRole, setFilterRole] = useState('All');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [formData, setFormData] = useState({
    id: null,
    type: 'staff',
    role: 'Nhân viên bán hàng',  // mặc định
    hoTen: '',
    tenDangNhap: '',
    matKhau: '',
    soDienThoai: ''
  });

  const fetchAllAccounts = async () => {
    try {
      setLoading(true);
      const [staffRes, customersRes] = await Promise.all([
        api.getEmployees(),
        api.getCustomers()
      ]);

      const staffList = staffRes.map(s => {
        const roleStr = s.vaiTro || s.vai_tro || 'STAFF';
        return {
          ...s,
          id: s.idNhanVien || s.id_nhan_vien,
          role: getRoleLabel(roleStr),
          type: 'staff',
          tenDangNhap: s.tenDangNhap,
          hoTen: s.hoTen,
          soDienThoai: s.soDienThoai || '',
        };
      });

      const customerList = customersRes.map(c => ({
        ...c,
        id: c.idNguoiDung,
        role: 'Khách hàng',
        type: 'customer',
        tenDangNhap: c.tenDangNhap,
        hoTen: c.hoTen,
        soDienThoai: c.soDienThoai || '',
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
    setFormData({
      id: null,
      type: 'staff',
      role: 'Nhân viên bán hàng',
      hoTen: '',
      tenDangNhap: '',
      matKhau: '',
      soDienThoai: ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (user) => {
    setModalMode('edit');
    setFormData({
      id: user.id,
      type: user.type,
      role: user.role,
      hoTen: user.hoTen || '',
      tenDangNhap: user.tenDangNhap || '',
      soDienThoai: user.soDienThoai || '',
      matKhau: ''
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
            hoTen: formData.hoTen,
            tenDangNhap: formData.tenDangNhap,
            matKhau: formData.matKhau,
            soDienThoai: formData.soDienThoai,
            vaiTro: getRoleCode(formData.role)
          });
        } else {
          await api.createCustomer({
            hoTen: formData.hoTen,
            tenDangNhap: formData.tenDangNhap,
            matKhau: formData.matKhau,
            soDienThoai: formData.soDienThoai
          });
        }
        alert('Đã thêm tài khoản mới thành công!');
      } else {
        if (formData.type === 'staff') {
          const payload = {
            hoTen: formData.hoTen,
            soDienThoai: formData.soDienThoai,
            vaiTro: getRoleCode(formData.role),
          };
          if (formData.matKhau) payload.matKhau = formData.matKhau;
          await api.updateEmployee(formData.id, payload);
        } else {
          const payload = {
            hoTen: formData.hoTen,
            soDienThoai: formData.soDienThoai,
          };
          if (formData.matKhau) payload.matKhau = formData.matKhau;
          await api.updateCustomer(formData.id, payload);
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

  return {
    loading,
    filterRole, setFilterRole, filteredUsers,
    isModalOpen, setIsModalOpen, modalMode, formData,
    handleOpenAdd, handleOpenEdit, handleDelete, handleSubmit, handleChange
  };
};

export default useAdminUsers;
