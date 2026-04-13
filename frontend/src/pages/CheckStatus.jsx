import { useState, useEffect } from 'react';
import axios from 'axios';
import './CheckStatus.css'; // You can keep your previous CSS!

const CheckStatus = ({ user }) => {
  const [myRepairs, setMyRepairs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyRepairs = async () => {
      try {
        const config = {
          headers: { Authorization: `Bearer ${user.token}` }
        };
        const response = await axios.get('http://localhost:5000/api/repairs/my-repairs', config);
        setMyRepairs(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching status:", error);
        setLoading(false);
      }
    };

    fetchMyRepairs();
  }, [user.token]);

  if (loading) return <div style={{ textAlign: 'center', marginTop: '3rem' }}>Loading your repairs...</div>;

return (
    // Add glass-panel here
    <div className="status-container glass-panel">
      <div className="status-header">
      {/* Rest remains exactly the same! */}
        <h2>My Repairs</h2>
        <p>Welcome back, {user.user.name}. Here is the status of your devices.</p>
      </div>

      <div className="results-section">
        {myRepairs.length === 0 ? (
          <div className="no-results">
            <p>You haven't submitted any repair requests yet.</p>
          </div>
        ) : (
          <div className="tickets-grid">
            {myRepairs.map((repair) => (
              <div key={repair._id} className="ticket-card">
                <div className="ticket-header">
                  <h4>{repair.brand} ({repair.deviceType})</h4>
                  <span className={`status-badge status-${repair.status.toLowerCase().replace(' ', '-')}`}>
                    {repair.status}
                  </span>
                </div>
                
                <div className="ticket-body">
                  <p><strong>Date Submitted:</strong> {new Date(repair.createdAt).toLocaleDateString()}</p>
                  
                  <div className="issue-box">
                    <strong>Issue Reported:</strong>
                    <p>{repair.issue}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckStatus;