import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import DefaultInputs from "@/components/form/form-elements/DefaultInputs/AddMainCategoryInputs";
import BasicTableOne from "@/components/tables/AddMainCategoryTable";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Main Categories",
  description: "This is Add Main Category Page",
};

export default function MainCategoryPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Add Main Category" />
      <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
        <div className="mx-auto w-full">
          <div className="w-full pb-6">
            <div className="space-y-6">
              <DefaultInputs
                cardTitle="Add New Main Category"
                nameLabel="Main Category Name"
              />
            </div>
          </div>
          <BasicTableOne />
        </div>
      </div>
    </div>
  );
}
