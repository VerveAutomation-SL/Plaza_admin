import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface UploadResponse {
  status: number;
  imageUrl: string;
}

interface ErrorResponse {
  error: string;
  message: string;
  status: number;
}

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
  image_url: string;
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

export interface Product {
  product_code: string;
  productVarient_code: string;
  product_name: string;
  size: string;
  barcode: string;
  selling_price: number;
  discount_percentage: number;
  is_discount_active: boolean;
  discountSellingPrice: number;
  total_quantity: number;
  mCategory_code: string;
  sCategory_code: string;
  product_description: string;
  shop_id: string;
  image_url: string;
  quantity_type?: string | null;
}

// ✅ NEW INTERFACE for GetProductsOnly
export interface BasicProduct {
  product_code: string;
  product_name: string;
}

// ===================== API FUNCTIONS =====================

export const addProduct = async (data: AddProduct) => {
  try {
    const res = await axios.post(`${API_BASE_URL}/api/auth/AddProducts`, data);
    return res.data;
  } catch (error) {
    console.error("Error adding product:", error);
    throw error;
  }
};

export const addProductVariant = async (data: AddProductVariant) => {
  try {
    const res = await axios.post(`${API_BASE_URL}/api/auth/AddProductsVariants`, data);
    return res.data;
  } catch (error) {
    console.error("Error adding product variant:", error);
    throw error;
  }
};

export const getAllProducts = async () => {
  try {
    const res = await axios.get(`${API_BASE_URL}/api/auth/GetAllProducts`);
    return res.data;
  } catch (error) {
    console.error("Error fetching all products:", error);
    throw error;
  }
};

export const getProductsOnly = async (): Promise<BasicProduct[]> => {
  try {
    const res = await axios.get(`${API_BASE_URL}/api/auth/GetProductsOnly`);
    return res.data;
  } catch (error) {
    console.error("Error fetching basic product list:", error);
    throw error;
  }
};

export const addStockBatch = async (batchData: StockBatch) => {
  try {
    const res = await axios.post(`${API_BASE_URL}/api/auth/AddStockBatches`, batchData);
    return res.data;
  } catch (error) {
    console.error("Error adding stock batch:", error);
    throw error;
  }
};

export const updateProductVariant = async (variantData: ProductVariantUpdate) => {
  try {
    const res = await axios.put(`${API_BASE_URL}/api/auth/UpdateProductVarient`, variantData);
    return res.data;
  } catch (error) {
    console.error("Error updating product variant:", error);
    throw error;
  }
};

export const addDiscount = async (discountData: DiscountPayload) => {
  try {
    const res = await axios.post(`${API_BASE_URL}/api/auth/AddDiscount`, discountData);
    return res.data;
  } catch (error) {
    console.error("Error adding discount:", error);
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
    console.error("Error activating discount:", error);
    throw error;
  }
};

export const uploadFiles = async (files: File[]): Promise<UploadResponse | ErrorResponse> => {
  try {
    const file = files[0];

    if (!file) {
      return {
        error: "no_file",
        message: "No file provided",
        status: 400,
      };
    }

    const formData = new FormData();
    formData.append("image", file);

    const response = await axios.post<UploadResponse>(
      `${API_BASE_URL}/api/auth/img`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error uploading file", error);
    return {
      error: "upload_failed",
      message: "Failed to upload file",
      status: 500,
    };
  }
};

export async function searchProducts(query: string): Promise<Product[]> {
  const res = await axios.get(`${API_BASE_URL}/api/products/search?q=${encodeURIComponent(query)}`);
  return res.data;
}
