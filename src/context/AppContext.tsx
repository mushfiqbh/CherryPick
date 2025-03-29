"use client";
import { Product } from "@/types/types";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";
import { useAuthContext } from "./AuthContext";
import { AppContextState } from "@/types/contextTypes";
import { getUserCart, manageCartFS } from "@/functions/cart";
import { getProductsFS } from "@/functions/products";

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
      const products = await getProductsFS();
      setProducts(products);
    };

    fetchProductData();
  }, []);

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

  const updateCart = (productId: string, quantity: number) => {
    if (!authUser) return;

    // Fire and Forget
    manageCartFS(authUser.id, productId, quantity);

    setCartItems((prevCart) => {
      if (quantity === 0) {
        return prevCart.filter((item) => item.product.id !== productId);
      }
      const existingItem = prevCart.find(
        (item) => item.product.id === productId
      );
      if (existingItem) {
        return prevCart.map((item) =>
          item.product.id === productId ? { ...item, quantity } : item
        );
      }
      const product = products.find((p) => p.id === productId);
      return product ? [...prevCart, { product, quantity }] : prevCart;
    });
  };

  return (
    <AppContext.Provider
      value={{
        currency,
        router,
        products,
        setProducts,
        cartItems,
        updateCart,
        setCartItems,
        getCartCount,
        getCartAmount,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
