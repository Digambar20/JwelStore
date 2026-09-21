import mongoose from "mongoose";
import dotenv from "dotenv";
import Admin from "./models/Admin.js";
import connectDB from "./config/database.js";

dotenv.config();

const seedAdmin = async () => {
  try {
    await connectDB();

    const email = process.env.ADMIN_EMAIL || "admin@jwelstore.com";
    const password = process.env.ADMIN_PASSWORD || "admin123";

    const exists = await Admin.findOne({ email });
    if (exists) {
      console.log("Admin already exists");
      process.exit(0);
    }

    const admin = new Admin({ email, password, name: "Admin" });
    await admin.save();

    console.log("Admin created");
    console.log("Email:", email);
    console.log("Password:", password);
    process.exit(0);
  } catch (err) {
    console.error("Seed failed:", err.message);
    process.exit(1);
  }
};

seedAdmin();
