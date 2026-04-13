import { useState } from 'react';
import axios from 'axios';
import './Repair.css';

const Repair = ({ user }) => {
  const [formData, setFormData] = useState({
    deviceType: 'Phone',
    brand: '',
    issue: '',
    customerName: '',
    phone: ''
  });
  const [statusMessage, setStatusMessage] = useState(''); // To show success/error to the user

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatusMessage('Submitting...');

    // Double check that we have a logged-in user
    if (!user || !user.token) {
      setStatusMessage('❌ You must be logged in to book a repair.');
      return;
    }

    try {
      // Attach the user's token to the request headers
      const config = {
        headers: { Authorization: `Bearer ${user.token}` }
      };

      // Send the data securely to the backend
      const response = await axios.post('http://localhost:5000/api/repairs', formData, config);
      console.log("Server responded with:", response.data);
      
      setStatusMessage('✅ Repair request submitted successfully!');
      
      // Clear the form after successful submission
      setFormData({ deviceType: 'Phone', brand: '', issue: '', customerName: '', phone: '' });
      
    } catch (error) {
      console.error("Error submitting repair:", error);
      setStatusMessage('❌ Failed to submit request. Please try again.');
    }
  };

return (
    // Added glass-panel class here
    <div className="repair-container glass-panel">
      <h2>Book a Repair</h2>
      {statusMessage && <p style={{ textAlign: 'center', fontWeight: 'bold', color: 'var(--primary-glow)' }}>{statusMessage}</p>}
      
      <form onSubmit={handleSubmit} className="repair-form">
      {/* ... the rest of your form stays exactly the same ... */}
        <div className="form-group">
          <label>Device Type</label>
          <select name="deviceType" value={formData.deviceType} onChange={handleChange}>
            <option value="Phone">Smartphone</option>
            <option value="PC">PC / Desktop</option>
            <option value="Laptop">Laptop</option>
          </select>
        </div>
        
        <div className="form-group">
          <label>Device Brand/Model</label>
          <input type="text" name="brand" value={formData.brand} required onChange={handleChange} placeholder="e.g., iPhone 13, Dell XPS 15" />
        </div>

        <div className="form-group">
          <label>Describe the Issue</label>
          <textarea name="issue" value={formData.issue} rows="4" required onChange={handleChange} placeholder="Screen cracked, won't turn on..."></textarea>
        </div>

        <div className="form-group">
          <label>Your Name</label>
          <input type="text" name="customerName" value={formData.customerName} required onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Contact Number</label>
          <input type="tel" name="phone" value={formData.phone} required onChange={handleChange} />
        </div>

        <button type="submit" className="btn submit-btn">Submit Request</button>
      </form>
    </div>
  );
};

export default Repair;