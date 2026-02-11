const router = require("express").Router();
const { createCollege, getColleges } = require("../controllers/collegeController");
const { protect } = require("../middleware/authMiddleware");
const { requireRole } = require("../middleware/roleMiddleware");

router.get("/", getColleges);
router.post("/", createCollege);

module.exports = router;
