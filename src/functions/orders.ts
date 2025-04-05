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
  arrayUnion,
  getDoc,
} from "firebase/firestore";

const ordersCollection = collection(db, "orders");

export const getOrdersFS = async (orderIds?: string[]): Promise<Order[]> => {
  const orders: Order[] = [];

  try {
    if (!orderIds) {
      const querySnapshot = await getDocs(ordersCollection);

      querySnapshot.docs.forEach((doc) => {
        const orderData = doc.data();
        if (orderData) {
          orders.push({ id: doc.id, ...orderData } as Order);
        } else {
          console.warn(`Document with ID: ${doc.id} contains no data`);
        }
      });
    } else {
      const orderFetches = orderIds.map(async (id) => {
        const orderDoc = await getDoc(doc(ordersCollection, id));
        const orderData = orderDoc.data();
        if (orderData) {
          orders.push({ id: orderDoc.id, ...orderData } as Order);
        } else {
          console.warn(`Order with ID ${id} not found.`);
        }
      });

      await Promise.all(orderFetches);
    }

    return orders;
  } catch (error) {
    console.error("Error getting orders:", error);
    return [];
  }
};

export const createOrderFS = async (order: Order, userId: string) => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, ...rest } = order;

    const orderWithTimestamp = {
      ...rest,
      createdAt: serverTimestamp(),
    };

    const orderRef = await addDoc(ordersCollection, orderWithTimestamp);
    const userRef = doc(collection(db, "users"), userId);

    await updateDoc(userRef, {
      orderlist: arrayUnion(orderRef.id),
    });

    return orderRef.id;
  } catch (error) {
    console.error("Error creating order:", error);
    return null;
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
