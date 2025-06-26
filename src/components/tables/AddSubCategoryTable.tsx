"use client";

import React, { useEffect, useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "../ui/table";
import { getAllSubCategories, deleteSubCategory } from "@/lib/api/categoryApi";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { UpdateSubCategoryModal } from "../ui/modal/UpdateSubCategoryModal";

interface SubCategory {
    SCategory_code: string;
    SCategory_name: string;
    MainCategory: {
        mCategory_code: string;
        mCategory_name: string;
    };
}

export default function BasicTableOneSubCategory() {
    const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedSubCategory, setSelectedSubCategory] = useState<SubCategory | null>(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await getAllSubCategories();
                setSubCategories(res.data);
            } catch (err) {
                console.error("Error loading subcategories:", err);
            }
        }
        fetchData();
    }, []);

    const handleDelete = (sub: SubCategory) => {
        toast.custom((t) => (
            <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/40 backdrop-blur-lg mt-80">
                <div className="bg-white px-8 py-6 rounded-xl shadow-xl border max-w-md w-full z-[99999]">
                    <p className="mb-6 text-center text-lg font-semibold text-gray-800">
                        Are you sure you want to delete{" "}
                        <span className="font-bold">{sub.SCategory_name}</span>?
                    </p>
                    <div className="flex justify-center gap-4">
                        <button
                            onClick={async () => {
                                try {
                                    await deleteSubCategory({ SubCategory_code: sub.SCategory_code });
                                    setSubCategories((prev) =>
                                        prev.filter((item) => item.SCategory_code !== sub.SCategory_code)
                                    );
                                    toast.dismiss(t.id);
                                    toast.success("Subcategory deleted successfully", {
                                        position: "top-center",
                                        style: { top: "5rem" },
                                    });
                                } catch {
                                    toast.dismiss(t.id);
                                    toast.error("Failed to delete subcategory", {
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

    const handleEdit = (sub: SubCategory) => {
        setSelectedSubCategory(sub);
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
                                    SubCategory Code
                                </TableCell>
                                <TableCell isHeader className="px-4 py-3 text-left font-semibold text-gray-700">
                                    SubCategory Name
                                </TableCell>
                                <TableCell isHeader className="px-4 py-3 text-left font-semibold text-gray-700">
                                    Main Category
                                </TableCell>
                                <TableCell isHeader className="px-4 py-3 text-left font-semibold text-gray-700">
                                    Actions
                                </TableCell>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {subCategories.map((sub) => (
                                <TableRow key={sub.SCategory_code} className="odd:bg-white even:bg-gray-50">
                                    <TableCell className="px-4 py-2">{sub.SCategory_code}</TableCell>
                                    <TableCell className="px-4 py-2">{sub.SCategory_name}</TableCell>
                                    <TableCell className="px-4 py-2">{sub.MainCategory.mCategory_name}</TableCell>
                                    <TableCell className="px-4 py-2">
                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={() => handleEdit(sub)}
                                                className="text-blue-500 hover:text-blue-700"
                                            >
                                                <Pencil size={16} />
                                            </button>{" "}
                                            /
                                            <button
                                                onClick={() => handleDelete(sub)}
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

            {selectedSubCategory && (
                <UpdateSubCategoryModal
                    isOpen={isModalOpen}
                    onClose={() => {
                        setIsModalOpen(false);
                        setSelectedSubCategory(null);
                    }}
                    initialData={{
                        SCategory_code: selectedSubCategory.SCategory_code,
                        SCategory_name: selectedSubCategory.SCategory_name,
                        MainCategory_code: selectedSubCategory.MainCategory.mCategory_code,
                    }}
                />
            )}
        </>
    );
}
