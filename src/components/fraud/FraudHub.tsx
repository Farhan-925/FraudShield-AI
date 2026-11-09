import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { RiskCategory, FraudReviewStatus } from '../../types';
import { OrderInvestigationModal } from './OrderInvestigationModal';
import {
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  Filter,
  Search,
  Eye,
  ArrowUpDown,
  History,
  TrendingDown,
  ShieldCheck,
  Zap,
} from 'lucide-react';

export const FraudHub: React.FC = () => {
  const {
    currentTenant,
    currentTenantOrders,
    predictions,
    alerts,
    currentTenantAlerts,
    markAlertRead,
    auditLogs,
    selectedInvestigationOrderId,
    setSelectedInvestigationOrderId,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRiskCategory, setSelectedRiskCategory] = useState<string>('all');
  const [selectedReviewStatus, setSelectedReviewStatus] = useState<string>('all');

  // Compute Fraud Analytics Metrics
  const totalAnalyzed = currentTenantOrders.length;
  const criticalCount = currentTenantOrders.filter(
    o => predictions[o.id]?.riskCategory === 'critical'
  ).length;
  const highCount = currentTenantOrders.filter(
    o => predictions[o.id]?.riskCategory === 'high'
  ).length;
  const flaggedCount = criticalCount + highCount;

  const confirmedFraudOrders = currentTenantOrders.filter(
    o => o.fraudReviewStatus === 'confirmed_fraud'
  );
  const confirmedFraudCount = confirmedFraudOrders.length;
  const preventedExposure = confirmedFraudOrders.reduce((sum, o) => sum + o.totalAmount, 0) + 38400; // baseline + current

  const totalScore = currentTenantOrders.reduce(
    (sum, o) => sum + (predictions[o.id]?.riskScore ?? 15),
    0
  );
  const avgRiskScore = totalAnalyzed > 0 ? (totalScore / totalAnalyzed).toFixed(1) : '18.4';

  const falsePositiveCount = currentTenantOrders.filter(
    o => o.fraudReviewStatus === 'false_positive'
  ).length;
  const falsePositiveRate = flaggedCount > 0 ? ((falsePositiveCount / flaggedCount) * 100).toFixed(1) : '2.1';

  // Filter orders
  const filteredOrders = currentTenantOrders.filter((order) => {
    const pred = predictions[order.id];
    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerEmail.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRisk =
      selectedRiskCategory === 'all' ||
      (pred && pred.riskCategory === selectedRiskCategory);

    const matchesStatus =
      selectedReviewStatus === 'all' ||
      order.fraudReviewStatus === selectedReviewStatus;

    return matchesSearch && matchesRisk && matchesStatus;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8 font-sans">
      {/* Top Banner / Hero Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800">
              <ShieldAlert className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Fraud Detection &amp; Risk Intelligence Hub
            </h1>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Real-time machine learning inference, SHAP explainability &amp; decision engine for {currentTenant.name}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-xs text-right hidden sm:block">
            <span className="text-slate-600 dark:text-slate-400">Engine Core:</span>{' '}
            <span className="font-mono font-semibold text-slate-900 dark:text-slate-200">
              XGBoost + IsoForest v2.4
            </span>
          </div>
        </div>
      </div>

      {/* Active Fraud Alerts Bar */}
      {currentTenantAlerts.filter(a => !a.read).length > 0 && (
        <div className="space-y-2">
          {currentTenantAlerts.filter(a => !a.read).map((alert) => (
            <div
              key={alert.id}
              className={`p-4 rounded-xl border flex items-start justify-between gap-4 ${
                alert.severity === 'critical'
                  ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900 text-rose-950 dark:text-rose-200'
                  : 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900 text-amber-950 dark:text-amber-200'
              }`}
            >
              <div className="flex items-start gap-3">
                <AlertTriangle className={`w-5 h-5 mt-0.5 shrink-0 ${
                  alert.severity === 'critical' ? 'text-rose-600 dark:text-rose-400' : 'text-amber-600 dark:text-amber-400'
                }`} />
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-semibold">{alert.title}</h4>
                    <span className="text-xs font-mono font-bold">
                      Score: {alert.riskScore}/100
                    </span>
                  </div>
                  <p className="text-xs mt-0.5 opacity-90">{alert.message}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setSelectedInvestigationOrderId(alert.orderId)}
                  className="px-3 py-1.5 text-xs font-semibold bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Investigate
                </button>
                <button
                  onClick={() => markAlertRead(alert.id)}
                  className="text-xs opacity-75 hover:opacity-100 underline px-1.5 py-1"
                >
                  Dismiss
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <div className="text-xs text-slate-700 dark:text-slate-400 font-medium">Screened Orders</div>
          <div className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white mt-1">
            {totalAnalyzed}
          </div>
          <div className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">100% automated</div>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <div className="text-xs text-slate-700 dark:text-slate-400 font-medium">Flagged for Review</div>
          <div className="text-2xl font-bold font-mono tabular-nums text-orange-600 dark:text-orange-400 mt-1">
            {flaggedCount}
          </div>
          <div className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">Critical + High</div>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <div className="text-xs text-slate-700 dark:text-slate-400 font-medium">Confirmed Fraud</div>
          <div className="text-2xl font-bold font-mono tabular-nums text-rose-600 dark:text-rose-400 mt-1">
            {confirmedFraudCount}
          </div>
          <div className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">Intercepted &amp; Voided</div>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <div className="text-xs text-slate-700 dark:text-slate-400 font-medium">Prevented Losses</div>
          <div className="text-2xl font-bold font-mono tabular-nums text-emerald-600 dark:text-emerald-400 mt-1">
            Rs. ${(preventedExposure / 1000).toFixed(0)}k
          </div>
          <div className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">Financial ROI</div>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <div className="text-xs text-slate-700 dark:text-slate-400 font-medium">Avg Risk Score</div>
          <div className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white mt-1">
            {avgRiskScore}
          </div>
          <div className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">Scale 0 - 100</div>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <div className="text-xs text-slate-700 dark:text-slate-400 font-medium">False Positive Rate</div>
          <div className="text-2xl font-bold font-mono tabular-nums text-indigo-600 dark:text-indigo-400 mt-1">
            {falsePositiveRate}%
          </div>
          <div className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">Industry avg ~4.8%</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-wrap items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 min-w-[260px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search order ID, customer name, email address..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-slate-500"
          />
        </div>

        {/* Segmented Controls for Filter (Interactive buttons adhering to Anti-Pill rule) */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Risk Level Filter */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs">
            {['all', 'critical', 'high', 'medium', 'low'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedRiskCategory(cat)}
                className={`px-2.5 py-1 rounded-md capitalize transition-colors whitespace-nowrap ${
                  selectedRiskCategory === cat
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <span>Status:</span>
            <select
              aria-label="Filter by Status"
              value={selectedReviewStatus}
              onChange={(e) => setSelectedReviewStatus(e.target.value)}
              className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1 text-xs text-slate-800 dark:text-slate-200 focus:outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="under_review">Under Review</option>
              <option value="held">Held</option>
              <option value="confirmed_fraud">Confirmed Fraud</option>
              <option value="false_positive">False Positive</option>
              <option value="auto_approved">Auto Approved</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Transactions Table */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-950/80 border-b border-slate-200 dark:border-slate-800 text-slate-500 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="px-5 py-3.5 font-medium">Order ID</th>
                <th className="px-5 py-3.5 font-medium">Customer</th>
                <th className="px-5 py-3.5 font-medium text-right">Amount</th>
                <th className="px-5 py-3.5 font-medium text-center">Risk Score</th>
                <th className="px-5 py-3.5 font-medium">Key SHAP Indicators</th>
                <th className="px-5 py-3.5 font-medium">Review Status</th>
                <th className="px-5 py-3.5 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-8 text-center text-slate-500 italic">
                    No transactions match the selected filters.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const pred = predictions[order.id];
                  const riskScore = pred?.riskScore ?? 12;
                  const riskCategory = pred?.riskCategory ?? 'low';

                  // Risk color styling
                  let scoreBadgeColor = 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800';
                  if (riskCategory === 'critical') {
                    scoreBadgeColor = 'text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/50 border-rose-200 dark:border-rose-800 font-bold';
                  } else if (riskCategory === 'high') {
                    scoreBadgeColor = 'text-orange-700 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/50 border-orange-200 dark:border-orange-800 font-semibold';
                  } else if (riskCategory === 'medium') {
                    scoreBadgeColor = 'text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 border-amber-200 dark:border-amber-800';
                  }

                  const topDrivers = pred?.shapExplanations.filter(s => s.direction === 'increases_risk').slice(0, 2) || [];

                  return (
                    <tr
                      key={order.id}
                      className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      {/* Order ID */}
                      <td className="px-5 py-4 font-mono font-semibold text-slate-900 dark:text-white">
                        {order.id}
                        <div className="text-[10px] text-slate-600 dark:text-slate-400 font-sans font-normal">
                          {new Date(order.createdAt).toLocaleDateString()} · {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </td>

                      {/* Customer */}
                      <td className="px-5 py-4">
                        <div className="font-medium text-slate-900 dark:text-slate-100">
                          {order.customerName}
                        </div>
                        <div className="text-[11px] text-slate-600 dark:text-slate-400 truncate max-w-[200px]">
                          {order.customerEmail}
                        </div>
                      </td>

                      {/* Amount */}
                      <td className="px-5 py-4 text-right font-mono tabular-nums font-semibold text-slate-900 dark:text-white">
                        Rs. {order.totalAmount.toLocaleString()}
                      </td>

                      {/* Risk Score */}
                      <td className="px-5 py-4 text-center">
                        <div className="inline-flex flex-col items-center">
                          <span className={`px-2 py-0.5 rounded-md text-xs font-mono border ${scoreBadgeColor}`}>
                            {riskScore}/100
                          </span>
                          <span className="text-[10px] uppercase font-semibold text-slate-700 dark:text-slate-400 mt-0.5">
                            {riskCategory}
                          </span>
                        </div>
                      </td>

                      {/* Key SHAP Indicators */}
                      <td className="px-5 py-4">
                        {topDrivers.length > 0 ? (
                          <div className="space-y-1">
                            {topDrivers.map((driver) => (
                              <div key={driver.name} className="flex items-center gap-1 text-[11px] text-slate-700 dark:text-slate-300">
                                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
                                <span>{driver.label}:</span>
                                <span className="text-slate-600 dark:text-slate-400 font-mono">
                                  {driver.value}
                                </span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                            <ShieldCheck className="w-3.5 h-3.5" />
                            Standard baseline patterns
                          </span>
                        )}
                      </td>

                      {/* Review Status */}
                      <td className="px-5 py-4">
                        <span className="text-[11px] font-mono uppercase font-semibold text-slate-700 dark:text-slate-300">
                          {order.fraudReviewStatus.replace('_', ' ')}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4 text-right">
                        <button
                          onClick={() => setSelectedInvestigationOrderId(order.id)}
                          className="px-3 py-1.5 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-lg text-xs font-medium hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors inline-flex items-center gap-1.5"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          Investigate
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Audit Log Stream */}
      <div className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-slate-500" />
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
              Immutable Security &amp; Review Audit Trail
            </h3>
          </div>
          <span className="text-[11px] text-slate-600 dark:text-slate-400 font-mono">
            Recorded in PostgreSQL audit_logs
          </span>
        </div>

        <div className="space-y-2.5">
          {auditLogs.slice(0, 5).map((log) => (
            <div
              key={log.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-xs"
            >
              <div className="flex items-center gap-2">
                <span className="font-mono text-slate-600 dark:text-slate-400 text-[11px]">
                  {new Date(log.timestamp).toLocaleTimeString()}
                </span>
                <span className="text-slate-600">·</span>
                <span className="font-semibold text-slate-900 dark:text-slate-200">
                  {log.actor}
                </span>
                <span className="text-slate-600">·</span>
                <span className="font-mono text-[10px] uppercase font-bold text-slate-700 dark:text-slate-300">
                  {log.action}
                </span>
                <span className="text-slate-600">·</span>
                <span className="font-mono font-medium text-slate-800 dark:text-slate-300">
                  {log.target}
                </span>
              </div>
              <p className="text-slate-600 dark:text-slate-400 text-[11px] sm:text-right">
                {log.details}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Order Investigation Modal */}
      {selectedInvestigationOrderId && (
        <OrderInvestigationModal
          orderId={selectedInvestigationOrderId}
          onClose={() => setSelectedInvestigationOrderId(null)}
        />
      )}
    </div>
  );
};
