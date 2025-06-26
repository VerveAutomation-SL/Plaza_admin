import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import DefaultInputs from "@/components/form/form-elements/DefaultInputs/AddSubCategoryInputs";
import BasicTableOne from "@/components/tables/AddSubCategoryTable";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Sub Categories",
  description: "This is Add Sub Category Page",
};

export default function SubCategoryPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Add Sub Category" />
      <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
        <div className="mx-auto w-full">
          <div className="w-full pb-6">
            <div className="space-y-6">
              <DefaultInputs
                cardTitle="Add New Sub Category"
                nameLabel="Sub Category Name"
                mainCategoryLabel="Select Main Category"
              />
            </div>
          </div>
          <BasicTableOne />
        </div>
      </div>
    </div>
  );
}
