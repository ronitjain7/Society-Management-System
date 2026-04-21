import React, { useState } from 'react';
import { useFlats } from '../../hooks/use-flats';
import { 
  Building, Plus, Search, Map, 
  Layers, Square, Info, Edit3, 
  MoreVertical, CheckCircle2, AlertCircle
} from 'lucide-react';

const FlatsManagement = () => {
  const { flats, loading, error, createFlat, deleteFlat, updateFlat } = useFlats();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingFlat, setEditingFlat] = useState(null);
  const [newFlat, setNewFlat] = useState({
    building_name: '', floor: '', flat_number: '', config_type: '2BHK', area_sqft: ''
  });

  if (loading) return (
    <div className="flex items-center justify-center h-full">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
    </div>
  );

  const filteredFlats = flats.filter(f => 
    f.building_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.flat_number.toString().includes(searchTerm)
  );

  const handleAddFlat = async (e) => {
    e.preventDefault();
    try {
      await createFlat(newFlat);
      setIsAddModalOpen(false);
      setNewFlat({ building_name: '', floor: '', flat_number: '', config_type: '2BHK', area_sqft: '' });
    } catch (err) {
      alert('Failed to add flat');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to remove this flat? All linked records might be affected.')) {
      try {
        await deleteFlat(id);
      } catch (err) {
        alert('Failed to delete flat');
      }
    }
  };

  const handleEdit = (flat) => {
    setEditingFlat(flat);
    setIsEditModalOpen(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateFlat(editingFlat.flat_id, editingFlat);
      setIsEditModalOpen(false);
      setEditingFlat(null);
    } catch (err) {
      alert('Failed to update flat');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 relative">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">Inventory Management</h2>
          <p className="text-slate-500 font-medium">Detailed oversight of society infrastructure.</p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-3 rounded-xl font-bold text-sm shadow-lg shadow-indigo-600/20 hover:bg-indigo-500 transition-all active:scale-95"
        >
          <Plus className="h-5 w-5" />
          Add New Unit
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Statistics Bar */}
        <div className="xl:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 flex items-center gap-4 shadow-sm">
            <div className="p-3 bg-indigo-100 text-indigo-600 rounded-xl">
              <Building className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Buildings</p>
              <p className="text-xl font-bold text-slate-900">12</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-100 flex items-center gap-4 shadow-sm">
            <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl">
              <Layers className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Units</p>
              <p className="text-xl font-bold text-slate-900">{flats.length}</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-100 flex items-center gap-4 shadow-sm">
            <div className="p-3 bg-amber-100 text-amber-600 rounded-xl">
              <Square className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Available Sqft</p>
              <p className="text-xl font-bold text-slate-900">1.2M</p>
            </div>
          </div>
        </div>

        <div className="xl:col-span-3 bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-50/30">
            <div className="relative w-full sm:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search flat number or building..."
                className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-slate-900 font-medium transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-400">Building</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-400">Unit No.</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-400">Configuration</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-400">Area</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-400 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredFlats.map(flat => (
                  <tr key={flat.flat_id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-slate-100 text-slate-600 rounded-lg flex items-center justify-center font-bold">
                          <Building className="h-5 w-5 opacity-60" />
                        </div>
                        <span className="font-bold text-slate-900">{flat.building_name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 font-bold text-slate-700">
                      Floor {flat.floor} - Unit {flat.flat_number}
                    </td>
                    <td className="px-6 py-5">
                      <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-lg border border-indigo-100 uppercase tracking-tighter">
                        {flat.config_type}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-slate-600 font-semibold text-sm">
                      {flat.area_sqft} Sq.Ft
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => handleEdit(flat)}
                          className="p-2 text-slate-400 hover:text-indigo-600 transition-colors"
                        >
                          <Edit3 className="h-5 w-5" />
                        </button>
                        <button 
                          onClick={() => handleDelete(flat.flat_id)}
                          className="p-2 text-slate-400 hover:text-rose-600 transition-colors"
                        >
                          <Plus className="h-5 w-5 rotate-45" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Flat Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in zoom-in duration-200">
          <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-xl overflow-hidden">
            <div className="px-8 pt-8 pb-4 flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">Register New Unit</h3>
                <p className="text-slate-500 font-medium text-sm">Fill in the physical details of the property.</p>
              </div>
              <button 
                onClick={() => setIsAddModalOpen(false)} 
                className="p-3 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-500 transition-all"
              >
                <Plus className="h-6 w-6 rotate-45" />
              </button>
            </div>
            
            <form onSubmit={handleAddFlat} className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-slate-400 tracking-widest pl-1">Property Name / Wing</label>
                <input 
                  required type="text" placeholder="e.g. Skyline Heights - A Wing"
                  className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:border-indigo-500 focus:bg-white outline-none transition-all font-bold text-slate-900"
                  value={newFlat.building_name} onChange={e => setNewFlat({...newFlat, building_name: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase text-slate-400 tracking-widest pl-1">Floor No.</label>
                  <input 
                    required type="number" placeholder="4"
                    className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:border-indigo-500 focus:bg-white outline-none transition-all font-bold text-slate-900"
                    value={newFlat.floor} onChange={e => setNewFlat({...newFlat, floor: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase text-slate-400 tracking-widest pl-1">Flat No.</label>
                  <input 
                    required type="number" placeholder="402"
                    className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:border-indigo-500 focus:bg-white outline-none transition-all font-bold text-slate-900"
                    value={newFlat.flat_number} onChange={e => setNewFlat({...newFlat, flat_number: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase text-slate-400 tracking-widest pl-1">Unit Type</label>
                  <select 
                    className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:border-indigo-500 focus:bg-white outline-none transition-all font-bold text-slate-900 appearance-none"
                    value={newFlat.config_type} onChange={e => setNewFlat({...newFlat, config_type: e.target.value})}
                  >
                    <option value="1RK">1RK</option>
                    <option value="1BHK">1BHK</option>
                    <option value="2BHK">2BHK</option>
                    <option value="3BHK">3BHK</option>
                    <option value="Penthouse">Penthouse</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase text-slate-400 tracking-widest pl-1">Built-up Area (Sqft)</label>
                  <input 
                    required type="number" placeholder="1250"
                    className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:border-indigo-500 focus:bg-white outline-none transition-all font-bold text-slate-900"
                    value={newFlat.area_sqft} onChange={e => setNewFlat({...newFlat, area_sqft: e.target.value})}
                  />
                </div>
              </div>

              <button type="submit" className="w-full py-5 bg-black text-white rounded-[24px] font-black tracking-widest uppercase hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 mt-2">
                Commit Unit to Database
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Flat Modal */}
      {isEditModalOpen && editingFlat && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in zoom-in duration-200">
          <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-xl overflow-hidden">
            <div className="px-8 pt-8 pb-4 flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">Edit Unit Info</h3>
                <p className="text-slate-500 font-medium text-sm">Update the physical details of the property.</p>
              </div>
              <button 
                onClick={() => setIsEditModalOpen(false)} 
                className="p-3 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-500 transition-all"
              >
                <Plus className="h-6 w-6 rotate-45" />
              </button>
            </div>
            
            <form onSubmit={handleUpdate} className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-slate-400 tracking-widest pl-1">Property Name / Wing</label>
                <input 
                  required type="text"
                  className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:border-indigo-500 focus:bg-white outline-none transition-all font-bold text-slate-900"
                  value={editingFlat.building_name} onChange={e => setEditingFlat({...editingFlat, building_name: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase text-slate-400 tracking-widest pl-1">Floor No.</label>
                  <input 
                    required type="number"
                    className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:border-indigo-500 focus:bg-white outline-none transition-all font-bold text-slate-900"
                    value={editingFlat.floor} onChange={e => setEditingFlat({...editingFlat, floor: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase text-slate-400 tracking-widest pl-1">Flat No.</label>
                  <input 
                    required type="number"
                    className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:border-indigo-500 focus:bg-white outline-none transition-all font-bold text-slate-900"
                    value={editingFlat.flat_number} onChange={e => setEditingFlat({...editingFlat, flat_number: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase text-slate-400 tracking-widest pl-1">Unit Type</label>
                  <select 
                    className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:border-indigo-500 focus:bg-white outline-none transition-all font-bold text-slate-900 appearance-none"
                    value={editingFlat.config_type} onChange={e => setEditingFlat({...editingFlat, config_type: e.target.value})}
                  >
                    <option value="1RK">1RK</option>
                    <option value="1BHK">1BHK</option>
                    <option value="2BHK">2BHK</option>
                    <option value="3BHK">3BHK</option>
                    <option value="Penthouse">Penthouse</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase text-slate-400 tracking-widest pl-1">Built-up Area (Sqft)</label>
                  <input 
                    required type="number"
                    className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:border-indigo-500 focus:bg-white outline-none transition-all font-bold text-slate-900"
                    value={editingFlat.area_sqft} onChange={e => setEditingFlat({...editingFlat, area_sqft: e.target.value})}
                  />
                </div>
              </div>

              <button type="submit" className="w-full py-5 bg-indigo-600 text-white rounded-[24px] font-black tracking-widest uppercase hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-200 mt-2">
                Save Property Changes
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FlatsManagement;
