const router = require("express").Router();
const { createCollege, getColleges } = require("../controllers/collegeController");


router.get("/", getColleges);
router.post("/", createCollege);

module.exports = router;