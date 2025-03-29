"use client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useEffect, useState } from "react";
import { Address } from "@/types/types";
import toast from "react-hot-toast";
import {
  addAddressFS,
  removeAddressFS,
  updateAddressFS,
} from "@/functions/addresses";
import { useAppContext } from "@/context/AppContext";
import { useAuthContext } from "@/context/AuthContext";
import Loading from "@/components/Loading";

const AddAddress = () => {
  const { authUser } = useAuthContext();
  const { addresses, setAddresses } = useAppContext();
  const [loading, setLoading] = useState(true);
  const [address, setAddress] = useState<Address>({
    id: "",
    userId: "",
    fullName: "",
    phoneNumber: "",
    street: "",
    city: "",
    state: "",
    country: "",
    postalCode: "",
    isDefault: false,
  });

  useEffect(() => {
    if (addresses.length) {
      setLoading(false);
    }
  }, [addresses]);

  const removeAddress = (userId: string, addressId: string) => {
    removeAddressFS(userId, addressId);
    const updated = addresses.filter((adrs) => adrs.id !== addressId);
    setAddresses(updated);
  };

  const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setAddress((prevAddress) => ({ ...prevAddress, [name]: value }));
  };

  const onSubmitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (address.id) {
        updateAddressFS(address);
        setAddresses(() => {
          const updated = addresses.filter((value) =>
            value.id === address.id ? address : value
          );
          return updated;
        });
        toast("Address Updated Successfully");
      } else if (authUser) {
        const id = await addAddressFS(authUser.id, address);
        setAddresses([...addresses, { ...address, id, userId: authUser.id }]);
        toast("Address Saved Successfully");
      }

      setAddress({
        id: "",
        userId: "",
        fullName: "",
        phoneNumber: "",
        street: "",
        city: "",
        state: "",
        country: "",
        postalCode: "",
        isDefault: false,
      });
    } catch (error) {
      toast("Something goes wrong. Try again!");
      console.error(error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="w-fit mx-auto py-16 flex flex-col md:flex-row justify-between">
        <div className="">
          {/* List Addresses */}

          {loading && <Loading />}

          {!addresses ? (
            <p className="text-gray-500">No addresses found. Add a new one.</p>
          ) : (
            <ul className="flex flex-wrap items-center gap-3">
              {addresses?.map((adrs, index) => (
                <li
                  key={index}
                  className="border p-4 rounded-lg shadow-sm bg-white"
                >
                  <p className="font-semibold">{adrs.fullName}</p>
                  <p className="text-sm text-gray-600">{adrs.phoneNumber}</p>
                  <p className="text-sm">
                    {adrs.street}, {adrs.city}, {adrs.state} - {adrs.postalCode}
                  </p>
                  <p className="text-sm">{adrs.country}</p>

                  <div className="flex space-x-2 mt-2">
                    <button
                      className="bg-blue-500 text-white px-3 py-1 rounded cursor-pointer"
                      onClick={() => setAddress(adrs)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-500 text-white px-3 py-1 rounded cursor-pointer"
                      onClick={() =>
                        authUser && removeAddress(authUser?.id, adrs.id)
                      }
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        <form onSubmit={onSubmitHandler} className="w-full">
          <p className="text-2xl md:text-3xl text-gray-500">
            Add Shipping{" "}
            <span className="font-semibold text-orange-600">Address</span>
          </p>

          <div className="space-y-3 max-w-sm mt-10">
            {/* Full Name */}
            <input
              className="px-2 py-2.5 focus:border-orange-500 transition border border-gray-500/30 rounded outline-none w-full text-gray-500"
              type="text"
              name="fullName"
              placeholder="Full name"
              onChange={onChangeHandler}
              value={address.fullName}
            />

            {/* Phone Number */}
            <input
              className="px-2 py-2.5 focus:border-orange-500 transition border border-gray-500/30 rounded outline-none w-full text-gray-500"
              type="text"
              name="phoneNumber"
              placeholder="Phone number"
              onChange={onChangeHandler}
              value={address.phoneNumber}
            />

            {/* Postal Code */}
            <input
              className="px-2 py-2.5 focus:border-orange-500 transition border border-gray-500/30 rounded outline-none w-full text-gray-500"
              type="text"
              name="postalCode"
              placeholder="Postal Code"
              onChange={onChangeHandler}
              value={address.postalCode}
            />

            {/* Street Address */}
            <input
              className="px-2 py-2.5 focus:border-orange-500 transition border border-gray-500/30 rounded outline-none w-full text-gray-500 resize-none"
              name="street"
              placeholder="Street Address (Area and Street)"
              onChange={onChangeHandler}
              value={address.street}
            ></input>

            <div className="flex space-x-3">
              {/* City */}
              <input
                className="px-2 py-2.5 focus:border-orange-500 transition border border-gray-500/30 rounded outline-none w-full text-gray-500"
                type="text"
                name="city"
                placeholder="City/District/Town"
                onChange={onChangeHandler}
                value={address.city}
              />

              {/* State */}
              <input
                className="px-2 py-2.5 focus:border-orange-500 transition border border-gray-500/30 rounded outline-none w-full text-gray-500"
                type="text"
                name="state"
                placeholder="State"
                onChange={onChangeHandler}
                value={address.state}
              />
            </div>

            {/* Country */}
            <input
              className="px-2 py-2.5 focus:border-orange-500 transition border border-gray-500/30 rounded outline-none w-full text-gray-500"
              type="text"
              name="country"
              placeholder="Country"
              onChange={onChangeHandler}
              value={address.country}
            />

            {/* Default Address Checkbox */}
            <label className="flex items-center space-x-2 text-gray-500">
              <input
                type="checkbox"
                name="isDefault"
                checked={address.isDefault || false}
                onChange={() =>
                  setAddress({ ...address, isDefault: !address.isDefault })
                }
              />
              <span>Set as default address</span>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="max-w-sm w-full mt-6 bg-orange-600 text-white py-3 hover:bg-orange-700 uppercase cursor-pointer"
          >
            Save address
          </button>
        </form>
      </div>
      <Footer />
    </>
  );
};

export default AddAddress;
