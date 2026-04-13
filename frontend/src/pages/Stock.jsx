import { useState, useEffect } from 'react';
import axios from 'axios';
import './Stock.css';

const Stock = ({ user }) => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [newItem, setNewItem] = useState({
    name: '',
    category: 'Phone Parts',
    price: '',
    qty: ''
  });

  const isAdmin = user?.user?.role === 'admin';

  useEffect(() => {
    const fetchStock = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/stock');
        setInventory(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching stock:", error);
        setLoading(false);
      }
    };

    fetchStock();
  }, []);

  const handleInputChange = (e) => {
    setNewItem({ ...newItem, [e.target.name]: e.target.value });
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    if (!user || !user.token) return alert("Admin login required.");

    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const response = await axios.post('http://localhost:5000/api/stock', {
        ...newItem,
        price: Number(newItem.price),
        qty: Number(newItem.qty)
      }, config);
      
      setInventory([...inventory, response.data]);
      setNewItem({ name: '', category: 'Phone Parts', price: '', qty: '' });
    } catch (error) {
      alert(error.response?.data?.message || "Failed to add item.");
    }
  };

  // NEW: Function to handle + and - buttons
  const handleUpdateQuantity = async (id, currentQty, change) => {
    const newQty = currentQty + change;
    if (newQty < 0) return; // Prevent negative stock

    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const response = await axios.patch(
        `http://localhost:5000/api/stock/${id}/qty`, 
        { qty: newQty }, 
        config
      );

      // Instantly update the table without refreshing the page
      setInventory(inventory.map((item) => item._id === id ? response.data : item));
    } catch (error) {
      console.error("Error updating quantity:", error);
      alert(error.response?.data?.message || "Failed to update quantity.");
    }
  };

  const handleDelete = async (id) => {
    if (!user || !user.token) return alert("Admin login required.");
    if (!window.confirm("Are you sure you want to delete this item?")) return;

    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.delete(`http://localhost:5000/api/stock/${id}`, config);
      setInventory(inventory.filter((item) => item._id !== id));
    } catch (error) {
      alert(error.response?.data?.message || "Failed to delete item.");
    }
  };

  if (loading) return <div style={{ textAlign: 'center', marginTop: '2rem' }}>Loading inventory...</div>;

return (
    // Add glass-panel here
    <div className="stock-container glass-panel">
      <h2>Inventory Management</h2>
      {/* Rest remains exactly the same! */}
      
      {isAdmin && (
        <div className="add-item-card">
          <h3>Add New Product</h3>
          <form onSubmit={handleAddItem} className="add-item-form">
            <input type="text" name="name" placeholder="Item Name (e.g., iPhone Screen)" value={newItem.name} onChange={handleInputChange} required />
            <select name="category" value={newItem.category} onChange={handleInputChange}>
              <option value="Phone Parts">Phone Parts</option>
              <option value="PC Components">PC Components</option>
              <option value="Laptops">Laptops</option>
              <option value="Accessories">Accessories</option>
              <option value="Tablet Parts">Tablet Parts</option>
            </select>
            <input type="number" name="price" placeholder="Price (₹)" step="0.01" value={newItem.price} onChange={handleInputChange} required />
            <input type="number" name="qty" placeholder="Quantity" value={newItem.qty} onChange={handleInputChange} required />
            <button type="submit" className="btn add-btn">Add to Stock</button>
          </form>
        </div>
      )}

      <div className="table-responsive">
        <table className="stock-table">
          <thead>
            <tr>
              <th>Item Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Status</th>
              {isAdmin && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {inventory.length === 0 ? (
              <tr><td colSpan={isAdmin ? "6" : "5"} style={{textAlign: 'center'}}>No items in stock.</td></tr>
            ) : (
              inventory.map((item) => (
                <tr key={item._id}>
                  <td>{item.name}</td>
                  <td>{item.category}</td>
                  <td>₹ {item.price.toFixed(2)}</td>
                  
                  {/* NEW: The Quantity Cell */}
                  <td>
                    {isAdmin ? (
                      <div className="qty-controls">
                        <button 
                          onClick={() => handleUpdateQuantity(item._id, item.qty, -1)} 
                          className="qty-btn"
                          disabled={item.qty <= 0} // Disable minus button if qty is 0
                        >
                          -
                        </button>
                        <span className="qty-value">{item.qty}</span>
                        <button 
                          onClick={() => handleUpdateQuantity(item._id, item.qty, 1)} 
                          className="qty-btn"
                        >
                          +
                        </button>
                      </div>
                    ) : (
                      <span className="qty-value">{item.qty}</span>
                    )}
                  </td>

                  <td>
                    <span className={`status-badge ${item.qty > 5 ? 'in-stock' : item.qty > 0 ? 'low-stock' : 'out-of-stock'}`}>
                      {item.qty > 5 ? 'In Stock' : item.qty > 0 ? 'Low Stock' : 'Out of Stock'}
                    </span>
                  </td>
                  {isAdmin && (
                    <td><button onClick={() => handleDelete(item._id)} className="btn delete-btn">Delete</button></td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Stock;