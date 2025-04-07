"use client";

import { useAppContext } from "@/context/AppContext";
import { useAuthContext } from "@/context/AuthContext";
import { getPromoFS } from "@/functions/promos";
import { Address, Product } from "@/types/types";
import { Timestamp } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const OrderSummary = ({
  selectedCartItems,
}: {
  selectedCartItems: { product: Product; quantity: number }[];
}) => {
  const { authUser } = useAuthContext();
  const { router, addresses, order, setOrder, getCartCount } = useAppContext();
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [promoCode, setPromoCode] = useState<string>("");
  const [promoId, setPromoId] = useState<string>("");
  const [pricing, setPricing] = useState<{
    price: number;
    shippingFee: number;
    tax: number;
    discount: number;
  }>({ price: 0, shippingFee: 0, tax: 2, discount: 0 });

  const handleAddressSelect = (address: Address) => {
    setSelectedAddress(address);
    setIsDropdownOpen(false);
  };

  const applyPromoCode = async () => {
    const promo = await getPromoFS(promoCode);

    if (!promo) {
      toast("Promocode Not Found");
      return;
    }

    if (promo.status === "expired") {
      toast("Sorry, This Promocode is Expired");
      return;
    }

    const date = new Date();

    const validFrom =
      promo.validFrom instanceof Timestamp
        ? promo.validFrom.toDate()
        : new Date(promo.validFrom);
    const validTo =
      promo.validTo instanceof Timestamp
        ? promo.validTo.toDate()
        : new Date(promo.validTo);

    if (date < validFrom) {
      toast(`This Promocode will be available on ${validFrom.toDateString()}`);
      return;
    }

    if (date > validTo) {
      toast("This Promocode is Expired");
      return;
    }

    if (promo.usedCount === promo.usageLimit) {
      toast("Sorry, This Promocode usage limit reached");
      return;
    }

    if (pricing.price < promo.minOrderValue) {
      toast(
        `Sorry, Minimum order price for this promo is ${promo.minOrderValue}`
      );
      return;
    }

    if (promo.applicableUsers?.length && authUser) {
      if (!promo.applicableUsers.includes(authUser.id)) {
        toast("You are not eligible for this promo");
        return;
      }
    }

    if (promo.applicableProducts?.length && selectedCartItems) {
      let isNotApplicable = true;
      promo.applicableProducts.forEach((productId) => {
        selectedCartItems.forEach((item) => {
          if (item.product.id === productId) {
            isNotApplicable = false;
          }
        });
      });

      if (isNotApplicable) {
        return;
      }
    }

    setPricing(() => {
      const discount =
        promo.discountType === "fixed"
          ? promo.discountValue
          : Math.round((pricing.price * promo.discountValue) / 100);

      return {
        ...pricing,
        discount,
      };
    });

    setPromoId(promo.id);
  };

  const removePromoCode = () => {
    setPricing(() => {
      return {
        ...pricing,
        discount: 0,
      };
    });
    setPromoId("");
  };

  useEffect(() => {
    const totalAmount = Math.round(
      selectedCartItems.reduce((total, item) => {
        const price = item.product.offerPrice ?? item.product.price;
        return total + price * item.quantity;
      }, 0)
    );

    const getShippingFee = () => {
      if (selectedAddress && selectedAddress.division === "Dhaka") {
        return 60;
      } else {
        return 120;
      }
    };

    setPricing((prev) => {
      return {
        ...prev,
        price: totalAmount,
        shippingFee: getShippingFee(),
      };
    });
  }, [selectedCartItems, selectedAddress]);

  const createOrder = async () => {
    if (!authUser) {
      toast("Please Sign In");
      return;
    }

    if (!selectedCartItems.length) {
      toast("Please Select Items To Buy");
      return;
    }

    if (!selectedAddress) {
      toast("Please Select Shipping Address");
      return;
    }

    setOrder({
      ...order,
      id: "",
      promoId: promoId,
      userId: authUser.id,
      products: selectedCartItems,
      subTotal: pricing.price,
      discount: pricing.discount,
      shippingFee: pricing.shippingFee,
      total: Math.round(pricing.price + pricing.shippingFee - pricing.discount),
      address: selectedAddress,
      status: "pending",
    });

    router.push("/checkout");
  };

  return (
    <div className="w-full md:w-96 bg-gray-500/5 p-5">
      <h2 className="text-xl md:text-2xl font-medium text-gray-700">
        Order Summary
      </h2>
      <hr className="border-gray-500/30 my-5" />
      <div className="space-y-6">
        <div>
          <label className="text-base font-medium uppercase text-gray-600 block mb-2">
            Select Address
          </label>
          <div className="relative inline-block w-full text-sm border">
            <button
              className="peer w-full text-left px-4 pr-2 py-2 bg-white text-gray-700 focus:outline-none"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <span>
                {selectedAddress
                  ? `${selectedAddress.fullName}, ${selectedAddress.area}, ${selectedAddress.upazila}, ${selectedAddress.district}`
                  : "Select Address"}
              </span>
              <svg
                className={`w-5 h-5 inline float-right transition-transform duration-200 ${
                  isDropdownOpen ? "rotate-0" : "-rotate-90"
                }`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="#6B7280"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {isDropdownOpen && (
              <ul className="absolute w-full bg-white border shadow-md mt-1 z-10 py-1.5">
                {addresses?.map((address, index) => (
                  <li
                    key={index}
                    className="px-4 py-2 hover:bg-gray-500/10 cursor-pointer"
                    onClick={() => handleAddressSelect(address)}
                  >
                    {address.fullName}, {address.area}, {address.upazila},
                    {address.district}, {address.division}
                  </li>
                ))}
                <li
                  onClick={() => router.push("/address")}
                  className="px-4 py-2 hover:bg-gray-500/10 cursor-pointer text-center"
                >
                  + Add/Manage Your Addresses
                </li>
              </ul>
            )}
          </div>
        </div>

        <div>
          <label className="text-base font-medium uppercase text-gray-600 block mb-2">
            Promo Code
          </label>
          <div className="flex flex-col items-start gap-3">
            <input
              type="text"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              placeholder="Enter promo code"
              className="flex-grow w-full outline-none p-2.5 text-gray-600 border"
            />
            <button
              onClick={promoId ? removePromoCode : applyPromoCode}
              className="bg-orange-600 text-white px-9 py-2 hover:bg-orange-700 cursor-pointer"
            >
              {promoId ? "Remove" : "Apply"}
            </button>
          </div>
        </div>

        <hr className="border-gray-500/30 my-5" />

        <div className="space-y-4">
          <div className="flex justify-between text-base font-medium">
            <p className="uppercase text-gray-600">Items {getCartCount()}</p>
            <p className="text-gray-800">৳ {pricing.price}</p>
          </div>
          <div className="flex justify-between">
            <p className="text-gray-600">Shipping Fee</p>
            <p className="font-medium text-gray-800">
              ৳ {pricing.shippingFee || "Free"}
            </p>
          </div>
          <div className="flex justify-between">
            <p className="text-gray-600">Discount</p>
            <p className="font-medium text-gray-800">৳ {pricing.discount}</p>
          </div>
          <div className="flex justify-between text-lg md:text-xl font-medium border-t pt-3">
            <p>Total</p>
            <p>
              {"৳ "}
              {Math.round(
                pricing.price + pricing.shippingFee - pricing.discount
              )}
            </p>
          </div>
        </div>
      </div>

      <button
        onClick={createOrder}
        className="w-full bg-orange-600 text-white py-3 mt-5 hover:bg-orange-700 cursor-pointer"
      >
        Place Order
      </button>
    </div>
  );
};

export default OrderSummary;
