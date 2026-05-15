import { useState, useEffect } from 'react';
import { CART_STORAGE_KEY } from '../utils/posConstants';

const usePosCart = () => {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  }, [cart]);

  // Add product to cart with database field names
  const addToCart = (product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id_san_pham === product.id_san_pham);
      if (existingItem && existingItem.quantity < product.so_luong_ton_kho) {
        return prevCart.map(item =>
          item.id_san_pham === product.id_san_pham
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else if (!existingItem) {
        return [...prevCart, { ...product, quantity: 1 }];
      }
      return prevCart;
    });
  };

  // Update quantity in cart
  const updateQuantity = (id_san_pham, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(id_san_pham);
      return;
    }

    setCart(prevCart =>
      prevCart.map(item => {
        if (item.id_san_pham === id_san_pham) {
          const maxQuantity = item.so_luong_ton_kho || 10;
          return {
            ...item,
            quantity: Math.min(newQuantity, maxQuantity)
          };
        }
        return item;
      })
    );
  };

  // Remove item from cart
  const removeFromCart = (id_san_pham) => {
    setCart(prevCart => prevCart.filter(item => item.id_san_pham !== id_san_pham));
  };

  // Clear cart
  const clearCart = () => {
    setCart([]);
    localStorage.removeItem(CART_STORAGE_KEY);
  };

  // Get cart totals
  const getCartTotals = () => {
    const subtotal = cart.reduce((sum, item) => sum + (item.gia_ban * item.quantity), 0);
    const tax = subtotal * 0.1; // 10% tax
    const total = subtotal + tax;

    return { subtotal, tax, total };
  };

  return {
    cart,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getCartTotals,
    cartItemCount: cart.length
  };
};

export default usePosCart;


