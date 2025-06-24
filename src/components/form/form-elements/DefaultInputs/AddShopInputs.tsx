"use client";

import React, { useState } from 'react';
import ComponentCard from '../../../common/ComponentCard';
import Label from '../../Label';
import Input from '../../input/InputField';
import TextArea from '../../input/TextArea';
import FileInput from '../../input/FileInput';
import Button from '@/components/ui/button/Button';
import { addShop } from '@/lib/api/shopApi';

interface DefaultInputsProps {
  cardTitle: string;
  shopNameLabel: string;
  businessCodeLabel: string;
  locationLabel: string;
  contactNumberLabel: string;
  emailLabel: string;
  descriptionLabel: string;
  imageLabel: string;
}

interface ValidationErrors {
  shop_name?: string;
  description?: string;
  business_code?: string;
  location?: string;
  contact_number?: string;
  email?: string;
}

export default function DefaultInputs({
  cardTitle,
  shopNameLabel,
  businessCodeLabel,
  locationLabel,
  contactNumberLabel,
  emailLabel,
  descriptionLabel,
  imageLabel
}: DefaultInputsProps) {
  const [shop_name, setShopName] = useState("");
  const [description, setDescription] = useState("");
  const [business_code, setBusinessCode] = useState("");
  const [location, setLocation] = useState("");
  const [contact_number, setContactNumber] = useState("");
  const [email, setEmail] = useState("");
  const [image_url, setImageUrl] = useState("");

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    if (!shop_name.trim()) newErrors.shop_name = "Shop name is required";
    if (!description.trim()) newErrors.description = "Description is required";
    if (!business_code.trim()) newErrors.business_code = "Business code is required";
    if (!location.trim()) newErrors.location = "Location is required";
    if (!contact_number.trim()) newErrors.contact_number = "Contact number is required";
    if (email && !/^\S+@\S+\.\S+$/.test(email)) newErrors.email = "Invalid email format";

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

    const payload = {
      owner_id: "1",
      shop_name,
      description,
      business_code,
      image_url,
      location,
      contact_number,
      email,
    };

    try {
      const res = await addShop(payload);
      console.log("Shop added:", res);
      alert("Shop added successfully!");

      setShopName("");
      setDescription("");
      setBusinessCode("");
      setLocation("");
      setContactNumber("");
      setEmail("");
      setImageUrl("");
      setErrors({});
    } catch (error) {
      console.error("Error adding shop:", error);
      alert("Failed to add shop.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ComponentCard title={cardTitle}>
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label>{shopNameLabel}</Label>
            <Input
              value={shop_name}
              onChange={(e) => {
                setShopName(e.target.value);
                clearFieldError("shop_name");
              }}
              className={errors.shop_name ? "border-red-500" : ""}
            />
            {errors.shop_name && <p className="text-sm text-red-500">{errors.shop_name}</p>}
          </div>

          <div>
            <Label>{businessCodeLabel}</Label>
            <Input
              value={business_code}
              onChange={(e) => {
                setBusinessCode(e.target.value);
                clearFieldError("business_code");
              }}
              className={errors.business_code ? "border-red-500" : ""}
            />
            {errors.business_code && <p className="text-sm text-red-500">{errors.business_code}</p>}
          </div>

          <div>
            <Label>{locationLabel}</Label>
            <Input
              value={location}
              onChange={(e) => {
                setLocation(e.target.value);
                clearFieldError("location");
              }}
              className={errors.location ? "border-red-500" : ""}
            />
            {errors.location && <p className="text-sm text-red-500">{errors.location}</p>}
          </div>

          <div>
            <Label>{contactNumberLabel}</Label>
            <Input
              value={contact_number}
              onChange={(e) => {
                setContactNumber(e.target.value);
                clearFieldError("contact_number");
              }}
              className={errors.contact_number ? "border-red-500" : ""}
            />
            {errors.contact_number && <p className="text-sm text-red-500">{errors.contact_number}</p>}
          </div>

          <div>
            <Label>{emailLabel}</Label>
            <Input
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                clearFieldError("email");
              }}
              className={errors.email ? "border-red-500" : ""}
            />
            {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
          </div>

          <div>
            <Label>{imageLabel}</Label>
            <FileInput
              onChange={(e) => {
                const file = e.target.files?.[0];
                setImageUrl(file ? file.name : "");
              }}
            />
          </div>
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
          {isSubmitting ? "Adding..." : "Add Shop"}
        </Button>
      </div>
    </ComponentCard>
  );
}
