import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import DefaultInputs from "@/components/form/form-elements/DefaultInputs/AddEmployeeInputs";
import BasicTableOne from "@/components/tables/EmployeeTable";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Employees",
  description: "This is Add Employee Page",
};

export default function EmployeePage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Add Employee" />
      <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
        <div className="mx-auto w-full">
          <div className="w-full pb-6">
            <div className="space-y-6">
              <DefaultInputs
                cardTitle="Add New Employee"
                fullNameLabel="Full Name"
                fatherNameLabel="Father's Name"
                nicNoLabel="NIC Number"
                mobileTpLabel="Mobile Number"
                homeTpLabel="Home Telephone"
                familyTpLabel="Family Member's TP"
                addressLabel="Address"
                emailLabel="Email Address"
                imageLabel="Profile Image"
                startDateLabel="Employment Start Date"
                shopCodeLabel="Shop Code"
              />
            </div>
          </div>
          <BasicTableOne />
        </div>
      </div>
    </div>
  );
}
