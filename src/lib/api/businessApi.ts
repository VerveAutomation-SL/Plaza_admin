// src/lib/api/businessApi.ts

import axios from "axios";

const BASE_URL = "https://plaza.verveautomation.com/api/auth";

// Type for a business item
export interface Business {
  business_code: string;
  business_name: string;
  description: string;
  createdAt?: string;
  updatedAt?: string;
}

// Type for creating a business
export interface NewBusiness {
  business_name: string;
  description: string;
}

// Get all businesses
export const getBusinesses = async (): Promise<Business[]> => {
  const res = await axios.get(`${BASE_URL}/getBusiness`);
  return res.data;
};

// Add a new business
export const addBusiness = async (data: NewBusiness): Promise<Business> => {
  const res = await axios.post(`${BASE_URL}/addBusiness`, data);
  return res.data;
};

// Get single business by business_code
export const getBusinessByCode = async (businessCode: string): Promise<Business> => {
  const res = await axios.get(`${BASE_URL}/getBusinessbyCode/${businessCode}`);
  return res.data;
};

// Update a business by business_code
export const updateBusiness = async (businessCode: string, data: NewBusiness): Promise<Business> => {
  const res = await axios.put(`${BASE_URL}/UpdatebBusiness/${businessCode}`, data);
  return res.data;
};
