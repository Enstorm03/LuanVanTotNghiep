import React from 'react';
import OrderProductItem from './OrderProductItem';
// file này để hiển thị danh sách sản phẩm trong đơn hàng trên trang chi tiết đơn hàng, tránh gọi API nhiều lần
const OrderProductsList = ({ order, productDetails, brandDetails, pickList = [] }) => {
  // Determine which data structure to use
  let itemsToDisplay = [];

  if (order.chiTiet && order.chiTiet.length > 0) {
    itemsToDisplay = order.chiTiet;
  } else if (order.chiTietDonHangs && order.chiTietDonHangs.length > 0) {
    itemsToDisplay = order.chiTietDonHangs;
  }

  // Helper function to find pick list for a product
  const findPickListForProduct = (sanPhamId) => {
    if (!pickList || pickList.length === 0) return [];
    const found = pickList.find(p => p.idSanPham === sanPhamId);
    if (!found) return [];
    
    // Transform to match PickListDisplay expected format
    return [{
      tenSanPham: found.tenSanPham,
      details: (found.batchItems || []).map(batch => ({
        soLuong: batch.soLuongLay,
        soLo: batch.soLo,
        hanSuDung: batch.hanSuDung,
        ghiChu: batch.ghiChu
      }))
    }];
  };

  return (
    <div className="rounded-xl border bg-surface-light text-card-foreground shadow border-border-light dark:border-border-dark dark:bg-surface-dark p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold">Các sản phẩm</h3>
        
      </div>
      
      <div className="space-y-4">
         

  

        {itemsToDisplay.length > 0 ? (
          itemsToDisplay.map((item, index) => {
            const sanPhamId = item.sanPhamId || item.idSanPham;
            const pickListForItem = findPickListForProduct(sanPhamId);
            
            return (
              <OrderProductItem
                key={`order-item-${index}`}
                item={item}
                productDetails={productDetails}
                brandDetails={brandDetails}
                discountPercent={order.giamGiaHangLoat || 0}
                pickListData={pickListForItem}
              />
            );
          })
        ) : (
          <div className="text-center py-8">
            <span className="material-symbols-outlined text-4xl text-gray-300 mb-2 block">inventory_2</span>
            <p className="text-text-subtle-light dark:text-text-subtle-dark">
              Không có sản phẩm nào trong đơn hàng này.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderProductsList;
