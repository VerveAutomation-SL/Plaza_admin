import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import DefaultInputs from "@/components/form/form-elements/DefaultInputs/AddBusinessInputs";
import BusinessTable from "@/components/tables/BusinessTable";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Businesses",
  description: "This is Add Business Page",
};

export default function BusinessPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Add Business" />
      <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
        <div className="mx-auto w-full">
          <div className="w-full pb-6">
            <div className="space-y-6">
              <DefaultInputs
                cardTitle="Add New Business"
                businessNameLabel="Business Name"
                descriptionLabel="Business Description"
              />
            </div>
          </div>
          <BusinessTable />
        </div>
      </div>
    </div>
  );
}
