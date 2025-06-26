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
import {
  getAllMainCategories,
  deleteMainCategory,
} from "@/lib/api/categoryApi";
import { toast } from "react-hot-toast";
import { UpdateMainCategoryModal } from "../ui/modal/UpdateMainCategoryModal";

interface MainCategory {
  mCategory_code: string;
  mCategory_name: string;
}

export default function BasicTableOneMainCategory() {
  const [categories, setCategories] = useState<MainCategory[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<MainCategory | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await getAllMainCategories();
        setCategories(res.data);
      } catch (err) {
        console.error("Failed to load categories:", err);
      }
    }
    fetchData();
  }, []);

  const handleDelete = (cat: MainCategory) => {
    toast.custom((t) => (
      <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/40 backdrop-blur-lg mt-80">
        <div className="bg-white px-8 py-6 rounded-xl shadow-xl border max-w-md w-full z-[99999]">
          <p className="mb-6 text-center text-lg font-semibold text-gray-800">
            Are you sure you want to delete{" "}
            <span className="font-bold">{cat.mCategory_name}</span>?
          </p>
          <div className="flex justify-center gap-4">
            <button
              onClick={async () => {
                try {
                  await deleteMainCategory({ mCategory_code: cat.mCategory_code });
                  setCategories((prev) =>
                    prev.filter((item) => item.mCategory_code !== cat.mCategory_code)
                  );
                  toast.dismiss(t.id);
                  toast.success("Category deleted successfully", {
                    position: "top-center",
                    style: { top: "5rem" },
                  });
                } catch (error) {
                  console.error(error);
                  toast.dismiss(t.id);
                  toast.error("Failed to delete category", {
                    position: "top-center",
                    style: { top: "5rem" },
                  });
                }
              }}
              className="px-5 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
            >
              OK
            </button>
            <button
              onClick={() => toast.dismiss(t.id)}
              className="px-5 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    ));
  };

  const handleEdit = (cat: MainCategory) => {
    setSelectedCategory(cat);
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <Table className="min-w-full divide-y divide-gray-200 text-sm">
            <TableHeader className="bg-gray-100">
              <TableRow>
                <TableCell isHeader className="px-4 py-3 text-left font-semibold text-gray-700">
                  Main Category Code
                </TableCell>
                <TableCell isHeader className="px-4 py-3 text-left font-semibold text-gray-700">
                  Main Category Name
                </TableCell>
                <TableCell isHeader className="px-4 py-3 text-left font-semibold text-gray-700">
                  Actions
                </TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((cat) => (
                <TableRow key={cat.mCategory_code} className="odd:bg-white even:bg-gray-50">
                  <TableCell className="px-4 py-2">{cat.mCategory_code}</TableCell>
                  <TableCell className="px-4 py-2">{cat.mCategory_name}</TableCell>
                  <TableCell className="px-4 py-2">
                    <div className="flex items-center gap-3">
                      <button
                        className="text-blue-500 hover:text-blue-700"
                        onClick={() => handleEdit(cat)}
                      >
                        <Pencil size={16} />
                      </button>{" "}
                      /
                      <button
                        onClick={() => handleDelete(cat)}
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

      {selectedCategory && (
        <UpdateMainCategoryModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedCategory(null);
          }}
          initialData={selectedCategory}
        />
      )}
    </>
  );
}
