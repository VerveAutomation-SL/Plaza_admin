"use client";

import React, { useEffect, useRef, useState } from "react";
import { updateSubCategory } from "@/lib/api/categoryApi";
import { useDropdowns } from "@/context/DropdownContext";
import toast from "react-hot-toast";

interface UpdateSubCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData: {
    SCategory_code: string;
    SCategory_name: string;
    MainCategory_code: string;
  };
  onUpdate: (updated: {
    SCategory_code: string;
    SCategory_name: string;
    MainCategory_code: string;
  }) => void;
}

export const UpdateSubCategoryModal: React.FC<UpdateSubCategoryModalProps> = ({
  isOpen,
  onClose,
  initialData,
  onUpdate,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const { mainCategoryOptions } = useDropdowns();

  const [subCategoryData, setSubCategoryData] = useState({
    SCategory_code: "",
    SCategory_name: "",
    MainCategory_code: "",
  });

  useEffect(() => {
    if (initialData) {
      setSubCategoryData(initialData);
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setSubCategoryData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      const updatedPayload = {
        SCategory_code: subCategoryData.SCategory_code,
        SCategory_name: subCategoryData.SCategory_name,
        MainCategory_code: subCategoryData.MainCategory_code,
      };

      await updateSubCategory(updatedPayload);

      // Notify parent to update local state
      onUpdate(updatedPayload);

      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update SubCategory.", { position: "top-center" });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center overflow-y-auto">
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
            name="SCategory_name"
            value={subCategoryData.SCategory_name}
            onChange={handleChange}
            placeholder="SubCategory Name"
            className="w-full border p-2"
          />

          <select
            name="MainCategory_code"
            value={subCategoryData.MainCategory_code}
            onChange={handleChange}
            className="w-full border p-2"
          >
            <option value="">Select Main Category</option>
            {mainCategoryOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Update SubCategory
          </button>
        </div>
      </div>
    </div>
  );
};
