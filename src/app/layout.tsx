import { Outfit } from "next/font/google";
import "./globals.css";
import { ReactNode } from "react";
import { Toaster } from "react-hot-toast";
import { AppContextProvider } from "@/context/AppContext";
import { AuthContextProvider } from "@/context/AuthContext";
import { AdminContextProvider } from "@/context/AdminContext";

const outfit = Outfit({ subsets: ["latin"], weight: ["300", "400", "500"] });

export const metadata = {
  title: "QuickCart - GreatStack",
  description: "E-Commerce with Next.js ",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={`${outfit.className} antialiased text-gray-700`}>
        <Toaster />
        <AuthContextProvider>
          <AppContextProvider>
            <AdminContextProvider>{children}</AdminContextProvider>
          </AppContextProvider>
        </AuthContextProvider>
      </body>
    </html>
  );
}
