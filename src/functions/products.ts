import { db } from "@/lib/firebase";
import { Product } from "@/types/types";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";

export const getProductsFS = async (): Promise<Product[]> => {
  const products: Product[] = [];

  try {
    const querySnapshot = await getDocs(collection(db, "products"));

    querySnapshot.docs.forEach((doc) => {
      const productData = doc.data();
      if (productData) {
        products.push({ id: doc.id, ...productData } as Product);
      } else {
        console.warn(`Document with ID: ${doc.id} contains no data`);
      }
    });

    return products;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
};

export const addProductFS = async (product: Product) => {
  try {
    const productCollection = collection(db, "products");
    const productWithTimestamp = {
      ...product,
      createdAt: serverTimestamp(),
    };
    await addDoc(productCollection, productWithTimestamp);
    console.log("Product added successfully");
  } catch (error) {
    console.error("Error adding product: ", error);
  }
};

export const addMultipleProductFS = async (products: Product[]) => {
  try {
    const productCollection = collection(db, "products");
    const batchPromises = products.map(async (product) => {
      const productWithTimestamp = {
        ...product,
        createdAt: serverTimestamp(),
      };
      return addDoc(productCollection, productWithTimestamp);
    });
    await Promise.all(batchPromises);
    console.log("Products added successfully");
  } catch (error) {
    console.error("Error adding products: ", error);
  }
};

export const updateProductFS = async (
  productId: string,
  updatedData: Product
) => {
  try {
    const productRef = doc(db, "products", productId);
    await updateDoc(productRef, {
      ...updatedData,
      updatedAt: serverTimestamp(),
    });
    console.log("Product updated successfully");
  } catch (error) {
    console.error("Error updating product: ", error);
  }
};

export const deleteProductFS = async (productId: string) => {
  try {
    const productRef = doc(db, "products", productId);
    await deleteDoc(productRef);
    console.log("Product deleted successfully");
  } catch (error) {
    console.error("Error deleting product: ", error);
  }
};
