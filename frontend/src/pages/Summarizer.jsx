import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import NoteSelectionModal from '../components/NoteSelectionModal';
import api from '../services/api';
import { FiDownload, FiCpu, FiFileText, FiList } from 'react-icons/fi';
import '../Main.css';

const Summarizer = ({ onLogout }) => {
    const [notes, setNotes] = useState('');
    const [summary, setSummary] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const handleSummarize = async () => {
        if (!notes.trim()) {
            setError('Please enter some notes to summarize.');
            return;
        }

        setLoading(true);
        setError(null);
        setSummary('');

        try {
            const response = await api.post('/summarize', { notes });
            setSummary(response.summary);
        } catch (err) {
            console.error('Summarization failed:', err);
            const errorMessage = err.response?.data?.error || err.response?.data?.message || 'Failed to generate summary. Please try again later.';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleNoteSelect = async (note) => {
        setShowModal(false);
        setLoading(true);
        setError(null);
        setSummary('');
        // Clear manual input to avoid confusion, or maybe show selected note title?
        setNotes(`[Selected Note: ${note.title}]\n(Processing PDF content on server...)`);

        try {
            const response = await api.post('/summarize', { noteId: note._id });
            setSummary(response.summary);
        } catch (err) {
            console.error('Summarization failed:', err);
            const errorMessage = err.response?.data?.error || err.response?.data?.message || 'Failed to generate summary. Please try again later.';
            setError(errorMessage);
            setNotes(''); // Clear the placeholder if it failed
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = () => {
        if (!summary) return;

        const element = document.createElement('a');
        const file = new Blob([summary], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = 'summary.txt';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    };

    return (
        <div className="dashboard-container">
            <Sidebar onLogout={onLogout} />

            <div className="main-content">
                <Header
                    title="AI Notes Summarizer"
                    subtitle="Transform your long notes into concise summaries instantly using AI."
                />

                <div className="section">
                    <div className="card" style={{ padding: '2rem' }}>
                        <div className="form-group">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                <label htmlFor="notes-input" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold' }}>
                                    <FiFileText /> Paste your notes here:
                                </label>
                                <button
                                    className="btn btn-secondary"
                                    onClick={() => setShowModal(true)}
                                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', padding: '6px 12px' }}
                                >
                                    <FiList /> Select from Library
                                </button>
                            </div>
                            <textarea
                                id="notes-input"
                                className="form-control"
                                style={{
                                    width: '100%',
                                    minHeight: '200px',
                                    padding: '1rem',
                                    borderRadius: '8px',
                                    border: '1px solid var(--border-color)',
                                    backgroundColor: 'var(--bg-secondary)',
                                    color: 'var(--text-primary)',
                                    marginBottom: '1.5rem',
                                    resize: 'vertical'
                                }}
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="Paste or type your notes content here..."
                            />
                        </div>

                        {error && (
                            <div className="alert alert-error" style={{ marginBottom: '1rem' }}>
                                {error}
                            </div>
                        )}

                        <button
                            className="btn btn-primary"
                            onClick={handleSummarize}
                            disabled={loading}
                            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                        >
                            <FiCpu /> {loading ? 'Summarizing...' : 'Summarize Notes'}
                        </button>
                    </div>

                    {summary && (
                        <div className="card" style={{ marginTop: '2rem', padding: '2rem' }}>
                            <div className="section-header" style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <h3>Summary Result</h3>
                                <button
                                    className="btn btn-secondary"
                                    onClick={handleDownload}
                                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                                >
                                    <FiDownload /> Download
                                </button>
                            </div>
                            <div
                                className="summary-content"
                                style={{
                                    backgroundColor: 'var(--bg-secondary)',
                                    padding: '1.5rem',
                                    borderRadius: '8px',
                                    whiteSpace: 'pre-wrap',
                                    lineHeight: '1.6'
                                }}
                            >
                                {summary}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {showModal && (
                <NoteSelectionModal
                    onClose={() => setShowModal(false)}
                    onSelect={handleNoteSelect}
                />
            )}
        </div>
    );
};

export default Summarizer;
