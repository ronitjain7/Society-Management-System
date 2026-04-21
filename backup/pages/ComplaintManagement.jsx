import React from 'react';
import { Wrench } from 'lucide-react';

const ComplaintManagement = () => (
  <div className="flex h-full items-center justify-center p-10 bg-white rounded-3xl border border-slate-100 shadow-sm animate-in fade-in">
    <div className="text-center space-y-4">
      <div className="w-16 h-16 bg-rose-100 text-rose-500 rounded-2xl mx-auto flex items-center justify-center">
        <Wrench className="w-8 h-8" />
      </div>
      <h2 className="text-2xl font-bold text-slate-800">Complaint Tracker</h2>
      <p className="text-slate-500 max-w-md mx-auto italic">Service management portal is coming soon. Admins will be able to dispatch work orders and update ticket statuses here.</p>
    </div>
  </div>
);

export default ComplaintManagement;
