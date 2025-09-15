"use client";

import React, { useRef, useEffect, useState } from "react";
import { updateShop } from "@/lib/api/shopApi";
import toast from "react-hot-toast";

interface Shop {
  id: string;
  shop_name: string;
  description: string;
  image_url: string;
  location: string;
  contact_number: string;
  email: string;
  owner_id: number;
  AdminUser: {
    id: number;
    full_name: string;
  };
  Business: {
    business_code: string;
    business_name: string;
  };
}

interface UpdateShopModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData: Shop;
  onUpdate: (updated: Shop) => void; // parent handles toast now
}

export const Modal: React.FC<UpdateShopModalProps> = ({
  isOpen,
  onClose,
  initialData,
  onUpdate,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [shopData, setShopData] = useState<Shop>(initialData);
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    if (initialData) setShopData(initialData);
  }, [initialData]);

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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setShopData(prev => ({ ...prev, [name]: value } as Shop));
  };

  const handleSubmit = async () => {
    try {
      const updatedShop: Shop = {
        ...shopData,
        image_url: file ? file.name : shopData.image_url,
      };
      await updateShop(updatedShop.id, updatedShop);

      onUpdate(updatedShop); 
      onClose();
    } catch (err) {
      console.error("Error updating shop:", err);
      toast.error("Failed to update shop.", { position: "top-center" });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-99999 flex items-center justify-center overflow-y-auto">
      <div
        className="fixed inset-0 h-full w-full bg-gray-400/50 backdrop-blur-[32px]"
        onClick={onClose}
      />
      <div
        ref={modalRef}
        className="relative w-full max-w-xl rounded-3xl bg-white dark:bg-gray-900 p-6"
        onClick={e => e.stopPropagation()}
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
            onChange={e => setFile(e.target.files?.[0] || null)}
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
