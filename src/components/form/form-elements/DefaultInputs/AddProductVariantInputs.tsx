// app/product-variants/page.tsx (Add Product Variant Page)

"use client";
import React, { useState } from "react";
import ComponentCard from "../../../common/ComponentCard";
import Label from "../../Label";
import Input from "../../input/InputField";
import Button from "@/components/ui/button/Button";
import { addProductVariant } from "@/lib/api/productApi";
import { AddProductVariant } from "@/lib/api/productApi";

interface DefaultInputsProps {
  cardTitle?: string;
  productNameLabel?: string;
  shopLabel?: string;
  mainCategoryLabel?: string;
  subCategoryLabel?: string;
  discountLabel?: string;
  discountToggleLabel?: string;
  attributeLabel?: string;
  barcodeLabel?: string;
}

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
  attributes?: string[];
}

export default function DefaultInputs({
  cardTitle = "Add New Product Variant",
  productNameLabel = "Variant Name",
  shopLabel = "Product Code",
  mainCategoryLabel = "Size",
  subCategoryLabel = "Selling Price",
  discountLabel = "Discount Percentage",
  discountToggleLabel = "Is Discount Active",
  attributeLabel = "Attributes",
  barcodeLabel = "Barcode",
}: DefaultInputsProps) {
  const [variantName, setVariantName] = useState("");
  const [productCode, setProductCode] = useState("");
  const [size, setSize] = useState("");
  const [sellingPrice, setSellingPrice] = useState("");
  const [barcode, setBarcode] = useState("");
  const [discountPercentage, setDiscountPercentage] = useState("");
  const [isDiscountActive, setIsDiscountActive] = useState(false);
  const [attributes, setAttributes] = useState<Attribute[]>([{ name: "", value: "" }]);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};
    if (!variantName.trim()) newErrors.variantName = "Variant name is required";
    else if (variantName.trim().length < 2) newErrors.variantName = "Variant name must be at least 2 characters";
    else if (variantName.trim().length > 100) newErrors.variantName = "Variant name must be less than 100 characters";

    if (!productCode.trim()) newErrors.productCode = "Product code is required";
    else if (productCode.trim().length < 2) newErrors.productCode = "Product code must be at least 2 characters";

    if (!size.trim()) newErrors.size = "Size is required";

    if (!sellingPrice.trim()) newErrors.sellingPrice = "Selling price is required";
    else {
      const price = parseFloat(sellingPrice);
      if (isNaN(price) || price <= 0) newErrors.sellingPrice = "Selling price must be a positive number";
      else if (price > 999999.99) newErrors.sellingPrice = "Selling price is too high";
    }

    if (!barcode.trim()) newErrors.barcode = "Barcode is required";
    else if (barcode.trim().length < 8 || barcode.trim().length > 20) newErrors.barcode = "Barcode must be between 8 and 20 characters";

    if (isDiscountActive && !discountPercentage.trim()) newErrors.discountPercentage = "Discount percentage is required when discount is active";
    else if (discountPercentage.trim()) {
      const discount = parseFloat(discountPercentage);
      if (isNaN(discount) || discount < 0 || discount > 100) newErrors.discountPercentage = "Discount percentage must be between 0 and 100";
    }

    const attributeErrors: string[] = [];
    attributes.forEach((attr, index) => {
      if (attr.name.trim() && !attr.value.trim()) attributeErrors[index] = "Attribute value is required when name is provided";
      else if (!attr.name.trim() && attr.value.trim()) attributeErrors[index] = "Attribute name is required when value is provided";
      else if (attr.name.trim().length > 50) attributeErrors[index] = "Attribute name must be less than 50 characters";
      else if (attr.value.trim().length > 100) attributeErrors[index] = "Attribute value must be less than 100 characters";
    });

    if (attributeErrors.some(Boolean)) newErrors.attributes = attributeErrors;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const clearFieldError = (fieldName: keyof ValidationErrors) => {
    if (errors[fieldName]) {
      setErrors(prev => ({ ...prev, [fieldName]: undefined }));
    }
  };

  const clearAttributeError = (index: number) => {
    if (errors.attributes && errors.attributes[index]) {
      setErrors(prev => ({
        ...prev,
        attributes: prev.attributes?.map((err, i) => i === index ? "" : err)
      }));
    }
  };

  const handleAttributeChange = (index: number, field: keyof Attribute, value: string) => {
    setAttributes(prev => prev.map((attr, i) => i === index ? { ...attr, [field]: value } : attr));
    clearAttributeError(index);
  };

  const addAttributeField = () => {
    setAttributes(prev => [...prev, { name: "", value: "" }]);
  };

  const removeAttributeField = (index: number) => {
    if (attributes.length > 1) {
      setAttributes(prev => prev.filter((_, i) => i !== index));
      if (errors.attributes) {
        setErrors(prev => ({
          ...prev,
          attributes: prev.attributes?.filter((_, i) => i !== index)
        }));
      }
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setIsSubmitting(true);

    const validAttributes = attributes.filter(attr => attr.name.trim() && attr.value.trim());
    const payload: AddProductVariant = {
      product_code: productCode.trim(),
      productVariant_name: variantName.trim(),
      size: size.trim(),
      selling_price: parseFloat(sellingPrice),
      barcode: barcode.trim(),
      discount_percentage: parseFloat(discountPercentage) || 0,
      is_discount_active: isDiscountActive,
      attributes: validAttributes,
    };

    try {
      const result = await addProductVariant(payload);
      console.log("API response:", result);
      alert("Product variant added successfully!");
      setVariantName("");
      setProductCode("");
      setSize("");
      setSellingPrice("");
      setBarcode("");
      setDiscountPercentage("");
      setIsDiscountActive(false);
      setAttributes([{ name: "", value: "" }]);
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
        {/* Variant Name + Product Code */}
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-1/2">
            <Label>{productNameLabel}</Label>
            <Input type="text" value={variantName} onChange={(e) => { setVariantName(e.target.value); clearFieldError('variantName'); }} className={errors.variantName ? 'border-red-500' : ''} />
            {errors.variantName && <p className="text-sm text-red-500">{errors.variantName}</p>}
          </div>
          <div className="w-full md:w-1/2">
            <Label>{shopLabel}</Label>
            <Input type="text" value={productCode} onChange={(e) => { setProductCode(e.target.value); clearFieldError('productCode'); }} className={errors.productCode ? 'border-red-500' : ''} />
            {errors.productCode && <p className="text-sm text-red-500">{errors.productCode}</p>}
          </div>
        </div>
        {/* Size + Price */}
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-1/2">
            <Label>{mainCategoryLabel}</Label>
            <Input type="text" value={size} onChange={(e) => { setSize(e.target.value); clearFieldError('size'); }} className={errors.size ? 'border-red-500' : ''} />
            {errors.size && <p className="text-sm text-red-500">{errors.size}</p>}
          </div>
          <div className="w-full md:w-1/2">
            <Label>{subCategoryLabel}</Label>
            <Input type="number" value={sellingPrice} onChange={(e) => { setSellingPrice(e.target.value); clearFieldError('sellingPrice'); }} className={errors.sellingPrice ? 'border-red-500' : ''} />
            {errors.sellingPrice && <p className="text-sm text-red-500">{errors.sellingPrice}</p>}
          </div>
        </div>
        {/* Barcode */}
        <div>
          <Label>{barcodeLabel}</Label>
          <Input type="text" value={barcode} onChange={(e) => { setBarcode(e.target.value); clearFieldError('barcode'); }} className={errors.barcode ? 'border-red-500' : ''} />
          {errors.barcode && <p className="text-sm text-red-500">{errors.barcode}</p>}
        </div>
        {/* Discount */}
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-1/2">
            <Label>{discountLabel}</Label>
            <Input type="number" value={discountPercentage} onChange={(e) => { setDiscountPercentage(e.target.value); clearFieldError('discountPercentage'); }} className={errors.discountPercentage ? 'border-red-500' : ''} />
            {errors.discountPercentage && <p className="text-sm text-red-500">{errors.discountPercentage}</p>}
          </div>
          <div className="w-full md:w-1/2 flex items-center gap-2">
            <input type="checkbox" checked={isDiscountActive} onChange={(e) => setIsDiscountActive(e.target.checked)} />
            <Label>{discountToggleLabel}</Label>
          </div>
        </div>
        {/* Attributes */}
        <div>
          <Label>{attributeLabel} (Optional)</Label>
          {attributes.map((attr, i) => (
            <div key={i} className="flex gap-4 mb-2">
              <Input value={attr.name} onChange={(e) => handleAttributeChange(i, 'name', e.target.value)} placeholder="Name" />
              <Input value={attr.value} onChange={(e) => handleAttributeChange(i, 'value', e.target.value)} placeholder="Value" />
              <button onClick={() => removeAttributeField(i)} type="button" className="text-red-600 border px-2">Remove</button>
              {errors.attributes?.[i] && <p className="text-sm text-red-500">{errors.attributes[i]}</p>}
            </div>
          ))}
          <button type="button" className="border px-4 py-1" onClick={addAttributeField}>+ Add Attribute</button>
        </div>
        <div>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Adding..." : "Add Product Variant"}
          </Button>
        </div>
      </div>
    </ComponentCard>
  );
}
