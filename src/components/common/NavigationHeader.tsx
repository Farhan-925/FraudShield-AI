import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldAlert,
  Store,
  LayoutDashboard,
  Cpu,
  Sliders,
  ShoppingBag,
  Bell,
  LogOut,
  User,
  CheckCircle2,
  ExternalLink,
  Lock,
  Menu,
  X,
  Truck,
  Sparkles,
} from 'lucide-react';

export const NavigationHeader: React.FC<{
  onOpenCart?: () => void;
}> = ({ onOpenCart }) => {
  const {
    currentTenant,
    viewMode,
    setViewMode,
    cartCount,
    isAdminLoggedIn,
    adminLogout,
    customerSession,
    openCustomerAuthModal,
    logoutCustomer,
    openStorefront,
    unreadAlertCount,
  } = useApp();

  const [isCustomerMenuOpen, setIsCustomerMenuOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  // If Admin is logged in AND currently navigating the admin dashboards:
  const isNavigatingAdmin =
    isAdminLoggedIn &&
    ['merchant_dashboard', 'fraud_hub', 'simulator', 'super_admin'].includes(viewMode);

  if (isNavigatingAdmin) {
    return (
      <header className="sticky top-0 z-40 bg-slate-950 text-white border-b border-slate-800 shadow-lg font-sans">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3">
          {/* Admin Identity */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-2 font-bold text-xs sm:text-sm tracking-tight text-white">
              <span className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-rose-950 border border-rose-800 flex items-center justify-center text-rose-500">
                <ShieldAlert className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </span>
              <span>FraudShield AI · Admin</span>
            </div>

            <span className="text-slate-700 hidden sm:inline">|</span>

            <div className="hidden lg:flex items-center gap-2 text-xs text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Admin: <strong>Farhan Ayub</strong> (farhanayub915@gmail.com)</span>
            </div>
          </div>

          {/* Admin Navigation Tabs (Mobile-friendly horizontal scroll) */}
          <nav className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs overflow-x-auto max-w-full no-scrollbar">
            <button
              onClick={() => setViewMode('merchant_dashboard')}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                viewMode === 'merchant_dashboard'
                  ? 'bg-slate-800 text-white font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Orders &amp; Store</span>
            </button>

            <button
              onClick={() => setViewMode('fraud_hub')}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                viewMode === 'fraud_hub'
                  ? 'bg-rose-950 text-rose-300 font-bold border border-rose-800'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
              <span>Fraud Intelligence</span>
              {unreadAlertCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-rose-600 text-white text-[10px] font-mono font-bold">
                  {unreadAlertCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setViewMode('simulator')}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                viewMode === 'simulator'
                  ? 'bg-indigo-950 text-indigo-300 font-bold border border-indigo-800'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sliders className="w-3.5 h-3.5 text-indigo-400" />
              <span>FastAPI Simulator</span>
            </button>

            <button
              onClick={() => setViewMode('super_admin')}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                viewMode === 'super_admin'
                  ? 'bg-slate-800 text-white font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Cpu className="w-3.5 h-3.5 text-emerald-400" />
              <span>Platform</span>
            </button>
          </nav>

          {/* Admin Exit & Storefront Actions */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={openStorefront}
              className="px-2.5 sm:px-3 py-1.5 bg-slate-900 border border-slate-700 hover:border-slate-500 text-slate-200 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Store className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Storefront</span>
            </button>

            <button
              onClick={adminLogout}
              className="px-2.5 sm:px-3 py-1.5 bg-rose-950/60 hover:bg-rose-900 border border-rose-800 text-rose-200 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </header>
    );
  }

  // Regular Customer Storefront Navigation (DecorHaus Pakistan)
  return (
    <div className="sticky top-0 z-40 font-sans">
      {/* Dark Announcement Bar at the very top */}
      <div className="bg-slate-950 text-slate-200 text-xs py-2 px-4 text-center tracking-wide font-medium flex flex-wrap items-center justify-center gap-2 border-b border-slate-800">
        <span className="text-emerald-400 font-bold">Cash On Delivery</span>
        <span className="text-slate-500">·</span>
        <span className="text-amber-300 font-medium">Free Express Shipping over Rs. 30,000</span>
      </div>

      {/* Main Navbar below the announcement bar */}
      <header className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3 flex items-center justify-between gap-3 sm:gap-6">
        {/* Mobile Hamburger + Brand Wordmark */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
            className="p-1.5 rounded-lg md:hidden text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {isMobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <button
            onClick={() => {
              openStorefront();
              setIsMobileNavOpen(false);
            }}
            className="text-left group cursor-pointer focus:outline-none"
          >
            <div className="text-xl sm:text-2xl font-serif font-bold tracking-tight text-slate-900 dark:text-white group-hover:text-amber-800 dark:group-hover:text-amber-300 transition-colors">
              DecorHaus
            </div>
          </button>
        </div>

        {/* Customer Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-slate-600 dark:text-slate-300">
          <button
            onClick={openStorefront}
            className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
          >
            Catalog Collection
          </button>
          <button
            onClick={openStorefront}
            className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
          >
            Living &amp; Lounge
          </button>
          <button
            onClick={openStorefront}
            className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
          >
            Lighting &amp; Brass
          </button>
          <span className="text-emerald-700 dark:text-emerald-400 font-semibold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
            Nationwide Cash on Delivery (COD)
          </span>
        </nav>

        {/* Customer Actions: User Account Icon & Shopping Bag Icon */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* User Account Button with Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                if (!customerSession?.isLoggedIn) {
                  openCustomerAuthModal();
                } else {
                  setIsCustomerMenuOpen(!isCustomerMenuOpen);
                }
              }}
              className="relative flex items-center justify-center p-2 sm:p-2.5 rounded-xl text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
              title={customerSession?.isLoggedIn ? `${customerSession.name} (${customerSession.email})` : 'Sign in with your Gmail'}
              aria-label="Customer Account"
            >
              <User className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
              {customerSession?.isLoggedIn && (
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" />
              )}
            </button>

            {isCustomerMenuOpen && customerSession?.isLoggedIn && (
              <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 p-3.5 text-xs space-y-2.5 z-50 font-sans">
                <div className="pb-2 border-b border-slate-100 dark:border-slate-800">
                  <div className="text-[10px] uppercase font-bold tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mb-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Customer Gmail Account
                  </div>
                  <div className="font-bold text-slate-900 dark:text-white">
                    {customerSession.name}
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono break-all">
                    {customerSession.email}
                  </div>
                </div>

                <div className="text-[11px] text-slate-500">
                  Order receipts, tracking numbers, and delivery notices are sent directly to this Gmail.
                </div>

                <div className="pt-1 space-y-1.5 border-t border-slate-100 dark:border-slate-800">
                  <button
                    onClick={() => {
                      setIsCustomerMenuOpen(false);
                      openCustomerAuthModal();
                    }}
                    className="w-full py-1.5 px-2 text-center text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                  >
                    Switch / Login with another Gmail
                  </button>

                  <button
                    onClick={() => {
                      logoutCustomer();
                      setIsCustomerMenuOpen(false);
                    }}
                    className="w-full py-1.5 px-2 text-center text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer"
                  >
                    Sign Out Account
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Shopping Bag Button (Icon + Count Badge, without Bag text) */}
          <button
            onClick={onOpenCart}
            aria-label="Shopping Bag"
            className="flex items-center gap-1.5 p-2 sm:px-3 sm:py-2 text-xs font-bold text-white bg-slate-900 dark:bg-slate-100 dark:text-slate-900 rounded-xl hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors shadow-sm cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="font-mono tabular-nums font-bold">({cartCount})</span>
          </button>
        </div>
      </div>

      {/* Mobile Collapsible Navigation Menu */}
      {isMobileNavOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 space-y-3 text-xs font-medium">
          <button
            onClick={() => {
              openStorefront();
              setIsMobileNavOpen(false);
            }}
            className="block w-full text-left py-2 px-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 cursor-pointer"
          >
            Catalog Collection
          </button>
          <button
            onClick={() => {
              openStorefront();
              setIsMobileNavOpen(false);
            }}
            className="block w-full text-left py-2 px-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 cursor-pointer"
          >
            Living &amp; Lounge
          </button>
          <button
            onClick={() => {
              openStorefront();
              setIsMobileNavOpen(false);
            }}
            className="block w-full text-left py-2 px-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 cursor-pointer"
          >
            Lighting &amp; Brass
          </button>

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 px-3 py-1 flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-semibold">
            <Truck className="w-4 h-4 shrink-0" />
            <span>Nationwide Cash on Delivery (COD) Active</span>
          </div>
        </div>
      )}
    </header>
  </div>
);
};
