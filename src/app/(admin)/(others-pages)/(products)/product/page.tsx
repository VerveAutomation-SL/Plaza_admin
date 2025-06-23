import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import DefaultInputs from "@/components/form/form-elements/DefaultInputs/AddProductInputs";
import BasicTableOne from "@/components/tables/AddProductTable";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Product",
  description: "This is Add Product Page",
};

export default function BlankPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Add Product" />
      <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
        <div className="mx-auto w-full">
          <div className="w-full pb-6">
            <div className="space-y-6 ">
              <DefaultInputs
                cardTitle="Add New Product"
                productNameLabel="Name of the Product"
                shopLabel="Choose Shop Location"
                mainCategoryLabel="Primary Category"
                subCategoryLabel="Secondary Category"
                descriptionLabel="Describe the Product"
              />
            </div>
          </div>
          <BasicTableOne />
        </div>
      </div>
    </div>
  );
}