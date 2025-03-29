import { auth, db } from "@/lib/firebase";
import {
  deleteUser,
  reauthenticateWithPopup,
  GoogleAuthProvider,
  OAuthProvider,
} from "firebase/auth";
import { doc, deleteDoc } from "firebase/firestore";
import { redirect } from "next/navigation";

export const deleteAccount = async (userId: string) => {
  const user = auth.currentUser;
  if (!user) return alert("No authenticated user found!");

  try {
    // Get provider ID dynamically (assuming the user has only one provider)
    const providerId = user.providerData[0]?.providerId;

    // Determine the correct provider for re-authentication
    const provider =
      providerId === "apple.com"
        ? new OAuthProvider("apple.com")
        : new GoogleAuthProvider();

    // Re-authenticate the user before deletion
    await reauthenticateWithPopup(user, provider);

    // Delete user document from Firestore
    await deleteDoc(doc(db, "users", userId));

    // Delete user from Firebase Authentication
    await deleteUser(user);

    redirect("/auth/login");
  } catch (error) {
    console.error("Error deleting account:", error);
  }
};
