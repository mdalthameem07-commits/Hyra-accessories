import { createContext, useContext, useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";
import api from "../api/axios.js";
import { useAuth } from "./AuthContext.jsx";

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    if (!user) {
      setCart([]);
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.get("/cart");
      setCart(data.cart);
    } catch (err) {
      // silent fail on cart fetch
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = async (productId, quantity = 1, variant = "") => {
    if (!user) {
      toast.error("Please sign in to add items to your bag");
      return false;
    }
    try {
      const { data } = await api.post("/cart", { productId, quantity, variant });
      setCart(data.cart);
      toast.success("Added to your bag");
      return true;
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not add to bag");
      return false;
    }
  };

  const updateQuantity = async (productId, quantity, variant = "") => {
    try {
      const { data } = await api.put(`/cart/${productId}`, { quantity, variant });
      setCart(data.cart);
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not update quantity");
    }
  };

  const removeFromCart = async (productId) => {
    try {
      const { data } = await api.delete(`/cart/${productId}`);
      setCart(data.cart);
      toast.success("Removed from bag");
    } catch (err) {
      toast.error("Could not remove item");
    }
  };

  const clearCart = async () => {
    try {
      await api.delete("/cart");
      setCart([]);
    } catch (err) {
      // silent
    }
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce((sum, item) => {
    const price = item.product?.discountPrice > 0 ? item.product.discountPrice : item.product?.price || 0;
    return sum + price * item.quantity;
  }, 0);

  return (
    <CartContext.Provider
      value={{ cart, loading, addToCart, updateQuantity, removeFromCart, clearCart, cartCount, cartTotal, fetchCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
