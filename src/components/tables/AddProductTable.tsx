"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";

import Image from "next/image";
import { getAllProducts } from "@/lib/api/productApi";
import { Eye, Trash2 } from "lucide-react";
import ViewProductModal from "../ui/modal/ViewProductModal";
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

export default function BasicTableOne() {
  const [productVariants, setProductVariants] = useState<ProductVariant[]>([]);
  const [viewVariants, setViewVariants] = useState<ProductVariant[] | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getAllProducts();
        if (Array.isArray(res?.formattedProducts)) {
          setProductVariants(res.formattedProducts);
        } else {
          console.error("Unexpected response format:", res);
        }
      } catch (error) {
        console.error("Failed to fetch product variants:", error);
      }
    };
    fetchData();
  }, []);

  const handleDelete = (variant: ProductVariant) => {
    toast.custom((t) => (
      <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/40 backdrop-blur-lg mt-80">
        <div className="bg-white dark:bg-gray-800 px-8 py-6 rounded-xl shadow-xl border border-gray-300 max-w-md w-full z-[99999]">
          <p className="text-gray-800 dark:text-white mb-6 text-center text-lg font-semibold">
            Are you sure you want to delete this product variant?
          </p>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => {
                toast.dismiss(t.id);
                toast.success("Delete function not yet implemented.", {
                  style: { top: "5rem" },
                  position: "top-center",
                });
              }}
              className="px-5 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
            >
              OK
            </button>
            <button
              onClick={() => {
                toast.dismiss(t.id);
                toast.error("Deletion cancelled.", {
                  style: { top: "5rem" },
                  position: "top-center",
                });
              }}
              className="px-5 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    ));
  };

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <div className="w-full max-w-6xl">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell isHeader className="px-3 py-3 font-medium text-gray-500 text-start">Image</TableCell>
                <TableCell isHeader className="px-3 py-3 font-medium text-gray-500 text-start">Product Name</TableCell>
                <TableCell isHeader className="px-3 py-3 font-medium text-gray-500 text-start">Selling Price</TableCell>
                <TableCell isHeader className="px-3 py-3 font-medium text-gray-500 text-start">Discount %</TableCell>
                <TableCell isHeader className="px-3 py-3 font-medium text-gray-500 text-start">Discount Price</TableCell>
                <TableCell isHeader className="px-3 py-3 font-medium text-gray-500 text-start">Actions</TableCell>
                <TableCell isHeader className="px-3 py-3 font-medium text-gray-500 text-start">View Product</TableCell>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {productVariants.map((variant) => (
                <TableRow key={variant.productVarient_code}>
                  <TableCell className="px-3 py-4 text-start">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 overflow-hidden rounded-full">
                        <Image
                          width={40}
                          height={40}
                          src={variant.image_url || "/images/default-product.png"}
                          alt={variant.product_name}
                        />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-3 py-3 text-start">{variant.product_name}</TableCell>
                  <TableCell className="px-3 py-3 text-start">{variant.selling_price}</TableCell>
                  <TableCell className="px-3 py-3 text-start">{variant.discount_percentage}%</TableCell>
                  <TableCell className="px-3 py-3 text-start">{variant.discountSellingPrice}</TableCell>
                  <TableCell className="px-3 py-3 text-start">
                    <div className="flex items-center gap-2">
                      <button className="text-red-500 hover:text-red-700" onClick={() => handleDelete(variant)}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </TableCell>
                  <TableCell className="px-3 py-3 text-start">
                    <button
                      className="flex items-center gap-1 text-sm text-indigo-600 hover:underline"
                      onClick={() =>
                        setViewVariants(productVariants.filter(p => p.product_code === variant.product_code))
                      }
                    >
                      <Eye size={16} /> View
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {viewVariants && (
        <ViewProductModal
          isOpen={!!viewVariants}
          onClose={() => setViewVariants(null)}
          variants={viewVariants}
        />
      )}
    </div>
  );
}
