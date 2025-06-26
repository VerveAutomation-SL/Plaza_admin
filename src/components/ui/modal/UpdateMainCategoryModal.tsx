"use client";

import React, { useEffect, useRef, useState } from "react";
import { updateMainCategory } from "@/lib/api/categoryApi";
import { toast } from "react-hot-toast";

interface UpdateMainCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData: {
    mCategory_code: string;
    mCategory_name: string;
  };
}

export const UpdateMainCategoryModal: React.FC<UpdateMainCategoryModalProps> = ({
  isOpen,
  onClose,
  initialData,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [categoryData, setCategoryData] = useState({
    mCategory_code: "",
    mCategory_name: "",
  });

  useEffect(() => {
    if (initialData) {
      setCategoryData({
        mCategory_code: initialData.mCategory_code,
        mCategory_name: initialData.mCategory_name,
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCategoryData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      await updateMainCategory(categoryData);
      toast.success("Main Category updated successfully!", {
        position: "top-center",
      });
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update Main Category.", {
        position: "top-center",
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center overflow-y-auto">
      <div className="fixed inset-0 bg-gray-400/50 backdrop-blur-[32px]" onClick={onClose}></div>
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
            name="mCategory_name"
            value={categoryData.mCategory_name}
            onChange={handleChange}
            placeholder="Main Category Name"
            className="w-full border p-2"
          />

          <button onClick={handleSubmit} className="bg-blue-600 text-white px-4 py-2 rounded">
            Update Main Category
          </button>
        </div>
      </div>
    </div>
  );
};
