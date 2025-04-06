"use client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useEffect, useState } from "react";
import { Address, District, Division, Upazila } from "@/types/types";
import { useAppContext } from "@/context/AppContext";
import { useAuthContext } from "@/context/AuthContext";
import Loading from "@/components/Loading";
import toast from "react-hot-toast";
import axios from "axios";
import {
  addAddressFS,
  removeAddressFS,
  updateAddressFS,
} from "@/functions/addresses";

const AddAddress = () => {
  const { authUser } = useAuthContext();
  const { addresses, setAddresses } = useAppContext();
  const [loading, setLoading] = useState(true);
  const [address, setAddress] = useState<Address>({
    id: "",
    userId: "",
    fullName: "",
    phoneNumber: "",
    area: "",
    upazila: "",
    district: "",
    division: "",
    country: "",
    postalCode: "",
    isDefault: false,
  });
  const [divisions, setDivisions] = useState<Division[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [upazilas, setUpazilas] = useState<Upazila[]>([]);

  useEffect(() => {
    if (addresses.length) {
      setLoading(false);
    }
  }, [addresses]);

  useEffect(() => {
    axios.get("https://bdapi.vercel.app/api/v.1/division").then((res) => {
      setDivisions(res.data.data);
    });
  }, []);

  useEffect(() => {
    if (address.division) {
      const selectedDivision = divisions.find(
        ({ name }) => name === address.division
      );

      axios
        .get(
          `https://bdapi.vercel.app/api/v.1/district/${selectedDivision?.id}`
        )
        .then((res) => {
          setDistricts(res.data.data);
          setUpazilas([]);
        });
    }
  }, [address.division, divisions]);

  useEffect(() => {
    if (address.district) {
      const selectedDistrict = districts.find(
        ({ name }) => name === address.district
      );

      axios
        .get(
          `https://bdapi.vercel.app/api/v.1/upazilla/${selectedDistrict?.id}`
        )
        .then((res) => {
          setUpazilas(res.data.data);
        });
    }
  }, [address.district, districts]);

  const removeAddress = (userId: string, addressId: string) => {
    removeAddressFS(userId, addressId);
    const updated = addresses.filter((adrs) => adrs.id !== addressId);
    setAddresses(updated);
  };

  const onSubmitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (address.id) {
        await updateAddressFS(address);
        setAddresses((prev) =>
          prev.map((value) => (value.id === address.id ? address : value))
        );
        toast("Address Updated Successfully");
      } else if (authUser) {
        const id = await addAddressFS(authUser.id, address);
        if (id) {
          const newAddress = { ...address, id, userId: authUser.id };
          setAddresses((prev) => [...prev, newAddress]);
          toast("Address Saved Successfully");
        }
      }

      setAddress({
        id: "",
        userId: "",
        fullName: "",
        phoneNumber: "",
        area: "",
        upazila: "",
        district: "",
        division: "",
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
                    {adrs.area}, {adrs.upazila}, {adrs.district} -{" "}
                    {adrs.postalCode}
                  </p>
                  <p className="text-sm">
                    {adrs.division}, {adrs.country}
                  </p>

                  <div className="flex space-x-2 mt-2">
                    <button
                      className="bg-blue-500 text-white px-3 py-1 rounded cursor-pointer"
                      onClick={() => {
                        setAddress(adrs);
                      }}
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
            <input
              className="px-2 py-2.5 border rounded w-full"
              type="text"
              name="fullName"
              placeholder="Full name"
              value={address.fullName}
              onChange={(e) =>
                setAddress({ ...address, fullName: e.target.value })
              }
            />
            <input
              className="px-2 py-2.5 border rounded w-full"
              type="text"
              name="phoneNumber"
              placeholder="Phone number"
              value={address.phoneNumber}
              onChange={(e) =>
                setAddress({ ...address, phoneNumber: e.target.value })
              }
            />
            <input
              className="px-2 py-2.5 border rounded w-full"
              type="text"
              name="postalCode"
              placeholder="Postal Code"
              value={address.postalCode}
              onChange={(e) =>
                setAddress({ ...address, postalCode: e.target.value })
              }
            />
            <input
              className="px-2 py-2.5 border rounded w-full"
              type="text"
              name="area"
              placeholder="Street Address (Area and Street)"
              value={address.area}
              onChange={(e) => setAddress({ ...address, area: e.target.value })}
            />

            <select
              className="w-full p-2 border rounded"
              value={address.division}
              onChange={(e) =>
                e.target.value &&
                setAddress({ ...address, division: e.target.value })
              }
            >
              <option value="">Select Division</option>
              {divisions.map((division) => (
                <option key={division.id} value={division.name}>
                  {division.name}
                </option>
              ))}
            </select>
            <select
              className="w-full p-2 border rounded"
              value={address.district}
              onChange={(e) =>
                setAddress({ ...address, district: e.target.value })
              }
              disabled={!address.division}
            >
              <option value="">Select District</option>
              {districts.map((district) => (
                <option key={district.id} value={district.name}>
                  {district.name}
                </option>
              ))}
            </select>
            <select
              className="w-full p-2 border rounded"
              value={address.upazila}
              onChange={(e) =>
                setAddress({ ...address, upazila: e.target.value })
              }
              disabled={!address.district}
            >
              <option value="">Select Upazila</option>
              {upazilas.map((upazila) => (
                <option key={upazila.id} value={upazila.name}>
                  {upazila.name}
                </option>
              ))}
            </select>

            <input
              className="px-2 py-2.5 border rounded w-full"
              type="text"
              name="country"
              placeholder="Country"
              value={address.country}
              onChange={(e) =>
                setAddress({ ...address, country: e.target.value })
              }
            />
            <label className="flex items-center space-x-2 text-gray-500">
              <input
                type="checkbox"
                checked={address.isDefault || false}
                onChange={() =>
                  setAddress({ ...address, isDefault: !address.isDefault })
                }
              />
              <span>Set as default address</span>
            </label>
          </div>
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
