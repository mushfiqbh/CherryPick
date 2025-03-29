export interface User {
  id: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
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
  id?: string;
  code: string;
  discountType: "percentage" | "fixed";
  discountValue: number; // 10 (10% off) or 10 ($10 off)
  validFrom: Date;
  validTo: Date;
  usageLimit?: number; // Maximum times the promo can be used
  usedCount?: number; // Track usage count
  minOrderValue?: number; // Minimum order value required
  applicableUsers?: string[]; // Array of user IDs allowed
  status: "active" | "expired";
}

export interface ShippingFee {
  id?: string;
  countryCode: string;
  standard: number; // Standard shipping fee
  express: number; // Express shipping fee
  freeShippingThreshold: number; // Orders above this amount get free shipping
}

export interface Order {
  id?: string;
  userId: string;
  products: {
    productId: string;
    quantity: number;
    price: number; // Price at time of order
  }[];
  subTotal: number; // Before discounts and shipping
  discount?: number; // Discount applied
  promoCode?: string; // Applied promo code
  shippingFee: number;
  total: number; // Final total after all calculations
  address: Address;
  status: "pending" | "shipped" | "delivered" | "canceled";
  createdAt: Date;
}
