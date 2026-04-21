import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, ArrowRight, UserCog, Users, Shield } from 'lucide-react';
import './Login.css';

const Login = () => {
  const [role, setRole] = useState('Resident');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      // Logic to check if user role matches selected role could be added here if backend validates it
      navigate('/');
    } catch (err) {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>SocietyEase</h1>
          <p>Login to your {role} account.</p>
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
        
        <form onSubmit={handleSubmit} className="login-form">
          {error && <div className="error-message">{error}</div>}
          
          <div className="form-group">
            <label>Email Address</label>
            <div className="input-container">
              <Mail className="w-5 h-5" />
              <input 
                className="premium-input"
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="name@example.com"
                required 
              />
            </div>
          </div>
          
          <div className="form-group">
            <label>Password</label>
            <div className="input-container">
              <Lock className="w-5 h-5" />
              <input 
                className="premium-input"
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="••••••••"
                required 
              />
            </div>
          </div>
          
          <button type="submit" className="login-btn">
            Sign In as {role} <ArrowRight className="inline-block ml-2 w-5 h-5" style={{ verticalAlign: 'middle' }} />
          </button>

          <p className="auth-footer">
            Don't have an account? <Link to="/signup">Sign Up</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
