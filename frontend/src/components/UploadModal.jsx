import React, { useState } from 'react';
import api from '../services/api';
import { FiX, FiUpload, FiFile } from 'react-icons/fi';

const UploadModal = ({ onClose, type = 'note', onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [file, setFile] = useState(null);
  
  // Get user from localStorage
  const userData = localStorage.getItem('user');
  const user = userData ? JSON.parse(userData) : null;
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subject: '',
    department: user?.department || '',
    semester: '',
    type: type,
    year: '',
    examType: type === 'pastpaper' ? 'endsem' : 'other'
  });

  const departments = ['Computer Science', 'Electronics', 'Mechanical', 'Civil', 'Electrical'];
  const semesters = [1, 2, 3, 4, 5, 6, 7, 8];
  const examTypes = ['midsem', 'endsem', 'quiz', 'other'];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Validate file size (10MB limit)
      if (selectedFile.size > 10 * 1024 * 1024) {
        setError('File size must be less than 10MB');
        e.target.value = ''; // Clear file input
        setFile(null);
        return;
      }
      
      // Validate file type
      const allowedTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'];
      if (!allowedTypes.includes(selectedFile.type)) {
        setError('Only PDF, PNG, JPG files are allowed');
        e.target.value = ''; // Clear file input
        setFile(null);
        return;
      }
      
      setFile(selectedFile);
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validation
    if (!formData.title.trim()) {
      setError('Title is required');
      setLoading(false);
      return;
    }
    if (!formData.subject.trim()) {
      setError('Subject is required');
      setLoading(false);
      return;
    }
    if (!formData.department) {
      setError('Department is required');
      setLoading(false);
      return;
    }
    if (!formData.semester) {
      setError('Semester is required');
      setLoading(false);
      return;
    }
    if (!file) {
      setError('Please select a file');
      setLoading(false);
      return;
    }

    const data = new FormData();
    data.append('file', file);
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('subject', formData.subject);
    data.append('department', formData.department);
    data.append('semester', formData.semester);
    data.append('type', formData.type);
    
    if (formData.year) {
      data.append('year', formData.year);
    }
    if (formData.examType) {
      data.append('examType', formData.examType);
    }

    try {
      const endpoint = type === 'note' ? '/notes/upload' : '/requests';
      await api.post(endpoint, data, {
        headers: { 
          'Content-Type': 'multipart/form-data' 
        }
      });
      
      onSuccess?.();
      onClose();
    } catch (err) {
      console.error('Upload error:', err);
      setError(err.response?.data?.message || 'Upload failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{type === 'note' ? 'Upload Note' : 'Request Note'}</h2>
          <button className="close-btn" onClick={onClose}>
            <FiX />
          </button>
        </div>

        {error && (
          <div style={{
            backgroundColor: '#fee2e2',
            color: '#dc2626',
            padding: '12px 16px',
            borderRadius: '8px',
            marginBottom: '1.5rem',
            fontSize: '0.9rem',
            borderLeft: '4px solid #dc2626'
          }}>
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '0.5rem',
              fontWeight: '500',
              color: '#334155'
            }}>Title *</label>
            <input
              type="text"
              name="title"
              className="form-control"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="e.g., DBMS Lecture Notes - Unit 1 to 5"
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '2px solid #e2e8f0',
                borderRadius: '10px',
                fontSize: '1rem'
              }}
            />
          </div>

          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '0.5rem',
              fontWeight: '500',
              color: '#334155'
            }}>Description</label>
            <textarea
              name="description"
              className="form-control"
              rows="3"
              value={formData.description}
              onChange={handleChange}
              placeholder="Brief description of the note..."
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '2px solid #e2e8f0',
                borderRadius: '10px',
                fontSize: '1rem',
                resize: 'vertical'
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '0.5rem',
                fontWeight: '500',
                color: '#334155'
              }}>Subject *</label>
              <input
                type="text"
                name="subject"
                className="form-control"
                value={formData.subject}
                onChange={handleChange}
                required
                placeholder="e.g., Database Management"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '2px solid #e2e8f0',
                  borderRadius: '10px',
                  fontSize: '1rem'
                }}
              />
            </div>

            <div className="form-group" style={{ flex: 1 }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '0.5rem',
                fontWeight: '500',
                color: '#334155'
              }}>Department *</label>
              <select
                name="department"
                className="form-control"
                value={formData.department}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '2px solid #e2e8f0',
                  borderRadius: '10px',
                  fontSize: '1rem',
                  backgroundColor: 'white'
                }}
              >
                <option value="">Select Department</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '0.5rem',
                fontWeight: '500',
                color: '#334155'
              }}>Semester *</label>
              <select
                name="semester"
                className="form-control"
                value={formData.semester}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '2px solid #e2e8f0',
                  borderRadius: '10px',
                  fontSize: '1rem',
                  backgroundColor: 'white'
                }}
              >
                <option value="">Select Semester</option>
                {semesters.map(sem => (
                  <option key={sem} value={sem}>Semester {sem}</option>
                ))}
              </select>
            </div>

            <div className="form-group" style={{ flex: 1 }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '0.5rem',
                fontWeight: '500',
                color: '#334155'
              }}>Type *</label>
              <select
                name="type"
                className="form-control"
                value={formData.type}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '2px solid #e2e8f0',
                  borderRadius: '10px',
                  fontSize: '1rem',
                  backgroundColor: 'white'
                }}
              >
                <option value="note">Note</option>
                <option value="pastpaper">Past Paper</option>
              </select>
            </div>
          </div>

          {formData.type === 'pastpaper' && (
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
              <div className="form-group" style={{ flex: 1 }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '0.5rem',
                  fontWeight: '500',
                  color: '#334155'
                }}>Year</label>
                <input
                  type="number"
                  name="year"
                  className="form-control"
                  value={formData.year}
                  onChange={handleChange}
                  placeholder="e.g., 2025"
                  min="2000"
                  max="2030"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #e2e8f0',
                    borderRadius: '10px',
                    fontSize: '1rem'
                  }}
                />
              </div>

              <div className="form-group" style={{ flex: 1 }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '0.5rem',
                  fontWeight: '500',
                  color: '#334155'
                }}>Exam Type</label>
                <select
                  name="examType"
                  className="form-control"
                  value={formData.examType}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #e2e8f0',
                    borderRadius: '10px',
                    fontSize: '1rem',
                    backgroundColor: 'white'
                  }}
                >
                  {examTypes.map(type => (
                    <option key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          <div className="form-group" style={{ marginBottom: '2rem' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '0.5rem',
              fontWeight: '500',
              color: '#334155'
            }}>File * (PDF or Images, max 10MB)</label>
            <div style={{
              border: '2px dashed #ddd',
              borderRadius: '10px',
              padding: '2rem',
              textAlign: 'center',
              cursor: 'pointer',
              backgroundColor: file ? '#e8f5e9' : '#f8f9fa',
              transition: 'all 0.3s'
            }}>
              <input
                type="file"
                id="file-upload"
                onChange={handleFileChange}
                accept=".pdf,.png,.jpg,.jpeg"
                style={{ display: 'none' }}
                required
              />
              <label htmlFor="file-upload" style={{ cursor: 'pointer' }}>
                <FiUpload size={32} color="#4361ee" />
                <p style={{ marginTop: '1rem', fontWeight: '500' }}>
                  {file ? file.name : 'Click to select file'}
                </p>
                <p style={{ fontSize: '0.9rem', color: '#6c757d', marginTop: '0.5rem' }}>
                  Supports PDF, PNG, JPG (Max 10MB)
                </p>
              </label>
            </div>
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '1rem',
            marginTop: '2rem'
          }}>
            <button 
              type="button" 
              onClick={onClose}
              style={{
                padding: '12px 24px',
                background: '#e2e8f0',
                color: '#334155',
                border: 'none',
                borderRadius: '10px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={loading}
              style={{
                padding: '12px 24px',
                background: loading ? '#94a3b8' : '#4361ee',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? 'Uploading...' : type === 'note' ? 'Upload Note' : 'Submit Request'}
            </button>
          </div>
        </form>
      </div>

      <style jsx>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }
        
        .modal-content {
          background: white;
          border-radius: 20px;
          padding: 2rem;
          width: 90%;
          max-width: 600px;
          max-height: 90vh;
          overflow-y: auto;
        }
        
        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }
        
        .close-btn {
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          color: #6c757d;
        }
        
        input:focus, select:focus, textarea:focus {
          outline: none;
          border-color: #4361ee !important;
          box-shadow: 0 0 0 3px rgba(67, 97, 238, 0.1);
        }
      `}</style>
    </div>
  );
};

export default UploadModal;