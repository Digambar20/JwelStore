import Order from "../models/Order.js";
import User from "../models/User.js";
import Product from "../models/Product.js";
import mongoose from "mongoose";
import sendOrderReadyEmail, { sendOrderConfirmationEmail, sendNewOrderNotification } from "../utils/sendEmail.js";

// Create order
export const createOrder = async (req, res) => {
  try {
    const { items, shippingAddress } = req.body;

    if (!items || items.length === 0) {
      return res
        .status(400)
        .json({ message: "Order must contain at least one item" });
    }

    // Check stock and decrease inventory
    let totalAmount = 0;
    for (const item of items) {
      const product = await Product.findById(item.product);

      if (!product) {
        return res
          .status(404)
          .json({ message: `Product ${item.product} not found` });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          message: `Insufficient stock for ${product.name}. Available: ${product.stock}, Requested: ${item.quantity}`,
        });
      }

      // Decrease stock
      product.stock -= item.quantity;
      await product.save();

      totalAmount += item.price * item.quantity;
    }

    // Create order
    const order = new Order({
      user: req.user.id,
      items,
      totalAmount,
      shippingAddress,
    });

    await order.save();
    await order.populate("items.product");

    // Save address to user's savedAddresses if it's new
    const user = await User.findById(req.user.id);
    if (user) {
      const addressExists = user.savedAddresses.some(
        (addr) =>
          addr.street === shippingAddress.street &&
          addr.city === shippingAddress.city &&
          addr.state === shippingAddress.state &&
          addr.zipCode === shippingAddress.zipCode,
      );

      if (!addressExists) {
        user.savedAddresses.push({
          street: shippingAddress.street,
          city: shippingAddress.city,
          state: shippingAddress.state,
          zipCode: shippingAddress.zipCode,
          isDefault: user.savedAddresses.length === 0, // First address is default
        });
        await user.save();
      }
    }

    // Send confirmation to user + notification to store (non-blocking)
    const emailItems = order.items.map((item) => ({
      name: item.product?.name || "Product",
      quantity: item.quantity,
      price: item.price,
    }));
    const orderEmailDetails = {
      orderId: order._id,
      items: emailItems,
      totalAmount,
      paymentMethod: order.paymentMethod,
      shippingAddress,
    };
    sendOrderConfirmationEmail(user.email, user.name, orderEmailDetails);
    sendNewOrderNotification({
      ...orderEmailDetails,
      userName: user.name,
      userEmail: user.email,
      userPhone: user.phone,
    });

    res.status(201).json({ message: "Order placed successfully", order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user orders
export const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate("items.product")
      .sort({ createdAt: -1 });

    res.json({ orders });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all orders (Admin)
export const getAllOrders = async (req, res) => {
  try {
    const {
      search = "",
      status = "All",
      paymentStatus = "All",
      date = "All",
      page = 1,
      limit = 20,
    } = req.query;
    const query = {};

    if (search.trim()) {
      const matchingUsers = await User.find({
        $or: [
          { name: { $regex: search.trim(), $options: "i" } },
          { email: { $regex: search.trim(), $options: "i" } },
          { phone: { $regex: search.trim(), $options: "i" } },
        ],
      }).select("_id");

      query.$or = [{ user: { $in: matchingUsers.map((user) => user._id) } }];
      if (mongoose.Types.ObjectId.isValid(search.trim())) {
        query.$or.push({ _id: search.trim() });
      }
    }

    if (status !== "All") query.status = status;
    if (paymentStatus !== "All") query.paymentStatus = paymentStatus;

    if (date !== "All") {
      const start = new Date();
      if (date === "Today") start.setHours(0, 0, 0, 0);
      if (date === "Last 7 Days") start.setDate(start.getDate() - 7);
      if (date === "Last 30 Days") start.setDate(start.getDate() - 30);
      query.createdAt = { $gte: start };
    }

    const orders = await Order.find(query)
      .populate("user", "name email phone")
      .populate("items.product")
      .sort({ createdAt: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));

    const [total, pending, shipped, delivered] = await Promise.all([
      Order.countDocuments(),
      Order.countDocuments({ status: "Pending" }),
      Order.countDocuments({ status: "Shipped" }),
      Order.countDocuments({ status: "Delivered" }),
    ]);

    res.json({
      orders,
      pagination: { page: Number(page), limit: Number(limit), total },
      summary: { total, pending, shipped, delivered },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update order status (Admin)
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const allowedStatuses = [
      "Pending",
      "Confirmed",
      "Packed",
      "Preparing",
      "Shipped",
      "Out for Delivery",
      "Delivered",
      "Cancelled",
      "Returned",
      "Refunded",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid order status" });
    }
    const order = await Order.findById(req.params.id)
      .populate("user")
      .populate("items.product");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.status = status;

    await order.save();

    // Send email when order is completed
    if (["Completed", "Delivered"].includes(status) && !order.emailSent) {
      const orderDetails = {
        orderId: order._id,
        items: await Promise.all(
          order.items.map(async (item) => ({
            name: item.product.name,
            quantity: item.quantity,
            price: item.price,
          })),
        ),
        totalAmount: order.totalAmount,
        status,
      };

      const emailSent = await sendOrderReadyEmail(
        order.user.email,
        order.user.name,
        orderDetails,
      );
      if (emailSent)
        await Order.findByIdAndUpdate(order._id, { emailSent: true });
    }

    res.json({ message: "Order status updated", order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Cancel order
export const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.status === "Delivered") {
      return res.status(400).json({ message: "Cannot cancel delivered order" });
    }

    order.status = "Cancelled";
    await order.save();

    res.json({ message: "Order cancelled successfully", order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const cancelOrderByAdmin = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: "Cancelled" },
      { new: true },
    );

    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json({ message: "Order cancelled successfully", order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getSalesAnalytics = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const dateQuery = {};

    if (startDate || endDate) {
      dateQuery.createdAt = {};
      if (startDate)
        dateQuery.createdAt.$gte = new Date(`${startDate}T00:00:00.000Z`);
      if (endDate)
        dateQuery.createdAt.$lte = new Date(`${endDate}T23:59:59.999Z`);
    }

    const orders = await Order.find(dateQuery)
      .populate("user", "name email phone")
      .populate("items.product", "name category image")
      .sort({ createdAt: -1 })
      .lean();

    const excludedStatuses = new Set(["Cancelled", "Returned", "Refunded"]);
    const isRecognizedRevenue = (order) => {
      if (excludedStatuses.has(order.status)) return false;
      if (order.paymentStatus === "Paid") return true;
      return (
        order.paymentMethod === "COD" &&
        ["Completed", "Delivered"].includes(order.status)
      );
    };

    const analytics = {
      totalRevenue: 0,
      paidRevenue: 0,
      pendingPayments: 0,
      refundedAmount: 0,
      cancelledOrders: orders.filter((order) => order.status === "Cancelled")
        .length,
      totalOrders: orders.length,
      customers: new Set(
        orders.map((order) => String(order.user?._id || order.user)),
      ).size,
      averageOrderValue: 0,
      statusBreakdown: {},
      paymentBreakdown: {},
      dailyRevenue: {},
      topProducts: {},
      categories: {},
      recentOrders: orders.slice(0, 8),
    };

    for (const order of orders) {
      analytics.statusBreakdown[order.status] =
        (analytics.statusBreakdown[order.status] || 0) + 1;
      const paymentKey =
        order.paymentStatus || order.paymentMethod || "Pending";
      analytics.paymentBreakdown[paymentKey] =
        (analytics.paymentBreakdown[paymentKey] || 0) + 1;

      if (order.paymentStatus === "Pending")
        analytics.pendingPayments += order.totalAmount || 0;
      if (order.paymentStatus === "Refunded" || order.status === "Refunded")
        analytics.refundedAmount += order.totalAmount || 0;

      if (isRecognizedRevenue(order)) {
        analytics.totalRevenue += order.totalAmount || 0;
        if (order.paymentStatus === "Paid" || order.paymentMethod === "COD")
          analytics.paidRevenue += order.totalAmount || 0;

        const day = new Date(order.createdAt).toISOString().slice(0, 10);
        analytics.dailyRevenue[day] =
          (analytics.dailyRevenue[day] || 0) + (order.totalAmount || 0);

        for (const item of order.items || []) {
          const product = item.product;
          const key = String(product?._id || item.product);
          const entry = analytics.topProducts[key] || {
            id: key,
            name: product?.name || "Product",
            category: product?.category || "Jewellery",
            image: product?.image || "",
            units: 0,
            revenue: 0,
          };
          entry.units += item.quantity;
          entry.revenue += item.quantity * item.price;
          analytics.topProducts[key] = entry;
          const category = entry.category;
          analytics.categories[category] =
            (analytics.categories[category] || 0) + item.quantity * item.price;
        }
      }
    }

    analytics.averageOrderValue = analytics.totalOrders
      ? analytics.totalRevenue / analytics.totalOrders
      : 0;
    analytics.topProducts = Object.values(analytics.topProducts)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 8);
    analytics.categories = Object.entries(analytics.categories)
      .map(([name, revenue]) => ({ name, revenue }))
      .sort((a, b) => b.revenue - a.revenue);
    analytics.dailyRevenue = Object.entries(analytics.dailyRevenue)
      .map(([date, revenue]) => ({ date, revenue }))
      .sort((a, b) => a.date.localeCompare(b.date));

    res.json({ analytics });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export default {
  createOrder,
  getUserOrders,
  getAllOrders,
  updateOrderStatus,
  cancelOrder,
  cancelOrderByAdmin,
  getSalesAnalytics,
};
