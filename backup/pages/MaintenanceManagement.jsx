import React from 'react';
import { Wallet } from 'lucide-react';

const MaintenanceManagement = () => (
  <div className="flex h-full items-center justify-center p-10 bg-white rounded-3xl border border-slate-100 shadow-sm animate-in fade-in">
    <div className="text-center space-y-4">
      <div className="w-16 h-16 bg-amber-100 text-amber-500 rounded-2xl mx-auto flex items-center justify-center">
        <Wallet className="w-8 h-8" />
      </div>
      <h2 className="text-2xl font-bold text-slate-800">Maintenance Management</h2>
      <p className="text-slate-500 max-w-md mx-auto italic">This module is currently being connected to the billing engine. Please check back shortly for financial oversight.</p>
    </div>
  </div>
);

export default MaintenanceManagement;
