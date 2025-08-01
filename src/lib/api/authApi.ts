// src/lib/api/authApi.ts
import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export interface AdminRegisterData {
  email: string;
  password: string;
  full_name: string;
  role: string;
}

export interface AdminData {
  id: string,
  email: string;
  password: string;
  full_name: string;
  role: string;
}

export interface AdminLoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  Adminuser: {
    id: number;
    full_name: string;
    email: string;
    role: "admin" | "cashier" | "shop";
  };
}

// Admin Registration
export const registerAdmin = async (data: AdminRegisterData): Promise<AuthResponse> => {
  const res = await axios.post(`${BASE_URL}/api/auth/Adminregister`, data);
  return res.data;
};

// Admin Login
export const loginAdmin = async (data: AdminLoginData): Promise<AuthResponse> => {
  const res = await axios.post(`${BASE_URL}/api/auth/Adminlogin`, data);
  return res.data;
};

export const getAllUsers = async (): Promise<AdminData[]> => {
  const res = await axios.get(`${BASE_URL}/api/auth/getAllAdmins`);
  return res.data;
};

export const deleteUser = async (Adminid: string): Promise<{ message: string }> => {
  const res = await axios.delete(`${BASE_URL}/api/auth/delete/${Adminid}`);
  return res.data;
};