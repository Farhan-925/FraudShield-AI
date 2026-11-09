import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { NavigationHeader } from './components/common/NavigationHeader';
import { StorefrontView } from './components/storefront/StorefrontView';
import { CustomerProductPage } from './components/storefront/CustomerProductPage';
import { CustomerCheckoutPage } from './components/storefront/CustomerCheckoutPage';
import { EmailNotificationModal } from './components/storefront/EmailNotificationModal';
import { CustomerAuthModal } from './components/storefront/CustomerAuthModal';
import { AdminLoginModal } from './components/admin/AdminLoginModal';
import { MerchantDashboard } from './components/dashboard/MerchantDashboard';
import { FraudHub } from './components/fraud/FraudHub';
import { FraudSimulator } from './components/simulator/FraudSimulator';
import { SuperAdminDashboard } from './components/superadmin/SuperAdminDashboard';
import { Lock, Shield, Truck, Phone, Mail, MapPin } from 'lucide-react';

const MainContent: React.FC = () => {
  const {
    viewMode,
    setViewMode,
    isAdminLoggedIn,
    openAdmin,
    openStorefront,
  } = useApp();
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6] dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors font-sans">
      {/* Universal Top Navigation Header */}
      <NavigationHeader onOpenCart={() => setIsCartOpen(true)} />

      {/* Main View Mode Content */}
      <main className="flex-1">
        {/* Customer View Modes */}
        {viewMode === 'storefront' && (
          <StorefrontView
            isCartOpen={isCartOpen}
            setIsCartOpen={setIsCartOpen}
          />
        )}

        {viewMode === 'product_detail' && (
          <CustomerProductPage />
        )}

        {viewMode === 'checkout' && (
          <CustomerCheckoutPage />
        )}

        {/* Admin Login Gateway */}
        {viewMode === 'admin_login' && (
          <AdminLoginModal />
        )}

        {/* Protected Admin Dashboards (Restricted to farhanayub915@gmail.com / farhan123) */}
        {viewMode === 'merchant_dashboard' && (
          isAdminLoggedIn ? <MerchantDashboard /> : <AdminLoginModal />
        )}

        {viewMode === 'fraud_hub' && (
          isAdminLoggedIn ? <FraudHub /> : <AdminLoginModal />
        )}

        {viewMode === 'simulator' && (
          isAdminLoggedIn ? <FraudSimulator /> : <AdminLoginModal />
        )}

        {viewMode === 'super_admin' && (
          isAdminLoggedIn ? <SuperAdminDashboard /> : <AdminLoginModal />
        )}
      </main>

      {/* Simulated Gmail Order Confirmation Modal */}
      <EmailNotificationModal />

      {/* Customer Account & Gmail Login Modal */}
      <CustomerAuthModal />

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 py-12 px-4 sm:px-6 transition-colors text-xs text-slate-500">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-slate-100 dark:border-slate-800">
            {/* Col 1: Brand Info */}
            <div className="space-y-3">
              <div className="text-base font-serif font-bold text-slate-900 dark:text-white">
                DecorHaus Pakistan
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Pakistan's premier design atelier offering architectural living, handcrafted solid wood furnishings, and bespoke lighting with nationwide Cash on Delivery (COD).
              </p>
              <div className="text-[11px] text-slate-400 font-mono">
                Karachi · Lahore · Islamabad · Rawalpindi
              </div>
            </div>

            {/* Col 2: Customer Care */}
            <div className="space-y-2">
              <div className="font-semibold text-slate-900 dark:text-white text-xs uppercase tracking-wider">
                Customer Services
              </div>
              <ul className="space-y-1.5 text-xs text-slate-500">
                <li><button onClick={openStorefront} className="hover:text-slate-900 dark:hover:text-white transition-colors">Catalog Collection</button></li>
                <li><span className="text-slate-600 dark:text-slate-400">Cash on Delivery (COD) Guidelines</span></li>
                <li><span className="text-slate-600 dark:text-slate-400">TCS Express Tracking Support</span></li>
                <li><span className="text-slate-600 dark:text-slate-400">7-Day Return Policy</span></li>
              </ul>
            </div>

            {/* Col 3: Architecture & Technology */}
            <div className="space-y-2">
              <div className="font-semibold text-slate-900 dark:text-white text-xs uppercase tracking-wider">
                Architecture &amp; Intelligence
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Powered by a <strong>Next.js</strong> storefront with a <strong>FastAPI Python microservice</strong> running XGBoost, Random Forest, Isolation Forest, and TreeSHAP explainability for merchant fraud prevention.
              </p>
            </div>

            {/* Col 4: Concierge Contact */}
            <div className="space-y-2">
              <div className="font-semibold text-slate-900 dark:text-white text-xs uppercase tracking-wider">
                Concierge Contact
              </div>
              <div className="space-y-1.5 text-xs text-slate-500">
                <div className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>042-111-332-678 (Lahore Flagship)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>orders@decorhaus.pk</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>Sector Y, Phase 6, DHA, Lahore</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Row */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
            <div>
              &copy; {new Date().getFullYear()} DecorHaus Pakistan. All rights reserved.
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={openStorefront}
                className="hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
              >
                Customer Storefront
              </button>
              <span>·</span>
              {/* Restricted Admin Route Link */}
              <button
                onClick={openAdmin}
                className="hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition-colors flex items-center gap-1"
                title="Restricted to administrator farhanayub915@gmail.com"
              >
                <Lock className="w-3 h-3 text-indigo-500" />
                <span>Admin Portal (/admin)</span>
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
