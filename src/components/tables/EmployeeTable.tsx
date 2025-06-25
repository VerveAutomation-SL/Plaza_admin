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
    } catch (error: any) {
      console.error("Failed to fetch employees:", error);
    }
  };

  const handleDelete = async (employeeCode: string) => {
    const confirmDelete = confirm("Are you sure you want to delete this employee?");
    if (!confirmDelete) return;

    setIsDeleting(employeeCode);
    try {
      await deleteEmployee(employeeCode);
      setEmployees(prev => prev.filter(emp => emp.employee_code !== employeeCode));
    } catch (error: any) {
      console.error(`Failed to delete employee ${employeeCode}:`, error);
    } finally {
      setIsDeleting(null);
    }
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
                        onClick={() => handleDelete(emp.employee_code)}
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
