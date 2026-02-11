const NoteRequest = require("../models/NoteRequest.model");
const Note = require("../models/Note.model");
const fs = require("fs");

exports.createRequest = async (req, res) => {
  try {
    const {
      title,
      description,
      subject,
      department,
      semester,
      type,
      year,
      examType,
    } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "File required" });
    }

    if (!title || !subject || !department || !semester) {
      fs.unlink(req.file.path, () => {});
      return res.status(400).json({ message: "All fields are required" });
    }

    // ✅ Allow multiple requests
    // ❌ Only block if SAME TITLE + SUBJECT + SEMESTER is still pending
    const existingPending = await NoteRequest.findOne({
      title: title.trim(),
      subject: subject.trim(),
      semester: Number(semester),
      requestedBy: req.user._id,
      status: "pending",
    });

    if (existingPending) {
      fs.unlink(req.file.path, () => {});
      return res.status(400).json({
        message: "This request is already pending review.",
      });
    }

    // ❌ REMOVE this check completely (it blocks too much)
    // const existingNote = await Note.findOne({...})

    const fileUrl = `/uploads/${req.file.filename}`;

    const request = await NoteRequest.create({
      title: title.trim(),
      description: description ? description.trim() : "",
      subject: subject.trim(),
      department: department.trim(),
      semester: Number(semester),
      type: type || "note",
      year: year ? Number(year) : null,
      examType: examType || "other",
      fileUrl,
      requestedBy: req.user._id,
      collegeId: req.user.collegeId,
      status: "pending",
    });

    return res.status(201).json({
      message: "Request submitted for review",
      request,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};


exports.getMyRequests = async (req, res) => {
  try {
    const requests = await NoteRequest.find({
      requestedBy: req.user._id,
    })
      .sort({ createdAt: -1 })
      .populate("reviewedBy", "name email");

    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getPendingRequests = async (req, res) => {
  try {
    const requests = await NoteRequest.find({
      collegeId: req.user.collegeId,
      status: "pending",
    })
      .populate("requestedBy", "name email")
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getReviewedRequests = async (req, res) => {
  try {
    const requests = await NoteRequest.find({
      collegeId: req.user.collegeId,
      status: { $in: ["approved", "rejected"] },
    })
      .populate("requestedBy", "name email")
      .populate("reviewedBy", "name email")
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getStudentRequestHistory = async (req, res) => {
  try {
    const { studentId } = req.params;

    if (req.user.role === "student" && studentId !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const requests = await NoteRequest.find({ requestedBy: studentId })
      .sort({ createdAt: -1 })
      .populate("reviewedBy", "name email")
      .limit(50);

    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.approveRequest = async (req, res) => {
  try {
    const request = await NoteRequest.findById(req.params.id).populate(
      "requestedBy",
      "name email"
    );

    if (!request) return res.status(404).json({ message: "Request not found" });

    if (request.collegeId.toString() !== req.user.collegeId.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    request.status = "approved";
    request.reviewedBy = req.user._id;
    request.teacherMessage = "Approved and published to library";
    await request.save();

    const note = await Note.create({
      title: request.title,
      description: request.description,
      subject: request.subject,
      department: request.department,
      semester: request.semester,
      type: request.type,
      year: request.year,
      examType: request.examType,
      fileUrl: request.fileUrl,
      uploadedBy: request.requestedBy._id,
      collegeId: request.collegeId,
    });

    res.json({
      message: "Request approved and published to library",
      request,
      note,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.rejectRequest = async (req, res) => {
  try {
    const { teacherMessage } = req.body;

    if (!teacherMessage || teacherMessage.trim() === "") {
      return res.status(400).json({ message: "Rejection reason is required" });
    }

    const request = await NoteRequest.findById(req.params.id);

    if (!request) return res.status(404).json({ message: "Request not found" });

    if (request.collegeId.toString() !== req.user.collegeId.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    request.status = "rejected";
    request.reviewedBy = req.user._id;
    request.teacherMessage = teacherMessage.trim();
    await request.save();

    res.json({
      message: "Request rejected",
      request,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getRequestStats = async (req, res) => {
  try {
    const userId = req.user._id;

    const stats = await NoteRequest.aggregate([
      { $match: { requestedBy: userId } },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    const formattedStats = {
      pending: 0,
      approved: 0,
      rejected: 0,
      total: 0,
    };

    stats.forEach((stat) => {
      formattedStats[stat._id] = stat.count;
      formattedStats.total += stat.count;
    });

    res.json(formattedStats);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
