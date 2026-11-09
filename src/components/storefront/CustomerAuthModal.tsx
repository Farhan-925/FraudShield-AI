import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Mail, User, Phone, CheckCircle2, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';

export const CustomerAuthModal: React.FC = () => {
  const {
    customerSession,
    isCustomerAuthModalOpen,
    closeCustomerAuthModal,
    loginCustomerWithGmail,
    logoutCustomer,
  } = useApp();

  const [inputEmail, setInputEmail] = useState('');
  const [inputName, setInputName] = useState('');
  const [inputPhone, setInputPhone] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!isCustomerAuthModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const email = inputEmail.trim();
    if (!email) {
      setError('Please enter your Gmail address');
      return;
    }
    if (!email.includes('@') || !email.includes('.')) {
      setError('Please enter a valid email address (e.g. name@gmail.com)');
      return;
    }

    loginCustomerWithGmail(
      email,
      inputName.trim() || undefined,
      inputPhone.trim() || undefined
    );
    setError(null);
    setInputEmail('');
    setInputName('');
    setInputPhone('');
  };

  const handleQuickLogin = (email: string, name: string, phone: string) => {
    loginCustomerWithGmail(email, name, phone);
    setError(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col font-sans">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-950/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xs flex items-center justify-center">
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Customer Account Login
              </h3>
              <p className="text-[11px] text-slate-500">
                Sign in with your own Gmail account
              </p>
            </div>
          </div>

          <button
            onClick={closeCustomerAuthModal}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4">
          {customerSession?.isLoggedIn ? (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <div className="text-xs space-y-1">
                  <div className="font-bold text-emerald-950 dark:text-emerald-200">
                    Currently Signed In
                  </div>
                  <div className="font-medium text-emerald-800 dark:text-emerald-300">
                    {customerSession.name}
                  </div>
                  <div className="font-mono text-[11px] text-emerald-700 dark:text-emerald-400 break-all">
                    {customerSession.email}
                  </div>
                  {customerSession.phone && (
                    <div className="font-mono text-[11px] text-emerald-700 dark:text-emerald-400">
                      Phone: {customerSession.phone}
                    </div>
                  )}
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 pt-1">
                    Your order confirmations and courier updates are delivered directly to this Gmail.
                  </div>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => {
                    logoutCustomer();
                  }}
                  className="w-full py-2.5 px-4 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-xl transition-colors cursor-pointer"
                >
                  Sign Out This Account
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3.5">
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Enter your Gmail address below to place orders, auto-fill checkout, and receive instant order receipts.
              </p>

              {error && (
                <div className="p-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs">
                  {error}
                </div>
              )}

              {/* Email Input */}
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Your Gmail / Email *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    required
                    value={inputEmail}
                    onChange={(e) => setInputEmail(e.target.value)}
                    placeholder="e.g. yourname@gmail.com"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    autoFocus
                  />
                </div>
              </div>

              {/* Name Input */}
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Full Name (Optional)
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={inputName}
                    onChange={(e) => setInputName(e.target.value)}
                    placeholder="e.g. Ayesha Khan"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Phone Input */}
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Pakistani Mobile Number (Optional)
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="tel"
                    value={inputPhone}
                    onChange={(e) => setInputPhone(e.target.value)}
                    placeholder="e.g. 0300-1234567"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-mono text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Sign In Button */}
              <button
                type="submit"
                className="w-full mt-2 py-2.5 px-4 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 dark:text-slate-900 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>Continue with Gmail</span>
              </button>

              {/* Quick Customer Selection Presets */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-2">
                  Or One-Click Test Accounts:
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                  <button
                    type="button"
                    onClick={() => handleQuickLogin('ayesha.khan@gmail.com', 'Ayesha Khan', '0301-4455667')}
                    className="p-2 rounded-lg bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 hover:border-slate-400 text-left transition-colors cursor-pointer"
                  >
                    <div className="font-semibold text-slate-900 dark:text-white">Ayesha Khan</div>
                    <div className="text-[10px] text-slate-500 font-mono truncate">ayesha.khan@gmail.com</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickLogin('bilal.ahmed@gmail.com', 'Bilal Ahmed', '0321-8899112')}
                    className="p-2 rounded-lg bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 hover:border-slate-400 text-left transition-colors cursor-pointer"
                  >
                    <div className="font-semibold text-slate-900 dark:text-white">Bilal Ahmed</div>
                    <div className="text-[10px] text-slate-500 font-mono truncate">bilal.ahmed@gmail.com</div>
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* Guest checkout note */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
            <span>Guest checkout is also available without an account.</span>
            <button
              onClick={closeCustomerAuthModal}
              className="text-slate-700 dark:text-slate-300 hover:underline font-semibold cursor-pointer"
            >
              Continue as Guest
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
