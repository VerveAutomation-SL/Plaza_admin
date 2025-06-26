"use client";

import React, { useState } from 'react';
import ComponentCard from '../../../common/ComponentCard';
import Label from '../../Label';
import Input from '../../input/InputField';
import TextArea from '../../input/TextArea';
import Button from '@/components/ui/button/Button';
import { addEmployee } from '@/lib/api/employeeApi';
import { toast } from 'react-hot-toast';

interface DefaultInputsProps {
  cardTitle: string;
  fullNameLabel: string;
  fatherNameLabel: string;
  nicNoLabel: string;
  mobileTpLabel: string;
  homeTpLabel: string;
  familyTpLabel: string;
  addressLabel: string;
  emailLabel: string;
  imageLabel: string;
  startDateLabel: string;
  shopCodeLabel: string;
}

interface ValidationErrors {
  full_name?: string;
  nic_no?: string;
  mobile_tp?: string;
  shop_id?: string;
}

export default function DefaultInputs({
  cardTitle,
  fullNameLabel,
  fatherNameLabel,
  nicNoLabel,
  mobileTpLabel,
  homeTpLabel,
  familyTpLabel,
  addressLabel,
  emailLabel,
  imageLabel,
  startDateLabel,
  shopCodeLabel,
}: DefaultInputsProps) {
  const [formData, setFormData] = useState({
    father_name: '',
    full_name: '',
    nic_no: '',
    mobile_tp: '',
    home_tp: '',
    family_member_tp: '',
    address: '',
    image_url: '',
    email: '',
    employment_start_date: '',
    shop_id: '',
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof ValidationErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};
    if (!formData.full_name.trim()) newErrors.full_name = 'Full name is required';
    if (!formData.nic_no.trim()) newErrors.nic_no = 'NIC is required';
    if (!formData.mobile_tp.trim()) newErrors.mobile_tp = 'Mobile number is required';
    if (!formData.shop_id.trim()) newErrors.shop_id = 'Shop ID is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setIsSubmitting(true);
    try {
      await addEmployee(formData);
      toast.success('Employee added successfully!', {
        style: { top: '5rem' },
        position: 'top-center'
      });
      setFormData({
        father_name: '',
        full_name: '',
        nic_no: '',
        mobile_tp: '',
        home_tp: '',
        family_member_tp: '',
        address: '',
        image_url: '',
        email: '',
        employment_start_date: '',
        shop_id: '',
      });
      setErrors({});
    } catch (error) {
      console.error('Failed to add employee:', error);
      toast.error('Failed to add employee.', {
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
            Are you sure you want to add this employee?
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
                toast.error('Employee addition cancelled.', {
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
      <div className="space-y-6">
        <div>
          <Label>{fullNameLabel}</Label>
          <Input name="full_name" value={formData.full_name} onChange={handleChange} className={errors.full_name ? 'border-red-500' : ''} />
          {errors.full_name && <p className="text-sm text-red-500">{errors.full_name}</p>}
        </div>

        <div>
          <Label>{fatherNameLabel}</Label>
          <Input name="father_name" value={formData.father_name} onChange={handleChange} />
        </div>

        <div>
          <Label>{nicNoLabel}</Label>
          <Input name="nic_no" value={formData.nic_no} onChange={handleChange} className={errors.nic_no ? 'border-red-500' : ''} />
          {errors.nic_no && <p className="text-sm text-red-500">{errors.nic_no}</p>}
        </div>

        <div>
          <Label>{mobileTpLabel}</Label>
          <Input name="mobile_tp" value={formData.mobile_tp} onChange={handleChange} className={errors.mobile_tp ? 'border-red-500' : ''} />
          {errors.mobile_tp && <p className="text-sm text-red-500">{errors.mobile_tp}</p>}
        </div>

        <div>
          <Label>{homeTpLabel}</Label>
          <Input name="home_tp" value={formData.home_tp} onChange={handleChange} />
        </div>

        <div>
          <Label>{familyTpLabel}</Label>
          <Input name="family_member_tp" value={formData.family_member_tp} onChange={handleChange} />
        </div>

        <div>
          <Label>{addressLabel}</Label>
          <TextArea rows={4} value={formData.address} onChange={(val) => setFormData(prev => ({ ...prev, address: val }))} />
        </div>

        <div>
          <Label>{emailLabel}</Label>
          <Input name="email" value={formData.email} onChange={handleChange} />
        </div>

        <div>
          <Label>{imageLabel}</Label>
          <Input name="image_url" value={formData.image_url} onChange={handleChange} />
        </div>

        <div>
          <Label>{startDateLabel}</Label>
          <Input type="date" name="employment_start_date" value={formData.employment_start_date} onChange={handleChange} />
        </div>

        <div>
          <Label>{shopCodeLabel}</Label>
          <Input name="shop_id" value={formData.shop_id} onChange={handleChange} className={errors.shop_id ? 'border-red-500' : ''} />
          {errors.shop_id && <p className="text-sm text-red-500">{errors.shop_id}</p>}
        </div>

        <Button size="sm" variant="primary" onClick={handleConfirm} disabled={isSubmitting}>
          {isSubmitting ? 'Adding...' : 'Add Employee'}
        </Button>
      </div>
    </ComponentCard>
  );
}
