"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Search, ShoppingCart, Plus, Minus, X } from "lucide-react";
import { getAllProducts } from "@/lib/api/productApi";
import { placeOrder } from "@/lib/api/orderApi";
import toast, { Toaster } from "react-hot-toast";

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
  image_url?: string;
}

interface CartItem extends Product {
  quantity: number;
}

const PRODUCTS_PER_PAGE = 6;

export default function POSPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [discount, setDiscount] = useState(0);
  const [products, setProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [onlyDiscounted, setOnlyDiscounted] = useState(false);
  const [onlyInStock, setOnlyInStock] = useState(false);

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

  const categories = useMemo(() => {
    const all = products.map(p => p.mCategory_code);
    return ["All", ...Array.from(new Set(all))];
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = product.product_name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === "All" || product.mCategory_code === selectedCategory;
      const matchesDiscount = !onlyDiscounted || product.is_discount_active;
      const matchesStock = !onlyInStock || product.total_quantity > 0;
      return matchesSearch && matchesCategory && matchesDiscount && matchesStock;
    });
  }, [searchTerm, selectedCategory, onlyDiscounted, onlyInStock, products]);

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
    // Decode cashier ID from token (assuming JWT contains it)
    const decoded: any = JSON.parse(atob(token.split('.')[1]));
    const cashierId = decoded.user_id || decoded.id || "U001"; // fallback or change based on your backend

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
        <div className="relative mb-4">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full border-2 border-gray-200 rounded-full py-3 px-4 pl-12 focus:outline-none focus:border-blue-500 transition-colors"
          />
          <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 items-center mb-6">
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setCurrentPage(1);
            }}
            className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat === "All" ? "All Categories" : cat}</option>
            ))}
          </select>

          <button
            onClick={() => {
              setOnlyDiscounted((prev) => !prev);
              setCurrentPage(1);
            }}
            className={`px-4 py-2 rounded-full text-sm font-medium border ${onlyDiscounted ? 'bg-green-100 text-green-700 border-green-300' : 'bg-gray-100 text-gray-700 border-gray-300'
              }`}
          >
            {onlyDiscounted ? "✓ Discounted" : "Show Discounts"}
          </button>

          <button
            onClick={() => {
              setOnlyInStock((prev) => !prev);
              setCurrentPage(1);
            }}
            className={`px-4 py-2 rounded-full text-sm font-medium border ${onlyInStock ? 'bg-blue-100 text-blue-700 border-blue-300' : 'bg-gray-100 text-gray-700 border-gray-300'
              }`}
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
                  <h3 className="font-semibold text-gray-800">{product.product_name}</h3>
                  <p className="text-gray-600">Size: {product.size}</p>
                  <p className="text-gray-600">Barcode: {product.barcode}</p>
                  <p className="text-gray-600">Description: {product.product_description}</p>
                  <p className="text-gray-600">Main Category: {product.mCategory_code}</p>
                  <p className="text-gray-600">Sub Category: {product.sCategory_code}</p>
                  <p className="text-gray-600">Shop ID: {product.shop_id}</p>
                  <p className="text-green-600 font-bold my-1">
                    ${displayPrice}
                    {product.is_discount_active && (
                      <span className="line-through text-gray-400 ml-2 text-sm">${product.selling_price}</span>
                    )}
                  </p>
                  <p className="text-gray-500 mb-3">Stock: {product.total_quantity}</p>

                  <button
                    onClick={() => addToCart(product)}
                    disabled={isOutOfStock || isMaxQuantity}
                    className={`w-full mt-auto py-2 px-4 rounded-full text-sm font-medium transition-colors ${isOutOfStock || isMaxQuantity
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-blue-500 hover:bg-blue-600 text-white'
                      }`}
                  >
                    <Plus className="h-4 w-4 inline mr-1" />
                    {isOutOfStock ? 'Out of Stock' : isMaxQuantity ? 'Max Qty' : 'Add to Cart'}
                  </button>
                </div>
              );
            })}
          </div>
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
