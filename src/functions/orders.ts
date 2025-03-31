import { db } from "@/lib/firebase";
import { Order } from "@/types/types";
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";

const ordersCollection = collection(db, "orders");

export const getOrdersFS = async (): Promise<Order[]> => {
  const orders: Order[] = [];

  try {
    const querySnapshot = await getDocs(ordersCollection);

    querySnapshot.docs.forEach((doc) => {
      const orderData = doc.data();
      if (orderData) {
        orders.push({ id: doc.id, ...orderData } as Order);
      } else {
        console.warn(`Document with ID: ${doc.id} contains no data`);
      }
    });

    return orders;
  } catch (error) {
    console.error("Error getting orders:", error);
    return [];
  }
};

export const createOrderFS = async (order: Order) => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, ...rest } = order;
    const orderWithTimestamp = {
      ...rest,
      createdAt: serverTimestamp(),
    };

    await addDoc(ordersCollection, orderWithTimestamp);
    console.log("Order created successfully");
  } catch (error) {
    console.error("Error creating order:", error);
  }
};

export const updateOrderFS = async (order: Order) => {
  try {
    const { id, ...rest } = order;
    const orderRef = doc(ordersCollection, id);
    await updateDoc(orderRef, {
      ...rest,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error updating order:", error);
  }
};

export const deleteOrderFS = async (orderId: string) => {
  try {
    const orderRef = doc(ordersCollection, orderId);
    await deleteDoc(orderRef);
  } catch (error) {
    console.error("Error deleting order:", error);
  }
};
