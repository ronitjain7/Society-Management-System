import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import client from '../api/client';
import { 
  User, Mail, Phone, Lock, Home, 
  Key, Calendar, DollarSign, ArrowRight, ShieldCheck,
  UserCog, Users, Shield
} from 'lucide-react';
import './Signup.css';

const Signup = () => {
  const [role, setRole] = useState('Resident'); // Default role
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    resident_type: 'Owner', // Sub-type for Resident
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

  // Role conversion for backend
  const getBackendRole = () => {
    if (role === 'Resident') return formData.resident_type; // Owner or Tenant
    return role; // Admin or Security
  };

  useEffect(() => {
    const backendRole = getBackendRole();
    if (backendRole !== 'Security' && backendRole !== 'Admin') {
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
    } else {
      setLoadingFlats(false);
    }
  }, [role, formData.resident_type]);

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
    
    const backendRole = getBackendRole();
    const submissionData = { 
      ...formData,
      resident_type: backendRole
    };
    
    if (backendRole === 'Security' || backendRole === 'Admin') {
      delete submissionData.flat_id;
      delete submissionData.extra_details;
    } else if (backendRole === 'Owner') {
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

  const InputField = ({ label, icon: Icon, children, className = "", ...props }) => (
    <div className={`form-group ${className}`}>
      <label>{label}</label>
      <div className="input-container">
        <Icon />
        {children ? (
          React.cloneElement(children, { className: "premium-input" })
        ) : (
          <input className="premium-input" {...props} />
        )}
      </div>
    </div>
  );

  const needsResidencyDetails = role === 'Resident';

  return (
    <div className="signup-container">
      <div className="signup-card">
        <div className="signup-header">
          <h1>Join SocietyEase</h1>
          <p>Select your role and begin your journey.</p>
        </div>

        {/* Role Switcher */}
        <div className="role-switcher">
          <button 
            type="button"
            className={role === 'Admin' ? 'active' : ''} 
            onClick={() => setRole('Admin')}
          >
            <UserCog className="w-4 h-4 mr-2" /> Admin
          </button>
          <button 
            type="button"
            className={role === 'Resident' ? 'active' : ''} 
            onClick={() => setRole('Resident')}
          >
            <Users className="w-4 h-4 mr-2" /> Resident
          </button>
          <button 
            type="button"
            className={role === 'Security' ? 'active' : ''} 
            onClick={() => setRole('Security')}
          >
            <Shield className="w-4 h-4 mr-2" /> Security
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="signup-form">
          {error && <div className="error-message">{error}</div>}
          
          <div className="form-grid">
            <InputField 
              label="Full Name" 
              icon={User}
              type="text" 
              name="name"
              value={formData.name} 
              onChange={handleChange} 
              placeholder="John Doe"
              required 
            />
            
            <InputField 
              label="Email Address" 
              icon={Mail}
              type="email" 
              name="email"
              value={formData.email} 
              onChange={handleChange} 
              placeholder="john@example.com"
              required 
            />
            
            <InputField 
              label="Phone Number" 
              icon={Phone}
              type="text" 
              name="phone"
              value={formData.phone} 
              onChange={handleChange} 
              placeholder="+1 (555) 000-0000"
              required 
            />

            <InputField 
              label="Password" 
              icon={Lock}
              type="password" 
              name="password"
              value={formData.password} 
              onChange={handleChange} 
              placeholder="••••••••"
              required 
            />
          </div>

          {needsResidencyDetails && (
            <>
              <div className="form-divider">Residency Details</div>

              <div className="form-grid">
                <InputField label="Resident Type" icon={Key}>
                  <select name="resident_type" value={formData.resident_type} onChange={handleChange}>
                    <option value="Owner">Owner</option>
                    <option value="Tenant">Tenant</option>
                  </select>
                </InputField>

                <InputField 
                  label="Select Flat" 
                  icon={Home}
                  className={loadingFlats ? "loading" : ""}
                >
                  <select 
                    name="flat_id" 
                    value={formData.flat_id} 
                    onChange={handleChange}
                    disabled={loadingFlats}
                    required
                  >
                    {flats.map(flat => (
                      <option key={flat.flat_id} value={flat.flat_id}>
                        {flat.building_name} - {flat.flat_number}
                      </option>
                    ))}
                  </select>
                </InputField>

                {formData.resident_type === 'Owner' ? (
                  <InputField 
                    label="Ownership Date" 
                    icon={Calendar}
                    type="date" 
                    name="extra_details.ownership_date"
                    value={formData.extra_details.ownership_date} 
                    onChange={handleChange} 
                    required 
                  />
                ) : (
                  <>
                    <InputField 
                      label="Monthly Rent" 
                      icon={DollarSign}
                      type="number" 
                      name="extra_details.rent"
                      value={formData.extra_details.rent} 
                      onChange={handleChange} 
                      placeholder="0.00"
                      required 
                    />
                    <InputField 
                      label="Lease Start" 
                      icon={Calendar}
                      type="date" 
                      name="extra_details.lease_start"
                      value={formData.extra_details.lease_start} 
                      onChange={handleChange} 
                      required 
                    />
                    <InputField 
                      label="Lease End" 
                      icon={Calendar}
                      type="date" 
                      name="extra_details.lease_end"
                      value={formData.extra_details.lease_end} 
                      onChange={handleChange} 
                      required 
                    />
                  </>
                )}
              </div>
            </>
          )}

          {role === 'Security' && (
            <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-start gap-4">
              <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0 mt-1" />
              <div>
                <h4 className="text-emerald-900 font-bold mb-1">Security Personnel</h4>
                <p className="text-emerald-700 text-sm leading-relaxed">
                  You will have access to gate control and visitor management systems. No flat assignment is needed for security staff.
                </p>
              </div>
            </div>
          )}

          {role === 'Admin' && (
            <div className="p-6 bg-indigo-50 rounded-2xl border border-indigo-100 flex items-start gap-4">
              <UserCog className="w-6 h-6 text-indigo-600 shrink-0 mt-1" />
              <div>
                <h4 className="text-indigo-900 font-bold mb-1">Admin Access</h4>
                <p className="text-indigo-700 text-sm leading-relaxed">
                  Society administrators can manage flats, residents, and general maintenance schedules.
                </p>
              </div>
            </div>
          )}
          
          <button type="submit" className="signup-btn">
            Register as {role === 'Resident' ? formData.resident_type : role} <ArrowRight className="inline-block ml-2 w-5 h-5" style={{ verticalAlign: 'middle' }} />
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
