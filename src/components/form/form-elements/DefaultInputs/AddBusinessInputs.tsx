"use client";

import React, { useState } from 'react';
import ComponentCard from '../../../common/ComponentCard';
import Label from '../../Label';
import Input from '../../input/InputField';
import TextArea from '../../input/TextArea';
import Button from '@/components/ui/button/Button';
import { addBusiness } from '@/lib/api/businessApi';
import { toast } from 'react-hot-toast';

interface DefaultInputsProps {
  cardTitle: string;
  businessNameLabel: string;
  descriptionLabel: string;
}

interface ValidationErrors {
  business_name?: string;
  description?: string;
}

export default function DefaultInputs({
  cardTitle,
  businessNameLabel,
  descriptionLabel,
}: DefaultInputsProps) {
  const [business_name, setBusinessName] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};
    if (!business_name.trim()) newErrors.business_name = "Business name is required";
    if (!description.trim()) newErrors.description = "Description is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const clearFieldError = (field: keyof ValidationErrors) => {
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setIsSubmitting(true);

    const payload = { business_name, description };

    try {
      await addBusiness(payload);
      toast.success("Business added successfully!", {
        style: { top: "5rem" },
        position: "top-center"
      });
      setBusinessName("");
      setDescription("");
      setErrors({});
    } catch (error) {
      console.error("Error adding business:", error);
      toast.error("Failed to add business.", {
        style: { top: "5rem" },
        position: "top-center"
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
            Are you sure you want to add this business?
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
                toast.error("Business addition cancelled.", {
                  style: { top: "5rem" },
                  position: "top-center"
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
          <Label>{businessNameLabel}</Label>
          <Input
            value={business_name}
            onChange={(e) => {
              setBusinessName(e.target.value);
              clearFieldError("business_name");
            }}
            className={errors.business_name ? "border-red-500" : ""}
          />
          {errors.business_name && <p className="text-sm text-red-500">{errors.business_name}</p>}
        </div>

        <div>
          <Label>{descriptionLabel}</Label>
          <TextArea
            rows={4}
            value={description}
            onChange={(val) => {
              setDescription(val);
              clearFieldError("description");
            }}
            className={errors.description ? "border-red-500" : ""}
          />
          {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
        </div>

        <Button
          size="sm"
          variant="primary"
          onClick={handleConfirm}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Adding..." : "Add Business"}
        </Button>
      </div>
    </ComponentCard>
  );
}
