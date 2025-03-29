export interface User {
  id: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  name?: string;
  phone?: string;
  address?: string;
  cart?: {
    product: Product;
    quantity: number;
  }[];
  wishlist?: Product[];
  orders?: string[];
  address?: Address[];
  createdAt?: number;
}

export interface Address {
  type: "billing" | "shipping";
  phone: number[];
  street: string;
}

export interface Product {
  id?: string;
  name: string;
  description: string;
  price: number;
  offerPrice: number;
  images: string[];
  category: string;
  stock: number;
  createdAt?: number;
}

export interface Order {
  id?: string;
  userId: string;
  items: { productId: string; quantity: number }[];
  totalAmount: number;
  status: "pending" | "shipped" | "delivered" | "cancelled";
  createdAt?: number;
}
