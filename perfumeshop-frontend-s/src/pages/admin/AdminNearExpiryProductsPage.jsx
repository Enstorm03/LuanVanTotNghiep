import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import khoApi from '../../services/api/khoApi';

const AdminNearExpiryProductsPage = () => {
  const [searchParams] = useSearchParams();
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await khoApi.getNearExpiryBatches(100);
        setBatches(data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const daysUntilExpiry = (expiryDate) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diff = expiry - today;
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const getStatusBadge = (days) => {
    if (days <= 30) return 'bg-red-100 text-red-800 border-red-300';
    if (days <= 90) return 'bg-orange-100 text-orange-800 border-orange-300';
    return 'bg-yellow-100 text-yellow-800 border-yellow-300';
  };

  const fmtHSD = (dateStr) => {
    if (!dateStr) return '—';
    const m = String(dateStr).substring(0, 10).match(/^(\d{4})-(\d{2})-(\d{2})$/);
    return m ? `${m[3]}/${m[2]}/${m[1]}` : String(dateStr).substring(0, 10);
  };

  if (loading) {
    return (
      <div className="flex-1 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 w-1/3 rounded" />
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-text-light dark:text-text-dark mb-2">
          Quản lý Lô Hàng Sắp Hết Hạn
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Danh sách {batches.length} lô hàng cần xả nhanh. Đẩy sang Campaign để khuyến mãi.
        </p>

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-600 dark:text-red-400">Lỗi: {error}</p>
          </div>
        )}

        {batches.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">Không có lô hàng sắp hết hạn</p>
          </div>
        ) : (
          <div className="rounded-lg border border-border-light dark:border-border-dark overflow-hidden shadow">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-700/50">
                <tr>
                  <th className="text-left px-6 py-3 font-semibold text-gray-600 dark:text-gray-300">Tên sản phẩm</th>
                  <th className="text-center px-6 py-3 font-semibold text-gray-600 dark:text-gray-300">Số lô</th>
                  <th className="text-center px-6 py-3 font-semibold text-gray-600 dark:text-gray-300">SL tồn</th>
                  <th className="text-center px-6 py-3 font-semibold text-gray-600 dark:text-gray-300">HSD</th>
                  <th className="text-center px-6 py-3 font-semibold text-gray-600 dark:text-gray-300">Còn lại</th>
                  <th className="text-center px-6 py-3 font-semibold text-gray-600 dark:text-gray-300">Trạng thái</th>
                  <th className="text-center px-6 py-3 font-semibold text-gray-600 dark:text-gray-300">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-light dark:divide-border-dark">
                {batches.map((batch) => {
                  const days = daysUntilExpiry(batch.hanSuDung);
                  return (
                    <tr key={batch.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/20 transition-colors">
                      <td className="px-6 py-3 font-medium text-text-light dark:text-text-dark">
                        {batch.tenSanPham}
                      </td>
                      <td className="px-6 py-3 text-center text-gray-600 dark:text-gray-400">
                        {batch.soLo || '—'}
                      </td>
                      <td className="px-6 py-3 text-center font-semibold text-text-light dark:text-text-dark">
                        {batch.soLuongConLai ?? batch.soLuong ?? '—'}
                      </td>
                      <td className="px-6 py-3 text-center text-gray-600 dark:text-gray-400">
                        {fmtHSD(batch.hanSuDung)}
                      </td>
                      <td className="px-6 py-3 text-center">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusBadge(days)}`}>
                          {days} ngày
                        </span>
                      </td>
                      <td className="px-6 py-3 text-center">
                        <span className="text-xs font-semibold text-orange-600 dark:text-orange-400">
                          ⚠ Sắp hết hạn
                        </span>
                      </td>
                      <td className="px-6 py-3 text-center">
                        <button className="px-3 py-1.5 text-xs font-medium bg-primary text-white rounded hover:bg-primary/90 transition-colors">
                          Đẩy Campaign
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminNearExpiryProductsPage;