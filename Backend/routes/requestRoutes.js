const router = require("express").Router();
const upload = require("../middleware/uploadMiddleware");
const { protect } = require("../middleware/authMiddleware");
const { requireRole } = require("../middleware/roleMiddleware");

const {
  createRequest,
  getMyRequests,
  getPendingRequests,
  getReviewedRequests,
  getStudentRequestHistory,
  approveRequest,
  rejectRequest,
  getRequestStats,
} = require("../controllers/requestController");

// Student routes
router.post(
  "/",
  protect,
  requireRole(["student"]),
  upload.single("file"),
  createRequest
);

router.get("/my", protect, requireRole(["student"]), getMyRequests);
router.get("/stats", protect, requireRole(["student"]), getRequestStats);

// Student history (accessible by student themselves or teachers)
router.get("/history/:studentId", protect, getStudentRequestHistory);

// Teacher/Admin routes
router.get("/pending", protect, requireRole(["teacher"]), getPendingRequests);
router.get("/reviewed", protect, requireRole(["teacher"]), getReviewedRequests);

router.put("/:id/approve", protect, requireRole(["teacher"]), approveRequest);
router.put("/:id/reject", protect, requireRole(["teacher"]), rejectRequest);

module.exports = router;
