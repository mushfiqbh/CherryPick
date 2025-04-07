"use client";
import React, { useEffect, useState } from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Loading from "@/components/Loading";
import { Order } from "@/types/types";
import { getOrdersFS } from "@/functions/orders";
import { useAuthContext } from "@/context/AuthContext";

const MyOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { authUser } = useAuthContext();

  useEffect(() => {
    const fetchOrders = async () => {
      const response = await getOrdersFS(authUser?.orderIds);
      setOrders(response);
      setLoading(false);
    };

    fetchOrders();
  }, [authUser]);

  const paymentStatusMsg = (
    status: "COD" | "paid" | "unpaid" | "pending" | "failed"
  ) => {
    if (status === "pending") {
      return "We reviewing your payment";
    } else if (status === "unpaid") {
      return "You did not pay!";
    } else if (status === "failed") {
      return "Payment Failed";
    } else if (status === "COD") {
      return "Partially Paid (COD)";
    } else if (status === "paid") {
      return "Fully Paid";
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex flex-col justify-between px-6 md:px-16 lg:px-32 py-6 min-h-screen">
        <div className="space-y-5">
          <h2 className="text-lg font-medium mt-6">My Orders</h2>
          {loading ? (
            <Loading />
          ) : (
            <div className="max-w-5xl border-t border-gray-300 text-sm">
              {orders.length ? (
                orders.map((order, index) => (
                  <div
                    key={index}
                    className="flex flex-col md:flex-row gap-5 justify-between p-5 border-b border-gray-300"
                  >
                    <div className="flex-1 flex gap-5 max-w-80">
                      <Image
                        className="max-w-16 max-h-16 object-cover"
                        src={assets.box_icon}
                        alt="box_icon"
                      />
                      <p className="flex flex-col gap-3">
                        <span className="font-medium text-base">
                          {order.products
                            .map(
                              (item) =>
                                item?.product.name + ` x ${item.quantity}`
                            )
                            .join(", ")}
                        </span>
                        <span>Items : {order.products.length}</span>
                      </p>
                    </div>
                    <div>
                      <p>
                        <span className="font-medium">
                          {order.address.fullName}
                        </span>
                        <br />
                        <span>{order.address.area}</span>
                        <br />
                        <span>{`${order.address.upazila}, ${order.address.district}`}</span>
                        <br />
                        <span>{order.address.phoneNumber}</span>
                      </p>
                    </div>
                    <p className="font-medium my-auto">৳ {order.subTotal}</p>
                    <div>
                      <p className="flex flex-col">
                        <span>Method : COD</span>
                        <span>
                          Date :{" "}
                          {order.createdAt?.seconds
                            ? new Date(
                                order.createdAt.seconds * 1000
                              ).toDateString()
                            : null}
                        </span>
                        <span>Order : {order?.status}</span>
                        <span>
                          Payment : {paymentStatusMsg(order?.payment?.status)}
                        </span>
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="w-full text-3xl flex items-center justify-center pt-20">
                  You have no order!
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default MyOrders;
