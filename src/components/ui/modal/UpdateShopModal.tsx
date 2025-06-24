"use client";

import React, { useRef, useEffect, useState } from "react";
import { updateShop } from "@/lib/api/shopApi";

interface UpdateShopModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData: {
    id: string;
    shop_name: string;
    description: string;
    image_url: string;
    location: string;
    contact_number: string;
    email: string;
    Business: {
      business_code: string;
    };
  };
}

export const Modal: React.FC<UpdateShopModalProps> = ({
  isOpen,
  onClose,
  initialData,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
const [shopData, setShopData] = useState({
  id: "",
  shop_name: "",
  description: "",
  image_url: "",
  location: "",
  contact_number: "",
  email: "",
  business_code: "",
});

useEffect(() => {
  if (initialData) {
    setShopData({
      id: initialData.id,
      shop_name: initialData.shop_name,
      description: initialData.description,
      image_url: initialData.image_url,
      location: initialData.location,
      contact_number: initialData.contact_number,
      email: initialData.email,
      business_code: initialData.Business.business_code,
    });
  }
}, [initialData]);

  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    if (isOpen) document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setShopData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      const updatedPayload = {
        ...shopData,
        image_url: file ? file.name : shopData.image_url,
      };
      await updateShop(shopData.id, updatedPayload);
      alert("Shop updated successfully");
      onClose();
    } catch (err) {
      alert("Failed to update shop");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-99999 flex items-center justify-center overflow-y-auto">
      <div
        className="fixed inset-0 h-full w-full bg-gray-400/50 backdrop-blur-[32px]"
        onClick={onClose}
      ></div>

      <div
        ref={modalRef}
        className="relative w-full max-w-xl rounded-3xl bg-white dark:bg-gray-900 p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-3 top-3 z-10 h-10 w-10 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200"
        >
          X
        </button>

        <div className="space-y-4">
          <input
            name="shop_name"
            value={shopData.shop_name}
            onChange={handleChange}
            placeholder="Shop Name"
            className="w-full border p-2"
          />
          <input
            name="business_code"
            value={shopData.business_code}
            onChange={handleChange}
            placeholder="Business Code"
            className="w-full border p-2"
          />
          <input
            name="location"
            value={shopData.location}
            onChange={handleChange}
            placeholder="Location"
            className="w-full border p-2"
          />
          <input
            name="contact_number"
            value={shopData.contact_number}
            onChange={handleChange}
            placeholder="Contact Number"
            className="w-full border p-2"
          />
          <input
            name="email"
            value={shopData.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full border p-2"
          />
          <textarea
            name="description"
            value={shopData.description}
            onChange={handleChange}
            placeholder="Description"
            className="w-full border p-2"
          />

          <input
            type="file"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="w-full border p-2"
          />

          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Update Shop
          </button>
        </div>
      </div>
    </div>
  );
};
