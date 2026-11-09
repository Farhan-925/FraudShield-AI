import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Product } from '../../types';
import {
  ShoppingBag,
  Star,
  ChevronRight,
  Shield,
  Truck,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Eye,
  X,
  CreditCard,
  Lock,
  CheckCircle2,
  PhoneCall,
  MapPin,
} from 'lucide-react';

const CATEGORIES = [
  'All Collections',
  'Furniture',
  'Lighting',
  'Mirrors',
  'Vases & Accessories',
  'Rugs & Carpets',
];

export const StorefrontView: React.FC<{
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
}> = ({ isCartOpen, setIsCartOpen }) => {
  const {
    currentTenant,
    currentTenantProducts,
    cart,
    addToCart,
    updateCartQuantity,
    cartCount,
    cartTotal,
    openProductPage,
    openCheckoutPage,
  } = useApp();

  const [activeCategory, setActiveCategory] = useState('All Collections');

  // Filter products by category
  const filteredProducts = currentTenantProducts.filter((product) => {
    if (activeCategory === 'All Collections') return true;
    return product.category.toLowerCase() === activeCategory.toLowerCase();
  });

  return (
    <div className="font-sans text-slate-900 dark:text-slate-100 bg-[#FAF9F6] dark:bg-slate-950 min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 lg:py-20 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Text */}
          <div className="lg:col-span-5 space-y-6">
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-widest text-emerald-700 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-md border border-emerald-200 dark:border-emerald-800">
                DecorHaus Pakistan
              </span>
              <span className="text-xs text-slate-500 font-medium">2026 Architectural Living</span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-serif font-medium tracking-tight text-slate-900 dark:text-white leading-[1.15] text-balance">
              Sculptural forms crafted for modern Pakistani homes.
            </h1>

            <p className="text-base text-slate-600 dark:text-slate-400 leading-relaxed max-w-lg">
              Bespoke artisanal furniture, Multani glazed stoneware, and architectural lighting engineered with solid teak, sheesham hardwoods, and unlacquered brass.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a
                href="#catalog"
                className="px-6 py-3.5 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-bold rounded-xl hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors inline-flex items-center gap-2 shadow-sm"
              >
                <span>Explore Catalog &amp; Order</span>
                <ChevronRight className="w-4 h-4" />
              </a>

              <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xs">
                <Truck className="w-4 h-4 text-emerald-600" />
                <span>TCS &amp; Leopards Express COD</span>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-6 text-xs text-slate-500">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Doorstep Inspection</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-rose-500" />
                <span>FastAPI ML Screening</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-indigo-500" />
                <span>Lahore &amp; Karachi Flagships</span>
              </div>
            </div>
          </div>

          {/* Right Image Showcase */}
          <div className="lg:col-span-7">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-200/80 dark:border-slate-800 aspect-[16/10] group">
              <img
                src="/images/hero_scandinavian_living_1794114232964.jpg"
                alt="Architectural Living Room Interior Pakistan"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80';
                }}
                className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-700"
              />
              <div className="absolute bottom-4 left-4 right-4 sm:right-auto bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-4 rounded-xl border border-slate-200/60 dark:border-slate-800 text-xs shadow-md flex items-center justify-between gap-4">
                <div>
                  <div className="text-[11px] text-slate-500">Flagship Living Suite</div>
                  <div className="font-bold text-slate-900 dark:text-white text-sm">
                    The Solis Curved Sofa (Bouclé Cream)
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-mono tabular-nums font-bold text-slate-900 dark:text-white">
                    Rs. 185,000
                  </div>
                  <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold">
                    In Stock · Ready to Dispatch
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Collection Grid */}
      <section id="catalog" className="max-w-7xl mx-auto px-4 sm:px-6 py-14 space-y-8">
        {/* Section Header & Category Tabs */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="text-xs uppercase tracking-widest text-slate-500 font-semibold">
              DecorHaus Pakistan Catalog
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-medium text-slate-900 dark:text-white mt-1">
              Architectural Furniture &amp; Interior Objects
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Click any piece to view details, select variants, and confirm your order via Cash on Delivery (COD).
            </p>
          </div>

          {/* Interactive filter tabs */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-x-auto max-w-full">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => {
            const displayPrice = product.price;

            return (
              <div
                key={product.id}
                className="group flex flex-col bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200/80 dark:border-slate-800 transition-all hover:shadow-xl hover:border-slate-300 dark:hover:border-slate-700"
              >
                {/* 4:3 Image Container with hover zoom */}
                <div
                  onClick={() => openProductPage(product)}
                  className="relative aspect-[4/3] bg-neutral-100 dark:bg-neutral-900 overflow-hidden cursor-pointer"
                >
                  <img
                    src={product.images[0]}
                    alt={product.title}
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80';
                    }}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-104"
                  />
                  {product.isNewArrival && (
                    <span className="absolute top-3 left-3 bg-white/95 dark:bg-slate-900/95 text-[10px] font-bold text-slate-900 dark:text-white px-2.5 py-0.5 rounded shadow-xs">
                      NEW ARRIVAL
                    </span>
                  )}
                  <span className="absolute bottom-3 left-3 bg-slate-950/80 text-white text-[10px] font-medium px-2 py-0.5 rounded backdrop-blur-xs flex items-center gap-1">
                    <Truck className="w-3 h-3 text-emerald-400" />
                    COD Available
                  </span>

                  <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="px-4 py-2 bg-white text-slate-900 text-xs font-bold rounded-xl shadow-md flex items-center gap-1.5">
                      <Eye className="w-4 h-4" />
                      View Product &amp; Order
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium">
                      <span className="uppercase tracking-wider">{product.category}</span>
                      <span className="font-mono">SKU: {product.sku}</span>
                    </div>

                    <h3
                      onClick={() => openProductPage(product)}
                      className="text-base font-semibold text-slate-900 dark:text-white mt-1.5 cursor-pointer hover:text-amber-800 dark:hover:text-amber-300 transition-colors line-clamp-1"
                    >
                      {product.title}
                    </h3>

                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                      {product.description}
                    </p>

                    <div className="flex items-center gap-1 mt-2 text-xs text-amber-500">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-current" />
                      ))}
                      <span className="text-slate-600 dark:text-slate-400 text-[11px] ml-1">
                        ({product.reviewsCount} reviews in Pakistan)
                      </span>
                    </div>
                  </div>

                  <div className="pt-3 flex items-center justify-between border-t border-slate-100 dark:border-slate-800/80">
                    <div className="flex flex-col">
                      <span className="text-base font-bold font-mono tabular-nums text-slate-900 dark:text-white">
                        Rs. {displayPrice.toLocaleString()}
                      </span>
                      {product.compareAtPrice && (
                        <span className="text-[11px] text-slate-400 line-through font-mono">
                          Rs. {product.compareAtPrice.toLocaleString()}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openProductPage(product)}
                        className="px-3.5 py-2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-bold rounded-xl hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <span>Order Now</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Craftsmanship & Trust Story Section */}
      <section className="bg-slate-100 dark:bg-slate-900/60 border-y border-slate-200 dark:border-slate-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2.5 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/50 flex items-center justify-center text-amber-800 dark:text-amber-400 font-bold">
                <Truck className="w-5 h-5" />
              </div>
              <h4 className="text-base font-semibold text-slate-900 dark:text-white">
                Cash on Delivery (COD) Nationwide
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                TCS &amp; Leopards courier riders deliver directly to your residence across Karachi, Lahore, Islamabad, Faisalabad, and all surrounding areas. Inspect your piece before paying cash.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2.5 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/50 flex items-center justify-center text-rose-700 dark:text-rose-400 font-bold">
                <Shield className="w-5 h-5" />
              </div>
              <h4 className="text-base font-semibold text-slate-900 dark:text-white">
                FastAPI FraudShield AI Guard
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Every transaction and order is screened in real time by our FastAPI Python ML microservice (XGBoost, Random Forest, and Isolation Forest) to ensure authentic orders and customer privacy.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2.5 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-800 dark:text-emerald-400 font-bold">
                <RotateCcw className="w-5 h-5" />
              </div>
              <h4 className="text-base font-semibold text-slate-900 dark:text-white">
                7-Day In-Home Guarantee
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Experience our organic finishes in your space. Full replacement guarantee if any transit damage occurs during courier delivery in Pakistan.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Shopping Bag Slide-Over Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setIsCartOpen(false)}
          />
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md bg-white dark:bg-slate-900 shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col font-sans">
              {/* Drawer Header */}
              <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-slate-900 dark:text-white" />
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Your Shopping Bag ({cartCount} {cartCount === 1 ? 'item' : 'items'})
                  </h3>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Items List */}
              <div className="p-5 flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800 space-y-4">
                {cart.length === 0 ? (
                  <div className="py-16 text-center space-y-3">
                    <ShoppingBag className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto" />
                    <p className="text-sm text-slate-500">Your shopping bag is currently empty.</p>
                    <button
                      onClick={() => setIsCartOpen(false)}
                      className="px-4 py-2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-semibold rounded-xl"
                    >
                      Browse Featured Pieces
                    </button>
                  </div>
                ) : (
                  cart.map((item) => {
                    const price = item.variant?.price ?? item.product.price;

                    return (
                      <div key={`${item.product.id}-${item.variant?.id}`} className="pt-4 flex gap-4">
                        <img
                          src={item.product.images[0]}
                          alt={item.product.title}
                          onError={(e) => {
                            e.currentTarget.src = 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=200&q=80';
                          }}
                          className="w-16 h-16 rounded-xl object-cover bg-neutral-100 shrink-0"
                        />
                        <div className="flex-1 space-y-1">
                          <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">
                            {item.product.title}
                          </h4>
                          {item.variant && (
                            <p className="text-[11px] text-slate-500">{item.variant.name}</p>
                          )}
                          <div className="flex items-center justify-between pt-1">
                            <span className="text-xs font-mono tabular-nums font-semibold text-slate-900 dark:text-white">
                              Rs. {price.toLocaleString()}
                            </span>
                            <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-lg">
                              <button
                                onClick={() => updateCartQuantity(item.product.id, item.quantity - 1, item.variant?.id)}
                                className="px-2.5 py-0.5 text-xs hover:bg-slate-100 dark:hover:bg-slate-800"
                              >
                                -
                              </button>
                              <span className="px-2.5 text-xs font-mono font-semibold">{item.quantity}</span>
                              <button
                                onClick={() => updateCartQuantity(item.product.id, item.quantity + 1, item.variant?.id)}
                                className="px-2.5 py-0.5 text-xs hover:bg-slate-100 dark:hover:bg-slate-800"
                              >
                                +
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Drawer Footer */}
              {cart.length > 0 && (
                <div className="p-5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/70 space-y-3.5">
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between text-slate-600 dark:text-slate-400">
                      <span>Subtotal</span>
                      <span className="font-mono tabular-nums font-semibold text-slate-900 dark:text-white">
                        Rs. {cartTotal.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-slate-600 dark:text-slate-400">
                      <span>Nationwide Delivery</span>
                      <span className="font-mono tabular-nums text-emerald-600 dark:text-emerald-400 font-semibold">
                        {cartTotal > 30000 ? 'FREE' : 'Rs. 1,500'}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setIsCartOpen(false);
                      openCheckoutPage();
                    }}
                    className="w-full py-3.5 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-bold rounded-xl hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors flex items-center justify-center gap-2 shadow-md cursor-pointer"
                  >
                    <span>Proceed to Pakistani Checkout (COD)</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
