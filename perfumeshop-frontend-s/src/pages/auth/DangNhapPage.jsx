import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const DangNhapPage = () => {
  const [loginType, setLoginType] = useState('customer'); // 'customer' or 'staff'
  const [formData, setFormData] = useState({
    tenDangNhap: '',
    matKhau: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const { loginUser, loginStaff } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
    }
  }, [location.state]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let result;
      if (loginType === 'customer') {
        result = await loginUser(formData);
        if (result.success) {
          navigate('/');
        } else {
          setError(result.error || 'Đăng nhập thất bại');
        }
      } else {
        result = await loginStaff(formData);
        if (result.success) {
          navigate('/admin');
        } else {
          setError(result.error || 'Đăng nhập thất bại');
        }
      }
    } catch (error) {
      setError('Có lỗi xảy ra, vui lòng thử lại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex flex-1 justify-center items-center py-12 px-4 bg-background-light dark:bg-background-dark min-h-screen">
      <div className="w-full max-w-md">
        
        <div className="bg-surface-light dark:bg-surface-dark p-8 rounded-2xl shadow-lg border border-border-light dark:border-border-dark">
          
            <Link className="text-sm font-medium leading-normal hover:text-primary dark:hover:text-primary transition-colors" to="/"> Quay lại trang chủ</Link>
          <div className="text-center mb-8">
            <h1 className="text-3xl font-black text-text-light dark:text-text-dark">Đăng Nhập</h1>
            
            <p className="text-text-subtle-light dark:text-text-subtle-dark mt-2">Chào mừng bạn trở lại!</p>
          </div>

          {/* Login Type Toggle */}
          <div className="flex mb-6 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            <button
              type="button"
              onClick={() => setLoginType('customer')}
              className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
                loginType === 'customer'
                  ? 'bg-white dark:bg-gray-700 text-primary shadow-sm'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900'
              }`}
            >
              Khách hàng
            </button>
            <button
              type="button"
              onClick={() => setLoginType('staff')}
              className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
                loginType === 'staff'
                  ? 'bg-white dark:bg-gray-700 text-primary shadow-sm'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900'
              }`}
            >
              Nhân viên
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {/* Username Input - Database uses ten_dang_nhap */}
            <div>
              <label htmlFor="ten_dang_nhap" className="block text-sm font-medium mb-2 text-text-subtle-light dark:text-text-subtle-dark">
                Tên đăng nhập
              </label>
              <input
                type="text"
                id="tenDangNhap"
                name="tenDangNhap"
                value={formData.tenDangNhap}
                onChange={handleInputChange}
                className="form-input w-full h-12 rounded-lg border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark focus:border-primary focus:ring-primary/50"
                placeholder="nhập tên đăng nhập"
                required
              />
            </div>

            {/* Password Input - Database uses mat_khau_bam (but we'll keep it as mat_khau_bam for consistency) */}
            <div>
              <div className="flex justify-between items-center mb-2">
                  <label htmlFor="mat_khau_bam" className="block text-sm font-medium text-text-subtle-light dark:text-text-subtle-dark">Mật khẩu</label>
                  
              </div>
              <input
                type="password"
                id="matKhau"
                name="matKhau"
                value={formData.matKhau}
                onChange={handleInputChange}
                className="form-input w-full h-12 rounded-lg border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark focus:border-primary focus:ring-primary/50"
                placeholder="••••••••"
                required
              />
            </div>

            {/* Success Message */}
            {successMessage && (
              <div className="text-green-600 text-sm text-center bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                {successMessage}
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="text-red-600 text-sm text-center bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 flex items-center justify-center rounded-lg bg-primary text-white text-sm font-bold hover:bg-opacity-90 transition-colors mt-4 disabled:bg-gray-400"
            >
              {loading ? (
                <>
                  <span className="animate-spin mr-2">⚽</span>
                  Đang đăng nhập...
                </>
              ) : (
                loginType === 'customer' ? 'Đăng Nhập Khách Hàng' : 'Đăng Nhập Nhân Viên'
              )}
            </button>

            {loginType === 'customer' && (
              <div className="text-center mt-4">
                <Link to="#" className="text-sm text-primary hover:underline">Quên mật khẩu?</Link>
                <p className="text-sm text-text-subtle-light dark:text-text-subtle-dark">
                  
                  Chưa có tài khoản? <Link to="/register" className="font-medium text-primary hover:underline">Đăng ký ngay</Link>
                </p>
              </div>
            )}
          </form>

  
          
        </div>
      </div>
    </main>
  );
};

export default DangNhapPage;
