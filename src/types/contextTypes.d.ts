import { AppRouterInstance } from "next/navigation";
import { Product } from "@/types/types";

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
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  cartItems: { product: Product; quantity: number }[];
  setCartItems: React.Dispatch<
    React.SetStateAction<{ product: Product; quantity: number }[]>
  >;
  getCartCount: () => number;
  getCartAmount: () => number;
  updateCart: (productId: string, quantity: number) => void;
}

export interface AdminContextState {
  admin: User | null;
  setAdmin: React.Dispatch<React.SetStateAction<User>>;
  isSeller: boolean;
  setIsSeller: React.Dispatch<React.SetStateAction<boolean>>;
}
