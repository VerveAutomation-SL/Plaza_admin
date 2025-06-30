// src/lib/api/authApi.ts
import axios from "axios";

const BASE_URL = "https://plaza.verveautomation.com/api/auth";

export interface AdminRegisterData {
  email: string;
  password: string;
  full_name: string;
  role: "admin" | "cashier";
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
    role: "admin" | "cashier";
  };
}

// Admin Registration
export const registerAdmin = async (data: AdminRegisterData): Promise<AuthResponse> => {
  const res = await axios.post(`${BASE_URL}/Adminregister`, data);
  return res.data;
};

// Admin Login
export const loginAdmin = async (data: AdminLoginData): Promise<AuthResponse> => {
  const res = await axios.post(`${BASE_URL}/Adminlogin`, data);
  return res.data;
};
