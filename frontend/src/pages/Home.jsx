import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  return (
    <div className="home-container">
      <header className="hero glass-panel">
        <h1>Next-Gen Device Repair</h1>
        <p>Premium service, transparent pricing, and top-tier spare parts inventory.</p>
        <div className="hero-actions">
          <Link to="/repair" className="btn">Book a Repair</Link>
          <Link to="/stock" className="btn btn-outline">View Shop Stock</Link>
        </div>
      </header>
      
      <section className="features">
        <div className="feature-card glass-panel">
          <div className="icon-wrapper">📱</div>
          <h3>Phone Repair</h3>
          <p>Flawless screen replacements, battery swaps, and micro-soldering.</p>
        </div>
        <div className="feature-card glass-panel">
          <div className="icon-wrapper">💻</div>
          <h3>PC & Laptop</h3>
          <p>Hardware upgrades, virus removal, and custom PC builds.</p>
        </div>
        <div className="feature-card glass-panel">
          <div className="icon-wrapper">⚙️</div>
          <h3>OEM Parts</h3>
          <p>Access our live inventory of high-quality replacement components.</p>
        </div>
      </section>
    </div>
  );
};

export default Home;