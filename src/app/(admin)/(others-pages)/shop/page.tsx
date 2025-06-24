import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import DefaultInputs from "@/components/form/form-elements/DefaultInputs/AddShopInputs";
import BasicTableOne from "@/components/tables/ShopTable";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Shops",
  description: "This is Add Shop Page",
};

export default function ShopPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Add Shop" />
      <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
        <div className="mx-auto w-full">
          <div className="w-full pb-6">
            <div className="space-y-6 ">
              <DefaultInputs
                cardTitle="Add New Shop"
                shopNameLabel="Shop Name"
                businessCodeLabel="Business Code"
                locationLabel="Shop Location"
                contactNumberLabel="Contact Number"
                emailLabel="Email Address"
                descriptionLabel="Shop Description"
                imageLabel="Shop Image"
              />
            </div>
          </div>
          <BasicTableOne />
        </div>
      </div>
    </div>
  );
}
