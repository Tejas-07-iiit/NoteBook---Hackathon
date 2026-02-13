# Full Application Code

## frontend/src/App.js
```

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Notes from './pages/Notes';
import Requests from './pages/Requests';
import Profile from './pages/Profile';
import Colleges from './pages/Colleges';
import Upload from './pages/Upload';
import { ThemeProvider } from './context/ThemeContext';
import './App.css';
import './Main.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');

    if (token && user) {
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const handleLogin = (token, user) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    window.location.href = '/login';
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <ThemeProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Public route - redirect to dashboard if already logged in */}
            <Route
              path="/login"
              element={
                isAuthenticated ?
                  <Navigate to="/" /> :
                  <Login onLogin={handleLogin} />
              }
            />

            {/* Protected routes */}
            <Route
              path="/"
              element={
                isAuthenticated ?
                  <Dashboard onLogout={handleLogout} /> :
                  <Navigate to="/login" />
              }
            />
            <Route
              path="/notes"
              element={
                isAuthenticated ?
                  <Notes onLogout={handleLogout} /> :
                  <Navigate to="/login" />
              }
            />
            <Route
              path="/requests"
              element={
                isAuthenticated ?
                  <Requests onLogout={handleLogout} /> :
                  <Navigate to="/login" />
              }
            />
            <Route
              path="/profile"
              element={
                isAuthenticated ?
                  <Profile onLogout={handleLogout} /> :
                  <Navigate to="/login" />
              }
            />
            <Route
              path="/colleges"
              element={
                isAuthenticated ?
                  <Colleges onLogout={handleLogout} /> :
                  <Navigate to="/login" />
              }
            />
            <Route
              path="/upload"
              element={
                isAuthenticated ?
                  <Upload onLogout={handleLogout} /> :
                  <Navigate to="/login" />
              }
            />

            {/* Catch all route */}
            <Route path="*" element={<Navigate to={isAuthenticated ? "/" : "/login"} />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
```


## frontend/src/App.test.js
```

import { render, screen } from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});

```


## frontend/src/components/FilterBar.jsx
```

import React from 'react';
import { FiSearch, FiFilter } from 'react-icons/fi';

const FilterBar = ({ filters, onFilterChange, departments, semesters, types, examTypes }) => {
  return (
    <div className="filter-bar">
      <div className="search-box">
        <FiSearch className="search-icon" />
        <input
          type="text"
          placeholder="Search notes by title or subject..."
          value={filters.search}
          onChange={(e) => onFilterChange('search', e.target.value)}
        />
      </div>
      
      <div className="filter-group">
        <select
          className="form-control"
          value={filters.department}
          onChange={(e) => onFilterChange('department', e.target.value)}
        >
          <option value="">All Departments</option>
          {departments?.map(dept => (
            <option key={dept} value={dept}>{dept}</option>
          ))}
        </select>
      </div>
      
      <div className="filter-group">
        <select
          className="form-control"
          value={filters.semester}
          onChange={(e) => onFilterChange('semester', e.target.value)}
        >
          <option value="">All Semesters</option>
          {semesters?.map(sem => (
            <option key={sem} value={sem}>Sem {sem}</option>
          ))}
        </select>
      </div>
      
      <div className="filter-group">
        <select
          className="form-control"
          value={filters.type}
          onChange={(e) => onFilterChange('type', e.target.value)}
        >
          <option value="">All Types</option>
          <option value="note">Notes</option>
          <option value="pastpaper">Past Papers</option>
        </select>
      </div>
      
      {filters.type === 'pastpaper' && (
        <div className="filter-group">
          <select
            className="form-control"
            value={filters.examType}
            onChange={(e) => onFilterChange('examType', e.target.value)}
          >
            <option value="">All Exam Types</option>
            {examTypes?.map(type => (
              <option key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </option>
            ))}
          </select>
        </div>
      )}
      
      <button 
        className="btn btn-secondary"
        onClick={() => {
          // Reset all filters
          ['search', 'department', 'semester', 'subject', 'type', 'year', 'examType'].forEach(
            key => onFilterChange(key, '')
          );
        }}
      >
        <FiFilter /> Clear Filters
      </button>
    </div>
  );
};

export default FilterBar;
```


## frontend/src/components/Header.jsx
```

import React from 'react';
import { FiBell, FiSearch, FiSun, FiMoon } from 'react-icons/fi';
import { useTheme } from '../context/ThemeContext';

const Header = ({ title, subtitle }) => {
  // Get user from localStorage
  const userData = localStorage.getItem('user');
  const user = userData ? JSON.parse(userData) : null;
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="header">
      <div className="header-left">
        <h1>{title}</h1>
        <p className="subtitle">{subtitle}</p>
      </div>

      <div className="header-right">
        <div className="search-box">
          <FiSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search notes..."
            className="search-input"
          />
        </div>


        <div className="user-info">
          <button className="theme-btn" onClick={toggleTheme}>
            {theme === 'light' ? <FiMoon /> : <FiSun />}
          </button>
          <button className="notification-btn">
            <FiBell />
          </button>
          <div className="user-avatar">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="user-details">
            <span className="user-name">{user?.name || 'User'}</span>
            <span className="user-role">{user?.role || 'Student'}</span>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Header; // Make sure this is default export!
```


## frontend/src/components/NoteCard.jsx
```

import React from 'react';
import { FiDownload, FiCalendar, FiUser, FiBook } from 'react-icons/fi';

const NoteCard = ({ note }) => {
  const getTypeLabel = (type) => {
    return type === 'pastpaper' ? 'Past Paper' : 'Note';
  };

  const getExamTypeLabel = (examType) => {
    const labels = {
      midsem: 'Mid Sem',
      endsem: 'End Sem',
      quiz: 'Quiz',
      other: 'Other'
    };
    return labels[examType] || examType;
  };

  const handleDownload = () => {
    if (note.fileUrl) {
      window.open(`${process.env.REACT_APP_API_URL}${note.fileUrl}`, '_blank');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="note-card">
      <div className="note-header">
        <span className={`note-type ${note.type}`}>
          {getTypeLabel(note.type)}
        </span>
        <h3>{note.title || 'Untitled Note'}</h3>
        <p>{note.description || 'No description'}</p>
      </div>

      <div className="note-body">
        <div className="note-meta">
          <span><FiBook /> {note.subject || 'Unknown Subject'}</span>
          <span>Sem {note.semester || 'N/A'}</span>
          {note.year && <span>Year: {note.year}</span>}
          {note.examType && note.examType !== 'other' && (
            <span>{getExamTypeLabel(note.examType)}</span>
          )}
        </div>

        <div className="note-meta">
          <span><FiUser /> {note.uploadedBy?.name || 'Unknown User'}</span>
          <span><FiCalendar /> {note.createdAt ? formatDate(note.createdAt) : 'Unknown Date'}</span>
        </div>
      </div>

      <div className="note-footer">
        <button className="btn btn-sm btn-primary" onClick={handleDownload}>
          <FiDownload /> Download
        </button>
        <span className="department-badge">
          {note.department || 'Unknown Dept'}
        </span>
      </div>
    </div>
  );
};

export default NoteCard; // Make sure this is default export!
```


## frontend/src/components/PrivateRoute.jsx
```

import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const userData = localStorage.getItem('user');
  const user = userData ? JSON.parse(userData) : null;

  return user ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
```


## frontend/src/components/Sidebar.jsx
```

import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  FiHome, FiBook, FiUpload, FiDownload,
  FiUsers, FiSettings, FiLogOut
} from 'react-icons/fi';

const Sidebar = ({ onLogout }) => {
  // Get user from localStorage instead of AuthContext
  const userData = localStorage.getItem('user');
  const user = userData ? JSON.parse(userData) : null;

  const navItems = [
    { path: '/', icon: <FiHome />, label: 'Dashboard' },
    { path: '/notes', icon: <FiBook />, label: 'Notes Library' },
    { path: '/upload', icon: <FiUpload />, label: 'Upload Notes' },
    { path: '/colleges', icon: <FiHome />, label: 'Colleges' },
  ];

  if (user?.role === 'student') {
    navItems.push(
      { path: '/requests', icon: <FiDownload />, label: 'My Requests' }
    );
  }

  if (user?.role === 'teacher') {
    navItems.push(
      { path: '/requests', icon: <FiUsers />, label: 'Review Requests' }
    );
  }

  return (
    <div className="sidebar">
      <div className="logo">
        <FiBook size={28} />
        <span>Notebook</span>
      </div>

      <nav className="nav-links">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `nav-item ${isActive ? 'active' : ''}`
            }
          >
            <span className="nav-icon">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <NavLink to="/profile" className="nav-item">
          <span className="nav-icon"><FiSettings /></span>
          <span>Profile</span>
        </NavLink>
        <button onClick={onLogout} className="nav-item">
          <span className="nav-icon"><FiLogOut /></span>
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
```


## frontend/src/components/StatsCard.jsx
```

const StatsCard = ({ icon, value, label, color }) => {
  const colorClasses = {
    note: { bg: '#e0e7ff', color: '#4361ee' },
    paper: { bg: '#fce7f3', color: '#f72585' },
    subject: { bg: '#d1fae5', color: '#10b981' }
  };

  const selectedColor = colorClasses[color] || colorClasses.note;

  return (
    <div className="stat-card">
      <div className="stat-icon" style={{ backgroundColor: selectedColor.bg, color: selectedColor.color }}>
        {icon}
      </div>
      <div className="stat-info">
        <h3>{value}</h3>
        <p>{label}</p>
      </div>
    </div>
  );
};

export default StatsCard; // Make sure this is default export!
```


## frontend/src/components/UploadModal.jsx
```

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
          <div>
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>
              Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              
            />
          </div>

          <div className="form-group">
            <label>
              Description
            </label>
            <textarea
              name="description"
              rows="3"
              value={formData.description}
              onChange={handleChange}
              
            />
          </div>

          <div >
            <div >
              <label >
                Subject *
              </label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                
              />
            </div>

            <div >
              <label >
                Department *
              </label>
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                required
                
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

          <div>
            <div>
              <label>
                Semester *
              </label>
              <select
                name="semester"
                value={formData.semester}
                onChange={handleChange}
                required
                
              >
                <option value="">Select Semester</option>
                {semesters.map((sem) => (
                  <option key={sem} value={sem}>
                    Semester {sem}
                  </option>
                ))}
              </select>
            </div>

            <div >
              <label >
                Type *
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
              
              >
                <option value="note">Note</option>
                <option value="pastpaper">Past Paper</option>
              </select>
            </div>
          </div>

          {formData.type === "pastpaper" && (
            <div>
              <div>
                <label>
                  Year
                </label>
                <input
                  type="number"
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  min="2000"
                  max="2030"
                  
                />
              </div>

              <div >
                <label >
                  Exam Type
                </label>
                <select
                  name="examType"
                  value={formData.examType}
                  onChange={handleChange}
                  
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

          <div>
            <label>
              File * (PDF / Images)
            </label>

            <div
              
            >
              <input
                type="file"
                id="file-upload"
                onChange={handleFileChange}
                accept=".pdf,.png,.jpg,.jpeg"
                
              />
              <label htmlFor="file-upload">
                <FiUpload size={32} color="#4361ee" />
                <p>
                  {file ? file.name : "Click to select file"}
                </p>
              </label>
            </div>
          </div>

          <div>
            <button
              type="button"
              onClick={onClose}
              
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
       
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

```


## frontend/src/context/AuthContext.jsx
```

import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUser = async () => {
    try {
      const response = await api.get('/auth/me');
      setUser(response.data);
    } catch (error) {
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      setUser(user);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Login failed' };
    }
  };

  const register = async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      setUser(user);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Registration failed' };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
```


## frontend/src/context/ThemeContext.js
```

import React, { createContext, useState, useEffect, useContext } from 'react';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    // Check local storage for saved theme
    const savedTheme = localStorage.getItem('theme');
    // Check system preference if no saved theme
    if (!savedTheme) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return savedTheme;
  });

  useEffect(() => {
    // Save theme to local storage
    localStorage.setItem('theme', theme);
    // Apply theme to document
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

```
    return (
        <div className="dashboard-container">
            <Sidebar onLogout={onLogout} />
            <div className="main-content">
                <Header title="Colleges" />

                <div className="stats-grid">
                    {/* Add College Form */}
                    <div className="card">
                        <h3 className="mb-3">Add New College</h3>
                        {error && <div className="alert alert-error">{error}</div>}
                        {success && <div className="alert alert-success">{success}</div>}

                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>College Name</label>
                                <input
                                    type="text"
                                    name="collegeName"
                                    value={formData.collegeName}
                                    onChange={handleChange}
                                    placeholder="e.g. IIT Bombay"
                                    className="form-input"
                                />
                            </div>

                            <div className="form-group">
                                <label>College Code</label>
                                <input
                                    type="text"
                                    name="collegeCode"
                                    value={formData.collegeCode}
                                    onChange={handleChange}
                                    placeholder="e.g. IITB"
                                    className="form-input"
                                />
                            </div>

                            <button type="submit" className="btn btn-primary w-100 mt-4">
                                <FiPlus /> Add College
                            </button>
                        </form>
                    </div>

                    {/* List Colleges */}
                    <div className="card">
                        <h3 className="mb-3">Existing Colleges</h3>
                        {loading ? (
                            <div className="text-center p-5">
                                <div className="spinner mx-auto"></div>
                                <p>Loading...</p>
                            </div>
                        ) : colleges.length === 0 ? (
                            <div className="empty-state">
                                <p>No colleges found.</p>
                            </div>
                        ) : (
                            <div>
                                <ul>
                                    {colleges.map((college) => (
                                        <li key={college._id} className="d-flex justify-between align-center p-3 border-bottom">
                                            <div>
                                                <strong>{college.collegeName}</strong>
                                                <div className="text-sm text-secondary">{college.collegeCode}</div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Colleges;

```


## frontend/src/pages/Dashboard.jsx
```

import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import StatsCard from "../components/StatsCard";
import NoteCard from "../components/NoteCard";
import api from "../services/api";
import { FiBook, FiFileText, FiBookOpen } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const Dashboard = ({ onLogout }) => {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalNotes: 0,
    pastPapers: 0,
    subjects: 0,
  });

  const [recentNotes, setRecentNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }

    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const userData = JSON.parse(localStorage.getItem("user"));
      const collegeId = userData?.collegeId;

      if (!collegeId) {
        console.error("No collegeId found for user");
        setLoading(false);
        return;
      }

      const notes = await api.get(`/notes?college=${collegeId}&limit=4`);

      setRecentNotes(notes || []);

      const pastPapers = (notes || []).filter((note) => note.type === "pastpaper").length;
      const uniqueSubjects = [...new Set((notes || []).map((note) => note.subject))].length;

      setStats({
        totalNotes: (notes || []).length,
        pastPapers,
        subjects: uniqueSubjects,
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-container">
      <Sidebar onLogout={onLogout} />

      <div className="main-content">
        <Header
          title="Dashboard"
          subtitle={`Welcome back, ${user?.name || "User"}! Here's what's happening with your study materials.`}
        />

        <div className="stats-grid">
          <StatsCard icon={<FiBook />} value={stats.totalNotes} label="Total Notes" color="note" />
          <StatsCard icon={<FiFileText />} value={stats.pastPapers} label="Past Papers" color="paper" />
          <StatsCard icon={<FiBookOpen />} value={stats.subjects} label="Subjects" color="subject" />
        </div>

        <div className="section">
          <div className="section-header">
            <h2>Recent Uploads</h2>
            <button onClick={() => navigate("/notes")} className="btn btn-secondary">
              View All
            </button>
          </div>

          {loading ? (
            <div className="loading">Loading...</div>
          ) : recentNotes.length > 0 ? (
            <div className="notes-grid">
              {recentNotes.map((note) => (
                <NoteCard key={note._id} note={note} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p>No notes uploaded yet in your college.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
```


## frontend/src/pages/Login.jsx
```

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiBook, FiMail, FiLock, FiUser, FiHome } from 'react-icons/fi';
import axios from 'axios';

const Login = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [colleges, setColleges] = useState([]);
  const [collegesLoading, setCollegesLoading] = useState(false);

  // Form states
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student',
    collegeId: ''
  });

  const navigate = useNavigate();
  const API_URL = `${process.env.REACT_APP_API_URL}/api`;

  // Check if already logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/');
    }
  }, [navigate]);

  // Fetch colleges
  const fetchColleges = React.useCallback(async () => {
    try {
      setCollegesLoading(true);
      console.log("Fetching colleges from:", `${API_URL}/colleges`);
      const response = await axios.get(`${API_URL}/colleges`);
      console.log("Colleges fetched:", response.data);
      setColleges(response.data);

      // Auto-select first college if none selected
      if (response.data.length > 0 && !registerData.collegeId) {
        console.log("Auto-selecting first college:", response.data[0]._id);
        setRegisterData(prev => ({
          ...prev,
          collegeId: response.data[0]._id
        }));
      }
    } catch (err) {
      console.error('Error fetching colleges:', err);
      setError('Could not load colleges list. Please try again.');
    } finally {
      setCollegesLoading(false);
    }
  }, [API_URL, registerData.collegeId]);

  useEffect(() => {
    if (!isLogin && colleges.length === 0) {
      fetchColleges();
    }
  }, [isLogin, colleges.length, fetchColleges]);

  const handleLoginChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value
    });
  };

  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    console.log(`Setting ${name} to:`, value);
    setRegisterData({
      ...registerData,
      [name]: value
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (!loginData.email || !loginData.password) {
      setError('Email and password are required');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email: loginData.email.trim(),
        password: loginData.password
      });

      console.log("Login successful:", response.data);

      // Save token and user data
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      // Call onLogin callback if provided
      if (onLogin && typeof onLogin === 'function') {
        onLogin(response.data.token, response.data.user);
      }

      setSuccess('Login successful! Redirecting...');

      // Navigate to dashboard
      navigate('/');

    } catch (err) {
      console.error("Login error:", err.response?.data || err.message);
      setError(err.response?.data?.message || 'Login failed. Check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    console.log("Register attempt with data:", registerData);

    // Validation
    const { name, email, password, role, collegeId } = registerData;

    if (!name?.trim()) {
      setError('Name is required');
      setLoading(false);
      return;
    }
    if (!email?.trim()) {
      setError('Email is required');
      setLoading(false);
      return;
    }
    if (!password) {
      setError('Password is required');
      setLoading(false);
      return;
    }
    if (!collegeId) {
      setError('Please select a college');
      setLoading(false);
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    try {
      const dataToSend = {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password: password,
        role: role,
        collegeId: collegeId
      };

      console.log("Sending to backend:", dataToSend);

      const response = await axios.post(`${API_URL}/auth/register`, dataToSend);

      console.log("Registration successful:", response.data);

      // Save token and user data
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      // Call onLogin callback if provided
      if (onLogin && typeof onLogin === 'function') {
        onLogin(response.data.token, response.data.user);
      }

      setSuccess('Registration successful! Redirecting...');

      // Navigate to dashboard
      navigate('/');

    } catch (err) {
      console.error("Registration error details:", {
        status: err.response?.status,
        data: err.response?.data,
        message: err.message
      });

      if (err.response?.data?.message) {
        setError(`Server: ${err.response.data.message}`);
      } else if (err.response?.status === 400) {
        setError('Bad request. Please check all fields.');
      } else if (err.response?.status === 500) {
        setError('Server error. Please try again later.');
      } else if (err.message === 'Network Error') {
        setError(`Cannot connect to server. Is backend running on ${process.env.REACT_APP_API_URL} ?`);
      } else {
        setError('Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        {/* Header */}
        <div className="login-header">
          <div className="logo">
            <FiBook size={48} color="#4361ee" />
            <h1>Notebook</h1>
            <p>College Notes Management System</p>
          </div>
        </div>

        {/* Toggle Buttons */}
        <div className="toggle-buttons">
          <button
            onClick={() => setIsLogin(true)}
            className={isLogin ? 'active' : ''}
          >
            Login
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={!isLogin ? 'active' : ''}
          >
            Register
          </button>
        </div>

        {/* Error/Success Messages */}
        {error && (
          <div className="alert alert-error">
            ⚠️ {error}
          </div>
        )}

        {success && (
          <div className="alert alert-success">
            ✅ {success}
          </div>
        )}

        {/* Show college loading/error */}
        {!isLogin && collegesLoading && (
          <div className="info-message">
            Loading colleges...
          </div>
        )}

        {!isLogin && !collegesLoading && colleges.length === 0 && (
          <div className="alert alert-warning">
            No colleges found. Please contact administrator.
          </div>
        )}

        {/* Login Form */}
        {isLogin ? (
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label>
                <FiMail /> Email Address
              </label>
              <input
                type="email"
                name="email"
                value={loginData.email}
                onChange={handleLoginChange}
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="form-group">
              <label>
                <FiLock /> Password
              </label>
              <input
                type="password"
                name="password"
                value={loginData.password}
                onChange={handleLoginChange}
                placeholder="Enter your password"
                required
                minLength="6"
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Logging in...
                </>
              ) : 'Login'}
            </button>

            <div className="switch-form">
              <p>
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => setIsLogin(false)}
                  className="link-btn"
                >
                  Register here
                </button>
              </p>
            </div>
          </form>
        ) : (
          /* Registration Form */
          <form onSubmit={handleRegister}>
            <div className="form-group">
              <label>
                <FiUser /> Full Name
              </label>
              <input
                type="text"
                name="name"
                value={registerData.name}
                onChange={handleRegisterChange}
                placeholder="Enter your full name"
                required
              />
            </div>

            <div className="form-group">
              <label>
                <FiMail /> Email Address
              </label>
              <input
                type="email"
                name="email"
                value={registerData.email}
                onChange={handleRegisterChange}
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="form-group">
              <label>
                <FiHome /> College
              </label>
              <select
                name="collegeId"
                value={registerData.collegeId}
                onChange={handleRegisterChange}
                required
                disabled={collegesLoading || colleges.length === 0}
              >
                <option value="">
                  {collegesLoading ? 'Loading colleges...' :
                    colleges.length === 0 ? 'No colleges available' :
                      'Select your college'}
                </option>
                {colleges.map(college => (
                  <option key={college._id} value={college._id}>
                    {college.collegeName} ({college.collegeCode})
                  </option>
                ))}
              </select>
              {colleges.length > 0 && (
                <small>
                  {colleges.length} college(s) available
                </small>
              )}
            </div>

            <div className="form-group">
              <label>Role</label>
              <select
                name="role"
                value={registerData.role}
                onChange={handleRegisterChange}
              >
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
              </select>
            </div>

            <div className="form-group">
              <label>
                <FiLock /> Password
              </label>
              <input
                type="password"
                name="password"
                value={registerData.password}
                onChange={handleRegisterChange}
                placeholder="Enter password (min. 6 characters)"
                required
                minLength="6"
              />
              <small>Password must be at least 6 characters long</small>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading || collegesLoading || colleges.length === 0}
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Registering...
                </>
              ) : colleges.length === 0 ? 'No Colleges Available' : 'Create Account'}
            </button>

            <div className="switch-form">
              <p>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setIsLogin(true)}
                  className="link-btn"
                >
                  Login here
                </button>
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;
```


## frontend/src/pages/Notes.jsx
```

import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import NoteCard from '../components/NoteCard';
import FilterBar from '../components/FilterBar';
import UploadModal from '../components/UploadModal';
import api from '../services/api';
import { FiPlus } from 'react-icons/fi';

const Notes = () => {

  const userData = localStorage.getItem('user');
  const user = userData ? JSON.parse(userData) : null;

  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    department: '',
    semester: '',
    subject: '',
    type: '',
    year: '',
    examType: ''
  });


  const departments = ['Computer Science', 'Electronics', 'Mechanical', 'Civil', 'Electrical'];
  const semesters = [1, 2, 3, 4, 5, 6, 7, 8];
  const types = ['note', 'pastpaper'];
  const examTypes = ['midsem', 'endsem', 'quiz', 'other'];

  const fetchNotes = React.useCallback(async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value);
      });

      const response = await api.get(`/notes?${queryParams}`);
      setNotes(response);
    } catch (error) {
      console.error('Error fetching notes:', error);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="dashboard-container">
      <Sidebar />

      <div className="main-content">
        <Header
          title="Notes Library"
          subtitle="Browse and download study materials"
        />

        <FilterBar
          filters={filters}
          onFilterChange={handleFilterChange}
          departments={departments}
          semesters={semesters}
          types={types}
          examTypes={examTypes}
        />

        <div className="section-header">
          <h2>All Study Materials ({notes.length})</h2>
          {(user?.role === 'teacher' || user?.role === 'admin') && (
            <button
              className="btn btn-primary"
              onClick={() => setShowUploadModal(true)}
            >
              <FiPlus /> Upload New
            </button>
          )}
        </div>

        {loading ? (
          <div className="loading">Loading notes...</div>
        ) : notes.length > 0 ? (
          <div className="notes-grid">
            {notes.map((note) => (
              <NoteCard key={note._id} note={note} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p>No notes found matching your filters.</p>
          </div>
        )}
      </div>

      {showUploadModal && (
        <UploadModal onClose={() => setShowUploadModal(false)} onSuccess={fetchNotes} />
      )}
    </div>
  );
};

export default Notes;
```


## frontend/src/pages/Profile.jsx
```

import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import api from '../services/api';
import { FiUser, FiMail, FiBook, FiEdit, FiSave, FiKey, FiFileText, FiClock, FiCheck, FiX } from 'react-icons/fi';

const Profile = ({ onLogout }) => {
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [colleges, setColleges] = useState([]);
  const [userRequests, setUserRequests] = useState([]);
  const [loadingRequests, setLoadingRequests] = useState(false);

  // Get user from localStorage
  const userData = localStorage.getItem('user');
  const initialUser = userData ? JSON.parse(userData) : null;

  const [user, setUser] = useState(initialUser);
  const [formData, setFormData] = useState({
    name: initialUser?.name || '',
    email: initialUser?.email || '',
    collegeId: initialUser?.collegeId || ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        collegeId: user.collegeId || ''
      });
      // Fetch user requests if student
      if (user.role === 'student') {
        fetchUserRequests();
      }
    }
    fetchColleges();
  }, [user]);

  const fetchColleges = async () => {
    try {
      const response = await api.get('/colleges');
      setColleges(response);
    } catch (error) {
      console.error('Error fetching colleges:', error);
    }
  };

  const fetchUserRequests = async () => {
    try {
      setLoadingRequests(true);
      const response = await api.get('/requests/my');
      setUserRequests(response);
    } catch (error) {
      console.error('Error fetching user requests:', error);
    } finally {
      setLoadingRequests(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Note: You'll need to create an update profile endpoint in your backend
      await api.put('/auth/profile', formData);

      // Update user in localStorage
      const updatedUser = { ...user, ...formData };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);

      setEditMode(false);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('New passwords do not match');
      return;
    }

    setLoading(true);

    try {
      // Note: You'll need to create a change password endpoint in your backend
      await api.put('/auth/change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });

      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });

      alert('Password changed successfully');
    } catch (error) {
      console.error('Error changing password:', error);
      alert('Failed to change password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getCollegeName = (collegeId) => {
    const college = colleges.find(c => c._id === collegeId);
    return college ? `${college.collegeName} (${college.collegeCode})` : 'Loading...';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved': return <FiCheck className="icon-success" />;
      case 'rejected': return <FiX className="icon-danger" />;
      default: return <FiClock className="icon-warning" />;
    }
  };

  if (!user) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <Sidebar onLogout={onLogout} />

      <div className="main-content">
        <Header
          title="My Profile"
          subtitle="Manage your account settings"
        />

        <div className="profile-container">
          {/* Profile Info Card */}
          <div className="card">
            <div className="card-header-flex">
              <h2>Profile Information</h2>
              <button
                className="btn btn-secondary"
                onClick={() => setEditMode(!editMode)}
              >
                <FiEdit /> {editMode ? 'Cancel' : 'Edit'}
              </button>
            </div>

            <form onSubmit={handleUpdateProfile}>
              <div className="form-group">
                <label><FiUser /> Full Name</label>
                {editMode ? (
                  <input
                    type="text"
                    className="form-control"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                ) : (
                  <div className="profile-value">{user.name}</div>
                )}
              </div>

              <div className="form-group">
                <label><FiMail /> Email Address</label>
                {editMode ? (
                  <input
                    type="email"
                    className="form-control"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                ) : (
                  <div className="profile-value">{user.email}</div>
                )}
              </div>

              <div className="form-group">
                <label><FiBook /> Role</label>
                <div className={`profile-value role-badge role-${user.role}`}>
                  {user.role}
                </div>
              </div>

              <div className="form-group">
                <label><FiBook /> College</label>
                {editMode ? (
                  <select
                    className="form-control"
                    value={formData.collegeId}
                    onChange={(e) => setFormData({ ...formData, collegeId: e.target.value })}
                    required
                  >
                    <option value="">Select College</option>
                    {colleges.map(college => (
                      <option key={college._id} value={college._id}>
                        {college.collegeName} ({college.collegeCode})
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="profile-value">{getCollegeName(user.collegeId)}</div>
                )}
              </div>

              {editMode && (
                <div className="form-actions">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    <FiSave /> {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              )}
            </form>
          </div>

          {/* Change Password Card */}
          <div className="card">
            <h2><FiKey /> Change Password</h2>

            <form onSubmit={handleChangePassword}>
              <div className="form-group">
                <label>Current Password</label>
                <input
                  type="password"
                  className="form-control"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>New Password</label>
                <input
                  type="password"
                  className="form-control"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  required
                  minLength="6"
                />
              </div>

              <div className="form-group">
                <label>Confirm New Password</label>
                <input
                  type="password"
                  className="form-control"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  required
                  minLength="6"
                />
              </div>

              <div className="form-actions">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? 'Changing...' : 'Change Password'}
                </button>
              </div>
            </form>

            {/* Account Actions */}
            <div className="account-actions">
              <h3>Account Actions</h3>

              <button
                className="btn btn-secondary"
                onClick={() => {
                  if (window.confirm('Are you sure you want to logout?')) {
                    onLogout();
                  }
                }}
              >
                Logout
              </button>

              <button
                className="btn btn-danger"
                onClick={() => {
                  if (window.confirm('This will permanently delete your account. Are you sure?')) {
                    alert('Account deletion functionality would be implemented here');
                  }
                }}
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>

        {/* User Stats */}
        <div className="card">
          <h3>Your Activity</h3>
          <div className="stats-grid-small">
            <div className="stat-item">
              <div className="stat-value">0</div>
              <div className="stat-label">Notes Uploaded</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">{userRequests.length}</div>
              <div className="stat-label">Requests Made</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">0</div>
              <div className="stat-label">Downloads</div>
            </div>
          </div>
        </div>

        {/* Request History (Only for Students) */}
        {user?.role === 'student' && (
          <div className="card mt-4">
            <h3 className="d-flex align-center gap-2 mb-3">
              <FiFileText /> My Request History
            </h3>
            {loadingRequests ? (
              <div className="text-center p-4">
                <div className="spinner"></div>
                <p>Loading request history...</p>
              </div>
            ) : userRequests.length > 0 ? (
              <div>
                <div className="table-container">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Title</th>
                        <th>Subject</th>
                        <th>Status</th>
                        <th>Date</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {userRequests.map((req) => (
                        <tr key={req._id}>
                          <td>
                            <div className="font-medium">{req.title}</div>
                            {req.description && (
                              <div className="table-description">
                                {req.description.length > 50 ? req.description.substring(0, 50) + '...' : req.description}
                              </div>
                            )}
                          </td>
                          <td>
                            <div>{req.subject}</div>
                            <div className="table-subtext">
                              Sem {req.semester} • {req.department}
                            </div>
                          </td>
                          <td>
                            <div className="status-badge-container">
                              {getStatusIcon(req.status)}
                              <span className={`status-badge status-${req.status}`}>
                                {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                              </span>
                            </div>
                            {req.teacherMessage && (
                              <div className="teacher-message">
                                {req.teacherMessage}
                              </div>
                            )}
                          </td>
                          <td className="table-date">
                            {new Date(req.createdAt).toLocaleDateString('en-IN', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </td>
                          <td>
                            <button
                              onClick={() => window.open(`${process.env.REACT_APP_API_URL}${req.fileUrl}`, '_blank')}
                              className="view-file-btn"
                            >
                              <FiFileText /> View File
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="text-center mt-3 table-subtext">
                  Showing {userRequests.length} request{userRequests.length !== 1 ? 's' : ''}
                </div>
              </div>
            ) : (
              <div className="empty-state">
                <FiFileText size={48} />
                <p>No requests submitted yet.</p>
                <p className="table-subtext">
                  Use the "Upload Notes" feature to submit your first request!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};



export default Profile;
```


## frontend/src/pages/Requests.jsx
```

import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import api from '../services/api';
import { FiPlus, FiClock, FiCheck, FiX, FiEye, FiUser, FiCalendar, FiBook } from 'react-icons/fi';

const Requests = ({ onLogout }) => {
  // Get user from localStorage
  const userData = localStorage.getItem('user');
  const user = userData ? JSON.parse(userData) : null;

  const [activeTab, setActiveTab] = useState('pending');
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [message, setMessage] = useState('');

  const fetchRequests = React.useCallback(async () => {
    try {
      setLoading(true);
      let endpoint;

      if (user?.role === 'student') {
        endpoint = '/requests/my';
      } else if (activeTab === 'pending') {
        endpoint = '/requests/pending';
      } else {
        endpoint = '/requests/reviewed';
      }

      console.log(`Fetching requests from: ${endpoint}`);
      const response = await api.get(endpoint);
      console.log('Requests fetched:', response);
      setRequests(response);
    } catch (error) {
      console.error('Error fetching requests:', error);
      setMessage('Error loading requests');
    } finally {
      setLoading(false);
    }
  }, [activeTab, user?.role]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const handleApprove = async (id) => {
    if (!window.confirm('Are you sure you want to approve this request?')) {
      return;
    }

    try {
      setActionLoading(id);
      console.log(`Approving request: ${id}`);

      const response = await api.put(`/requests/${id}/approve`);
      console.log('Approval response:', response);

      setMessage('Request approved successfully!');
      fetchRequests(); // Refresh the list

    } catch (error) {
      console.error('Error approving request:', error);
      setMessage(`Error: ${error.response?.data?.message || 'Failed to approve'}`);
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id) => {
    const reason = prompt('Please enter rejection reason:');
    if (!reason || reason.trim() === '') {
      alert('Rejection reason is required');
      return;
    }

    try {
      setActionLoading(id);
      console.log(`Rejecting request: ${id} with reason: ${reason}`);

      const response = await api.put(`/requests/${id}/reject`, {
        teacherMessage: reason.trim()
      });
      console.log('Rejection response:', response);

      setMessage('Request rejected successfully!');
      fetchRequests(); // Refresh the list

    } catch (error) {
      console.error('Error rejecting request:', error);
      setMessage(`Error: ${error.response?.data?.message || 'Failed to reject'}`);
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      pending: {
        className: 'badge',
        style: { background: 'var(--warning-light)', color: 'var(--warning)' },
        icon: <FiClock />,
        text: 'Pending Review'
      },
      approved: {
        className: 'badge',
        style: { background: 'var(--success-light)', color: 'var(--success)' },
        icon: <FiCheck />,
        text: 'Approved'
      },
      rejected: {
        className: 'badge',
        style: { background: 'var(--danger-light)', color: 'var(--danger)' },
        icon: <FiX />,
        text: 'Rejected'
      }
    };

    const config = styles[status] || styles.pending;

    return (
      <span className={config.className} style={{ ...config.style, display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 12px' }}>
        {config.icon} {config.text}
      </span>
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // If user is student, show only their requests
  if (user?.role === 'student') {
    return (
      <div className="dashboard-container">
        <Sidebar onLogout={onLogout} />

        <div className="main-content">
          <div className="d-flex justify-between align-center mb-4">
            <Header
              title="My Note Requests"
              subtitle="Track your submitted note requests"
            />
            <button
              className="btn btn-primary"
              onClick={() => window.location.href = '/upload'}
            >
              <FiPlus /> New Request
            </button>
          </div>

          {message && (
            <div className={`alert ${message.includes('Error') ? 'alert-error' : 'alert-success'}`}>
              {message}
            </div>
          )}

          {loading ? (
            <div className="text-center p-5">
              <div className="spinner mx-auto"></div>
              <p>Loading your requests...</p>
            </div>
          ) : requests.length > 0 ? (
            <div className="requests-list">
              {requests.map((request) => (
                <div key={request._id} className="request-card">
                  <div className="request-header">
                    <h3>{request.title}</h3>
                    {getStatusBadge(request.status)}
                  </div>

                  <p className="request-description">{request.description}</p>

                  <div className="request-details">
                    <div className="detail-item">
                      <FiBook /> <strong>Subject:</strong> {request.subject}
                    </div>
                    <div className="detail-item">
                      <strong>Semester:</strong> {request.semester}
                    </div>
                    <div className="detail-item">
                      <strong>Department:</strong> {request.department}
                    </div>
                    {request.year && (
                      <div className="detail-item">
                        <strong>Year:</strong> {request.year}
                      </div>
                    )}
                    <div className="detail-item">
                      <FiCalendar /> <strong>Submitted:</strong> {formatDate(request.createdAt)}
                    </div>
                  </div>

                  {request.status !== 'pending' && request.teacherMessage && (
                    <div className="teacher-feedback">
                      <strong>Teacher's Feedback:</strong> {request.teacherMessage}
                      {request.reviewedBy && (
                        <div className="mt-2 text-sm d-flex align-center gap-2">
                          <FiUser /> Reviewed by: {request.reviewedBy.name}
                        </div>
                      )}
                    </div>
                  )}

                  <div className="request-actions">
                    <button
                      className="btn btn-secondary"
                      onClick={() => window.open(`${process.env.REACT_APP_API_URL}${request.fileUrl}`, '_blank')}
                    >
                      <FiEye /> View File
                    </button>

                    {request.status === 'approved' && (
                      <span className="text-success font-bold d-flex align-center gap-2">
                        <FiCheck /> This note has been published to the library
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p>You haven't submitted any note requests yet.</p>
              <p>Use the "New Request" button to submit a request.</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Teacher/Admin View
  return (
    <div className="dashboard-container">
      <Sidebar onLogout={onLogout} />

      <div className="main-content">
        <Header
          title="Note Requests"
          subtitle="Review and manage student note requests"
        />

        {message && (
          <div className={`alert ${message.includes('Error') ? 'alert-error' : 'alert-success'}`}>
            {message}
          </div>
        )}

        {/* Tabs for Teacher/Admin */}
        <div className="tabs">
          <button
            className={`tab-btn ${activeTab === 'pending' ? 'active' : ''}`}
            onClick={() => setActiveTab('pending')}
          >
            <FiClock /> Pending Requests
            {requests.filter(r => r.status === 'pending').length > 0 && (
              <span className="badge">
                {requests.filter(r => r.status === 'pending').length}
              </span>
            )}
          </button>
          <button
            className={`tab-btn ${activeTab === 'reviewed' ? 'active' : ''}`}
            onClick={() => setActiveTab('reviewed')}
          >
            <FiCheck /> Reviewed Requests
          </button>
        </div>

        {loading ? (
          <div className="text-center p-5">
            <div className="spinner mx-auto"></div>
            <p>Loading requests...</p>
          </div>
        ) : requests.length > 0 ? (
          <div className="requests-list">
            {requests.map((request) => (
              <div key={request._id} className="request-card">
                <div className="request-header">
                  <div>
                    <h3>{request.title}</h3>
                    <p className="text-sm text-secondary mt-1">
                      Requested by: <strong>{request.requestedBy?.name}</strong>
                      ({request.requestedBy?.email})
                    </p>
                  </div>
                  {getStatusBadge(request.status)}
                </div>

                <p className="request-description">{request.description}</p>

                <div className="request-details">
                  <div className="detail-item">
                    <FiBook /> <strong>Subject:</strong> {request.subject}
                  </div>
                  <div className="detail-item">
                    <strong>Semester:</strong> {request.semester}
                  </div>
                  <div className="detail-item">
                    <strong>Department:</strong> {request.department}
                  </div>
                  <div className="detail-item">
                    <FiCalendar /> <strong>Submitted:</strong> {formatDate(request.createdAt)}
                  </div>
                </div>

                {request.status !== 'pending' && request.teacherMessage && (
                  <div className="teacher-feedback">
                    <strong>Your Feedback:</strong> {request.teacherMessage}
                  </div>
                )}

                <div className="request-actions">
                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-secondary"
                      onClick={() => window.open(`${process.env.REACT_APP_API_URL}${request.fileUrl}`, '_blank')}
                    >
                      <FiEye /> View File
                    </button>

                    {request.status === 'pending' && (
                      <>
                        <button
                          className="btn btn-success"
                          onClick={() => handleApprove(request._id)}
                          disabled={actionLoading === request._id}
                        >
                          <FiCheck /> {actionLoading === request._id ? 'Approving...' : 'Approve'}
                        </button>
                        <button
                          className="btn btn-danger"
                          onClick={() => handleReject(request._id)}
                          disabled={actionLoading === request._id}
                        >
                          <FiX /> {actionLoading === request._id ? 'Rejecting...' : 'Reject'}
                        </button>
                      </>
                    )}
                  </div>

                  {request.status === 'approved' && (
                    <span className="text-success font-bold d-flex align-center gap-2">
                      <FiCheck /> Published to library
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p>No {activeTab} requests found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Requests;
```


## frontend/src/pages/Upload.jsx
```

import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import api from '../services/api';
import { FiUpload, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import '../App.css';

const Upload = ({ onLogout }) => {
    const userData = localStorage.getItem('user');
    const user = userData ? JSON.parse(userData) : null;
    const isStudent = user?.role === 'student';
    const isTeacher = user?.role === 'teacher';

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [file, setFile] = useState(null);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        subject: '',
        department: user?.department || '',
        semester: '',
        type: 'note',
        year: '',
        examType: 'other',
    });

    // Safety check for legacy admin users
    if (!isStudent && !isTeacher) {
        return (
            <div className="dashboard-container">
                <Sidebar onLogout={onLogout} />
                <div className="main-content">
                    <div className="alert alert-error">
                        <h3>Invalid Account Role</h3>
                        <p>Your account has a role of "<strong>{user?.role}</strong>" which is no longer supported.</p>
                        <p>Please <strong>Logout</strong> and register a new <strong>Student</strong> or <strong>Teacher</strong> account.</p>
                        <button className="btn btn-primary mt-4" onClick={onLogout}>Logout Now</button>
                    </div>
                </div>
            </div>
        );
    }

    console.log("Upload Page Debug:");
    console.log("User Data:", user);
    console.log("Role:", user?.role);
    console.log("Is Student?", isStudent);

    const departments = ['Computer Science', 'Electronics', 'Mechanical', 'Civil', 'Electrical'];
    const semesters = [1, 2, 3, 4, 5, 6, 7, 8];
    const examTypes = ['midsem', 'endsem', 'quiz', 'other'];

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (e.target.name === 'type' && e.target.value === 'pastpaper') {
            setFormData((prev) => ({ ...prev, type: 'pastpaper', examType: 'endsem' }));
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        if (!file) {
            setError('Please select a file');
            setLoading(false);
            return;
        }

        const data = new FormData();
        data.append('file', file);
        Object.keys(formData).forEach(key => {
            if (formData[key]) data.append(key, formData[key]);
        });

        try {
            const endpoint = isStudent ? '/requests' : '/notes/upload';

            const response = await api.post(endpoint, data, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            console.log('Upload success:', response);
            setSuccess(isStudent ? 'Request submitted successfully! It will be reviewed by a teacher.' : 'Note uploaded successfully!');

            // Reset form
            setFormData({
                title: '',
                description: '',
                subject: '',
                department: user?.department || '',
                semester: '',
                type: 'note',
                year: '',
                examType: 'other',
            });
            setFile(null);
            const input = document.getElementById('file-upload');
            if (input) input.value = '';

        } catch (err) {
            console.error('Upload error:', err);
            setError(err.response?.data?.message || 'Upload failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="dashboard-container">
            <Sidebar onLogout={onLogout} />
            <div className="main-content">
                <Header
                    title={isStudent ? "Request to Add Note" : "Upload Note"}
                    subtitle={isStudent ? "Submit a note for review" : "Add new study material to library"}
                />

                <div className="mx-auto" style={{ maxWidth: '800px' }}>
                    <div className="card">

                        {error && (
                            <div className="alert alert-error">
                                <FiAlertCircle /> {error}
                            </div>
                        )}

                        {success && (
                            <div className="alert alert-success">
                                <FiCheckCircle /> {success}
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            <div className="d-grid grid-cols-2 gap-4">

                                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                                    <label>Title *</label>
                                    <input type="text" name="title" value={formData.title} onChange={handleChange} required className="form-input" placeholder="e.g. Engineering Mechanics Unit 1" />
                                </div>

                                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                                    <label>Description</label>
                                    <textarea name="description" value={formData.description} onChange={handleChange} rows="3" className="form-input" placeholder="Brief description of the content..." />
                                </div>

                                <div className="form-group">
                                    <label>Subject *</label>
                                    <input type="text" name="subject" value={formData.subject} onChange={handleChange} required className="form-input" />
                                </div>

                                <div className="form-group">
                                    <label>Department *</label>
                                    <select name="department" value={formData.department} onChange={handleChange} required className="form-input">
                                        <option value="">Select Department</option>
                                        {departments.map(d => <option key={d} value={d}>{d}</option>)}
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>Semester *</label>
                                    <select name="semester" value={formData.semester} onChange={handleChange} required className="form-input">
                                        <option value="">Select Semester</option>
                                        {semesters.map(s => <option key={s} value={s}>Semester {s}</option>)}
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>Type *</label>
                                    <select name="type" value={formData.type} onChange={handleChange} required className="form-input">
                                        <option value="note">Note</option>
                                        <option value="pastpaper">Past Paper</option>
                                    </select>
                                </div>

                                {formData.type === 'pastpaper' && (
                                    <>
                                        <div className="form-group">
                                            <label>Year</label>
                                            <input type="number" name="year" value={formData.year} onChange={handleChange} min="2000" max="2030" className="form-input" />
                                        </div>
                                        <div className="form-group">
                                            <label>Exam Type</label>
                                            <select name="examType" value={formData.examType} onChange={handleChange} className="form-input">
                                                {examTypes.map(t => <option key={t} value={t}>{t.toUpperCase()}</option>)}
                                            </select>
                                        </div>
                                    </>
                                )}

                                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                                    <label>File * (PDF, Images - Max 10MB)</label>
                                    <div className={`file-upload-area ${file ? 'bg-primary-light' : ''}`}>
                                        <input type="file" id="file-upload" onChange={handleFileChange} accept=".pdf,.png,.jpg,.jpeg" />
                                        <label htmlFor="file-upload">
                                            <FiUpload size={40} className="mb-2 text-primary" />
                                            <p className="text-secondary">{file ? file.name : 'Click to upload file'}</p>
                                        </label>
                                    </div>
                                </div>

                            </div>

                            <div className="mt-4 text-right">
                                <button type="submit" className="btn btn-primary" disabled={loading}>
                                    {loading ? 'Uploading...' : (isStudent ? 'Submit Request' : 'Upload Note')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Upload;

```


## frontend/src/reportWebVitals.js
```

const reportWebVitals = onPerfEntry => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(onPerfEntry);
      getFID(onPerfEntry);
      getFCP(onPerfEntry);
      getLCP(onPerfEntry);
      getTTFB(onPerfEntry);
    });
  }
};

export default reportWebVitals;

```


## frontend/src/services/api.js
```

import axios from 'axios';

const api = axios.create({
  baseURL: `${process.env.REACT_APP_API_URL}/api`, // Uses environment variable
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log request for debugging
    console.log(`API Request: ${config.method.toUpperCase()} ${config.baseURL}${config.url}`);
    console.log('Headers:', config.headers);
    
    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} ${response.config.url}`);
    return response.data;
  },
  (error) => {
    console.error('API Error:', {
      message: error.message,
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      data: error.response?.data,
      headers: error.response?.headers
    });
    
    // Handle specific errors
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    
    if (error.response?.status === 403 && error.response?.data?.message?.includes('CORS')) {
      // CORS error
      console.error('CORS Error Detected:', error.response.data);
      alert(`CORS Error: Your origin is not allowed. Please check backend CORS configuration.`);
    }
    
    if (error.message === 'Network Error') {
      console.error('Network Error - Check if backend is running');
      alert(`Cannot connect to server. Make sure backend is running on ${process.env.REACT_APP_API_URL}`);
    }
    
    return Promise.reject(error);
  }
);

export const createCollege = async (collegeData) => {
  const response = await api.post('/colleges', collegeData);
  return response;
};

export const getColleges = async () => {
  const response = await api.get('/colleges');
  return response;
};

export default api;
```


## frontend/src/setupTests.js
```

// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

```


## frontend/src/utils/utils.js
```

// Format date
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
};

// Format file size
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Get user initials for avatar
export const getUserInitials = (name) => {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

// Validate file type
export const validateFileType = (file, allowedTypes = ['pdf', 'png', 'jpg', 'jpeg']) => {
  const extension = file.name.split('.').pop().toLowerCase();
  return allowedTypes.includes(extension);
};

// Validate file size (max 10MB)
export const validateFileSize = (file, maxSizeMB = 10) => {
  return file.size <= maxSizeMB * 1024 * 1024;
};

// Debounce function for search
export const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
};

// Get color by status
export const getStatusColor = (status) => {
  const colors = {
    pending: '#f59e0b',
    approved: '#10b981',
    rejected: '#ef4444'
  };
  return colors[status] || '#6b7280';
};
```
