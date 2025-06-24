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
                        className="text-gray-300 cursor-not-allowed"
                        title="Delete API not available"
                        disabled
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
