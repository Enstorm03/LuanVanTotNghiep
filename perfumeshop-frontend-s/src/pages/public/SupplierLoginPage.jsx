import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSupplier } from '../../contexts/SupplierContext';

const SupplierLoginPage = () => {
  const { loginSupplier } = useSupplier();
  const navigate = useNavigate();

  const [form,      setForm]      = useState({ tenDangNhap: '', matKhau: '' });
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      setLoading(true);
      await loginSupplier(form.tenDangNhap.trim(), form.matKhau);
      navigate('/procurement');
    } catch (err) {
      setError(err.message || 'Sai tài khoản hoặc mật khẩu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden">

        {/* Header */}
        <div className="bg-indigo-600 text-white text-center px-6 py-8">
          <span className="material-symbols-outlined text-4xl block mb-2">business</span>
          <h1 className="text-xl font-bold">Cổng Nhà Cung Cấp</h1>
          <p className="text-indigo-200 text-sm mt-1">Đăng nhập để xem đợt gọi thầu và chào giá</p>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-6 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-1">Tên đăng nhập</label>
            <input
              value={form.tenDangNhap}
              onChange={e => setForm(f => ({ ...f, tenDangNhap: e.target.value }))}
              required autoFocus
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="username"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Mật khẩu</label>
            <input
              type="password"
              value={form.matKhau}
              onChange={e => setForm(f => ({ ...f, matKhau: e.target.value }))}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-2.5 rounded-xl font-semibold hover:bg-indigo-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
          >
            {loading ? <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" /> : null}
            Đăng nhập
          </button>

          <p className="text-xs text-center text-gray-400">
            Chưa có tài khoản? Liên hệ Enstorm Perfume để được cấp.
          </p>
        </form>
      </div>
    </div>
  );
};

export default SupplierLoginPage;
