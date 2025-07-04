"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Eye } from "lucide-react";
import { getAllOrders } from "@/lib/api/orderApi";
import { toast } from "react-hot-toast";
import ViewOrdersModal from "../ui/modal/ViewOrdersModal"; // Modal import

interface OrderItem {
  id: number;
  variant_id: string;
  quantity: number;
  unit_price: number;
}

interface Order {
  id: string;
  cashier_id: string;
  total_amount: number;
  createdAt: string;
  order_items: OrderItem[];
}

export default function BasicTableOne() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrderItems, setSelectedOrderItems] = useState<OrderItem[] | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await getAllOrders();
        setOrders(res);
      } catch (err) {
        console.error("Failed to load orders:", err);
        toast.error("Failed to fetch orders");
      }
    }
    fetchOrders();
  }, []);

  const handleViewOrder = (order: Order) => {
    setSelectedOrderItems(order.order_items);
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <Table className="min-w-full divide-y divide-gray-200 text-sm">
            <TableHeader className="bg-gray-100">
              <TableRow>
                <TableCell isHeader className="px-4 py-3 font-semibold text-gray-700">Order ID</TableCell>
                <TableCell isHeader className="px-4 py-3 font-semibold text-gray-700">Cashier ID</TableCell>
                <TableCell isHeader className="px-4 py-3 font-semibold text-gray-700">Total Amount</TableCell>
                <TableCell isHeader className="px-4 py-3 font-semibold text-gray-700">Created At</TableCell>
                <TableCell isHeader className="px-4 py-3 font-semibold text-gray-700">Actions</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id} className="odd:bg-white even:bg-gray-50">
                  <TableCell className="px-4 py-2">{order.id}</TableCell>
                  <TableCell className="px-4 py-2">{order.cashier_id}</TableCell>
                  <TableCell className="px-4 py-2">${order.total_amount.toFixed(2)}</TableCell>
                  <TableCell className="px-4 py-2">{new Date(order.createdAt).toLocaleString()}</TableCell>
                  <TableCell className="px-4 py-2">
                    <button
                      onClick={() => handleViewOrder(order)}
                      className="text-blue-500 hover:text-blue-700 flex items-center gap-1"
                    >
                      <Eye size={16} /> View
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <ViewOrdersModal
        isOpen={isModalOpen}
        items={selectedOrderItems || []}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
