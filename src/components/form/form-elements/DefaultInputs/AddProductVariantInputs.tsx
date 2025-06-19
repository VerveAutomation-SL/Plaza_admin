// app/product-variants/page.tsx (Add Product Variant Page)

"use client";
import React, { useState } from "react";
import ComponentCard from "../../../common/ComponentCard";
import Label from "../../Label";
import Input from "../../input/InputField";
import Button from "@/components/ui/button/Button";

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

  const handleAttributeChange = (index: number, field: keyof Attribute, value: string) => {
    setAttributes((prev) =>
      prev.map((attr, i) => (i === index ? { ...attr, [field]: value } : attr))
    );
  };

  const addAttributeField = () => {
    setAttributes([...attributes, { name: "", value: "" }]);
  };

  const handleSubmit = async () => {
    const payload = {
      product_code: productCode,
      productVariant_name: variantName,
      size,
      selling_price: Number(sellingPrice),
      barcode,
      discount_percentage: Number(discountPercentage),
      is_discount_active: isDiscountActive,
      attributes,
    };

    try {
      const res = await fetch("https://plaza.verveautomation.com/api/auth/AddProductsVariants", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      console.log("API response:", result);
      alert("Product variant added successfully!");
    } catch (err) {
      console.error("Error submitting form:", err);
      alert("Something went wrong.");
    }
  };

  return (
    <ComponentCard title={cardTitle}>
      <div className="space-y-6">
        {/* Row 1: Variant Name + Product Code */}
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-1/2">
            <Label>{productNameLabel}</Label>
            <Input type="text" value={variantName} onChange={(e) => setVariantName(e.target.value)} />
          </div>
          <div className="w-full md:w-1/2">
            <Label>{shopLabel}</Label>
            <Input type="text" value={productCode} onChange={(e) => setProductCode(e.target.value)} />
          </div>
        </div>

         {/* Row 2: Size + Selling Price */}
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-1/2">
            <Label>{mainCategoryLabel}</Label>
            <Input type="text" value={size} onChange={(e) => setSize(e.target.value)} />
          </div>
          <div className="w-full md:w-1/2">
            <Label>{subCategoryLabel}</Label>
            <Input type="number" value={sellingPrice} onChange={(e) => setSellingPrice(e.target.value)} />
          </div>
        </div>

        {/* Row 3: Barcode */}
        <div className="w-full">
          <Label>{barcodeLabel}</Label>
          <Input type="text" value={barcode} onChange={(e) => setBarcode(e.target.value)} />
        </div>

        {/* Row 4: Discount Percentage + Toggle */}
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-1/2">
            <Label>{discountLabel}</Label>
            <Input type="number" value={discountPercentage} onChange={(e) => setDiscountPercentage(e.target.value)} />
          </div>
          <div className="w-full md:w-1/2 flex items-center gap-2">
            <input type="checkbox" checked={isDiscountActive} onChange={(e) => setIsDiscountActive(e.target.checked)} />
            <Label>{discountToggleLabel}</Label>
          </div>
        </div>

        {/* Row 5: Attributes */}
        <div>
          <Label>{attributeLabel}</Label>
          {attributes.map((attr, index) => (
            <div className="flex gap-4 mb-2" key={index}>
              <Input
                type="text"
                value={attr.name}
                onChange={(e) => handleAttributeChange(index, "name", e.target.value)}
                placeholder="Attribute Name"
              />
              <Input
                type="text"
                value={attr.value}
                onChange={(e) => handleAttributeChange(index, "value", e.target.value)}
                placeholder="Attribute Value"
              />
            </div>
          ))}
          <button
            className="px-4 py-2 text-sm border rounded-md text-gray-700 border-gray-300 hover:bg-gray-100"
            onClick={addAttributeField}
            type="button"
          >
            + Add Attribute
          </button>
        </div>

        <div>
          <Button size="sm" variant="primary" onClick={handleSubmit}>
            Add Product Variant
          </Button>
        </div>
      </div>
    </ComponentCard>
  );
}
