import React, { useState } from 'react';
import { useResidents } from '../../hooks/use-residents';
import { useFlats } from '../../hooks/use-flats';
import { 
  Users, Plus, Search, Filter, 
  MoreVertical, Mail, Phone, Home,
  Edit2, Trash2, CheckCircle2, Clock
} from 'lucide-react';

const ResidentsManagement = () => {
  const { residents, loading, error, createResident, deleteResident, updateResident } = useResidents();
  const { flats } = useFlats();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingResident, setEditingResident] = useState(null);
  const [newResident, setNewResident] = useState({
    name: '', email: '', phone: '', resident_type: 'Owner', flat_id: '', password: 'password123',
    extra_details: { ownership_date: '', rent: '', lease_start: '', lease_end: '' }
  });

  if (loading) return (
    <div className="flex items-center justify-center h-full">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
    </div>
  );

  const filteredResidents = residents.filter(r => 
    r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddResident = async (e) => {
    e.preventDefault();
    try {
      await createResident(newResident);
      setIsAddModalOpen(false);
      setNewResident({ 
        name: '', email: '', phone: '', resident_type: 'Owner', flat_id: '', password: 'password123',
        extra_details: { ownership_date: '', rent: '', lease_start: '', lease_end: '' }
      });
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add resident');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to remove this resident?')) {
      try {
        await deleteResident(id);
      } catch (err) {
        alert('Failed to delete resident');
      }
    }
  };

  const handleEdit = (resident) => {
    setEditingResident(resident);
    setIsEditModalOpen(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateResident(editingResident.resident_id, editingResident);
      setIsEditModalOpen(false);
      setEditingResident(null);
    } catch (err) {
      alert('Failed to update resident');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 relative">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">Resident Directory</h2>
          <p className="text-slate-500 font-medium">Manage and monitor all society members.</p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 bg-emerald-500 text-white px-5 py-3 rounded-xl font-bold text-sm shadow-lg shadow-emerald-500/20 hover:bg-emerald-400 transition-all active:scale-95"
        >
          <Plus className="h-5 w-5" />
          Add New Resident
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="relative w-full sm:w-96 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
            <input 
              type="text" 
              placeholder="Search by name, email or phone..."
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none text-slate-900 font-medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <button className="p-3 bg-slate-50 text-slate-600 rounded-xl hover:bg-slate-100 transition-colors">
              <Filter className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-400">Resident Detail</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-400">Unit Info</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-400">Status</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-400">Contact</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredResidents.map(resident => (
                <tr key={resident.resident_id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                        {resident.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{resident.name}</p>
                        <p className="text-xs text-slate-500 font-medium">{resident.resident_type}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2 text-slate-700">
                      <Home className="h-4 w-4 text-slate-400" />
                      <span className="font-semibold text-sm">
                        {resident.flat_id ? `Flat #${resident.flat_id}` : 'Not Assigned'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                      resident.resident_type === 'Owner' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {resident.resident_type === 'Owner' ? <CheckCircle2 className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                      {resident.resident_type}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
                        <Mail className="h-3 w-3 opacity-60" /> {resident.email}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
                        <Phone className="h-3 w-3 opacity-60" /> {resident.phone}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => handleEdit(resident)}
                        className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(resident.resident_id)}
                        className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Resident Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-white/20">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-xl font-bold text-slate-900">Add New Resident</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400">
                <Plus className="h-6 w-6 rotate-45" />
              </button>
            </div>
            <form onSubmit={handleAddResident} className="p-8 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 pl-1">Full Name</label>
                  <input 
                    required type="text" placeholder="John Doe"
                    className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-emerald-500/20 outline-none text-sm font-medium"
                    value={newResident.name} onChange={e => setNewResident({...newResident, name: e.target.value})}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 pl-1">Phone Number</label>
                  <input 
                    required type="text" placeholder="+91 98765 43210"
                    className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-emerald-500/20 outline-none text-sm font-medium"
                    value={newResident.phone} onChange={e => setNewResident({...newResident, phone: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 pl-1">Email Address</label>
                <input 
                  required type="email" placeholder="john@example.com"
                  className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-emerald-500/20 outline-none text-sm font-medium"
                  value={newResident.email} onChange={e => setNewResident({...newResident, email: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 pl-1">Type</label>
                  <select 
                    className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-emerald-500/20 outline-none text-sm font-medium appearance-none"
                    value={newResident.resident_type} onChange={e => setNewResident({...newResident, resident_type: e.target.value})}
                  >
                    <option value="Owner">Owner</option>
                    <option value="Tenant">Tenant</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 pl-1">Assigned Flat</label>
                  <select 
                    required className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-emerald-500/20 outline-none text-sm font-medium appearance-none"
                    value={newResident.flat_id} onChange={e => setNewResident({...newResident, flat_id: e.target.value})}
                  >
                    <option value="">Select Flat</option>
                    {flats
                      .filter(f => !residents.some(r => r.flat_id === f.flat_id))
                      .map(f => (
                        <option key={f.flat_id} value={f.flat_id}>{f.building_name} - {f.flat_number}</option>
                      ))}
                  </select>
                </div>
              </div>

              {/* Dynamic Specialization Fields */}
              {newResident.resident_type === 'Owner' && (
                <div className="space-y-1.5 animate-in slide-in-from-top-2 duration-300">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 pl-1">Ownership Date</label>
                  <input 
                    required type="date"
                    className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-emerald-500/20 outline-none text-sm font-medium"
                    value={newResident.extra_details.ownership_date} 
                    onChange={e => setNewResident({...newResident, extra_details: {...newResident.extra_details, ownership_date: e.target.value}})}
                  />
                </div>
              )}

              {newResident.resident_type === 'Tenant' && (
                <div className="space-y-4 animate-in slide-in-from-top-2 duration-300">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500 pl-1">Monthly Rent</label>
                    <input 
                      required type="number" placeholder="25000"
                      className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-emerald-500/20 outline-none text-sm font-medium"
                      value={newResident.extra_details.rent} 
                      onChange={e => setNewResident({...newResident, extra_details: {...newResident.extra_details, rent: e.target.value}})}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-500 pl-1">Lease Start</label>
                      <input 
                        required type="date"
                        className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-emerald-500/20 outline-none text-sm font-medium"
                        value={newResident.extra_details.lease_start} 
                        onChange={e => setNewResident({...newResident, extra_details: {...newResident.extra_details, lease_start: e.target.value}})}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-500 pl-1">Lease End</label>
                      <input 
                        required type="date"
                        className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-emerald-500/20 outline-none text-sm font-medium"
                        value={newResident.extra_details.lease_end} 
                        onChange={e => setNewResident({...newResident, extra_details: {...newResident.extra_details, lease_end: e.target.value}})}
                      />
                    </div>
                  </div>
                </div>
              )}

              <button type="submit" className="w-full py-4 bg-emerald-500 text-white rounded-2xl font-bold shadow-lg shadow-emerald-500/20 hover:bg-emerald-400 transition-all mt-4 transform active:scale-[0.98]">
                Register Resident
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Resident Modal */}
      {isEditModalOpen && editingResident && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-white/20">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-xl font-bold text-slate-900">Edit Resident</h3>
              <button onClick={() => setIsEditModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400">
                <Plus className="h-6 w-6 rotate-45" />
              </button>
            </div>
            <form onSubmit={handleUpdate} className="p-8 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 pl-1">Full Name</label>
                  <input 
                    required type="text"
                    className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-emerald-500/20 outline-none text-sm font-medium"
                    value={editingResident.name} onChange={e => setEditingResident({...editingResident, name: e.target.value})}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 pl-1">Phone Number</label>
                  <input 
                    required type="text"
                    className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-emerald-500/20 outline-none text-sm font-medium"
                    value={editingResident.phone} onChange={e => setEditingResident({...editingResident, phone: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 pl-1">Email Address</label>
                <input 
                  required type="email"
                  className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-emerald-500/20 outline-none text-sm font-medium"
                  value={editingResident.email} onChange={e => setEditingResident({...editingResident, email: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 pl-1">Type</label>
                  <select 
                    className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-emerald-500/20 outline-none text-sm font-medium appearance-none"
                    value={editingResident.resident_type} onChange={e => setEditingResident({...editingResident, resident_type: e.target.value})}
                  >
                    <option value="Owner">Owner</option>
                    <option value="Tenant">Tenant</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 pl-1">Assigned Flat</label>
                  <select 
                    className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-emerald-500/20 outline-none text-sm font-medium appearance-none"
                    value={editingResident.flat_id || ''} onChange={e => setEditingResident({...editingResident, flat_id: e.target.value})}
                  >
                    <option value="">Select Flat</option>
                    {flats
                      .filter(f => f.flat_id === editingResident.flat_id || !residents.some(r => r.flat_id === f.flat_id))
                      .map(f => (
                        <option key={f.flat_id} value={f.flat_id}>{f.building_name} - {f.flat_number}</option>
                      ))}
                  </select>
                </div>
              </div>

              <button type="submit" className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-600/20 hover:bg-blue-500 transition-all mt-4 transform active:scale-[0.98]">
                Update Resident Details
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResidentsManagement;
