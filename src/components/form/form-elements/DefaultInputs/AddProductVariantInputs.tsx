"use client";

import React, { useState, useEffect, useRef } from "react";
import { addProductVariant, getAllProducts } from "@/lib/api/productApi";
import { AddProductVariant } from "@/lib/api/productApi";
import { toast } from "react-hot-toast";

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
}

export default function AddProductVariantPage(props: DefaultInputsProps) {
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
      await addProductVariant(payload);
      toast.success("Product variant added successfully!", {
        style: {
          top: "5rem"
        },
        position: "top-center"
      });
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
      toast.error("Error submitting the form. Try again.", {
        style: {
          top: "5rem"
        },
        position: "top-center"
      });
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirm = () => {
    if (!validateForm()) return;

    toast.custom((t) => (
      <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/40 backdrop-blur-lg mt-80">
        <div className="bg-white dark:bg-gray-800 px-8 py-6 rounded-xl shadow-xl border border-gray-300 max-w-md w-full z-[99999]">
          <p className="text-gray-800 dark:text-white mb-6 text-center text-lg font-semibold">
            Are you sure you want to add this product variant?
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
                toast.error("Product variant addition cancelled.", {
                  style: { top: "5rem" },
                  position: "top-center"
                });
              }}
              className="px-5 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    ));
  };

  const filteredProducts = Array.from(new Map(products.map(p => [p.product_code, p])).values())
    .filter(p => p.product_name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="p-6 bg-white border rounded shadow space-y-6">
      <h2 className="text-xl font-bold">{props.cardTitle}</h2>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full">
          <label className="block font-semibold mb-1">{props.productNameLabel}</label>
          <input value={variantName} onChange={(e) => setVariantName(e.target.value)} className="w-full border p-2" />
          {errors.variantName && <p className="text-sm text-red-500">{errors.variantName}</p>}
        </div>
        <div className="w-full relative" ref={dropdownRef}>
          <label className="block font-semibold mb-1">{props.shopLabel}</label>
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

      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full">
          <label className="block font-semibold mb-1">{props.mainCategoryLabel}</label>
          <input value={size} onChange={(e) => setSize(e.target.value)} className="w-full border p-2" />
          {errors.size && <p className="text-sm text-red-500">{errors.size}</p>}
        </div>
        <div className="w-full">
          <label className="block font-semibold mb-1">{props.subCategoryLabel}</label>
          <input inputMode="decimal" pattern="[0-9]*" value={sellingPrice} onChange={(e) => setSellingPrice(e.target.value)} className="w-full border p-2" />
          {errors.sellingPrice && <p className="text-sm text-red-500">{errors.sellingPrice}</p>}
        </div>
      </div>

      <div>
        <label className="block font-semibold mb-1">{props.barcodeLabel}</label>
        <input value={barcode} onChange={(e) => setBarcode(e.target.value)} className="w-full border p-2" />
        {errors.barcode && <p className="text-sm text-red-500">{errors.barcode}</p>}
      </div>

      <div className="flex flex-col md:flex-row gap-6 items-center">
        <div className="w-full">
          <label className="block font-semibold mb-1">{props.discountLabel}</label>
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
          <label className="font-semibold">{props.discountToggleLabel}</label>
        </div>
      </div>

      <div>
        <label className="block font-semibold mb-1">{props.attributeLabel}</label>
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

      <button onClick={handleConfirm} disabled={isSubmitting} className="bg-blue-600 text-white px-4 py-2 rounded">
        {isSubmitting ? "Submitting..." : "Add Product Variant"}
      </button>
    </div>
  );
}
