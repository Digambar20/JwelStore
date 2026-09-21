import Product from "../models/Product.js";
import Order from "../models/Order.js";
import User from "../models/User.js";

// GET /api/admin/dashboard
export const getDashboard = async (req, res) => {
  try {
    // Total Counts
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalUsers = await User.countDocuments();

    // Revenue (excluding cancelled orders)
    const revenueResult = await Order.aggregate([
      {
        $match: {
          status: { $ne: "Cancelled" },
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: {
            $sum: "$totalAmount",
          },
        },
      },
    ]);

    const totalRevenue =
      revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

    // Low Stock Products
    const lowStockProducts = await Product.find({
      stock: { $lte: 5 },
    })
      .select("name stock category price image")
      .sort({ stock: 1 })
      .limit(5);

    // Recent Orders
    const recentOrders = await Order.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .limit(5);

    // Monthly Sales (Current Year)
    const currentYear = new Date().getFullYear();

    const monthlySales = await Order.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(`${currentYear}-01-01`),
            $lte: new Date(`${currentYear}-12-31`),
          },
          status: { $ne: "Cancelled" },
        },
      },
      {
        $group: {
          _id: {
            month: { $month: "$createdAt" },
          },
          sales: {
            $sum: "$totalAmount",
          },
          orders: {
            $sum: 1,
          },
        },
      },
      {
        $sort: {
          "_id.month": 1,
        },
      },
    ]);

    res.status(200).json({
      success: true,

      stats: {
        totalProducts,
        totalOrders,
        totalUsers,
        totalRevenue,
      },

      lowStockProducts,

      recentOrders,

      monthlySales,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};