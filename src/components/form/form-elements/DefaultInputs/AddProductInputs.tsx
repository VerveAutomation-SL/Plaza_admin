"use client";
import React, { useState, useEffect } from 'react';
import ComponentCard from '../../../common/ComponentCard';
import Label from '../../Label';
import Input from '../../input/InputField';
import Select from '../../Select';
import { ChevronDownIcon } from '../../../../icons';
import TextArea from '../../input/TextArea';
import FileInput from '../../input/FileInput';
import Button from '@/components/ui/button/Button';
import { supabase } from '@/lib/supabaseClient';

interface DefaultInputsProps {
  cardTitle: string;
  productNameLabel?: string;
  shopLabel?: string;
  mainCategoryLabel?: string;
  subCategoryLabel?: string;
  descriptionLabel?: string;
}

interface Option {
  value: string;
  label: string;
}

interface ValidationErrors {
  productName?: string;
  shopId?: string;
  mainCategoryCode?: string;
  subCategoryCode?: string;
  description?: string;
  imageUrl?: string;
}

export default function DefaultInputs({
  cardTitle,
  productNameLabel = "Product Name",
  shopLabel = "Select Shop",
  mainCategoryLabel = "Select Main Category",
  subCategoryLabel = "Select Sub Category",
  descriptionLabel = "Product Description",
}: DefaultInputsProps) {

  const [productName, setProductName] = useState("");
  const [shopId, setShopId] = useState("");
  const [mainCategoryCode, setMainCategoryCode] = useState("");
  const [subCategoryCode, setSubCategoryCode] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const [shopOptions, setShopOptions] = useState<Option[]>([]);
  const [mainCategoryOptions, setMainCategoryOptions] = useState<Option[]>([]);
  const [subCategoryOptions, setSubCategoryOptions] = useState<Option[]>([]);

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const { data: shops } = await supabase.from('Shops').select('id, shop_name');
        const { data: mainCats } = await supabase.from('MainCategory').select('mCategory_code, mCategory_name');
        const { data: subCats } = await supabase.from('SubCategory').select('SCategory_code, SCategory_name');

        setShopOptions(
          Array.isArray(shops) ? shops.map((s: any) => ({ value: s.id, label: s.shop_name })) : []
        );

        setMainCategoryOptions(
          Array.isArray(mainCats) ? mainCats.map((m: any) => ({ value: m.mCategory_code, label: m.mCategory_name })) : []
        );

        setSubCategoryOptions(
          Array.isArray(subCats) ? subCats.map((s: any) => ({ value: s.SCategory_code, label: s.SCategory_name })) : []
        );
      } catch (err) {
        console.error("Error loading dropdown data:", err);
      }
    };

    fetchDropdownData();
  }, []);

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    // Product Name validation
    if (!productName.trim()) {
      newErrors.productName = "Product name is required";
    } else if (productName.trim().length < 2) {
      newErrors.productName = "Product name must be at least 2 characters";
    } else if (productName.trim().length > 100) {
      newErrors.productName = "Product name must be less than 100 characters";
    }

    // Shop validation
    if (!shopId) {
      newErrors.shopId = "Please select a shop";
    }

    // Main Category validation
    if (!mainCategoryCode) {
      newErrors.mainCategoryCode = "Please select a main category";
    }

    // Sub Category validation
    if (!subCategoryCode) {
      newErrors.subCategoryCode = "Please select a sub category";
    }

    // Description validation
    if (!description.trim()) {
      newErrors.description = "Product description is required";
    } else if (description.trim().length < 10) {
      newErrors.description = "Description must be at least 10 characters";
    } else if (description.trim().length > 1000) {
      newErrors.description = "Description must be less than 1000 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const clearFieldError = (fieldName: keyof ValidationErrors) => {
    if (errors[fieldName]) {
      setErrors(prev => ({
        ...prev,
        [fieldName]: undefined
      }));
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    const payload = {
      shop_id: shopId,
      product_name: productName.trim(),
      mCategory_code: mainCategoryCode,
      sCategory_code: subCategoryCode,
      product_description: description.trim(),
      image_url: imageUrl,
    };

    try {
      const res = await fetch('https://plaza.verveautomation.com/api/auth/AddProducts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const result = await res.json();
      console.log("API response:", result);
      alert("Product added successfully!");

      setProductName("");
      setShopId("");
      setMainCategoryCode("");
      setSubCategoryCode("");
      setDescription("");
      setImageUrl("");
      setErrors({});

    } catch (err) {
      console.error("Error submitting form:", err);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ComponentCard title={cardTitle}>
      <div className="space-y-6">
        {/* Row 1: Product Name + Shop */}
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-1/2">
            <Label>{productNameLabel}</Label>
            <Input 
              type="text" 
              value={productName} 
              onChange={(e) => {
                setProductName(e.target.value);
                clearFieldError('productName');
              }}
              className={errors.productName ? 'border-red-500' : ''}
            />
            {errors.productName && (
              <p className="mt-1 text-sm text-red-500">{errors.productName}</p>
            )}
          </div>
          <div className="w-full md:w-1/2">
            <Label>{shopLabel}</Label>
            <div className="relative">
              <Select
                options={shopOptions}
                placeholder="Select a Shop"
                onChange={(val) => {
                  setShopId(val);
                  clearFieldError('shopId');
                }}
                className={`dark:bg-dark-900 ${errors.shopId ? 'border-red-500' : ''}`}
              />
              <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                <ChevronDownIcon />
              </span>
            </div>
            {errors.shopId && (
              <p className="mt-1 text-sm text-red-500">{errors.shopId}</p>
            )}
          </div>
        </div>

        {/* Row 2: Main Category + Sub Category */}
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-1/2">
            <Label>{mainCategoryLabel}</Label>
            <div className="relative">
              <Select
                options={mainCategoryOptions}
                placeholder="Main Category"
                onChange={(val) => {
                  setMainCategoryCode(val);
                  clearFieldError('mainCategoryCode');
                }}
                className={`dark:bg-dark-900 ${errors.mainCategoryCode ? 'border-red-500' : ''}`}
              />
              <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                <ChevronDownIcon />
              </span>
            </div>
            {errors.mainCategoryCode && (
              <p className="mt-1 text-sm text-red-500">{errors.mainCategoryCode}</p>
            )}
          </div>
          <div className="w-full md:w-1/2">
            <Label>{subCategoryLabel}</Label>
            <div className="relative">
              <Select
                options={subCategoryOptions}
                placeholder="Sub Category"
                onChange={(val) => {
                  setSubCategoryCode(val);
                  clearFieldError('subCategoryCode');
                }}
                className={`dark:bg-dark-900 ${errors.subCategoryCode ? 'border-red-500' : ''}`}
              />
              <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                <ChevronDownIcon />
              </span>
            </div>
            {errors.subCategoryCode && (
              <p className="mt-1 text-sm text-red-500">{errors.subCategoryCode}</p>
            )}
          </div>
        </div>

        {/* Row 3: Text Area Full Width */}
        <div>
          <Label>{descriptionLabel}</Label>
          <TextArea
            value={description}
            onChange={(val) => {
              setDescription(val);
              clearFieldError('description');
            }}
            rows={6}
            className={errors.description ? 'border-red-500' : ''}
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-500">{errors.description}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            {description.length}/1000 characters
          </p>
        </div>

        <div>
          <Label>Upload file</Label>
          <FileInput 
            onChange={(e) => {
              const file = e.target.files?.[0];
              setImageUrl(file ? file.name : "");
              clearFieldError('imageUrl');
            }}
            className={errors.imageUrl ? 'border-red-500' : ''}
          />
          {errors.imageUrl && (
            <p className="mt-1 text-sm text-red-500">{errors.imageUrl}</p>
          )}
        </div>

        <div>
          <Button 
            size="sm" 
            variant="primary" 
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Adding Product..." : "Add Product"}
          </Button>
        </div>
      </div>
    </ComponentCard>
  );
}