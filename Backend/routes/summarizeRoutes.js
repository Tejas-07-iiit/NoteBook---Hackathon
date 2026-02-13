const express = require("express");
const router = express.Router();
const { summarizeNotes } = require("../controllers/summarizeController");

router.post("/", summarizeNotes);

module.exports = router;
