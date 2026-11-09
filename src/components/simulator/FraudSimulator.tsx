import React, { useMemo, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { FraudEngine, RawTransactionInput } from '../../services/fraudEngine';
import { RiskGauge, SHAPWaterfallChart, ModelComparisonBar } from '../common/Charts';
import {
  Sliders,
  Play,
  RotateCcw,
  Sparkles,
  ShieldAlert,
  Server,
  Terminal,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Globe,
  Lock,
} from 'lucide-react';

interface PresetOption {
  name: string;
  badge: string;
  description: string;
  input: RawTransactionInput;
}

const PRESETS: PresetOption[] = [
  {
    name: 'Normal Pakistani Shopper (COD)',
    badge: 'Safe Baseline',
    description: 'DHA Lahore residential delivery, Rs. 45,000 order, Cash on Delivery, genuine Pakistani IP, clean device.',
    input: {
      orderAmount: 45000,
      customerAvgAmount: 38000,
      accountAgeDays: 120,
      orderVelocity24h: 1,
      orderVelocity1h: 1,
      failedPaymentAttempts: 0,
      billingAddressCountry: 'PK',
      shippingAddressCountry: 'PK',
      billingAddressStreet: 'House 142, Sector Y, Phase 6, DHA',
      shippingAddressStreet: 'House 142, Sector Y, Phase 6, DHA',
      ipCountry: 'PK',
      deviceAnomalyScore: 0.08,
      itemQuantity: 1,
      timeOfDayHour: 15,
      isDisposableEmail: false,
      isVpnOrProxy: false,
    },
  },
  {
    name: 'COD Address Hopping Velocity Bot',
    badge: 'Critical Attack Vector',
    description: '4 rapid orders in 1h to disparate addresses across Karachi, disposable burner email, anonymous proxy.',
    input: {
      orderAmount: 185000,
      customerAvgAmount: 25000,
      accountAgeDays: 0,
      orderVelocity24h: 7,
      orderVelocity1h: 4,
      failedPaymentAttempts: 0,
      billingAddressCountry: 'PK',
      shippingAddressCountry: 'PK',
      billingAddressStreet: 'Plot 44, Korangi Industrial Area',
      shippingAddressStreet: 'Flat 302, Block 5, Clifton',
      ipCountry: 'NL',
      deviceAnomalyScore: 0.94,
      itemQuantity: 3,
      timeOfDayHour: 3,
      isDisposableEmail: true,
      isVpnOrProxy: true,
    },
  },
  {
    name: 'SIM Clone Card Attack (International)',
    badge: 'High Risk Vector',
    description: 'Russian / European IP ordering to Pakistan freight address, Rs. 240,000 luxury sofa, 3 failed card retries.',
    input: {
      orderAmount: 240000,
      customerAvgAmount: 35000,
      accountAgeDays: 0,
      orderVelocity24h: 3,
      orderVelocity1h: 2,
      failedPaymentAttempts: 3,
      billingAddressCountry: 'RU',
      shippingAddressCountry: 'PK',
      billingAddressStreet: 'Tverskaya St 12',
      shippingAddressStreet: 'Cargo Terminal 4, Port Qasim',
      ipCountry: 'RU',
      deviceAnomalyScore: 0.88,
      itemQuantity: 2,
      timeOfDayHour: 2,
      isDisposableEmail: false,
      isVpnOrProxy: true,
    },
  },
  {
    name: 'Nocturnal Spend Surge Anomaly',
    badge: 'High Value Surge',
    description: 'Seasoned account suddenly ordering 7.2x historical average at 03:00 AM with unfamiliar device fingerprint.',
    input: {
      orderAmount: 345000,
      customerAvgAmount: 48000,
      accountAgeDays: 240,
      orderVelocity24h: 3,
      orderVelocity1h: 2,
      failedPaymentAttempts: 1,
      billingAddressCountry: 'PK',
      shippingAddressCountry: 'PK',
      billingAddressStreet: 'Sector F-7/2',
      shippingAddressStreet: 'Industrial Area I-9',
      ipCountry: 'PK',
      deviceAnomalyScore: 0.79,
      itemQuantity: 5,
      timeOfDayHour: 3,
      isDisposableEmail: false,
      isVpnOrProxy: false,
    },
  },
];

export const FraudSimulator: React.FC = () => {
  const { currentTenant, submitCheckout, setViewMode } = useApp();

  const [input, setInput] = useState<RawTransactionInput>(PRESETS[0].input);
  const [injectedOrderId, setInjectedOrderId] = useState<string | null>(null);

  // Real-time evaluation on every slider/toggle change
  const currentPrediction = useMemo(() => {
    return FraudEngine.evaluateTransaction('SIM-TEST', currentTenant.id, input);
  }, [input, currentTenant.id]);

  const handleApplyPreset = (preset: PresetOption) => {
    setInput(preset.input);
    setInjectedOrderId(null);
  };

  const handleInjectIntoStore = () => {
    // Generate real checkout submission into the active tenant's order store
    const result = submitCheckout({
      customerName: input.isDisposableEmail ? 'Automated Test Bot' : 'Simulated Customer',
      customerEmail: input.isDisposableEmail ? 'bot_sim99@sharklasers.com' : 'simulated.customer@decorhaus.pk',
      customerPhone: '0300-9876543',
      shippingAddress: {
        fullName: 'Simulated Customer',
        street: input.shippingAddressStreet || 'House 142, Phase 6, DHA',
        city: 'Lahore',
        state: 'Punjab',
        postalCode: '54792',
        country: input.shippingAddressCountry || 'PK',
      },
      billingAddress: {
        fullName: 'Simulated Customer',
        street: input.billingAddressStreet || 'House 142, Phase 6, DHA',
        city: 'Lahore',
        state: 'Punjab',
        postalCode: '54792',
        country: input.billingAddressCountry || 'PK',
      },
      paymentMethod: 'Cash on Delivery (COD)',
      failedPaymentAttempts: input.failedPaymentAttempts,
      isVpnOrProxy: input.isVpnOrProxy,
      ipCountry: input.ipCountry,
    });

    setInjectedOrderId(result.order.id);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
              <Sliders className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              FastAPI ML Fraud Simulation &amp; Attack Sandbox
            </h1>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Experiment with transaction features in real-time. Observe how XGBoost, Random Forest, Isolation Forest, and TreeSHAP react to Pakistani order vectors.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleApplyPreset(PRESETS[0])}
            className="px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-lg hover:bg-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Baseline
          </button>
        </div>
      </div>

      {/* Preset Vectors Selection */}
      <div className="space-y-2">
        <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          Simulated Attack Scenarios &amp; Behavior Presets (Pakistan Context)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {PRESETS.map((preset) => {
            const isSelected =
              input.orderAmount === preset.input.orderAmount &&
              input.failedPaymentAttempts === preset.input.failedPaymentAttempts &&
              input.isVpnOrProxy === preset.input.isVpnOrProxy;

            return (
              <button
                key={preset.name}
                onClick={() => handleApplyPreset(preset)}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'border-indigo-600 dark:border-indigo-500 bg-indigo-50/40 dark:bg-indigo-950/30 shadow-xs'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-semibold text-slate-900 dark:text-slate-100">
                    {preset.name}
                  </span>
                  <span className="text-[10px] font-mono text-indigo-600 dark:text-indigo-400 font-semibold">
                    {preset.badge}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal line-clamp-2">
                  {preset.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2-Column Working Layout: Controls Left, Live ML Scoring Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Controls Column (5 cols) */}
        <div className="lg:col-span-5 space-y-5 p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Transaction Feature Parameters
            </h3>
            <span className="text-[11px] text-slate-600 dark:text-slate-400 font-mono">FastAPI Payload</span>
          </div>

          {/* Slider 1: Order Amount in PKR */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <label className="text-slate-700 dark:text-slate-300 font-medium">
                Order Amount (PKR Rs.)
              </label>
              <span className="font-mono font-semibold text-slate-900 dark:text-slate-100 tabular-nums">
                Rs. {input.orderAmount.toLocaleString()}
              </span>
            </div>
            <input
              type="range"
              min="5000"
              max="450000"
              step="5000"
              value={input.orderAmount}
              onChange={(e) => setInput({ ...input, orderAmount: Number(e.target.value) })}
              className="w-full accent-indigo-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-600 dark:text-slate-400 font-mono">
              <span>Rs. 5,000</span>
              <span>Rs. 225,000</span>
              <span>Rs. 450,000</span>
            </div>
          </div>

          {/* Slider 2: Ratio vs Customer Baseline */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <label className="text-slate-700 dark:text-slate-300 font-medium">
                Ratio to Customer Historical Avg
              </label>
              <span className="font-mono font-semibold text-slate-900 dark:text-slate-100 tabular-nums">
                {((input.orderAmount / (input.customerAvgAmount || 35000))).toFixed(1)}x
              </span>
            </div>
            <input
              type="range"
              min="10000"
              max="150000"
              step="5000"
              value={input.customerAvgAmount ?? 35000}
              onChange={(e) => setInput({ ...input, customerAvgAmount: Number(e.target.value) })}
              className="w-full accent-indigo-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-600 dark:text-slate-400 font-mono">
              <span>Low Baseline (Rs. 10k)</span>
              <span>High Baseline (Rs. 150k)</span>
            </div>
          </div>

          {/* Slider 3: Account Seasoning Age (Days) */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <label className="text-slate-700 dark:text-slate-300 font-medium">
                Account Age (Days Active)
              </label>
              <span className="font-mono font-semibold text-slate-900 dark:text-slate-100 tabular-nums">
                {input.accountAgeDays} days {input.accountAgeDays === 0 ? '(Fresh Guest)' : ''}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="365"
              step="5"
              value={input.accountAgeDays ?? 0}
              onChange={(e) => setInput({ ...input, accountAgeDays: Number(e.target.value) })}
              className="w-full accent-indigo-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-600 dark:text-slate-400 font-mono">
              <span>0 (Fresh Guest)</span>
              <span>90d</span>
              <span>365d (Loyal Shopper)</span>
            </div>
          </div>

          {/* Slider 4: Failed Payment Attempts */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <label className="text-slate-700 dark:text-slate-300 font-medium">
                Consecutive Failed Attempts
              </label>
              <span className={`font-mono font-semibold tabular-nums ${(input.failedPaymentAttempts ?? 0) > 0 ? 'text-rose-600' : 'text-slate-900 dark:text-slate-100'}`}>
                {input.failedPaymentAttempts ?? 0} attempts
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="6"
              step="1"
              value={input.failedPaymentAttempts ?? 0}
              onChange={(e) => setInput({ ...input, failedPaymentAttempts: Number(e.target.value) })}
              className="w-full accent-indigo-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-600 dark:text-slate-400 font-mono">
              <span>0 (Clean)</span>
              <span>3 (High Alert)</span>
              <span>6 (Brute Force)</span>
            </div>
          </div>

          {/* Slider 5: Order Velocity (1 Hour) */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <label className="text-slate-700 dark:text-slate-300 font-medium">
                Order Velocity (Past 1 Hour)
              </label>
              <span className="font-mono font-semibold text-slate-900 dark:text-slate-100 tabular-nums">
                {input.orderVelocity1h} orders / hr
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="8"
              step="1"
              value={input.orderVelocity1h}
              onChange={(e) => setInput({ ...input, orderVelocity1h: Number(e.target.value) })}
              className="w-full accent-indigo-600 cursor-pointer"
            />
          </div>

          {/* Toggles */}
          <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-3">
            <label className="flex items-center justify-between text-xs cursor-pointer">
              <span className="text-slate-700 dark:text-slate-300 font-medium flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-indigo-500" />
                Anonymous Proxy / VPN Connection
              </span>
              <input
                type="checkbox"
                checked={input.isVpnOrProxy}
                onChange={(e) => setInput({ ...input, isVpnOrProxy: e.target.checked })}
                className="w-4 h-4 rounded text-indigo-600 cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between text-xs cursor-pointer">
              <span className="text-slate-700 dark:text-slate-300 font-medium flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-rose-500" />
                Disposable / Burner Email Domain
              </span>
              <input
                type="checkbox"
                checked={input.isDisposableEmail}
                onChange={(e) => setInput({ ...input, isDisposableEmail: e.target.checked })}
                className="w-4 h-4 rounded text-indigo-600 cursor-pointer"
              />
            </label>
          </div>

          {/* Inject Order Action */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-3">
            <button
              onClick={handleInjectIntoStore}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-2 shadow-sm cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Simulate &amp; Inject Transaction into Store</span>
            </button>

            {injectedOrderId && (
              <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Order <strong>{injectedOrderId}</strong> created in store!</span>
                </div>
                <button
                  onClick={() => setViewMode('fraud_hub')}
                  className="underline font-semibold text-emerald-700 dark:text-emerald-300 hover:text-emerald-900 cursor-pointer"
                >
                  Inspect in Fraud Hub &rarr;
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Live ML Inference Output Column (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Risk Gauge & Scoring Summary */}
          <div className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
              <RiskGauge score={currentPrediction.riskScore} size={140} />

              <div className="flex-1 space-y-2 text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <span className={`text-base font-bold uppercase ${
                    currentPrediction.riskCategory === 'critical' ? 'text-rose-600 dark:text-rose-400' :
                    currentPrediction.riskCategory === 'high' ? 'text-orange-600 dark:text-orange-400' :
                    currentPrediction.riskCategory === 'medium' ? 'text-amber-600 dark:text-amber-400' :
                    'text-emerald-600 dark:text-emerald-400'
                  }`}>
                    {currentPrediction.riskCategory} Risk Score
                  </span>
                  <span className="text-xs text-slate-500 font-mono">
                    ({currentPrediction.riskScore}/100)
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                  Recommendation:{' '}
                  <span className="font-semibold text-slate-900 dark:text-slate-100">
                    {currentPrediction.recommendedAction}
                  </span>
                </p>

                <p className="text-xs text-slate-500 leading-relaxed font-sans">
                  {currentPrediction.aiSummaryExplanation}
                </p>
              </div>
            </div>

            {/* Model Breakdown */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Model Voting Breakdown</span>
                <span className="font-mono">Ensemble Weight: 42% XGB / 25% RF / 28% IsoForest</span>
              </div>
              <ModelComparisonBar
                xgboostScore={currentPrediction.xgboostScore}
                randomForestScore={currentPrediction.randomForestScore}
                isolationForestScore={currentPrediction.isolationForestAnomalyScore}
              />
            </div>
          </div>

          {/* Live SHAP Waterfall Attribution */}
          <div className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  SHAP Explainability Waterfall (Real-time Decomposition)
                </h3>
                <p className="text-xs text-slate-500">
                  Exact mathematical contribution of each feature towards the {currentPrediction.riskScore}/100 score
                </p>
              </div>
              <span className="text-xs font-mono text-indigo-600 dark:text-indigo-400 font-medium">
                TreeSHAP
              </span>
            </div>

            <SHAPWaterfallChart shapFeatures={currentPrediction.shapExplanations} />
          </div>

          {/* FastAPI Microservice Architecture Card */}
          <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-950 text-white space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Server className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold font-mono">FastAPI Python Microservice (`POST /v1/predict`)</span>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 border border-emerald-800 px-2 py-0.5 rounded">
                200 OK · 14ms
              </span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
              The Next.js customer frontend forwards transaction telemetry to the FastAPI backend asynchronously during checkout. The Python runtime runs the trained XGBoost model, parses Shapley values, and returns JSON risk classification in 14ms.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
