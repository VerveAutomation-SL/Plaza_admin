"use client";

import React, { useEffect, useState } from "react";
import ComponentCard from "@/components/common/ComponentCard";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Button from "@/components/ui/button/Button";
import { addSubCategory, getAllMainCategories } from "@/lib/api/categoryApi";
import { toast } from "react-hot-toast";

interface MainCategory {
  mCategory_code: string;
  mCategory_name: string;
}

interface Props {
  cardTitle: string;
  nameLabel: string;
  mainCategoryLabel: string;
}

export default function DefaultInputs({ cardTitle, nameLabel, mainCategoryLabel }: Props) {
  const [SCategory_name, setName] = useState("");
  const [MainCategory_code, setMainCategoryCode] = useState("");
  const [mainCategories, setMainCategories] = useState<MainCategory[]>([]);
  const [errors, setErrors] = useState<{ name?: string; main?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await getAllMainCategories();
        setMainCategories(res.data);
      } catch (err) {
        console.error("Error loading categories", err);
      }
    }
    fetchCategories();
  }, []);

  const handleSubmit = async () => {
    const newErrors: { name?: string; main?: string } = {};
    if (!SCategory_name.trim()) newErrors.name = "Subcategory name is required";
    if (!MainCategory_code) newErrors.main = "Main category must be selected";
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    try {
      setIsSubmitting(true);
      await addSubCategory({ SCategory_name, MainCategory_code });
      toast.success("Subcategory added!", { position: "top-center" });
      setName("");
      setMainCategoryCode("");
    } catch (err) {
      console.error(err);
      toast.error("Failed to add subcategory", { position: "top-center" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ComponentCard title={cardTitle}>
      <div className="space-y-6">
        <div>
          <Label>{nameLabel}</Label>
          <Input
            value={SCategory_name}
            onChange={(e) => {
              setName(e.target.value);
              if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
            }}
            className={errors.name ? "border-red-500" : ""}
          />
          {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
        </div>

        <div>
          <Label>{mainCategoryLabel}</Label>
          <select
            value={MainCategory_code}
            onChange={(e) => {
              setMainCategoryCode(e.target.value);
              if (errors.main) setErrors((prev) => ({ ...prev, main: undefined }));
            }}
            className={`w-full border p-2 rounded ${errors.main ? "border-red-500" : ""}`}
          >
            <option value="">-- Select Main Category --</option>
            {mainCategories.map((cat) => (
              <option key={cat.mCategory_code} value={cat.mCategory_code}>
                {cat.mCategory_name}
              </option>
            ))}
          </select>
          {errors.main && <p className="text-sm text-red-500">{errors.main}</p>}
        </div>

        <Button onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? "Adding..." : "Add Subcategory"}
        </Button>
      </div>
    </ComponentCard>
  );
}
