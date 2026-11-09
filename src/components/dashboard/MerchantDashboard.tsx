import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Order, OrderStatus, Product } from '../../types';
import { initialSubscriptionPlans } from '../../data/mockData';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  CreditCard,
  Plus,
  Search,
  Filter,
  Eye,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowUpRight,
  ShieldAlert,
  Boxes,
  TrendingUp,
  X,
  Edit,
  Trash2,
  Phone,
  Mail,
  MapPin,
  Truck,
  User,
  ShieldCheck,
  FileText,
} from 'lucide-react';

type TabType = 'overview' | 'orders' | 'products' | 'inventory' | 'subscription';

export const MerchantDashboard: React.FC = () => {
  const {
    currentTenant,
    currentTenantOrders,
    currentTenantProducts,
    predictions,
    createProduct,
    updateProduct,
    deleteProduct,
    updateOrderStatus,
    updateTenantPlan,
    setSelectedInvestigationOrderId,
    setViewMode,
  } = useApp();

  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');

  // Selected Order for Full Checkout Information Modal
  const [selectedOrderForDetail, setSelectedOrderForDetail] = useState<Order | null>(null);

  // Product Create Modal
  const [isCreateProductOpen, setIsCreateProductOpen] = useState(false);
  const [newProductForm, setNewProductForm] = useState({
    title: '',
    category: 'Furniture',
    price: 45000,
    stock: 12,
    sku: `DH-${Math.floor(100 + Math.random() * 900)}`,
    description: '',
  });

  // Calculate KPIs
  const totalRevenue = currentTenantOrders.reduce((sum, o) => sum + o.totalAmount, 0);
  const totalOrders = currentTenantOrders.length;
  const pendingOrders = currentTenantOrders.filter(o => o.orderStatus === 'pending').length;
  const lowStockProducts = currentTenantProducts.filter(p => p.stock <= 10);
  const currentPlan = initialSubscriptionPlans.find(p => p.id === currentTenant.planId) || initialSubscriptionPlans[1];

  // Filter orders
  const filteredOrders = currentTenantOrders.filter((o) => {
    const matchesSearch =
      o.id.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.customerName.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.customerEmail.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.customerPhone.toLowerCase().includes(orderSearch.toLowerCase());
    const matchesStatus = orderStatusFilter === 'all' || o.orderStatus === orderStatusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreateProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProductForm.title.trim()) return;

    createProduct({
      tenantId: currentTenant.id,
      title: newProductForm.title,
      slug: newProductForm.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description: newProductForm.description || 'High-end interior design piece.',
      category: newProductForm.category,
      price: Number(newProductForm.price),
      stock: Number(newProductForm.stock),
      sku: newProductForm.sku,
      rating: 5.0,
      reviewsCount: 1,
      images: ['/images/decor_ceramic_vases_1794114236202.jpg'],
      variants: [],
      published: true,
    });

    setIsCreateProductOpen(false);
    setNewProductForm({
      title: '',
      category: 'Furniture',
      price: 45000,
      stock: 12,
      sku: `DH-${Math.floor(100 + Math.random() * 900)}`,
      description: '',
    });
  };

  const handleRestock = (productId: string, currentStock: number) => {
    updateProduct(productId, { stock: currentStock + 10 });
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-6 sm:py-8 space-y-6 sm:space-y-8 font-sans">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 sm:pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700">
              <LayoutDashboard className="w-5 h-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              {currentTenant.name} Store Admin
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Shopify-style Pakistani catalog management, order fulfillment, customer details, and real-time fraud monitoring
          </p>
        </div>

        {/* Action button */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsCreateProductOpen(true)}
            className="w-full sm:w-auto px-4 py-2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-semibold rounded-xl hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors inline-flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Add New Product
          </button>
        </div>
      </div>

      {/* Tabs Navigation (Horizontal scrolling for mobile) */}
      <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl overflow-x-auto text-xs font-medium no-scrollbar">
        {[
          { id: 'overview', label: 'Overview', icon: LayoutDashboard },
          { id: 'orders', label: `Orders (${totalOrders})`, icon: ShoppingBag },
          { id: 'products', label: `Products (${currentTenantProducts.length})`, icon: Package },
          { id: 'inventory', label: `Inventory (${lowStockProducts.length} low)`, icon: Boxes },
          { id: 'subscription', label: `Subscription (${currentPlan.name})`, icon: CreditCard },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg whitespace-nowrap transition-colors cursor-pointer shrink-0 ${
                isActive
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-bold shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* KPI Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            <div className="p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
              <div className="text-xs text-slate-700 dark:text-slate-400 font-medium">Total Store Revenue</div>
              <div className="text-xl sm:text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white mt-1">
                Rs. {totalRevenue.toLocaleString()}
              </div>
              <div className="text-[11px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mt-1 font-medium">
                <TrendingUp className="w-3.5 h-3.5" />
                +14.8% in Pakistan
              </div>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
              <div className="text-xs text-slate-700 dark:text-slate-400 font-medium">Processed Orders</div>
              <div className="text-xl sm:text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white mt-1">
                {totalOrders}
              </div>
              <div className="text-[11px] text-slate-600 dark:text-slate-400 mt-1">
                {pendingOrders} awaiting fulfillment
              </div>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
              <div className="text-xs text-slate-700 dark:text-slate-400 font-medium">Catalog SKUs</div>
              <div className="text-xl sm:text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white mt-1">
                {currentTenantProducts.length}
              </div>
              <div className="text-[11px] text-orange-600 dark:text-orange-400 mt-1">
                {lowStockProducts.length} low stock warnings
              </div>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
              <div className="text-xs text-slate-700 dark:text-slate-400 font-medium">FastAPI Fraud Engine</div>
              <div className="text-xl sm:text-2xl font-bold font-mono tabular-nums text-rose-600 dark:text-rose-400 mt-1">
                Active
              </div>
              <div className="text-[11px] text-slate-600 dark:text-slate-400 mt-1">
                TreeSHAP v2.4 (Python)
              </div>
            </div>
          </div>

          {/* Recent Orders Section */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-xs space-y-4 p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Recent Store Orders
                </h3>
                <p className="text-xs text-slate-500">
                  Click any order to view all customer checkout details (Name, address, phone, COD status)
                </p>
              </div>
              <button
                onClick={() => setActiveTab('orders')}
                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
              >
                View all orders &rarr;
              </button>
            </div>

            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <table className="w-full text-left text-xs min-w-[650px]">
                <thead className="bg-slate-50 dark:bg-slate-950/70 border-b border-slate-200 dark:border-slate-800 text-slate-500 uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="px-4 py-3 font-medium">Order</th>
                    <th className="px-4 py-3 font-medium">Customer Details</th>
                    <th className="px-4 py-3 font-medium text-right">Total (PKR)</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Fraud Risk</th>
                    <th className="px-4 py-3 font-medium text-right">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {currentTenantOrders.slice(0, 5).map((order) => {
                    const pred = predictions[order.id];
                    const riskCategory = pred?.riskCategory ?? 'low';

                    return (
                      <tr
                        key={order.id}
                        onClick={() => setSelectedOrderForDetail(order)}
                        className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 cursor-pointer transition-colors"
                      >
                        <td className="px-4 py-3 font-mono font-semibold text-slate-900 dark:text-white">
                          {order.id}
                          <div className="text-[10px] text-slate-500 font-sans font-normal">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-semibold text-slate-900 dark:text-white">{order.customerName}</div>
                          <div className="text-[11px] text-slate-500 font-mono">{order.customerPhone}</div>
                        </td>
                        <td className="px-4 py-3 text-right font-mono tabular-nums font-semibold text-slate-900 dark:text-white">
                          Rs. {order.totalAmount.toLocaleString()}
                        </td>
                        <td className="px-4 py-3">
                          <span className="font-mono uppercase font-semibold text-[11px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
                            {order.orderStatus}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                            riskCategory === 'critical' ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300' :
                            riskCategory === 'high' ? 'bg-orange-100 dark:bg-orange-950 text-orange-700 dark:text-orange-300' :
                            riskCategory === 'medium' ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300' :
                            'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                          }`}>
                            {riskCategory} ({pred?.riskScore ?? 8})
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedOrderForDetail(order);
                            }}
                            className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-lg text-xs font-semibold inline-flex items-center gap-1 cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Inspect</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ORDERS (Comprehensive Table with Search, Filter & Detail Drawer) */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {/* Search & Filter Bar */}
          <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-wrap items-center justify-between gap-3 shadow-xs">
            <div className="relative flex-1 min-w-[220px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={orderSearch}
                onChange={(e) => setOrderSearch(e.target.value)}
                placeholder="Search by Order ID, Customer Name, Phone, or Gmail..."
                className="w-full pl-9 pr-4 py-2.5 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-slate-500"
              />
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-500">Status:</span>
              <select
                aria-label="Filter Orders by Status"
                value={orderStatusFilter}
                onChange={(e) => setOrderStatusFilter(e.target.value)}
                className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-slate-100 focus:outline-none"
              >
                <option value="all">All Statuses ({currentTenantOrders.length})</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {/* Table with mobile horizontal scroll */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs min-w-[780px]">
                <thead className="bg-slate-50 dark:bg-slate-950/70 border-b border-slate-200 dark:border-slate-800 text-slate-500 uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="px-5 py-3.5 font-medium">Order ID</th>
                    <th className="px-5 py-3.5 font-medium">Customer Details</th>
                    <th className="px-5 py-3.5 font-medium">Delivery Destination</th>
                    <th className="px-5 py-3.5 font-medium text-right">Total Amount</th>
                    <th className="px-5 py-3.5 font-medium">Fulfillment</th>
                    <th className="px-5 py-3.5 font-medium">Fraud Review</th>
                    <th className="px-5 py-3.5 font-medium text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredOrders.map((order) => {
                    const pred = predictions[order.id];
                    const riskCategory = pred?.riskCategory ?? 'low';

                    return (
                      <tr
                        key={order.id}
                        onClick={() => setSelectedOrderForDetail(order)}
                        className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 cursor-pointer transition-colors"
                      >
                        <td className="px-5 py-4 font-mono font-semibold text-slate-900 dark:text-white">
                          {order.id}
                          <div className="text-[10px] text-slate-500 font-sans font-normal">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          <div className="font-semibold text-slate-900 dark:text-white">{order.customerName}</div>
                          <div className="text-[11px] text-slate-500 font-mono">{order.customerEmail}</div>
                          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-mono font-medium">
                            {order.customerPhone}
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          <div className="text-slate-800 dark:text-slate-200 font-medium">
                            {order.shippingAddress.city}, Pakistan
                          </div>
                          <div className="text-[10px] text-slate-500 truncate max-w-[180px]">
                            {order.shippingAddress.street}
                          </div>
                        </td>

                        <td className="px-5 py-4 text-right font-mono tabular-nums font-semibold text-slate-900 dark:text-white">
                          Rs. {order.totalAmount.toLocaleString()}
                        </td>

                        <td className="px-5 py-4" onClick={(e) => e.stopPropagation()}>
                          <select
                            aria-label="Update Order Fulfillment Status"
                            value={order.orderStatus}
                            onChange={(e) => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                            className="bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg px-2 py-1 text-xs font-mono font-semibold cursor-pointer"
                          >
                            <option value="pending">PENDING</option>
                            <option value="confirmed">CONFIRMED</option>
                            <option value="processing">PROCESSING</option>
                            <option value="shipped">SHIPPED</option>
                            <option value="delivered">DELIVERED</option>
                            <option value="cancelled">CANCELLED</option>
                          </select>
                        </td>

                        <td className="px-5 py-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                            riskCategory === 'critical' ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300' :
                            riskCategory === 'high' ? 'bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300' :
                            riskCategory === 'medium' ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300' :
                            'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                          }`}>
                            {order.fraudReviewStatus.replace('_', ' ')}
                          </span>
                        </td>

                        <td className="px-5 py-4 text-right">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedOrderForDetail(order);
                            }}
                            className="px-3 py-1.5 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-lg text-xs font-semibold hover:bg-slate-800 transition-colors inline-flex items-center gap-1 cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>View All Details</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: PRODUCTS */}
      {activeTab === 'products' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
              Pakistani Catalog Products &amp; SKUs ({currentTenantProducts.length})
            </h3>
            <button
              onClick={() => setIsCreateProductOpen(true)}
              className="px-3.5 py-2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-semibold rounded-xl hover:bg-slate-800 inline-flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Product
            </button>
          </div>

          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs min-w-[650px]">
                <thead className="bg-slate-50 dark:bg-slate-950/70 border-b border-slate-200 dark:border-slate-800 text-slate-500 uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="px-5 py-3.5 font-medium">Product</th>
                    <th className="px-5 py-3.5 font-medium">Category</th>
                    <th className="px-5 py-3.5 font-medium">SKU</th>
                    <th className="px-5 py-3.5 font-medium text-right">Price (PKR)</th>
                    <th className="px-5 py-3.5 font-medium text-right">Stock</th>
                    <th className="px-5 py-3.5 font-medium">Status</th>
                    <th className="px-5 py-3.5 font-medium text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {currentTenantProducts.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                      <td className="px-5 py-3.5 flex items-center gap-3">
                        <img
                          src={p.images[0]}
                          alt={p.title}
                          onError={(e) => {
                            e.currentTarget.src = 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=400&q=80';
                          }}
                          className="w-10 h-10 rounded-lg object-cover bg-neutral-100 shrink-0"
                        />
                        <div>
                          <div className="font-semibold text-slate-900 dark:text-white line-clamp-1">
                            {p.title}
                          </div>
                          <div className="text-[10px] text-slate-500">
                            {p.variants.length} variant{p.variants.length > 1 ? 's' : ''}
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-3.5 text-slate-700 dark:text-slate-300">
                        {p.category}
                      </td>

                      <td className="px-5 py-3.5 font-mono text-slate-600 dark:text-slate-400">
                        {p.sku}
                      </td>

                      <td className="px-5 py-3.5 text-right font-mono tabular-nums font-semibold text-slate-900 dark:text-white">
                        Rs. {p.price.toLocaleString()}
                      </td>

                      <td className="px-5 py-3.5 text-right font-mono tabular-nums">
                        <span className={p.stock <= 10 ? 'text-orange-600 dark:text-orange-400 font-bold' : 'text-slate-900 dark:text-white'}>
                          {p.stock} units
                        </span>
                      </td>

                      <td className="px-5 py-3.5">
                        <span className="text-emerald-700 dark:text-emerald-400 text-[11px] font-semibold">
                          Published
                        </span>
                      </td>

                      <td className="px-5 py-3.5 text-right">
                        <button
                          onClick={() => deleteProduct(p.id)}
                          className="p-1 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                          title="Delete Product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: INVENTORY */}
      {activeTab === 'inventory' && (
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
              Inventory Stock &amp; Warehouse Tracking
            </h3>
            <p className="text-xs text-slate-500">
              Track variant units, low-stock alerts, and perform transactional restocks
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs min-w-[600px]">
                <thead className="bg-slate-50 dark:bg-slate-950/70 border-b border-slate-200 dark:border-slate-800 text-slate-500 uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="px-5 py-3.5 font-medium">Item &amp; SKU</th>
                    <th className="px-5 py-3.5 font-medium text-right">Current Stock</th>
                    <th className="px-5 py-3.5 font-medium">Stock Status</th>
                    <th className="px-5 py-3.5 font-medium text-right">Restock Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {currentTenantProducts.map((p) => {
                    const isLow = p.stock <= 10;
                    return (
                      <tr key={p.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                        <td className="px-5 py-3.5">
                          <div className="font-semibold text-slate-900 dark:text-white">{p.title}</div>
                          <div className="text-[10px] text-slate-500 font-mono">SKU: {p.sku}</div>
                        </td>
                        <td className="px-5 py-3.5 text-right font-mono font-bold tabular-nums">
                          {p.stock} units
                        </td>
                        <td className="px-5 py-3.5">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            isLow ? 'bg-orange-100 dark:bg-orange-950 text-orange-700 dark:text-orange-300' : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                          }`}>
                            {isLow ? 'LOW STOCK ALERT' : 'HEALTHY'}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          <button
                            onClick={() => handleRestock(p.id, p.stock)}
                            className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-lg text-xs font-semibold cursor-pointer"
                          >
                            +10 Units
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: SUBSCRIPTION */}
      {activeTab === 'subscription' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-2">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              SaaS Multi-Tenant Tier &amp; ML Quota
            </h3>
            <p className="text-xs text-slate-500">
              Active Tier: <strong className="text-slate-900 dark:text-white">{currentPlan.name}</strong> · Real-time inference with FastAPI Python core.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {initialSubscriptionPlans.map((plan) => {
              const isCurrent = plan.id === currentTenant.planId;
              return (
                <div
                  key={plan.id}
                  className={`p-6 rounded-2xl border flex flex-col justify-between space-y-6 ${
                    isCurrent
                      ? 'border-indigo-600 dark:border-indigo-500 bg-indigo-50/30 dark:bg-indigo-950/20 shadow-md ring-1 ring-indigo-600'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'
                  }`}
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-base font-bold text-slate-900 dark:text-white">{plan.name}</h4>
                      {isCurrent && (
                        <span className="text-[10px] font-bold uppercase bg-slate-900 text-white dark:bg-white dark:text-slate-900 px-2 py-0.5 rounded">
                          Current
                        </span>
                      )}
                    </div>

                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">
                        Rs. {(plan.monthlyPrice * 280).toLocaleString()}
                      </span>
                      <span className="text-xs text-slate-500">/ month</span>
                    </div>

                    <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                      {plan.features.map((f, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    disabled={isCurrent}
                    onClick={() => updateTenantPlan(currentTenant.id, plan.id)}
                    className={`w-full py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                      isCurrent
                        ? 'bg-slate-200 dark:bg-slate-800 text-slate-500 cursor-not-allowed'
                        : 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 hover:bg-slate-800 cursor-pointer'
                    }`}
                  >
                    {isCurrent ? 'Current Plan' : `Upgrade to ${plan.name}`}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* FULL ORDER DETAILS MODAL (Admin inspection of all customer checkout data) */}
      {selectedOrderForDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-3xl w-full my-6 overflow-hidden shadow-2xl flex flex-col font-sans max-h-[92vh]">
            {/* Modal Header */}
            <div className="px-5 sm:px-6 py-4 bg-slate-950 text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-950/80 text-emerald-400 border border-emerald-800 flex items-center justify-center">
                  <ShoppingBag className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-bold">
                      Order Details: {selectedOrderForDetail.id}
                    </h2>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 uppercase">
                      {selectedOrderForDetail.orderStatus}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Placed on {new Date(selectedOrderForDetail.createdAt).toLocaleString()} · Pakistani Express Dispatch
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedOrderForDetail(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-5 sm:p-6 space-y-6 overflow-y-auto text-xs text-slate-700 dark:text-slate-300">
              {/* Section 1: Customer Information that he filled in checkout */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
                  <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
                    <User className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Customer Information (Filled at Checkout)</span>
                  </h3>
                  <span className="text-[10px] text-slate-500 font-mono">
                    Payment: {selectedOrderForDetail.paymentMethod}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <span className="text-slate-500 block text-[11px]">Customer Full Name:</span>
                    <strong className="text-slate-900 dark:text-white text-sm">
                      {selectedOrderForDetail.customerName}
                    </strong>
                  </div>

                  <div>
                    <span className="text-slate-500 block text-[11px]">Gmail / Email:</span>
                    <strong className="text-slate-900 dark:text-white font-mono break-all">
                      {selectedOrderForDetail.customerEmail}
                    </strong>
                  </div>

                  <div>
                    <span className="text-slate-500 block text-[11px]">Pakistani Mobile Phone:</span>
                    <strong className="text-emerald-600 dark:text-emerald-400 font-mono text-sm">
                      {selectedOrderForDetail.customerPhone}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Section 2: Complete Delivery Address */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
                    <MapPin className="w-3.5 h-3.5 text-rose-500" />
                    <span>Shipping Address (Pakistan)</span>
                  </div>
                  <p className="text-xs text-slate-800 dark:text-slate-200 font-medium">
                    {selectedOrderForDetail.shippingAddress.street}
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-400 font-mono">
                    {selectedOrderForDetail.shippingAddress.city}, {selectedOrderForDetail.shippingAddress.state} - {selectedOrderForDetail.shippingAddress.postalCode}
                  </p>
                  <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium pt-1">
                    Country: Pakistan (PK)
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
                    <Truck className="w-3.5 h-3.5 text-amber-500" />
                    <span>Courier &amp; COD Dispatch</span>
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-400">
                    Courier Partner: <strong className="text-slate-900 dark:text-white">TCS Express Pakistan</strong>
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-400">
                    Tracking Number: <strong className="font-mono text-slate-900 dark:text-white">{selectedOrderForDetail.trackingNumber || 'TCS-PK-98214502'}</strong>
                  </div>
                  <div className="text-xs text-amber-800 dark:text-amber-300 font-medium pt-1">
                    Collection Mode: {selectedOrderForDetail.paymentMethod}
                  </div>
                </div>
              </div>

              {/* Section 3: Ordered Products Breakdown */}
              <div className="space-y-2">
                <h3 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider">
                  Ordered Items ({selectedOrderForDetail.items.length})
                </h3>
                <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-semibold text-[11px]">
                      <tr>
                        <th className="p-3">Product Item</th>
                        <th className="p-3">SKU</th>
                        <th className="p-3 text-center">Qty</th>
                        <th className="p-3 text-right">Price</th>
                        <th className="p-3 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {selectedOrderForDetail.items.map((item, idx) => (
                        <tr key={idx}>
                          <td className="p-3 font-medium text-slate-900 dark:text-white flex items-center gap-2">
                            <img
                              src={item.image}
                              alt={item.productTitle}
                              onError={(e) => {
                                e.currentTarget.src = 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=200&q=80';
                              }}
                              className="w-8 h-8 rounded object-cover bg-neutral-100 shrink-0"
                            />
                            <div>
                              <div className="line-clamp-1">{item.productTitle}</div>
                              {item.variantName && (
                                <div className="text-[10px] text-slate-500">{item.variantName}</div>
                              )}
                            </div>
                          </td>
                          <td className="p-3 font-mono text-[11px] text-slate-500">
                            {item.sku}
                          </td>
                          <td className="p-3 text-center font-mono">
                            {item.quantity}
                          </td>
                          <td className="p-3 text-right font-mono tabular-nums">
                            Rs. {item.price.toLocaleString()}
                          </td>
                          <td className="p-3 text-right font-mono font-semibold tabular-nums text-slate-900 dark:text-white">
                            Rs. {(item.price * item.quantity).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                      <tr className="bg-slate-50 dark:bg-slate-950/70 font-semibold">
                        <td colSpan={4} className="p-3 text-right">Subtotal:</td>
                        <td className="p-3 text-right font-mono tabular-nums">Rs. {selectedOrderForDetail.subtotal.toLocaleString()}</td>
                      </tr>
                      <tr className="bg-slate-50 dark:bg-slate-950/70">
                        <td colSpan={4} className="p-3 text-right text-slate-500">Nationwide Delivery:</td>
                        <td className="p-3 text-right font-mono text-emerald-600 font-semibold">
                          {selectedOrderForDetail.shippingFee === 0 ? 'FREE' : `Rs. ${selectedOrderForDetail.shippingFee.toLocaleString()}`}
                        </td>
                      </tr>
                      <tr className="bg-slate-100 dark:bg-slate-950 font-bold text-slate-900 dark:text-white text-sm">
                        <td colSpan={4} className="p-3 text-right">Total Payable Amount:</td>
                        <td className="p-3 text-right font-mono text-emerald-600 dark:text-emerald-400">
                          Rs. {selectedOrderForDetail.totalAmount.toLocaleString()}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Section 4: Fast Fulfillment & Fraud Link */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-800 dark:text-slate-200 text-xs">
                    Update Order Status:
                  </span>
                  <select
                    value={selectedOrderForDetail.orderStatus}
                    onChange={(e) => {
                      const newStatus = e.target.value as OrderStatus;
                      updateOrderStatus(selectedOrderForDetail.id, newStatus);
                      setSelectedOrderForDetail({ ...selectedOrderForDetail, orderStatus: newStatus });
                    }}
                    className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1 text-xs font-semibold cursor-pointer"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <button
                  onClick={() => {
                    setSelectedInvestigationOrderId(selectedOrderForDetail.id);
                    setSelectedOrderForDetail(null);
                    setViewMode('fraud_hub');
                  }}
                  className="px-3 py-1.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 text-rose-700 dark:text-rose-300 rounded-lg text-xs font-semibold hover:bg-rose-100 transition-colors flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
                >
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>Inspect in FastAPI Fraud Hub</span>
                </button>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3.5 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex justify-end">
              <button
                onClick={() => setSelectedOrderForDetail(null)}
                className="px-4 py-2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-semibold rounded-lg hover:bg-slate-800 cursor-pointer"
              >
                Close Order Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      {isCreateProductOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 space-y-4 border border-slate-200 dark:border-slate-800 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Add New Catalog Product
              </h3>
              <button onClick={() => setIsCreateProductOpen(false)}>
                <X className="w-5 h-5 text-slate-400 hover:text-slate-700 cursor-pointer" />
              </button>
            </div>

            <form onSubmit={handleCreateProductSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1">Product Title</label>
                <input
                  type="text"
                  required
                  value={newProductForm.title}
                  onChange={(e) => setNewProductForm({ ...newProductForm, title: e.target.value })}
                  placeholder="e.g. Swat Teak Wooden Console"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1">Category</label>
                  <select
                    value={newProductForm.category}
                    onChange={(e) => setNewProductForm({ ...newProductForm, category: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 text-xs"
                  >
                    <option value="Furniture">Furniture</option>
                    <option value="Lighting">Lighting</option>
                    <option value="Mirrors">Mirrors</option>
                    <option value="Vases & Accessories">Vases &amp; Accessories</option>
                    <option value="Rugs & Carpets">Rugs &amp; Carpets</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1">SKU</label>
                  <input
                    type="text"
                    required
                    value={newProductForm.sku}
                    onChange={(e) => setNewProductForm({ ...newProductForm, sku: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 text-xs font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1">Price (PKR Rs.)</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={newProductForm.price}
                    onChange={(e) => setNewProductForm({ ...newProductForm, price: Number(e.target.value) })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1">Initial Stock</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={newProductForm.stock}
                    onChange={(e) => setNewProductForm({ ...newProductForm, stock: Number(e.target.value) })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={newProductForm.description}
                  onChange={(e) => setNewProductForm({ ...newProductForm, description: e.target.value })}
                  placeholder="Artisanal woodwork, finish, dimensions..."
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 text-xs"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateProductOpen(false)}
                  className="px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-xl text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-semibold rounded-xl text-xs cursor-pointer"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
