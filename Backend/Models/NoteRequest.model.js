const mongoose = require("mongoose");

const noteRequestSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },

    description: { type: String, default: "", trim: true },

    subject: { type: String, required: true, trim: true },

    department: { type: String, required: true, trim: true },

    semester: { type: Number, required: true },

    type: {
      type: String,
      enum: ["note", "pastpaper"],
      default: "note",
    },

    year: { type: Number, default: null },

    examType: {
      type: String,
      enum: ["midsem", "endsem", "quiz", "other"],
      default: "other",
    },

    fileUrl: { type: String, required: true },

    requestedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    collegeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "College",
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    teacherMessage: { type: String, default: "" },
  },
  { timestamps: true }
);

// ✅ Important Index (fast duplicate checking)
noteRequestSchema.index({
  title: 1,
  subject: 1,
  semester: 1,
  type: 1,
  year: 1,
  examType: 1,
  requestedBy: 1,
  collegeId: 1,
  status: 1,
});

module.exports = mongoose.model("NoteRequest", noteRequestSchema);  