import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import api from '../services/api';
import { FiUser, FiMail, FiBook, FiEdit, FiSave, FiKey } from 'react-icons/fi';

const Profile = ({ onLogout }) => {
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [colleges, setColleges] = useState([]);
  
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
            <div className="card-header">
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
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
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
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                  />
                ) : (
                  <div className="profile-value">{user.email}</div>
                )}
              </div>
              
              <div className="form-group">
                <label><FiBook /> Role</label>
                <div className="profile-value role-badge">
                  {user.role}
                </div>
              </div>
              
              <div className="form-group">
                <label><FiBook /> College</label>
                {editMode ? (
                  <select
                    className="form-control"
                    value={formData.collegeId}
                    onChange={(e) => setFormData({...formData, collegeId: e.target.value})}
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
                  onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>New Password</label>
                <input
                  type="password"
                  className="form-control"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
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
                  onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
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
        <div className="stats-card">
          <h3>Your Activity</h3>
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-value">0</div>
              <div className="stat-label">Notes Uploaded</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">0</div>
              <div className="stat-label">Requests Made</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">0</div>
              <div className="stat-label">Downloads</div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .profile-container {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
          margin-bottom: 2rem;
        }
        
        @media (max-width: 1024px) {
          .profile-container {
            grid-template-columns: 1fr;
          }
        }
        
        .card {
          background: white;
          border-radius: 15px;
          padding: 2rem;
          box-shadow: 0 5px 15px rgba(0,0,0,0.05);
        }
        
        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }
        
        .form-group {
          margin-bottom: 1.5rem;
        }
        
        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
          color: #334155;
        }
        
        .form-group label svg {
          margin-right: 8px;
          vertical-align: middle;
        }
        
        .form-control {
          width: 100%;
          padding: 12px 16px;
          border: 2px solid #e2e8f0;
          border-radius: 10px;
          font-size: 1rem;
        }
        
        .form-control:focus {
          outline: none;
          border-color: #4361ee;
          box-shadow: 0 0 0 3px rgba(67, 97, 238, 0.1);
        }
        
        .profile-value {
          padding: 12px 0;
          color: #334155;
          font-size: 1rem;
        }
        
        .role-badge {
          background: ${user.role === 'admin' ? '#fee2e2' : 
                      user.role === 'teacher' ? '#dbeafe' : 
                      '#d1fae5'};
          color: ${user.role === 'admin' ? '#991b1b' : 
                   user.role === 'teacher' ? '#1e40af' : 
                   '#065f46'};
          padding: 4px 12px;
          border-radius: 20px;
          display: inline-block;
          text-transform: capitalize;
        }
        
        .form-actions {
          margin-top: 2rem;
        }
        
        .account-actions {
          margin-top: 3rem;
          padding-top: 2rem;
          border-top: 1px solid #e2e8f0;
        }
        
        .account-actions h3 {
          margin-bottom: 1rem;
        }
        
        .account-actions button {
          margin-right: 1rem;
        }
        
        .stats-card {
          background: white;
          border-radius: 15px;
          padding: 2rem;
          box-shadow: 0 5px 15px rgba(0,0,0,0.05);
        }
        
        .stats-grid {
          display: flex;
          gap: 2rem;
          margin-top: 1rem;
        }
        
        .stat-item {
          text-align: center;
        }
        
        .stat-value {
          font-size: 2rem;
          font-weight: bold;
          color: #4361ee;
        }
        
        .stat-label {
          color: #6c757d;
        }
        
        .btn {
          padding: 10px 20px;
          border: none;
          border-radius: 10px;
          font-weight: 600;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }
        
        .btn-primary {
          background: #4361ee;
          color: white;
        }
        
        .btn-secondary {
          background: #e2e8f0;
          color: #334155;
        }
        
        .btn-danger {
          background: #ef4444;
          color: white;
        }
        
        .loading-screen {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          height: 100vh;
          background: #f5f7fb;
        }
        
        .spinner {
          width: 40px;
          height: 40px;
          border: 3px solid #4361ee;
          border-top: 3px solid transparent;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 1rem;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Profile;