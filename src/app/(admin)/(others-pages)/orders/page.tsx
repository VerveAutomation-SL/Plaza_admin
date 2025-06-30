import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import BasicTableOne from "@/components/tables/ViewOrdersTable"; 
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Orders",
  description: "This is the Orders Page",
};

export default function OrdersPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="View Orders" />
      <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
        <div className="mx-auto w-full">
          <BasicTableOne />
        </div>
      </div>
    </div>
  );
}
