"use client";
import React from "react";
import { assets } from "@/assets/assets";
import Link from "next/link";
import { useAppContext } from "@/context/AppContext";
import Image from "next/image";
import { useAuthContext } from "@/context/AuthContext";
import localFont from "next/font/local";

const UrbanJungle = localFont({ src: "../assets/UrbanJungle.otf" });

const Navbar = () => {
  const { router } = useAppContext();
  const { authUser } = useAuthContext();

  return (
    <nav className="w-full fixed z-100 top-0 left-0 min-h-16 md:flex items-center px-6 md:px-16 lg:px-32 bg-white text-gray-700">
      <div className="w-full flex items-center justify-between">
        <h1
          className={`w-full md:w-auto text-4xl text-center ${UrbanJungle.className}`}
        >
          CHERRY PICK
        </h1>
        <div className="flex items-center gap-4 lg:gap-8 max-md:hidden">
          <Link href="/" className="hover:text-gray-900 transition">
            Home
          </Link>
          <Link href="/orders" className="hover:text-gray-900 transition">
            Orders
          </Link>
          <Link href="/address" className="hover:text-gray-900 transition">
            Address
          </Link>
          <Link href="/" className="hover:text-gray-900 transition">
            Contact
          </Link>

          {authUser?.role === "seller" && (
            <button
              onClick={() => router.push("/seller")}
              className="text-xs border px-4 py-1.5 rounded-full"
            >
              Seller Dashboard
            </button>
          )}
        </div>

        <ul className="hidden md:flex items-center gap-4 ">
          <Link
            href="/cart"
            className="flex items-center gap-2 hover:text-gray-900 transition"
          >
            <Image className="w-4 h-4" src={assets.cart_icon} alt="cart icon" />
            Cart
          </Link>
          <button className="flex items-center gap-2 hover:text-gray-900 transition cursor-pointer">
            <Image src={assets.user_icon} alt="user icon" />
            Account
          </button>
        </ul>
      </div>

      {/* For Mobile Version */}
      <div className="flex items-center justify-between md:hidden gap-3 py-2">
        {authUser?.role === "seller" && (
          <button
            onClick={() => router.push("/seller")}
            className="text-xs border px-4 py-1.5 rounded-full"
          >
            Seller Dashboard
          </button>
        )}
        <Link
          href="/cart"
          className="flex items-center gap-2 hover:text-gray-900 transition"
        >
          <Image className="w-4 h-4" src={assets.cart_icon} alt="cart icon" />
          Cart
        </Link>
        <button className="flex items-center gap-2 hover:text-gray-900 transition">
          <Image src={assets.user_icon} alt="user icon" />
          Account
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
