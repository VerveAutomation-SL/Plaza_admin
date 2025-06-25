"use client";

import React, { useState, useEffect, useRef } from 'react';
import { addShop } from '@/lib/api/shopApi';
import { getBusinesses } from '@/lib/api/businessApi';

interface DefaultInputsProps {
  cardTitle: string;
  shopNameLabel: string;
  businessCodeLabel: string;
  locationLabel: string;
  contactNumberLabel: string;
  emailLabel: string;
  descriptionLabel: string;
  imageLabel: string;
}

interface ValidationErrors {
  shop_name?: string;
  description?: string;
  business_code?: string;
  location?: string;
  contact_number?: string;
  email?: string;
}

export default function DefaultInputs({
  cardTitle,
  shopNameLabel,
  businessCodeLabel,
  locationLabel,
  contactNumberLabel,
  emailLabel,
  descriptionLabel,
  imageLabel
}: DefaultInputsProps) {
  const [shop_name, setShopName] = useState("");
  const [description, setDescription] = useState("");
  const [business_code, setBusinessCode] = useState("");
  const [location, setLocation] = useState("");
  const [contact_number, setContactNumber] = useState("");
  const [email, setEmail] = useState("");
  const [image_url, setImageUrl] = useState("");
  const [businesses, setBusinesses] = useState<{ business_code: string; business_name: string }[]>([]);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchBusinesses() {
      try {
        const data = await getBusinesses();
        setBusinesses(data);
      } catch (error) {
        console.error("Failed to fetch businesses:", error);
      }
    }
    fetchBusinesses();
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
    if (!shop_name.trim()) newErrors.shop_name = "Shop name is required";
    if (!description.trim()) newErrors.description = "Description is required";
    if (!business_code.trim()) newErrors.business_code = "Business code is required";
    if (!location.trim()) newErrors.location = "Location is required";
    if (!contact_number.trim()) newErrors.contact_number = "Contact number is required";
    if (email && !/^\S+@\S+\.\S+$/.test(email)) newErrors.email = "Invalid email format";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setIsSubmitting(true);
    const payload = {
      owner_id: "1",
      shop_name,
      description,
      business_code,
      image_url,
      location,
      contact_number,
      email,
    };
    try {
      const res = await addShop(payload);
      alert("Shop added successfully!");
      setShopName("");
      setDescription("");
      setBusinessCode("");
      setLocation("");
      setContactNumber("");
      setEmail("");
      setImageUrl("");
      setErrors({});
    } catch (error) {
      console.error("Error adding shop:", error);
      alert("Failed to add shop.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredBusinesses = businesses.filter(b => b.business_name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="p-6 bg-white border rounded shadow space-y-6">
      <h2 className="text-xl font-bold">{cardTitle}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block font-semibold mb-1">{shopNameLabel}</label>
          <input
            value={shop_name}
            onChange={(e) => setShopName(e.target.value)}
            className={`w-full border p-2 ${errors.shop_name ? 'border-red-500' : ''}`}
          />
          {errors.shop_name && <p className="text-sm text-red-500">{errors.shop_name}</p>}
        </div>

        <div className="relative" ref={dropdownRef}>
          <label className="block font-semibold mb-1">{businessCodeLabel}</label>
          <div className="w-full border p-2 flex items-center justify-between cursor-pointer" onClick={() => setDropdownOpen(true)}>
            <input
              type="text"
              value={business_code ? businesses.find(b => b.business_code === business_code)?.business_name || searchTerm : searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setBusinessCode("");
                setDropdownOpen(true);
              }}
              placeholder="Search or select business"
              className="w-full outline-none"
            />
            <span className="ml-2 text-gray-500">▼</span>
          </div>
          {dropdownOpen && (
            <div className="absolute w-full border border-t-0 max-h-60 overflow-y-auto shadow-md bg-white z-10">
              {filteredBusinesses.length > 0 ? (
                filteredBusinesses.map((b) => (
                  <div
                    key={b.business_code}
                    onClick={() => {
                      setBusinessCode(b.business_code);
                      setSearchTerm(b.business_name);
                      setDropdownOpen(false);
                    }}
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                  >
                    {b.business_name}
                  </div>
                ))
              ) : (
                <div className="p-2 text-gray-500">No businesses found</div>
              )}
            </div>
          )}
          {errors.business_code && <p className="text-sm text-red-500">{errors.business_code}</p>}
        </div>

        <div>
          <label className="block font-semibold mb-1">{locationLabel}</label>
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className={`w-full border p-2 ${errors.location ? 'border-red-500' : ''}`}
          />
          {errors.location && <p className="text-sm text-red-500">{errors.location}</p>}
        </div>

        <div>
          <label className="block font-semibold mb-1">{contactNumberLabel}</label>
          <input
            value={contact_number}
            onChange={(e) => setContactNumber(e.target.value)}
            className={`w-full border p-2 ${errors.contact_number ? 'border-red-500' : ''}`}
          />
          {errors.contact_number && <p className="text-sm text-red-500">{errors.contact_number}</p>}
        </div>

        <div>
          <label className="block font-semibold mb-1">{emailLabel}</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`w-full border p-2 ${errors.email ? 'border-red-500' : ''}`}
          />
          {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
        </div>

        <div>
          <label className="block font-semibold mb-1">{imageLabel}</label>
          <input
            type="file"
            onChange={(e) => {
              const file = e.target.files?.[0];
              setImageUrl(file ? file.name : "");
            }}
            className="w-full border p-2"
          />
        </div>
      </div>

      <div>
        <label className="block font-semibold mb-1">{descriptionLabel}</label>
        <textarea
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={`w-full border p-2 ${errors.description ? 'border-red-500' : ''}`}
        />
        {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
      </div>

      <button
        onClick={handleSubmit}
        disabled={isSubmitting}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        {isSubmitting ? "Adding..." : "Add Shop"}
      </button>
    </div>
  );
}
