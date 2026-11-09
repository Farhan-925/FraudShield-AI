import React from 'react';
import { SHAPFeature } from '../../types';

// Radial Risk Gauge
export const RiskGauge: React.FC<{ score: number; size?: number }> = ({ score, size = 120 }) => {
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  // Use a semi-circle (arc) or 270 degree gauge
  const progress = (score / 100) * circumference;

  let strokeColor = '#10B981'; // emerald
  let textColor = 'text-emerald-600 dark:text-emerald-400';
  let badgeLabel = 'LOW';

  if (score >= 80) {
    strokeColor = '#DC2626'; // crimson
    textColor = 'text-rose-600 dark:text-rose-400';
    badgeLabel = 'CRITICAL';
  } else if (score >= 60) {
    strokeColor = '#EA580C'; // orange
    textColor = 'text-orange-600 dark:text-orange-400';
    badgeLabel = 'HIGH';
  } else if (score >= 30) {
    strokeColor = '#D97706'; // amber
    textColor = 'text-amber-600 dark:text-amber-400';
    badgeLabel = 'MEDIUM';
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="transparent"
            className="text-slate-100 dark:text-slate-800"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={circumference - progress}
            strokeLinecap="round"
            className="transition-all duration-700 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className={`text-2xl font-bold font-mono tabular-nums ${textColor}`}>
            {score}
          </span>
          <span className="text-[10px] text-slate-500 font-medium">/ 100</span>
        </div>
      </div>
      <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-1">
        {badgeLabel} RISK
      </span>
    </div>
  );
};

// SHAP Waterfall & Contribution Bar Chart
export const SHAPWaterfallChart: React.FC<{
  shapFeatures: SHAPFeature[];
  baseScore?: number;
  finalScore?: number;
}> = ({ shapFeatures }) => {
  return (
    <div className="space-y-3 font-sans">
      <div className="flex items-center justify-between text-xs text-slate-500 pb-1 border-b border-slate-200 dark:border-slate-800">
        <span>Feature Factor</span>
        <div className="flex items-center gap-4">
          <span>Observed Value</span>
          <span className="w-20 text-right">SHAP Impact</span>
        </div>
      </div>

      <div className="space-y-2.5">
        {shapFeatures.map((feat) => {
          const isRisk = feat.direction === 'increases_risk';
          const absContr = Math.abs(feat.contribution);
          const barWidth = Math.min(100, Math.max(8, feat.relativeImpact));

          return (
            <div key={feat.name} className="group">
              <div className="flex items-center justify-between text-xs mb-1">
                <div className="flex items-center gap-2">
                  <span className={`w-1.5 h-1.5 rounded-full ${isRisk ? 'bg-rose-500' : 'bg-emerald-500'}`} />
                  <span className="font-medium text-slate-800 dark:text-slate-200">
                    {feat.label}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-xs font-mono tabular-nums">
                  <span className="text-slate-600 dark:text-slate-400">
                    {feat.value}
                  </span>
                  <span
                    className={`w-20 text-right font-semibold ${
                      isRisk ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'
                    }`}
                  >
                    {feat.contribution > 0 ? `+${feat.contribution}%` : `${feat.contribution}%`}
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex">
                {isRisk ? (
                  <div
                    className="h-full bg-rose-500 rounded-full transition-all duration-500"
                    style={{ width: `${barWidth}%` }}
                  />
                ) : (
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                    style={{ width: `${barWidth}%` }}
                  />
                )}
              </div>

              <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5 line-clamp-1">
                {feat.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Model Voting Comparison Bar
export const ModelComparisonBar: React.FC<{
  xgboostScore: number;
  randomForestScore: number;
  isolationForestScore: number;
}> = ({ xgboostScore, randomForestScore, isolationForestScore }) => {
  return (
    <div className="grid grid-cols-3 gap-3">
      <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
        <div className="text-[11px] text-slate-700 dark:text-slate-400 font-medium">XGBoost Classifier</div>
        <div className="text-lg font-semibold font-mono tabular-nums text-slate-900 dark:text-slate-100 mt-1">
          {(xgboostScore * 100).toFixed(1)}%
        </div>
        <div className="text-[10px] text-slate-600 dark:text-slate-400 mt-0.5">Primary Supervised</div>
      </div>

      <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
        <div className="text-[11px] text-slate-700 dark:text-slate-400 font-medium">Random Forest</div>
        <div className="text-lg font-semibold font-mono tabular-nums text-slate-900 dark:text-slate-100 mt-1">
          {(randomForestScore * 100).toFixed(1)}%
        </div>
        <div className="text-[10px] text-slate-600 dark:text-slate-400 mt-0.5">Ensemble Voting</div>
      </div>

      <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
        <div className="text-[11px] text-slate-700 dark:text-slate-400 font-medium">Isolation Forest</div>
        <div className="text-lg font-semibold font-mono tabular-nums text-slate-900 dark:text-slate-100 mt-1">
          {(isolationForestScore * 100).toFixed(1)}%
        </div>
        <div className="text-[10px] text-slate-600 dark:text-slate-400 mt-0.5">Anomaly Outlier Score</div>
      </div>
    </div>
  );
};
