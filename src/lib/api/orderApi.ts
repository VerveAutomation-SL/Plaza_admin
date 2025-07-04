// File: lib/api/orderApi.ts
import axios from "axios";

// Base API URL
const BASE_URL = "http://localhost:3000/api/auth";

// 🔷 Interface Definitions
export interface OrderItem {
  id: number;
  variant_id: string;
  quantity: number;
  unit_price: number;
}

export interface Order {
  id: string;
  cashier_id: string;
  total_amount: number;
  createdAt: string;
  updatedAt: string;
  order_items: OrderItem[];
}

export interface PlaceOrderPayload {
  cashier_id: string;
  items: {
    variant_id: string;
    quantity: number;
  }[];
}

export async function placeOrder(payload: PlaceOrderPayload) {
  try {
    const response = await axios.post(`${BASE_URL}/placeOrder`, payload, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw error.response?.data || { message: "Order placement failed." };
  }
}

export async function getAllOrders(): Promise<Order[]> {
  const response = await axios.get(`${BASE_URL}/getOrders`);
  return response.data;
}

export async function deleteOrder(orderId: string): Promise<{ message: string }> {
  const response = await axios.delete(`${BASE_URL}/deleteOrder/${orderId}`);
  return response.data;
}
