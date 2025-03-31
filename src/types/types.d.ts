export interface User {
  id: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  role: "buyer" | "seller";
  phoneNumber?: string;
  cart?: {
    product: Product;
    quantity: number;
  }[];
  wishlist?: Product[];
  orders?: string[];
  addresses?: string[];
  createdAt?: Date;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  offerPrice: number;
  images: string[];
  category: string;
  stock: number;
  createdAt?: Date;
}

export interface Address {
  id: string;
  userId: string;
  fullName: string;
  phoneNumber: string;
  street: string;
  city: string;
  state?: string;
  country: string;
  postalCode: string;
  isDefault?: boolean;
}

export interface PromoCode {
  id: string;
  code: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  validFrom: Date;
  validTo: Date;
  usageLimit?: number;
  usedCount?: number;
  minOrderValue: number;
  applicableUsers?: string[];
  applicableProducts?: string[];
  status: "active" | "expired";
}

export interface Order {
  id?: string;
  userId: string;
  products: {
    productId: string;
    quantity: number;
    price: number;
  }[];
  subTotal: number;
  discount?: number;
  promoCode?: string;
  shippingFee: number;
  total: number;
  address: Address;
  status: "pending" | "shipped" | "delivered" | "canceled";
  createdAt: Date;
}
