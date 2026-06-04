import React, { useState } from 'react';
import { 
  LuTrendingUp as TrendingUp, 
  LuPackage as Package, 
  LuTriangleAlert as AlertTriangle, 
  LuDollarSign as DollarSign, 
  LuCirclePlus as PlusCircle, 
  LuTrash2 as Trash2, 
  LuSquarePen as Edit, 
  LuSearch as Search, 
  LuChevronRight as ChevronRight, 
  LuX as X,
  LuRefreshCw as RefreshCw,
  LuEye as Eye,
  LuSlidersHorizontal as Sliders,
  LuSettings as Settings
} from 'react-icons/lu';
import { CATEGORIES } from '../data/initialProducts';

export default function AdminDashboard({
  products,
  setProducts,
  orders,
  setOrders,
  addToast
}) {
  const [activeTab, setActiveTab] = useState('analytics'); // 'analytics', 'inventory', 'orders'
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  
  // Modals
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null); // null means adding a new product

  // Product Form State
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    category: 'Electronics',
    price: '',
    offer: '0',
    stock: '',
    image: '',
    specs: ''
  });

  // Calculate Metrics
  const totalSales = orders.reduce((sum, order) => sum + order.total, 0);
  const totalOrdersCount = orders.length;
  const avgOrderValue = totalOrdersCount > 0 ? (totalSales / totalOrdersCount) : 0;
  
  const lowStockProducts = products.filter(p => p.stock <= 5);
  const totalStockItems = products.reduce((sum, p) => sum + p.stock, 0);

  // Category Sales Simulation for Graph
  const categorySales = {
    'Electronics': 0,
    'Security Devices': 0,
    'Smart home devices': 0,
    'Toys': 0,
    'Computer Gadgets': 0
  };

  // Populate actual sales data from completed orders
  orders.forEach(order => {
    order.items.forEach(item => {
      const category = item.category;
      const discountedPrice = item.price * (1 - (item.offer || 0) / 100);
      if (categorySales[category] !== undefined) {
        categorySales[category] += discountedPrice * item.quantity;
      }
    });
  });

  // Find max category sales to scale graph bars
  const salesValues = Object.values(categorySales);
  const maxSales = Math.max(...salesValues, 100); // minimum 100 to scale empty stats beautifully

  // Inventory filtering
  const filteredProducts = products.filter(product => {
    const matchesCategory = categoryFilter === 'All' || product.category === categoryFilter;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Live fast controls
  const handleQuickStock = (productId, amount) => {
    setProducts(products.map(p => {
      if (p.id === productId) {
        const newStock = Math.max(0, p.stock + amount);
        addToast(`Stock for ${p.name} updated to ${newStock}!`, 'success');
        return { ...p, stock: newStock };
      }
      return p;
    }));
  };

  const handleToggleStock = (productId) => {
    setProducts(products.map(p => {
      if (p.id === productId) {
        const outOfStock = p.stock === 0;
        const newStock = outOfStock ? 15 : 0; // Restore to 15 or mark as 0
        addToast(
          outOfStock 
            ? `Restored stock for ${p.name} (+15 units)` 
            : `${p.name} is now marked as Out of Stock!`,
          outOfStock ? 'success' : 'warning'
        );
        return { ...p, stock: newStock };
      }
      return p;
    }));
  };

  const handleLiveOfferChange = (productId, offerPct) => {
    setProducts(products.map(p => {
      if (p.id === productId) {
        return { ...p, offer: parseInt(offerPct) || 0 };
      }
      return p;
    }));
  };

  // Delete product
  const handleDeleteProduct = (productId) => {
    if (window.confirm("Are you sure you want to delete this product? This action cannot be undone.")) {
      const prodToDelete = products.find(p => p.id === productId);
      setProducts(products.filter(p => p.id !== productId));
      addToast(`${prodToDelete?.name || 'Product'} has been deleted.`, 'danger');
    }
  };

  // Update order status
  const handleOrderStatusUpdate = (orderId, newStatus) => {
    setOrders(orders.map(order => 
      order.id === orderId 
        ? { ...order, status: newStatus }
        : order
    ));
    addToast(`Order #${orderId} marked as ${newStatus}!`, 'info');
  };

  // Open Form for Adding
  const openAddForm = () => {
    setEditingProduct(null);
    setProductForm({
      name: '',
      description: '',
      category: 'Electronics',
      price: '',
      offer: '0',
      stock: '',
      image: '',
      specs: ''
    });
    setIsFormOpen(true);
  };

  // Open Form for Editing
  const openEditForm = (product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      description: product.description,
      category: product.category,
      price: product.price.toString(),
      offer: product.offer.toString(),
      stock: product.stock.toString(),
      image: product.image,
      specs: product.specs ? product.specs.join(', ') : ''
    });
    setIsFormOpen(true);
  };

  // Handle Form Submit
  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!productForm.name || !productForm.price || productForm.stock === '') {
      addToast('Please fill in Name, Price, and Stock!', 'error');
      return;
    }

    const priceNum = parseFloat(productForm.price);
    const offerNum = parseInt(productForm.offer) || 0;
    const stockNum = parseInt(productForm.stock) || 0;
    const specsArray = productForm.specs 
      ? productForm.specs.split(',').map(s => s.trim()).filter(Boolean)
      : ['Premium Quality Product', 'Certified Hardware'];

    const fallbackImages = {
      'Electronics': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
      'Security Devices': 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=600&q=80',
      'Smart home devices': 'https://images.unsplash.com/photo-1565814636199-ae8133055c1c?auto=format&fit=crop&w=600&q=80',
      'Toys': 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=600&q=80',
      'Computer Gadgets': 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=600&q=80'
    };

    const imageUrl = productForm.image || fallbackImages[productForm.category] || fallbackImages['Electronics'];

    if (editingProduct) {
      // Edit mode
      setProducts(products.map(p => 
        p.id === editingProduct.id
          ? {
              ...p,
              name: productForm.name,
              description: productForm.description,
              category: productForm.category,
              price: priceNum,
              offer: offerNum,
              stock: stockNum,
              image: imageUrl,
              specs: specsArray
            }
          : p
      ));
      addToast(`Successfully updated product: ${productForm.name}`, 'success');
    } else {
      // Create mode
      const newId = `prod-${productForm.category.substring(0, 3).toLowerCase()}-${Date.now()}`;
      const newProduct = {
        id: newId,
        name: productForm.name,
        description: productForm.description,
        category: productForm.category,
        price: priceNum,
        offer: offerNum,
        stock: stockNum,
        image: imageUrl,
        rating: 5.0, // default new rating
        reviewsCount: 0,
        specs: specsArray
      };
      setProducts([newProduct, ...products]);
      addToast(`Successfully added product: ${productForm.name}`, 'success');
    }

    setIsFormOpen(false);
  };

  return (
    <div className="admin-layout">
      {/* Admin Sidebar Navigation */}
      <aside className="admin-sidebar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0 12px 16px', borderBottom: '1px solid var(--border-color)', marginBottom: '16px' }}>
          <Settings className="text-gradient" size={20} />
          <h3 style={{ fontSize: '1rem', fontWeight: 800 }}>Store Manager</h3>
        </div>
        <button
          className={`admin-sidebar-btn ${activeTab === 'analytics' ? 'active' : ''}`}
          onClick={() => setActiveTab('analytics')}
        >
          <TrendingUp size={16} /> Analytics & Graphs
        </button>
        <button
          className={`admin-sidebar-btn ${activeTab === 'inventory' ? 'active' : ''}`}
          onClick={() => setActiveTab('inventory')}
        >
          <Package size={16} /> Live Inventory ({products.length})
        </button>
        <button
          className={`admin-sidebar-btn ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          <Sliders size={16} /> Customer Orders ({orders.length})
        </button>
      </aside>

      {/* Main Admin Working Panel */}
      <section style={{ minWidth: 0 }}>
        {/* TAB 1: ANALYTICS */}
        {activeTab === 'analytics' && (
          <div>
            <h2 style={{ fontSize: '1.6rem', marginBottom: '24px', fontWeight: 800 }}>Merchant Control Center</h2>
            
            {/* Live Metrics Grid */}
            <div className="admin-stats-grid">
              <div className="stat-card">
                <div className="stat-info">
                  <span className="stat-label">Total Simulated Sales</span>
                  <span className="stat-value text-gradient">${totalSales.toFixed(2)}</span>
                </div>
                <div className="stat-icon-wrapper" style={{ backgroundColor: 'var(--success-bg)', color: 'var(--success)' }}>
                  <DollarSign size={24} />
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-info">
                  <span className="stat-label">Orders Received</span>
                  <span className="stat-value">{totalOrdersCount} orders</span>
                </div>
                <div className="stat-icon-wrapper" style={{ backgroundColor: 'var(--info-bg)', color: 'var(--info)' }}>
                  <Sliders size={24} />
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-info">
                  <span className="stat-label">Low Stock Warnings</span>
                  <span className="stat-value" style={{ color: lowStockProducts.length > 0 ? 'var(--danger)' : 'var(--text-primary)' }}>
                    {lowStockProducts.length} items
                  </span>
                </div>
                <div className="stat-icon-wrapper" style={{ backgroundColor: lowStockProducts.length > 0 ? 'var(--danger-bg)' : 'var(--bg-tertiary)', color: lowStockProducts.length > 0 ? 'var(--danger)' : 'var(--text-muted)' }}>
                  <AlertTriangle size={24} />
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-info">
                  <span className="stat-label">Total Stock Items</span>
                  <span className="stat-value">{totalStockItems} units</span>
                </div>
                <div className="stat-icon-wrapper" style={{ backgroundColor: 'var(--accent-glow)', color: 'var(--primary)' }}>
                  <Package size={24} />
                </div>
              </div>
            </div>

            {/* Sales Chart Visualization */}
            <div className="dashboard-graph-card">
              <div className="graph-header">
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Simulated Revenue by Category</h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Live values recalculated from completed customer transactions</p>
                </div>
                <button className="btn btn-secondary btn-sm" onClick={() => addToast('Simulated reports synchronized!', 'success')}>
                  <RefreshCw size={14} /> Synchronize
                </button>
              </div>

              <div className="graph-visual-container">
                {Object.entries(categorySales).map(([category, value]) => {
                  const percentageHeight = (value / maxSales) * 100;
                  return (
                    <div key={category} className="graph-bar-wrapper">
                      <div 
                        className="graph-bar" 
                        style={{ height: `${Math.max(percentageHeight, 5)}%` }}
                      >
                        <div className="graph-bar-tooltip">${value.toFixed(2)}</div>
                      </div>
                      <span className="graph-bar-label" title={category}>{category.substring(0, 10)}...</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Low Stock Watch Grid */}
            <div className="inventory-section">
              <h3 style={{ fontSize: '1.1rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertTriangle size={18} style={{ color: 'var(--warning)' }} /> Low Stock & Target Refills
              </h3>
              {lowStockProducts.length === 0 ? (
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Fantastic! All systems operational, no inventory shortages detected.</p>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
                  {lowStockProducts.map(p => (
                    <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', backgroundColor: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{p.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Stock Left: <span style={{ color: 'var(--danger)', fontWeight: 800 }}>{p.stock}</span></div>
                      </div>
                      <button className="btn btn-success btn-sm" onClick={() => handleQuickStock(p.id, 10)}>
                        Refill +10
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: LIVE INVENTORY */}
        {activeTab === 'inventory' && (
          <div className="inventory-section">
            <div className="inventory-header">
              <div>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Inventory Directory</h2>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Add new products, adjust discounts, or manipulate live stock levels.</p>
              </div>
              <button className="btn btn-primary" onClick={openAddForm}>
                <PlusCircle size={16} /> Add Product
              </button>
            </div>

            {/* Filtering Options */}
            <div className="inventory-actions-row">
              <div className="inventory-search">
                <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  placeholder="Search item or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Category:</span>
                <select
                  style={{ padding: '6px 12px', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-primary)' }}
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                >
                  {CATEGORIES.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Directory Table */}
            <div className="inventory-table-container">
              <table className="inventory-table">
                <thead>
                  <tr>
                    <th>Product Details</th>
                    <th>Price & Offer</th>
                    <th>Live Offer Adjustment</th>
                    <th>Live Stock Controls</th>
                    <th>Quick Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.length === 0 ? (
                    <tr>
                      <td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                        No matching products found in database.
                      </td>
                    </tr>
                  ) : (
                    filteredProducts.map(p => {
                      const discountPrice = p.price * (1 - p.offer / 100);
                      const isOut = p.stock === 0;

                      return (
                        <tr key={p.id}>
                          {/* Title & Image */}
                          <td>
                            <div className="inventory-product-cell">
                              <img src={p.image} alt="" className="inventory-product-img" />
                              <div>
                                <span className="inventory-product-title">{p.name}</span>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ID: {p.id} | {p.category}</div>
                              </div>
                            </div>
                          </td>

                          {/* Prices */}
                          <td>
                            <div>
                              <div style={{ fontWeight: 700 }}>${discountPrice.toFixed(2)}</div>
                              {p.offer > 0 && (
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                                  Base: ${p.price.toFixed(2)}
                                </div>
                              )}
                            </div>
                          </td>

                          {/* Offer Slider Adjuster */}
                          <td>
                            <div className="offer-adjuster">
                              <input 
                                type="range" 
                                min="0" 
                                max="90" 
                                step="5"
                                value={p.offer}
                                onChange={(e) => handleLiveOfferChange(p.id, e.target.value)}
                                title="Adjust product promotional discount percentage"
                              />
                              <span style={{ color: p.offer > 0 ? 'var(--danger)' : 'var(--text-muted)' }}>
                                {p.offer}%
                              </span>
                            </div>
                          </td>

                          {/* Stock Manipulator */}
                          <td>
                            <div className="stock-control-panel">
                              <button 
                                className="btn btn-secondary btn-sm" 
                                style={{ padding: '4px 8px' }}
                                onClick={() => handleQuickStock(p.id, -1)}
                              >
                                -1
                              </button>
                              <input
                                type="text"
                                className="stock-control-input"
                                value={p.stock}
                                onChange={(e) => {
                                  const parsedVal = parseInt(e.target.value) || 0;
                                  setProducts(products.map(prod => prod.id === p.id ? { ...prod, stock: parsedVal } : prod));
                                }}
                              />
                              <button 
                                className="btn btn-secondary btn-sm" 
                                style={{ padding: '4px 8px' }}
                                onClick={() => handleQuickStock(p.id, 5)}
                              >
                                +5
                              </button>
                            </div>
                          </td>

                          {/* Quick Toggle Status */}
                          <td>
                            <button
                              className={`btn ${isOut ? 'btn-danger' : 'btn-success'} btn-sm`}
                              style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                              onClick={() => handleToggleStock(p.id)}
                              title={isOut ? 'Restore Stock' : 'Mark Out of Stock'}
                            >
                              {isOut ? 'Out of Stock' : 'Active Stock'}
                            </button>
                          </td>

                          {/* Standard Edit/Delete */}
                          <td>
                            <div className="admin-action-btns">
                              <button 
                                className="btn btn-outline btn-sm btn-icon-only" 
                                style={{ width: '32px', height: '32px' }}
                                onClick={() => openEditForm(p)}
                                title="Edit Product details"
                              >
                                <Edit size={14} />
                              </button>
                              <button 
                                className="btn btn-danger btn-sm btn-icon-only" 
                                style={{ width: '32px', height: '32px', backgroundColor: 'var(--danger-bg)' }}
                                onClick={() => handleDeleteProduct(p.id)}
                                title="Delete Product"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: CUSTOMER ORDERS */}
        {activeTab === 'orders' && (
          <div className="inventory-section">
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '8px' }}>Customer Transactions Manager</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '24px' }}>View checkout statements and update carrier fulfillment status.</p>

            {orders.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
                <Sliders size={48} style={{ opacity: 0.5, marginBottom: '16px' }} />
                <h3>No simulated orders received yet.</h3>
                <p style={{ marginTop: '8px' }}>Switch back to storefront mode, add products to the cart, and complete checkouts to simulate orders.</p>
              </div>
            ) : (
              <div className="order-list">
                {orders.map(order => (
                  <div key={order.id} className="order-card">
                    {/* Header: ID, Date, Status Select */}
                    <div className="order-card-header">
                      <div>
                        <span style={{ fontWeight: 800, fontSize: '1.05rem' }}>Order #{order.id}</span>
                        <span style={{ marginLeft: '12px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>{order.timestamp}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Fulfillment:</span>
                        <select
                          value={order.status}
                          onChange={(e) => handleOrderStatusUpdate(order.id, e.target.value)}
                          style={{ padding: '4px 8px', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-primary)', fontSize: '0.85rem' }}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                        </select>
                      </div>
                    </div>

                    {/* Details: Items vs Customer details */}
                    <div className="order-card-body">
                      {/* Items */}
                      <div className="order-items-detail">
                        <h4 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>Ordered Items</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          {order.items.map(item => {
                            const pPrice = item.price * (1 - (item.offer || 0) / 100);
                            return (
                              <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                                <span>{item.quantity}x {item.name} <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>({item.category})</span></span>
                                <span style={{ fontWeight: 600 }}>${(pPrice * item.quantity).toFixed(2)}</span>
                              </div>
                            );
                          })}
                        </div>
                        <div style={{ borderTop: '1px solid var(--border-color)', marginTop: '12px', paddingTop: '8px', display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.85rem', textAlign: 'right', alignItems: 'flex-end' }}>
                          <div>Subtotal: ${order.subtotal.toFixed(2)}</div>
                          {order.promoDiscount > 0 && (
                            <div style={{ color: 'var(--success)' }}>Coupon {order.promoApplied} discount: -${order.promoDiscount.toFixed(2)}</div>
                          )}
                          <div style={{ fontWeight: 800, fontSize: '1rem', marginTop: '4px' }}>Total Paid: ${order.total.toFixed(2)}</div>
                        </div>
                      </div>

                      {/* Customer Info */}
                      <div className="order-customer-info">
                        <h4 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>Customer Info</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.85rem' }}>
                          <div style={{ fontWeight: 700 }}>{order.customer.name}</div>
                          <div>Email: {order.customer.email}</div>
                          <div>Phone: {order.customer.phone}</div>
                          <div style={{ marginTop: '8px', color: 'var(--text-secondary)' }}>
                            {order.customer.address}, {order.customer.city}, {order.customer.zip}
                          </div>
                          <div style={{ marginTop: '8px', fontStyle: 'italic', color: 'var(--text-muted)' }}>
                            Payment Method: {order.customer.paymentMethod.toUpperCase()}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </section>

      {/* Add / Edit Product Modal */}
      {isFormOpen && (
        <div className="modal-overlay" onClick={() => setIsFormOpen(false)}>
          <div className="modal-content" style={{ maxWidth: '600px' }} onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setIsFormOpen(false)}>
              <X size={18} />
            </button>
            
            <h2 style={{ padding: '24px 24px 0', fontSize: '1.4rem' }} className="text-gradient">
              {editingProduct ? 'Edit Existing Inventory Product' : 'Add New Inventory Product'}
            </h2>

            <form onSubmit={handleFormSubmit} className="admin-form">
              <div className="form-group" style={{ marginBottom: '16px' }}>
                <label>Product Title / Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AuraSync LED Light Strip"
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                />
              </div>

              <div className="form-group" style={{ marginBottom: '16px' }}>
                <label>Product Description</label>
                <textarea
                  rows="3"
                  style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-primary)', outline: 'none', fontFamily: 'var(--font-sans)', resize: 'vertical' }}
                  placeholder="Add detailed specifications or promotional overview..."
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                />
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label>Category *</label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                  >
                    {CATEGORIES.filter(c => c !== 'All').map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                
                <div className="form-group">
                  <label>Image URL (Optional)</label>
                  <input
                    type="url"
                    placeholder="https://unsplash.com/..."
                    value={productForm.image}
                    onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label>Base Price ($ USD) *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="1"
                    required
                    placeholder="29.99"
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Initial Offer / Discount (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="90"
                    placeholder="e.g. 10"
                    value={productForm.offer}
                    onChange={(e) => setProductForm({ ...productForm, offer: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label>Starting Stock Count *</label>
                  <input
                    type="number"
                    min="0"
                    required
                    placeholder="e.g. 25"
                    value={productForm.stock}
                    onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Key Features / Bullet Specs (Comma-separated)</label>
                  <input
                    type="text"
                    placeholder="Feature 1, Feature 2, Feature 3"
                    value={productForm.specs}
                    onChange={(e) => setProductForm({ ...productForm, specs: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setIsFormOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingProduct ? 'Save Product Changes' : 'Create Product Listing'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
