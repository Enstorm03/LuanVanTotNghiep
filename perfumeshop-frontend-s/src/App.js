import { Routes, Route, useParams } from 'react-router-dom';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import AdminLayout from './layouts/AdminLayout';

// Guards
import ProtectedRoute from './components/common/ProtectedRoute';

// Contexts
import { SupplierProvider } from './contexts/SupplierContext';

// Public Pages
import HomePage from './pages/public/TrangChu';
import ProductDetail from './pages/public/ChiTietSanPham';
import CategoryPage from './pages/public/DanhMucSanPham';
import GioHangPage from './pages/public/GioHang';
import ThanhToanPage from './pages/public/checkout/ThanhToanPage';
import ThanhToanKetQuaPage from './pages/public/checkout/ThanhToanKetQuaPage';
import LichSuDonHangPage from './pages/public/LichSuDonHangPage';
import ThuongHieuPage from './pages/public/ThuongHieuPage';
import XacNhanDonHangPage from './pages/public/XacNhanDonHangPage';
import UserProfilePage from './pages/public/user-profile';
import VerifyEmailPage from './pages/public/verify-email/VerifyEmailPage';

// Auth Pages
import DangNhapPage from './pages/auth/DangNhapPage';
import DangKyPage from './pages/auth/DangKyPage';

// Admin Pages
import DashboardPage from './pages/admin/DashboardPage';
import AdminProductsPage from './pages/admin/AdminProductsPage';
import AdminOrdersPage from './pages/admin/AdminOrdersPage';
import AdminOrderDetailPage from './pages/admin/AdminOrderDetailPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminReportPage from './pages/admin/AdminReportPage';
import AdminReturnsPage from './pages/admin/AdminReturnsPage';
import AdminBrandsPage from './pages/admin/AdminBrandPage';
import AdminCategoriesPage from './pages/admin/AdminCategoriesPage';
import AdminReviewsPage from './pages/admin/AdminReviewsPage';
import AdminDefectivePage from './pages/admin/AdminDefectivePage';
import AdminCampaignsPage from './pages/admin/AdminCampaignsPage';
import AdminKhoPage from './pages/admin/AdminKhoPage';
import AdminImportKhoPage from './pages/admin/AdminImportKhoPage';
import AdminNearExpiryProductsPage from './pages/admin/AdminNearExpiryProductsPage';
import AdminProcurementPage from './pages/admin/AdminProcurementPage';
import AdminProcurementDetailPage from './pages/admin/AdminProcurementDetailPage';
import AdminSuppliersPage from './pages/admin/AdminSuppliersPage';
import ProcurementPortalPage, { ProcurementDetailPage } from './pages/public/ProcurementPortalPage';
import SupplierLoginPage from './pages/public/SupplierLoginPage';
import SupplierPortalPage from './pages/public/SupplierPortalPage';

// Wrapper lấy :id từ URL và truyền vào ProcurementDetailPage
const ProcurementDetailWrapper = () => {
  const { id } = useParams();
  return <ProcurementDetailPage requestId={id} />;
};



function App() {
  return (
    <SupplierProvider>
    <div className="relative flex min-h-screen w-full flex-col group/design-root overflow-x-hidden">
      <Routes>
        {/* Public Routes with Layout */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<CategoryPage />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/brands" element={<ThuongHieuPage />} />

          {/* Routes yêu cầu đăng nhập (khách hàng) */}
          <Route
            path="/cart"
            element={
              <ProtectedRoute requireUser>
                <GioHangPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/thanh-toan"
            element={
              <ProtectedRoute requireUser>
                <ThanhToanPage />
              </ProtectedRoute>
            }
          />
          {/* Trang kết quả thanh toán PayOS — không cần login vì PayOS redirect trực tiếp */}
          <Route path="/thanh-toan/ket-qua" element={<ThanhToanKetQuaPage />} />
           <Route
             path="/lich-su-don-hang"
             element={
               <ProtectedRoute requireUser>
                 <LichSuDonHangPage />
               </ProtectedRoute>
             }
           />
           <Route
             path="/profile"
             element={
               <ProtectedRoute requireUser>
                 <UserProfilePage />
               </ProtectedRoute>
             }
           />
         </Route>

         {/* Auth Routes without Layout */}
         <Route path="/login" element={<DangNhapPage />} />
         <Route path="/register" element={<DangKyPage />} />
         <Route path="/verify-email" element={<VerifyEmailPage />} />
        

        {/* Route công khai — NCC xem đợt gọi thầu và chào giá */}
        <Route path="/procurement" element={<ProcurementPortalPage />} />
        <Route path="/procurement/login" element={<SupplierLoginPage />} />
        <Route path="/procurement/:id" element={<ProcurementDetailWrapper />} />

        {/* Route công khai — NCC chào hàng độc lập */}
        <Route path="/supplier-portal" element={<SupplierPortalPage />} />

        {/* Route công khai — khách quét QR xác nhận nhận hàng / đổi trả (không cần login) */}
        <Route path="/don-hang/:orderId/xac-nhan" element={<XacNhanDonHangPage />} />

        {/* Admin Routes — chỉ nhân viên (ADMIN / STAFF) mới được vào */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute requireEmployee>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="products" element={<AdminProductsPage />} />
          <Route path="orders" element={<AdminOrdersPage />} />
          <Route path="orders/:orderId" element={<AdminOrderDetailPage />} />
          <Route path="users" element={<AdminUsersPage />} />
          <Route path="reports" element={<AdminReportPage />} />
          <Route path="returns" element={<AdminReturnsPage />} />
          <Route path="brands" element={<AdminBrandsPage />} />
          <Route path="categories" element={<AdminCategoriesPage />} />
          <Route path="reviews" element={<AdminReviewsPage />} />
          <Route path="defective" element={<AdminDefectivePage />} />
          <Route path="campaigns" element={<AdminCampaignsPage />} />
           <Route path="kho" element={<AdminKhoPage />} />
           <Route path="import-kho" element={<AdminImportKhoPage />} />
           <Route path="near-expiry" element={<AdminNearExpiryProductsPage />} />
           <Route path="procurement" element={<AdminProcurementPage />} />
          <Route path="procurement/:id" element={<AdminProcurementDetailPage />} />
          <Route path="suppliers" element={<AdminSuppliersPage />} />
        </Route>
      </Routes>
    </div>
    </SupplierProvider>
  );
}

export default App;
