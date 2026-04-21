import React from 'react';
import { ShieldCheck } from 'lucide-react';

const VisitorManagement = () => (
  <div className="flex h-full items-center justify-center p-10 bg-white rounded-3xl border border-slate-100 shadow-sm animate-in fade-in">
    <div className="text-center space-y-4">
      <div className="w-16 h-16 bg-blue-100 text-blue-500 rounded-2xl mx-auto flex items-center justify-center">
        <ShieldCheck className="w-8 h-8" />
      </div>
      <h2 className="text-2xl font-bold text-slate-800">Visitor Logs</h2>
      <p className="text-slate-500 max-w-md mx-auto italic">Historical logs and security oversight for all complex entries. Integration with the Security App is in progress.</p>
    </div>
  </div>
);

export default VisitorManagement;
