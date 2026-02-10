const mongoose = require("mongoose");

const noteRequestSchema = new mongoose.Schema(
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

    requestedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    collegeId: { type: mongoose.Schema.Types.ObjectId, ref: "College" },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending"
    },

    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },

    teacherMessage: { type: String, default: "" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("NoteRequest", noteRequestSchema);
