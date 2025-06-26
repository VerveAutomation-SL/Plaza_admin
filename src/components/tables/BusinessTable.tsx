"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Pencil, Trash2 } from "lucide-react";
import { getBusinesses } from "@/lib/api/businessApi";
import { Modal } from "../ui/modal/UpdateBusinessModal";
import type { Business } from "@/lib/api/businessApi";
import { toast } from "react-hot-toast";

export default function BusinessTable() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        const res = await getBusinesses();
        setBusinesses(res);
      } catch (error) {
        console.error("Failed to fetch businesses:", error);
      }
    };
    fetchBusinesses();
  }, []);

  const handleEditClick = (business: Business) => {
    setSelectedBusiness(business);
    setIsModalOpen(true);
  };

  const handleDelete = (biz: Business) => {
    toast.custom((t) => (
      <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/40 backdrop-blur-lg mt-80">
        <div className="bg-white dark:bg-gray-800 px-8 py-6 rounded-xl shadow-xl border border-gray-300 max-w-md w-full z-[99999]">
          <p className="text-gray-800 dark:text-white mb-6 text-center text-lg font-semibold">
            Are you sure you want to delete this business?
          </p>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => {
                toast.dismiss(t.id);
                toast.success("Delete function not yet implemented.", {
                  style: { top: "5rem" },
                  position: "top-center",
                });
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
                  position: "top-center" });
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

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <div className="w-full max-w-6xl">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell isHeader className="px-3 py-3 text-start font-medium text-gray-500 text-theme-xs dark:text-gray-400">Code</TableCell>
                <TableCell isHeader className="px-3 py-3 text-start font-medium text-gray-500 text-theme-xs dark:text-gray-400">Name</TableCell>
                <TableCell isHeader className="px-3 py-3 text-start font-medium text-gray-500 text-theme-xs dark:text-gray-400">Description</TableCell>
                <TableCell isHeader className="px-3 py-3 text-start font-medium text-gray-500 text-theme-xs dark:text-gray-400">Created</TableCell>
                <TableCell isHeader className="px-3 py-3 text-start font-medium text-gray-500 text-theme-xs dark:text-gray-400">Updated</TableCell>
                <TableCell isHeader className="px-3 py-3 text-start font-medium text-gray-500 text-theme-xs dark:text-gray-400">Actions</TableCell>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {Array.isArray(businesses) && businesses.map((biz) => (
                <TableRow key={biz.business_code}>
                  <TableCell className="px-3 py-4 text-start text-gray-500 text-theme-sm dark:text-gray-400">
                    {biz.business_code}
                  </TableCell>
                  <TableCell className="px-3 py-4 text-start text-gray-500 text-theme-sm dark:text-gray-400">
                    {biz.business_name}
                  </TableCell>
                  <TableCell className="px-3 py-4 text-start text-gray-500 text-theme-sm dark:text-gray-400">
                    {biz.description}
                  </TableCell>
                  <TableCell className="px-3 py-4 text-start text-gray-500 text-theme-sm dark:text-gray-400">
                    {biz.createdAt ? new Date(biz.createdAt).toLocaleString() : "N/A"}
                  </TableCell>
                  <TableCell className="px-3 py-4 text-start text-gray-500 text-theme-sm dark:text-gray-400">
                    {biz.updatedAt ? new Date(biz.updatedAt).toLocaleString() : "N/A"}
                  </TableCell>
                  <TableCell className="px-3 py-4 text-start text-gray-500 text-theme-sm dark:text-gray-400">
                    <div className="flex items-center gap-2">
                      <button
                        className="text-blue-500 hover:text-blue-700"
                        onClick={() => handleEditClick(biz)}
                      >
                        <Pencil size={16} />
                      </button>
                      /
                      <button
                        onClick={() => handleDelete(biz)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {selectedBusiness && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          initialData={selectedBusiness}
        />
      )}
    </div>
  );
}
