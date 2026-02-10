const College = require("../models/College.model");

exports.createCollege = async (req, res) => {
  try {
    const { collegeName, collegeCode } = req.body;

    const college = await College.create({ collegeName, collegeCode });

    res.status(201).json({ message: "College created", college });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getColleges = async (req, res) => {
  try {
    const colleges = await College.find().sort({ createdAt: -1 });
    res.json(colleges);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
