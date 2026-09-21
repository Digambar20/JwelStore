import nodemailer from "nodemailer";

let transporter;

const escapeHtml = (value = "") =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

const getTransporter = () => {
  if (transporter) return transporter;

  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;

  if (!user || !pass) {
    console.warn(
      "Email service is not configured. Set EMAIL_USER and EMAIL_PASS.",
    );
    return null;
  }

  transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || "gmail",
    auth: { user, pass },
  });

  return transporter;
};

export const sendOrderConfirmationEmail = async (userEmail, userName, orderDetails) => {
  const mailer = getTransporter();
  if (!mailer || !userEmail) return false;

  const safeName = escapeHtml(userName || "Customer");
  const itemsList = (orderDetails.items || [])
    .map(
      (item) =>
        `<tr><td style="padding:10px;border-bottom:1px solid #e8efec">${escapeHtml(item.name)}</td><td style="padding:10px;border-bottom:1px solid #e8efec">${item.quantity}</td><td style="padding:10px;border-bottom:1px solid #e8efec">₹${Number(item.price * item.quantity).toLocaleString("en-IN")}</td></tr>`,
    )
    .join("");

  const addr = orderDetails.shippingAddress || {};
  const addressLine = [addr.street, addr.city, addr.state, addr.zipCode].filter(Boolean).join(", ");

  try {
    await mailer.sendMail({
      from: `JwelStore <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: `Order Confirmed! #${orderDetails.orderId}`,
      text: `Hi ${userName || "Customer"}, your order #${orderDetails.orderId} has been placed successfully. Total: ₹${orderDetails.totalAmount}. Payment: ${orderDetails.paymentMethod}.`,
      html: `<div style="margin:0;background:#F8FAF9;padding:32px 16px;font-family:Arial,sans-serif;color:#111111"><div style="max-width:620px;margin:auto;background:#FFFFFF;border-radius:14px;overflow:hidden"><div style="background:#111111;padding:24px 28px;color:#FFFFFF"><div style="font-size:26px;font-weight:800"><span style="color:#54C69D">Jwel</span>Store</div><div style="margin-top:8px;color:#B8C5C0">Order Confirmation</div></div><div style="padding:28px"><h2 style="margin:0 0 12px">Hi ${safeName}, your order is confirmed! 🎉</h2><p style="color:#666666">Thank you for your purchase. We've received your order and it's being processed.</p><p style="color:#666666"><strong>Order ID:</strong> #${escapeHtml(String(orderDetails.orderId))}</p><p style="color:#666666"><strong>Payment Method:</strong> ${escapeHtml(orderDetails.paymentMethod || "COD")}</p>${addressLine ? `<p style="color:#666666"><strong>Delivery Address:</strong> ${escapeHtml(addressLine)}</p>` : ""}<table style="width:100%;border-collapse:collapse;margin:22px 0"><thead><tr style="text-align:left;background:#F8FAF9"><th style="padding:10px">Product</th><th style="padding:10px">Qty</th><th style="padding:10px">Subtotal</th></tr></thead><tbody>${itemsList}</tbody></table><div style="border-top:1px solid #e8efec;padding-top:16px;font-size:18px;font-weight:700">Total: ₹${Number(orderDetails.totalAmount || 0).toLocaleString("en-IN")}</div><p style="margin:24px 0 0;color:#666666">We'll notify you when your order status updates. Thank you for choosing JwelStore! 💎</p></div></div></div>`,
    });
    console.log(`Order confirmation email sent to ${userEmail}`);
    return true;
  } catch (error) {
    console.error("Order confirmation email error:", error.message);
    return false;
  }
};

export const sendNewOrderNotification = async (orderDetails) => {
  const mailer = getTransporter();
  const storeEmail = process.env.EMAIL_USER;
  if (!mailer || !storeEmail) return false;

  const safeName = escapeHtml(orderDetails.userName || "Unknown");
  const safeEmail = escapeHtml(orderDetails.userEmail || "");
  const safePhone = escapeHtml(orderDetails.userPhone || "N/A");
  const itemsList = (orderDetails.items || [])
    .map(
      (item) =>
        `<tr><td style="padding:10px;border-bottom:1px solid #e8efec">${escapeHtml(item.name)}</td><td style="padding:10px;border-bottom:1px solid #e8efec">${item.quantity}</td><td style="padding:10px;border-bottom:1px solid #e8efec">₹${Number(item.price * item.quantity).toLocaleString("en-IN")}</td></tr>`,
    )
    .join("");

  const addr = orderDetails.shippingAddress || {};
  const addressLine = [addr.street, addr.city, addr.state, addr.zipCode].filter(Boolean).join(", ");

  try {
    await mailer.sendMail({
      from: `JwelStore <${storeEmail}>`,
      to: storeEmail,
      subject: `🛍️ New Order Received #${orderDetails.orderId}`,
      text: `New order from ${orderDetails.userName} (${orderDetails.userEmail}). Order ID: ${orderDetails.orderId}. Total: ₹${orderDetails.totalAmount}.`,
      html: `<div style="margin:0;background:#F8FAF9;padding:32px 16px;font-family:Arial,sans-serif;color:#111111"><div style="max-width:620px;margin:auto;background:#FFFFFF;border-radius:14px;overflow:hidden"><div style="background:#111111;padding:24px 28px;color:#FFFFFF"><div style="font-size:26px;font-weight:800"><span style="color:#54C69D">Jwel</span>Store</div><div style="margin-top:8px;color:#B8C5C0">New Order Notification</div></div><div style="padding:28px"><h2 style="margin:0 0 12px">🛍️ New Order Received!</h2><p style="color:#666666"><strong>Order ID:</strong> #${escapeHtml(String(orderDetails.orderId))}</p><p style="color:#666666"><strong>Customer:</strong> ${safeName}</p><p style="color:#666666"><strong>Email:</strong> ${safeEmail}</p><p style="color:#666666"><strong>Phone:</strong> ${safePhone}</p><p style="color:#666666"><strong>Payment:</strong> ${escapeHtml(orderDetails.paymentMethod || "COD")}</p>${addressLine ? `<p style="color:#666666"><strong>Delivery Address:</strong> ${escapeHtml(addressLine)}</p>` : ""}<table style="width:100%;border-collapse:collapse;margin:22px 0"><thead><tr style="text-align:left;background:#F8FAF9"><th style="padding:10px">Product</th><th style="padding:10px">Qty</th><th style="padding:10px">Subtotal</th></tr></thead><tbody>${itemsList}</tbody></table><div style="border-top:1px solid #e8efec;padding-top:16px;font-size:18px;font-weight:700">Total: ₹${Number(orderDetails.totalAmount || 0).toLocaleString("en-IN")}</div></div></div></div>`,
    });
    console.log(`New order notification sent to store (${storeEmail})`);
    return true;
  } catch (error) {
    console.error("New order notification email error:", error.message);
    return false;
  }
};

export const sendOrderReadyEmail = async (
  userEmail,
  userName,
  orderDetails,
) => {
  const mailer = getTransporter();
  if (!mailer || !userEmail) return false;

  const safeName = escapeHtml(userName || "Customer");
  const safeStatus = escapeHtml(orderDetails.status || "Completed");
  const itemsList = (orderDetails.items || [])
    .map(
      (item) =>
        `<tr><td style="padding:10px;border-bottom:1px solid #e8efec">${escapeHtml(item.name)}</td><td style="padding:10px;border-bottom:1px solid #e8efec">${item.quantity}</td><td style="padding:10px;border-bottom:1px solid #e8efec">₹${Number(item.price * item.quantity).toLocaleString("en-IN")}</td></tr>`,
    )
    .join("");

  try {
    await mailer.sendMail({
      from: `JwelStore <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: `JwelStore order update: ${safeStatus}`,
      text: `Hi ${userName || "Customer"}, your order ${orderDetails.orderId} is now ${orderDetails.status || "Completed"}. Total: ₹${orderDetails.totalAmount}.`,
      html: `<div style="margin:0;background:#F8FAF9;padding:32px 16px;font-family:Arial,sans-serif;color:#111111"><div style="max-width:620px;margin:auto;background:#FFFFFF;border-radius:14px;overflow:hidden"><div style="background:#111111;padding:24px 28px;color:#FFFFFF"><div style="font-size:26px;font-weight:800"><span style="color:#54C69D">Jwel</span>Store</div><div style="margin-top:8px;color:#B8C5C0">Order status update</div></div><div style="padding:28px"><h2 style="margin:0 0 12px">Hi ${safeName},</h2><p style="color:#666666">Your order status is now <strong style="color:#267B61">${safeStatus}</strong>.</p><p style="color:#666666"><strong>Order ID:</strong> ${escapeHtml(orderDetails.orderId)}</p><table style="width:100%;border-collapse:collapse;margin:22px 0"><thead><tr style="text-align:left;background:#F8FAF9"><th style="padding:10px">Product</th><th style="padding:10px">Qty</th><th style="padding:10px">Subtotal</th></tr></thead><tbody>${itemsList}</tbody></table><div style="border-top:1px solid #e8efec;padding-top:16px;font-size:18px;font-weight:700">Total: ₹${Number(orderDetails.totalAmount || 0).toLocaleString("en-IN")}</div><p style="margin:24px 0 0;color:#666666">Thank you for choosing JwelStore.</p></div></div></div>`,
    });
    console.log(`Email sent to ${userEmail}`);
    return true;
  } catch (error) {
    console.error("Email send error:", error.message);
    return false;
  }
};

export default sendOrderReadyEmail;
