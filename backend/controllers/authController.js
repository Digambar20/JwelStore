import User from "../models/User.js";
import Admin from "../models/Admin.js";
import jwt from "jsonwebtoken";

// User Signup
export const userSignup = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    // Validation
    if (!name || !email || !phone || !password) {
      return res
        .status(400)
        .json({ message: "Please provide all required fields" });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create user
    const user = new User({ name, email, phone, password });
    await user.save();

    // Generate token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET_USER,
      {
        expiresIn: "7d",
      },
    );

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        name,
        email,
        phone,
        address: user.address,
        savedAddresses: user.savedAddresses,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// User Login
export const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide email and password" });
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET_USER,
      {
        expiresIn: "7d",
      },
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        savedAddresses: user.savedAddresses,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin Login
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide email and password" });
    }

    const admin = await Admin.findOne({ email }).select("+password");
    if (!admin) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isPasswordValid = await admin.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: admin._id, email: admin.email },
      process.env.JWT_SECRET_ADMIN,
      {
        expiresIn: "7d",
      },
    );

    res.json({
      message: "Admin login successful",
      token,
      admin: { id: admin._id, name: admin.name, email: admin.email },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
    try {

        const { email, password } = req.body;

        // Check Admin first
        let admin = await Admin.findOne({ email }).select("+password");

        if(admin){

            const valid = await admin.comparePassword(password);

            if(!valid){
                return res.status(401).json({
                    message:"Invalid email or password"
                });
            }

            const token = jwt.sign(
                {
                    id: admin._id,
                    email: admin.email
                },
                process.env.JWT_SECRET_ADMIN,
                {
                    expiresIn:"7d"
                }
            );

            return res.json({
                role:"admin",
                token,
                admin:{
                    id:admin._id,
                    name:admin.name,
                    email:admin.email
                }
            });

        }

        // Check User

        let user = await User.findOne({ email }).select("+password");

        if(!user){
            return res.status(401).json({
                message:"Invalid email or password"
            });
        }

        const valid = await user.comparePassword(password);

        if(!valid){
            return res.status(401).json({
                message:"Invalid email or password"
            });
        }

        const token = jwt.sign(
            {
                id:user._id,
                email:user.email
            },
            process.env.JWT_SECRET_USER,
            {
                expiresIn:"7d"
            }
        );

        res.json({
            role:"user",
            token,
            user:{
                id:user._id,
                name:user.name,
                email:user.email,
                phone:user.phone,
                address:user.address,
                savedAddresses:user.savedAddresses
            }
        });

    } catch(err){
        res.status(500).json({
            message:err.message
        });
    }
}

// Get User Profile
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Admin Profile
export const getAdminProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.id);
    res.json({ admin });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update User Profile
export const updateUserProfile = async (req, res) => {
  try {
    const { name, phone, address } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update fields
    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (address) {
      user.address = {
        street: address.street || user.address?.street || "",
        city: address.city || user.address?.city || "",
        state: address.state || user.address?.state || "",
        zipCode: address.zipCode || user.address?.zipCode || "",
      };
    }

    await user.save();

    res.json({
      message: "Profile updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export default {
  userSignup,
  userLogin,
  adminLogin,
  getUserProfile,
  getAdminProfile,
  updateUserProfile,
};
