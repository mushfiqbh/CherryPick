import { db } from "@/lib/firebase";
import { Product } from "@/types/types";
import {
  deleteField,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";

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

export const manageCartFS = async (userId: string, productId: string, quantity: number) => {
  try {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      console.error("User not found");
      return;
    }

    if (quantity === 0) {
      // Remove product from cart
      await updateDoc(userRef, {
        [`cart.${productId}`]: deleteField(),
      });
      console.log("Product removed from cart");
    } else {
      // Update quantity or add product if not exist
      await updateDoc(userRef, {
        [`cart.${productId}`]: quantity,
      });
      console.log("Cart updated successfully");
    }
  } catch (error) {
    console.error("Error managing cart:", error);
  }
};
