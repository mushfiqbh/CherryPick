import { AdminContextState } from "@/types/contextTypes";
import { createContext, useContext, useState } from "react";

const AdminContext = createContext<AdminContextState | null>(null);

export const useAdminContext = (): AdminContextState => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error(
      "useAdminContext must be used within an AdminContextProvider"
    );
  }
  return context;
};

const AdminContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [admin, setAdmin] = useState(null);

  return (
    <AdminContext.Provider
      value={{
        admin,
        setAdmin,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export default AdminContextProvider;
