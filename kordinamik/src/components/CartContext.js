import React, { createContext, useContext, useEffect, useState } from "react";
import { useDealer } from "./DealerContext";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

const STORAGE_KEY = "dealerCart";

export const CartProvider = ({ children }) => {
  const { dealer, loading } = useDealer();
  const [cartItems, setCartItems] = useState([]);

  // Load stored cart for current dealer
  useEffect(() => {
    if (loading) return;

    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (!parsed.dealerId || parsed.dealerId === dealer?.id) {
          setCartItems(parsed.items || []);
        } else {
          setCartItems([]);
        }
      } catch (err) {
        console.error("Cart parse error", err);
        setCartItems([]);
      }
    } else if (dealer) {
      setCartItems([]);
    }
  }, [dealer?.id, loading]);

  // Persist cart
  useEffect(() => {
    if (loading) return;

    if (!dealer) {
      localStorage.removeItem(STORAGE_KEY);
      return;
    }

    const payload = {
      dealerId: dealer?.id || null,
      items: cartItems,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  }, [cartItems, dealer?.id, loading]);

  const addToCart = (product, quantity = 1) => {
    if (!product?.id) return;
    const normalizedQuantity = Math.max(1, parseInt(quantity, 10) || 1);
    const price = Number(product.price || 0);
    const imageFromList = product.image || product.cover_photo;
    const imageFromGallery =
      product.images?.find((img) => img.is_primary)?.image_url ||
      product.images?.[0]?.image_url ||
      null;
    const image = imageFromList || imageFromGallery || null;

    setCartItems((prev) => {
      const existing = prev.find((item) => item.productId === product.id);
      if (existing) {
        return prev.map((item) =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + normalizedQuantity }
            : item
        );
      }

      return [
        ...prev,
        {
          productId: product.id,
          name: product.name,
          model: product.model,
          price,
          quantity: normalizedQuantity,
          image,
        },
      ];
    });
  };

  const removeFromCart = (productId) => {
    setCartItems((prev) => prev.filter((item) => item.productId !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    const normalizedQuantity = Math.max(1, parseInt(quantity, 10) || 1);
    setCartItems((prev) =>
      prev.map((item) =>
        item.productId === productId ? { ...item, quantity: normalizedQuantity } : item
      )
    );
  };

  const clearCart = () => setCartItems([]);

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;

