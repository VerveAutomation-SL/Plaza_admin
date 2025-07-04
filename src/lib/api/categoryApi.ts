// categoryApi.ts
import axios from "axios";

const BASE_URL = "https://plaza.verveautomation.com/api/auth";

// ------------------ Main Category APIs ------------------

export const addMainCategory = async (data: { mCategory_name: string }) => {
  return axios.post(`${BASE_URL}/addMaincategory`, data);
};

export const getAllMainCategories = async () => {
  return axios.get(`${BASE_URL}/getallMCategory`);
};

export const updateMainCategory = async (data: {
  mCategory_code: string;
  mCategory_name: string;
}) => {
  return axios.put(`${BASE_URL}/updateMCategory`, data);
};

export const deleteMainCategory = async (data: { mCategory_code: string }) => {
  return axios.post(`${BASE_URL}/DeleteMCategory`, data);
};

// ------------------ Sub Category APIs ------------------

export const addSubCategory = async (data: {
  SCategory_name: string;
  MainCategory_code: string;
}) => {
  return axios.post(`${BASE_URL}/addSubcategory`, data);
};

export const getAllSubCategories = async () => {
  return axios.get(`${BASE_URL}/getallSubCategory`);
};

export const updateSubCategory = async (data: {
  SCategory_code: string;
  SCategory_name: string;
  MainCategory_code: string;
}) => {
  return axios.put(`${BASE_URL}/updateSubCategory`, data);
};

export const deleteSubCategory = async (data: { SubCategory_code: string }) => {
  return axios.post(`${BASE_URL}/DeleteSubCategory`, data);
};
