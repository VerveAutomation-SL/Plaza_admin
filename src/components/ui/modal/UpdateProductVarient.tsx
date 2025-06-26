"use client";

import React, { useEffect, useRef, useState } from "react";
import { updateProductVariant } from "@/lib/api/productApi";
import { toast } from "react-hot-toast";

interface ProductVariant {
  product_code: string;
  productVarient_code: string;
  product_name: string;
  size: string;
  barcode: string;
  shop_id: string;
  mCategory_code: string;
  sCategory_code: string;
  product_description: string;
  image_url: string;
  selling_price: number;
  total_quantity: number;
  quantity_type: string | null;
  discount_percentage: number;
  is_discount_active: boolean;
  discountSellingPrice: number;
}

interface UpdateProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData: ProductVariant;
}

const UpdateProductModal: React.FC<UpdateProductModalProps> = ({
  isOpen,
  onClose,
  initialData,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState<ProductVariant>(initialData);

  useEffect(() => {
    setFormData(initialData);
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
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProductVariant({
        ...formData,
        productVariant_code: formData.productVarient_code,
      });
      toast.success("Product updated successfully.", {
        position: "top-center",
      });
      onClose();
    } catch (error) {
      console.error("Update failed:", error);
      toast.error("Failed to update product.", {
        position: "top-center",
      });
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

        <form onSubmit={handleSubmit} className="space-y-4">
          <h2 className="text-lg font-semibold">Update Product</h2>
          <input
            name="product_name"
            value={formData.product_name}
            onChange={handleChange}
            placeholder="Product Name"
            className="w-full border p-2"
          />
          <input
            type="number"
            name="selling_price"
            value={formData.selling_price}
            onChange={handleChange}
            placeholder="Selling Price"
            className="w-full border p-2"
          />
          <input
            type="number"
            name="discount_percentage"
            value={formData.discount_percentage}
            onChange={handleChange}
            placeholder="Discount %"
            className="w-full border p-2"
          />
          <input
            type="number"
            name="discountSellingPrice"
            value={formData.discountSellingPrice}
            onChange={handleChange}
            placeholder="Discount Price"
            className="w-full border p-2"
          />

          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateProductModal;
