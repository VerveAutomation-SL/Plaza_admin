import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import BasicTableOne from "@/components/tables/BasicTableOne";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Product",
  description: "This is Product varient Page",
};

export default function BlankPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Product Varient" />
      <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
        <div className="mx-auto w-full max-w-[1440px] text-center">
          <BasicTableOne />
        </div>
      </div>
    </div>
  );
}
