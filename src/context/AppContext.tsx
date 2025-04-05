"use client";
import { Address, Order, Payment, Product } from "@/types/types";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";
import { useAuthContext } from "./AuthContext";
import { AppContextState } from "@/types/states";
import { getUserCart, manageCartFS } from "@/functions/cart";
import { getProductsFS } from "@/functions/products";
import { getAddressesFS } from "@/functions/addresses";

export const AppContext = createContext<AppContextState | null>(null);

export const AppContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const currency = process.env.NEXT_PUBLIC_CURRENCY;
  const router = useRouter();
  const { authUser } = useAuthContext();
  const [products, setProducts] = useState<Product[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [cartItems, setCartItems] = useState<
    { product: Product; quantity: number }[]
  >([]);
  const [order, setOrder] = useState<Order>({
    id: "",
    userId: "",
    products: [],
    subTotal: 0,
    discount: 0,
    shippingFee: 0,
    promoId: "",
    total: 0,
    address: {} as Address,
    status: "pending",
    payment: {} as Payment,
  });

  useEffect(() => {
    const fetchProductData = async () => {
      const allProducts = await getProductsFS();
      setProducts(allProducts);
    };

    fetchProductData();
  }, []);

  useEffect(() => {
    if (!authUser) return;

    const fetchCart = async () => {
      const cart = await getUserCart(authUser.id);
      setCartItems(cart);
    };

    const fetchAddresses = async () => {
      if (authUser) {
        const allAddresses = await getAddressesFS(authUser?.id);
        setAddresses(allAddresses);
      }
    };

    fetchCart();
    fetchAddresses();
  }, [authUser]);

  const getCartCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
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
        order,
        setOrder,
        products,
        setProducts,
        addresses,
        setAddresses,
        cartItems,
        updateCart,
        setCartItems,
        getCartCount,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = (): AppContextState => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppContextProvider");
  }
  return context;
};
