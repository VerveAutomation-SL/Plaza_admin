import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import DefaultInputs from "@/components/form/form-elements/DefaultInputs/AddProductVariantInputs";
import BasicTableOne from "@/components/tables/AddProductVarientTable";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Product Variant",
  description: "This is Add Product Variant Page",
};

export default function AddProductVariantPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Add Product Variant" />
      <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
        <div className="mx-auto w-full">
          <div className="w-full pb-6">
            <div className="space-y-6 ">
              <DefaultInputs
                cardTitle="Add New Product Variant"
                productNameLabel="Variant Name"
                shopLabel="Product Code"
                mainCategoryLabel="Size"
                subCategoryLabel="Selling Price"
                barcodeLabel="Barcode"
                discountLabel="Discount Percentage"
                discountToggleLabel="Is Discount Active"
                attributeLabel="Attributes"
                image_url="image_url"
              />
            </div>
          </div>
          <BasicTableOne />
        </div>
      </div>
    </div>
  );
}
