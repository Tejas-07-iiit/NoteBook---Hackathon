const router = require("express").Router();
const upload = require("../middleware/uploadMiddleware");
const { protect } = require("../middleware/authMiddleware");
const { requireRole } = require("../middleware/roleMiddleware");
const {
  createRequest,
  getMyRequests,
  getPendingRequests,
  getReviewedRequests,
  approveRequest,
  rejectRequest
} = require("../controllers/requestController");

// Student routes
router.post("/", protect, requireRole(["student"]), upload.single("file"), createRequest);
router.get("/my", protect, requireRole(["student"]), getMyRequests);

// Teacher/Admin routes
router.get("/pending", protect, requireRole(["teacher", "admin"]), getPendingRequests);
router.get("/reviewed", protect, requireRole(["teacher", "admin"]), getReviewedRequests);
router.put("/:id/approve", protect, requireRole(["teacher", "admin"]), approveRequest);
router.put("/:id/reject", protect, requireRole(["teacher", "admin"]), rejectRequest);

module.exports = router;