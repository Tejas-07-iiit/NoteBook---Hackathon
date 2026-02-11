import React, { useState, useEffect } from 'react';
import { getColleges, createCollege } from '../services/api';
import { FiPlus, FiTrash2 } from 'react-icons/fi';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import '../App.css'; // Ensure we have basic styles

const Colleges = ({ onLogout }) => {
    const [colleges, setColleges] = useState([]);
    const [formData, setFormData] = useState({
        collegeName: '',
        collegeCode: ''
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    useEffect(() => {
        fetchColleges();
    }, []);

    const fetchColleges = async () => {
        try {
            setLoading(true);
            const data = await getColleges();
            setColleges(data);
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch colleges');
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        // Basic validation
        if (!formData.collegeName || !formData.collegeCode) {
            setError('Please fill in all fields');
            return;
        }

        try {
            await createCollege(formData);
            setSuccess('College added successfully!');
            setFormData({ collegeName: '', collegeCode: '' });
            fetchColleges(); // Refresh list
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to add college');
        }
    };

    return (
        <div className="dashboard-container">
            <Sidebar onLogout={onLogout} />
            <div className="main-content">
                <Header title="Colleges" />

                <div className="content-padding">
                    <div className="stats-grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>

                        {/* Add College Form */}
                        <div className="card">
                            <h3>Add New College</h3>
                            {error && <div className="error-message" style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
                            {success && <div className="success-message" style={{ color: 'green', marginBottom: '10px' }}>{success}</div>}

                            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                <div className="form-group">
                                    <label>College Name</label>
                                    <input
                                        type="text"
                                        name="collegeName"
                                        value={formData.collegeName}
                                        onChange={handleChange}
                                        placeholder="e.g. IIT Bombay"
                                        className="form-input"
                                        style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd', width: '100%' }}
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
                                        style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd', width: '100%' }}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="btn-primary"
                                    style={{
                                        padding: '10px',
                                        backgroundColor: '#4a90e2',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '4px',
                                        cursor: 'pointer',
                                        marginTop: '10px'
                                    }}
                                >
                                    <FiPlus style={{ marginRight: '5px' }} /> Add College
                                </button>
                            </form>
                        </div>

                        {/* List Colleges */}
                        <div className="card">
                            <h3>Existing Colleges</h3>
                            {loading ? (
                                <p>Loading...</p>
                            ) : colleges.length === 0 ? (
                                <p>No colleges found.</p>
                            ) : (
                                <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                                    <ul style={{ listStyle: 'none', padding: 0 }}>
                                        {colleges.map((college) => (
                                            <li key={college._id} style={{
                                                padding: '10px',
                                                borderBottom: '1px solid #eee',
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center'
                                            }}>
                                                <div>
                                                    <strong>{college.collegeName}</strong>
                                                    <div style={{ fontSize: '0.8rem', color: '#666' }}>{college.collegeCode}</div>
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
        </div>
    );
};

export default Colleges;
