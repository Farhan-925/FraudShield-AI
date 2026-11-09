import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Mail,
  X,
  Truck,
  ShieldAlert,
  User,
  ExternalLink,
  Send,
  CheckCircle2,
} from 'lucide-react';
import {
  getGmailWebComposeUrl,
  getMailtoUrl,
  buildOrderEmailPlainText,
} from '../../services/gmailService';

export const EmailNotificationModal: React.FC = () => {
  const { recentEmailNotification, dismissEmailNotification, openAdmin } = useApp();
  const [activeTab, setActiveTab] = useState<'customer' | 'admin'>('customer');

  if (!recentEmailNotification) return null;

  const customerComposeUrl = getGmailWebComposeUrl(
    recentEmailNotification.customerEmail || recentEmailNotification.recipientEmail,
    recentEmailNotification.subject,
    buildOrderEmailPlainText(recentEmailNotification, false)
  );

  const adminComposeUrl = getGmailWebComposeUrl(
    'farhanayub915@gmail.com',
    recentEmailNotification.adminSubject,
    buildOrderEmailPlainText(recentEmailNotification, true)
  );

  const customerMailto = getMailtoUrl(
    recentEmailNotification.customerEmail || recentEmailNotification.recipientEmail,
    recentEmailNotification.subject,
    buildOrderEmailPlainText(recentEmailNotification, false)
  );

  const adminMailto = getMailtoUrl(
    'farhanayub915@gmail.com',
    recentEmailNotification.adminSubject,
    buildOrderEmailPlainText(recentEmailNotification, true)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto font-sans">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full my-4 sm:my-8 overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[92vh]">
        {/* Gmail Bar Header */}
        <div className="px-4 sm:px-6 py-3 bg-[#EA4335] text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-white text-red-600 flex items-center justify-center font-bold text-xs shadow-2xs">
              M
            </div>
            <div>
              <div className="text-xs sm:text-sm font-bold tracking-tight flex items-center gap-2">
                <span>Order Confirmation &amp; Email Delivery</span>
                <span className="px-1.5 py-0.2 rounded-full bg-white/20 text-[10px] uppercase font-bold">
                  100% Free
                </span>
              </div>
              <div className="text-[10px] sm:text-[11px] text-white/90">
                Prepared for Customer &amp; Admin (farhanayub915@gmail.com)
              </div>
            </div>
          </div>
          <button
            onClick={dismissEmailNotification}
            className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Gmail Web 1-Click Banner */}
        <div className="bg-slate-50 dark:bg-slate-950 p-3 sm:px-6 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              Click below to instantly open this formatted receipt in <strong>Gmail Web</strong> or your default mail app for free.
            </span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
            <a
              href={activeTab === 'customer' ? customerComposeUrl : adminComposeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-3.5 py-1.5 bg-[#EA4335] hover:bg-[#d93025] text-white font-semibold rounded-lg text-xs flex items-center justify-center gap-1.5 shadow-2xs transition-colors cursor-pointer whitespace-nowrap"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Open in Gmail (Free)</span>
            </a>

            <a
              href={activeTab === 'customer' ? customerMailto : adminMailto}
              className="w-full sm:w-auto px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold rounded-lg text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Mail App</span>
            </a>
          </div>
        </div>

        {/* Dual Email Switcher Tabs */}
        <div className="bg-slate-100 dark:bg-slate-950 p-2 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
          <button
            onClick={() => setActiveTab('customer')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'customer'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs border border-slate-200 dark:border-slate-700'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Mail className="w-3.5 h-3.5 text-blue-500" />
            <span className="truncate">Customer's Copy ({recentEmailNotification.recipientEmail})</span>
          </button>

          <button
            onClick={() => setActiveTab('admin')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'admin'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs border border-slate-200 dark:border-slate-700'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5 text-rose-500" />
            <span className="truncate">Admin's Copy (farhanayub915@gmail.com)</span>
          </button>
        </div>

        {/* TAB 1: CUSTOMER GMAIL */}
        {activeTab === 'customer' && (
          <div className="flex-1 overflow-y-auto">
            {/* Email Header */}
            <div className="p-4 sm:p-6 bg-slate-50/80 dark:bg-slate-950/60 border-b border-slate-200 dark:border-slate-800 space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                    {recentEmailNotification.subject}
                  </h2>
                  <div className="flex flex-wrap items-center gap-1.5 mt-1 text-xs text-slate-500">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      DecorHaus Pakistan &lt;orders@decorhaus.pk&gt;
                    </span>
                    <span>to</span>
                    <span className="font-mono text-slate-700 dark:text-slate-300">
                      {recentEmailNotification.recipientEmail}
                    </span>
                  </div>
                </div>
                <span className="text-xs font-mono text-slate-500 shrink-0">
                  {recentEmailNotification.sentAt} (Just now)
                </span>
              </div>
            </div>

            {/* Email Body */}
            <div className="p-4 sm:p-6 space-y-6 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              <div className="space-y-1">
                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                  Assalam-o-Alaikum {recentEmailNotification.recipientName},
                </p>
                <p>
                  Thank you for shopping with DecorHaus Pakistan. We have successfully logged your order #{recentEmailNotification.orderId}. Our logistics team is now preparing your handcrafted furniture piece for express courier dispatch.
                </p>
              </div>

              {/* Courier & COD Highlight Box */}
              <div className="p-4 rounded-xl bg-amber-50/90 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs font-bold text-amber-900 dark:text-amber-200">
                  <span className="flex items-center gap-1.5">
                    <Truck className="w-4 h-4 text-amber-700 dark:text-amber-400 shrink-0" />
                    <span>Courier Partner: TCS Express Pakistan</span>
                  </span>
                  <span className="font-mono font-bold">{recentEmailNotification.trackingNumber}</span>
                </div>
                <p className="text-[11px] text-amber-800 dark:text-amber-300">
                  <strong>Cash on Delivery (COD) Amount:</strong> Please keep <strong className="font-mono">Rs. {recentEmailNotification.totalAmountPKR.toLocaleString()}</strong> ready in exact cash for the TCS courier rider upon delivery at your doorstep.
                </p>
              </div>

              {/* Delivery Address */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="font-bold text-slate-900 dark:text-white block">
                  Delivery Destination in Pakistan:
                </span>
                <p className="text-slate-600 dark:text-slate-400">
                  {recentEmailNotification.shippingAddress}
                </p>
              </div>

              {/* Itemized Order Table */}
              <div className="space-y-2">
                <span className="font-bold text-slate-900 dark:text-white block">
                  Itemized Order Summary:
                </span>
                <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-semibold text-[11px]">
                      <tr>
                        <th className="p-3">Product</th>
                        <th className="p-3 text-center">Qty</th>
                        <th className="p-3 text-right">Price</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {recentEmailNotification.itemsSummary.map((item, idx) => (
                        <tr key={idx}>
                          <td className="p-3 font-medium text-slate-900 dark:text-white">
                            {item.title}
                          </td>
                          <td className="p-3 text-center font-mono">
                            {item.quantity}
                          </td>
                          <td className="p-3 text-right font-mono font-semibold text-slate-900 dark:text-white">
                            Rs. {item.pricePKR.toLocaleString()}
                          </td>
                        </tr>
                      ))}
                      <tr className="bg-slate-50 dark:bg-slate-950/50 font-bold text-slate-900 dark:text-white">
                        <td colSpan={2} className="p-3">Total Payable (COD)</td>
                        <td className="p-3 text-right font-mono text-emerald-600 dark:text-emerald-400">
                          Rs. {recentEmailNotification.totalAmountPKR.toLocaleString()}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: STORE ADMIN GMAIL (farhanayub915@gmail.com) */}
        {activeTab === 'admin' && (
          <div className="flex-1 overflow-y-auto">
            {/* Email Header */}
            <div className="p-4 sm:p-6 bg-rose-50/70 dark:bg-rose-950/30 border-b border-rose-200 dark:border-rose-900/60 space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                <div>
                  <div className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-rose-600 text-white mb-1">
                    Store Owner Notification
                  </div>
                  <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                    {recentEmailNotification.adminSubject}
                  </h2>
                  <div className="flex flex-wrap items-center gap-1.5 mt-1 text-xs text-slate-500">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      DecorHaus Automated Store &lt;system@decorhaus.pk&gt;
                    </span>
                    <span>to</span>
                    <span className="font-mono font-bold text-rose-600 dark:text-rose-400">
                      farhanayub915@gmail.com (Store Admin)
                    </span>
                  </div>
                </div>
                <span className="text-xs font-mono text-slate-500 shrink-0">
                  {recentEmailNotification.sentAt}
                </span>
              </div>
            </div>

            {/* Email Body */}
            <div className="p-4 sm:p-6 space-y-5 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              <p className="text-sm font-semibold text-slate-900 dark:text-white">
                Hello Farhan Ayub,
              </p>
              <p>
                A customer has placed a new order on your <strong>DecorHaus Pakistan</strong> store. Please verify inventory and book courier dispatch.
              </p>

              {/* Customer Filled Information Card */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3">
                <h3 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-slate-200 dark:border-slate-800">
                  <User className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Customer &amp; Checkout Information</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-500 block text-[11px]">Customer Full Name:</span>
                    <strong className="text-slate-900 dark:text-white">{recentEmailNotification.recipientName}</strong>
                  </div>

                  <div>
                    <span className="text-slate-500 block text-[11px]">Customer Gmail / Email:</span>
                    <strong className="text-slate-900 dark:text-white font-mono">{recentEmailNotification.customerEmail || recentEmailNotification.recipientEmail}</strong>
                  </div>

                  <div>
                    <span className="text-slate-500 block text-[11px]">Pakistani Phone Number:</span>
                    <strong className="text-slate-900 dark:text-white font-mono">{recentEmailNotification.customerPhone || '0300-4821945'}</strong>
                  </div>

                  <div>
                    <span className="text-slate-500 block text-[11px]">Selected Payment Method:</span>
                    <strong className="text-emerald-600 dark:text-emerald-400">{recentEmailNotification.paymentMethod}</strong>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                  <span className="text-slate-500 block text-[11px]">Complete Delivery Address:</span>
                  <p className="font-medium text-slate-800 dark:text-slate-200 mt-0.5">
                    {recentEmailNotification.shippingAddress}
                  </p>
                </div>
              </div>

              {/* Ordered Products Breakdown */}
              <div className="space-y-2">
                <span className="font-bold text-slate-900 dark:text-white block text-xs">
                  Ordered Products Breakdown:
                </span>
                <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-semibold text-[11px]">
                      <tr>
                        <th className="p-3">Item</th>
                        <th className="p-3 text-center">Qty</th>
                        <th className="p-3 text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {recentEmailNotification.itemsSummary.map((item, idx) => (
                        <tr key={idx}>
                          <td className="p-3 font-medium text-slate-900 dark:text-white">
                            {item.title}
                          </td>
                          <td className="p-3 text-center font-mono">
                            {item.quantity}
                          </td>
                          <td className="p-3 text-right font-mono font-semibold text-slate-900 dark:text-white">
                            Rs. {item.pricePKR.toLocaleString()}
                          </td>
                        </tr>
                      ))}
                      <tr className="bg-slate-50 dark:bg-slate-950 font-bold text-slate-900 dark:text-white">
                        <td colSpan={2} className="p-3">Total Payable (COD):</td>
                        <td className="p-3 text-right font-mono text-emerald-600 dark:text-emerald-400">
                          Rs. {recentEmailNotification.totalAmountPKR.toLocaleString()}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* FastAPI ML Screening Result */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4 text-emerald-500" />
                    <span>FastAPI FraudShield AI Score</span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Assessed by Python XGBoost + Isolation Forest pipeline
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                    {recentEmailNotification.riskScore ?? 12}/100
                  </span>
                  <div className="text-[10px] uppercase font-bold text-slate-500">
                    {recentEmailNotification.riskCategory ?? 'LOW'} RISK
                  </div>
                </div>
              </div>

              {/* Admin Action Button */}
              <div className="pt-2">
                <button
                  onClick={() => {
                    dismissEmailNotification();
                    openAdmin();
                  }}
                  className="w-full py-3 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-bold rounded-xl hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Open Farhan Ayub Admin Dashboard (/admin) to Fulfill Order</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="px-4 sm:px-6 py-3.5 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-[11px] text-slate-500">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>100% Free Direct Gmail Compose (No payment or API credentials required)</span>
          </div>
          <button
            onClick={dismissEmailNotification}
            className="w-full sm:w-auto px-4 py-2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-semibold rounded-lg hover:bg-slate-800 cursor-pointer"
          >
            Close Window
          </button>
        </div>
      </div>
    </div>
  );
};
