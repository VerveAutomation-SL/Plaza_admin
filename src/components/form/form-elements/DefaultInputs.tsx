"use client";
import React, { useState } from 'react';
import ComponentCard from '../../common/ComponentCard';
import Label from '../Label';
import Input from '../input/InputField';
import Select from '../Select';
import { ChevronDownIcon } from '../../../icons';
import TextArea from '../input/TextArea';
import FileInput from '../input/FileInput';
import Button from '@/components/ui/button/Button';

interface DefaultInputsProps {
  cardTitle: string;
  productNameLabel?: string;
  shopLabel?: string;
  mainCategoryLabel?: string;
  subCategoryLabel?: string;
  descriptionLabel?: string;
}

export default function DefaultInputs({
  cardTitle,
  productNameLabel = "Product Name",
  shopLabel = "Select Shop",
  mainCategoryLabel = "Select Main Category",
  subCategoryLabel = "Select Sub Category",
  descriptionLabel = "Product Description",
}: DefaultInputsProps) {

  const [message, setMessage] = useState("");
  const options = [
    { value: "marketing", label: "Marketing" },
    { value: "template", label: "Template" },
    { value: "development", label: "Development" },
  ];

  const handleSelectChange = (value: string) => {
    console.log("Selected value:", value);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log("Selected file:", file.name);
    }
  };

  return (
    <ComponentCard title={cardTitle}>
      <div className="space-y-6">
        {/* Row 1: Product Name + Shop */}
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-1/2">
            <Label>{productNameLabel}</Label>
            <Input type="text" />
          </div>
          <div className="w-full md:w-1/2">
            <Label>{shopLabel}</Label>
            <div className="relative">
              <Select
                options={options}
                placeholder="Select a Shop"
                onChange={handleSelectChange}
                className="dark:bg-dark-900"
              />
              <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                <ChevronDownIcon />
              </span>
            </div>
          </div>
        </div>

        {/* Row 2: Main Category + Sub Category */}
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-1/2">
            <Label>{mainCategoryLabel}</Label>
            <div className="relative">
              <Select
                options={options}
                placeholder="Main Category"
                onChange={handleSelectChange}
                className="dark:bg-dark-900"
              />
              <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                <ChevronDownIcon />
              </span>
            </div>
          </div>
          <div className="w-full md:w-1/2">
            <Label>{subCategoryLabel}</Label>
            <div className="relative">
              <Select
                options={options}
                placeholder="Sub Category"
                onChange={handleSelectChange}
                className="dark:bg-dark-900"
              />
              <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                <ChevronDownIcon />
              </span>
            </div>
          </div>
        </div>

        {/* Row 3: Text Area Full Width */}
        <div>
          <Label>{descriptionLabel}</Label>
          <TextArea
            value={message}
            onChange={(value) => setMessage(value)}
            rows={6}
          />
        </div>

        <div>
          <Label>Upload file</Label>
          <FileInput onChange={handleFileChange} className="custom-class" />
        </div>
        <div>
        <Button size="sm" variant="primary">
              Add Product
          </Button>
        </div>
      </div>
    </ComponentCard>

  );
}
