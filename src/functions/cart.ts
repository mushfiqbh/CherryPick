import { db } from "@/lib/firebase";
import { Product } from "@/types/types";
import { deleteField, doc, getDoc, increment, updateDoc } from "firebase/firestore";

export const addToCartFS = async (userId: string, productId: string) => {
  try {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      [`cart.${productId}`]: increment(1),
    });
  } catch (error) {
    console.error("Error adding product:", error);
  }
};

export const updateCartQuantityFS = async (
  userId: string,
  productId: string,
  inc: number
) => {
  try {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      [`cart.${productId}`]: increment(inc),
    });
  } catch (error) {
    console.error("Error adding product:", error);
  }
};

export const removeFromCartFS = async (userId: string, productId: string) => {
  try {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      await updateDoc(userRef, {
        [`cart.${productId}`]: deleteField(),
      });
    }
  } catch (error) {
    console.error("Error removing product from cart:", error);
  }
};

export const getUserCart = async (
  userId: string
): Promise<{ product: Product; quantity: number }[]> => {
  try {
    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      console.log("No such user found!");
      return [];
    }

    const cart = userDoc.data().cart || {}; // Ensure cart is an object
    const productIds = Object.keys(cart);

    if (productIds.length === 0) return []; // If cart is empty, return []

    // Fetch product details in parallel
    const productPromises = productIds.map(async (productId) => {
      const productRef = doc(db, "products", productId);
      const productDoc = await getDoc(productRef);
      return productDoc.exists()
        ? {
            product: { id: productId, ...productDoc.data() } as Product,
            quantity: cart[productId],
          }
        : null;
    });

    const cartItems = await Promise.all(productPromises);

    // Filter out any null values (products that don't exist)
    return cartItems.filter((item) => item !== null) as {
      product: Product;
      quantity: number;
    }[];
  } catch (error) {
    console.error("Error fetching user's cart:", error);
    return [];
  }
};
