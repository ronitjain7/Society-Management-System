import React, { useEffect, useState } from 'react';
import client from '../api/client';
import { useAuth } from '../context/AuthContext';
import { CreditCard, CheckCircle, AlertTriangle, Clock } from 'lucide-react';
import './Maintenance.css';

const Maintenance = () => {
  const { user } = useAuth();
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchBills();
  }, []);

  const fetchBills = async () => {
    try {
      const { data } = await client.get('/maintenance');
      setBills(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handlePay = async (id) => {
    setLoading(true);
    try {
      // Mock payment delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      await client.patch(`/maintenance/${id}/pay`);
      fetchBills();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const notifyOverdue = async () => {
    try {
      const { data } = await client.post('/maintenance/check-overdue');
      alert(data.message);
      fetchBills();
    } catch (err) {
      console.error(err);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Paid': return <CheckCircle size={20} color="#10b981" />;
      case 'Overdue': return <AlertTriangle size={20} color="#ef4444" />;
      default: return <Clock size={20} color="#f59e0b" />;
    }
  };

  return (
    <div className="maintenance-page">
      <div className="page-header">
        <div className="header-text">
          <h1>Maintenance & Payments</h1>
          <p>Track monthly dues and payment history.</p>
        </div>
        {user.resident_type === 'Admin' && (
          <button className="action-btn" onClick={notifyOverdue}>
            Trigger Overdue Check
          </button>
        )}
      </div>

      <div className="bills-grid">
        {bills.map(bill => (
          <div key={bill.maintenance_id} className={`bill-card ${bill.status.toLowerCase()}`}>
            <div className="bill-header">
              <span className="bill-amount">${bill.amount}</span>
              <div className="bill-status">
                {getStatusIcon(bill.status)}
                <span>{bill.status}</span>
              </div>
            </div>
            
            <div className="bill-body">
              <div className="bill-detail">
                <label>Due Date</label>
                <span>{new Date(bill.due_date).toLocaleDateString()}</span>
              </div>
              {bill.payment_date && (
                <div className="bill-detail">
                  <label>Paid On</label>
                  <span>{new Date(bill.payment_date).toLocaleDateString()}</span>
                </div>
              )}
              {bill.Flat && (
                <div className="bill-detail">
                  <label>Flat</label>
                  <span>{bill.Flat.flat_number}</span>
                </div>
              )}
            </div>

            <div className="bill-footer">
              {bill.status !== 'Paid' && (
                <button 
                  className="pay-btn" 
                  disabled={loading}
                  onClick={() => handlePay(bill.maintenance_id)}
                >
                  <CreditCard size={18} />
                  {loading ? 'Processing...' : 'Pay Now'}
                </button>
              )}
              {bill.status === 'Paid' && <span className="receipt-link">View Receipt</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Maintenance;
