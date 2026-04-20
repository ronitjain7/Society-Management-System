import React from 'react';
import './StatCard.css';

const StatCard = ({ title, value, icon, color }) => {
  return (
    <div className="stat-card">
      <div className="stat-icon" style={{ backgroundColor: color + '20', color: color }}>
        {icon}
      </div>
      <div className="stat-info">
        <h3>{value}</h3>
        <p>{title}</p>
      </div>
    </div>
  );
};

export default StatCard;
