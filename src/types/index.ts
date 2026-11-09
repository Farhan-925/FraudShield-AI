export type UserRole = 
  | 'super_admin'
  | 'merchant_owner'
  | 'merchant_admin'
  | 'fraud_analyst'
  | 'order_manager'
  | 'product_manager'
  | 'customer';

export type AppViewMode = 
  | 'storefront'
  | 'product_detail'
  | 'checkout'
  | 'merchant_dashboard'
  | 'fraud_hub'
  | 'simulator'
  | 'super_admin'
  | 'admin_login';

export type PaymentMethodType = 
  | 'Cash on Delivery (COD)'
  | 'Debit / Credit Card'
  | 'JazzCash / EasyPaisa';

export interface EmailNotification {
  id: string;
  recipientEmail: string;
  recipientName: string;
  subject: string;
  orderId: string;
  totalAmountPKR: number;
  paymentMethod: PaymentMethodType;
  itemsSummary: Array<{ title: string; quantity: number; pricePKR: number; sku?: string }>;
  shippingAddress: string;
  customerPhone?: string;
  customerEmail?: string;
  trackingNumber: string;
  sentAt: string;
  riskScore?: number;
  riskCategory?: string;
  adminEmail: string; // farhanayub915@gmail.com
  adminSubject: string;
}

export type RiskCategory = 'low' | 'medium' | 'high' | 'critical';

export type OrderStatus = 
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refunded';

export type FraudReviewStatus = 
  | 'clear'
  | 'under_review'
  | 'held'
  | 'confirmed_fraud'
  | 'false_positive'
  | 'auto_approved';

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  category: string;
  currency: string;
  logo: string;
  planId: 'starter' | 'professional' | 'enterprise';
  status: 'active' | 'suspended';
  createdAt: string;
  monthlyOrderCount: number;
  monthlyOrderLimit: number;
  fraudScreeningActive: boolean;
  contactEmail: string;
}

export interface ProductVariant {
  id: string;
  name: string;
  sku: string;
  price: number;
  stock: number;
  attributes: {
    finish?: string;
    size?: string;
    material?: string;
  };
}

export interface Product {
  id: string;
  tenantId: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  price: number;
  compareAtPrice?: number;
  images: string[];
  stock: number;
  sku: string;
  rating: number;
  reviewsCount: number;
  variants: ProductVariant[];
  isFeatured?: boolean;
  isNewArrival?: boolean;
  published: boolean;
  createdAt: string;
}

export interface CartItem {
  product: Product;
  variant?: ProductVariant;
  quantity: number;
}

export interface CustomerAddress {
  fullName: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface Customer {
  id: string;
  tenantId: string;
  name: string;
  email: string;
  phone: string;
  accountAgeDays: number;
  totalSpent: number;
  totalOrders: number;
  avgOrderValue: number;
  shippingAddress: CustomerAddress;
  billingAddress: CustomerAddress;
  createdAt: string;
  riskRating: 'trusted' | 'neutral' | 'flagged';
}

export interface SHAPFeature {
  name: string;
  label: string;
  value: string | number;
  contribution: number; // positive increases risk, negative decreases risk
  relativeImpact: number; // 0 to 100 for bar rendering
  direction: 'increases_risk' | 'decreases_risk';
  description: string;
}

export interface FraudFeatureSnapshot {
  orderAmount: number;
  amountToAvgRatio: number;
  accountAgeDays: number;
  orderVelocity24h: number;
  orderVelocity1h: number;
  failedPaymentAttempts: number;
  billingShippingMismatch: boolean;
  ipCountry: string;
  shippingCountry: string;
  geoMismatch: boolean;
  deviceFingerprint: string;
  deviceAnomalyScore: number;
  itemQuantity: number;
  timeOfDayHour: number;
  isDisposableEmail: boolean;
  isVpnOrProxy: boolean;
}

export interface FraudPrediction {
  id: string;
  orderId: string;
  tenantId: string;
  timestamp: string;
  riskScore: number; // 0 - 100
  riskCategory: RiskCategory;
  fraudProbability: number; // 0.00 - 1.00
  xgboostScore: number; // 0.00 - 1.00
  randomForestScore: number; // 0.00 - 1.00
  isolationForestAnomalyScore: number; // -1.0 to 1.0 or 0 to 100
  modelVersion: string;
  features: FraudFeatureSnapshot;
  shapExplanations: SHAPFeature[];
  aiSummaryExplanation: string;
  recommendedAction: 'Approve' | 'Manual Review' | 'Hold' | 'Urgent Investigation';
  reviewStatus: FraudReviewStatus;
  investigationNotes: Array<{
    id: string;
    author: string;
    role: string;
    text: string;
    timestamp: string;
  }>;
  decisionBy?: string;
  decisionTimestamp?: string;
}

export interface OrderItem {
  productId: string;
  productTitle: string;
  variantName?: string;
  sku: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Order {
  id: string;
  tenantId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  tax: number;
  discount: number;
  totalAmount: number;
  shippingAddress: CustomerAddress;
  billingAddress: CustomerAddress;
  paymentMethod: PaymentMethodType;
  orderStatus: OrderStatus;
  fraudReviewStatus: FraudReviewStatus;
  fraudPredictionId: string;
  createdAt: string;
  updatedAt: string;
  trackingNumber?: string;
}

export interface FraudAlert {
  id: string;
  tenantId: string;
  orderId: string;
  riskScore: number;
  severity: 'warning' | 'critical';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export interface SubscriptionPlan {
  id: 'starter' | 'professional' | 'enterprise';
  name: string;
  monthlyPrice: number;
  annualPrice: number;
  maxMonthlyOrders: number;
  maxStaffAccounts: number;
  features: string[];
  fraudModelTier: 'Basic Rules' | 'XGBoost + SHAP' | 'Enterprise Hybrid + Custom Rules';
  supportTier: string;
}

export interface AuditLog {
  id: string;
  tenantId?: string;
  actor: string;
  role: string;
  action: string;
  target: string;
  details: string;
  timestamp: string;
}
