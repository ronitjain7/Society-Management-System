import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Users, UserCog, ArrowRight } from 'lucide-react';
import './Signup.css'; // Reusing the premium styles

const RoleSelection = () => {
  const navigate = useNavigate();

  const roles = [
    {
      id: 'Admin',
      title: 'Society Admin',
      description: 'Manage residents, maintenance, and society operations.',
      icon: UserCog,
      color: 'from-emerald-500 to-teal-600',
      path: '/signup?role=Admin'
    },
    {
      id: 'Resident',
      title: 'Resident',
      description: 'Access your dashboard, pay maintenance, and raise complaints.',
      icon: Users,
      color: 'from-blue-500 to-indigo-600',
      path: '/signup?role=Resident'
    },
    {
      id: 'Security',
      title: 'Security Staff',
      description: 'Manage visitor entry, parking, and society safety.',
      icon: Shield,
      color: 'from-orange-500 to-rose-600',
      path: '/signup?role=Security'
    }
  ];

  return (
    <div className="signup-container">
      <div className="signup-card" style={{ maxWidth: '1000px' }}>
        <div className="signup-header">
          <h1>Select Your Role</h1>
          <p>Choose your department to continue to SocietyEase.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
          {roles.map((role) => (
            <div 
              key={role.id}
              onClick={() => navigate(role.path)}
              className="group relative bg-white/50 hover:bg-white rounded-3xl p-8 border border-white/50 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all cursor-pointer"
            >
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${role.color} flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform`}>
                <role.icon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">{role.title}</h3>
              <p className="text-sm text-slate-500 mb-6 leading-relaxed">
                {role.description}
              </p>
              <div className="flex items-center gap-2 text-sm font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                Get Started <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>

        <p className="auth-footer mt-12">
          Already have an account? <span className="cursor-pointer text-emerald-600 font-bold" onClick={() => navigate('/login')}>Sign In</span>
        </p>
      </div>
    </div>
  );
};

export default RoleSelection;
