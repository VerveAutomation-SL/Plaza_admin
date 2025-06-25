"use client";
import React, { useState, useEffect, useRef } from "react";
import { addProductVariant, getAllProducts } from "@/lib/api/productApi";
import { AddProductVariant } from "@/lib/api/productApi";

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

export default function AddProductVariantPage() {
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
  const [products, setProducts] = useState<{ product_name: string; product_code: string; barcode: string }[]>([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await getAllProducts();
        if (Array.isArray(response.formattedProducts)) {
          setProducts(response.formattedProducts);
        } else {
          console.error("getAllProducts() did not return an array:", response);
          setProducts([]);
        }
      } catch (err) {
        console.error("Failed to fetch products", err);
        setProducts([]);
      }
    }

    fetchProducts();
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};
    if (!variantName.trim()) newErrors.variantName = "Variant name is required";
    if (!productCode.trim()) newErrors.productCode = "Product code is required";
    if (!size.trim()) newErrors.size = "Size is required";
    if (!sellingPrice.trim()) newErrors.sellingPrice = "Selling price is required";
    else if (isNaN(Number(sellingPrice)) || Number(sellingPrice) <= 0) newErrors.sellingPrice = "Invalid price";
    if (!barcode.trim()) newErrors.barcode = "Barcode is required";
    if (isDiscountActive && !discountPercentage.trim()) newErrors.discountPercentage = "Discount is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAttributeChange = (index: number, field: keyof Attribute, value: string) => {
    const newAttrs = [...attributes];
    newAttrs[index][field] = value;
    setAttributes(newAttrs);
  };

  const addAttributeField = () => {
    setAttributes([...attributes, { name: "", value: "" }]);
  };

  const removeAttributeField = (index: number) => {
    const newAttrs = attributes.filter((_, i) => i !== index);
    setAttributes(newAttrs);
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setIsSubmitting(true);

    const validAttributes = attributes.filter(attr => attr.name && attr.value);

    const payload: AddProductVariant = {
      product_code: productCode,
      productVariant_name: variantName,
      size,
      selling_price: parseFloat(sellingPrice),
      barcode,
      discount_percentage: parseFloat(discountPercentage) || 0,
      is_discount_active: isDiscountActive,
      attributes: validAttributes,
    };

    try {
      const res = await addProductVariant(payload);
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
      alert("Error submitting the form. Try again.");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredProducts = Array.from(new Map(products.map(p => [p.product_code, p])).values())
    .filter(p => p.product_name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="p-6 bg-white border rounded shadow space-y-6">
      <h2 className="text-xl font-bold">Add New Product Variant</h2>

      {/* Variant Name and Product Dropdown */}
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full">
          <label className="block font-semibold mb-1">Variant Name</label>
          <input value={variantName} onChange={(e) => setVariantName(e.target.value)} className="w-full border p-2" />
          {errors.variantName && <p className="text-sm text-red-500">{errors.variantName}</p>}
        </div>
        <div className="w-full relative" ref={dropdownRef}>
          <label className="block font-semibold mb-1">Select Product</label>
          <div
            className="w-full border p-2 cursor-pointer flex justify-between items-center"
            onClick={() => setDropdownOpen(prev => !prev)}
          >
            <input
              type="text"
              value={productCode ? products.find(p => p.product_code === productCode)?.product_name || searchTerm : searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setProductCode("");
                setDropdownOpen(true);
              }}
              placeholder="Search or select product"
              className="w-full outline-none"
            />
            <span className="ml-2 text-gray-500">▼</span>
          </div>
          {dropdownOpen && (
            <div className="absolute w-full border border-t-0 max-h-60 overflow-y-auto shadow-md bg-white z-10">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((p) => (
                  <div
                    key={`${p.product_code}-${p.barcode}`}
                    onClick={() => {
                      setProductCode(p.product_code);
                      setSearchTerm(p.product_name);
                      setDropdownOpen(false);
                    }}
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                  >
                    {p.product_name}
                  </div>
                ))
              ) : (
                <div className="p-2 text-gray-500">No products found</div>
              )}
            </div>
          )}
          {errors.productCode && <p className="text-sm text-red-500">{errors.productCode}</p>}
        </div>
      </div>

      {/* Size and Price */}
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full">
          <label className="block font-semibold mb-1">Size</label>
          <input value={size} onChange={(e) => setSize(e.target.value)} className="w-full border p-2" />
          {errors.size && <p className="text-sm text-red-500">{errors.size}</p>}
        </div>
        <div className="w-full">
          <label className="block font-semibold mb-1">Selling Price</label>
          <input inputMode="decimal" pattern="[0-9]*" value={sellingPrice} onChange={(e) => setSellingPrice(e.target.value)} className="w-full border p-2" />
          {errors.sellingPrice && <p className="text-sm text-red-500">{errors.sellingPrice}</p>}
        </div>
      </div>

      {/* Barcode */}
      <div>
        <label className="block font-semibold mb-1">Barcode</label>
        <input value={barcode} onChange={(e) => setBarcode(e.target.value)} className="w-full border p-2" />
        {errors.barcode && <p className="text-sm text-red-500">{errors.barcode}</p>}
      </div>

      {/* Discount Section */}
      <div className="flex flex-col md:flex-row gap-6 items-center">
        <div className="w-full">
          <label className="block font-semibold mb-1">Discount Percentage</label>
          <input
            type="number"
            value={discountPercentage}
            onChange={(e) => setDiscountPercentage(e.target.value)}
            className="w-full border p-2"
          />
          {errors.discountPercentage && <p className="text-sm text-red-500">{errors.discountPercentage}</p>}
        </div>
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={isDiscountActive}
            onChange={(e) => setIsDiscountActive(e.target.checked)}
            className="h-6 w-6"
          />
          <label className="font-semibold">Is Discount Active</label>
        </div>
      </div>

      {/* Attributes */}
      <div>
        <label className="block font-semibold mb-1">Attributes (Optional)</label>
        {attributes.map((attr, index) => (
          <div key={index} className="flex gap-2 mb-2">
            <input
              value={attr.name}
              onChange={(e) => handleAttributeChange(index, "name", e.target.value)}
              placeholder="Name"
              className="border p-2 w-1/2"
            />
            <input
              value={attr.value}
              onChange={(e) => handleAttributeChange(index, "value", e.target.value)}
              placeholder="Value"
              className="border p-2 w-1/2"
            />
            <button type="button" className="text-red-600" onClick={() => removeAttributeField(index)}>
              Remove
            </button>
          </div>
        ))}
        <button type="button" onClick={addAttributeField} className="border px-4 py-1">
          + Add Attribute
        </button>
      </div>

      {/* Submit Button */}
      <button onClick={handleSubmit} disabled={isSubmitting} className="bg-blue-600 text-white px-4 py-2 rounded">
        {isSubmitting ? "Submitting..." : "Add Product Variant"}
      </button>
    </div>
  );
}
