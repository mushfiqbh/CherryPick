"use client";

import { useAuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const AuthGuard = ({ children }) => {
  const { authUser } = useAuthContext();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authUser) {
      router.replace("/auth/login");
    } else {
      setLoading(false);
    }
  }, [authUser, router]);

  if (loading) {
    return <p className="text-center text-xl">Loading...</p>;
  }

  return <>{children}</>;
};

export default AuthGuard;
