import React, { useState } from "react";
import api from "../services/api";
import { FiX, FiUpload } from "react-icons/fi";

const UploadModal = ({ onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [file, setFile] = useState(null);

  // Get user from localStorage
  const userData = localStorage.getItem("user");
  const user = userData ? JSON.parse(userData) : null;

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    subject: "",
    department: user?.department || "",
    semester: "",
    type: "note",
    year: "",
    examType: "other",
  });

  const departments = ["Computer Science", "Electronics", "Mechanical", "Civil", "Electrical"];
  const semesters = [1, 2, 3, 4, 5, 6, 7, 8];
  const examTypes = ["midsem", "endsem", "quiz", "other"];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });

    // auto set examType for pastpaper
    if (e.target.name === "type" && e.target.value === "pastpaper") {
      setFormData((prev) => ({ ...prev, type: "pastpaper", examType: "endsem" }));
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    if (selectedFile) {
      if (selectedFile.size > 10 * 1024 * 1024) {
        setError("File size must be less than 10MB");
        e.target.value = "";
        setFile(null);
        return;
      }

      const allowedTypes = ["application/pdf", "image/png", "image/jpeg", "image/jpg"];
      if (!allowedTypes.includes(selectedFile.type)) {
        setError("Only PDF, PNG, JPG files are allowed");
        e.target.value = "";
        setFile(null);
        return;
      }

      setFile(selectedFile);
      setError("");
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      subject: "",
      department: user?.department || "",
      semester: "",
      type: "note",
      year: "",
      examType: "other",
    });

    setFile(null);

    const input = document.getElementById("file-upload");
    if (input) input.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!formData.title.trim()) {
      setError("Title is required");
      setLoading(false);
      return;
    }
    if (!formData.subject.trim()) {
      setError("Subject is required");
      setLoading(false);
      return;
    }
    if (!formData.department) {
      setError("Department is required");
      setLoading(false);
      return;
    }
    if (!formData.semester) {
      setError("Semester is required");
      setLoading(false);
      return;
    }
    if (!file) {
      setError("Please select a file");
      setLoading(false);
      return;
    }

    const data = new FormData();
    data.append("file", file);
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("subject", formData.subject);
    data.append("department", formData.department);
    data.append("semester", formData.semester);
    data.append("type", formData.type);

    if (formData.year) data.append("year", formData.year);
    if (formData.examType) data.append("examType", formData.examType);

    try {
      // ✅ ALWAYS create request in /requests
      const response = await api.post("/requests", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("Request created:", response);

      onSuccess?.();
      resetForm();
      onClose();
    } catch (err) {
      console.error("Upload error:", err);
      setError(err.response?.data?.message || "Upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Submit Note Request</h2>
          <button className="close-btn" onClick={onClose}>
            <FiX />
          </button>
        </div>

        {error && (
          <div
            style={{
              backgroundColor: "#fee2e2",
              color: "#dc2626",
              padding: "12px 16px",
              borderRadius: "8px",
              marginBottom: "1.5rem",
              fontSize: "0.9rem",
              borderLeft: "4px solid #dc2626",
            }}
          >
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ marginBottom: "1.5rem" }}>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>
              Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              style={{
                width: "100%",
                padding: "12px 16px",
                border: "2px solid #e2e8f0",
                borderRadius: "10px",
              }}
            />
          </div>

          <div className="form-group" style={{ marginBottom: "1.5rem" }}>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>
              Description
            </label>
            <textarea
              name="description"
              rows="3"
              value={formData.description}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "12px 16px",
                border: "2px solid #e2e8f0",
                borderRadius: "10px",
              }}
            />
          </div>

          <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem" }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>
                Subject *
              </label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  border: "2px solid #e2e8f0",
                  borderRadius: "10px",
                }}
              />
            </div>

            <div style={{ flex: 1 }}>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>
                Department *
              </label>
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                required
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  border: "2px solid #e2e8f0",
                  borderRadius: "10px",
                  backgroundColor: "white",
                }}
              >
                <option value="">Select Department</option>
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem" }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>
                Semester *
              </label>
              <select
                name="semester"
                value={formData.semester}
                onChange={handleChange}
                required
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  border: "2px solid #e2e8f0",
                  borderRadius: "10px",
                  backgroundColor: "white",
                }}
              >
                <option value="">Select Semester</option>
                {semesters.map((sem) => (
                  <option key={sem} value={sem}>
                    Semester {sem}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ flex: 1 }}>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>
                Type *
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  border: "2px solid #e2e8f0",
                  borderRadius: "10px",
                  backgroundColor: "white",
                }}
              >
                <option value="note">Note</option>
                <option value="pastpaper">Past Paper</option>
              </select>
            </div>
          </div>

          {formData.type === "pastpaper" && (
            <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem" }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>
                  Year
                </label>
                <input
                  type="number"
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  min="2000"
                  max="2030"
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    border: "2px solid #e2e8f0",
                    borderRadius: "10px",
                  }}
                />
              </div>

              <div style={{ flex: 1 }}>
                <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>
                  Exam Type
                </label>
                <select
                  name="examType"
                  value={formData.examType}
                  onChange={handleChange}
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    border: "2px solid #e2e8f0",
                    borderRadius: "10px",
                    backgroundColor: "white",
                  }}
                >
                  {examTypes.map((t) => (
                    <option key={t} value={t}>
                      {t.toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          <div style={{ marginBottom: "2rem" }}>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>
              File * (PDF / Images)
            </label>

            <div
              style={{
                border: "2px dashed #ddd",
                borderRadius: "10px",
                padding: "2rem",
                textAlign: "center",
                cursor: "pointer",
                backgroundColor: file ? "#e8f5e9" : "#f8f9fa",
              }}
            >
              <input
                type="file"
                id="file-upload"
                onChange={handleFileChange}
                accept=".pdf,.png,.jpg,.jpeg"
                style={{ display: "none" }}
              />
              <label htmlFor="file-upload" style={{ cursor: "pointer" }}>
                <FiUpload size={32} color="#4361ee" />
                <p style={{ marginTop: "1rem", fontWeight: "500" }}>
                  {file ? file.name : "Click to select file"}
                </p>
              </label>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem" }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: "12px 24px",
                background: "#e2e8f0",
                border: "none",
                borderRadius: "10px",
                cursor: "pointer",
                fontWeight: "600",
              }}
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              style={{
                padding: "12px 24px",
                background: loading ? "#94a3b8" : "#4361ee",
                color: "white",
                border: "none",
                borderRadius: "10px",
                cursor: loading ? "not-allowed" : "pointer",
                fontWeight: "600",
              }}
            >
              {loading ? "Submitting..." : "Submit Request"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadModal;
