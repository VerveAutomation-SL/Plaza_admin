"use client";

import React from "react";
import Image from "next/image";
import { X } from "lucide-react";

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
  quantity_type?: string | null;
  discount_percentage: number;
  is_discount_active: boolean;
  discountSellingPrice: number;
}

interface ViewProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  variants: ProductVariant[];
}

const ViewProductModal: React.FC<ViewProductModalProps> = ({ isOpen, onClose, variants }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[99999] flex items-start justify-center overflow-y-auto bg-black/30 backdrop-blur-[32px]">
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative mt-10 w-full max-w-3xl rounded-xl bg-white p-6 shadow-lg dark:bg-gray-900"
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
        >
          <X size={20} />
        </button>

        <h2 className="mb-4 text-xl font-semibold text-gray-800 dark:text-white">
          Product Details
        </h2>

        <div className="space-y-4">
          {variants.map((variant) => (
            <div
              key={variant.productVarient_code}
              className="rounded border border-gray-200 p-4 dark:border-gray-700"
            >
              <div className="flex items-center gap-4">
                <Image
                  src={variant.image_url || "/images/default-product.png"}
                  width={60}
                  height={60}
                  alt={variant.product_name}
                  className="rounded-md object-cover"
                />
                <div className="space-y-1">
                  <p className="text-lg font-medium text-gray-900 dark:text-white">
                    {variant.product_name} ({variant.size})
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {variant.product_description}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Barcode: {variant.barcode}
                  </p>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2 text-sm text-gray-700 dark:text-gray-300">
                <div>Product Code: {variant.product_code}</div>
                <div>Variant Code: {variant.productVarient_code}</div>
                <div>Shop ID: {variant.shop_id}</div>
                <div>Main Category: {variant.mCategory_code}</div>
                <div>Sub Category: {variant.sCategory_code}</div>
                <div>Quantity Type: {variant.quantity_type || "N/A"}</div>
                <div>Price: Rs. {variant.selling_price}</div>
                <div>Discount: {variant.discount_percentage}%</div>
                <div>Discount Price: Rs. {variant.discountSellingPrice}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ViewProductModal;
