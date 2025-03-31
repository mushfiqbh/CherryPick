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

const productsCollection = collection(db, "products");

export const getProductsFS = async (): Promise<Product[]> => {
  const products: Product[] = [];

  try {
    const querySnapshot = await getDocs(productsCollection);

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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, ...rest } = product;
    const productWithTimestamp = {
      ...rest,
      createdAt: serverTimestamp(),
    };
    await addDoc(productsCollection, productWithTimestamp);
    console.log("Product added successfully");
  } catch (error) {
    console.error("Error adding product: ", error);
  }
};

export const addMultipleProductFS = async (products: Product[]) => {
  try {
    const batchPromises = products.map(async (product) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id, ...rest } = product;
      const productWithTimestamp = {
        ...rest,
        createdAt: serverTimestamp(),
      };
      return addDoc(productsCollection, productWithTimestamp);
    });
    await Promise.all(batchPromises);
    console.log("Products added successfully");
  } catch (error) {
    console.error("Error adding products: ", error);
  }
};

export const updateProductFS = async (product: Product) => {
  try {
    const { id, ...rest } = product;
    const productRef = doc(productsCollection, id);
    await updateDoc(productRef, {
      ...rest,
      updatedAt: serverTimestamp(),
    });
    console.log("Product updated successfully");
  } catch (error) {
    console.error("Error updating product: ", error);
  }
};

export const deleteProductFS = async (productId: string) => {
  try {
    const productRef = doc(productsCollection, productId);
    await deleteDoc(productRef);
    console.log("Product deleted successfully");
  } catch (error) {
    console.error("Error deleting product: ", error);
  }
};
