const mongoose = require("mongoose");

const collegeSchema = new mongoose.Schema(
  {
    collegeName: { type: String, required: true },
    collegeCode: { type: String, required: true, unique: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("College", collegeSchema);