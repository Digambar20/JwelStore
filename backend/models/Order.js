import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        price: {
          type: Number,
          required: true,
        },
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
    },
    shippingAddress: {
      name: String,
      phone: String,
      street: String,
      city: String,
      state: String,
      zipCode: String,
    },
    status: {
      type: String,
      enum: [
        "Pending",
        "Confirmed",
        "Packed",
        "Preparing",
        "Shipped",
        "Out for Delivery",
        "Completed",
        "Delivered",
        "Cancelled",
        "Returned",
        "Refunded",
      ],
      default: "Pending",
    },
    paymentMethod: {
      type: String,
      enum: ["COD", "Credit Card", "Debit Card"],
      default: "COD",
    },
    paymentStatus: {
      type: String,
      enum: ["Paid", "Pending", "Failed", "COD", "Refunded"],
      default: "Pending",
    },
    transactionId: {
      type: String,
      trim: true,
    },
    emailSent: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Order", orderSchema);
