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
      case 'approved': return <FiCheck style={{ color: '#10b981', marginRight: '4px' }} />;
      case 'rejected': return <FiX style={{ color: '#ef4444', marginRight: '4px' }} />;
      default: return <FiClock style={{ color: '#f59e0b', marginRight: '4px' }} />;
    }
  };

  // Get role badge style
  const getRoleBadgeStyle = () => {
    if (user?.role === 'admin') {
      return { background: '#fee2e2', color: '#991b1b' };
    } else if (user?.role === 'teacher') {
      return { background: '#dbeafe', color: '#1e40af' };
    } else {
      return { background: '#d1fae5', color: '#065f46' };
    }
  };

  const roleBadgeStyle = getRoleBadgeStyle();

  if (!user) {
    return (
      <div style={styles.loadingScreen}>
        <div style={styles.spinner}></div>
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
        
        <div style={styles.profileContainer}>
          {/* Profile Info Card */}
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <h2>Profile Information</h2>
              <button 
                style={styles.btnSecondary}
                onClick={() => setEditMode(!editMode)}
              >
                <FiEdit /> {editMode ? 'Cancel' : 'Edit'}
              </button>
            </div>
            
            <form onSubmit={handleUpdateProfile}>
              <div style={styles.formGroup}>
                <label><FiUser /> Full Name</label>
                {editMode ? (
                  <input
                    type="text"
                    style={styles.formControl}
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                  />
                ) : (
                  <div style={styles.profileValue}>{user.name}</div>
                )}
              </div>
              
              <div style={styles.formGroup}>
                <label><FiMail /> Email Address</label>
                {editMode ? (
                  <input
                    type="email"
                    style={styles.formControl}
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                  />
                ) : (
                  <div style={styles.profileValue}>{user.email}</div>
                )}
              </div>
              
              <div style={styles.formGroup}>
                <label><FiBook /> Role</label>
                <div style={{...styles.profileValue, ...styles.roleBadge, ...roleBadgeStyle}}>
                  {user.role}
                </div>
              </div>
              
              <div style={styles.formGroup}>
                <label><FiBook /> College</label>
                {editMode ? (
                  <select
                    style={styles.formControl}
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
                  <div style={styles.profileValue}>{getCollegeName(user.collegeId)}</div>
                )}
              </div>
              
              {editMode && (
                <div style={styles.formActions}>
                  <button 
                    type="submit" 
                    style={loading ? styles.btnPrimaryDisabled : styles.btnPrimary}
                    disabled={loading}
                  >
                    <FiSave /> {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              )}
            </form>
          </div>
          
          {/* Change Password Card */}
          <div style={styles.card}>
            <h2><FiKey /> Change Password</h2>
            
            <form onSubmit={handleChangePassword}>
              <div style={styles.formGroup}>
                <label>Current Password</label>
                <input
                  type="password"
                  style={styles.formControl}
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                  required
                />
              </div>
              
              <div style={styles.formGroup}>
                <label>New Password</label>
                <input
                  type="password"
                  style={styles.formControl}
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                  required
                  minLength="6"
                />
              </div>
              
              <div style={styles.formGroup}>
                <label>Confirm New Password</label>
                <input
                  type="password"
                  style={styles.formControl}
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                  required
                  minLength="6"
                />
              </div>
              
              <div style={styles.formActions}>
                <button 
                  type="submit" 
                  style={loading ? styles.btnPrimaryDisabled : styles.btnPrimary}
                  disabled={loading}
                >
                  {loading ? 'Changing...' : 'Change Password'}
                </button>
              </div>
            </form>
            
            {/* Account Actions */}
            <div style={styles.accountActions}>
              <h3>Account Actions</h3>
              
              <button 
                style={styles.btnSecondary}
                onClick={() => {
                  if (window.confirm('Are you sure you want to logout?')) {
                    onLogout();
                  }
                }}
              >
                Logout
              </button>
              
              <button 
                style={styles.btnDanger}
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
        <div style={styles.statsCard}>
          <h3>Your Activity</h3>
          <div style={styles.statsGrid}>
            <div style={styles.statItem}>
              <div style={styles.statValue}>0</div>
              <div style={styles.statLabel}>Notes Uploaded</div>
            </div>
            <div style={styles.statItem}>
              <div style={styles.statValue}>{userRequests.length}</div>
              <div style={styles.statLabel}>Requests Made</div>
            </div>
            <div style={styles.statItem}>
              <div style={styles.statValue}>0</div>
              <div style={styles.statLabel}>Downloads</div>
            </div>
          </div>
        </div>

        {/* Request History (Only for Students) */}
        {user?.role === 'student' && (
          <div style={{...styles.card, marginTop: '2rem'}}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.5rem' }}>
              <FiFileText /> My Request History
            </h3>
            {loadingRequests ? (
              <div style={{ textAlign: 'center', padding: '2rem' }}>
                <div style={styles.spinner}></div>
                <p>Loading request history...</p>
              </div>
            ) : userRequests.length > 0 ? (
              <div style={styles.requestHistory}>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#f8f9fa' }}>
                        <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Title</th>
                        <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Subject</th>
                        <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Status</th>
                        <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Date</th>
                        <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {userRequests.map((req) => (
                        <tr key={req._id} style={{ borderBottom: '1px solid #eee', transition: 'background 0.2s' }}>
                          <td style={{ padding: '12px', verticalAlign: 'top' }}>
                            <div style={{ fontWeight: '500' }}>{req.title}</div>
                            {req.description && (
                              <div style={{ fontSize: '0.85rem', color: '#6b7280', marginTop: '4px' }}>
                                {req.description.length > 50 ? req.description.substring(0, 50) + '...' : req.description}
                              </div>
                            )}
                          </td>
                          <td style={{ padding: '12px', verticalAlign: 'top' }}>
                            <div>{req.subject}</div>
                            <div style={{ fontSize: '0.85rem', color: '#6b7280' }}>
                              Sem {req.semester} • {req.department}
                            </div>
                          </td>
                          <td style={{ padding: '12px', verticalAlign: 'top' }}>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                              {getStatusIcon(req.status)}
                              <span style={{
                                backgroundColor: req.status === 'approved' ? '#d1fae5' : 
                                               req.status === 'rejected' ? '#fee2e2' : '#fef3c7',
                                color: req.status === 'approved' ? '#065f46' : 
                                       req.status === 'rejected' ? '#991b1b' : '#92400e',
                                padding: '4px 8px',
                                borderRadius: '12px',
                                fontSize: '0.85rem',
                                fontWeight: '500'
                              }}>
                                {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                              </span>
                            </div>
                            {req.teacherMessage && (
                              <div style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: '4px' }}>
                                {req.teacherMessage}
                              </div>
                            )}
                          </td>
                          <td style={{ padding: '12px', verticalAlign: 'top' }}>
                            {new Date(req.createdAt).toLocaleDateString('en-IN', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </td>
                          <td style={{ padding: '12px', verticalAlign: 'top' }}>
                            <button
                              onClick={() => window.open(`http://localhost:8000${req.fileUrl}`, '_blank')}
                              style={{
                                padding: '6px 12px',
                                background: '#e5e7eb',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontSize: '0.85rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px'
                              }}
                            >
                              <FiFileText /> View File
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div style={{ marginTop: '1rem', textAlign: 'center', color: '#6b7280', fontSize: '0.9rem' }}>
                  Showing {userRequests.length} request{userRequests.length !== 1 ? 's' : ''}
                </div>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
                <FiFileText size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                <p>No requests submitted yet.</p>
                <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>
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

// Styles object
const styles = {
  profileContainer: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '2rem',
    marginBottom: '2rem'
  },
  card: {
    background: 'white',
    borderRadius: '15px',
    padding: '2rem',
    boxShadow: '0 5px 15px rgba(0,0,0,0.05)',
    marginBottom: '1.5rem'
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem'
  },
  formGroup: {
    marginBottom: '1.5rem'
  },
  formControl: {
    width: '100%',
    padding: '12px 16px',
    border: '2px solid #e2e8f0',
    borderRadius: '10px',
    fontSize: '1rem'
  },
  profileValue: {
    padding: '12px 0',
    color: '#334155',
    fontSize: '1rem'
  },
  roleBadge: {
    padding: '4px 12px',
    borderRadius: '20px',
    display: 'inline-block',
    textTransform: 'capitalize'
  },
  formActions: {
    marginTop: '2rem'
  },
  accountActions: {
    marginTop: '3rem',
    paddingTop: '2rem',
    borderTop: '1px solid #e2e8f0'
  },
  statsCard: {
    background: 'white',
    borderRadius: '15px',
    padding: '2rem',
    boxShadow: '0 5px 15px rgba(0,0,0,0.05)',
    marginBottom: '1.5rem'
  },
  statsGrid: {
    display: 'flex',
    gap: '2rem',
    marginTop: '1rem'
  },
  statItem: {
    textAlign: 'center',
    flex: 1
  },
  statValue: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#4361ee'
  },
  statLabel: {
    color: '#6c757d',
    fontSize: '0.9rem'
  },
  btn: {
    padding: '10px 20px',
    border: 'none',
    borderRadius: '10px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'all 0.2s'
  },
  btnPrimary: {
    background: '#4361ee',
    color: 'white'
  },
  btnPrimaryDisabled: {
    background: '#94a3b8',
    color: 'white',
    opacity: 0.6,
    cursor: 'not-allowed'
  },
  btnSecondary: {
    background: '#e2e8f0',
    color: '#334155',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '10px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'all 0.2s'
  },
  btnDanger: {
    background: '#ef4444',
    color: 'white',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '10px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'all 0.2s',
    marginLeft: '1rem'
  },
  loadingScreen: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    background: '#f5f7fb'
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '3px solid #4361ee',
    borderTop: '3px solid transparent',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginBottom: '1rem'
  },
  requestHistory: {
    // Table styles
  }
};

// Add CSS animation
const styleSheet = document.styleSheets[0];
const keyframes = `
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
`;
styleSheet.insertRule(keyframes, styleSheet.cssRules.length);

// Media queries
if (typeof window !== 'undefined') {
  const mediaQuery = window.matchMedia('(max-width: 1024px)');
  if (mediaQuery.matches) {
    styles.profileContainer.gridTemplateColumns = '1fr';
  }
  
  const mobileMediaQuery = window.matchMedia('(max-width: 768px)');
  if (mobileMediaQuery.matches) {
    styles.statsGrid.flexDirection = 'column';
    styles.statsGrid.gap = '1rem';
  }
}

export default Profile;