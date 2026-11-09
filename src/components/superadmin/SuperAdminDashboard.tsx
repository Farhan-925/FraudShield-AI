import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { initialSubscriptionPlans } from '../../data/mockData';
import {
  Cpu,
  Building,
  ShieldCheck,
  TrendingUp,
  Activity,
  History,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Layers,
  Sparkles,
} from 'lucide-react';

export const SuperAdminDashboard: React.FC = () => {
  const {
    tenants,
    toggleTenantStatus,
    updateTenantPlan,
    auditLogs,
    orders,
  } = useApp();

  const [activeModelVersion, setActiveModelVersion] = useState('v2.4.1-xgboost-hybrid-isoforest');

  const totalVolume = 186450;
  const totalPreventedFraud = 74800;
  const activeTenantsCount = tenants.filter(t => t.status === 'active').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8 font-sans">
      {/* Platform Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
              <Cpu className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Platform Super Administrator Console
            </h1>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Global multi-tenant governance, subscription enforcement, and AI model version orchestration
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-1 rounded-md border border-emerald-200 dark:border-emerald-800 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            PostgreSQL Multi-Tenant Isolation Active
          </span>
        </div>
      </div>

      {/* Platform Level Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <div className="text-xs text-slate-700 dark:text-slate-400 font-medium">Active SaaS Tenants</div>
          <div className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white mt-1">
            {activeTenantsCount} / {tenants.length}
          </div>
          <div className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">DecorHaus, Modern Living, HomeStyle</div>
        </div>

        <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <div className="text-xs text-slate-700 dark:text-slate-400 font-medium">Cross-Tenant GMV Screened</div>
          <div className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white mt-1">
            ${(totalVolume / 1000).toFixed(1)}k
          </div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-0.5">Across all stores</div>
        </div>

        <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <div className="text-xs text-slate-700 dark:text-slate-400 font-medium">Platform Fraud Intercepted</div>
          <div className="text-2xl font-bold font-mono tabular-nums text-rose-600 dark:text-rose-400 mt-1">
            ${(totalPreventedFraud / 1000).toFixed(1)}k
          </div>
          <div className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">Zero chargebacks passed</div>
        </div>

        <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <div className="text-xs text-slate-700 dark:text-slate-400 font-medium">Active Global ML Core</div>
          <div className="text-lg font-bold font-mono text-indigo-600 dark:text-indigo-400 mt-1 truncate">
            v2.4.1 Hybrid
          </div>
          <div className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">ROC-AUC: 0.992</div>
        </div>
      </div>

      {/* Tenants Table */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-xs space-y-4 p-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <Building className="w-4 h-4 text-slate-500" />
              Registered SaaS Merchants &amp; Storefronts ({tenants.length})
            </h3>
            <p className="text-xs text-slate-500">
              Each tenant maintains strictly isolated databases, orders, catalogs, and fraud prediction histories.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-950/70 border-b border-slate-200 dark:border-slate-800 text-slate-500 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="px-4 py-3 font-medium">Store &amp; Domain</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Subscription Tier</th>
                <th className="px-4 py-3 font-medium text-right">Monthly Orders</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium text-right">Platform Control</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {tenants.map((t) => {
                const plan = initialSubscriptionPlans.find(p => p.id === t.planId);

                return (
                  <tr key={t.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                    <td className="px-4 py-3.5">
                      <div className="font-semibold text-slate-900 dark:text-white">{t.name}</div>
                      <div className="text-[11px] font-mono text-slate-500">{t.slug}.fraudshield.io</div>
                    </td>

                    <td className="px-4 py-3.5 text-slate-700 dark:text-slate-300">
                      {t.category}
                    </td>

                    <td className="px-4 py-3.5">
                      <select
                        aria-label={`Change Plan for ${t.name}`}
                        value={t.planId}
                        onChange={(e) => updateTenantPlan(t.id, e.target.value as any)}
                        className="bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded px-2.5 py-1 text-xs"
                      >
                        <option value="starter">Starter ($49/mo)</option>
                        <option value="professional">Professional ($149/mo)</option>
                        <option value="enterprise">Enterprise ($399/mo)</option>
                      </select>
                    </td>

                    <td className="px-4 py-3.5 text-right font-mono tabular-nums font-semibold text-slate-900 dark:text-white">
                      {t.monthlyOrderCount} / {t.monthlyOrderLimit}
                    </td>

                    <td className="px-4 py-3.5">
                      {t.status === 'active' ? (
                        <span className="text-emerald-700 dark:text-emerald-400 font-semibold text-xs flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Active
                        </span>
                      ) : (
                        <span className="text-rose-700 dark:text-rose-400 font-semibold text-xs flex items-center gap-1">
                          <AlertTriangle className="w-3.5 h-3.5" /> Suspended
                        </span>
                      )}
                    </td>

                    <td className="px-4 py-3.5 text-right">
                      <button
                        onClick={() => toggleTenantStatus(t.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                          t.status === 'active'
                            ? 'bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 hover:bg-rose-100'
                            : 'bg-emerald-600 text-white hover:bg-emerald-700'
                        }`}
                      >
                        {t.status === 'active' ? 'Suspend Merchant' : 'Activate Merchant'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Global Machine Learning Model Registry */}
      <div className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-500" />
              Machine Learning Model Registry &amp; Evaluation Benchmarks
            </h3>
            <p className="text-xs text-slate-500">
              Compare trained supervised models, ensemble tree depth, and unsupervised anomaly detection scores
            </p>
          </div>
          <span className="text-xs font-mono text-slate-600 dark:text-slate-400">
            Leakage-Resistant Temporal Split
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Active Model */}
          <div className="p-4 rounded-xl border-2 border-indigo-500 dark:border-indigo-400 bg-indigo-50/30 dark:bg-indigo-950/20 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-indigo-900 dark:text-indigo-200">
                v2.4.1-xgboost-hybrid-isoforest
              </span>
              <span className="text-[10px] font-bold uppercase bg-indigo-600 text-white px-2 py-0.5 rounded">
                Active Production
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Hybrid ensemble blending XGBoost gradient boosting (42%), Random Forest (25%), and Isolation Forest (28%) with TreeSHAP.
            </p>
            <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono pt-2 border-t border-indigo-200 dark:border-indigo-800">
              <div>
                <span className="text-[10px] text-slate-500 block">ROC-AUC</span>
                <span className="font-bold text-slate-900 dark:text-white">0.992</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">PR-AUC</span>
                <span className="font-bold text-slate-900 dark:text-white">0.961</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">F1-Score</span>
                <span className="font-bold text-slate-900 dark:text-white">0.948</span>
              </div>
            </div>
          </div>

          {/* Baseline 1 */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3 opacity-80">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300">
                v2.3.0-rf-ensemble
              </span>
              <span className="text-[10px] text-slate-500">Benchmark Baseline</span>
            </div>
            <p className="text-xs text-slate-500">
              100-tree Random Forest classifier without unsupervised anomaly detection isolation trees.
            </p>
            <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono pt-2 border-t border-slate-200 dark:border-slate-800">
              <div>
                <span className="text-[10px] text-slate-500 block">ROC-AUC</span>
                <span className="font-bold text-slate-700 dark:text-slate-300">0.954</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">PR-AUC</span>
                <span className="font-bold text-slate-700 dark:text-slate-300">0.902</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">F1-Score</span>
                <span className="font-bold text-slate-700 dark:text-slate-300">0.890</span>
              </div>
            </div>
          </div>

          {/* Baseline 2 */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3 opacity-80">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300">
                v1.9.0-heuristic-rules
              </span>
              <span className="text-[10px] text-slate-500">Legacy Rules</span>
            </div>
            <p className="text-xs text-slate-500">
              Static threshold rules (order amount &gt; $1000, 2 failed CVV retries). High false positive rate.
            </p>
            <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono pt-2 border-t border-slate-200 dark:border-slate-800">
              <div>
                <span className="text-[10px] text-slate-500 block">ROC-AUC</span>
                <span className="font-bold text-slate-700 dark:text-slate-300">0.862</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">PR-AUC</span>
                <span className="font-bold text-slate-700 dark:text-slate-300">0.780</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">F1-Score</span>
                <span className="font-bold text-slate-700 dark:text-slate-300">0.765</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
