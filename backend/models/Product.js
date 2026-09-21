import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide product name"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Please provide product description"],
    },
    price: {
      type: Number,
      required: [true, "Please provide product price"],
      min: 0,
    },
    category: {
      type: String,
      enum: [
        "Jhumkas",
        "Bracelets",
        "Pendants",
        "Rings",
        "Earrings",
        "Necklaces",
        "Bangles",
      ],
      required: true,
    },
    image: {
      type: String,
      default: "https://via.placeholder.com/300",
    },
    stock: {
      type: Number,
      default: 0,
      min: 0,
    },
    material: {
      type: String,
      enum: ["Gold", "Silver", "Platinum", "Copper"],
    },
    weight: String, // e.g., "5g"
    originalPrice: {
      type: Number,
      min: 0,
    },
    discount: {
      type: Number,
      min: 0,
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
    },
    reviews: {
      type: Number,
      min: 0,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },
  },
  { timestamps: true },
);

export default mongoose.model("Product", productSchema);
