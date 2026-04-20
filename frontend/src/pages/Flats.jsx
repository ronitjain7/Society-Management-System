import React, { useEffect, useState } from 'react';
import client from '../api/client';
import { Building2, Plus, Search, Info } from 'lucide-react';
import './Flats.css';

const Flats = () => {
  const [flats, setFlats] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newFlat, setNewFlat] = useState({
    flat_number: '',
    floor: '',
    building_name: '',
    config_type: '2BHK',
    area_sqft: ''
  });

  useEffect(() => {
    fetchFlats();
  }, []);

  const fetchFlats = async () => {
    try {
      const { data } = await client.get('/flats');
      setFlats(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await client.post('/flats', newFlat);
      setShowAddForm(false);
      setNewFlat({ flat_number: '', floor: '', building_name: '', config_type: '2BHK', area_sqft: '' });
      fetchFlats();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredFlats = flats.filter(f => 
    f.flat_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.building_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flats-page">
      <div className="page-header">
        <div className="header-text">
          <h1>Flat Registry</h1>
          <p>Manage society apartments, floors, and buildings.</p>
        </div>
        <button className="add-btn" onClick={() => setShowAddForm(!showAddForm)}>
          <Plus size={20} />
          Add Flat
        </button>
      </div>

      <div className="search-bar">
        <Search size={20} className="search-icon" />
        <input 
          type="text" 
          placeholder="Search by flat number or building..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {showAddForm && (
        <div className="add-flat-card">
          <h3>Register New Flat</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label>Flat Number</label>
                <input 
                  type="text" 
                  value={newFlat.flat_number}
                  onChange={(e) => setNewFlat({...newFlat, flat_number: e.target.value})}
                  required 
                />
              </div>
              <div className="form-group">
                <label>Floor</label>
                <input 
                  type="number" 
                  value={newFlat.floor}
                  onChange={(e) => setNewFlat({...newFlat, floor: e.target.value})}
                  required 
                />
              </div>
              <div className="form-group">
                <label>Building Name</label>
                <input 
                  type="text" 
                  value={newFlat.building_name}
                  onChange={(e) => setNewFlat({...newFlat, building_name: e.target.value})}
                  required 
                />
              </div>
              <div className="form-group">
                <label>Configuration</label>
                <select 
                  value={newFlat.config_type}
                  onChange={(e) => setNewFlat({...newFlat, config_type: e.target.value})}
                >
                  <option>1BHK</option>
                  <option>2BHK</option>
                  <option>3BHK</option>
                  <option>4BHK</option>
                  <option>Penthouse</option>
                </select>
              </div>
              <div className="form-group">
                <label>Area (Sqft)</label>
                <input 
                  type="number" 
                  value={newFlat.area_sqft}
                  onChange={(e) => setNewFlat({...newFlat, area_sqft: e.target.value})}
                  required 
                />
              </div>
            </div>
            <div className="form-actions">
              <button type="button" className="cancel-btn" onClick={() => setShowAddForm(false)}>Cancel</button>
              <button type="submit" className="submit-btn" style={{ background: '#4f46e5', color: 'white' }}>Save Flat</button>
            </div>
          </form>
        </div>
      )}

      <div className="flats-table-container">
        <table className="flats-table">
          <thead>
            <tr>
              <th>Flat Number</th>
              <th>Building</th>
              <th>Floor</th>
              <th>Type</th>
              <th>Area</th>
              <th>Parkings</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredFlats.map(flat => (
              <tr key={flat.flat_id}>
                <td><strong>{flat.flat_number}</strong></td>
                <td>{flat.building_name}</td>
                <td>{flat.floor}</td>
                <td><span className="type-badge">{flat.config_type}</span></td>
                <td>{flat.area_sqft} sqft</td>
                <td>{flat.Parkings ? flat.Parkings.length : 0}</td>
                <td>
                  <button className="icon-btn"><Info size={18} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Flats;
