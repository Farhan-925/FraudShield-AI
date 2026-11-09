import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { PaymentMethodType } from '../../types';
import {
  Lock,
  ArrowLeft,
  Truck,
  CheckCircle2,
  ShieldCheck,
  Mail,
  User,
  Phone,
  MapPin,
  Building,
  CreditCard,
  ShoppingBag,
  Sparkles,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { getGmailWebComposeUrl, getMailtoUrl, buildOrderEmailPlainText } from '../../services/gmailService';

const PAKISTAN_CITIES = [
  'Lahore',
  'Karachi',
  'Islamabad',
  'Rawalpindi',
  'Faisalabad',
  'Multan',
  'Peshawar',
  'Sialkot',
  'Gujranwala',
  'Quetta',
  'Hyderabad',
  'Abbottabad',
  'Bahawalpur',
  'Sargodha',
];

export const CustomerCheckoutPage: React.FC = () => {
  const {
    cart,
    cartTotal,
    cartCount,
    customerSession,
    openCustomerAuthModal,
    logoutCustomer,
    submitCheckout,
    openStorefront,
    recentEmailNotification,
  } = useApp();

  const [fullName, setFullName] = useState(customerSession?.name || '');
  const [email, setEmail] = useState(customerSession?.email || '');
  const [phone, setPhone] = useState(customerSession?.phone || '');
  const [streetAddress, setStreetAddress] = useState('House 142, Sector Y, Phase 6, DHA');
  const [city, setCity] = useState('Lahore');
  const [postalCode, setPostalCode] = useState('54792');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>('Cash on Delivery (COD)');
  const [orderNotes, setOrderNotes] = useState('');

  // Automatically sync checkout form fields if customer signs in with their Gmail
  useEffect(() => {
    if (customerSession?.isLoggedIn) {
      if (customerSession.name) setFullName(customerSession.name);
      if (customerSession.email) setEmail(customerSession.email);
      if (customerSession.phone) setPhone(customerSession.phone);
    }
  }, [customerSession]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccessId, setOrderSuccessId] = useState<string | null>(null);

  const subtotal = cartTotal;
  const shippingFee = 0; // Free delivery across Pakistan for home decor
  const totalAmount = subtotal + shippingFee;

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) {
      alert('Your cart is empty. Please add items to checkout.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const result = submitCheckout({
        customerName: fullName,
        customerEmail: email,
        customerPhone: phone,
        shippingAddress: {
          fullName,
          street: streetAddress,
          city,
          state: city === 'Karachi' ? 'Sindh' : (city === 'Islamabad' ? 'Federal' : 'Punjab'),
          postalCode,
          country: 'PK',
        },
        billingAddress: {
          fullName,
          street: streetAddress,
          city,
          state: city === 'Karachi' ? 'Sindh' : (city === 'Islamabad' ? 'Federal' : 'Punjab'),
          postalCode,
          country: 'PK',
        },
        paymentMethod,
        failedPaymentAttempts: 0,
        isVpnOrProxy: false,
        ipCountry: 'PK',
      });

      setIsSubmitting(false);
      setOrderSuccessId(result.order.id);
    }, 1000);
  };

  if (orderSuccessId) {
    const customerComposeUrl = recentEmailNotification
      ? getGmailWebComposeUrl(
          recentEmailNotification.customerEmail || recentEmailNotification.recipientEmail,
          recentEmailNotification.subject,
          buildOrderEmailPlainText(recentEmailNotification, false)
        )
      : '';

    const adminComposeUrl = recentEmailNotification
      ? getGmailWebComposeUrl(
          'farhanayub915@gmail.com',
          recentEmailNotification.adminSubject,
          buildOrderEmailPlainText(recentEmailNotification, true)
        )
      : '';

    const customerMailto = recentEmailNotification
      ? getMailtoUrl(
          recentEmailNotification.customerEmail || recentEmailNotification.recipientEmail,
          recentEmailNotification.subject,
          buildOrderEmailPlainText(recentEmailNotification, false)
        )
      : '';

    const adminMailto = recentEmailNotification
      ? getMailtoUrl(
          'farhanayub915@gmail.com',
          recentEmailNotification.adminSubject,
          buildOrderEmailPlainText(recentEmailNotification, true)
        )
      : '';

    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-6 font-sans">
        <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-serif font-bold text-slate-900 dark:text-white">
            Shukriya! Order #{orderSuccessId} Confirmed
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto">
            Your Pakistani order has been successfully booked for <strong>{paymentMethod}</strong>.
          </p>
        </div>

        {/* 100% Free Email Dispatch Actions */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-left max-w-lg mx-auto space-y-4 shadow-sm">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-red-600" />
              <span className="font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-white">
                Free Gmail Order Receipts
              </span>
            </div>
            <span className="text-[10px] font-bold uppercase bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded-full">
              100% Free
            </span>
          </div>

          <p className="text-[11px] text-slate-500 leading-relaxed">
            Click below to instantly open the pre-filled order receipt in <strong>Gmail Web</strong> or your device's mail app without requiring any paid Google Cloud billing or account setup:
          </p>

          <div className="space-y-2.5 text-xs">
            {/* Customer Copy */}
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2">
              <div>
                <span className="text-[11px] text-slate-500 block">Customer Receipt:</span>
                <strong className="text-slate-800 dark:text-slate-200 font-mono text-xs">{email || 'Customer'}</strong>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <a
                  href={customerComposeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1.5 bg-[#EA4335] hover:bg-[#d93025] text-white rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors whitespace-nowrap"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open in Gmail</span>
                </a>
                <a
                  href={customerMailto}
                  className="px-2 py-1.5 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-semibold hover:bg-slate-300 transition-colors whitespace-nowrap"
                  title="Open in default mail client"
                >
                  <Mail className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Admin Copy */}
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2">
              <div>
                <span className="text-[11px] text-slate-500 block">Store Owner Alert (Farhan Ayub):</span>
                <strong className="text-slate-800 dark:text-slate-200 font-mono text-xs">farhanayub915@gmail.com</strong>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <a
                  href={adminComposeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors whitespace-nowrap"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Send to Admin</span>
                </a>
                <a
                  href={adminMailto}
                  className="px-2 py-1.5 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-semibold hover:bg-slate-300 transition-colors whitespace-nowrap"
                  title="Open in default mail client"
                >
                  <Mail className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-left max-w-lg mx-auto space-y-3 shadow-xs">
          <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-100 dark:border-slate-800">
            <span className="text-slate-500">Payment Option:</span>
            <span className="font-semibold text-slate-900 dark:text-white">{paymentMethod}</span>
          </div>
          <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-100 dark:border-slate-800">
            <span className="text-slate-500">Delivery Address:</span>
            <span className="font-semibold text-slate-900 dark:text-white">{streetAddress}, {city}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500">Total Payable:</span>
            <span className="font-mono text-base font-bold text-emerald-600 dark:text-emerald-400">
              Rs. {totalAmount.toLocaleString()}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-center gap-4 pt-4">
          <button
            onClick={openStorefront}
            className="px-6 py-3 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-semibold rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="font-sans text-slate-900 dark:text-slate-100 bg-[#FAF9F6] dark:bg-slate-950 min-h-screen pb-20">
      {/* Top Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
          <button
            onClick={openStorefront}
            className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Storefront</span>
          </button>

          <div className="flex items-center gap-2 text-xs font-semibold text-slate-800 dark:text-slate-200">
            <Lock className="w-3.5 h-3.5 text-emerald-600" />
            <span>Secure Pakistani Express Checkout</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Checkout Form (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Delivery Information Form */}
            <form id="checkout-form" onSubmit={handleSubmitOrder} className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
                <MapPin className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                <span>Delivery Address (Pakistan)</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                    Full Customer Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Fatima Noor"
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-slate-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                    Gmail / Email Address * (Order confirmation will be sent here)
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. yourname@gmail.com"
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-slate-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                    Pakistani Mobile Phone Number * (Required for COD Rider)
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="0300-1234567"
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-slate-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                    City (Pakistan) *
                  </label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white focus:outline-none"
                  >
                    {PAKISTAN_CITIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                    Street Address / House / Apartment / Sector *
                  </label>
                  <input
                    type="text"
                    required
                    value={streetAddress}
                    onChange={(e) => setStreetAddress(e.target.value)}
                    placeholder="e.g. House 142, Sector Y, Phase 6, DHA"
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-slate-500"
                  />
                </div>

                <div className="w-full sm:w-1/2">
                  <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                    Postal Code (ZIP)
                  </label>
                  <input
                    type="text"
                    required
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    placeholder="e.g. 54792"
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 text-xs font-mono text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Payment Methods */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                  <span>Select Payment Method</span>
                </h3>

                <div className="space-y-2 text-xs">
                  {/* Option 1: Cash on Delivery (COD) */}
                  <label
                    onClick={() => setPaymentMethod('Cash on Delivery (COD)')}
                    className={`flex items-start justify-between p-3.5 rounded-xl border cursor-pointer transition-colors ${
                      paymentMethod === 'Cash on Delivery (COD)'
                        ? 'border-slate-900 dark:border-white bg-slate-50 dark:bg-slate-800/80 ring-1 ring-slate-900 dark:ring-white'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={paymentMethod === 'Cash on Delivery (COD)'}
                        onChange={() => setPaymentMethod('Cash on Delivery (COD)')}
                        className="mt-0.5 text-slate-900"
                      />
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                          <span>Cash on Delivery (COD)</span>
                          <span className="text-[10px] font-bold uppercase bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 px-1.5 py-0.2 rounded">
                            Most Popular in Pakistan
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Inspect your furniture upon delivery and hand cash to the TCS / Leopards courier.
                        </p>
                      </div>
                    </div>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400 font-mono text-[11px]">
                      FREE Delivery
                    </span>
                  </label>

                  {/* Option 2: Online Card */}
                  <label
                    onClick={() => setPaymentMethod('Debit / Credit Card')}
                    className={`flex items-start justify-between p-3.5 rounded-xl border cursor-pointer transition-colors ${
                      paymentMethod === 'Debit / Credit Card'
                        ? 'border-slate-900 dark:border-white bg-slate-50 dark:bg-slate-800/80 ring-1 ring-slate-900 dark:ring-white'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={paymentMethod === 'Debit / Credit Card'}
                        onChange={() => setPaymentMethod('Debit / Credit Card')}
                        className="mt-0.5 text-slate-900"
                      />
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white">
                          Debit / Credit Card (Visa / Mastercard / PayPak)
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          3D-Secure encrypted card transaction via Pakistani banking switch.
                        </p>
                      </div>
                    </div>
                  </label>

                  {/* Option 3: JazzCash / EasyPaisa */}
                  <label
                    onClick={() => setPaymentMethod('JazzCash / EasyPaisa')}
                    className={`flex items-start justify-between p-3.5 rounded-xl border cursor-pointer transition-colors ${
                      paymentMethod === 'JazzCash / EasyPaisa'
                        ? 'border-slate-900 dark:border-white bg-slate-50 dark:bg-slate-800/80 ring-1 ring-slate-900 dark:ring-white'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={paymentMethod === 'JazzCash / EasyPaisa'}
                        onChange={() => setPaymentMethod('JazzCash / EasyPaisa')}
                        className="mt-0.5 text-slate-900"
                      />
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white">
                          JazzCash / EasyPaisa Mobile Account
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Instant mobile wallet debit with OTP authorization.
                        </p>
                      </div>
                    </div>
                  </label>
                </div>
              </div>
            </form>
          </div>

          {/* Right Order Summary & Confirm Button (5 cols) */}
          <div className="lg:col-span-5 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800">
              Order Summary ({cartCount} {cartCount === 1 ? 'item' : 'items'})
            </h3>

            {/* Cart Items */}
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {cart.map((item) => {
                const itemPrice = item.variant?.price ?? item.product.price;

                return (
                  <div key={`${item.product.id}-${item.variant?.id}`} className="flex gap-3 text-xs">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.title}
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=200&q=80';
                      }}
                      className="w-12 h-12 rounded-lg object-cover bg-neutral-100 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-slate-900 dark:text-white truncate">
                        {item.product.title}
                      </div>
                      {item.variant && (
                        <div className="text-[11px] text-slate-500">{item.variant.name}</div>
                      )}
                      <div className="flex items-center justify-between text-slate-600 dark:text-slate-400 mt-0.5">
                        <span>Qty: {item.quantity}</span>
                        <span className="font-mono font-semibold tabular-nums text-slate-900 dark:text-white">
                          Rs. {(itemPrice * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Calculations */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Subtotal</span>
                <span className="font-mono tabular-nums text-slate-900 dark:text-white font-semibold">
                  Rs. {subtotal.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Nationwide Courier Delivery</span>
                <span className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                  FREE (Complimentary)
                </span>
              </div>
              <div className="flex justify-between text-base font-bold text-slate-900 dark:text-white pt-2 border-t border-slate-100 dark:border-slate-800">
                <span>Total Amount Payable</span>
                <span className="font-mono tabular-nums text-emerald-600 dark:text-emerald-400">
                  Rs. {totalAmount.toLocaleString()}
                </span>
              </div>
              <div className="text-[11px] text-slate-500 text-right">
                All taxes included · No hidden charges
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              form="checkout-form"
              disabled={isSubmitting}
              className="w-full py-4 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-bold rounded-xl hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors flex items-center justify-center gap-2 shadow-md cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Screening Order with FraudShield AI...</span>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Confirm Order · Receive Confirmation on Gmail</span>
                </>
              )}
            </button>

            <div className="text-[11px] text-slate-500 text-center leading-normal">
              By confirming, you agree to receive order tracking updates via Gmail and SMS to your Pakistani phone number.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
