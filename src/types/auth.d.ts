import { Dispatch, SetStateAction } from "react";
import { User } from "./types";

export interface AuthContextState {
  authUser: User | null;
  setAuthUser: Dispatch<SetStateAction<User | null>>;
  signInWithGoogle: () => Promise<void>;
  signInWithApple: () => Promise<void>;
  logout: () => Promise<void>;
}
