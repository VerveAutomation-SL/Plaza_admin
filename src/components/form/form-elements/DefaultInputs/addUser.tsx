"use client";

import React, { useState } from 'react';
import ComponentCard from '../../../common/ComponentCard';
import Label from '../../Label';
import Input from '../../input/InputField';
import Button from '@/components/ui/button/Button';
import { registerAdmin } from '@/lib/api/authApi';
import { toast } from 'react-hot-toast';

interface DefaultInputsProps {
  cardTitle: string;
  fullNameLabel: string;
  emailLabel: string;
  passwordLabel: string;
  roleLabel: string;
}

interface ValidationErrors {
  full_name?: string;
  email?: string;
  password?: string;
  role?: string;
}

export default function DefaultInputs({
  cardTitle,
  fullNameLabel,
  emailLabel,
  passwordLabel,
  roleLabel,
}: DefaultInputsProps) {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    role: '',
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof ValidationErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};
    if (!formData.full_name.trim()) newErrors.full_name = 'Full name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.password.trim()) newErrors.password = 'Password is required';
    if (!formData.role.trim()) newErrors.role = 'Role is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setIsSubmitting(true);
    try {
      await registerAdmin(formData);
      toast.success('Admin registered successfully!', {
        style: { top: '5rem' },
        position: 'top-center'
      });
      setFormData({
        full_name: '',
        email: '',
        password: '',
        role: '',
      });
      setErrors({});
    } catch (error) {
      console.error('Registration failed:', error);
      toast.error('Failed to register admin.', {
        style: { top: '5rem' },
        position: 'top-center'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirm = () => {
    if (!validateForm()) return;

    toast.custom((t) => (
      <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/40 backdrop-blur-lg mt-80">
        <div className="bg-white dark:bg-gray-800 px-8 py-6 rounded-xl shadow-xl border border-gray-300 max-w-md w-full z-[99999]">
          <p className="text-gray-800 dark:text-white mb-6 text-center text-lg font-semibold">
            Are you sure you want to register this admin?
          </p>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => {
                toast.dismiss(t.id);
                handleSubmit();
              }}
              className="px-5 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
            >
              OK
            </button>
            <button
              onClick={() => {
                toast.dismiss(t.id);
                toast.error('Admin registration cancelled.', {
                  style: { top: '5rem' },
                  position: 'top-center'
                });
              }}
              className="px-5 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    ));
  };

  return (
    <ComponentCard title={cardTitle}>
      <div className="flex flex-wrap gap-4">
        <div className="w-full md:w-[48%]">
          <Label>{fullNameLabel}</Label>
          <Input
            name="full_name"
            value={formData.full_name}
            onChange={handleChange}
            className={errors.full_name ? 'border-red-500' : ''}
          />
          {errors.full_name && <p className="text-sm text-red-500">{errors.full_name}</p>}
        </div>

        <div className="w-full md:w-[48%]">
          <Label>{emailLabel}</Label>
          <Input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={errors.email ? 'border-red-500' : ''}
          />
          {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
        </div>

        <div className="w-full md:w-[48%]">
          <Label>{passwordLabel}</Label>
          <Input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={errors.password ? 'border-red-500' : ''}
          />
          {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
        </div>

        <div className="w-full md:w-[48%]">
          <Label>{roleLabel}</Label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className={`w-full border px-3 py-2 rounded-md ${errors.role ? 'border-red-500' : 'border-gray-300'}`}
          >
            <option value="">Select Role</option>
            <option value="admin">Admin</option>
            <option value="shop">Shop</option>
            <option value="cashier">Cashier</option>
          </select>
          {errors.role && <p className="text-sm text-red-500">{errors.role}</p>}
        </div>
      </div>

      <div className="mt-6">
        <Button size="sm" variant="primary" onClick={handleConfirm} disabled={isSubmitting}>
          {isSubmitting ? 'Registering...' : 'Register Admin'}
        </Button>
      </div>
    </ComponentCard>
  );
}
