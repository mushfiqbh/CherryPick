import { Timestamp } from "firebase/firestore";

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
  orderIds: string[];
  wishlist?: Product[];
  orders?: string[];
  addresses?: string[];
  createdAt?: Date;
  updatedAt?: Date;
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
  updatedAt?: Date;
}

export interface Address {
  id: string;
  userId: string;
  fullName: string;
  phoneNumber: string;
  area: string;
  upazila: string;
  district: string;
  division: string;
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

export interface Payment {
  cashPay: number;
  advancePay: number;
  status: "COD" | "paid" | "unpaid" | "pending" | "failed";
  senderNumber?: string;
  sentTime?: string;
  method: string;
  type: "full" | "partial";
}

export interface Order {
  id: string;
  userId: string;
  products: {
    product: Product;
    quantity: number;
  }[];
  subTotal: number;
  discount: number;
  shippingFee: number;
  promoId: string;
  total: number;
  address: Address;
  payment: Payment;
  marchant?: {
    name: string;
    phoneNumber: string;
    email: string;
  };
  status:
    | "pending"
    | "shipped"
    | "onrider"
    | "delivered"
    | "canceled"
    | "unpaid"
    | "declined";
  createdAt?: Timestamp;
  updatedAt?: Date;
}

export interface Division {
  id: string;
  name: string;
}

export interface District {
  id: string;
  name: string;
}

export interface Upazila {
  id: string;
  name: string;
}
