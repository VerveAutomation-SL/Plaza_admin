"use client";

import React, { useState, useContext } from "react";
import { addProductVariant, uploadFiles } from "@/lib/api/productApi";
import { toast } from "react-hot-toast";
import Label from '../../Label';
import FileInput from '../../input/FileInput';
import Select from '../../Select';
import { DropdownContext } from "@/context/DropdownContext";
import { ChevronDownIcon } from "@/icons";

interface Attribute {
  name: string;
  value: string;
}

interface ValidationErrors {
  variantName?: string;
  productCode?: string;
  size?: string;
  sellingPrice?: string;
  barcode?: string;
  discountPercentage?: string;
}

interface DefaultInputsProps {
  cardTitle: string;
  productNameLabel: string;
  shopLabel: string;
  mainCategoryLabel: string;
  subCategoryLabel: string;
  barcodeLabel: string;
  discountLabel: string;
  discountToggleLabel: string;
  attributeLabel: string;
  image_url: string;
}

export default function AddProductVariantPage(props: DefaultInputsProps) {
  const [variantName, setVariantName] = useState("");
  const [productCode, setProductCode] = useState("");
  const [mainCategoryCode, setMainCategoryCode] = useState("");
  const [subCategoryCode, setSubCategoryCode] = useState("");
  const [shopId, setShopId] = useState("");
  const [size, setSize] = useState("");
  const [sellingPrice, setSellingPrice] = useState("");
  const [barcode, setBarcode] = useState("");
  const [discountPercentage, setDiscountPercentage] = useState("");
  const [isDiscountActive, setIsDiscountActive] = useState(false);
  const [attributes, setAttributes] = useState<Attribute[]>([{ name: "", value: "" }]);
  const [image, setImage] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    productOptions,
    mainCategoryOptions,
    subCategoryOptions,
  } = useContext(DropdownContext);

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};
    if (!variantName.trim()) newErrors.variantName = "Variant name is required";
    if (!productCode.trim()) newErrors.productCode = "Product code is required";
    if (!size.trim()) newErrors.size = "Size is required";
    if (!sellingPrice.trim()) newErrors.sellingPrice = "Selling price is required";
    if (!barcode.trim()) newErrors.barcode = "Barcode is required";
    if (isDiscountActive && !discountPercentage.trim()) newErrors.discountPercentage = "Discount is required";
    
    // If there are errors, show them via toast instead of storing in state
    if (Object.keys(newErrors).length > 0) {
      const firstError = Object.values(newErrors)[0];
      toast.error(firstError);
      return false;
    }
    return true;
  };

  const handleAttributeChange = (index: number, field: keyof Attribute, value: string) => {
    const updated = [...attributes];
    updated[index][field] = value;
    setAttributes(updated);
  };

  const addAttributeField = () => setAttributes([...attributes, { name: "", value: "" }]);
  const removeAttributeField = (index: number) => setAttributes(attributes.filter((_, i) => i !== index));

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setIsSubmitting(true);
    let uploadedUrl = "";

    try {
      if (image) {
        const result = await uploadFiles([image]) as { status: number; imageUrl: string };
        if (result.status === 200) uploadedUrl = result.imageUrl;
      }

      const payload = {
        product_code: productCode,
        productVariant_name: variantName,
        size,
        selling_price: parseFloat(sellingPrice),
        barcode,
        discount_percentage: parseFloat(discountPercentage) || 0,
        is_discount_active: isDiscountActive,
        attributes: attributes.filter(a => a.name && a.value),
        image_url: uploadedUrl,
        shop_id: shopId,
        mCategory_code: mainCategoryCode,
        sCategory_code: subCategoryCode,
      };

      await addProductVariant(payload);
      toast.success("Product variant added!");
      setVariantName("");
      setProductCode("");
      setMainCategoryCode("");
      setSubCategoryCode("");
      setShopId("");
      setSize("");
      setSellingPrice("");
      setBarcode("");
      setDiscountPercentage("");
      setIsDiscountActive(false);
      setAttributes([{ name: "", value: "" }]);
      setImage(null);
    } catch {
      toast.error("Failed to add product variant.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Create fallback options if not available in context
  const shopOptions = [
    { value: "SHOP001", label: "Main Shop" },
    // Add your actual shop options here
  ];

  return (
    <div className="p-6 bg-white border rounded shadow space-y-6">
      <h2 className="text-xl font-bold">{props.cardTitle}</h2>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full">
          <Label>{props.productNameLabel}</Label>
          <input
            value={variantName}
            onChange={(e) => setVariantName(e.target.value)}
            className="w-full border p-2"
          />
        </div>

        <div className="w-full">
          <Label>Product</Label>
          <div className="relative">
            <Select
              options={productOptions}
              placeholder="Select Product"
              onChange={(val) => setProductCode(val)}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
              <ChevronDownIcon />
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full">
          <Label>{props.mainCategoryLabel}</Label>
          <div className="relative">
            <Select
              options={mainCategoryOptions}
              placeholder="Main Category"
              onChange={setMainCategoryCode}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
              <ChevronDownIcon />
            </span>
          </div>
        </div>

        <div className="w-full">
          <Label>{props.subCategoryLabel}</Label>
          <div className="relative">
            <Select
              options={subCategoryOptions}
              placeholder="Sub Category"
              onChange={setSubCategoryCode}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
              <ChevronDownIcon />
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full">
          <Label>{props.shopLabel}</Label>
          <div className="relative">
            <Select
              options={shopOptions}
              placeholder="Select Shop"
              onChange={(val) => setShopId(val)}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
              <ChevronDownIcon />
            </span>
          </div>
        </div>
        <div className="w-full">
          <Label>Size</Label>
          <input value={size} onChange={(e) => setSize(e.target.value)} className="w-full border p-2" />
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full">
          <Label>Selling Price</Label>
          <input inputMode="decimal" pattern="[0-9]*" value={sellingPrice} onChange={(e) => setSellingPrice(e.target.value)} className="w-full border p-2" />
        </div>
        <div className="w-full">
          <Label>{props.barcodeLabel}</Label>
          <input value={barcode} onChange={(e) => setBarcode(e.target.value)} className="w-full border p-2" />
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6 items-center">
        <div className="w-full">
          <Label>{props.discountLabel}</Label>
          <input type="number" value={discountPercentage} onChange={(e) => setDiscountPercentage(e.target.value)} className="w-full border p-2" />
        </div>
        <div className="flex items-center gap-3">
          <input type="checkbox" checked={isDiscountActive} onChange={(e) => setIsDiscountActive(e.target.checked)} className="h-6 w-6" />
          <Label>{props.discountToggleLabel}</Label>
        </div>
      </div>

      <div>
        <Label>Upload file</Label>
        <FileInput onChange={handleImageUpload} />
      </div>

      <div>
        <Label>{props.attributeLabel}</Label>
        {attributes.map((attr, index) => (
          <div key={index} className="flex gap-2 mb-2">
            <input value={attr.name} onChange={(e) => handleAttributeChange(index, "name", e.target.value)} placeholder="Name" className="border p-2 w-1/2" />
            <input value={attr.value} onChange={(e) => handleAttributeChange(index, "value", e.target.value)} placeholder="Value" className="border p-2 w-1/2" />
            <button type="button" className="text-red-600" onClick={() => removeAttributeField(index)}>Remove</button>
          </div>
        ))}
        <button type="button" onClick={addAttributeField} className="border px-4 py-1">+ Add Attribute</button>
      </div>

      <button onClick={handleSubmit} disabled={isSubmitting} className="bg-blue-600 text-white px-4 py-2 rounded">
        {isSubmitting ? "Submitting..." : "Add Product Variant"}
      </button>
    </div>
  );
}