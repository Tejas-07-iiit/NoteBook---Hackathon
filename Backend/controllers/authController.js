const User = require("../models/User.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// Validation helpers
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password) => {
  return password.length >= 6;
};

// Register user
exports.register = async (req, res) => {
  try {
    const { name, email, password, role, collegeId } = req.body;

    console.log("Registration request body:", req.body); // Debug log

    // Detailed validation
    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Name is required" });
    }
    if (!email || !email.trim()) {
      return res.status(400).json({ message: "Email is required" });
    }
    if (!validateEmail(email.trim())) {
      return res.status(400).json({ message: "Invalid email format" });
    }
    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }
    if (!validatePassword(password)) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }
    if (!collegeId || !collegeId.trim()) {
      return res.status(400).json({ message: "College selection is required" });
    }

    // Check if user already exists
    const existing = await User.findOne({ email: email.trim().toLowerCase() });
    if (existing) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Hash password
    const hashed = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: hashed,
      role: role || "student",
      collegeId
    });

    // Generate token
    const token = createToken(user._id);

    res.status(201).json({
      message: "Registration successful",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        collegeId: user.collegeId
      }
    });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ 
      message: "Server error during registration",
      error: err.message 
    });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !email.trim()) {
      return res.status(400).json({ message: "Email is required" });
    }
    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }

    const user = await User.findOne({ email: email.trim().toLowerCase() });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = createToken(user._id);

    res.json({
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        collegeId: user.collegeId
      }
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ 
      message: "Server error during login",
      error: err.message 
    });
  }
};

// Get current user profile
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select("-password")
      .populate("collegeId", "collegeName collegeCode");
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    res.json(user);
  } catch (err) {
    console.error("Get me error:", err);
    res.status(500).json({ 
      message: "Server error fetching user profile",
      error: err.message 
    });
  }
};

// Update user profile
exports.updateProfile = async (req, res) => {
  try {
    const { name, email, collegeId } = req.body;
    const userId = req.user._id;

    // Validate inputs
    if (name && !name.trim()) {
      return res.status(400).json({ message: "Name cannot be empty" });
    }
    
    if (email) {
      if (!email.trim()) {
        return res.status(400).json({ message: "Email cannot be empty" });
      }
      if (!validateEmail(email.trim())) {
        return res.status(400).json({ message: "Invalid email format" });
      }
      
      // Check if email is already taken by another user
      const existingUser = await User.findOne({ 
        email: email.trim().toLowerCase(),
        _id: { $ne: userId }
      });
      if (existingUser) {
        return res.status(400).json({ message: "Email already in use" });
      }
    }

    // Find and update user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update fields if provided
    if (name) user.name = name.trim();
    if (email) user.email = email.trim().toLowerCase();
    if (collegeId) user.collegeId = collegeId;

    await user.save();

    // Return updated user without password
    const updatedUser = await User.findById(userId)
      .select("-password")
      .populate("collegeId", "collegeName collegeCode");

    res.json({
      message: "Profile updated successfully",
      user: updatedUser
    });
  } catch (err) {
    console.error("Update profile error:", err);
    res.status(500).json({ 
      message: "Server error updating profile",
      error: err.message 
    });
  }
};

// Change password
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user._id;

    // Validate inputs
    if (!currentPassword) {
      return res.status(400).json({ message: "Current password is required" });
    }
    if (!newPassword) {
      return res.status(400).json({ message: "New password is required" });
    }
    if (!validatePassword(newPassword)) {
      return res.status(400).json({ message: "New password must be at least 6 characters" });
    }

    // Get user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    // Check if new password is same as current
    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) {
      return res.status(400).json({ message: "New password must be different from current password" });
    }

    // Hash and save new password
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ message: "Password changed successfully" });
  } catch (err) {
    console.error("Change password error:", err);
    res.status(500).json({ 
      message: "Server error changing password",
      error: err.message 
    });
  }
};

// Get user statistics (for dashboard)
exports.getUserStats = async (req, res) => {
  try {
    const userId = req.user._id;
    
    // You can add logic here to count user's notes, requests, etc.
    // For now, returning placeholder stats
    const stats = {
      notesUploaded: 0,
      requestsMade: 0,
      downloads: 0,
      lastLogin: req.user.updatedAt || new Date()
    };

    res.json(stats);
  } catch (err) {
    console.error("Get stats error:", err);
    res.status(500).json({ 
      message: "Server error fetching statistics",
      error: err.message 
    });
  }
};