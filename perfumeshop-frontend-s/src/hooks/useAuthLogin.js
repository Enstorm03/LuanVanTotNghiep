import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const useAuthLogin = () => {
  const [formData, setFormData] = useState({ tenDangNhap: '', matKhau: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { loginUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // URL mà user muốn vào trước khi bị redirect về /login
  const returnTo = location.state?.from?.pathname || null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await loginUser(formData);

      if (response.success) {
        const role = (response.role || '').toUpperCase();
        const type = response.type;

        if (type === 'supplier' || role === 'SUPPLIER') {
          // Nhà cung cấp → trang portal NCC
          navigate('/supplier-portal', { replace: true });
        } else if (type === 'employee') {
          // Nhân viên nội bộ → trang admin
          navigate(returnTo?.startsWith('/admin') ? returnTo : '/admin', { replace: true });
        } else {
          // Khách hàng → trang họ muốn vào hoặc trang chủ
          navigate(returnTo && !returnTo.startsWith('/admin') ? returnTo : '/', { replace: true });
        }
      } else {
        setError(response.error || 'Sai tài khoản hoặc mật khẩu');
      }
    } catch (err) {
      setError('Có lỗi xảy ra, vui lòng thử lại sau');
    } finally {
      setLoading(false);
    }
  };

  return { formData, loading, error, handleChange, handleSubmit };
};

export default useAuthLogin;