"use client";

import React from "react";
import { Search, ShoppingCart } from "lucide-react";

export default function POSPage() {
  return (
    <div className="min-h-screen bg-white text-black grid grid-cols-3 gap-4 p-6">
      {/* Left - Available Products */}
      <div className="col-span-2 flex flex-col border-r pr-6">
        <h2 className="text-xl font-semibold mb-4">Available Products</h2>

        {/* Search bar */}
        <div className="relative mb-4">
          <input
            type="text"
            placeholder="search for products"
            className="w-full border rounded-full py-2 px-4 pl-10"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
        </div>

        {/* Products */}
        <div className="grid grid-cols-2 gap-4">
          {[1, 2].map((item) => (
            <div key={item} className="border rounded-md p-3 text-center bg-gray-100">
              <div className="w-full h-28 bg-gray-300 mb-2"></div>
              <h3 className="text-md font-medium">HeadPhones</h3>
              <p className="text-lg font-bold">25$</p>
              <button className="mt-2 border rounded-full px-4 py-1 hover:bg-gray-200">
                + Add
              </button>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="border-t mt-6 pt-4">
          <h2 className="text-xl font-semibold mb-2">Summary</h2>
          <div className="space-y-1 text-sm">
            <p>Total Items : XX</p>
            <p>Sub Total : XX</p>
            <p>Discount : XX</p>
            <p className="font-semibold">Gross Total : XX</p>
          </div>
        </div>
      </div>

      {/* Right - Checkout */}
      <div className="flex flex-col">
        <h2 className="text-xl font-semibold mb-4">Checkout</h2>
        <div className="space-y-4 overflow-y-auto">
          {[1, 2, 3].map((item) => (
            <div key={item} className="flex border rounded-md p-3 bg-gray-100">
              <div className="flex-1">
                <h3 className="font-semibold">HeadPhones</h3>  
                <p className="text-green-600 font-semibold mt-1">In Stock</p>
              </div>
              <p className="text-lg font-bold">25$</p>
            </div>
          ))}
        </div>

        {/* Order Button */}
        <div className="mt-auto pt-6">
          <button className="flex items-center justify-center gap-2 w-full bg-black text-white py-3 rounded-full">
            <ShoppingCart className="h-5 w-5" />
            Order
          </button>
        </div>
      </div>
    </div>
  );
}
