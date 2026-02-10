const router = require("express").Router();
const upload = require("../middleware/uploadMiddleware");
const { protect } = require("../middleware/authMiddleware");
const { requireRole } = require("../middleware/roleMiddleware");
const { uploadNote, getNotes, deleteNote } = require("../controllers/noteController");

router.get("/", protect, getNotes);
router.post("/upload", protect, requireRole(["teacher", "admin"]), upload.single("file"), uploadNote);
router.delete("/:id", protect, requireRole(["teacher", "admin"]), deleteNote);

module.exports = router;
