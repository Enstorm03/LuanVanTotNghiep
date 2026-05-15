import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const useAuthLogin = () => {
  const [formData, setFormData] = useState({ tenDangNhap: '', matKhau: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { loginUser } = useAuth();
  const navigate = useNavigate();

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
        // Lấy role hoặc type từ response trả về
        const role = (response.role || '').toUpperCase();
        const type = response.type;

        if (type === 'employee' || role === 'ADMIN' || role === 'STAFF') {
          console.log("Xác nhận quyền Admin -> Vào CMS");
          navigate('/admin');
        } else {
          console.log("Xác nhận quyền Khách hàng -> Về Trang chủ");
          navigate('/');
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