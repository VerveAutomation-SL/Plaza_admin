"use client";

import React, { useRef, useEffect } from "react";
import { addStockBatch } from "@/lib/api/productApi";
import { toast } from "react-hot-toast";

interface AddStockModalProps {
  variantId: string;
  form: {
    quantity: string;
    quantityType: string;
    base_price: string;
    received_at: string;
  };
  setForm: React.Dispatch<
    React.SetStateAction<{
      quantity: string;
      quantityType: string;
      base_price: string;
      received_at: string;
    }>
  >;
  onClose: () => void;
}

export const Modal: React.FC<AddStockModalProps> = ({
  variantId,
  form,
  setForm,
  onClose,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        variant_id: variantId,
        quantity: Number(form.quantity),
        quantity_type: form.quantityType,
        base_price: Number(form.base_price),
        received_at: form.received_at,
      };

      await addStockBatch(payload);
      toast.success("Stock added successfully!", {
        position: "top-center",
        style: {
          marginTop: "4rem",
          zIndex: 999999,
        },
      });
      onClose();
    } catch (error) {
      console.error("Failed to add stock:", error);
      toast.error("Error adding stock. Please try again.", {
        position: "top-center",
        style: {
          marginTop: "4rem",
          zIndex: 999999,
        },
      });
    }
  };

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
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Adding stock for variant ID: <strong>{variantId}</strong>
          </p>

          <input
            name="quantity"
            value={form.quantity}
            onChange={handleChange}
            placeholder="Quantity"
            type="number"
            className="w-full border p-2"
          />
          <select
            name="quantityType"
            value={form.quantityType}
            onChange={handleChange}
            className="w-full border p-2"
          >
            <option value="">Select Quantity Type</option>
            <option value="KG">KG</option>
            <option value="L">L</option>
            <option value="Piece">Piece</option>
          </select>
          <input
            name="base_price"
            value={form.base_price}
            onChange={handleChange}
            placeholder="Base Price"
            type="number"
            className="w-full border p-2"
          />
          <input
            name="received_at"
            value={form.received_at}
            onChange={handleChange}
            placeholder="Received At (e.g. 12.12.2025)"
            type="text"
            className="w-full border p-2"
          />

          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-4 py-2 rounded w-full"
          >
            Add Stock
          </button>
        </div>
      </div>
    </div>
  );
};
