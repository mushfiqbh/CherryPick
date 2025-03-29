"use client";
import { AdminContextState } from "@/types/contextTypes";
import { createContext, useContext, useState } from "react";

export const AdminContext = createContext<AdminContextState | null>(null);

export const useAdminContext = (): AdminContextState => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error(
      "useAdminContext must be used within an AdminContextProvider"
    );
  }
  return context;
};

export const AdminContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [admin, setAdmin] = useState(null);
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
