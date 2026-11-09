import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldAlert,
  Lock,
  Mail,
  KeyRound,
  ArrowLeft,
  AlertCircle,
  Server,
} from 'lucide-react';

export const AdminLoginModal: React.FC = () => {
  const { adminLogin, openStorefront } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    setTimeout(() => {
      const result = adminLogin(email, password);
      setIsLoading(false);

      if (!result.success) {
        setErrorMessage(result.error || 'Access Denied: Invalid administrator credentials.');
      }
    }, 400);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white p-4 sm:p-6 font-sans">
      <div className="max-w-md w-full space-y-5">
        {/* Back Link */}
        <button
          onClick={openStorefront}
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors cursor-pointer py-1"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Customer Storefront</span>
        </button>

        {/* Login Card */}
        <div className="p-6 sm:p-8 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl space-y-6">
          <div className="space-y-2 text-center">
            <div className="w-12 h-12 rounded-xl bg-rose-950/80 text-rose-500 border border-rose-800/80 flex items-center justify-center mx-auto shadow-inner">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-white">
              FraudShield AI · Admin Portal
            </h1>
            <p className="text-xs text-slate-400">
              Restricted Gateway for Merchant Orders &amp; FastAPI Fraud Intelligence
            </p>
          </div>

          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-rose-950/60 border border-rose-800/80 text-xs text-rose-300 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Secure Form - No suggestions or autofill buttons */}
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-medium mb-1.5">
                Admin Gmail / Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  autoComplete="username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter administrator email"
                  className="w-full pl-9 pr-3 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-xs sm:text-sm font-sans"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1.5">
                Admin Password
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter administrator password"
                  className="w-full pl-9 pr-3 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-xs sm:text-sm font-sans"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-white text-slate-900 rounded-xl font-bold text-xs sm:text-sm hover:bg-slate-200 transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shadow-md mt-2"
            >
              <Lock className="w-4 h-4 text-indigo-600" />
              <span>{isLoading ? 'Verifying Gateway Credentials...' : 'Sign In to Admin Portal'}</span>
            </button>
          </form>

          {/* Architecture Badge */}
          <div className="pt-3 text-center border-t border-slate-800">
            <span className="text-[11px] text-slate-500 flex items-center justify-center gap-1.5">
              <Server className="w-3.5 h-3.5 text-emerald-500" />
              <span>Next.js Frontend Architecture · FastAPI ML Backend</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
