"use client";
import { AdminContextState } from "@/types/states";
import { User } from "@/types/types";
import { createContext, useContext, useState } from "react";

export const AdminContext = createContext<AdminContextState | null>(null);

export const AdminContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [admin, setAdmin] = useState<User | null>(null);
  const [isSeller, setIsSeller] = useState<boolean>(true);

  return (
    <AdminContext.Provider
      value={{
        admin,
        setAdmin,
        isSeller,
        setIsSeller,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdminContext = (): AdminContextState => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error(
      "useAdminContext must be used within an AdminContextProvider"
    );
  }
  return context;
};
