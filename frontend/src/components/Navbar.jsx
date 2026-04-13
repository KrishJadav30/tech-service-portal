import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ user, setUser }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('user'); // Clear memory
    setUser(null); // Clear state
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">Restore-Tech</Link>
        <ul className="navbar-menu">
          <li><Link to="/">Home</Link></li>
          
          {/* ONLY show Book Repair & My Repairs if the user is LOGGED IN and NOT an admin */}
          {user && user?.user?.role !== 'admin' && (
            <>
              <li><Link to="/repair">Book Repair</Link></li>
              <li><Link to="/status">My Repairs</Link></li>
            </>
          )}
          
          <li><Link to="/stock">Inventory</Link></li>
          
          {/* ONLY show Dashboard if the logged-in user is an admin */}
          {user?.user?.role === 'admin' && (
            <li><Link to="/admin">Dashboard</Link></li>
          )}
        </ul>

        <div className="navbar-auth">
          {user ? (
            <button onClick={handleLogout} className="btn btn-outline" style={{padding: '5px 15px'}}>
              Logout ({user.user.name})
            </button>
          ) : (
            <Link to="/login" className="btn btn-outline" style={{padding: '5px 15px'}}>
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;