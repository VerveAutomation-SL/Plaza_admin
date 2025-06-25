"use client";

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { getProductByBarcode } from "@/lib/api/productApi";
import { Eye, Pencil, Trash2 } from "lucide-react";
import UpdateProductModal from "../ui/modal/UpdateProductVarient";
import ViewProductVariantModal from "../ui/modal/ViewProductVariantModal";

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
  const [barcode, setBarcode] = useState("");
  const [product, setProduct] = useState<ProductVariant | null>(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const router = useRouter();

  const handleSearch = async () => {
    try {
      const res = await getProductByBarcode(barcode);
      if (res?.product) {
        setProduct(res.product);
      } else {
        setProduct(null);
        console.warn("No product found for barcode", barcode);
      }
    } catch (error) {
      console.error("Failed to fetch product by barcode:", error);
    }
  };

  const handleAddStock = (product: ProductVariant) => {
    const queryParams = new URLSearchParams({
      product_name: product.product_name,
      productVarient_code: product.productVarient_code,
      barcode: product.barcode,
      selling_price: String(product.selling_price),
      discount_percentage: String(product.discount_percentage),
      discountSellingPrice: String(product.discountSellingPrice),
    }).toString();

    router.push(`/stock?${queryParams}`);
  };

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03] p-4">
      <div className="mb-4 flex gap-2">
        <input
          type="text"
          placeholder="Enter Barcode"
          value={barcode}
          onChange={(e) => setBarcode(e.target.value)}
          className="w-full rounded border px-3 py-2 text-sm text-gray-800 shadow-sm"
        />
        <button
          onClick={handleSearch}
          className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Search
        </button>
      </div>

      <div className="max-w-full overflow-x-auto">
        <div className="w-full max-w-4xl">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell isHeader className="px-3 py-3 font-medium text-start text-theme-xs text-gray-500 dark:text-gray-400">Image</TableCell>
                <TableCell isHeader className="px-3 py-3 font-medium text-start text-theme-xs text-gray-500 dark:text-gray-400">Product Name</TableCell>
                <TableCell isHeader className="px-3 py-3 font-medium text-start text-theme-xs text-gray-500 dark:text-gray-400">Selling Price</TableCell>
                <TableCell isHeader className="px-3 py-3 font-medium text-start text-theme-xs text-gray-500 dark:text-gray-400">Discount %</TableCell>
                <TableCell isHeader className="px-3 py-3 font-medium text-start text-theme-xs text-gray-500 dark:text-gray-400">Discount Price</TableCell>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {product && (
                <>
                  <TableRow key={product.productVarient_code}>
                    <TableCell className="px-3 py-3 text-start">
                      <div className="w-10 h-10 overflow-hidden rounded-full">
                        <Image
                          width={40}
                          height={40}
                          src={product.image_url || "/images/default-product.png"}
                          alt={product.product_name}
                        />
                      </div>
                    </TableCell>
                    <TableCell className="px-3 py-3 text-theme-sm text-gray-500 dark:text-gray-400">
                      {product.product_name}
                    </TableCell>
                    <TableCell className="px-3 py-3 text-theme-sm text-gray-500 dark:text-gray-400">
                      {product.selling_price}
                    </TableCell>
                    <TableCell className="px-3 py-3 text-theme-sm text-gray-500 dark:text-gray-400">
                      {product.discount_percentage}%
                    </TableCell>
                    <TableCell className="px-3 py-3 text-theme-sm text-gray-500 dark:text-gray-400">
                      {product.discountSellingPrice}
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <td colSpan={5} className="px-3 py-3 text-center">
                      <div className="flex flex-col gap-2 items-center">
                        <div className="flex justify-center gap-4">
                          <button
                            onClick={() => setIsViewModalOpen(true)}
                            className="flex items-center gap-1 rounded-md bg-blue-100 px-3 py-1 text-sm text-blue-600 hover:bg-blue-200"
                          >
                            <Eye size={16} /> View
                          </button>
                          <button
                            onClick={() => setIsUpdateModalOpen(true)}
                            className="flex items-center gap-1 rounded-md bg-yellow-100 px-3 py-1 text-sm text-yellow-700 hover:bg-yellow-200"
                          >
                            <Pencil size={16} /> Update
                          </button>
                          <button className="flex items-center gap-1 rounded-md bg-red-100 px-3 py-1 text-sm text-red-600 hover:bg-red-200">
                            <Trash2 size={16} /> Delete
                          </button>
                        </div>
                        <button
                          onClick={() => handleAddStock(product)}
                          className="flex items-center gap-1 rounded-md bg-green-100 px-3 py-1 text-sm text-green-700 hover:bg-green-200"
                        >
                          ➕ Add Stock
                        </button>
                      </div>
                    </td>
                  </TableRow>
                </>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {product && (
        <UpdateProductModal
          isOpen={isUpdateModalOpen}
          onClose={() => setIsUpdateModalOpen(false)}
          initialData={product}
        />
      )}

      <ViewProductVariantModal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} barcode={barcode} />
    </div>
  );
}
