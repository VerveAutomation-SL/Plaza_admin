"use client";

export const dynamic = "force-dynamic";

import React, { useEffect, useState, Suspense } from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import BasicTableOne from "@/components/tables/StockTable";
import { getAllProducts } from "@/lib/api/productApi";
import { useSearchParams } from "next/navigation";

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

function StockPageContent() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const searchParams = useSearchParams();
  const prefillVariantCode = searchParams.get("productVarient_code");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getAllProducts();
        setProducts(response.formattedProducts || []);
      } catch (error) {
        console.error("Failed to fetch products", error);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = products.filter(
    (p) =>
      p.product_name.toLowerCase().includes(search.toLowerCase()) ||
      p.product_code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <PageBreadcrumb pageTitle="Product Stocks" />
      <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
        <div className="mx-auto w-full max-w-[1000px]">
          {/* Search Bar */}
          <div className="mb-6">
            <input
              type="text"
              placeholder="Search by name or code..."
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Table */}
          <BasicTableOne
            filteredProducts={filteredProducts}
            prefillVariantCode={prefillVariantCode}
          />
        </div>
      </div>
    </>
  );
}

export default function StockPage() {
  return (
    <Suspense fallback={<div className="p-6 text-gray-500">Loading stock page...</div>}>
      <StockPageContent />
    </Suspense>
  );
}
