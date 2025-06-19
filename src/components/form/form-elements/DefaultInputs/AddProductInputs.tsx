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

  const handleSubmit = async () => {
    const payload = {
      shop_id: shopId,
      product_name: productName,
      mCategory_code: mainCategoryCode,
      sCategory_code: subCategoryCode,
      product_description: description,
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

      const result = await res.json();
      console.log("API response:", result);
      alert("Product added successfully!");

    } catch (err) {
      console.error("Error submitting form:", err);
      alert("Something went wrong.");
    }
  };

  return (
    <ComponentCard title={cardTitle}>
      <div className="space-y-6">
        {/* Row 1: Product Name + Shop */}
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-1/2">
            <Label>{productNameLabel}</Label>
            <Input type="text" value={productName} onChange={(e) => setProductName(e.target.value)} />
          </div>
          <div className="w-full md:w-1/2">
            <Label>{shopLabel}</Label>
            <div className="relative">
              <Select
                options={shopOptions}
                placeholder="Select a Shop"
                onChange={(val) => setShopId(val)}
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
                options={mainCategoryOptions}
                placeholder="Main Category"
                onChange={(val) => setMainCategoryCode(val)}
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
                options={subCategoryOptions}
                placeholder="Sub Category"
                onChange={(val) => setSubCategoryCode(val)}
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
            value={description}
            onChange={(val) => setDescription(val)}
            rows={6}
          />
        </div>

        <div>
          <Label>Upload file</Label>
          <FileInput onChange={(e) => {
            const file = e.target.files?.[0];
            setImageUrl(file ? file.name : "");
          }} />
        </div>

        <div>
          <Button size="sm" variant="primary" onClick={handleSubmit}>
            Add Product
          </Button>
        </div>
      </div>
    </ComponentCard>
  );
}
