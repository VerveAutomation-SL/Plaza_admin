"use client";

import React, { useState, useContext } from 'react';
import ComponentCard from '../../../common/ComponentCard';
import Label from '../../Label';
import Input from '../../input/InputField';
import Select from '../../Select';
import { ChevronDownIcon } from '../../../../icons';
import TextArea from '../../input/TextArea';
import FileInput from '../../input/FileInput';
import Button from '@/components/ui/button/Button';
import { addProduct, uploadFiles } from '@/lib/api/productApi';
import { DropdownContext } from '@/context/DropdownContext';
import { toast } from 'react-hot-toast';

interface DefaultInputsProps {
  cardTitle: string;
  productNameLabel?: string;
  shopLabel?: string;
  mainCategoryLabel?: string;
  subCategoryLabel?: string;
  descriptionLabel?: string;
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
  const [image, setimage] = useState<File | null>(null);

  const { shopOptions, mainCategoryOptions, subCategoryOptions } = useContext(DropdownContext);

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    if (!productName.trim()) newErrors.productName = "Product name is required";
    else if (productName.trim().length < 2) newErrors.productName = "Product name must be at least 2 characters";
    else if (productName.trim().length > 100) newErrors.productName = "Product name must be less than 100 characters";

    if (!shopId) newErrors.shopId = "Please select a shop";
    if (!mainCategoryCode) newErrors.mainCategoryCode = "Please select a main category";
    if (!subCategoryCode) newErrors.subCategoryCode = "Please select a sub category";

    if (!description.trim()) newErrors.description = "Product description is required";
    else if (description.trim().length < 10) newErrors.description = "Description must be at least 10 characters";
    else if (description.trim().length > 1000) newErrors.description = "Description must be less than 1000 characters";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const clearFieldError = (fieldName: keyof ValidationErrors) => {
    if (errors[fieldName]) {
      setErrors(prev => ({ ...prev, [fieldName]: undefined }));
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event?.target.files && event.target.files) {
            setimage(event.target.files[0])
        }
    };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    let uploadedImg = "";

    try {

      if (image) {
        const uploadResponse = await uploadFiles([image]) as { status: number; imageUrl: string };
        console.log(uploadResponse, "uploadResponse");

        if (uploadResponse.imageUrl && uploadResponse.status === 200) {
          uploadedImg = uploadResponse.imageUrl;
          setImageUrl(uploadedImg); // ✅ Correct: update your image URL state
          console.log("Image uploaded toXXX:", uploadedImg);
        } else {
          console.error("Image URL not found in upload response.");
        }
      }
      console.log("Image uploaded TEST:", imageUrl);
        const payload = {
          shop_id: shopId,
          product_name: productName.trim(),
          mCategory_code: mainCategoryCode,
          sCategory_code: subCategoryCode,
          product_description: description.trim(),
          image_url: uploadedImg,
        };

      const result = await addProduct(payload);
      console.log("API response:", result);
      toast.success("Product added successfully!");

      setProductName("");
      setShopId("");
      setMainCategoryCode("");
      setSubCategoryCode("");
      setDescription("");
      setImageUrl("");
      setErrors({});
    } catch (err) {
      console.error("Error submitting form:", err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirm = () => {
    if (!validateForm()) return;

   toast.custom((t) => (
  <div className="fixed inset-0 z-[99999] flex items-center justify-center mt-80">
    {/* Backdrop blur overlay */}
    <div className="absolute inset-0 bg-black/50 backdrop-blur-md"></div>
    
    {/* Modal content */}
    <div className="relative bg-white dark:bg-gray-800 px-8 py-6 rounded-xl shadow-xl border border-gray-300 max-w-md w-full mx-4">
      <p className="text-gray-800 dark:text-white mb-6 text-center text-lg font-semibold">
        Are you sure you want to add this product?
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
            toast.error("Product addition cancelled.");
          }}
          className="px-5 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
));}
  return (
    <ComponentCard title={cardTitle}>
      <div className="space-y-6">
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
            {errors.productName && <p className="mt-1 text-sm text-red-500">{errors.productName}</p>}
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
            {errors.shopId && <p className="mt-1 text-sm text-red-500">{errors.shopId}</p>}
          </div>
        </div>

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
            {errors.mainCategoryCode && <p className="mt-1 text-sm text-red-500">{errors.mainCategoryCode}</p>}
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
            {errors.subCategoryCode && <p className="mt-1 text-sm text-red-500">{errors.subCategoryCode}</p>}
          </div>
        </div>

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
          {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
          <p className="mt-1 text-xs text-gray-500">{description.length}/1000 characters</p>
        </div>

        <div>
          <Label>Upload file</Label>
          <FileInput
            onChange={handleImageUpload}
            className={errors.imageUrl ? 'border-red-500' : ''}
          />
          {errors.imageUrl && <p className="mt-1 text-sm text-red-500">{errors.imageUrl}</p>}
        </div>

        <div>
          <Button size="sm" variant="primary" onClick={handleConfirm} disabled={isSubmitting}>
            {isSubmitting ? "Adding Product..." : "Add Product"}
          </Button>
        </div>
      </div>
    </ComponentCard>
  );
}
