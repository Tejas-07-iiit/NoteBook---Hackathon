import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { FiX, FiFileText } from 'react-icons/fi';
import '../Main.css';

const NoteSelectionModal = ({ onClose, onSelect }) => {
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchNotes = async () => {
            try {
                const response = await api.get('/notes');
                // Filter out image files as image summarization is disabled
                const textOnlyNotes = response.filter(note => {
                    if (!note.fileUrl) return true;
                    const url = note.fileUrl.toLowerCase();
                    return !['.jpg', '.jpeg', '.png', '.webp'].some(ext => url.endsWith(ext));
                });
                setNotes(textOnlyNotes);
            } catch (err) {
                console.error('Error fetching notes:', err);
                setError('Failed to load notes library.');
            } finally {
                setLoading(false);
            }
        };

        fetchNotes();
    }, []);

    return (
        <div className="modal-overlay" style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            backdropFilter: 'blur(5px)'
        }}>
            <div className="modal-content" style={{
                backgroundColor: 'var(--bg-dark)',
                border: '1px solid var(--glass-border)',
                borderRadius: 'var(--radius)',
                width: '90%',
                maxWidth: '600px',
                maxHeight: '80vh',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
            }}>
                <div className="modal-header" style={{
                    padding: '20px',
                    borderBottom: '1px solid var(--glass-border)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <h3 style={{ margin: 0, color: '#fff' }}>Select a Note to Summarize</h3>
                    <button onClick={onClose} style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--text-muted)',
                        cursor: 'pointer',
                        fontSize: '1.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <FiX />
                    </button>
                </div>

                <div className="modal-body" style={{
                    padding: '20px',
                    overflowY: 'auto',
                    flex: 1
                }}>
                    {loading ? (
                        <div className="loading" style={{ padding: '40px', textAlign: 'center' }}>Loading notes...</div>
                    ) : error ? (
                        <div className="alert alert-error">{error}</div>
                    ) : notes.length === 0 ? (
                        <div className="empty-state">No notes found in your library.</div>
                    ) : (
                        <div className="notes-list" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {notes.map(note => (
                                <div
                                    key={note._id}
                                    onClick={() => onSelect(note)}
                                    className="note-item"
                                    style={{
                                        padding: '16px',
                                        borderRadius: '12px',
                                        background: 'rgba(255, 255, 255, 0.05)',
                                        border: '1px solid var(--glass-border)',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '15px',
                                        transition: 'all 0.2s ease'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background = 'rgba(99, 102, 241, 0.1)';
                                        e.currentTarget.style.borderColor = 'var(--primary)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                                        e.currentTarget.style.borderColor = 'var(--glass-border)';
                                    }}
                                >
                                    <div style={{
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: '8px',
                                        background: 'rgba(99, 102, 241, 0.2)',
                                        color: 'var(--primary)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '1.2rem'
                                    }}>
                                        <FiFileText />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <h4 style={{ margin: '0 0 4px 0', color: '#fff', fontSize: '1rem' }}>{note.title}</h4>
                                        <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                                            {note.subject} • {note.type === 'pastpaper' ? 'Past Paper' : 'Note'} • {new Date(note.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default NoteSelectionModal;
