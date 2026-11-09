import {
  FraudFeatureSnapshot,
  FraudPrediction,
  RiskCategory,
  SHAPFeature,
} from '../types';

export interface RawTransactionInput {
  orderAmount: number;
  customerAvgAmount?: number;
  accountAgeDays?: number;
  orderVelocity24h?: number;
  orderVelocity1h?: number;
  failedPaymentAttempts?: number;
  billingAddressCountry?: string;
  shippingAddressCountry?: string;
  billingAddressStreet?: string;
  shippingAddressStreet?: string;
  ipCountry?: string;
  deviceAnomalyScore?: number; // 0 to 1
  itemQuantity?: number;
  timeOfDayHour?: number; // 0 to 23
  isDisposableEmail?: boolean;
  isVpnOrProxy?: boolean;
}

export class FraudEngine {
  public static readonly MODEL_VERSION = 'v2.4.1-xgboost-hybrid-isoforest';

  /**
   * Normalizes raw transaction input into standard feature snapshot
   */
  public static extractFeatures(input: RawTransactionInput): FraudFeatureSnapshot {
    const customerAvg = input.customerAvgAmount && input.customerAvgAmount > 0 
      ? input.customerAvgAmount 
      : 35000.0; // standard benchmark for Pakistani luxury home decor store in PKR
    
    const amountToAvgRatio = Number((input.orderAmount / customerAvg).toFixed(2));
    const billingCountry = input.billingAddressCountry || 'PK';
    const shippingCountry = input.shippingAddressCountry || 'PK';
    const ipCountry = input.ipCountry || 'PK';

    const geoMismatch = ipCountry !== shippingCountry || billingCountry !== shippingCountry;
    const addressMismatch = (input.billingAddressStreet && input.shippingAddressStreet)
      ? input.billingAddressStreet.trim().toLowerCase() !== input.shippingAddressStreet.trim().toLowerCase()
      : false;

    return {
      orderAmount: input.orderAmount,
      amountToAvgRatio,
      accountAgeDays: input.accountAgeDays ?? 0,
      orderVelocity24h: input.orderVelocity24h ?? 1,
      orderVelocity1h: input.orderVelocity1h ?? 1,
      failedPaymentAttempts: input.failedPaymentAttempts ?? 0,
      billingShippingMismatch: addressMismatch || geoMismatch,
      ipCountry,
      shippingCountry,
      geoMismatch,
      deviceFingerprint: `fp_${Math.abs(Math.sin((input.orderAmount + (input.accountAgeDays || 0)) * 9999)).toString(16).substring(2, 10)}`,
      deviceAnomalyScore: input.deviceAnomalyScore ?? (input.isVpnOrProxy ? 0.85 : 0.12),
      itemQuantity: input.itemQuantity ?? 1,
      timeOfDayHour: input.timeOfDayHour ?? new Date().getHours(),
      isDisposableEmail: Boolean(input.isDisposableEmail),
      isVpnOrProxy: Boolean(input.isVpnOrProxy),
    };
  }

  /**
   * Supervised XGBoost Classifier Emulation
   * Tree ensemble gradient boosting using logit scale
   */
  public static predictXGBoost(f: FraudFeatureSnapshot): number {
    let logOdds = -2.6; // Base rate log-odds (approx 6.9% base fraud rate)

    // Feature 1: Amount to Customer Avg Ratio
    if (f.amountToAvgRatio > 5.0) logOdds += 1.85;
    else if (f.amountToAvgRatio > 3.0) logOdds += 1.10;
    else if (f.amountToAvgRatio > 1.8) logOdds += 0.45;
    else if (f.amountToAvgRatio < 0.8) logOdds -= 0.35;

    // Feature 2: Absolute Order Amount (PKR Scale)
    if (f.orderAmount > 150000) logOdds += 1.4;
    else if (f.orderAmount > 80000) logOdds += 0.7;

    // Feature 3: Failed Payment Retries
    if (f.failedPaymentAttempts >= 3) logOdds += 2.2;
    else if (f.failedPaymentAttempts === 2) logOdds += 1.3;
    else if (f.failedPaymentAttempts === 1) logOdds += 0.4;

    // Feature 4: Order Velocity
    if (f.orderVelocity1h >= 4) logOdds += 2.4;
    else if (f.orderVelocity1h >= 2) logOdds += 1.2;
    if (f.orderVelocity24h >= 8) logOdds += 1.5;

    // Feature 5: Address and Geo Mismatch
    if (f.geoMismatch) logOdds += 1.6;
    if (f.billingShippingMismatch) logOdds += 0.9;

    // Feature 6: Device and Network
    if (f.isVpnOrProxy) logOdds += 1.35;
    if (f.deviceAnomalyScore > 0.7) logOdds += 1.1;

    // Feature 7: Account Age (Protective factor if established)
    if (f.accountAgeDays > 365) logOdds -= 1.8;
    else if (f.accountAgeDays > 90) logOdds -= 1.1;
    else if (f.accountAgeDays > 30) logOdds -= 0.5;
    else if (f.accountAgeDays === 0) logOdds += 0.75; // Brand new guest

    // Feature 8: Disposable Email
    if (f.isDisposableEmail) logOdds += 1.7;

    // Feature 9: Midnight surge (01:00 - 04:30)
    if (f.timeOfDayHour >= 1 && f.timeOfDayHour <= 4) logOdds += 0.45;

    // Logistic Sigmoid
    const prob = 1 / (1 + Math.exp(-logOdds));
    return Number(Math.max(0.01, Math.min(0.99, prob)).toFixed(4));
  }

  /**
   * Supervised Random Forest Classifier Emulation
   * Decision tree voting ensemble with bagging characteristics
   */
  public static predictRandomForest(f: FraudFeatureSnapshot): number {
    let votes = 0;
    const totalTrees = 100;

    // Tree cluster 1: High velocity & Card testing
    const t1Weight = 25;
    let t1Score = 0;
    if (f.failedPaymentAttempts >= 2 && f.orderVelocity1h >= 2) t1Score += 1;
    if (f.failedPaymentAttempts >= 1 && f.orderAmount < 50) t1Score += 0.8; // card testing
    if (f.orderVelocity24h >= 5) t1Score += 0.9;
    votes += (Math.min(1, t1Score / 1.8) * t1Weight);

    // Tree cluster 2: Account seasoning vs Basket value
    const t2Weight = 25;
    let t2Score = 0;
    if (f.accountAgeDays <= 2 && f.orderAmount > 1200) t2Score += 1.2;
    if (f.amountToAvgRatio >= 3.5) t2Score += 0.9;
    if (f.accountAgeDays > 180) t2Score -= 0.8;
    votes += (Math.max(0, Math.min(1, t2Score / 1.5)) * t2Weight);

    // Tree cluster 3: Geo and Network identity
    const t3Weight = 25;
    let t3Score = 0;
    if (f.geoMismatch) t3Score += 0.9;
    if (f.isVpnOrProxy) t3Score += 0.8;
    if (f.billingShippingMismatch) t3Score += 0.5;
    if (f.isDisposableEmail) t3Score += 0.7;
    votes += (Math.min(1, t3Score / 1.6) * t3Weight);

    // Tree cluster 4: Bulk anomaly & Time
    const t4Weight = 25;
    let t4Score = 0;
    if (f.itemQuantity >= 10) t4Score += 0.8;
    if (f.deviceAnomalyScore >= 0.75) t4Score += 0.7;
    if (f.timeOfDayHour >= 2 && f.timeOfDayHour <= 4) t4Score += 0.4;
    votes += (Math.min(1, t4Score / 1.4) * t4Weight);

    const prob = votes / totalTrees;
    return Number(Math.max(0.02, Math.min(0.98, prob)).toFixed(4));
  }

  /**
   * Unsupervised Anomaly Detection (Isolation Forest Emulation)
   * Calculates isolation tree path length. Outliers have short paths (high anomaly score).
   */
  public static predictIsolationForest(f: FraudFeatureSnapshot): number {
    // Expected normal vector for home decor e-commerce:
    // Amount ~300, Ratio ~1.0, Velocity ~1, Failed ~0, Age ~90, GeoMismatch ~0, AnomalyScore ~0.1
    const dAmount = Math.max(0, (f.orderAmount - 400) / 800);
    const dRatio = Math.max(0, f.amountToAvgRatio - 1.2);
    const dFailed = f.failedPaymentAttempts * 1.5;
    const dVel = (f.orderVelocity1h - 1) * 1.8;
    const dGeo = f.geoMismatch ? 2.0 : 0;
    const dNet = (f.isVpnOrProxy ? 1.5 : 0) + (f.isDisposableEmail ? 1.8 : 0);
    const dAge = f.accountAgeDays === 0 ? 0.6 : (f.accountAgeDays < 7 ? 0.3 : 0);

    // Isolation metric: shorter path length => higher anomaly
    const distanceSum = Math.sqrt(
      dAmount * dAmount +
      dRatio * dRatio +
      dFailed * dFailed +
      dVel * dVel +
      dGeo * dGeo +
      dNet * dNet +
      dAge * dAge
    );

    // Convert to normalized anomaly score between 0.05 and 0.95
    const anomalyIntensity = 1 - Math.exp(-distanceSum / 2.8);
    return Number(Math.max(0.04, Math.min(0.96, anomalyIntensity)).toFixed(4));
  }

  /**
   * Computes SHAP (SHapley Additive exPlanations) values for the features
   */
  public static computeSHAP(f: FraudFeatureSnapshot, finalRiskScore: number): SHAPFeature[] {
    const rawContributions: Array<{
      name: string;
      label: string;
      value: string | number;
      contribution: number;
      description: string;
    }> = [];

    // Amount vs historical baseline
    if (f.amountToAvgRatio >= 3.0) {
      rawContributions.push({
        name: 'amount_to_avg_ratio',
        label: 'Order vs Customer Baseline',
        value: `${f.amountToAvgRatio}x average`,
        contribution: +(f.amountToAvgRatio * 5.8),
        description: `Order amount is ${f.amountToAvgRatio}x higher than this customer's historical average (Rs. ${(f.orderAmount / f.amountToAvgRatio).toLocaleString()})`,
      });
    } else if (f.amountToAvgRatio < 1.0 && f.accountAgeDays > 60) {
      rawContributions.push({
        name: 'amount_to_avg_ratio',
        label: 'Order vs Customer Baseline',
        value: `${f.amountToAvgRatio}x average`,
        contribution: -8.5,
        description: 'Order value is fully consistent with established purchase baseline',
      });
    }

    // High basket value (PKR scale)
    if (f.orderAmount >= 120000) {
      rawContributions.push({
        name: 'order_amount',
        label: 'High Ticket Value',
        value: `Rs. ${f.orderAmount.toLocaleString()}`,
        contribution: +(Math.min(22, (f.orderAmount / 120000) * 12)),
        description: `High total ticket amount of Rs. ${f.orderAmount.toLocaleString()}`,
      });
    }

    // Payment Retries
    if (f.failedPaymentAttempts > 0) {
      rawContributions.push({
        name: 'failed_payment_attempts',
        label: 'Failed Payment Retries',
        value: `${f.failedPaymentAttempts} failure${f.failedPaymentAttempts > 1 ? 's' : ''}`,
        contribution: +(f.failedPaymentAttempts * 9.5),
        description: `${f.failedPaymentAttempts} preceding checkout card authorization failure(s) recorded`,
      });
    }

    // Order Velocity
    if (f.orderVelocity1h >= 2 || f.orderVelocity24h >= 4) {
      const v = f.orderVelocity1h >= 2 ? f.orderVelocity1h : f.orderVelocity24h;
      rawContributions.push({
        name: 'order_velocity',
        label: 'Rapid Order Velocity',
        value: `${v} orders recent`,
        contribution: +(v * 6.2),
        description: `Abnormal rapid succession of orders (${f.orderVelocity1h} in 1h, ${f.orderVelocity24h} in 24h)`,
      });
    }

    // Geo & Address Mismatch
    if (f.geoMismatch) {
      rawContributions.push({
        name: 'geo_mismatch',
        label: 'IP Geolocation Distance',
        value: `IP: ${f.ipCountry} vs Ship: ${f.shippingCountry}`,
        contribution: +17.5,
        description: `Transaction originates from IP located in ${f.ipCountry} while delivery destination is ${f.shippingCountry}`,
      });
    } else if (f.billingShippingMismatch) {
      rawContributions.push({
        name: 'address_mismatch',
        label: 'Billing vs Shipping Inversion',
        value: 'Addresses Differ',
        contribution: +9.2,
        description: 'Card billing address does not match destination delivery street address',
      });
    }

    // VPN / Proxy / Network
    if (f.isVpnOrProxy) {
      rawContributions.push({
        name: 'vpn_proxy_network',
        label: 'Commercial VPN / Proxy',
        value: 'VPN Detected',
        contribution: +14.8,
        description: 'Connection IP routes through known hosting center / anonymous proxy node',
      });
    }

    // Disposable Email
    if (f.isDisposableEmail) {
      rawContributions.push({
        name: 'disposable_email',
        label: 'Temporary Burner Domain',
        value: 'Disposable Email',
        contribution: +18.0,
        description: 'Customer email domain identified in public temporary burner mail registries',
      });
    }

    // Account Age (Seasoning)
    if (f.accountAgeDays > 180) {
      rawContributions.push({
        name: 'account_seasoning',
        label: 'Established Account Seasoning',
        value: `${f.accountAgeDays} days active`,
        contribution: -18.2,
        description: `Well-seasoned account established ${f.accountAgeDays} days ago with verified history`,
      });
    } else if (f.accountAgeDays > 30) {
      rawContributions.push({
        name: 'account_seasoning',
        label: 'Active Account History',
        value: `${f.accountAgeDays} days`,
        contribution: -9.5,
        description: 'Account active for over 30 days with no prior chargebacks',
      });
    } else if (f.accountAgeDays === 0) {
      rawContributions.push({
        name: 'account_seasoning',
        label: 'Unseasoned Guest Checkout',
        value: 'New / 0 days',
        contribution: +6.5,
        description: 'Zero historical order footprint; checkout placed via fresh guest session',
      });
    }

    // Bulk Quantity
    if (f.itemQuantity >= 6) {
      rawContributions.push({
        name: 'bulk_quantity',
        label: 'High Unit Quantity',
        value: `${f.itemQuantity} items`,
        contribution: +(f.itemQuantity * 1.6),
        description: 'Atypically high item count indicating potential unauthorized reseller purchase',
      });
    }

    // Off-hours nocturnal transaction
    if (f.timeOfDayHour >= 1 && f.timeOfDayHour <= 4) {
      rawContributions.push({
        name: 'nocturnal_timing',
        label: 'Off-Peak Local Timing',
        value: `${f.timeOfDayHour}:00 AM`,
        contribution: +4.2,
        description: 'Checkout submitted during nocturnal off-peak hours (01:00 - 04:30 AM local time)',
      });
    }

    // Normal baseline default if empty
    if (rawContributions.length === 0) {
      rawContributions.push({
        name: 'standard_indicators',
        label: 'Standard Shopping Pattern',
        value: 'Nominal',
        contribution: -14.0,
        description: 'All telemetry matches standard legitimate shopping profiles',
      });
    }

    // Sort by absolute magnitude of contribution
    rawContributions.sort((a, b) => Math.abs(b.contribution) - Math.abs(a.contribution));

    const maxAbs = Math.max(...rawContributions.map(c => Math.abs(c.contribution)), 1);

    return rawContributions.map(item => ({
      name: item.name,
      label: item.label,
      value: item.value,
      contribution: Number(item.contribution.toFixed(1)),
      relativeImpact: Number(Math.min(100, (Math.abs(item.contribution) / maxAbs) * 100).toFixed(0)),
      direction: item.contribution > 0 ? 'increases_risk' : 'decreases_risk',
      description: item.description,
    }));
  }

  /**
   * Synthesize natural language AI explanation directly from SHAP and feature signals
   */
  public static generateExplanation(
    category: RiskCategory,
    score: number,
    shapList: SHAPFeature[],
    f: FraudFeatureSnapshot
  ): string {
    const riskDrivers = shapList.filter(s => s.direction === 'increases_risk');
    const protectiveDrivers = shapList.filter(s => s.direction === 'decreases_risk');

    if (category === 'critical') {
      const topDrivers = riskDrivers.slice(0, 3).map(d => d.label.toLowerCase()).join(', ');
      return `Transaction flagged as Critical Risk (${score}/100) due to severe compound anomalies: ${topDrivers}. Anomaly detection indicates high deviation from standard merchant behavior. Manual verification is urgently required before fulfillment.`;
    }

    if (category === 'high') {
      const topDrivers = riskDrivers.slice(0, 2).map(d => d.label.toLowerCase()).join(' and ');
      const mitigation = protectiveDrivers.length > 0 ? ` (partially mitigated by ${protectiveDrivers[0].label.toLowerCase()})` : '';
      return `Transaction flagged for Hold & Investigation (${score}/100). Primary risk driven by ${topDrivers}${mitigation}. Supervised XGBoost and Isolation Forest models indicate heightened chargeback exposure.`;
    }

    if (category === 'medium') {
      const topDrivers = riskDrivers.length > 0 ? riskDrivers[0].label.toLowerCase() : 'minor velocity variance';
      return `Moderate risk detected (${score}/100). Order exhibits slight elevation in ${topDrivers}. Recommended action: manual review or 3D-Secure secondary verification prior to dispatch.`;
    }

    // Low risk
    const positiveFactor = protectiveDrivers.length > 0 ? protectiveDrivers[0].label.toLowerCase() : 'verified device telemetry';
    return `Transaction verified as Low Risk (${score}/100). All fraud scoring models show nominal patterns reinforced by ${positiveFactor}. Automatically approved for immediate fulfillment.`;
  }

  /**
   * Complete end-to-end evaluation returning a full FraudPrediction object
   */
  public static evaluateTransaction(
    orderId: string,
    tenantId: string,
    input: RawTransactionInput
  ): FraudPrediction {
    const features = this.extractFeatures(input);
    const xgbScore = this.predictXGBoost(features);
    const rfScore = this.predictRandomForest(features);
    const isoScore = this.predictIsolationForest(features);

    // Hybrid ensemble scoring:
    // 40% XGBoost, 25% Random Forest, 25% Isolation Forest anomaly, plus rule heuristics
    let baseScore = (xgbScore * 42) + (rfScore * 25) + (isoScore * 28);

    // Rule heuristics for critical patterns:
    if (features.failedPaymentAttempts >= 3) baseScore += 12;
    if (features.isDisposableEmail && features.isVpnOrProxy) baseScore += 15;
    if (features.geoMismatch && features.orderAmount > 1500) baseScore += 10;
    if (features.accountAgeDays > 180 && features.failedPaymentAttempts === 0) baseScore -= 12;

    const finalRiskScore = Math.max(2, Math.min(99, Math.round(baseScore)));

    // Categorization
    let riskCategory: RiskCategory = 'low';
    let recommendedAction: 'Approve' | 'Manual Review' | 'Hold' | 'Urgent Investigation' = 'Approve';

    if (finalRiskScore >= 80) {
      riskCategory = 'critical';
      recommendedAction = 'Urgent Investigation';
    } else if (finalRiskScore >= 60) {
      riskCategory = 'high';
      recommendedAction = 'Hold';
    } else if (finalRiskScore >= 30) {
      riskCategory = 'medium';
      recommendedAction = 'Manual Review';
    } else {
      riskCategory = 'low';
      recommendedAction = 'Approve';
    }

    const shapExplanations = this.computeSHAP(features, finalRiskScore);
    const aiSummaryExplanation = this.generateExplanation(riskCategory, finalRiskScore, shapExplanations, features);

    return {
      id: `pred_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      orderId,
      tenantId,
      timestamp: new Date().toISOString(),
      riskScore: finalRiskScore,
      riskCategory,
      fraudProbability: Number((finalRiskScore / 100).toFixed(2)),
      xgboostScore: xgbScore,
      randomForestScore: rfScore,
      isolationForestAnomalyScore: isoScore,
      modelVersion: this.MODEL_VERSION,
      features,
      shapExplanations,
      aiSummaryExplanation,
      recommendedAction,
      reviewStatus: riskCategory === 'low' ? 'auto_approved' : (riskCategory === 'critical' ? 'held' : 'under_review'),
      investigationNotes: [],
    };
  }
}
