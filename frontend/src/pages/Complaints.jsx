import React, { useEffect, useState } from 'react';
import client from '../api/client';
import { useAuth } from '../context/AuthContext';
import { MessageSquare, Plus, ChevronRight } from 'lucide-react';
import './Complaints.css';

const Complaints = () => {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    description: '',
    complaint_type: 'General',
    priority: 'Medium'
  });

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const { data } = await client.get('/complaints');
      setComplaints(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await client.post('/complaints', formData);
      setShowForm(false);
      setFormData({ description: '', complaint_type: 'General', priority: 'Medium' });
      fetchComplaints();
    } catch (err) {
      console.error(err);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await client.patch(`/complaints/${id}`, { status });
      fetchComplaints();
    } catch (err) {
      console.error(err);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Open': return '#ef4444';
      case 'In Progress': return '#f59e0b';
      case 'Resolved': return '#10b981';
      default: return '#64748b';
    }
  };

  return (
    <div className="complaints-page">
      <div className="page-header">
        <div className="header-text">
          <h1>Complaints Desk</h1>
          <p>Raise and track maintenance or general issues.</p>
        </div>
        {user.resident_type !== 'Admin' && (
          <button className="add-btn" onClick={() => setShowForm(!showForm)}>
            <Plus size={20} />
            New Complaint
          </button>
        )}
      </div>

      {showForm && (
        <div className="complaint-form-card">
          <h3>Raise New Complaint</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Type</label>
                <select 
                  value={formData.complaint_type} 
                  onChange={(e) => setFormData({...formData, complaint_type: e.target.value})}
                >
                  <option>General</option>
                  <option>Plumbing</option>
                  <option>Electrical</option>
                  <option>Security</option>
                </select>
              </div>
              <div className="form-group">
                <label>Priority</label>
                <select 
                  value={formData.priority} 
                  onChange={(e) => setFormData({...formData, priority: e.target.value})}
                >
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea 
                rows="3" 
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                required
              />
            </div>
            <div className="form-actions">
              <button type="button" className="cancel-btn" onClick={() => setShowForm(false)}>Cancel</button>
              <button type="submit" className="submit-btn">Submit Complaint</button>
            </div>
          </form>
        </div>
      )}

      <div className="complaints-list">
        {complaints.map((c) => (
          <div key={c.complaint_id} className="complaint-card">
            <div className="complaint-main">
              <div className="complaint-icon" style={{ color: getStatusColor(c.status) }}>
                <MessageSquare size={24} />
              </div>
              <div className="complaint-info">
                <div className="info-top">
                  <span className="complaint-type">{c.complaint_type}</span>
                  <span className="complaint-priority" data-priority={c.priority}>{c.priority} Priority</span>
                </div>
                <p className="complaint-desc">{c.description}</p>
                <div className="info-bottom">
                  <span>ID: #{c.complaint_id}</span>
                  <span>•</span>
                  <span>{new Date(c.date).toLocaleString()}</span>
                  {user.resident_type === 'Admin' && c.Resident && (
                    <>
                      <span>•</span>
                      <span className="complaint-user">By: {c.Resident.name}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="complaint-status-area">
              <div className="status-badge" style={{ backgroundColor: getStatusColor(c.status) + '15', color: getStatusColor(c.status) }}>
                {c.status}
              </div>
              {user.resident_type === 'Admin' && c.status !== 'Resolved' && (
                <div className="admin-actions">
                  <select 
                    value={c.status}
                    onChange={(e) => handleStatusUpdate(c.complaint_id, e.target.value)}
                  >
                    <option value="Open">Open</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Complaints;
