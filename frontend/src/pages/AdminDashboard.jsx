import { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [repairs, setRepairs] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Track which repair request is clicked for the modal
  const [selectedRepair, setSelectedRepair] = useState(null);

  useEffect(() => {
    // 1. Define the fetch function INSIDE the useEffect
    const fetchRepairs = async () => {
      try {
        // Grab the user from local storage
        const storedUser = JSON.parse(localStorage.getItem('user'));
        
        // If there's no token, stop trying to fetch
        if (!storedUser || !storedUser.token) {
          setLoading(false);
          return;
        }

        // Attach the token to the request headers
        const config = {
          headers: { Authorization: `Bearer ${storedUser.token}` }
        };

        // Pass the config to the axios GET request!
        const response = await axios.get('http://localhost:5000/api/repairs', config);
        setRepairs(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching repair requests:", error);
        setLoading(false);
      }
    };

    // 2. Call it immediately
    fetchRepairs();
  }, []);

  // Function to handle updating the repair status
  const handleUpdateStatus = async (newStatus) => {
    try {
      // Get the admin token from local storage
      const storedUser = JSON.parse(localStorage.getItem('user'));
      if (!storedUser || !storedUser.token) {
        alert("You must be logged in as an admin to update status.");
        return;
      }

      const config = {
        headers: { Authorization: `Bearer ${storedUser.token}` }
      };

      // Send update to backend
      const response = await axios.patch(
        `http://localhost:5000/api/repairs/${selectedRepair._id}/status`, 
        { status: newStatus }, 
        config
      );

      // Update the local state so the UI changes instantly without refreshing
      setRepairs(repairs.map((r) => r._id === selectedRepair._id ? response.data : r));
      setSelectedRepair(response.data); // Update the modal's data too

    } catch (error) {
      console.error("Error updating status:", error);
      alert(error.response?.data?.message || "Failed to update status.");
    }
  };

  if (loading) return <div style={{ textAlign: 'center', marginTop: '2rem' }}>Loading repair requests...</div>;

return (
    <> {/* 1. ADD THIS INVISIBLE WRAPPER */}
      <div className="dashboard-container glass-panel">
        <h2>Repair Requests Dashboard</h2>
        
        <div className="table-responsive">
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Customer Name</th>
                <th>Device</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {repairs.length === 0 ? (
                <tr><td colSpan="4" style={{textAlign: 'center'}}>No repair requests found.</td></tr>
              ) : (
                repairs.map((repair) => (
                  <tr 
                    key={repair._id}
                    className="repair-row"
                    onClick={() => setSelectedRepair(repair)} // Open Modal on Click
                  >
                    <td>{new Date(repair.createdAt).toLocaleDateString()}</td>
                    <td className="fw-bold">{repair.customerName}</td>
                    <td>
                      <span className="device-type">{repair.deviceType}</span>
                      <br />
                      <small className="device-brand">{repair.brand}</small>
                    </td>
                    <td>
                      <span className={`status-badge status-${repair.status.toLowerCase().replace(' ', '-')}`}>
                        {repair.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div> {/* <-- 2. CLOSE THE DASHBOARD CONTAINER HERE */}

      {/* 3. THE MODAL IS NOW OUTSIDE THE GLASS PANEL */}
      {selectedRepair && (
        <div className="modal-overlay" onClick={() => setSelectedRepair(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Repair Details</h3>
              <button className="close-btn" onClick={() => setSelectedRepair(null)}>✖</button>
            </div>
            
            <div className="modal-body">
              <div className="detail-group"><strong>Customer:</strong> {selectedRepair.customerName}</div>
              <div className="detail-group"><strong>Contact:</strong> {selectedRepair.phone}</div>
              <div className="detail-group"><strong>Device:</strong> {selectedRepair.brand} ({selectedRepair.deviceType})</div>
              <div className="detail-group"><strong>Submitted:</strong> {new Date(selectedRepair.createdAt).toLocaleString()}</div>
              
              <div className="detail-group issue-box">
                <strong>Reported Issue:</strong>
                <p>{selectedRepair.issue}</p>
              </div>

              <div className="update-status-section">
                <strong>Update Status:</strong>
                <select 
                  value={selectedRepair.status} 
                  onChange={(e) => handleUpdateStatus(e.target.value)}
                  className="status-dropdown"
                >
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}
    </> /* 4. CLOSE THE INVISIBLE WRAPPER HERE */
  );
};

export default AdminDashboard;