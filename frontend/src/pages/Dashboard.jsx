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