"use client";

import React, { useRef, useEffect, useState } from "react";
import { updateBusiness } from "@/lib/api/businessApi";

interface UpdateBusinessModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData: {
    business_code: string;
    business_name: string;
    description: string;
  };
}

export const Modal: React.FC<UpdateBusinessModalProps> = ({
  isOpen,
  onClose,
  initialData,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [businessData, setBusinessData] = useState({
    business_code: "",
    business_name: "",
    description: "",
  });

  useEffect(() => {
    if (initialData) {
      setBusinessData({
        business_code: initialData.business_code,
        business_name: initialData.business_name,
        description: initialData.description,
      });
    }
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setBusinessData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      const updatedPayload = {
        business_name: businessData.business_name,
        description: businessData.description,
      };
      await updateBusiness(businessData.business_code, updatedPayload);
      alert("Business updated successfully");
      onClose();
    } catch (err) {
      console.error(err);
      alert("Failed to update business");
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
            name="business_name"
            value={businessData.business_name}
            onChange={handleChange}
            placeholder="Business Name"
            className="w-full border p-2"
          />
          <textarea
            name="description"
            value={businessData.description}
            onChange={handleChange}
            placeholder="Description"
            className="w-full border p-2"
          />

          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Update Business
          </button>
        </div>
      </div>
    </div>
  );
};
