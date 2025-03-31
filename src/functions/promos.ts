import { db } from "@/lib/firebase";
import { PromoCode } from "@/types/types";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  runTransaction,
  updateDoc,
  where,
} from "firebase/firestore";

const promosCollection = collection(db, "promos");

export const getPromoFS = async (
  promoCode: string
): Promise<PromoCode | null> => {
  try {
    const q = query(promosCollection, where("code", "==", promoCode));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return null;
    }

    const doc = querySnapshot.docs[0];
    return { id: doc.id, ...doc.data() } as PromoCode;
  } catch {
    return null;
  }
};

export const addPromoFS = async (promo: PromoCode) => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, ...rest } = promo;
    await addDoc(promosCollection, rest);
    console.log("Promocode added succesfully");
  } catch (error) {
    console.error(error);
  }
};

export const updatePromoCodeFS = async (promo: PromoCode) => {
  try {
    const { id, ...rest } = promo;
    const promoRef = doc(promosCollection, id);
    const updated = await updateDoc(promoRef, { ...rest });
    console.log("Promo updated successfully");
    return updated;
  } catch (error) {
    console.error("Error updating promo", error);
  }
};

export const deletePromoFS = async (promoId: string) => {
  try {
    const promoRef = doc(promosCollection, promoId);
    await deleteDoc(promoRef);
    console.log("Promo deleted successfully");
  } catch (error) {
    console.error("Error deleting promo", error);
  }
};

export const updatePromoUsageFS = async (promoId: string) => {
  try {
    const promoRef = doc(promosCollection, promoId);
    await runTransaction(db, async (transaction) => {
      const promoSnap = await transaction.get(promoRef);
      if (!promoSnap.exists()) {
        throw new Error("Promo not found");
      }

      const promoData = promoSnap.data();
      const usedCount = (promoData.usedCount || 0) + 1;

      transaction.update(promoRef, { usedCount });
    });

    console.log("Promo usage updated successfully");
  } catch (error) {
    console.error("Error updating promo usage: ", error);
  }
};
