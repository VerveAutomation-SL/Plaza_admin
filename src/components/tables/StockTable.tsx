"use client";

import React, { useState } from "react";
import { Modal } from "../ui/modal/AddStockModal";

interface Product {
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

interface StockTableProps {
  filteredProducts: Product[];
  prefillVariantCode?: string | null;
}

const BasicTableOne: React.FC<StockTableProps> = ({
  filteredProducts,
  prefillVariantCode,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVariantId, setSelectedVariantId] = useState<string>("");

  const [form, setForm] = useState({
    quantity: "",
    quantityType: "",
    base_price: "",
    received_at: "",
  });

  const handleAddStock = (variantId: string) => {
    setSelectedVariantId(variantId);
    setForm({
      quantity: "",
      quantityType: "",
      base_price: "",
      received_at: "",
    });
    setIsModalOpen(true);
  };

  // Use filtered list based on variant code, if provided
  const displayedProducts = prefillVariantCode
    ? filteredProducts.filter(
        (product) => product.productVarient_code === prefillVariantCode
      )
    : filteredProducts;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full table-auto border border-gray-300 rounded-md">
        <thead className="bg-gray-100 text-left">
          <tr>
            <th className="p-3 border">Image</th>
            <th className="p-3 border">Variant Name</th>
            <th className="p-3 border">Product Code</th>
            <th className="p-3 border">Stocks</th>
            <th className="p-3 border">Add Stock</th>
          </tr>
        </thead>
        <tbody>
          {displayedProducts.length > 0 ? (
            displayedProducts.map((product) => (
              <tr key={product.productVarient_code} className="border-t">
                <td className="p-3 border">
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={product.product_name}
                      className="h-12 w-12 object-contain"
                    />
                  ) : (
                    <span className="text-gray-400">No Image</span>
                  )}
                </td>
                <td className="p-3 border">{product.product_name}</td>
                <td className="p-3 border">{product.product_code}</td>
                <td className="p-3 border">{product.total_quantity}</td>
                <td className="p-3 border">
                  <button
                    className="bg-blue-600 text-white px-3 py-1 rounded"
                    onClick={() => handleAddStock(product.productVarient_code)}
                  >
                    Add Stock
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr key="no-results">
              <td colSpan={5} className="p-3 text-center text-gray-500">
                No matching products found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Stock Modal */}
      {isModalOpen && (
        <Modal
          variantId={selectedVariantId}
          form={form}
          setForm={setForm}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default BasicTableOne;
