const NoteRequest = require("../models/NoteRequest.model");
const Note = require("../models/Note.model");

exports.createRequest = async (req, res) => {
  try {
    const { title, description, subject, department, semester, type, year, examType } = req.body;

    if (!req.file) return res.status(400).json({ message: "File required" });

    const fileUrl = `/uploads/${req.file.filename}`;

    const request = await NoteRequest.create({
      title,
      description,
      subject,
      department,
      semester: Number(semester),
      type,
      year: year ? Number(year) : null,
      examType: examType || "other",
      fileUrl,
      requestedBy: req.user._id,
      collegeId: req.user.collegeId,
      status: "pending"
    });

    res.status(201).json({ 
      message: "Request submitted for review", 
      request 
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getMyRequests = async (req, res) => {
  try {
    const requests = await NoteRequest.find({ requestedBy: req.user._id })
      .sort({ createdAt: -1 })
      .populate("reviewedBy", "name email");

    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getPendingRequests = async (req, res) => {
  try {
    // Only show requests from same college
    const requests = await NoteRequest.find({
      collegeId: req.user.collegeId,
      status: "pending"
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
      status: { $in: ["approved", "rejected"] }
    })
      .populate("requestedBy", "name email")
      .populate("reviewedBy", "name")
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.approveRequest = async (req, res) => {
  try {
    const request = await NoteRequest.findById(req.params.id)
      .populate("requestedBy", "name email");

    if (!request) return res.status(404).json({ message: "Request not found" });

    // Check if teacher is from same college
    if (request.collegeId.toString() !== req.user.collegeId.toString()) {
      return res.status(403).json({ message: "Not authorized to review this request" });
    }

    // Update request status
    request.status = "approved";
    request.reviewedBy = req.user._id;
    request.teacherMessage = "Approved and published to library";
    await request.save();

    // Create a note from the request
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
      collegeId: request.collegeId
    });

    res.json({ 
      message: "Request approved and published to library", 
      request,
      note 
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

    // Check if teacher is from same college
    if (request.collegeId.toString() !== req.user.collegeId.toString()) {
      return res.status(403).json({ message: "Not authorized to review this request" });
    }

    request.status = "rejected";
    request.reviewedBy = req.user._id;
    request.teacherMessage = teacherMessage.trim();
    await request.save();

    res.json({ 
      message: "Request rejected", 
      request 
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};