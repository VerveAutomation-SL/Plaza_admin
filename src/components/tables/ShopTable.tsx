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

  const handleDelete = async (shopCode: string) => {
    const confirmDelete = confirm("Are you sure you want to delete this shop?");
    if (!confirmDelete) return;

    try {
      await deleteShop(shopCode);
      setShops((prev) => prev.filter((shop) => shop.id !== shopCode));
      alert("Shop deleted successfully.");
    } catch (error) {
      console.error("Error deleting shop:", error);
      alert("Failed to delete shop.");
    }
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
                        onClick={() => handleDelete(shop.id)}
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
