"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";

import Image from "next/image";
import { getShops, deleteShop } from "@/lib/api/shopApi";
import { Pencil, Trash2 } from "lucide-react";
import { Modal } from "../ui/modal/UpdateShopModal";
import { toast } from "react-hot-toast";

interface Shop {
  id: string;
  shop_name: string;
  description: string;
  image_url: string;
  location: string;
  contact_number: string;
  email: string;
  owner_id: number;
  AdminUser: {
    id: number;
    full_name: string;
  };
  Business: {
    business_code: string;
    business_name: string;
  };
}

export default function BasicTableOne() {
  const [shops, setShops] = useState<Shop[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null);

  useEffect(() => {
    const fetchShops = async () => {
      try {
        const res = await getShops();
        setShops(res);
      } catch (error) {
        console.error("Failed to fetch shops:", error);
      }
    };
    fetchShops();
  }, []);

  const handleDelete = (shop: Shop) => {
    toast.custom((t) => (
      <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/40 backdrop-blur-lg mt-80">
        <div className="bg-white dark:bg-gray-800 px-8 py-6 rounded-xl shadow-xl border border-gray-300 max-w-md w-full z-[99999]">
          <p className="text-gray-800 dark:text-white mb-6 text-center text-lg font-semibold">
            Are you sure you want to delete this shop?
          </p>
          <div className="flex justify-center gap-4">
            <button
              onClick={async () => {
                try {
                  await deleteShop(shop.id);
                  setShops((prev) => prev.filter((s) => s.id !== shop.id));
                  toast.dismiss(t.id);
                  toast.success("Shop deleted successfully.", {
                    style: { top: "5rem" },
                    position: "top-center",
                  });
                } catch (error) {
                  console.error("Error deleting shop:", error);
                  toast.dismiss(t.id);
                  toast.error("Failed to delete shop.", {
                    style: { top: "5rem" },
                    position: "top-center",
                  });
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
                  position: "top-center",
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

  const handleEditClick = (shop: Shop) => {
    setSelectedShop(shop);
    setIsModalOpen(true);
  };

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <div className="w-full max-w-6xl">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell isHeader className="px-3 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Image</TableCell>
                <TableCell isHeader className="px-3 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Shop Name</TableCell>
                <TableCell isHeader className="px-3 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Location</TableCell>
                <TableCell isHeader className="px-3 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Contact</TableCell>
                <TableCell isHeader className="px-3 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Owner</TableCell>
                <TableCell isHeader className="px-3 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Business</TableCell>
                <TableCell isHeader className="px-3 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Actions</TableCell>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {Array.isArray(shops) && shops.map((shop) => (
                <TableRow key={shop.id}>
                  <TableCell className="px-3 py-4 sm:px-4 text-start">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 overflow-hidden rounded-full">
                        <Image
                          width={40}
                          height={40}
                          src={shop.image_url || "/images/default-product.png"}
                          alt={shop.shop_name}
                        />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-3 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {shop.shop_name}
                  </TableCell>
                  <TableCell className="px-3 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {shop.location}
                  </TableCell>
                  <TableCell className="px-3 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {shop.contact_number}
                  </TableCell>
                  <TableCell className="px-3 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {shop.AdminUser.full_name}
                  </TableCell>
                  <TableCell className="px-3 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {shop.Business.business_name}
                  </TableCell>
                  <TableCell className="px-3 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    <div className="flex items-center gap-2">
                      <button
                        className="text-blue-500 hover:text-blue-700"
                        onClick={() => handleEditClick(shop)}
                      >
                        <Pencil size={16} />
                      </button>
                      /
                      <button
                        className="text-red-500 hover:text-red-700"
                        onClick={() => handleDelete(shop)}
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

      {selectedShop && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          initialData={selectedShop}
        />
      )}
    </div>
  );
}
