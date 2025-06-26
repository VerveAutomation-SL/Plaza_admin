"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pencil, Trash2 } from "lucide-react";
import {
  getAllEmployees,
  deleteEmployee,
} from "@/lib/api/employeeApi";
import { Modal } from "@/components/ui/modal/UpdateEmployeeModal";
import { toast } from "react-hot-toast";

interface Employee {
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
}

export default function BasicTableOne() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  const fetchEmployees = async () => {
    try {
      const res = await getAllEmployees();
      setEmployees(res);
    } catch (error: unknown) {
      console.error("Failed to fetch employees:", error);
    }
  };

  const handleDelete = (emp: Employee) => {
    toast.custom((t) => (
      <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/40 backdrop-blur-lg mt-80">
        <div className="bg-white dark:bg-gray-800 px-8 py-6 rounded-xl shadow-xl border border-gray-300 max-w-md w-full z-[99999]">
          <p className="text-gray-800 dark:text-white mb-6 text-center text-lg font-semibold">
            Are you sure you want to delete this employee?
          </p>
          <div className="flex justify-center gap-4">
            <button
              onClick={async () => {
                try {
                  setIsDeleting(emp.employee_code);
                  await deleteEmployee(emp.employee_code);
                  setEmployees(prev => prev.filter(e => e.employee_code !== emp.employee_code));
                  toast.dismiss(t.id);
                  toast.success("Employee deleted successfully.", {
                    style: { top: "5rem" },
                    position: "top-center",
                  });
                } catch (error) {
                  console.error("Error deleting employee:", error);
                  toast.dismiss(t.id);
                  toast.error("Failed to delete employee.", {
                    style: { top: "5rem" },
                    position: "top-center",
                  });
                } finally {
                  setIsDeleting(null);
                }
              }}
              className="px-5 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
            >
              OK
            </button>
            <button
              onClick={() => {
                toast.dismiss(t.id);
                toast.error("Deletion cancelled.", {
                  style: { top: "5rem" },
                  position: "top-center"
                });
              }}
              className="px-5 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    ));
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <div className="w-full max-w-6xl">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell isHeader className="px-3 py-3 font-medium text-gray-500 text-theme-xs dark:text-gray-400">Code</TableCell>
                <TableCell isHeader className="px-3 py-3 font-medium text-gray-500 text-theme-xs dark:text-gray-400">Name</TableCell>
                <TableCell isHeader className="px-3 py-3 font-medium text-gray-500 text-theme-xs dark:text-gray-400">NIC</TableCell>
                <TableCell isHeader className="px-3 py-3 font-medium text-gray-500 text-theme-xs dark:text-gray-400">Mobile</TableCell>
                <TableCell isHeader className="px-3 py-3 font-medium text-gray-500 text-theme-xs dark:text-gray-400">Email</TableCell>
                <TableCell isHeader className="px-3 py-3 font-medium text-gray-500 text-theme-xs dark:text-gray-400">Start Date</TableCell>
                <TableCell isHeader className="px-3 py-3 font-medium text-gray-500 text-theme-xs dark:text-gray-400">Shop</TableCell>
                <TableCell isHeader className="px-3 py-3 font-medium text-gray-500 text-theme-xs dark:text-gray-400">Actions</TableCell>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {employees.map((emp) => (
                <TableRow key={emp.employee_code}>
                  <TableCell className="px-3 py-4 text-theme-sm text-gray-500 dark:text-gray-400">{emp.employee_code}</TableCell>
                  <TableCell className="px-3 py-4 text-theme-sm text-gray-500 dark:text-gray-400">{emp.full_name}</TableCell>
                  <TableCell className="px-3 py-4 text-theme-sm text-gray-500 dark:text-gray-400">{emp.nic_no}</TableCell>
                  <TableCell className="px-3 py-4 text-theme-sm text-gray-500 dark:text-gray-400">{emp.mobile_tp}</TableCell>
                  <TableCell className="px-3 py-4 text-theme-sm text-gray-500 dark:text-gray-400">{emp.email}</TableCell>
                  <TableCell className="px-3 py-4 text-theme-sm text-gray-500 dark:text-gray-400">
                    {new Date(emp.employment_start_date).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="px-3 py-4 text-theme-sm text-gray-500 dark:text-gray-400">
                    {emp.Shop?.shop_name || "N/A"}
                  </TableCell>
                  <TableCell className="px-3 py-4 text-theme-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-2">
                      <button
                        className="text-blue-500 hover:text-blue-700"
                        onClick={() => {
                          setSelectedEmployee(emp);
                          setIsEmployeeModalOpen(true);
                        }}
                      >
                        <Pencil size={16} />
                      </button>
                      /
                      <button
                        className="text-red-500 hover:text-red-700"
                        onClick={() => handleDelete(emp)}
                        disabled={isDeleting === emp.employee_code}
                      >
                        {isDeleting === emp.employee_code ? "..." : <Trash2 size={16} />}
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {selectedEmployee && (
        <Modal
          isOpen={isEmployeeModalOpen}
          onClose={() => setIsEmployeeModalOpen(false)}
          initialData={selectedEmployee}
        />
      )}
    </div>
  );
}
