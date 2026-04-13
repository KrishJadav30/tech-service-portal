import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './Auth.css'; // We will create this CSS file next

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/users/register', formData);
      alert('Registration successful! Please log in.');
      navigate('/login');
    } catch (error) {
      alert(error.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="auth-container">
      {/* Added glass-panel class here */}
      <div className="auth-card glass-panel">
        <h2>Create an Account</h2>
        <form onSubmit={handleSubmit} className="auth-form">
          <input type="text" name="name" placeholder="Full Name" required onChange={handleChange} />
          <input type="email" name="email" placeholder="Email Address" required onChange={handleChange} />
          <input type="password" name="password" placeholder="Password" required onChange={handleChange} />
          <button type="submit" className="btn auth-btn">Register</button>
        </form>
        <p>Already have an account? <Link to="/login">Log in here</Link></p>
      </div>
    </div>
  );
};

export default Register;