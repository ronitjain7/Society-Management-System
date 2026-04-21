import React from 'react';
import { CalendarCheck } from 'lucide-react';

const FacilityManagement = () => (
  <div className="flex h-full items-center justify-center p-10 bg-white rounded-3xl border border-slate-100 shadow-sm animate-in fade-in">
    <div className="text-center space-y-4">
      <div className="w-16 h-16 bg-emerald-100 text-emerald-500 rounded-2xl mx-auto flex items-center justify-center">
        <CalendarCheck className="w-8 h-8" />
      </div>
      <h2 className="text-2xl font-bold text-slate-800">Facility Management</h2>
      <p className="text-slate-500 max-w-md mx-auto italic">Bookings, maintenance, and schedule management for community common areas.</p>
    </div>
  </div>
);

export default FacilityManagement;
