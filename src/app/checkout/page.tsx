"use client";

import { useAppContext } from "@/context/AppContext";
import { FormEvent, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createOrderFS } from "@/functions/orders";
import { Payment } from "@/types/types";
import { updatePromoUsageFS } from "@/functions/promos";
import { assets } from "@/assets/assets";
import toast from "react-hot-toast";
import { useAuthContext } from "@/context/AuthContext";

const Checkout = () => {
  const { authUser, setAuthUser } = useAuthContext();
  const { order } = useAppContext();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [payment, setPayment] = useState<Payment>({
    cashPay: order.total - 200,
    advancePay: 200,
    status: "unpaid",
    senderNumber: "",
    sentTime: "",
    method: "bkash",
    type: "partial",
  });

  const isValidMobileNumber = (): boolean => {
    const regex = /^(?:\+880|880|0)(?:13|14|15|16|17|18|19)\d{8}$/;
    return regex.test(payment.senderNumber || "");
  };

  const handlePayment = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isValidMobileNumber()) {
      toast("Invalid phone number. Please enter a correct number.");
      return;
    }

    if (!payment.sentTime || !authUser) {
      toast("Order creation failed: Missing payment time or user.");
      setPayment((prev) => ({ ...prev, status: "failed" }));
      return;
    }

    try {
      setLoading(true);

      const orderId = await createOrderFS(
        { ...order, payment: { ...payment, status: "pending" } },
        authUser.id
      );

      if (orderId) {
        setAuthUser({
          ...authUser,
          orderIds: [...(authUser.orderIds ?? []), orderId],
        });

        if (order.promoId) {
          await updatePromoUsageFS(order.promoId);
        }

        toast("Order created successfully!");
        router.push("/orders");
      } else {
        throw new Error("Order ID was not returned.");
      }
    } catch (error) {
      console.error("Error creating order:", error);
      toast("Something went wrong while creating your order.");
      setPayment((prev) => ({ ...prev, status: "failed" }));
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex flex-col justify-center items-center gap-5">
        <div className="flex justify-center items-center relative">
          <Image className="absolute p-5" src={assets.checkmark} alt="" />
          <div className="animate-spin rounded-full h-24 w-24 border-4 border-t-green-300 border-gray-200"></div>
        </div>
        <div className="text-center text-2xl font-semibold">
          Order Placed Successfully
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col justify-center items-center gap-5 p-5">
      <div className="bg-white shadow-md rounded-lg p-5 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-3">Invoice</h2>
        <div className="border-b pb-3 mb-3">
          {order.products.map((item, index) => (
            <div key={index} className="flex justify-between">
              <span>
                {item.product.name} (x{item.quantity})
              </span>
              <span>${item.product.price * item.quantity}</span>
            </div>
          ))}
        </div>
        <div className="text-right space-y-2">
          <div>Subtotal: ${order.subTotal}</div>
          <div>Discount: -${order.discount}</div>
          <div>Shipping: ${order.shippingFee}</div>
          <div className="font-semibold">Total: ${order.total}</div>
        </div>
      </div>

      <form
        onSubmit={handlePayment}
        className="bg-white shadow-md rounded-lg p-5 w-full max-w-md flex flex-col gap-5"
      >
        <h2 className="text-xl font-semibold mb-3">
          Select Payment Method and Type
        </h2>
        <select
          className="w-full p-2 border rounded"
          value={payment.method}
          onChange={(e) => setPayment({ ...payment, method: e.target.value })}
        >
          <option value="bkash">Bkash</option>
          <option value="nagad">Nagad</option>
          <option value="upay">Upay</option>
        </select>

        <div className="w-full flex items-center justify-between">
          <div
            className="w-1/2 p-2 flex items-center gap-1 cursor-pointer hover:bg-slate-300"
            onClick={() => {
              setPayment({
                ...payment,
                cashPay: order.total - 200,
                advancePay: 200,
                type: "partial",
              });
            }}
          >
            {payment.type === "partial" ? (
              <Image src={assets.checkedIcon} alt="checked" width={20} />
            ) : (
              <Image src={assets.uncheckedIcon} alt="unchecked" width={20} />
            )}
            Pay 200 Tk Advance
          </div>
          <div
            className="w-1/2 p-2 flex items-center gap-1 cursor-pointer hover:bg-slate-300"
            onClick={() => {
              setPayment({
                ...payment,
                cashPay: 0,
                advancePay: order.total,
                type: "full",
              });
            }}
          >
            {payment.type === "full" ? (
              <Image src={assets.checkedIcon} alt="checked" width={20} />
            ) : (
              <Image src={assets.uncheckedIcon} alt="unchecked" width={20} />
            )}
            Pay Full Tk Advance
          </div>
        </div>

        <input
          type="text"
          required
          name="senderNumber"
          className="p-2 focus:outline-none"
          value={payment.senderNumber}
          placeholder={payment.method + " Number"}
          onChange={(e) =>
            setPayment({ ...payment, senderNumber: e.target.value })
          }
        />

        <input
          type="text"
          required
          name="sentTime"
          className="p-2 focus:outline-none"
          value={payment.sentTime}
          placeholder="When you sent money? (e.g. 9:10 AM)"
          onChange={(e) => setPayment({ ...payment, sentTime: e.target.value })}
        />

        <button
          className="w-full bg-green-500 text-white p-2 rounded mt-3 cursor-pointer"
          type="submit"
          disabled={loading}
        >
          {loading ? "Processing..." : "Pay Now"}
        </button>
      </form>
    </div>
  );
};

export default Checkout;
