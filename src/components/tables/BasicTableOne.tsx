import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";

import Badge from "../ui/badge/Badge";
import Image from "next/image";

interface Order {
  id: number;
  image: string;
  productName: string;
  shopName: string;
  maincategoryName: string;
  subcategoryName: string;
  stock: string;
}

// Define the table data using the interface
const tableData: Order[] = [
  {
    id: 1,
    image: "/images/product/product-01.jpg",
    productName: "Laptop",
    shopName: "Pro Tech",
    maincategoryName: "Electronic",
    subcategoryName: "Computer",
    stock: "Active",
  },
  {
    id: 2,
    image: "/images/product/product-02.jpg",
    productName: "Smartphone",
    shopName: "Mobile World",
    maincategoryName: "Electronic",
    subcategoryName: "Mobile",
    stock: "Active",
  },
  {
    id: 3,
    image: "/images/product/product-03.jpg",
    productName: "T-Shirt",
    shopName: "Style Hub",
    maincategoryName: "Clothing",
    subcategoryName: "Men's Wear",
    stock: "Out of Stock",
  },
  {
    id: 4,
    image: "/images/product/product-04.jpg",
    productName: "Cooking Pan",
    shopName: "Kitchen Pro",
    maincategoryName: "Home & Kitchen",
    subcategoryName: "Cookware",
    stock: "Active",
  },
  {
    id: 5,
    image: "/images/product/product-05.jpg",
    productName: "Sneakers",
    shopName: "Footwear Zone",
    maincategoryName: "Fashion",
    subcategoryName: "Shoes",
    stock: "Active",
  }
];

export default function BasicTableOne() {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[1102px]">
          <Table>
            {/* Table Header */}
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Image
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Product Name
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Shop Name
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  MainCategory Name
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  SubCategory Name
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Stock
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Edit
                </TableCell>
              </TableRow>
            </TableHeader>

            {/* Table Body */}
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {tableData.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="px-5 py-4 sm:px-6 text-start">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 overflow-hidden rounded-full">
                        <Image
                          width={40}
                          height={40}
                          src={order.image}
                          alt={order.productName}
                        />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {order.productName}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {order.shopName}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {order.maincategoryName}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {order.subcategoryName}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    <Badge
                      size="sm"
                      color={
                        order.stock === "Active"
                          ? "success"
                          : order.stock === "Pending"
                          ? "warning"
                          : "error"
                      }
                    >
                      {order.stock}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    {order.id}
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
