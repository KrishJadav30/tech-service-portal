import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Repair from './pages/Repair';
import Stock from './pages/Stock';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import CheckStatus from './pages/CheckStatus';
import './App.css';

function App() {
  // Check if a user is already saved in memory when the app loads
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);

  return (
    <Router>
      {/* Pass the user and setUser function to the Navbar */}
      <Navbar user={user} setUser={setUser} />
      
      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          
          {/* PROTECTED ROUTES: Only logged-in users can access these */}
          <Route 
            path="/repair" 
            element={user ? <Repair user={user} /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/status" 
            element={user ? <CheckStatus user={user} /> : <Navigate to="/login" />} 
          />
          
          {/* Pass the user to Stock so it knows if it should hide the Add/Delete buttons */}
          <Route path="/stock" element={<Stock user={user} />} />
          
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/register" element={<Register />} />
          
          {/* PROTECTED ROUTE: Only Admins can access the dashboard */}
          <Route 
            path="/admin" 
            element={user?.user?.role === 'admin' ? <AdminDashboard /> : <Navigate to="/login" />} 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;