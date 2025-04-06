"use client";

import { useAuthContext } from "@/context/AuthContext";
import React from "react";

const Login = () => {
  const { signInWithGoogle, signInWithApple, logout, authUser } =
    useAuthContext();

  return (
    <div>
      <button onClick={signInWithGoogle}>Google</button>
      <button onClick={signInWithApple}>Apple</button>
      <button onClick={logout}>Logout</button>

      <h1>{authUser?.displayName || ""}</h1>
    </div>
  );
};

export default Login;
