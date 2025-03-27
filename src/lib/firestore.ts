import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc,
  getDoc,
  increment,
  deleteField,
  writeBatch,
} from "firebase/firestore";
import { db } from "./firebase";
import { User, Product } from "@/types/types";

export const addUser = async (user: User) => {
  try {
    await addDoc(collection(db, "users"), user);
  } catch (error) {
    console.error("Error adding user:", error);
  }
};

export const addProductFS = async (product: Product) => {
  try {
    await addDoc(collection(db, "products"), product);
  } catch (error) {
    console.error("Error adding product:", error);
  }
};

export const addMultipleProductsFS = async (products: Product[]) => {
  try {
    const batch = writeBatch(db);
    const productsCollection = collection(db, "products");

    products.forEach((product) => {
      const newDocRef = doc(productsCollection);
      batch.set(newDocRef, product);
    });

    await batch.commit();
    console.log("Products added successfully!");
  } catch (error) {
    console.error("Error adding multiple products:", error);
  }
};

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

export const getUsers = async (): Promise<User[]> => {
  const querySnapshot = await getDocs(collection(db, "users"));
  return querySnapshot.docs.map((doc) => doc.data()) as User[];
};

export const getProducts = async (): Promise<Product[]> => {
  const querySnapshot = await getDocs(collection(db, "products"));
  return querySnapshot.docs.map((doc) => doc.data()) as Product[];
};
