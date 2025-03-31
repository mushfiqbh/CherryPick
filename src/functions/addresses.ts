import { db } from "@/lib/firebase";
import { Address } from "@/types/types";
import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from "firebase/firestore";

const addressesCollection = collection(db, "addresses");

export const addAddressFS = async (userId: string, address: Address) => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, ...rest } = address;
    const docRef = await addDoc(addressesCollection, { ...rest, userId });

    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      addresses: arrayUnion(docRef.id),
    });

    return docRef.id;
  } catch (error) {
    console.error("Error adding address: ", error);
  }
};

export const removeAddressFS = async (userId: string, addressId: string) => {
  try {
    const addressRef = doc(addressesCollection, addressId);
    await deleteDoc(addressRef);

    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      addresses: arrayRemove(addressId),
    });

    console.log("Address removed successfully");
  } catch (error) {
    console.error("Error removing address: ", error);
  }
};

export const updateAddressFS = async (address: Address) => {
  try {
    const { id, ...rest } = address;
    const addressRef = doc(addressesCollection, id);
    await setDoc(addressRef, rest);
    console.log("Address updated successfully");
  } catch (error) {
    console.error("Error updating address: ", error);
  }
};

export const getAddressesFS = async (userId: string) => {
  try {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      throw new Error("User not found");
    }

    const addressIds = userSnap.data().addresses || [];
    if (addressIds.length === 0) return [];

    const addressPromises = addressIds.map((id: string) =>
      getDoc(doc(addressesCollection, id))
    );
    const addressSnapshots = await Promise.all(addressPromises);

    return addressSnapshots.map((snap) => ({ id: snap.id, ...snap.data() }));
  } catch (error) {
    console.error("Error fetching addresses: ", error);
    return [];
  }
};
