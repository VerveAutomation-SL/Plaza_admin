import axios from 'axios';

const API_BASE_URL = 'https://plaza.verveautomation.com';

// Interfaces
export interface AddProduct {
  shop_id: string;
  product_name: string;
  mCategory_code: string;
  sCategory_code: string;
  product_description: string;
  image_url?: string;
}

export interface AddProductVariant {
  product_code: string;
  productVariant_name: string;
  barcode: string;
  size: string;
  selling_price: number;
  discount_percentage: number;
  is_discount_active: boolean;
  attributes: { name: string; value: string }[];
}

export interface StockBatch {
  variant_id: string;
  quantity: number;
  quantity_type: string; 
  base_price: number;
  received_at?: string;
}

export interface ProductVariantUpdate {
  productVariant_code: string;
  selling_price?: number;
  discount_percentage?: number;
  is_discount_active?: boolean;
  attributes?: { name: string; value: string }[];
}

export interface DiscountPayload {
  productVariant_code: string;
  discount_percentage: number;
}

export interface ActivateDiscountPayload {
  productVariant_code: string;
  is_discount_active: boolean;
}

// API functions
export const addProduct = async (data: AddProduct) => {
  try {
    const res = await axios.post(`${API_BASE_URL}/api/auth/AddProducts`, data);
    return res.data;
  } catch (error) {
    console.error('Error adding product:', error);
    throw error;
  }
};

export const addProductVariant = async (data: AddProductVariant) => {
  try {
    const res = await axios.post(`${API_BASE_URL}/api/auth/AddProductsVariants`, data);
    return res.data;
  } catch (error) {
    console.error('Error adding product variant:', error);
    throw error;
  }
};

export const getAllProducts = async () => {
  try {
    const res = await axios.get(`${API_BASE_URL}/api/auth/GetAllProducts`);
    return res.data;
  } catch (error) {
    console.error('Error fetching all products:', error);
    throw error;
  }
};

export const addStockBatch = async (batchData: StockBatch) => {
  try {
    const res = await axios.post(`${API_BASE_URL}/api/auth/AddStockBatches`, batchData);
    return res.data;
  } catch (error) {
    console.error('Error adding stock batch:', error);
    throw error;
  }
};

export const updateProductVariant = async (variantData: ProductVariantUpdate) => {
  try {
    const res = await axios.put(`${API_BASE_URL}/api/auth/UpdateProductVarient`, variantData);
    return res.data;
  } catch (error) {
    console.error('Error updating product variant:', error);
    throw error;
  }
};

export const addDiscount = async (discountData: DiscountPayload) => {
  try {
    const res = await axios.post(`${API_BASE_URL}/api/auth/AddDiscount`, discountData);
    return res.data;
  } catch (error) {
    console.error('Error adding discount:', error);
    throw error;
  }
};

export const getProductByBarcode = async (barcode: string) => {
  try {
    const res = await axios.get(`${API_BASE_URL}/api/auth/GetProductbyBarcode/${barcode}`);
    return res.data;
  } catch (error) {
    console.error(`Error fetching product with barcode ${barcode}:`, error);
    throw error;
  }
};

export const activateDiscount = async (data: ActivateDiscountPayload) => {
  try {
    const res = await axios.post(`${API_BASE_URL}/api/auth/ActivateDiscount`, data);
    return res.data;
  } catch (error) {
    console.error('Error activating discount:', error);
    throw error;
  }
};
