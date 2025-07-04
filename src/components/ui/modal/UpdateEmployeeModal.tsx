"use client";

import React, { useRef, useEffect, useState } from "react";
import { updateEmployee } from "@/lib/api/employeeApi";
import { toast } from "react-hot-toast";

interface UpdateEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData: {
    employee_code: string;
    full_name: string;
    nic_no: string;
    mobile_tp: string;
    email: string;
    employment_start_date: string;
    Shop: {
      id: string;
      shop_name: string;
    };
  };
}

export const Modal: React.FC<UpdateEmployeeModalProps> = ({
  isOpen,
  onClose,
  initialData,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [employeeData, setEmployeeData] = useState({
    employee_code: "",
    full_name: "",
    father_name: "",
    nic_no: "",
    mobile_tp: "",
    home_tp: "",
    family_member_tp: "",
    address: "",
    email: "",
    image_url: "",
    employment_start_date: "",
    shop_id: "",
  });

  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    if (initialData) {
      setEmployeeData((prev) => ({
        ...prev,
        employee_code: initialData.employee_code,
        full_name: initialData.full_name,
        nic_no: initialData.nic_no,
        mobile_tp: initialData.mobile_tp,
        email: initialData.email,
        employment_start_date: initialData.employment_start_date,
        shop_id: initialData.Shop.id,
      }));
    }
  }, [initialData]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    if (isOpen) document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEmployeeData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        ...employeeData,
        image_url: file ? file.name : employeeData.image_url,
      };
      await updateEmployee(employeeData.employee_code, payload);
      toast.success("Employee updated successfully.", {
        position: "top-center",
      });
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update employee.", {
        position: "top-center",
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-99999 flex items-center justify-center overflow-y-auto">
      <div
        className="fixed inset-0 h-full w-full bg-gray-400/50 backdrop-blur-[32px]"
        onClick={onClose}
      ></div>

      <div
        ref={modalRef}
        className="relative w-full max-w-xl rounded-3xl bg-white dark:bg-gray-900 p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-3 top-3 z-10 h-10 w-10 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200"
        >
          X
        </button>

        <div className="space-y-4">
          <input name="full_name" value={employeeData.full_name} onChange={handleChange} placeholder="Full Name" className="w-full border p-2" />
          <input name="nic_no" value={employeeData.nic_no} onChange={handleChange} placeholder="NIC Number" className="w-full border p-2" />
          <input name="mobile_tp" value={employeeData.mobile_tp} onChange={handleChange} placeholder="Mobile Number" className="w-full border p-2" />
          <input name="email" value={employeeData.email} onChange={handleChange} placeholder="Email Address" className="w-full border p-2" />
          <input name="shop_id" value={employeeData.shop_id} onChange={handleChange} placeholder="Shop Code" className="w-full border p-2" />
          <input type="date" name="employment_start_date" value={employeeData.employment_start_date} onChange={handleChange} className="w-full border p-2" />
          <textarea name="address" value={employeeData.address} onChange={handleChange} placeholder="Address" className="w-full border p-2" />
          <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} className="w-full border p-2" />

          <button onClick={handleSubmit} className="bg-blue-600 text-white px-4 py-2 rounded">
            Update Employee
          </button>
        </div>
      </div>
    </div>
  );
};
