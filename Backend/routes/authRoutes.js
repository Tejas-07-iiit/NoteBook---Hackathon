const router = require("express").Router();
const { 
  register, 
  login, 
  getMe, 
  updateProfile, 
  changePassword,
  getUserStats 
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

// Public routes
router.post("/register", register);
router.post("/login", login);

// Protected routes (require authentication)
router.get("/me", protect, getMe);
router.put("/profile", protect, updateProfile);
router.put("/change-password", protect, changePassword);
router.get("/stats", protect, getUserStats);

module.exports = router;