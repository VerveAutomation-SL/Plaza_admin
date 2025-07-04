// src/components/ui/modal/ViewOrdersModal.tsx
"use client";
import React from "react";

interface OrderItem {
  id: number;
  variant_id: string;
  quantity: number;
  unit_price: number;
}

interface ViewOrdersModalProps {
  isOpen: boolean;
  items: OrderItem[];
  onClose: () => void;
}

export default function ViewOrdersModal({ isOpen, items, onClose }: ViewOrdersModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-[99999]">
      <div className="bg-white rounded-lg shadow-xl max-w-xl w-full p-6">
        <h2 className="text-lg font-bold mb-4 text-gray-800">Order Items</h2>
        <div className="overflow-x-auto">
          <table className="w-full border text-sm">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="text-left px-4 py-2">Variant ID</th>
                <th className="text-left px-4 py-2">Quantity</th>
                <th className="text-left px-4 py-2">Unit Price</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-t">
                  <td className="px-4 py-2">{item.variant_id}</td>
                  <td className="px-4 py-2">{item.quantity}</td>
                  <td className="px-4 py-2">${item.unit_price.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 text-center">
          <button
            onClick={onClose}
            className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
