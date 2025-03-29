import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";
import { User } from "@/types/types";

export const getUsers = async (): Promise<User[]> => {
  const querySnapshot = await getDocs(collection(db, "users"));
  return querySnapshot.docs.map((doc) => doc.data()) as User[];
};
