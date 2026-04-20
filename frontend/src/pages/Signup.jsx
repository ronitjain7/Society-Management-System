import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import client from '../api/client';
import './Signup.css';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    resident_type: 'Owner',
    flat_id: '',
    extra_details: {
      ownership_date: '',
      rent: '',
      lease_start: '',
      lease_end: ''
    }
  });
  
  const [flats, setFlats] = useState([]);
  const [error, setError] = useState('');
  const [loadingFlats, setLoadingFlats] = useState(true);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFlats = async () => {
      try {
        const { data } = await client.get('/flats/public');
        setFlats(data);
        if (data.length > 0) {
          setFormData(prev => ({ ...prev, flat_id: data[0].flat_id }));
        }
      } catch (err) {
        console.error('Failed to fetch flats:', err);
      } finally {
        setLoadingFlats(false);
      }
    };
    fetchFlats();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Prepare data for API
    const submissionData = { ...formData };
    
    // Clean up extra_details based on type
    if (formData.resident_type === 'Owner') {
      submissionData.extra_details = { ownership_date: formData.extra_details.ownership_date };
    } else {
      submissionData.extra_details = { 
        rent: formData.extra_details.rent,
        lease_start: formData.extra_details.lease_start,
        lease_end: formData.extra_details.lease_end
      };
    }

    try {
      await register(submissionData);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <div className="signup-header">
          <h1>Join Smart Society</h1>
          <p>Create your account to manage your residency easily.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="signup-form">
          {error && <div className="error-message">{error}</div>}
          
          <div className="form-grid">
            <div className="form-group">
              <label>Full Name</label>
              <input 
                type="text" 
                name="name"
                value={formData.name} 
                onChange={handleChange} 
                placeholder="John Doe"
                required 
              />
            </div>
            
            <div className="form-group">
              <label>Email Address</label>
              <input 
                type="email" 
                name="email"
                value={formData.email} 
                onChange={handleChange} 
                placeholder="john@example.com"
                required 
              />
            </div>
            
            <div className="form-group">
              <label>Phone Number</label>
              <input 
                type="text" 
                name="phone"
                value={formData.phone} 
                onChange={handleChange} 
                placeholder="+1 234 567 890"
                required 
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input 
                type="password" 
                name="password"
                value={formData.password} 
                onChange={handleChange} 
                placeholder="••••••••"
                required 
              />
            </div>
          </div>

          <div className="form-divider">Residency Details</div>

          <div className="form-grid">
            <div className="form-group">
              <label>Resident Type</label>
              <select name="resident_type" value={formData.resident_type} onChange={handleChange}>
                <option value="Owner">Owner</option>
                <option value="Tenant">Tenant</option>
              </select>
            </div>

            <div className="form-group">
              <label>Select Flat</label>
              <select 
                name="flat_id" 
                value={formData.flat_id} 
                onChange={handleChange}
                disabled={loadingFlats}
                required
              >
                {flats.map(flat => (
                  <option key={flat.flat_id} value={flat.flat_id}>
                    {flat.building_name} - {flat.flat_number} (Floor {flat.floor})
                  </option>
                ))}
              </select>
              {loadingFlats && <span className="input-hint">Loading flats...</span>}
            </div>

            {formData.resident_type === 'Owner' ? (
              <div className="form-group full-width">
                <label>Ownership Date</label>
                <input 
                  type="date" 
                  name="extra_details.ownership_date"
                  value={formData.extra_details.ownership_date} 
                  onChange={handleChange} 
                  required 
                />
              </div>
            ) : (
              <>
                <div className="form-group">
                  <label>Monthly Rent</label>
                  <input 
                    type="number" 
                    name="extra_details.rent"
                    value={formData.extra_details.rent} 
                    onChange={handleChange} 
                    placeholder="0.00"
                    required 
                  />
                </div>
                <div className="form-group">
                  <label>Lease Start</label>
                  <input 
                    type="date" 
                    name="extra_details.lease_start"
                    value={formData.extra_details.lease_start} 
                    onChange={handleChange} 
                    required 
                  />
                </div>
                <div className="form-group">
                  <label>Lease End</label>
                  <input 
                    type="date" 
                    name="extra_details.lease_end"
                    value={formData.extra_details.lease_end} 
                    onChange={handleChange} 
                    required 
                  />
                </div>
              </>
            )}
          </div>
          
          <button type="submit" className="signup-btn">
            Create Account
          </button>

          <p className="auth-footer">
            Already have an account? <Link to="/login">Sign In</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;
