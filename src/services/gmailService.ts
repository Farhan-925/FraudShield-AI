import { EmailNotification } from '../types';

/**
 * 100% FREE Gmail Web Compose Link generator
 * Requires NO API keys, NO Google Cloud billing, NO paid plans.
 * Directly opens Gmail Web with pre-filled recipient, subject, and body.
 */
export const getGmailWebComposeUrl = (to: string, subject: string, bodyText: string): string => {
  const encodedTo = encodeURIComponent(to);
  const encodedSubject = encodeURIComponent(subject);
  const encodedBody = encodeURIComponent(bodyText);
  return `https://mail.google.com/mail/?view=cm&fs=1&to=${encodedTo}&su=${encodedSubject}&body=${encodedBody}`;
};

/**
 * Standard 100% Free mailto protocol for default mail apps on iOS, Android, macOS, Windows
 */
export const getMailtoUrl = (to: string, subject: string, bodyText: string): string => {
  const encodedSubject = encodeURIComponent(subject);
  const encodedBody = encodeURIComponent(bodyText);
  return `mailto:${to}?subject=${encodedSubject}&body=${encodedBody}`;
};

export const buildOrderEmailHtml = (notification: EmailNotification, isForAdmin = false): string => {
  const itemsRows = notification.itemsSummary
    .map(
      (item) => `
      <tr style="border-bottom: 1px solid #e2e8f0;">
        <td style="padding: 10px 0; font-family: sans-serif; font-size: 13px; color: #1e293b;">
          <strong>${item.title}</strong>
        </td>
        <td style="padding: 10px 0; text-align: center; font-family: monospace; font-size: 13px; color: #475569;">
          x${item.quantity}
        </td>
        <td style="padding: 10px 0; text-align: right; font-family: monospace; font-size: 13px; font-weight: bold; color: #0f172a;">
          Rs. ${(item.pricePKR * item.quantity).toLocaleString()}
        </td>
      </tr>
    `
    )
    .join('');

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
      <div style="background: #0f172a; padding: 24px; text-align: center; color: #ffffff;">
        <h1 style="margin: 0; font-family: Georgia, serif; font-size: 24px; letter-spacing: 0.5px;">DecorHaus Pakistan</h1>
        <p style="margin: 6px 0 0; font-size: 12px; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px;">
          ${isForAdmin ? 'Store Administration Order Notification' : 'Official Order Confirmation & Invoice'}
        </p>
      </div>

      <div style="padding: 24px;">
        ${
          isForAdmin
            ? `<div style="background: #f0fdf4; border: 1px solid #bbf7d0; padding: 14px; border-radius: 8px; margin-bottom: 20px;">
                <p style="margin: 0; font-size: 13px; color: #166534; font-weight: bold;">
                  New Customer Order Alert for Farhan Ayub (farhanayub915@gmail.com)
                </p>
                <p style="margin: 4px 0 0; font-size: 12px; color: #15803d;">
                  Order <strong>${notification.orderId}</strong> was placed by <strong>${notification.recipientName}</strong>.
                </p>
              </div>`
            : `<div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 14px; border-radius: 8px; margin-bottom: 20px;">
                <p style="margin: 0; font-size: 14px; color: #0f172a; font-weight: bold;">
                  Shukriya, ${notification.recipientName}!
                </p>
                <p style="margin: 4px 0 0; font-size: 12px; color: #475569;">
                  Your order <strong>${notification.orderId}</strong> has been received and booked with TCS Express.
                </p>
              </div>`
        }

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <tr>
            <td style="font-size: 12px; color: #64748b; padding: 4px 0;">Order Number:</td>
            <td style="font-size: 12px; font-weight: bold; color: #0f172a; text-align: right; font-family: monospace;">${notification.orderId}</td>
          </tr>
          <tr>
            <td style="font-size: 12px; color: #64748b; padding: 4px 0;">Courier Tracking:</td>
            <td style="font-size: 12px; font-weight: bold; color: #059669; text-align: right; font-family: monospace;">${notification.trackingNumber}</td>
          </tr>
          <tr>
            <td style="font-size: 12px; color: #64748b; padding: 4px 0;">Payment Method:</td>
            <td style="font-size: 12px; font-weight: bold; color: #0f172a; text-align: right;">${notification.paymentMethod}</td>
          </tr>
          <tr>
            <td style="font-size: 12px; color: #64748b; padding: 4px 0;">Customer Contact:</td>
            <td style="font-size: 12px; color: #0f172a; text-align: right;">${notification.customerEmail || notification.recipientEmail} (${notification.customerPhone || 'N/A'})</td>
          </tr>
          <tr>
            <td style="font-size: 12px; color: #64748b; padding: 4px 0;">Delivery Address:</td>
            <td style="font-size: 12px; color: #0f172a; text-align: right;">${notification.shippingAddress}</td>
          </tr>
        </table>

        <h3 style="font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; color: #475569; margin: 20px 0 10px; border-bottom: 1px solid #e2e8f0; padding-bottom: 6px;">
          Ordered Items
        </h3>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          ${itemsRows}
          <tr>
            <td colspan="2" style="padding: 14px 0 4px; font-size: 14px; font-weight: bold; color: #0f172a;">
              Total Amount Payable (PKR):
            </td>
            <td style="padding: 14px 0 4px; font-size: 16px; font-weight: bold; color: #059669; text-align: right; font-family: monospace;">
              Rs. ${notification.totalAmountPKR.toLocaleString()}
            </td>
          </tr>
        </table>

        <div style="background: #fefce8; border: 1px solid #fef08a; padding: 12px; border-radius: 8px; font-size: 12px; color: #854d0e;">
          <strong>Cash on Delivery Notice:</strong> Please keep the exact amount of <strong>Rs. ${notification.totalAmountPKR.toLocaleString()}</strong> ready for the TCS courier delivery rider.
        </div>
      </div>

      <div style="background: #f8fafc; padding: 16px; text-align: center; border-top: 1px solid #e2e8f0; font-size: 11px; color: #94a3b8;">
        DecorHaus Pakistan · Architectural Living & Artisanal Crafts · Lahore · Karachi · Islamabad
      </div>
    </div>
  `;
};

export const buildOrderEmailPlainText = (notification: EmailNotification, isForAdmin = false): string => {
  const items = notification.itemsSummary
    .map((i) => `- ${i.title} (Qty: ${i.quantity}) - Rs. ${(i.pricePKR * i.quantity).toLocaleString()}`)
    .join('\n');

  return `
DecorHaus Pakistan - ${isForAdmin ? 'NEW ORDER ALERT FOR FARHAN AYUB' : 'ORDER CONFIRMATION RECEIPT'}
===================================================
Order ID: ${notification.orderId}
Courier Tracking (TCS): ${notification.trackingNumber}

CUSTOMER INFORMATION:
- Name: ${notification.recipientName}
- Email: ${notification.customerEmail || notification.recipientEmail}
- Phone: ${notification.customerPhone || 'N/A'}
- Delivery Address: ${notification.shippingAddress}
- Payment Method: ${notification.paymentMethod}

ORDERED ITEMS:
${items}

TOTAL AMOUNT PAYABLE: Rs. ${notification.totalAmountPKR.toLocaleString()}
${notification.paymentMethod.includes('Cash') ? 'Cash on Delivery: Please collect exact amount upon delivery.' : ''}
===================================================
Store Administrator: farhanayub915@gmail.com
Storefront: DecorHaus Pakistan (Karachi, Lahore, Islamabad)
  `.trim();
};
