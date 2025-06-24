"use client";

import React, { useState } from 'react';
import ComponentCard from '../../../common/ComponentCard';
import Label from '../../Label';
import Input from '../../input/InputField';
import TextArea from '../../input/TextArea';
import Button from '@/components/ui/button/Button';
import { addBusiness } from '@/lib/api/businessApi';

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
      const res = await addBusiness(payload);
      console.log("Business added:", res);
      alert("Business added successfully!");
      setBusinessName("");
      setDescription("");
      setErrors({});
    } catch (error) {
      console.error("Error adding business:", error);
      alert("Failed to add business.");
    } finally {
      setIsSubmitting(false);
    }
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
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Adding..." : "Add Business"}
        </Button>
      </div>
    </ComponentCard>
  );
}
