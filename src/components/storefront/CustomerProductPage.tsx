import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Product, ProductVariant } from '../../types';
import {
  ArrowLeft,
  ShoppingBag,
  Star,
  Truck,
  Shield,
  RotateCcw,
  CheckCircle2,
  ChevronRight,
  Share2,
} from 'lucide-react';

export const CustomerProductPage: React.FC = () => {
  const {
    selectedProduct,
    addToCart,
    openCheckoutPage,
    openStorefront,
  } = useApp();

  if (!selectedProduct) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <p className="text-slate-500">No product selected.</p>
        <button
          onClick={openStorefront}
          className="mt-4 px-4 py-2 bg-slate-900 text-white rounded-lg text-xs"
        >
          Return to Storefront
        </button>
      </div>
    );
  }

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    selectedProduct.variants[0] || null
  );
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const price = selectedVariant?.price ?? selectedProduct.price;

  const handleBuyNow = () => {
    addToCart(selectedProduct, quantity, selectedVariant?.id);
    openCheckoutPage();
  };

  const handleAddBag = () => {
    addToCart(selectedProduct, quantity, selectedVariant?.id);
  };

  return (
    <div className="font-sans text-slate-900 dark:text-slate-100 bg-[#FAF9F6] dark:bg-slate-950 min-h-screen pb-20">
      {/* Breadcrumbs Navigation */}
      <div className="border-b border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <button
              onClick={openStorefront}
              className="hover:text-slate-900 dark:hover:text-white flex items-center gap-1 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Catalog</span>
            </button>
            <span>/</span>
            <span className="text-slate-700 dark:text-slate-300">{selectedProduct.category}</span>
            <span>/</span>
            <span className="text-slate-900 dark:text-white font-medium truncate max-w-[200px]">
              {selectedProduct.title}
            </span>
          </div>

          <div className="text-xs text-emerald-700 dark:text-emerald-400 font-medium hidden sm:flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Delivery Available Across All Cities in Pakistan</span>
          </div>
        </div>
      </div>

      {/* Main PDP Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Gallery Left (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="relative rounded-2xl overflow-hidden bg-neutral-100 dark:bg-neutral-900 border border-slate-200 dark:border-slate-800 shadow-md aspect-[4/3]">
              <img
                src={selectedProduct.images[activeImageIndex] || selectedProduct.images[0]}
                alt={selectedProduct.title}
                referrerPolicy="no-referrer"
                onError={(e) => {
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1000&q=80';
                }}
                className="w-full h-full object-cover"
              />
              {selectedProduct.isNewArrival && (
                <span className="absolute top-4 left-4 bg-white/95 dark:bg-slate-900/95 text-slate-900 dark:text-white text-[11px] font-bold px-3 py-1 rounded shadow-xs">
                  NEW ARRIVAL
                </span>
              )}
            </div>

            {/* Thumbnail selector if multiple images */}
            {selectedProduct.images.length > 1 && (
              <div className="flex items-center gap-3">
                {selectedProduct.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                      activeImageIndex === idx
                        ? 'border-slate-900 dark:border-white shadow-sm'
                        : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Delivery & Assurance Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4">
              <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs space-y-1">
                <Truck className="w-4 h-4 text-slate-700 dark:text-slate-300" />
                <div className="font-semibold text-slate-900 dark:text-white">Cash on Delivery (COD)</div>
                <p className="text-[11px] text-slate-500">Pay cash upon inspection at your doorstep</p>
              </div>

              <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs space-y-1">
                <Shield className="w-4 h-4 text-rose-500" />
                <div className="font-semibold text-slate-900 dark:text-white">FraudShield AI Verified</div>
                <p className="text-[11px] text-slate-500">Safe, secure order screening &amp; SMS confirmation</p>
              </div>

              <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs space-y-1">
                <RotateCcw className="w-4 h-4 text-emerald-600" />
                <div className="font-semibold text-slate-900 dark:text-white">7-Day Return Policy</div>
                <p className="text-[11px] text-slate-500">Hassle-free replacement if damaged in transit</p>
              </div>
            </div>
          </div>

          {/* Contiguous Purchase Module Right (5 cols) */}
          <div className="lg:col-span-5 p-6 sm:p-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <div>
              <div className="text-xs uppercase tracking-wider text-slate-500 font-semibold">
                {selectedProduct.category} · SKU: {selectedProduct.sku}
              </div>

              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 dark:text-white mt-1.5 leading-tight">
                {selectedProduct.title}
              </h1>

              <div className="flex items-center gap-2 mt-2 text-xs">
                <div className="flex text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedProduct.rating}</span>
                <span className="text-slate-500">({selectedProduct.reviewsCount} customer reviews in Pakistan)</span>
              </div>
            </div>

            {/* Price Box */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 flex items-baseline justify-between">
              <div>
                <div className="text-2xl sm:text-3xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">
                  Rs. {price.toLocaleString(undefined, { minimumFractionDigits: 0 })}
                </div>
                {selectedProduct.compareAtPrice && (
                  <div className="text-xs text-slate-500 line-through font-mono mt-0.5">
                    Original Price: Rs. {selectedProduct.compareAtPrice.toLocaleString()}
                  </div>
                )}
              </div>

              <div className="text-right">
                <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-1 rounded-md border border-emerald-200 dark:border-emerald-800">
                  In Stock ({selectedVariant?.stock ?? selectedProduct.stock} left)
                </span>
                <div className="text-[10px] text-slate-500 mt-1 font-mono">TCS / Leopards Courier</div>
              </div>
            </div>

            {/* Description */}
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
              {selectedProduct.description}
            </p>

            {/* Variant selector */}
            {selectedProduct.variants.length > 0 && (
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                  Select Finish / Specifications:
                </label>
                <div className="space-y-1.5">
                  {selectedProduct.variants.map((v) => (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVariant(v)}
                      className={`w-full p-3 rounded-xl border text-left text-xs flex items-center justify-between transition-colors ${
                        selectedVariant?.id === v.id
                          ? 'border-slate-900 dark:border-white bg-slate-50 dark:bg-slate-800 font-semibold text-slate-900 dark:text-white ring-1 ring-slate-900 dark:ring-white'
                          : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                      }`}
                    >
                      <span>{v.name}</span>
                      <span className="font-mono tabular-nums font-semibold">
                        Rs. {v.price.toLocaleString()}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Stepper */}
            <div className="flex items-center gap-4">
              <span className="text-xs font-medium text-slate-700 dark:text-slate-300">Quantity:</span>
              <div className="flex items-center border border-slate-300 dark:border-slate-700 rounded-lg overflow-hidden bg-slate-50 dark:bg-slate-950">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-1.5 text-sm font-semibold hover:bg-slate-200 dark:hover:bg-slate-800"
                >
                  -
                </button>
                <span className="px-4 py-1.5 text-xs font-mono font-bold tabular-nums">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-1.5 text-sm font-semibold hover:bg-slate-200 dark:hover:bg-slate-800"
                >
                  +
                </button>
              </div>
            </div>

            {/* CTA Buttons: Direct "Confirm Order / Buy Now" and "Add to Bag" */}
            <div className="space-y-2.5 pt-2">
              <button
                onClick={handleBuyNow}
                className="w-full py-3.5 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-bold rounded-xl hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors flex items-center justify-center gap-2 shadow-md cursor-pointer"
              >
                <span>Confirm Order &amp; Proceed to Checkout (COD)</span>
                <ChevronRight className="w-4 h-4" />
              </button>

              <button
                onClick={handleAddBag}
                className="w-full py-3 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Shopping Bag</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
