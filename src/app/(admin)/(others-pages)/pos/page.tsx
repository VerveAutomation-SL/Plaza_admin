"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Search, ShoppingCart, Plus, Minus, X, Eye } from "lucide-react";
import { getAllProducts, getProductByBarcode } from "@/lib/api/productApi";
import { placeOrder } from "@/lib/api/orderApi";
import toast, { Toaster } from "react-hot-toast";
import ViewProductModal from "@/components/ui/modal/ViewProductModal";
import { getAllMainCategories, getAllSubCategories } from "@/lib/api/categoryApi";

interface Product {
  product_code: string;
  productVarient_code: string;
  product_name: string;
  size: string;
  barcode: string;
  selling_price: number;
  discount_percentage: number;
  is_discount_active: boolean;
  discountSellingPrice: number;
  total_quantity: number;
  mCategory_code: string;
  sCategory_code: string;
  product_description: string;
  shop_id: string;
  image_url: string;
  quantity_type?: string | null;
}

interface CartItem extends Product {
  quantity: number;
}

interface DecodedToken {
  role: string;
  [key: string]: string;
}

interface CategoryGroup {
  main: string;
  code: string;
  subs: { name: string; code: string }[];
}

const PRODUCTS_PER_PAGE = 6;

export default function POSPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchMode, setSearchMode] = useState<"name" | "barcode">("name");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [discount, setDiscount] = useState(0);
  const [products, setProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [categoryGroups, setCategoryGroups] = useState<CategoryGroup[]>([]);

  const [selectedMainCategory, setSelectedMainCategory] = useState<{ code: string; name: string }>({ code: "ALL", name: "Main Category" });
  const [selectedSubCategory, setSelectedSubCategory] = useState<{ code: string; name: string }>({ code: "ALL", name: "Sub Category" });
  const [mainDropdownOpen, setMainDropdownOpen] = useState(false);
  const [subDropdownOpen, setSubDropdownOpen] = useState(false);

  const [onlyDiscounted, setOnlyDiscounted] = useState(false);
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const res = await getAllProducts();
        setProducts(res.formattedProducts);
      } catch (error) {
        toast.error("Failed to load products");
        console.error("Failed to fetch products:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const [mainRes, subRes] = await Promise.all([
          getAllMainCategories(),
          getAllSubCategories(),
        ]);

        const mainList = mainRes.data || [];
        const subList = subRes.data || [];

        const structured = mainList.map((main: any) => ({
          main: main.mCategory_name,
          code: main.mCategory_code,
          subs: subList
            .filter((sub: any) => sub.MainCategory?.mCategory_code === main.mCategory_code)
            .map((sub: any) => ({
              name: sub.SCategory_name,
              code: sub.SCategory_code,
            })),
        }));

        setCategoryGroups(structured);
      } catch (err) {
        console.error("Failed to fetch categories", err);
      }
    };

    fetchCategories();
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = product.product_name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesMain = selectedMainCategory.code === "ALL" || product.mCategory_code === selectedMainCategory.code;
      const matchesSub = selectedSubCategory.code === "ALL" || product.sCategory_code === selectedSubCategory.code;
      const matchesDiscount = !onlyDiscounted || product.is_discount_active;
      const matchesStock = !onlyInStock || product.total_quantity > 0;
      return matchesSearch && matchesMain && matchesSub && matchesDiscount && matchesStock;
    });
  }, [searchTerm, selectedMainCategory, selectedSubCategory, onlyDiscounted, onlyInStock, products]);

  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * PRODUCTS_PER_PAGE;
    return filteredProducts.slice(start, start + PRODUCTS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  const addToCart = (product: Product) => {
    let updatedCart: CartItem[] = [];
    setCart((prevCart: CartItem[]) => {
      const existingItem = prevCart.find(item => item.productVarient_code === product.productVarient_code);
      if (existingItem) {
        updatedCart = prevCart.map(item =>
          item.productVarient_code === product.productVarient_code
            ? { ...item, quantity: Math.min(item.quantity + 1, product.total_quantity) }
            : item
        );
      } else {
        updatedCart = [...prevCart, { ...product, quantity: 1 }];
      }
      return updatedCart;
    });

    const alreadyInCart = cart.find(item => item.productVarient_code === product.productVarient_code);
    if (alreadyInCart) {
      toast.success("Increased quantity");
    } else {
      toast.success("Added to cart");
    }
  };

  const updateQuantity = (variantCode: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(variantCode);
      return;
    }
    setCart((prevCart: CartItem[]) =>
      prevCart.map((item: CartItem) => {
        if (item.productVarient_code === variantCode) {
          const product = products.find(p => p.productVarient_code === variantCode);
          return { ...item, quantity: Math.min(newQuantity, product?.total_quantity || 0) };
        }
        return item;
      })
    );
  };

  const removeFromCart = (variantCode: string) => {
    toast("Removed from cart", { icon: "🗑️" });
    setCart((prevCart: CartItem[]) =>
      prevCart.filter((item: CartItem) => item.productVarient_code !== variantCode)
    );
  };

  const subtotal = cart.reduce((sum, item) => {
    const price = item.is_discount_active ? item.discountSellingPrice : item.selling_price;
    return sum + price * item.quantity;
  }, 0);

  const discountAmount = (subtotal * discount) / 100;
  const total = subtotal - discountAmount;
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleOrder = async () => {
    if (cart.length === 0) {
      toast.error("Cart is empty");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Not authenticated");
      return;
    }

    try {
      const decoded = JSON.parse(atob(token.split('.')[1])) as DecodedToken;
      const cashierId = decoded.user_id || decoded.id || "U001";

      const payload = {
        cashier_id: cashierId,
        items: cart.map((item) => ({
          variant_id: item.productVarient_code,
          quantity: item.quantity,
        })),
      };

      await placeOrder(payload);

      toast.success("Order placed successfully!");
      setCart([]);
      setDiscount(0);
    } catch (error) {
      console.error("Order failed", error);
      toast.error("Order failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-black grid grid-cols-3 gap-6 p-6">
      <Toaster position="top-right" />

      {/* Left - Products */}
      <div className="col-span-2 flex flex-col bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Available Products</h2>

        {/* Search */}
        <div className="relative mb-4 flex gap-4 items-center">
          <select
            value={searchMode}
            onChange={(e) => {
              setSearchMode(e.target.value as "name" | "barcode");
              setSearchTerm("");
            }}
            className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none"
          >
            <option value="name">Search by Name</option>
            <option value="barcode">Search by Barcode</option>
          </select>

          <div className="relative flex-1">
            <input
              type="text"
              placeholder={searchMode === "barcode" ? "Enter barcode..." : "Enter product name..."}
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full border-2 border-gray-200 rounded-full py-3 px-4 pl-12 focus:outline-none focus:border-blue-500 transition-colors"
            />
            <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 items-center mb-6 relative z-20">
          {/* MAIN CATEGORY BUTTON */}
          <div className="relative">
            <button
              onClick={() => setMainDropdownOpen((prev) => !prev)}
              className="px-4 py-2 border rounded bg-white shadow text-sm"
            >
              {selectedMainCategory.name} ▾
            </button>
            {mainDropdownOpen && (
              <ul className="absolute mt-2 z-30 bg-white border rounded shadow w-44 max-h-55 overflow-y-auto">
                <li
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    setSelectedMainCategory({ code: "ALL", name: "Main Category" });
                    setSelectedSubCategory({ code: "ALL", name: "Sub Category" });
                    setMainDropdownOpen(false);
                  }}
                >
                  All Categories
                </li>
                {categoryGroups.map((cat) => (
                  <li
                    key={cat.code}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      setSelectedMainCategory({ code: cat.code, name: cat.main });
                      setSelectedSubCategory({ code: "ALL", name: "Sub Category" });
                      setMainDropdownOpen(false);
                    }}
                  >
                    {cat.main}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* SUB CATEGORY BUTTON */}
          {selectedMainCategory.code !== "ALL" && (
            <div className="relative">
              <button
                onClick={() => setSubDropdownOpen((prev) => !prev)}
                className="px-4 py-2 border rounded bg-white shadow text-sm"
              >
                {selectedSubCategory.name} ▾
              </button>
              {subDropdownOpen && (
                <ul className="absolute mt-2 z-30 bg-white border rounded shadow w-44 max-h-60 overflow-y-auto">
                  <li
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      setSelectedSubCategory({ code: "ALL", name: "Sub Category" });
                      setSubDropdownOpen(false);
                    }}
                  >
                    All Subcategories
                  </li>
                  {categoryGroups
                    .find((cat) => cat.code === selectedMainCategory.code)
                    ?.subs.map((sub) => (
                      <li
                        key={sub.code}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => {
                          setSelectedSubCategory({ code: sub.code, name: sub.name });
                          setSubDropdownOpen(false);
                        }}
                      >
                        {sub.name}
                      </li>
                    ))}
                </ul>
              )}
            </div>
          )}

          {/* Discount Button */}
          <button
            onClick={() => {
              setOnlyDiscounted((prev) => !prev);
              setCurrentPage(1);
            }}
            className={`px-4 py-2 rounded-full text-sm font-medium border ${onlyDiscounted ? 'bg-green-100 text-green-700 border-green-300' : 'bg-gray-100 text-gray-700 border-gray-300'}`}
          >
            {onlyDiscounted ? "✓ Discounted" : "Show Discounts"}
          </button>

          {/* Stock Button */}
          <button
            onClick={() => {
              setOnlyInStock((prev) => !prev);
              setCurrentPage(1);
            }}
            className={`px-4 py-2 rounded-full text-sm font-medium border ${onlyInStock ? 'bg-blue-100 text-blue-700 border-blue-300' : 'bg-gray-100 text-gray-700 border-gray-300'}`}
          >
            {onlyInStock ? "✓ In Stock Only" : "Show In Stock"}
          </button>
        </div>

        {/* Product Grid or Loading */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="animate-pulse border rounded-lg p-4 bg-gray-100 h-48" />
            ))}
          </div>
        ) : paginatedProducts.length === 0 ? (
          <div className="text-center text-gray-500 py-12">
            <p>No products match your search or filters.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {paginatedProducts.map((product) => {
                const cartItem = cart.find(item => item.productVarient_code === product.productVarient_code);
                const isOutOfStock = product.total_quantity === 0;
                const isMaxQuantity = cartItem && cartItem.quantity >= product.total_quantity;
                const displayPrice = product.is_discount_active ? product.discountSellingPrice : product.selling_price;

                return (
                  <div
                    key={product.productVarient_code}
                    className="border border-gray-200 rounded-lg p-4 bg-white hover:shadow-md transition-shadow text-sm flex flex-col h-full"
                  >
                    <img
                      src={product.image_url || "/placeholder.png"}
                      alt={product.product_name}
                      className="h-32 w-full object-contain mb-2 rounded"
                    />

                    <h3 className="font-semibold text-gray-800 text-base">{product.product_name}</h3>
                    <p className="text-gray-500 mb-1">
                      Stock:{" "}
                      <span className={product.total_quantity > 0 ? "text-green-600" : "text-red-500"}>
                        {product.total_quantity > 0 ? `${product.total_quantity} available` : "Out of stock"}
                      </span>
                    </p>

                    <p className="text-gray-800 font-bold mb-2">
                      LKR {displayPrice.toFixed(2)}{" "}
                      {product.is_discount_active && (
                        <span className="text-gray-400 line-through ml-2 text-sm">
                          LKR {product.selling_price.toFixed(2)}
                        </span>
                      )}
                    </p>

                    <div className="mt-auto flex justify-between gap-2">
                      <button
                        onClick={() => setSelectedProduct(product)} // ✅ Trigger modal here
                        className="flex items-center justify-center w-10 h-10 rounded bg-gray-100 hover:bg-gray-200 text-gray-700"
                      >
                        <Eye className="h-5 w-5" />
                      </button>

                      <button
                        onClick={() => addToCart(product)}
                        disabled={isOutOfStock || isMaxQuantity}
                        className={`flex-1 py-2 px-4 rounded text-sm font-medium transition-colors ${isOutOfStock || isMaxQuantity
                          ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                          : "bg-blue-500 hover:bg-blue-600 text-white"
                          }`}
                      >
                        {isOutOfStock ? "Out of Stock" : isMaxQuantity ? "Max Qty" : "Add to Cart"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {selectedProduct && (
              <ViewProductModal
                isOpen={true}
                onClose={() => setSelectedProduct(null)}
                variants={[selectedProduct]}
              />
            )}
          </>
        )}

        {/* Pagination */}
        {!isLoading && paginatedProducts.length > 0 && (
          <div className="flex justify-center items-center gap-4 mt-6">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-sm disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-sm disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}

        {/* Order Summary */}
        <div className="border-t border-gray-200 mt-6 pt-6">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">Order Summary</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2 text-sm">
              <p className="flex justify-between">
                <span>Total Items:</span>
                <span className="font-semibold">{totalItems}</span>
              </p>
              <p className="flex justify-between">
                <span>Sub Total:</span>
                <span className="font-semibold">${subtotal.toFixed(2)}</span>
              </p>
              <p className="flex justify-between">
                <span>Discount:</span>
                <span className="font-semibold text-red-600">-${discountAmount.toFixed(2)}</span>
              </p>
              <p className="flex justify-between text-lg font-bold border-t pt-2">
                <span>Total:</span>
                <span className="text-green-600">${total.toFixed(2)}</span>
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Discount (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={discount}
                onChange={(e) => setDiscount(Math.max(0, Math.min(100, Number(e.target.value))))}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Right - Cart */}
      <div className="flex flex-col bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Cart</h2>

        <div className="space-y-3 flex-1 overflow-y-auto">
          {cart.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <ShoppingCart className="h-12 w-12 mx-auto mb-2 text-gray-300" />
              <p>Your cart is empty</p>
            </div>
          ) : (
            cart.map((item) => {
              const price = item.is_discount_active ? item.discountSellingPrice : item.selling_price;
              return (
                <div
                  key={item.productVarient_code}
                  className="flex items-center border border-gray-200 rounded-lg p-3 bg-gray-50"
                >
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm text-gray-800">{item.product_name}</h3>
                    <p className="text-green-600 font-medium text-xs mt-1">
                      In Stock ({item.total_quantity} available)
                    </p>
                    <p className="text-sm font-semibold text-gray-700">
                      ${price} × {item.quantity} = ${(price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 ml-3">
                    <button
                      onClick={() => updateQuantity(item.productVarient_code, item.quantity - 1)}
                      className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 text-gray-600"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="w-8 text-center font-semibold">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.productVarient_code, item.quantity + 1)}
                      disabled={item.quantity >= item.total_quantity}
                      className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                    <button
                      onClick={() => removeFromCart(item.productVarient_code)}
                      className="w-6 h-6 flex items-center justify-center rounded-full bg-red-100 hover:bg-red-200 text-red-600 ml-2"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="pt-6 border-t border-gray-200">
          <button
            onClick={handleOrder}
            disabled={cart.length === 0}
            className={`flex items-center justify-center gap-2 w-full py-4 rounded-full font-semibold transition-colors ${cart.length === 0
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-black hover:bg-gray-800 text-white"
              }`}
          >
            <ShoppingCart className="h-5 w-5" />
            Place Order (${total.toFixed(2)})
          </button>
        </div>
      </div>
    </div>
  );
}


