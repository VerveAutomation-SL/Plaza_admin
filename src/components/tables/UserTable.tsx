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
import { getAllUsers, deleteUser } from "@/lib/api/authApi";
import { toast } from "react-hot-toast";

interface AdminUser {
  id: string;
  full_name: string;
  email: string;
  role: string;
}

export default function AdminUserTable() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      const res = await getAllUsers();
      setUsers(res);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  };

  const handleDelete = (user: AdminUser) => {
    toast.custom((t) => (
      <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/40 backdrop-blur-lg mt-80">
        <div className="bg-white dark:bg-gray-800 px-8 py-6 rounded-xl shadow-xl border border-gray-300 max-w-md w-full z-[99999]">
          <p className="text-gray-800 dark:text-white mb-6 text-center text-lg font-semibold">
            Are you sure you want to delete this user?
          </p>
          <div className="flex justify-center gap-4">
            <button
              onClick={async () => {
                try {
                  setIsDeleting(user.id);
                  await deleteUser(user.id);
                  setUsers((prev) => prev.filter((u) => u.id !== user.id));
                  toast.dismiss(t.id);
                  toast.success("User deleted successfully.", {
                    style: { top: "5rem" },
                    position: "top-center",
                  });
                } catch (error) {
                  console.error("Error deleting user:", error);
                  toast.dismiss(t.id);
                  toast.error("Failed to delete user.", {
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

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <div className="w-full max-w-4xl">
          <Table>
            <TableHeader className="border-b border-gray-200 dark:border-white/[0.05] bg-gray-50 dark:bg-gray-900">
              <TableRow>
                <TableCell isHeader className="px-4 py-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Name</TableCell>
                <TableCell isHeader className="px-4 py-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Email</TableCell>
                <TableCell isHeader className="px-4 py-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Role</TableCell>
                <TableCell isHeader className="px-4 py-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Actions</TableCell>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">{user.full_name}</TableCell>
                  <TableCell className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">{user.email}</TableCell>
                  <TableCell className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300 capitalize">{user.role}</TableCell>
                  <TableCell className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                    <div className="flex items-center gap-2">
                      <button className="text-blue-500 hover:text-blue-700">
                        <Pencil size={16} />
                      </button>
                      /
                      <button
                        className="text-red-500 hover:text-red-700"
                        onClick={() => handleDelete(user)}
                        disabled={isDeleting === user.id}
                      >
                        {isDeleting === user.id ? "..." : <Trash2 size={16} />}
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
