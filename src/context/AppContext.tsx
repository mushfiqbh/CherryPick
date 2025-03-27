"use client";
import { Product } from "@/types/types";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";
import { useAuthContext } from "./AuthContext";
import {
  getUserCart,
  addToCartFS,
  updateCartQuantityFS,
  removeFromCartFS,
  getProducts,
} from "@/lib/firestore";
import { AppContextState } from "@/types/contextTypes";

export const AppContext = createContext<AppContextState | null>(null);

export const useAppContext = (): AppContextState => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppContextProvider");
  }
  return context;
};

export const AppContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const currency = process.env.NEXT_PUBLIC_CURRENCY;
  const router = useRouter();
  const { authUser } = useAuthContext();

  const [products, setProducts] = useState<Product[]>([]);
  const [isSeller, setIsSeller] = useState<boolean>(true);
  const [cartItems, setCartItems] = useState<
    { product: Product; quantity: number }[]
  >([]);

  useEffect(() => {
    if (!authUser) return;

    const fetchCart = async () => {
      const cart = await getUserCart(authUser.id);
      setCartItems(cart);
    };

    fetchCart();
  }, [authUser]);

  useEffect(() => {
    const fetchProductData = async () => {
      const products = await getProducts();

      setProducts(products);
    };

    fetchProductData();
  }, []);

  const addToCart = async (productId: string) => {
    setCartItems((prevCart) => {
      const existingItem = prevCart.find(
        (item) => item.product.id === productId
      );
      if (existingItem) {
        updateCartQuantityFS(authUser.id, productId, 1);
        return prevCart.map((item) =>
          item.product.id === productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        addToCartFS(authUser.id, productId); // sync to firestore
        const product = products.find((p) => p.id === productId);
        return product ? [...prevCart, { product, quantity: 1 }] : prevCart;
      }
    });
  };

  const updateCartItemQuantity = async (productId: string, inc: number) => {
    if (!authUser) return;
    updateCartQuantityFS(authUser.id, productId, inc);

    setCartItems((prevCart) => {
      const updatedCart = prevCart.map((item) =>
        item.product.id === productId
          ? { ...item, quantity: item.quantity + inc }
          : item
      );
      return updatedCart;
    });
  };

  const removeFromCart = async (productId: string) => {
    if (!authUser) return;
    removeFromCartFS(authUser.id, productId);

    setCartItems((prevCart) => {
      const updatedCart = prevCart.filter(
        (item) => item.product.id !== productId
      );
      return updatedCart;
    });
  };

  const getCartCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getCartAmount = () => {
    return (
      Math.floor(
        cartItems.reduce((total, item) => {
          const price = item.product.offerPrice ?? item.product.price;
          return total + price * item.quantity;
        }, 0) * 100
      ) / 100
    );
  };

  const value = {
    currency,
    router,
    isSeller,
    setIsSeller,
    products,
    setProducts,
    cartItems,
    setCartItems,
    addToCart,
    removeFromCart,
    updateCartItemQuantity,
    getCartCount,
    getCartAmount,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
