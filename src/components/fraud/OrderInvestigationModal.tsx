import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { RiskGauge, SHAPWaterfallChart, ModelComparisonBar } from '../common/Charts';
import {
  X,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Globe,
  Smartphone,
  CreditCard,
  User,
  MapPin,
  Clock,
  Send,
  FileText,
  Check,
} from 'lucide-react';

export const OrderInvestigationModal: React.FC<{
  orderId: string;
  onClose: () => void;
}> = ({ orderId, onClose }) => {
  const {
    orders,
    predictions,
    reviewFraudOrder,
    addInvestigationNote,
    currentRole,
  } = useApp();

  const [newNote, setNewNote] = useState('');
  const [successActionMsg, setSuccessActionMsg] = useState<string | null>(null);

  const order = orders.find(o => o.id === orderId);
  const prediction = predictions[orderId];

  if (!order || !prediction) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
        <div className="bg-white dark:bg-slate-900 rounded-xl max-w-md w-full p-6 text-center">
          <p className="text-slate-600 dark:text-slate-400">Order prediction data not found.</p>
          <button
            onClick={onClose}
            className="mt-4 px-4 py-2 bg-slate-900 text-white rounded-lg text-xs"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  const f = prediction.features;

  const handleAction = (
    action: 'approve_legitimate' | 'confirm_fraud' | 'hold_order' | 'release_order'
  ) => {
    reviewFraudOrder(orderId, action, newNote ? newNote : undefined);
    setNewNote('');
    const labels = {
      approve_legitimate: 'Order verified as Legitimate (False Positive marked)',
      confirm_fraud: 'Confirmed as Fraudulent. Transaction cancelled.',
      hold_order: 'Order placed on Hold pending identity verification.',
      release_order: 'Order released for fulfillment processing.',
    };
    setSuccessActionMsg(labels[action]);
    setTimeout(() => setSuccessActionMsg(null), 3000);
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    addInvestigationNote(orderId, newNote.trim());
    setNewNote('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl max-w-5xl w-full my-8 overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-950 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <ShieldAlert className="w-5 h-5 text-rose-500" />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-semibold tracking-tight">
                  Fraud Investigation: {order.id}
                </h2>
                <span className="text-xs text-slate-400 font-mono">
                  Model: {prediction.modelVersion}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Customer: {order.customerName} · Total: Rs. {order.totalAmount.toLocaleString()} · Placed {new Date(order.createdAt).toLocaleString()}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action success alert */}
        {successActionMsg && (
          <div className="bg-emerald-50 dark:bg-emerald-950/50 border-b border-emerald-200 dark:border-emerald-800 px-6 py-2.5 flex items-center gap-2 text-xs font-medium text-emerald-800 dark:text-emerald-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            {successActionMsg}
          </div>
        )}

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Top Grid: Risk Gauge & Model Ensemble Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center bg-slate-50 dark:bg-slate-950/60 p-5 rounded-xl border border-slate-200 dark:border-slate-800">
            {/* Gauge */}
            <div className="flex items-center justify-center p-2 border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-slate-800">
              <RiskGauge score={prediction.riskScore} size={130} />
            </div>

            {/* Model voting */}
            <div className="lg:col-span-2 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    Hybrid ML Model Decision Voting
                  </h3>
                  <p className="text-xs text-slate-500">
                    Calibrated ensemble of gradient boosting and unsupervised tree isolation
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono text-slate-500">Fraud Prob:</span>{' '}
                  <span className="text-sm font-bold font-mono text-slate-900 dark:text-white">
                    {(prediction.fraudProbability * 100).toFixed(0)}%
                  </span>
                </div>
              </div>

              <ModelComparisonBar
                xgboostScore={prediction.xgboostScore}
                randomForestScore={prediction.randomForestScore}
                isolationForestScore={prediction.isolationForestAnomalyScore}
              />

              <div className="text-xs text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-800">
                <span className="font-semibold text-slate-900 dark:text-slate-100">Recommended Action:</span>{' '}
                <span className={`font-semibold ${
                  prediction.riskCategory === 'critical' ? 'text-rose-600 dark:text-rose-400' :
                  prediction.riskCategory === 'high' ? 'text-orange-600 dark:text-orange-400' :
                  prediction.riskCategory === 'medium' ? 'text-amber-600 dark:text-amber-400' :
                  'text-emerald-600 dark:text-emerald-400'
                }`}>
                  {prediction.recommendedAction}
                </span>
                {' · Current Review State: '}
                <span className="font-mono uppercase font-semibold text-slate-700 dark:text-slate-300">
                  {order.fraudReviewStatus.replace('_', ' ')}
                </span>
              </div>
            </div>
          </div>

          {/* AI Explanation Callout */}
          <div className="p-4 rounded-xl border border-indigo-200 dark:border-indigo-900/60 bg-indigo-50/50 dark:bg-indigo-950/20 space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-semibold text-indigo-900 dark:text-indigo-300">
              <ShieldAlert className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>Explainable AI Risk Attribution (TreeSHAP Generated)</span>
            </div>
            <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-sans">
              {prediction.aiSummaryExplanation}
            </p>
          </div>

          {/* 2-Column Split: SHAP Waterfall vs Telemetry Signals */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: SHAP Waterfall Features */}
            <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  SHAP Feature Contributions
                </h4>
                <span className="text-[11px] text-slate-500 font-mono">
                  TreeSHAP v0.42
                </span>
              </div>
              <SHAPWaterfallChart shapFeatures={prediction.shapExplanations} />
            </div>

            {/* Right: Detailed Telemetry Grid */}
            <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4">
              <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 pb-2 border-b border-slate-200 dark:border-slate-800">
                Transaction Telemetry & Identity Signals
              </h4>

              <div className="grid grid-cols-2 gap-3 text-xs">
                {/* Customer / Account */}
                <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-1">
                  <div className="text-slate-700 dark:text-slate-400 flex items-center gap-1 font-medium">
                    <User className="w-3.5 h-3.5" /> Account Age
                  </div>
                  <div className="font-semibold text-slate-900 dark:text-slate-100 font-mono">
                    {f.accountAgeDays} days
                  </div>
                  <div className="text-[10px] text-slate-600 dark:text-slate-400">
                    {f.accountAgeDays === 0 ? 'Guest / Brand New' : 'Seasoned Customer'}
                  </div>
                </div>

                {/* Amount vs Avg */}
                <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-1">
                  <div className="text-slate-700 dark:text-slate-400 flex items-center gap-1 font-medium">
                    <CreditCard className="w-3.5 h-3.5" /> Order vs Baseline
                  </div>
                  <div className="font-semibold text-slate-900 dark:text-slate-100 font-mono">
                    {f.amountToAvgRatio}x Baseline
                  </div>
                  <div className="text-[10px] text-slate-600 dark:text-slate-400">
                    Order: Rs. {f.orderAmount.toLocaleString()}
                  </div>
                </div>

                {/* Failed Payment Retries */}
                <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-1">
                  <div className="text-slate-700 dark:text-slate-400 flex items-center gap-1 font-medium">
                    <Lock className="w-3.5 h-3.5" /> Payment Retries
                  </div>
                  <div className={`font-semibold font-mono ${f.failedPaymentAttempts > 0 ? 'text-rose-600' : 'text-slate-900 dark:text-slate-100'}`}>
                    {f.failedPaymentAttempts} Failed Attempts
                  </div>
                  <div className="text-[10px] text-slate-600 dark:text-slate-400">
                    {f.failedPaymentAttempts > 0 ? 'Possible card testing' : 'Clean authorization'}
                  </div>
                </div>

                {/* Order Velocity */}
                <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-1">
                  <div className="text-slate-700 dark:text-slate-400 flex items-center gap-1 font-medium">
                    <Clock className="w-3.5 h-3.5" /> Velocity (1h / 24h)
                  </div>
                  <div className="font-semibold text-slate-900 dark:text-slate-100 font-mono">
                    {f.orderVelocity1h} / 1h · {f.orderVelocity24h} / 24h
                  </div>
                  <div className="text-[10px] text-slate-600 dark:text-slate-400">
                    Hour: {f.timeOfDayHour}:00 local
                  </div>
                </div>

                {/* Geolocation */}
                <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-1 col-span-2">
                  <div className="text-slate-700 dark:text-slate-400 flex items-center justify-between font-medium">
                    <span className="flex items-center gap-1">
                      <Globe className="w-3.5 h-3.5" /> Geographic Matching
                    </span>
                    {f.geoMismatch ? (
                      <span className="text-rose-600 dark:text-rose-400 font-semibold text-[10px]">MISMATCH DETECTED</span>
                    ) : (
                      <span className="text-emerald-600 dark:text-emerald-400 font-semibold text-[10px]">MATCHED</span>
                    )}
                  </div>
                  <div className="text-xs font-mono text-slate-800 dark:text-slate-200">
                    IP: {f.ipCountry} · Ship: {f.shippingCountry} · VPN: {f.isVpnOrProxy ? 'YES (Anonymous Proxy)' : 'No'}
                  </div>
                  <div className="text-[10px] text-slate-600 dark:text-slate-400">
                    Address: {order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.country}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Investigation Notes & Thread */}
          <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
            <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <FileText className="w-4 h-4 text-slate-500" />
              <span>Analyst Investigation Notes ({prediction.investigationNotes.length})</span>
            </h4>

            {prediction.investigationNotes.length === 0 ? (
              <p className="text-xs text-slate-600 dark:text-slate-400 italic">
                No investigation notes added yet. Use the field below to document evidence.
              </p>
            ) : (
              <div className="space-y-2">
                {prediction.investigationNotes.map((note) => (
                  <div
                    key={note.id}
                    className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between text-slate-600 dark:text-slate-400 text-[11px]">
                      <span className="font-semibold text-slate-900 dark:text-slate-200">
                        {note.author} ({note.role})
                      </span>
                      <span className="font-mono">{new Date(note.timestamp).toLocaleTimeString()}</span>
                    </div>
                    <p className="text-slate-700 dark:text-slate-300">{note.text}</p>
                  </div>
                ))}
              </div>
            )}

            <form onSubmit={handleAddNote} className="flex gap-2 pt-2">
              <input
                type="text"
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Add investigation observation or customer verification note..."
                className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-slate-500"
              />
              <button
                type="submit"
                className="px-3.5 py-2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-lg text-xs font-medium hover:bg-slate-800 transition-colors flex items-center gap-1.5"
              >
                <Send className="w-3 h-3" />
                Add Note
              </button>
            </form>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-slate-500">
            Current Role: <span className="font-medium text-slate-900 dark:text-slate-200 uppercase">{currentRole}</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => handleAction('hold_order')}
              className="px-3.5 py-2 bg-amber-100 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-xs font-medium rounded-lg hover:bg-amber-200 transition-colors"
            >
              Place on Hold
            </button>
            <button
              onClick={() => handleAction('confirm_fraud')}
              className="px-3.5 py-2 bg-rose-600 text-white text-xs font-medium rounded-lg hover:bg-rose-700 transition-colors"
            >
              Confirm Fraud (Cancel & Void)
            </button>
            <button
              onClick={() => handleAction('approve_legitimate')}
              className="px-3.5 py-2 bg-emerald-600 text-white text-xs font-medium rounded-lg hover:bg-emerald-700 transition-colors"
            >
              Mark Legitimate (False Positive)
            </button>
            <button
              onClick={onClose}
              className="px-3.5 py-2 bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-medium rounded-lg hover:bg-slate-300 transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
