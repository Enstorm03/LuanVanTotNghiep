import productApi from './productApi.js';
import cartApi from './cartApi.js';
import orderApi from './orderApi.js';
import authApi from './authApi.js';
import customerApi from './customerApi.js';
import employeeApi from './employeeApi.js';
import reviewApi from './reviewApi.js';
import returnApi from './returnApi.js';
import brandApi from './brandApi.js';
import categoryApi from './categoryApi.js';
import reviewAdminApi from './reviewAdminApi.js';
import campaignApi from './campaignApi.js';
import khoApi from './khoApi.js';
import procurementApi from './procurementApi.js';
import dashboardApi from './dashboardApi.js';
import reportApi from './reportApi.js';
import userApi from './userApi.js';

// Combined API object for backward compatibility
const api = {
  // Report methods
  getReportSummary: reportApi.getReportSummary.bind(reportApi),
  getTopProducts: reportApi.getTopProducts.bind(reportApi),
  getRevenueByStatus: reportApi.getRevenueByStatus.bind(reportApi),
  exportReport: reportApi.exportReport.bind(reportApi),
  // Dashboard methods
  getDashboardStats: dashboardApi.getDashboardStats.bind(dashboardApi),
  getRecentOrders: dashboardApi.getRecentOrders.bind(dashboardApi),
  getDashboardAlerts: dashboardApi.getDashboardAlerts.bind(dashboardApi),
  // Product methods
  getAllProducts: productApi.getAllProducts.bind(productApi),
  getProductById: productApi.getProductById.bind(productApi),
  createProduct: productApi.createProduct.bind(productApi),
  updateProduct: productApi.updateProduct.bind(productApi),
  deleteProduct: productApi.deleteProduct.bind(productApi),
  getCategories: productApi.getCategories.bind(productApi),
  getBrands: productApi.getBrands.bind(productApi),
  searchProducts: productApi.searchProducts.bind(productApi),
  searchProductsAdvanced: productApi.searchProductsAdvanced.bind(productApi),
  getRelatedProducts: productApi.getRelatedProducts.bind(productApi),
  getDefectiveProducts: productApi.getDefectiveProducts.bind(productApi),
  exportDefectiveProduct: productApi.exportDefectiveProduct.bind(productApi),

  // Cart methods
  getCart: cartApi.getCart.bind(cartApi),
  addCartItem: cartApi.addCartItem.bind(cartApi),
  removeCartItem: cartApi.removeCartItem.bind(cartApi),
  clearCart: cartApi.clearCart.bind(cartApi),
  updateCartItem: cartApi.updateCartItem.bind(cartApi),
  checkoutCart: cartApi.checkoutCart.bind(cartApi),

  // Order methods
  placeOrder: orderApi.placeOrder.bind(orderApi),
  cancelOrder: orderApi.cancelOrder.bind(orderApi),
  getUserOrders: orderApi.getUserOrders.bind(orderApi),
  getUserOrdersHistoryDto: orderApi.getUserOrdersHistoryDto.bind(orderApi),
  getOrderDetails: orderApi.getOrderDetails.bind(orderApi),
  confirmOrder: orderApi.confirmOrder.bind(orderApi),
  shipOrder: orderApi.shipOrder.bind(orderApi),
  updateTracking: orderApi.updateTracking.bind(orderApi),
  updateOrderRecipient: orderApi.updateOrderRecipient.bind(orderApi),
  markPaymentCollected: orderApi.markPaymentCollected.bind(orderApi),
  updatePaymentStatus: orderApi.updatePaymentStatus.bind(orderApi),
  moveToPending: orderApi.moveToPending.bind(orderApi),
  completeOrder: orderApi.completeOrder.bind(orderApi),
  markRefunded: orderApi.markRefunded.bind(orderApi),
  searchOrdersByTracking: orderApi.searchOrdersByTracking.bind(orderApi),
  getOrders: orderApi.getOrders.bind(orderApi),
  checkOrderReturnStatus: orderApi.checkOrderReturnStatus.bind(orderApi),
  createPaymentLink: orderApi.createPaymentLink.bind(orderApi),
  checkPaymentStatus: orderApi.checkPaymentStatus.bind(orderApi),

  // Brand methods
  getAllBrands: brandApi.getAllBrands.bind(brandApi),
  getBrandById: brandApi.getBrandById.bind(brandApi),
  createBrand: brandApi.createBrand.bind(brandApi),
  updateBrand: brandApi.updateBrand.bind(brandApi),
  deleteBrand: brandApi.deleteBrand.bind(brandApi),

  // Auth methods
  login: authApi.login.bind(authApi),
  registerCustomer: authApi.registerCustomer.bind(authApi),

  // Customer methods
  getCustomers: customerApi.getCustomers.bind(customerApi),
  getCustomer: customerApi.getCustomer.bind(customerApi),
  createCustomer: customerApi.createCustomer.bind(customerApi),
  updateCustomer: customerApi.updateCustomer.bind(customerApi),
  resetCustomerPassword: customerApi.resetCustomerPassword.bind(customerApi),
  deleteCustomer: customerApi.deleteCustomer.bind(customerApi),

  // Employee methods
  getEmployees: employeeApi.getEmployees.bind(employeeApi),
  getEmployee: employeeApi.getEmployee.bind(employeeApi),
  createEmployee: employeeApi.createEmployee.bind(employeeApi),
  updateEmployeeRole: employeeApi.updateEmployeeRole.bind(employeeApi),
  resetEmployeePassword: employeeApi.resetEmployeePassword.bind(employeeApi),
  deleteEmployee: employeeApi.deleteEmployee.bind(employeeApi),

  // Review methods
  createReview: reviewApi.createReview.bind(reviewApi),

  // Return methods
  getAllReturns: returnApi.getAllReturns.bind(returnApi),
  getPendingReturns: returnApi.getPendingReturns.bind(returnApi),
  createReturn: returnApi.createReturn.bind(returnApi),
  approveReturn: returnApi.approveReturn.bind(returnApi),
  confirmRefund: returnApi.confirmRefund.bind(returnApi),
  rejectReturn: returnApi.rejectReturn.bind(returnApi),

  // Category methods
  getAllCategories: categoryApi.getAllCategories.bind(categoryApi),
  getCategoryById: categoryApi.getCategoryById.bind(categoryApi),
  createCategory: categoryApi.createCategory.bind(categoryApi),
  updateCategory: categoryApi.updateCategory.bind(categoryApi),
  deleteCategory: categoryApi.deleteCategory.bind(categoryApi),

  // Review admin methods
  getAllReviews: reviewAdminApi.getAllReviews.bind(reviewAdminApi),
  getReviewsByProduct: reviewAdminApi.getReviewsByProduct.bind(reviewAdminApi),
  deleteReview: reviewAdminApi.deleteReview.bind(reviewAdminApi),

  // Campaign methods
  getActiveCampaign: campaignApi.getActiveCampaign.bind(campaignApi),
  getAllCampaigns: campaignApi.getAllCampaigns.bind(campaignApi),
  getCampaignById: campaignApi.getCampaignById.bind(campaignApi),
  createCampaign: campaignApi.createCampaign.bind(campaignApi),
  updateCampaign: campaignApi.updateCampaign.bind(campaignApi),
  deleteCampaign: campaignApi.deleteCampaign.bind(campaignApi),
  setCampaignProducts: campaignApi.setCampaignProducts.bind(campaignApi),

   // Kho methods
   importPreview: khoApi.importPreview.bind(khoApi),
   getPreview: khoApi.getPreview.bind(khoApi),
   updateKhoRow: khoApi.updateRow.bind(khoApi),
   deleteKhoRow: khoApi.deleteRow.bind(khoApi),
   addKhoRow: khoApi.addRow.bind(khoApi),
   confirmImport: khoApi.confirmImport.bind(khoApi),
   listPhieuNhap: khoApi.listPhieuNhap.bind(khoApi),
   getPhieuNhap: khoApi.getPhieuNhap.bind(khoApi),
   getBienDong: khoApi.getBienDong.bind(khoApi),
   getBanCham: khoApi.getBanCham.bind(khoApi),
   getNearExpiryProducts: khoApi.getNearExpiryProducts.bind(khoApi),
  // PO Workflow
  khoGetPoChoKiemTra: khoApi.getPoChoKiemTra.bind(khoApi),
  khoGetPoChoAdminDuyet: khoApi.getPoChoAdminDuyet.bind(khoApi),
  khoXacNhan: khoApi.khoXacNhan.bind(khoApi),
  khoAdminDuyetCuoi: khoApi.adminDuyetCuoi.bind(khoApi),
  khoAdminTuChoi: khoApi.adminTuChoi.bind(khoApi),
  khoValidateHSD: khoApi.validateHSD.bind(khoApi),
  khoGetLoHang: khoApi.getLoHang.bind(khoApi),

  // Procurement (Đấu thầu) methods
  procurementGetOpen: procurementApi.getOpenRequests.bind(procurementApi),
  procurementGetPublicDetail: procurementApi.getPublicDetail.bind(procurementApi),
  procurementSubmitOffer: procurementApi.submitOffer.bind(procurementApi),
  procurementGetAll: procurementApi.getAllRequests.bind(procurementApi),
  procurementGetDetail: procurementApi.getDetail.bind(procurementApi),
  procurementGetLowStock: procurementApi.getLowStock.bind(procurementApi),
  procurementCreate: procurementApi.createRequest.bind(procurementApi),
  procurementGetOffers: procurementApi.getOffers.bind(procurementApi),
  procurementChooseOffer: procurementApi.chooseOffer.bind(procurementApi),
  // Sản phẩm đề xuất (NCC đề xuất, Admin duyệt)
  procurementSubmitProposedProduct: procurementApi.submitProposedProduct.bind(procurementApi),
  procurementGetAllProposedProducts: procurementApi.getAllProposedProducts.bind(procurementApi),
  procurementGetProposedProductsOfRequest: procurementApi.getProposedProductsOfRequest.bind(procurementApi),
  procurementApproveProposedProduct: procurementApi.approveProposedProduct.bind(procurementApi),
  procurementRejectProposedProduct: procurementApi.rejectProposedProduct.bind(procurementApi),

  // Đề xuất sản phẩm độc lập (NCC tự đề xuất không cần phiếu gọi thầu)
  procurementSubmitIndependentProposal: procurementApi.submitIndependentProposal.bind(procurementApi),
  procurementGetIndependentProposals: procurementApi.getIndependentProposals.bind(procurementApi),
  // Đề xuất hàng loạt qua Excel/CSV
  procurementBulkPreview: procurementApi.bulkPreview.bind(procurementApi),
  procurementBulkConfirm: procurementApi.bulkConfirm.bind(procurementApi),
  // Duyệt hàng loạt
  procurementBulkApprove: procurementApi.bulkApprove.bind(procurementApi),

  // User profile methods
  getProfile: userApi.getProfile.bind(userApi),
  updateUserProfile: userApi.updateProfile.bind(userApi),
  changeUserPassword: userApi.changePassword.bind(userApi),

};

export default api;

// Also export individual APIs for more granular imports
export {
  productApi,
  cartApi,
  orderApi,
  authApi,
  customerApi,
  employeeApi,
  reviewApi,
  returnApi,
  brandApi,
  categoryApi,
  reviewAdminApi,
  campaignApi,
  khoApi,
  procurementApi,
  dashboardApi,
  reportApi,
  userApi
};
