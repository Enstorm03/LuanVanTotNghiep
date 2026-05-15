import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';

const DangKyPage = () => {
  const [formData, setFormData] = useState({
    tenDangNhap: '',
    matKhau: '',
    hoTen: '',
    soDienThoai: '',
    diaChi: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

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
      await api.registerCustomer(formData);
      // Registration successful, redirect to login
      navigate('/login', {
        state: { message: 'Đăng ký thành công! Vui lòng đăng nhập.' }
      });
    } catch (error) {
      setError(error.message || 'Đăng ký thất bại. Vui lòng thử lại.');
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
            <h1 className="text-3xl font-black text-text-light dark:text-text-dark">Tạo tài khoản</h1>

            <p className="text-text-subtle-light dark:text-text-subtle-dark mt-2">Bắt đầu hành trình hương thơm của bạn.</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {/* Username Input */}
            <div>
              <label htmlFor="tenDangNhap" className="block text-sm font-medium mb-2 text-text-subtle-light dark:text-text-subtle-dark">
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

            {/* Full Name Input */}
            <div>
              <label htmlFor="hoTen" className="block text-sm font-medium mb-2 text-text-subtle-light dark:text-text-subtle-dark">Họ và tên</label>
              <input
                type="text"
                id="hoTen"
                name="hoTen"
                value={formData.hoTen}
                onChange={handleInputChange}
                className="form-input w-full h-12 rounded-lg border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark focus:border-primary focus:ring-primary/50"
                placeholder="Nguyễn Văn A"
                required
              />
            </div>

            {/* Phone Input */}
            <div>
              <label htmlFor="soDienThoai" className="block text-sm font-medium mb-2 text-text-subtle-light dark:text-text-subtle-dark">Số điện thoại</label>
              <input
                type="tel"
                id="soDienThoai"
                name="soDienThoai"
                value={formData.soDienThoai}
                onChange={handleInputChange}
                className="form-input w-full h-12 rounded-lg border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark focus:border-primary focus:ring-primary/50"
                placeholder="0987654321"
                required
              />
            </div>

            {/* Address Input */}
            <div>
              <label htmlFor="diaChi" className="block text-sm font-medium mb-2 text-text-subtle-light dark:text-text-subtle-dark">Địa chỉ</label>
              <input
                type="text"
                id="diaChi"
                name="diaChi"
                value={formData.diaChi}
                onChange={handleInputChange}
                className="form-input w-full h-12 rounded-lg border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark focus:border-primary focus:ring-primary/50"
                placeholder="123 Đường ABC, Quận 1, TP.HCM"
                required
              />
            </div>

            {/* Password Input */}
            <div>
                <label htmlFor="matKhau" className="block text-sm font-medium mb-2 text-text-subtle-light dark:text-text-subtle-dark">Mật khẩu</label>
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
                  Đang đăng ký...
                </>
              ) : (
                'Đăng Ký'
              )}
            </button>

            <div className="text-center mt-4">
              <p className="text-sm text-text-subtle-light dark:text-text-subtle-dark">
                Đã có tài khoản? <Link to="/login" className="font-medium text-primary hover:underline">Đăng nhập</Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
};

export default DangKyPage;
