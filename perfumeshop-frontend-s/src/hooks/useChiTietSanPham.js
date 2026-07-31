import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import {
  formatCartItem,
  createBrandMap
} from '../utils/productUtils';
// file này để lấy dữ liệu chi tiết sản phẩm, tránh gọi API nhiều lần
const useChiTietSanPham = (productId) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [brandDetails, setBrandDetails] = useState({});
  const [cartLoading, setCartLoading] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);

  // Dùng API getRelatedProducts của BE
  const fetchRelatedProducts = useCallback(async (productId) => {
    try {
      const related = await api.getRelatedProducts(productId, 4);
      setRelatedProducts(related);
    } catch (err) {
      console.error('Error fetching related products:', err);
      setRelatedProducts([]);
    }
  }, []);
// Dùng API getProductById[of BE] thay vì fetch ALL + filter client-side
  const fetchProductDetail = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const productData = await api.getProductById(parseInt(productId));
      setProduct(productData);
      // Fetch related products song song bằng API chuyên dụng
      await fetchRelatedProducts(productId);
    } catch (err) {
      setError('Không thể tải thông tin sản phẩm');
      console.error('Error fetching product:', err);
    } finally {
      setLoading(false);
    }
  }, [productId, fetchRelatedProducts]);

  useEffect(() => {
    fetchProductDetail();
    fetchBrands();
  }, [fetchProductDetail]);
// Dùng API getBrands của BE để lấy danh sách thương hiệu
  const fetchBrands = async () => {
    try {
      const brands = await api.getBrands();
      const brandMap = createBrandMap(brands);
      setBrandDetails(brandMap);
    } catch (err) {
      console.error('Error fetching brands:', err);
    }
  };
// Xử lý thêm vào giỏ hàng hoặc mua ngay
  const processCartAction = async (actionType) => {
    if (!user) {
      alert('Vui lòng đăng nhập để thực hiện thao tác này');
      return;
    }

    if (quantity > product.so_luong_ton_kho) {
      alert('Số lượng vượt quá tồn kho');
      return;
    }

    try {
      setCartLoading(true);

      if (actionType === 'add_to_cart') {
        const cartItem = formatCartItem(product, quantity);
        cartItem.userId = user.id_nguoi_dung;

        await api.addCartItem(cartItem);
        alert('Đã thêm sản phẩm vào giỏ hàng!');
      } else if (actionType === 'buy_now') {
        const cartItem = formatCartItem(product, quantity);
        cartItem.userId = user.id_nguoi_dung;

        await api.addCartItem(cartItem);
        navigate('/thanh-toan');
      }
    } catch (error) {
      console.error('Cart action error:', error);
      alert('Không thể thực hiện thao tác: ' + error.message);
    } finally {
      setCartLoading(false);
    }
  };
// Cập nhật số lượng sản phẩm, đảm bảo không vượt quá tồn kho và không nhỏ hơn 1
  const updateQuantity = (newQuantity) => {
    const maxStock = product?.so_luong_ton_kho || 999;
    const validatedQuantity = Math.max(1, Math.min(newQuantity, maxStock));
    setQuantity(validatedQuantity);
  };
// Tăng số lượng sản phẩm
  const incrementQuantity = () => {
    updateQuantity(quantity + 1);
  };
// Giảm số lượng sản phẩm
  const decrementQuantity = () => {
    updateQuantity(quantity - 1);
  };
// Lấy trạng thái tồn kho của sản phẩm để hiển thị thông tin cho người dùng
  const getStockStatus = () => {
    if (!product) return { status: 'loading', label: 'Đang tải...' };
    if (product.so_luong_ton_kho === 0) return { status: 'out_of_stock', label: 'Hết hàng' };
    if (product.so_luong_ton_kho < 10) return { status: 'low_stock', label: 'Sắp hết hàng' };
    return { status: 'in_stock', label: 'Còn hàng' };
  };
// Lấy tên thương hiệu dựa trên id_thuong_hieu của sản phẩm, nếu không có thì trả về 'N/A'
  const getBrandName = () => {
    return brandDetails[product?.id_thuong_hieu] || 'N/A';
  };

  return {
    product,
    loading,
    error,
    quantity,
    brandDetails,
    cartLoading,
    relatedProducts,
    processCartAction,
    updateQuantity,
    incrementQuantity,
    decrementQuantity,
    getStockStatus,
    getBrandName,
    fetchProductDetail
  };
};

export default useChiTietSanPham;