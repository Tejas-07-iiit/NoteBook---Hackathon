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

  useEffect(() => {
    fetchRequests();
  }, [activeTab]);

  const fetchRequests = async () => {
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
  };

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
        bg: '#fef3c7',
        color: '#92400e',
        icon: <FiClock />,
        text: 'Pending Review'
      },
      approved: {
        bg: '#d1fae5',
        color: '#065f46',
        icon: <FiCheck />,
        text: 'Approved'
      },
      rejected: {
        bg: '#fee2e2',
        color: '#991b1b',
        icon: <FiX />,
        text: 'Rejected'
      }
    };

    const style = styles[status] || styles.pending;

    return (
      <span style={{
        backgroundColor: style.bg,
        color: style.color,
        padding: '6px 12px',
        borderRadius: '20px',
        fontSize: '0.85rem',
        fontWeight: '600',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        marginLeft: '10px'
      }}>
        {style.icon} {style.text}
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
          <Header
            title="My Note Requests"
            subtitle="Track your submitted note requests"
          />

          {message && (
            <div style={{
              backgroundColor: message.includes('Error') ? '#fee2e2' : '#d1fae5',
              color: message.includes('Error') ? '#dc2626' : '#065f46',
              padding: '12px 16px',
              borderRadius: '8px',
              marginBottom: '1.5rem'
            }}>
              {message}
            </div>
          )}

          <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'flex-end' }}>
            <button
              className="btn-primary"
              onClick={() => window.location.href = '/upload'}
              style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <FiPlus /> New Request
            </button>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem' }}>
              <div className="spinner"></div>
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
                        <span style={{ marginLeft: '10px' }}>
                          <FiUser /> Reviewed by: {request.reviewedBy.name}
                        </span>
                      )}
                    </div>
                  )}

                  <div className="request-actions">
                    <button
                      className="btn btn-secondary"
                      onClick={() => window.open(`http://localhost:8000${request.fileUrl}`, '_blank')}
                    >
                      <FiEye /> View File
                    </button>

                    {request.status === 'approved' && (
                      <span style={{ color: '#10b981', fontWeight: '600' }}>
                        ✅ This note has been published to the library
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p>You haven't submitted any note requests yet.</p>
              <p>Use the "Upload Notes" feature to submit a request.</p>
            </div>
          )}
        </div>

        <style jsx>{`
          .request-card {
            background: white;
            border-radius: 12px;
            padding: 1.5rem;
            margin-bottom: 1rem;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            border-left: 4px solid #3b82f6;
          }
          
          .request-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1rem;
          }
          
          .request-header h3 {
            margin: 0;
            font-size: 1.2rem;
            color: #1f2937;
          }
          
          .request-description {
            color: #6b7280;
            margin-bottom: 1rem;
            line-height: 1.5;
          }
          
          .request-details {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 0.8rem;
            margin-bottom: 1rem;
            font-size: 0.9rem;
          }
          
          .detail-item {
            display: flex;
            align-items: center;
            gap: 6px;
            color: #4b5563;
          }
          
          .teacher-feedback {
            background: #f9fafb;
            padding: 1rem;
            border-radius: 8px;
            margin-bottom: 1rem;
            border-left: 3px solid #f59e0b;
          }
          
          .request-actions {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding-top: 1rem;
            border-top: 1px solid #e5e7eb;
          }
          
          .btn {
            padding: 8px 16px;
            border: none;
            border-radius: 6px;
            font-weight: 600;
            cursor: pointer;
            display: inline-flex;
            align-items: center;
            gap: 6px;
            transition: all 0.2s;
          }
          
          .btn-secondary {
            background: #e5e7eb;
            color: #374151;
          }
          
          .btn-secondary:hover {
            background: #d1d5db;
          }
          
          .empty-state {
            text-align: center;
            padding: 3rem;
            background: white;
            border-radius: 12px;
            color: #6b7280;
          }
          
          .spinner {
            display: inline-block;
            width: 30px;
            height: 30px;
            border: 3px solid #3b82f6;
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
          <div style={{
            backgroundColor: message.includes('Error') ? '#fee2e2' : '#d1fae5',
            color: message.includes('Error') ? '#dc2626' : '#065f46',
            padding: '12px 16px',
            borderRadius: '8px',
            marginBottom: '1.5rem'
          }}>
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
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <div className="spinner"></div>
            <p>Loading requests...</p>
          </div>
        ) : requests.length > 0 ? (
          <div className="requests-list">
            {requests.map((request) => (
              <div key={request._id} className="request-card">
                <div className="request-header">
                  <div>
                    <h3>{request.title}</h3>
                    <p style={{ color: '#6b7280', fontSize: '0.9rem', marginTop: '4px' }}>
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
                  <div>
                    <button
                      className="btn btn-secondary"
                      onClick={() => window.open(`http://localhost:8000${request.fileUrl}`, '_blank')}
                      style={{ marginRight: '10px' }}
                    >
                      <FiEye /> View File
                    </button>

                    {request.status === 'pending' && (
                      <>
                        <button
                          className="btn btn-success"
                          onClick={() => handleApprove(request._id)}
                          disabled={actionLoading === request._id}
                          style={{ marginRight: '10px' }}
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
                    <span style={{ color: '#10b981', fontWeight: '600' }}>
                      ✅ Published to library
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

      <style jsx>{`
        .tabs {
          display: flex;
          gap: 1rem;
          margin-bottom: 2rem;
          border-bottom: 2px solid #e5e7eb;
          padding-bottom: 1rem;
        }
        
        .tab-btn {
          padding: 12px 24px;
          background: transparent;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          color: #6b7280;
          position: relative;
          transition: all 0.2s;
        }
        
        .tab-btn.active {
          background: #3b82f6;
          color: white;
        }
        
        .tab-btn:hover:not(.active) {
          background: #f3f4f6;
        }
        
        .badge {
          background: #ef4444;
          color: white;
          border-radius: 50%;
          width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
          margin-left: 6px;
        }
        
        .btn-success {
          background: #10b981;
          color: white;
        }
        
        .btn-success:hover:not(:disabled) {
          background: #059669;
        }
        
        .btn-danger {
          background: #ef4444;
          color: white;
        }
        
        .btn-danger:hover:not(:disabled) {
          background: #dc2626;
        }
        
        .btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        
        /* Reuse styles from student view */
        .request-card {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          margin-bottom: 1rem;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          border-left: 4px solid #3b82f6;
        }
        
        .request-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1rem;
        }
        
        .request-header h3 {
          margin: 0;
          font-size: 1.2rem;
          color: #1f2937;
        }
        
        .request-description {
          color: #6b7280;
          margin-bottom: 1rem;
          line-height: 1.5;
        }
        
        .request-details {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 0.8rem;
          margin-bottom: 1rem;
          font-size: 0.9rem;
        }
        
        .detail-item {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #4b5563;
        }
        
        .teacher-feedback {
          background: #f9fafb;
          padding: 1rem;
          border-radius: 8px;
          margin-bottom: 1rem;
          border-left: 3px solid #f59e0b;
        }
        
        .request-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 1rem;
          border-top: 1px solid #e5e7eb;
        }
        
        .btn {
          padding: 8px 16px;
          border: none;
          border-radius: 6px;
          font-weight: 600;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          transition: all 0.2s;
        }
        
        .btn-secondary {
          background: #e5e7eb;
          color: #374151;
        }
        
        .btn-secondary:hover {
          background: #d1d5db;
        }
        
        .empty-state {
          text-align: center;
          padding: 3rem;
          background: white;
          border-radius: 12px;
          color: #6b7280;
        }
        
        .spinner {
          display: inline-block;
          width: 30px;
          height: 30px;
          border: 3px solid #3b82f6;
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

export default Requests;