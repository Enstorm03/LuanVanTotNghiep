import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import khoApi from '../../../../services/api/khoApi';

const NearExpiryWidget = () => {
  const navigate = useNavigate();
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await khoApi.getNearExpiryBatches(10);
        setBatches(data || []);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching near-expiry batches:', err);
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

  const getStatusColor = (days) => {
    if (days <= 30) return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
    if (days <= 90) return 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800';
    return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800';
  };

  const getStatusIcon = (days) => {
    if (days <= 30) return '🔴';
    if (days <= 90) return '🟠';
    return '🟡';
  };

  if (loading) {
    return (
      <div className="rounded-xl border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark p-6">
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-12 bg-gray-200 dark:bg-gray-700 rounded" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 p-6">
        <p className="text-sm text-red-600 dark:text-red-400">Lỗi tải dữ liệu: {error}</p>
      </div>
    );
  }

  if (batches.length === 0) {
    return (
      <div className="rounded-xl border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark p-6 text-center">
        <p className="text-sm text-gray-500 dark:text-gray-400">Không có lô hàng sắp hết hạn</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark overflow-hidden shadow">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 px-6 py-4">
        <h3 className="font-bold text-white flex items-center gap-2 mb-1">
          <span className="text-xl">⏰</span> Top 10 Lô Hàng Sắp Hết Hạn
        </h3>
        <p className="text-xs text-orange-100">Theo dõi các lô hàng cần xả nhanh</p>
      </div>

      {/* Content */}
      <div className="divide-y divide-border-light dark:divide-border-dark max-h-80 overflow-y-auto">
        {batches.map((batch, idx) => {
          const days = daysUntilExpiry(batch.hanSuDung);
          return (
            <div
              key={batch.id ?? batch.idLoHang ?? batch.idSanPham ?? idx}
              className={`p-4 border-l-4 border-l-orange-500 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer ${getStatusColor(days)}`}
              onClick={() => navigate(`/admin/near-expiry-products?batchId=${batch.id}`)}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">{getStatusIcon(days)}</span>
                    <p className="font-semibold text-gray-800 dark:text-gray-200 truncate">
                      {batch.tenSanPham}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 dark:text-gray-400">
                    <div>
                      <span className="text-gray-500">Số lô:</span> <strong>{batch.soLo || '—'}</strong>
                    </div>
                    <div>
                      <span className="text-gray-500">SL:</span> <strong>{batch.soLuongConLai ?? batch.soLuong ?? '—'}</strong>
                    </div>
                  </div>
                </div>
                <div className="text-right whitespace-nowrap">
                  <p className="text-sm font-bold text-gray-800 dark:text-gray-200">
                    {days} ngày
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                    HSD: {(() => { const m = String(batch.hanSuDung||'').substring(0,10).match(/^(\d{4})-(\d{2})-(\d{2})$/); return m ? `${m[3]}/${m[2]}/${m[1]}` : String(batch.hanSuDung||'').substring(0,10); })()}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="bg-gray-50 dark:bg-gray-700/30 px-6 py-3 border-t border-border-light dark:border-border-dark">
        <button
          onClick={() => navigate('/admin/near-expiry-products')}
          className="w-full text-sm font-medium text-primary hover:text-primary/80 transition-colors flex items-center justify-center gap-1"
        >
          Xem danh sách đầy đủ
          <span className="material-symbols-outlined text-base">arrow_forward</span>
        </button>
      </div>
    </div>
  );
};

export default NearExpiryWidget;