import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  AuditLog,
  CartItem,
  CustomerAddress,
  EmailNotification,
  FraudAlert,
  FraudPrediction,
  FraudReviewStatus,
  Order,
  OrderStatus,
  PaymentMethodType,
  Product,
  Tenant,
  UserRole,
  AppViewMode,
} from '../types';
import {
  buildInitialPredictions,
  initialAuditLogs,
  initialProducts,
  initialTenants,
} from '../data/mockData';
import { FraudEngine, RawTransactionInput } from '../services/fraudEngine';

export interface CustomerSession {
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  isLoggedIn: boolean;
}

interface AppContextType {
  tenants: Tenant[];
  currentTenant: Tenant;
  setCurrentTenantId: (tenantId: string) => void;
  viewMode: AppViewMode;
  setViewMode: (mode: AppViewMode) => void;
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;

  // Admin Authentication State
  isAdminLoggedIn: boolean;
  adminLogin: (email: string, pass: string) => { success: boolean; error?: string };
  adminLogout: () => void;

  // Customer Account & Gmail Login
  customerSession: CustomerSession | null;
  isCustomerAuthModalOpen: boolean;
  openCustomerAuthModal: () => void;
  closeCustomerAuthModal: () => void;
  loginCustomerWithGmail: (email?: string, name?: string, phone?: string) => void;
  logoutCustomer: () => void;

  // Navigation helpers
  selectedProduct: Product | null;
  openProductPage: (product: Product) => void;
  openCheckoutPage: () => void;
  openStorefront: () => void;
  openAdmin: () => void;

  // Email Notification for Order Confirmation
  recentEmailNotification: EmailNotification | null;
  dismissEmailNotification: () => void;
  
  // Products & Store
  products: Product[];
  currentTenantProducts: Product[];
  createProduct: (product: Omit<Product, 'id' | 'createdAt'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  
  // Shopping Cart
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, variantId?: string) => void;
  removeFromCart: (productId: string, variantId?: string) => void;
  updateCartQuantity: (productId: string, quantity: number, variantId?: string) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;

  // Orders & Fraud
  orders: Order[];
  currentTenantOrders: Order[];
  predictions: Record<string, FraudPrediction>;
  alerts: FraudAlert[];
  currentTenantAlerts: FraudAlert[];
  unreadAlertCount: number;
  markAlertRead: (alertId: string) => void;
  auditLogs: AuditLog[];
  
  // Actions
  submitCheckout: (checkoutData: {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    shippingAddress: CustomerAddress;
    billingAddress: CustomerAddress;
    paymentMethod: PaymentMethodType;
    failedPaymentAttempts?: number;
    isVpnOrProxy?: boolean;
    ipCountry?: string;
  }) => { order: Order; prediction: FraudPrediction; emailNotification: EmailNotification };

  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  reviewFraudOrder: (
    orderId: string,
    action: 'approve_legitimate' | 'confirm_fraud' | 'hold_order' | 'release_order',
    noteText?: string
  ) => void;
  addInvestigationNote: (orderId: string, noteText: string) => void;

  // Tenant / Super Admin Management
  toggleTenantStatus: (tenantId: string) => void;
  updateTenantPlan: (tenantId: string, planId: 'starter' | 'professional' | 'enterprise') => void;

  // Selected Order for quick inspection modal
  selectedInvestigationOrderId: string | null;
  setSelectedInvestigationOrderId: (id: string | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tenants, setTenants] = useState<Tenant[]>(initialTenants);
  const [currentTenantId, setCurrentTenantId] = useState<string>('decor-haus');
  const [viewMode, setViewMode] = useState<AppViewMode>('storefront');
  const [currentRole, setCurrentRole] = useState<UserRole>('customer');
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [cart, setCart] = useState<CartItem[]>([]);
  
  // Admin authentication (Defaults to logged out)
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('fs_admin_auth') === 'true';
    } catch {
      return false;
    }
  });

  // Customer session (Guest by default, can log in via their own Gmail)
  const [customerSession, setCustomerSession] = useState<CustomerSession | null>(() => {
    try {
      const saved = sessionStorage.getItem('fs_customer_session');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [isCustomerAuthModalOpen, setIsCustomerAuthModalOpen] = useState(false);

  // Selected product for product detail page
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Email notification popup
  const [recentEmailNotification, setRecentEmailNotification] = useState<EmailNotification | null>(null);

  const [initialData] = useState(() => buildInitialPredictions());
  const [orders, setOrders] = useState<Order[]>(initialData.orders);
  const [predictions, setPredictions] = useState<Record<string, FraudPrediction>>(() => {
    const map: Record<string, FraudPrediction> = {};
    initialData.predictions.forEach(p => { map[p.orderId] = p; });
    return map;
  });
  const [alerts, setAlerts] = useState<FraudAlert[]>(initialData.alerts);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(initialAuditLogs);
  const [selectedInvestigationOrderId, setSelectedInvestigationOrderId] = useState<string | null>(null);

  const currentTenant = tenants.find(t => t.id === currentTenantId) || tenants[0];
  const currentTenantProducts = products.filter(p => p.tenantId === currentTenantId);
  const currentTenantOrders = orders.filter(o => o.tenantId === currentTenantId);
  const currentTenantAlerts = alerts.filter(a => a.tenantId === currentTenantId);
  const unreadAlertCount = currentTenantAlerts.filter(a => !a.read).length;

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotal = cart.reduce((acc, item) => {
    const itemPrice = item.variant?.price ?? item.product.price;
    return acc + (itemPrice * item.quantity);
  }, 0);

  // Sync URL hash or pathname for `/admin`
  useEffect(() => {
    const checkPath = () => {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      if (path === '/admin' || hash === '#/admin' || hash === '#admin') {
        if (isAdminLoggedIn) {
          setViewMode('merchant_dashboard');
          setCurrentRole('super_admin');
        } else {
          setViewMode('admin_login');
        }
      }
    };

    checkPath();
    window.addEventListener('popstate', checkPath);
    return () => window.removeEventListener('popstate', checkPath);
  }, [isAdminLoggedIn]);

  // Admin Login Handler
  const adminLogin = (email: string, pass: string): { success: boolean; error?: string } => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = pass.trim();

    // Specific admin requirement: farhanayub915@gmail.com / farhan123
    if (cleanEmail === 'farhanayub915@gmail.com' && cleanPass === 'farhan123') {
      setIsAdminLoggedIn(true);
      setCurrentRole('super_admin');
      setViewMode('merchant_dashboard');
      try {
        sessionStorage.setItem('fs_admin_auth', 'true');
      } catch {}

      setAuditLogs(prev => [
        {
          id: `audit_${Date.now()}`,
          tenantId: currentTenantId,
          actor: 'Farhan Ayub (Administrator)',
          role: 'super_admin',
          action: 'ADMIN_LOGIN_SUCCESS',
          target: 'farhanayub915@gmail.com',
          details: 'Secure authentication to FraudShield AI Admin Portal granted.',
          timestamp: new Date().toISOString(),
        },
        ...prev,
      ]);

      return { success: true };
    }

    setAuditLogs(prev => [
      {
        id: `audit_${Date.now()}`,
        tenantId: currentTenantId,
        actor: cleanEmail || 'Unknown IP',
        role: 'unauthorized',
        action: 'ADMIN_LOGIN_DENIED',
        target: cleanEmail,
        details: 'Failed admin credentials. Access blocked by security gateway.',
        timestamp: new Date().toISOString(),
      },
      ...prev,
    ]);

    return {
      success: false,
      error: 'Access Denied: Only authorized administrator farhanayub915@gmail.com with password farhan123 can access admin dashboards.',
    };
  };

  const adminLogout = () => {
    setIsAdminLoggedIn(false);
    setCurrentRole('customer');
    setViewMode('storefront');
    try {
      sessionStorage.removeItem('fs_admin_auth');
    } catch {}
    if (window.location.pathname === '/admin' || window.location.hash.includes('admin')) {
      window.history.pushState({}, '', '/');
    }
  };

  const openCustomerAuthModal = () => setIsCustomerAuthModalOpen(true);
  const closeCustomerAuthModal = () => setIsCustomerAuthModalOpen(false);

  // Customer Gmail Login - supports any customer logging in with their own Gmail
  const loginCustomerWithGmail = (email = 'customer@gmail.com', name?: string, phone?: string) => {
    const cleanEmail = email.trim();
    const cleanName =
      name?.trim() ||
      cleanEmail.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
    const cleanPhone = phone?.trim() || '0300-1234567';

    const session: CustomerSession = {
      name: cleanName,
      email: cleanEmail,
      phone: cleanPhone,
      isLoggedIn: true,
    };

    setCustomerSession(session);
    try {
      sessionStorage.setItem('fs_customer_session', JSON.stringify(session));
    } catch {}
    setIsCustomerAuthModalOpen(false);
  };

  const logoutCustomer = () => {
    setCustomerSession(null);
    try {
      sessionStorage.removeItem('fs_customer_session');
    } catch {}
  };

  // Navigation helpers
  const openProductPage = (product: Product) => {
    setSelectedProduct(product);
    setViewMode('product_detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openCheckoutPage = () => {
    setViewMode('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openStorefront = () => {
    setViewMode('storefront');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openAdmin = () => {
    if (isAdminLoggedIn) {
      setViewMode('merchant_dashboard');
      setCurrentRole('super_admin');
    } else {
      setViewMode('admin_login');
    }
    window.history.pushState({}, '', '/admin');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const dismissEmailNotification = () => {
    setRecentEmailNotification(null);
  };

  // Cart Handlers
  const addToCart = (product: Product, quantity = 1, variantId?: string) => {
    setCart(prev => {
      const variant = variantId ? product.variants.find(v => v.id === variantId) : product.variants[0];
      const existingIndex = prev.findIndex(item => 
        item.product.id === product.id && item.variant?.id === variant?.id
      );

      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: next[existingIndex].quantity + quantity,
        };
        return next;
      }

      return [...prev, { product, variant, quantity }];
    });
  };

  const removeFromCart = (productId: string, variantId?: string) => {
    setCart(prev => prev.filter(item => !(item.product.id === productId && item.variant?.id === variantId)));
  };

  const updateCartQuantity = (productId: string, quantity: number, variantId?: string) => {
    if (quantity <= 0) {
      removeFromCart(productId, variantId);
      return;
    }
    setCart(prev => prev.map(item => {
      if (item.product.id === productId && item.variant?.id === variantId) {
        return { ...item, quantity };
      }
      return item;
    }));
  };

  const clearCart = () => setCart([]);

  // Product CRUD
  const createProduct = (newProd: Omit<Product, 'id' | 'createdAt'>) => {
    const created: Product = {
      ...newProd,
      id: `prod_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString(),
    };
    setProducts(prev => [created, ...prev]);

    setAuditLogs(prev => [
      {
        id: `audit_${Date.now()}`,
        tenantId: currentTenantId,
        actor: 'Farhan Ayub (Store Admin)',
        role: currentRole,
        action: 'CREATE_PRODUCT',
        target: created.sku,
        details: `Created new catalog product "${created.title}" at Rs. ${created.price.toLocaleString()}`,
        timestamp: new Date().toISOString(),
      },
      ...prev,
    ]);
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  // Submit Checkout and Trigger Real-time Fraud Engine
  const submitCheckout = (checkoutData: {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    shippingAddress: CustomerAddress;
    billingAddress: CustomerAddress;
    paymentMethod: PaymentMethodType;
    failedPaymentAttempts?: number;
    isVpnOrProxy?: boolean;
    ipCountry?: string;
  }) => {
    const newOrderId = `ORD-PK-${Math.floor(10000 + Math.random() * 90000)}`;
    const subtotal = cartTotal;
    // Free delivery across Pakistan on orders over Rs. 30,000, else standard Rs. 1,500 courier fee
    const shippingFee = subtotal > 30000 ? 0 : 1500.0;
    const tax = 0.0;
    const totalAmount = Number((subtotal + shippingFee + tax).toFixed(2));

    const orderItems = cart.map(item => ({
      productId: item.product.id,
      productTitle: item.product.title,
      variantName: item.variant?.name,
      sku: item.variant?.sku || item.product.sku,
      price: item.variant?.price ?? item.product.price,
      quantity: item.quantity,
      image: item.product.images[0] || '',
    }));

    // Run Fraud Engine in FastAPI-compatible microservice pipeline
    const rawInput: RawTransactionInput = {
      orderAmount: totalAmount,
      customerAvgAmount: 35000.0,
      accountAgeDays: customerSession?.isLoggedIn ? 90 : (checkoutData.customerEmail.includes('temp') ? 0 : 15),
      orderVelocity24h: 1,
      orderVelocity1h: 1,
      failedPaymentAttempts: checkoutData.failedPaymentAttempts ?? 0,
      billingAddressCountry: checkoutData.billingAddress.country || 'PK',
      shippingAddressCountry: checkoutData.shippingAddress.country || 'PK',
      billingAddressStreet: checkoutData.billingAddress.street,
      shippingAddressStreet: checkoutData.shippingAddress.street,
      ipCountry: checkoutData.ipCountry || 'PK',
      itemQuantity: cartCount,
      timeOfDayHour: new Date().getHours(),
      isDisposableEmail: checkoutData.customerEmail.includes('temp') || checkoutData.customerEmail.includes('sharklasers') || checkoutData.customerEmail.includes('burner'),
      isVpnOrProxy: Boolean(checkoutData.isVpnOrProxy),
    };

    const prediction = FraudEngine.evaluateTransaction(newOrderId, currentTenantId, rawInput);

    let initialOrderStatus: OrderStatus = 'pending';
    let initialFraudStatus: FraudReviewStatus = 'auto_approved';

    if (prediction.riskCategory === 'critical') {
      initialOrderStatus = 'pending';
      initialFraudStatus = 'held';
    } else if (prediction.riskCategory === 'high') {
      initialOrderStatus = 'pending';
      initialFraudStatus = 'held';
    } else if (prediction.riskCategory === 'medium') {
      initialOrderStatus = 'pending';
      initialFraudStatus = 'under_review';
    } else {
      initialOrderStatus = 'confirmed';
      initialFraudStatus = 'auto_approved';
    }

    const trackingNumber = `TCS-PK-${Math.floor(10000000 + Math.random() * 90000000)}`;

    const newOrder: Order = {
      id: newOrderId,
      tenantId: currentTenantId,
      customerName: checkoutData.customerName,
      customerEmail: checkoutData.customerEmail,
      customerPhone: checkoutData.customerPhone,
      items: orderItems,
      subtotal,
      shippingFee,
      tax,
      discount: 0,
      totalAmount,
      shippingAddress: checkoutData.shippingAddress,
      billingAddress: checkoutData.billingAddress,
      paymentMethod: checkoutData.paymentMethod,
      orderStatus: initialOrderStatus,
      fraudReviewStatus: initialFraudStatus,
      fraudPredictionId: prediction.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      trackingNumber,
    };

    // Construct Gmail Notification for Customer & Store Admin (Farhan Ayub)
    const emailNotification: EmailNotification = {
      id: `email_${Date.now()}`,
      recipientEmail: checkoutData.customerEmail,
      recipientName: checkoutData.customerName,
      customerEmail: checkoutData.customerEmail,
      customerPhone: checkoutData.customerPhone,
      subject: `Order Confirmed: ${newOrderId} · ${currentTenant.name}`,
      orderId: newOrderId,
      totalAmountPKR: totalAmount,
      paymentMethod: checkoutData.paymentMethod,
      itemsSummary: orderItems.map(i => ({
        title: `${i.productTitle}${i.variantName ? ` (${i.variantName})` : ''}`,
        quantity: i.quantity,
        pricePKR: i.price,
        sku: i.sku,
      })),
      shippingAddress: `${checkoutData.shippingAddress.street}, ${checkoutData.shippingAddress.city}, ${checkoutData.shippingAddress.state} - ${checkoutData.shippingAddress.postalCode}, Pakistan`,
      trackingNumber,
      sentAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      riskScore: prediction.riskScore,
      riskCategory: prediction.riskCategory,
      adminEmail: 'farhanayub915@gmail.com',
      adminSubject: `🚨 New Order Received: ${newOrderId} (Rs. ${totalAmount.toLocaleString()}) · ${checkoutData.customerName}`,
    };

    // Update state
    setOrders(prev => [newOrder, ...prev]);
    setPredictions(prev => ({ ...prev, [newOrderId]: prediction }));
    setRecentEmailNotification(emailNotification);
    clearCart();

    // If High or Critical, generate Alert and Audit log
    if (prediction.riskCategory === 'critical' || prediction.riskCategory === 'high') {
      const alert: FraudAlert = {
        id: `alt_${Date.now()}`,
        tenantId: currentTenantId,
        orderId: newOrderId,
        riskScore: prediction.riskScore,
        severity: prediction.riskCategory === 'critical' ? 'critical' : 'warning',
        title: `${prediction.riskCategory.toUpperCase()} Risk Alert: COD Transaction`,
        message: `Order ${newOrderId} (Rs. ${totalAmount.toLocaleString()}) received risk score ${prediction.riskScore}/100. ${prediction.aiSummaryExplanation}`,
        timestamp: new Date().toISOString(),
        read: false,
      };
      setAlerts(prev => [alert, ...prev]);

      setAuditLogs(prev => [
        {
          id: `audit_${Date.now()}`,
          tenantId: currentTenantId,
          actor: 'FastAPI FraudShield Core',
          role: 'system',
          action: 'FLAG_TRANSACTION',
          target: newOrderId,
          details: `Risk Score: ${prediction.riskScore}/100 (${prediction.riskCategory}). Placed on hold for Farhan Ayub review.`,
          timestamp: new Date().toISOString(),
        },
        ...prev,
      ]);
    } else {
      setAuditLogs(prev => [
        {
          id: `audit_${Date.now()}`,
          tenantId: currentTenantId,
          actor: 'FastAPI FraudShield Core',
          role: 'system',
          action: 'AUTO_APPROVE',
          target: newOrderId,
          details: `Risk Score: ${prediction.riskScore}/100. Dispatched to courier with COD tracking ${trackingNumber}.`,
          timestamp: new Date().toISOString(),
        },
        ...prev,
      ]);
    }

    return { order: newOrder, prediction, emailNotification };
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, orderStatus: status, updatedAt: new Date().toISOString() } : o));
    setAuditLogs(prev => [
      {
        id: `audit_${Date.now()}`,
        tenantId: currentTenantId,
        actor: 'Farhan Ayub (Admin)',
        role: currentRole,
        action: 'UPDATE_ORDER_STATUS',
        target: orderId,
        details: `Updated order fulfillment state to ${status.toUpperCase()}`,
        timestamp: new Date().toISOString(),
      },
      ...prev,
    ]);
  };

  const reviewFraudOrder = (
    orderId: string,
    action: 'approve_legitimate' | 'confirm_fraud' | 'hold_order' | 'release_order',
    noteText?: string
  ) => {
    let newFraudStatus: FraudReviewStatus = 'under_review';
    let newOrderStatus: OrderStatus | undefined;
    let actionLabel = '';

    if (action === 'approve_legitimate') {
      newFraudStatus = 'false_positive';
      newOrderStatus = 'confirmed';
      actionLabel = 'MARK_LEGITIMATE';
    } else if (action === 'confirm_fraud') {
      newFraudStatus = 'confirmed_fraud';
      newOrderStatus = 'cancelled';
      actionLabel = 'CONFIRM_FRAUD';
    } else if (action === 'hold_order') {
      newFraudStatus = 'held';
      actionLabel = 'HOLD_ORDER';
    } else if (action === 'release_order') {
      newFraudStatus = 'clear';
      newOrderStatus = 'processing';
      actionLabel = 'RELEASE_ORDER';
    }

    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        return {
          ...o,
          fraudReviewStatus: newFraudStatus,
          orderStatus: newOrderStatus ?? o.orderStatus,
          updatedAt: new Date().toISOString(),
        };
      }
      return o;
    }));

    setPredictions(prev => {
      const currentPred = prev[orderId];
      if (!currentPred) return prev;
      const updatedNotes = noteText ? [
        ...currentPred.investigationNotes,
        {
          id: `note_${Date.now()}`,
          author: 'Farhan Ayub (Admin)',
          role: 'super_admin',
          text: noteText,
          timestamp: new Date().toISOString(),
        },
      ] : currentPred.investigationNotes;

      return {
        ...prev,
        [orderId]: {
          ...currentPred,
          reviewStatus: newFraudStatus,
          decisionBy: 'Farhan Ayub (farhanayub915@gmail.com)',
          decisionTimestamp: new Date().toISOString(),
          investigationNotes: updatedNotes,
        },
      };
    });

    setAuditLogs(prev => [
      {
        id: `audit_${Date.now()}`,
        tenantId: currentTenantId,
        actor: 'Farhan Ayub',
        role: 'super_admin',
        action: actionLabel,
        target: orderId,
        details: noteText || `Updated fraud review status to ${newFraudStatus}`,
        timestamp: new Date().toISOString(),
      },
      ...prev,
    ]);
  };

  const addInvestigationNote = (orderId: string, noteText: string) => {
    if (!noteText.trim()) return;
    setPredictions(prev => {
      const pred = prev[orderId];
      if (!pred) return prev;
      return {
        ...prev,
        [orderId]: {
          ...pred,
          investigationNotes: [
            ...pred.investigationNotes,
            {
              id: `note_${Date.now()}`,
              author: 'Farhan Ayub (Admin)',
              role: 'super_admin',
              text: noteText.trim(),
              timestamp: new Date().toISOString(),
            },
          ],
        },
      };
    });
  };

  const markAlertRead = (alertId: string) => {
    setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, read: true } : a));
  };

  const toggleTenantStatus = (tenantId: string) => {
    setTenants(prev => prev.map(t => {
      if (t.id === tenantId) {
        const nextStatus = t.status === 'active' ? 'suspended' : 'active';
        return { ...t, status: nextStatus };
      }
      return t;
    }));
  };

  const updateTenantPlan = (tenantId: string, planId: 'starter' | 'professional' | 'enterprise') => {
    setTenants(prev => prev.map(t => t.id === tenantId ? { ...t, planId } : t));
  };

  return (
    <AppContext.Provider
      value={{
        tenants,
        currentTenant,
        setCurrentTenantId,
        viewMode,
        setViewMode,
        currentRole,
        setCurrentRole,
        isAdminLoggedIn,
        adminLogin,
        adminLogout,
        customerSession,
        isCustomerAuthModalOpen,
        openCustomerAuthModal,
        closeCustomerAuthModal,
        loginCustomerWithGmail,
        logoutCustomer,
        selectedProduct,
        openProductPage,
        openCheckoutPage,
        openStorefront,
        openAdmin,
        recentEmailNotification,
        dismissEmailNotification,
        products,
        currentTenantProducts,
        createProduct,
        updateProduct,
        deleteProduct,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartCount,
        cartTotal,
        orders,
        currentTenantOrders,
        predictions,
        alerts,
        currentTenantAlerts,
        unreadAlertCount,
        markAlertRead,
        auditLogs,
        submitCheckout,
        updateOrderStatus,
        reviewFraudOrder,
        addInvestigationNote,
        toggleTenantStatus,
        updateTenantPlan,
        selectedInvestigationOrderId,
        setSelectedInvestigationOrderId,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
