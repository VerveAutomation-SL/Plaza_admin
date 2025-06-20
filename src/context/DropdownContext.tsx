"use client";
import React, { createContext, useContext, useEffect, useState } from "react";

interface Option {
  value: string;
  label: string;
}

interface ShopResponse {
  id: string;
  shop_name: string;
}

interface MainCategoryResponse {
  mCategory_code: string;
  mCategory_name: string;
}

interface SubCategoryResponse {
  SCategory_code: string;
  SCategory_name: string;
}

interface DropdownContextType {
  shopOptions: Option[];
  mainCategoryOptions: Option[];
  subCategoryOptions: Option[];
  loading: boolean;
}

export const DropdownContext = createContext<DropdownContextType>({
  shopOptions: [],
  mainCategoryOptions: [],
  subCategoryOptions: [],
  loading: true,
});

export const DropdownProvider = ({ children }: { children: React.ReactNode }) => {
  const [shopOptions, setShopOptions] = useState<Option[]>([]);
  const [mainCategoryOptions, setMainCategoryOptions] = useState<Option[]>([]);
  const [subCategoryOptions, setSubCategoryOptions] = useState<Option[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDropdowns = async () => {
      try {
        const shopRes = await fetch("https://plaza.verveautomation.com/api/auth/getShops");
        const shopData = await shopRes.json();
        const shops: ShopResponse[] = shopData.shopDetails;
        const shopMapped = shops.map((shop) => ({
          value: shop.id,
          label: shop.shop_name,
        }));

        const mainRes = await fetch("https://plaza.verveautomation.com/api/auth/getallMCategory");
        const mainCats: MainCategoryResponse[] = await mainRes.json();
        const mainMapped = mainCats.map((cat) => ({
          value: cat.mCategory_code,
          label: cat.mCategory_name,
        }));

        const subRes = await fetch("https://plaza.verveautomation.com/api/auth/getallSubCategory");
        const subCats: SubCategoryResponse[] = await subRes.json();
        const subMapped = subCats.map((sub) => ({
          value: sub.SCategory_code,
          label: sub.SCategory_name,
        }));

        setShopOptions(shopMapped);
        setMainCategoryOptions(mainMapped);
        setSubCategoryOptions(subMapped);
      } catch (err) {
        console.error("Error fetching dropdown data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDropdowns();
  }, []);

  return (
    <DropdownContext.Provider
      value={{ shopOptions, mainCategoryOptions, subCategoryOptions, loading }}
    >
      {children}
    </DropdownContext.Provider>
  );
};

export const useDropdowns = () => useContext(DropdownContext);
