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
  isSeller: boolean;
  setIsSeller: React.Dispatch<React.SetStateAction<boolean>>;
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  cartItems: { product: Product; quantity: number }[];
  setCartItems: React.Dispatch<
    React.SetStateAction<{ product: Product; quantity: number }[]>
  >;
  addToCart: (itemId: string) => Promise<void>;
  updateCartItemQuantity: (itemId: string, quantity: number) => Promise<void>;
  getCartCount: () => number;
  getCartAmount: () => number;
}
