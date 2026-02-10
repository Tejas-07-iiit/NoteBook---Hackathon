const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },

    description: { type: String, default: "" },

    subject: { type: String, required: true },

    department: { type: String, required: true },

    semester: { type: Number, required: true },

    type: {
      type: String,
      enum: ["note", "pastpaper"],
      default: "note"
    },

    year: { type: Number, default: null },

    examType: {
      type: String,
      enum: ["midsem", "endsem", "quiz", "other"],
      default: "other"
    },

    fileUrl: { type: String, required: true },

    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    collegeId: { type: mongoose.Schema.Types.ObjectId, ref: "College" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Note", noteSchema);
