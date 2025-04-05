import { Dispatch, SetStateAction } from "react";
import { AppRouterInstance } from "next/navigation";
import { User, Product, Order, Address } from "@/types/types";

export interface AuthContextState {
  authUser: User | null;
  setAuthUser: Dispatch<SetStateAction<User | null>>;
  signInWithGoogle: () => void;
  signInWithApple: () => void;
  logout: () => void;
}

interface AppContextState {
  currency: string | undefined;
  router: AppRouterInstance;
  order: Order;
  setOrder: Dispatch<SetStateAction<Order>>;
  products: Product[];
  setProducts: Dispatch<SetStateAction<Product[]>>;
  addresses: Address[];
  setAddresses: Dispatch<SetStateAction<Address[]>>;
  cartItems: { product: Product; quantity: number }[];
  setCartItems: Dispatch<
    SetStateAction<{ product: Product; quantity: number }[]>
  >;
  getCartCount: () => number;
  updateCart: (productId: string, quantity: number) => void;
}

export interface AdminContextState {
  admin: User | null;
  setAdmin: Dispatch<SetStateAction<User | null>>;
  isSeller: boolean;
  setIsSeller: Dispatch<SetStateAction<boolean>>;
}
