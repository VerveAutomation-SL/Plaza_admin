"use client";

import React, { useState } from "react";
import ComponentCard from "@/components/common/ComponentCard";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Button from "@/components/ui/button/Button";
import { addMainCategory } from "@/lib/api/categoryApi";
import { toast } from "react-hot-toast";

interface Props {
  cardTitle: string;
  nameLabel: string;
}

export default function DefaultInputs({ cardTitle, nameLabel }: Props) {
  const [mCategory_name, setName] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!mCategory_name.trim()) {
      setError("Main category name is required");
      return;
    }

    try {
      setIsSubmitting(true);
      await addMainCategory({ mCategory_name });
      toast.success("Main category added!", { position: "top-center" });
      setName("");
    } catch (err) {
      console.error(err);
      toast.error("Failed to add main category", { position: "top-center" });
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
            value={mCategory_name}
            onChange={(e) => {
              setName(e.target.value);
              setError("");
            }}
            className={error ? "border-red-500" : ""}
          />
          {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
        <Button onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? "Adding..." : "Add Category"}
        </Button>
      </div>
    </ComponentCard>
  );
}
