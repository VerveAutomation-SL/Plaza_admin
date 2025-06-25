// src/lib/api/EmployeeApi.ts
import axios from "axios";

const BASE_URL = "https://plaza.verveautomation.com/api/auth";

export interface Employee {
  employee_code: string;
  full_name: string;
  nic_no: string;
  mobile_tp: string;
  email: string;
  employment_start_date: string;
  Shop: {
    id: string;
    shop_name: string;
  };
}

export interface NewEmployee {
  father_name: string;
  full_name: string;
  nic_no: string;
  mobile_tp: string;
  home_tp: string;
  family_member_tp: string;
  address: string;
  image_url: string;
  email: string;
  employment_start_date: string;
  shop_id: string;
}

// Get all employees
export const getAllEmployees = async (): Promise<Employee[]> => {
  const res = await axios.get("https://plaza.verveautomation.com/api/auth/getallEmployee");
  return res.data.employees; // ✅ access employees from wrapper object
};

// Add a new employee
export const addEmployee = async (data: NewEmployee): Promise<Employee> => {
  const res = await axios.post(`${BASE_URL}/addEmployee`, data);
  return res.data;
};

// Get single employee
export const getEmployeeById = async (employeeCode: string): Promise<Employee> => {
  const res = await axios.get(`${BASE_URL}/GetEmployeeById/${employeeCode}`);
  return res.data;
};

// Update employee
export const updateEmployee = async (employeeCode: string, data: NewEmployee): Promise<Employee> => {
  const res = await axios.put(`${BASE_URL}/UpdateEmployee/${employeeCode}`, data);
  return res.data;
};

// Delete employee
export const deleteEmployee = async (employeeCode: string): Promise<{ message: string }> => {
  const res = await axios.delete(`${BASE_URL}/DeleteEmployee/${employeeCode}`);
  return res.data;
};
