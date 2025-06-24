import axios from "axios";

const API_BASE_URL = "https://plaza.verveautomation.com";

export interface Shop {
  id: string;
  shop_name: string;
  description: string;
  image_url: string;
  location: string;
  contact_number: string;
  email: string;
  owner_id: number;
  AdminUser: {
    id: number;
    full_name: string;
  };
  Business: {
    business_code: string;
    business_name: string;
  };
}

export interface ShopPayload {
  owner_id: string;
  shop_name: string;
  description: string;
  business_code: string;
  image_url: string;
  location: string;
  contact_number: string;
  email: string;
}

// Get all shops
export const getShops = async (): Promise<Shop[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/auth/GetShops`);
    return response.data.shopDetails; 
  } catch (error) {
    console.error("Failed to fetch shops:", error);
    throw error;
  }
};

// Add a new shop
export const addShop = async (data: ShopPayload) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/auth/add_shop`, data);
    return response.data;
  } catch (error) {
    console.error("Failed to add shop:", error);
    throw error;
  }
};

// Update an existing shop (pass shopCode like 'SH001')
export const updateShop = async (shopCode: string, data: Partial<Shop>) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/api/auth/updateShop/${shopCode}`, data);
    return response.data;
  } catch (error) {
    console.error("Failed to update shop:", error);
    throw error;
  }
};

// Delete a shop (pass shopCode like 'SH001')
export const deleteShop = async (shopCode: string) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/api/auth/deleteShops/${shopCode}`);
    return response.data;
  } catch (error) {
    console.error("Failed to delete shop:", error);
    throw error;
  }
};
