"use client";
import React, { useEffect, useState } from "react";
import { assets } from "@/assets/assets";
import OrderSummary from "@/components/OrderSummary";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import { useAppContext } from "@/context/AppContext";
import { Product } from "@/types/types";

const Cart = () => {
  const { router, cartItems, updateCart, getCartCount } = useAppContext();
  const [selectedCartItems, setSelectedCartItems] = useState<string[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("selected_cart_items");
    if (stored) {
      try {
        const ids = JSON.parse(stored);
        if (Array.isArray(ids)) {
          setSelectedCartItems(ids);
        }
      } catch (error) {
        console.warn("Invalid JSON in localStorage:", error);
      }
    }
  }, []);

  useEffect(() => {
    if (selectedCartItems.length) {
      localStorage.setItem(
        "selected_cart_items",
        JSON.stringify(selectedCartItems)
      );
    }
  }, [selectedCartItems]);

  const restoreSelectedCartItems = () => {
    const restored: {
      product: Product;
      quantity: number;
    }[] = [];

    selectedCartItems.forEach((productId) => {
      const selectedItem = cartItems.find(
        ({ product }) => product.id === productId
      );
      if (selectedItem) {
        restored.push(selectedItem);
      }
    });

    return restored;
  };

  return (
    <>
      <Navbar />
      <div className="flex flex-col md:flex-row gap-10 px-6 md:px-16 lg:px-32 pt-14 mb-20">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-8 border-b border-gray-500/30 pb-6">
            <p className="text-2xl md:text-3xl text-gray-500">
              Your <span className="font-medium text-orange-600">Cart</span>
            </p>
            <p className="text-lg md:text-xl text-gray-500/80">
              {getCartCount()} Items
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead className="text-left">
                <tr>
                  <th className="text-nowrap pb-6 md:px-4 px-1 text-gray-600 font-medium">
                    Product Details
                  </th>
                  <th className="pb-6 md:px-4 px-1 text-gray-600 font-medium">
                    Price
                  </th>
                  <th className="pb-6 md:px-4 px-1 text-gray-600 font-medium">
                    Quantity
                  </th>
                  <th className="pb-6 md:px-4 px-1 text-gray-600 font-medium">
                    Subtotal
                  </th>
                </tr>
              </thead>
              <tbody>
                {!cartItems.length
                  ? Array(3)
                      .fill(null)
                      .map((_, index) => {
                        return (
                          <tr key={index}>
                            <td>
                              <div className="w-4 h-4 rounded bg-gray-300 animate-pulse" />
                            </td>
                            <td className="flex items-center gap-4 py-4 md:px-4 px-1">
                              <div className="rounded-lg overflow-hidden bg-gray-200 p-2">
                                <div className="w-16 h-16 bg-gray-300 animate-pulse rounded" />
                              </div>
                              <div className="text-sm hidden md:block space-y-2">
                                <div className="w-24 h-4 bg-gray-300 rounded animate-pulse" />
                                <div className="w-16 h-3 bg-gray-200 rounded animate-pulse" />
                              </div>
                            </td>
                            <td className="py-4 md:px-4 px-1 text-gray-600">
                              <div className="w-10 h-4 bg-gray-300 rounded animate-pulse" />
                            </td>
                            <td className="py-4 md:px-4 px-1">
                              <div className="flex items-center md:gap-2 gap-1">
                                <div className="w-4 h-4 bg-gray-300 rounded animate-pulse" />
                                <div className="w-8 h-4 bg-gray-300 rounded animate-pulse mx-1" />
                                <div className="w-4 h-4 bg-gray-300 rounded animate-pulse" />
                              </div>
                            </td>
                            <td className="py-4 md:px-4 px-1 text-gray-600">
                              <div className="w-12 h-4 bg-gray-300 rounded animate-pulse" />
                            </td>
                          </tr>
                        );
                      })
                  : cartItems.map(({ product, quantity }, index) => {
                      return (
                        <tr key={index}>
                          <td>
                            <input
                              type="checkbox"
                              checked={selectedCartItems.includes(product.id)}
                              onChange={() => {
                                let selected: string[];
                                if (selectedCartItems.includes(product.id)) {
                                  selected = selectedCartItems.filter(
                                    (id) => id !== product.id
                                  );
                                } else {
                                  selected = [...selectedCartItems, product.id];
                                }
                                setSelectedCartItems(selected);
                              }}
                            />
                          </td>
                          <td className="flex items-center gap-4 py-4 md:px-4 px-1">
                            <div>
                              <div className="rounded-lg overflow-hidden bg-gray-500/10 p-2">
                                <Image
                                  src={product.images[0]}
                                  alt={product.name}
                                  className="w-16 h-auto object-cover mix-blend-multiply"
                                  width={1280}
                                  height={720}
                                />
                              </div>
                              <button
                                className="md:hidden text-xs text-orange-600 mt-1 cursor-pointer"
                                onClick={() => updateCart(product.id, 0)}
                              >
                                Remove
                              </button>
                            </div>
                            <div className="text-sm hidden md:block">
                              <p className="text-gray-800">{product.name}</p>
                              <button
                                className="text-xs text-orange-600 mt-1 cursor-pointer"
                                onClick={() => updateCart(product.id, 0)}
                              >
                                Remove
                              </button>
                            </div>
                          </td>

                          <td className="py-4 md:px-4 px-1 text-gray-600">
                            ${product.offerPrice}
                          </td>
                          <td className="py-4 md:px-4 px-1">
                            <div className="flex items-center md:gap-2 gap-1">
                              <button
                                onClick={() =>
                                  updateCart(product.id, quantity - 1)
                                }
                                className="cursor-pointer"
                                disabled={quantity == 1}
                              >
                                <Image
                                  src={assets.decrease_arrow}
                                  alt="decrease_arrow"
                                  className="w-4 h-4"
                                />
                              </button>

                              <span className="w-8 text-center appearance-none">
                                {quantity}
                              </span>

                              <button
                                onClick={() =>
                                  updateCart(product.id, quantity + 1)
                                }
                                className="cursor-pointer"
                              >
                                <Image
                                  src={assets.increase_arrow}
                                  alt="increase_arrow"
                                  className="w-4 h-4"
                                />
                              </button>
                            </div>
                          </td>
                          <td className="py-4 md:px-4 px-1 text-gray-600">
                            ${(product.offerPrice * quantity).toFixed(2)}
                          </td>
                        </tr>
                      );
                    })}
              </tbody>
            </table>
          </div>
          <button
            onClick={() => router.push("/all-products")}
            className="group flex items-center mt-6 gap-2 text-orange-600 cursor-pointer"
          >
            <Image
              className="group-hover:-translate-x-1 transition"
              src={assets.arrow_right_icon_colored}
              alt="arrow_right_icon_colored"
            />
            Continue Shopping
          </button>
        </div>

        <OrderSummary selectedCartItems={restoreSelectedCartItems()} />
      </div>
    </>
  );
};

export default Cart;
