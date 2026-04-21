import React from 'react';
import { Car } from 'lucide-react';

const ParkingManagement = () => (
  <div className="flex h-full items-center justify-center p-10 bg-white rounded-3xl border border-slate-100 shadow-sm animate-in fade-in">
    <div className="text-center space-y-4">
      <div className="w-16 h-16 bg-slate-100 text-slate-500 rounded-2xl mx-auto flex items-center justify-center">
        <Car className="w-8 h-8" />
      </div>
      <h2 className="text-2xl font-bold text-slate-800">Parking Assignments</h2>
      <p className="text-slate-500 max-w-md mx-auto italic">Vehicle tracking and automated slot allocation management interface.</p>
    </div>
  </div>
);

export default ParkingManagement;
