const router = require("express").Router();
const { createCollege, getColleges } = require("../controllers/collegeController");
const { protect } = require("../middleware/authMiddleware");
const { requireRole } = require("../middleware/roleMiddleware");

router.get("/", getColleges);
router.post("/", protect, requireRole(["admin"]), createCollege);

module.exports = router;
