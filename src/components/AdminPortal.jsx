import React, { useState, useEffect } from 'react';
import { 
  LuTrendingUp as TrendingUp, 
  LuPackage as Package, 
  LuTriangleAlert as AlertTriangle, 
  LuDollarSign as DollarSign, 
  LuCirclePlus as PlusCircle, 
  LuTrash2 as Trash2, 
  LuSquarePen as Edit, 
  LuSearch as Search, 
  LuX as X,
  LuRefreshCw as RefreshCw,
  LuSlidersHorizontal as Sliders,
  LuSettings as Settings,
  LuShieldCheck as ShieldCheck,
  LuTrendingDown as TrendingDown,
  LuShoppingBag as ShoppingBag,
  LuUpload as Upload,
  LuImage as ImageIcon,
  LuShieldAlert as ShieldAlert,
  LuUsers as Users,
  LuUserPlus as UserPlus
} from 'react-icons/lu';
import { CATEGORIES } from '../data/initialProducts';

import { db, firebaseConfig } from '../firebase';
import { collection, getDocs, doc, updateDoc, setDoc } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signOut } from 'firebase/auth';

const compressImage = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 500;
        const MAX_HEIGHT = 500;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        // Compress to JPEG with 0.8 quality
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        resolve(dataUrl);
      };
      img.onerror = (err) => reject(err);
      img.src = event.target.result;
    };
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
};

export default function AdminPortal({
  products,
  setProducts,
  orders,
  setOrders,
  addToast,
  banners = [],
  setBanners = () => {},
  coupons = [],
  setCoupons = () => {},
  brandingColors = {},
  setBrandingColors = () => {},
  flashTimer = { hours: 12, minutes: 42, seconds: 19 },
  setFlashTimer = () => {},
  seedDefaultCatalog = () => {}
}) {
  const [activeTab, setActiveTab] = useState('analytics'); // 'analytics', 'inventory', 'orders', 'customizer', 'rbac'
  
  // RBAC User Management States
  const [usersList, setUsersList] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [newUserForm, setNewUserForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user'
  });
  const [isCreatingUser, setIsCreatingUser] = useState(false);

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const querySnapshot = await getDocs(collection(db, 'users'));
      const list = [];
      querySnapshot.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() });
      });
      setUsersList(list);
    } catch (error) {
      console.error("Error fetching users list:", error);
      addToast("Failed to fetch users list.", "error");
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'rbac') {
      fetchUsers();
    }
  }, [activeTab]);

  const handleToggleUserRole = async (userId, currentRole) => {
    const nextRole = currentRole === 'admin' ? 'user' : 'admin';
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, { role: nextRole });
      addToast(`User role updated to ${nextRole.toUpperCase()}`, 'success');
      // Update local state
      setUsersList(prev => prev.map(u => u.id === userId ? { ...u, role: nextRole } : u));
    } catch (err) {
      console.error("Error updating user role:", err);
      addToast("Failed to update user role.", "error");
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    if (!newUserForm.name || !newUserForm.email || !newUserForm.password) {
      addToast("Please fill out all fields.", "warning");
      return;
    }

    setIsCreatingUser(true);
    try {
      // 1. Initialize a secondary firebase app to avoid signing out the current admin session!
      const secondaryAppName = `SecondaryApp_${Date.now()}`;
      const secondaryApp = initializeApp(firebaseConfig, secondaryAppName);
      const secondaryAuth = getAuth(secondaryApp);

      // 2. Create the user in Auth
      const userCredential = await createUserWithEmailAndPassword(
        secondaryAuth,
        newUserForm.email,
        newUserForm.password
      );
      const newUid = userCredential.user.uid;

      // 3. Write user profile to Firestore
      const userDocRef = doc(db, 'users', newUid);
      const profile = {
        uid: newUid,
        name: newUserForm.name,
        email: newUserForm.email.toLowerCase(),
        role: newUserForm.role,
        createdAt: new Date().toISOString()
      };
      await setDoc(userDocRef, profile);

      // 4. Sign out from secondary auth instance so it doesn't leak/conflict
      await signOut(secondaryAuth);

      addToast(`Successfully created ${newUserForm.role.toUpperCase()} account: ${newUserForm.name}`, 'success');
      
      // Reset form
      setNewUserForm({
        name: '',
        email: '',
        password: '',
        role: 'user'
      });

      // Refresh list
      fetchUsers();
    } catch (err) {
      console.error("Error creating user:", err);
      addToast(err.message || "Failed to create user.", "error");
    } finally {
      setIsCreatingUser(false);
    }
  };
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
  const outOfStockProducts = products.filter(p => p.stock === 0);
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

  // Open Form for Adding New Product
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
      images: [],
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
      images: Array.isArray(product.images) ? product.images.filter(img => img !== product.image) : [],
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
    const allImages = Array.from(new Set([imageUrl, ...(productForm.images || [])]));

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
              images: allImages,
              specs: specsArray
            }
          : p
      ));
      addToast(`Successfully updated product: ${productForm.name}`, 'success');
    } else {
      // Create mode
      const newId = `prod-${productForm.category.substring(0, 3).toLowerCase()}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      const newProduct = {
        id: newId,
        name: productForm.name,
        description: productForm.description,
        category: productForm.category,
        price: priceNum,
        offer: offerNum,
        stock: stockNum,
        image: imageUrl,
        images: allImages,
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
    <div className="main-content-layout" style={{ animation: 'fadeIn 0.5s ease-out', marginTop: '20px', paddingBottom: '60px' }}>
      <div className="admin-layout">
        
        {/* Admin Sidebar Navigation */}
        <aside className="admin-sidebar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0 16px 16px', borderBottom: '1px solid var(--border-muted)', marginBottom: '16px' }}>
            <Settings size={20} style={{ color: 'var(--accent-gold)' }} />
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800 }}>Merchant Executive</h3>
          </div>
          <button
            className={`admin-sidebar-btn ${activeTab === 'analytics' ? 'active' : ''}`}
            onClick={() => setActiveTab('analytics')}
          >
            <TrendingUp size={16} /> Sales Dashboard
          </button>
          <button
            className={`admin-sidebar-btn ${activeTab === 'inventory' ? 'active' : ''}`}
            onClick={() => setActiveTab('inventory')}
          >
            <Package size={16} /> Products Catalog ({products.length})
          </button>
          <button
            className={`admin-sidebar-btn ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            <Sliders size={16} /> Shipments & Orders ({orders.length})
          </button>
          <button
            className={`admin-sidebar-btn ${activeTab === 'customizer' ? 'active' : ''}`}
            onClick={() => setActiveTab('customizer')}
          >
            <Settings size={16} /> CMS Store Customizer
          </button>
          <button
            className={`admin-sidebar-btn ${activeTab === 'rbac' ? 'active' : ''}`}
            onClick={() => setActiveTab('rbac')}
          >
            <ShieldCheck size={16} /> RBAC User Manager
          </button>
        </aside>

        {/* Main Admin Working Panel */}
        <section style={{ minWidth: 0 }}>
          
          {/* TAB 1: ANALYTICS */}
          {activeTab === 'analytics' && (
            <div>
              <h2 style={{ fontSize: '1.6rem', marginBottom: '20px', fontWeight: 800 }}>Business Performance</h2>
              
              {/* Live Metrics Grid */}
              <div className="dashboard-metrics-grid">
                <div className="dashboard-metric-card">
                  <div className="metric-card-info">
                    <span className="metric-card-label">Total Revenue</span>
                    <h3 className="metric-card-value" style={{ color: 'var(--primary-navy)' }}>₹{Math.round(totalSales).toLocaleString('en-IN')}</h3>
                    <span className="metric-card-trend positive">Live Sync</span>
                  </div>
                  <div className="metric-card-icon-wrap" style={{ backgroundColor: 'var(--success-bg)', color: 'var(--success)' }}>
                    <DollarSign size={20} />
                  </div>
                </div>

                <div className="dashboard-metric-card">
                  <div className="metric-card-info">
                    <span className="metric-card-label">Orders Placed</span>
                    <h3 className="metric-card-value">{totalOrdersCount}</h3>
                    <span className="metric-card-trend info">+{(totalOrdersCount > 0 ? 100 : 0)}% conversion</span>
                  </div>
                  <div className="metric-card-icon-wrap" style={{ backgroundColor: 'var(--accent-gold-bg)', color: 'var(--accent-gold)' }}>
                    <Sliders size={20} />
                  </div>
                </div>

                <div className="dashboard-metric-card">
                  <div className="metric-card-info">
                    <span className="metric-card-label">Stock Shortages</span>
                    <h3 className="metric-card-value" style={{ color: outOfStockProducts.length > 0 ? 'var(--danger)' : 'inherit' }}>
                      {outOfStockProducts.length} items
                    </h3>
                    <span className={`metric-card-trend ${outOfStockProducts.length > 0 ? 'warning' : 'positive'}`}>
                      {outOfStockProducts.length > 0 ? 'Action Required' : 'Optimal'}
                    </span>
                  </div>
                  <div className="metric-card-icon-wrap" style={{ 
                    backgroundColor: outOfStockProducts.length > 0 ? 'var(--danger-bg)' : 'rgba(99,102,241,0.08)', 
                    color: outOfStockProducts.length > 0 ? 'var(--danger)' : 'var(--text-muted)' 
                  }}>
                    <AlertTriangle size={20} />
                  </div>
                </div>

                <div className="dashboard-metric-card">
                  <div className="metric-card-info">
                    <span className="metric-card-label">Total Inventory</span>
                    <h3 className="metric-card-value">{totalStockItems} units</h3>
                    <span className="metric-card-trend info">Across {products.length} SKUs</span>
                  </div>
                  <div className="metric-card-icon-wrap" style={{ backgroundColor: 'rgba(99,102,241,0.08)', color: 'var(--primary-navy)' }}>
                    <Package size={20} />
                  </div>
                </div>
              </div>

              {/* Sales Chart Visualization */}
              <div className="performance-chart-card">
                <div className="performance-chart-header">
                  <div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Category Performance Splits</h3>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Dynamically calculated from sandbox checkouts</p>
                  </div>
                  <button className="btn btn-secondary btn-sm" onClick={() => addToast('Simulated statistics synchronized!', 'success')}>
                    <RefreshCw size={14} /> Sync Metrics
                  </button>
                </div>

                {/* Pure CSS Bar Charts */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {Object.entries(categorySales).map(([category, value]) => {
                    const percentage = (value / maxSales) * 100;
                    return (
                      <div key={category} className="chart-bar-row">
                        <span className="chart-bar-label">{category}</span>
                        <div className="chart-bar-track">
                          <div className="chart-bar-fill" style={{ width: `${Math.max(percentage, 4)}%` }} />
                        </div>
                        <span className="chart-bar-value">₹{Math.round(value).toLocaleString('en-IN')}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Low Stock Watch Grid */}
              <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--border-muted)', borderRadius: 'var(--radius-sm)', padding: '24px', boxShadow: 'var(--shadow-sm)' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <AlertTriangle size={18} style={{ color: 'var(--accent-gold)' }} /> Low Stock Watchlist (5 units or less)
                </h3>
                {lowStockProducts.length === 0 ? (
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>Excellent. All catalog products are currently well-stocked.</p>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '12px' }}>
                    {lowStockProducts.map(p => (
                      <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px', backgroundColor: 'var(--bg-app)', borderRadius: 'var(--radius-xs)', border: '1px solid var(--border-muted)' }}>
                        <div>
                          <div style={{ fontWeight: 800, fontSize: '0.88rem' }}>{p.name}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>In Stock: <span style={{ color: 'var(--danger)', fontWeight: 800 }}>{p.stock} left</span></div>
                        </div>
                        <button className="btn btn-primary btn-sm" style={{ padding: '6px 12px', fontSize: '0.75rem' }} onClick={() => handleQuickStock(p.id, 10)}>
                          Refill +10
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: LIVE INVENTORY DIRECTORY */}
          {activeTab === 'inventory' && (
            <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--border-muted)', borderRadius: 'var(--radius-sm)', padding: '24px', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-muted)', paddingBottom: '16px', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <h2 style={{ fontSize: '1.3rem', fontWeight: 800 }}>Products Directory</h2>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Replenish stocks, delete listings, and configure promo campaigns.</p>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '6px' }} onClick={seedDefaultCatalog}>
                    <RefreshCw size={14} /> SEED DEFAULT CATALOG
                  </button>
                  <button className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }} onClick={openAddForm}>
                    <PlusCircle size={16} /> ADD NEW PRODUCT
                  </button>
                </div>
              </div>

              {/* Filtering Controls */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', marginBottom: '16px', flexWrap: 'wrap' }}>
                <div style={{ position: 'relative', width: '100%', maxWidth: '280px' }}>
                  <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    type="text"
                    placeholder="Search catalog products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ width: '100%', padding: '8px 12px 8px 36px', border: '1px solid var(--border-muted)', borderRadius: 'var(--radius-xs)', backgroundColor: 'var(--bg-app)', color: 'var(--text-main)', fontSize: '0.85rem', outline: 'none' }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', fontSize: '0.85rem' }}>
                  <span style={{ color: 'var(--text-sub)' }}>Category:</span>
                  <select
                    style={{ padding: '6px 12px', border: '1px solid var(--border-muted)', borderRadius: 'var(--radius-xs)', backgroundColor: '#ffffff', color: 'var(--text-main)', fontWeight: 600 }}
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                  >
                    {CATEGORIES.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Inventory Table Sheet */}
              <div className="inventory-table-container">
                <table className="inventory-table">
                  <thead>
                    <tr>
                      <th>Product Spec</th>
                      <th>Base Price</th>
                      <th>Offer Slider</th>
                      <th>Fulfillment Stock</th>
                      <th>Fulfillment Status</th>
                      <th>Fulfillment Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.length === 0 ? (
                      <tr>
                        <td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                          No catalog entries matching this filter selection.
                        </td>
                      </tr>
                    ) : (
                      filteredProducts.map(p => {
                        const discountPrice = p.price * (1 - p.offer / 100);
                        const isOut = p.stock === 0;

                        return (
                          <tr key={p.id}>
                            {/* Title & Image cell */}
                            <td>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <img src={p.image} alt="" style={{ width: '40px', height: '40px', objectFit: 'contain', border: '1px solid #e0e0e0', padding: '2px', backgroundColor: '#ffffff', borderRadius: '4px' }} />
                                <div>
                                  <div style={{ fontWeight: 800, fontSize: '0.85rem' }}>{p.name}</div>
                                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{p.category}</div>
                                </div>
                              </div>
                            </td>

                            {/* Base Price */}
                            <td>
                              <div>
                                <div style={{ fontWeight: 800 }}>₹{Math.round(discountPrice).toLocaleString('en-IN')}</div>
                                {p.offer > 0 && (
                                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                                    ₹{Math.round(p.price).toLocaleString('en-IN')}
                                  </div>
                                )}
                              </div>
                            </td>

                            {/* Offer slider */}
                            <td>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <input 
                                  type="range" 
                                  min="0" 
                                  max="90" 
                                  step="5"
                                  value={p.offer}
                                  onChange={(e) => handleLiveOfferChange(p.id, e.target.value)}
                                  style={{ width: '80px', accentColor: 'var(--primary-navy)' }}
                                />
                                <span style={{ color: p.offer > 0 ? 'var(--flipkart-green)' : 'var(--text-muted)', fontWeight: 800, fontSize: '0.78rem' }}>
                                  {p.offer}%
                                </span>
                              </div>
                            </td>

                            {/* Stock quantities */}
                            <td>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <button className="btn btn-secondary btn-sm" style={{ padding: '2px 6px' }} onClick={() => handleQuickStock(p.id, -1)}>-1</button>
                                <input
                                  type="text"
                                  value={p.stock}
                                  onChange={(e) => {
                                    const val = parseInt(e.target.value) || 0;
                                    setProducts(products.map(prod => prod.id === p.id ? { ...prod, stock: val } : prod));
                                  }}
                                  style={{ width: '40px', padding: '4px', textAlign: 'center', border: '1px solid var(--border-muted)', borderRadius: 'var(--radius-xs)', fontSize: '0.8rem', fontWeight: 700 }}
                                />
                                <button className="btn btn-secondary btn-sm" style={{ padding: '2px 6px' }} onClick={() => handleQuickStock(p.id, 5)}>+5</button>
                              </div>
                            </td>

                            {/* stock state button */}
                            <td>
                              <button
                                className={`btn ${isOut ? 'btn-danger' : 'btn-outline'} btn-sm`}
                                style={{ padding: '4px 8px', fontSize: '0.7rem', fontWeight: 800 }}
                                onClick={() => handleToggleStock(p.id)}
                              >
                                {isOut ? 'SOLD OUT' : 'IN STOCK'}
                              </button>
                            </td>

                            {/* edit/delete */}
                            <td>
                              <div style={{ display: 'flex', gap: '6px' }}>
                                <button className="btn btn-secondary btn-sm" style={{ padding: '6px' }} onClick={() => openEditForm(p)}>
                                  <Edit size={13} />
                                </button>
                                <button className="btn btn-danger btn-sm" style={{ padding: '6px', backgroundColor: 'var(--danger-bg)' }} onClick={() => handleDeleteProduct(p.id)}>
                                  <Trash2 size={13} />
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

          {/* TAB 3: ORDER LOGS */}
          {activeTab === 'orders' && (
            <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--border-muted)', borderRadius: 'var(--radius-sm)', padding: '24px', boxShadow: 'var(--shadow-sm)' }}>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '6px' }}>Fulfillment Shipment Console</h2>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '20px' }}>Simulate logistics dispatch processes, immediate sync with buyer tracking grids.</p>

              {orders.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
                  <Sliders size={40} style={{ opacity: 0.5, marginBottom: '12px' }} />
                  <h3>No transactions recorded yet</h3>
                  <p style={{ fontSize: '0.85rem' }}>Checkouts processed inside customer storefront funnels automatically show here.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {orders.map(order => (
                    <div key={order.id} className="order-ticket-card">
                      {/* header block */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-muted)', paddingBottom: '12px', marginBottom: '14px', flexWrap: 'wrap', gap: '12px' }}>
                        <div>
                          <span style={{ fontWeight: 800, fontSize: '0.95rem' }}>Order Ticket ID: #{order.id}</span>
                          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginLeft: '12px' }}>{order.timestamp}</span>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem' }}>
                          <span style={{ fontWeight: 800 }}>Logistics Stage:</span>
                          <select
                            value={order.status}
                            onChange={(e) => handleOrderStatusUpdate(order.id, e.target.value)}
                            style={{ padding: '4px 8px', border: '1px solid var(--border-muted)', borderRadius: 'var(--radius-xs)', backgroundColor: '#ffffff', color: 'var(--text-main)', fontWeight: 700 }}
                          >
                            <option value="Pending">Pending Dispatch</option>
                            <option value="Processing">Depot Sorting</option>
                            <option value="Shipped">In Transit</option>
                            <option value="Delivered">Delivered Success</option>
                          </select>
                        </div>
                      </div>

                      {/* Timeline Shipment Indicator */}
                      {(() => {
                        const stages = ['Pending', 'Processing', 'Shipped', 'Delivered'];
                        const currentIdx = stages.indexOf(order.status);
                        const progressPct = currentIdx === 0 ? 0 : currentIdx === 1 ? 33 : currentIdx === 2 ? 66 : 100;
                        return (
                          <div className="shipment-timeline-container">
                            <div className="shipment-timeline-line" />
                            <div className="shipment-timeline-progress" style={{ width: `${progressPct}%` }} />
                            
                            <div className={`shipment-timeline-node ${currentIdx >= 0 ? 'completed' : ''} ${order.status === 'Pending' ? 'active' : ''}`}>
                              <div className="shipment-node-dot" />
                              <span className="shipment-node-label">Pending</span>
                            </div>
                            <div className={`shipment-timeline-node ${currentIdx >= 1 ? 'completed' : ''} ${order.status === 'Processing' ? 'active' : ''}`}>
                              <div className="shipment-node-dot" />
                              <span className="shipment-node-label">Sorting</span>
                            </div>
                            <div className={`shipment-timeline-node ${currentIdx >= 2 ? 'completed' : ''} ${order.status === 'Shipped' ? 'active' : ''}`}>
                              <div className="shipment-node-dot" />
                              <span className="shipment-node-label">In Transit</span>
                            </div>
                            <div className={`shipment-timeline-node ${currentIdx >= 3 ? 'completed' : ''} ${order.status === 'Delivered' ? 'active' : ''}`}>
                              <div className="shipment-node-dot" />
                              <span className="shipment-node-label">Delivered</span>
                            </div>
                          </div>
                        );
                      })()}

                      {/* details body */}
                      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '20px', marginTop: '16px' }}>
                        <div>
                          <h4 style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '8px' }}>Package Details</h4>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            {order.items.map(item => {
                              const disc = item.price * (1 - (item.offer || 0) / 100);
                              return (
                                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                                  <span>{item.quantity}x {item.name}</span>
                                  <span style={{ fontWeight: 700 }}>₹{Math.round(disc * item.quantity).toLocaleString('en-IN')}</span>
                                </div>
                              );
                            })}
                          </div>
                          <div style={{ borderTop: '1px solid var(--border-muted)', marginTop: '8px', paddingTop: '8px', textAlign: 'right', fontSize: '0.8rem', fontWeight: 800 }}>
                            Total Paid: ₹{Math.round(order.total).toLocaleString('en-IN')}
                          </div>
                        </div>

                        <div style={{ borderLeft: '1px solid var(--border-muted)', paddingLeft: '16px' }}>
                          <h4 style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '8px' }}>Shipment Target</h4>
                          <div style={{ fontSize: '0.8rem', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <div style={{ fontWeight: 800 }}>{order.customer.name}</div>
                            <div>Phone: {order.customer.phone}</div>
                            <div>Address: {order.customer.address}, {order.customer.city}</div>
                          </div>
                        </div>
                      </div>

                    </div>
                  ))}
                </div>
              )}

            </div>
          )}

          {/* TAB 4: STORE CMS CUSTOMIZER */}
          {activeTab === 'customizer' && (
            <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
              <h2 style={{ fontSize: '1.6rem', marginBottom: '8px', fontWeight: 800 }}>Storefront CMS Customizer</h2>
              <p style={{ color: 'var(--text-muted)', marginBottom: '24px', fontSize: '0.9rem' }}>Configure carousel slide banners, promotional coupons, flash deals countdowns, and real-time palette branding.</p>

              {/* 1. Dynamic Styling Theme Branding */}
              <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--border-muted)', borderRadius: 'var(--radius-lg)', padding: '24px', marginBottom: '24px', boxShadow: 'var(--shadow-sm)' }}>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '16px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ display: 'inline-flex', padding: '6px', backgroundColor: 'var(--accent-gold-bg)', color: 'var(--accent-gold)', borderRadius: '8px' }}><Settings size={18} /></span>
                  Active Palette Branding
                </h3>

                {/* Theme Presets */}
                <h4 style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '12px' }}>Theme Presets</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '12px', marginBottom: '20px' }}>
                  {[
                    { name: 'Classic Navy & Gold', primary: '#091E36', accent: '#F2A900', light: '#0d2c4f' },
                    { name: 'Luxury Emerald & Gold', primary: '#064e3b', accent: '#fbbf24', light: '#047857' },
                    { name: 'Sunset Orchid Crimson', primary: '#4A154B', accent: '#E01E5A', light: '#611f66' },
                    { name: 'Cyberpunk Vaporwave', primary: '#1e1b4b', accent: '#ec4899', light: '#312e81' },
                    { name: 'Stealth Emerald Obsidian', primary: '#0f172a', accent: '#10b981', light: '#1e293b' }
                  ].map(preset => (
                    <div 
                      key={preset.name}
                      onClick={() => {
                        setBrandingColors({
                          primaryNavy: preset.primary,
                          primaryNavyLight: preset.light,
                          accentGold: preset.accent,
                          accentGoldHover: preset.accent + 'dd',
                          accentGoldBg: preset.accent + '15'
                        });
                        addToast(`Applied Preset: ${preset.name}!`, 'success');
                      }}
                      style={{
                        border: brandingColors.primaryNavy === preset.primary ? '2px solid var(--accent-gold)' : '1px solid var(--border-muted)',
                        borderRadius: 'var(--radius-md)',
                        padding: '12px',
                        cursor: 'pointer',
                        background: '#f8fafc',
                        transition: 'var(--transition-fast)'
                      }}
                    >
                      <div style={{ fontSize: '0.8rem', fontWeight: 800, marginBottom: '8px' }}>{preset.name}</div>
                      <div style={{ display: 'flex', gap: '4px' }}>
                        <div style={{ width: '20px', height: '20px', backgroundColor: preset.primary, borderRadius: '4px' }}></div>
                        <div style={{ width: '20px', height: '20px', backgroundColor: preset.accent, borderRadius: '4px' }}></div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Individual Custom Pickers */}
                <h4 style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '12px' }}>Custom Brand Pickers</h4>
                <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: 700 }}>Primary Navy Theme Color:</label>
                    <input 
                      type="color" 
                      value={brandingColors.primaryNavy || '#091E36'} 
                      onChange={(e) => setBrandingColors({
                        ...brandingColors,
                        primaryNavy: e.target.value,
                        primaryNavyLight: e.target.value + 'ee'
                      })}
                      style={{ border: 'none', width: '36px', height: '36px', cursor: 'pointer', borderRadius: '4px' }}
                    />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: 700 }}>Accent Highlight Color:</label>
                    <input 
                      type="color" 
                      value={brandingColors.accentGold || '#F2A900'} 
                      onChange={(e) => setBrandingColors({
                        ...brandingColors,
                        accentGold: e.target.value,
                        accentGoldHover: e.target.value + 'ee',
                        accentGoldBg: e.target.value + '15'
                      })}
                      style={{ border: 'none', width: '36px', height: '36px', cursor: 'pointer', borderRadius: '4px' }}
                    />
                  </div>
                </div>
              </div>

              {/* 2. Carousel Banners CMS Section */}
              <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--border-muted)', borderRadius: 'var(--radius-lg)', padding: '24px', marginBottom: '24px', boxShadow: 'var(--shadow-sm)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ display: 'inline-flex', padding: '6px', backgroundColor: 'var(--accent-gold-bg)', color: 'var(--accent-gold)', borderRadius: '8px' }}><PlusCircle size={18} /></span>
                    Interactive Banner Sliders ({banners.length})
                  </h3>
                  <button 
                    className="btn btn-primary btn-sm"
                    style={{ borderRadius: 'var(--radius-full)' }}
                    onClick={() => {
                      const newBanner = {
                        title: 'Newly Customized Promotion',
                        subtitle: 'Enjoy premium deals on selective gadgets!',
                        tag: 'FLASH RELEASES',
                        btnText: 'SHOP DEALS',
                        img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80'
                      };
                      setBanners([...banners, newBanner]);
                      addToast('New Carousel slide banner added! Edit details below.', 'success');
                    }}
                  >
                    ADD CAROUSEL SLIDE
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {banners.map((banner, index) => (
                    <div 
                      key={index} 
                      style={{
                        border: '1px solid var(--border-muted)',
                        borderRadius: 'var(--radius-md)',
                        padding: '20px',
                        background: '#f8fafc',
                        position: 'relative'
                      }}
                    >
                      <button 
                        onClick={() => {
                          if (banners.length <= 1) {
                            addToast('You must keep at least 1 carousel banner!', 'error');
                            return;
                          }
                          setBanners(banners.filter((_, idx) => idx !== index));
                          addToast('Carousel banner slide removed!', 'warning');
                        }}
                        style={{ position: 'absolute', top: '16px', right: '16px', border: 'none', background: 'transparent', color: 'var(--danger)', cursor: 'pointer' }}
                      >
                        <Trash2 size={16} />
                      </button>

                      <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: '16px', alignItems: 'center', marginBottom: '14px' }}>
                        <img 
                          src={banner.img} 
                          alt="" 
                          style={{ width: '80px', height: '80px', borderRadius: 'var(--radius-sm)', objectFit: 'cover', border: '1px solid var(--border-muted)' }} 
                        />
                        <div>
                          <div style={{ fontWeight: 800, fontSize: '0.9rem' }}>Slide #{index + 1} Preview</div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{banner.title || 'Untitled Banner'}</div>
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '14px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <label style={{ fontSize: '0.75rem', fontWeight: 800 }}>Pill Tag Text:</label>
                          <input 
                            type="text" 
                            value={banner.tag} 
                            onChange={(e) => {
                              const updated = [...banners];
                              updated[index].tag = e.target.value;
                              setBanners(updated);
                            }}
                            style={{ padding: '8px', border: '1px solid var(--border-muted)', borderRadius: 'var(--radius-sm)' }}
                          />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <label style={{ fontSize: '0.75rem', fontWeight: 800 }}>Slide Title:</label>
                          <input 
                            type="text" 
                            value={banner.title} 
                            onChange={(e) => {
                              const updated = [...banners];
                              updated[index].title = e.target.value;
                              setBanners(updated);
                            }}
                            style={{ padding: '8px', border: '1px solid var(--border-muted)', borderRadius: 'var(--radius-sm)' }}
                          />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <label style={{ fontSize: '0.75rem', fontWeight: 800 }}>Subtitle Text:</label>
                          <input 
                            type="text" 
                            value={banner.subtitle} 
                            onChange={(e) => {
                              const updated = [...banners];
                              updated[index].subtitle = e.target.value;
                              setBanners(updated);
                            }}
                            style={{ padding: '8px', border: '1px solid var(--border-muted)', borderRadius: 'var(--radius-sm)' }}
                          />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <label style={{ fontSize: '0.75rem', fontWeight: 800 }}>Button Call-To-Action:</label>
                          <input 
                            type="text" 
                            value={banner.btnText} 
                            onChange={(e) => {
                              const updated = [...banners];
                              updated[index].btnText = e.target.value;
                              setBanners(updated);
                            }}
                            style={{ padding: '8px', border: '1px solid var(--border-muted)', borderRadius: 'var(--radius-sm)' }}
                          />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', gridColumn: 'span 2' }}>
                          <label style={{ fontSize: '0.75rem', fontWeight: 800 }}>Image Banner URL:</label>
                          <input 
                            type="url" 
                            value={banner.img} 
                            onChange={(e) => {
                              const updated = [...banners];
                              updated[index].img = e.target.value;
                              setBanners(updated);
                            }}
                            style={{ padding: '8px', border: '1px solid var(--border-muted)', borderRadius: 'var(--radius-sm)', width: '100%' }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 3. Promo Coupons Panel & 4. Flash Deals Settings */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                
                {/* Promo Coupons */}
                <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--border-muted)', borderRadius: 'var(--radius-lg)', padding: '24px', boxShadow: 'var(--shadow-sm)' }}>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '16px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ display: 'inline-flex', padding: '6px', backgroundColor: 'var(--accent-gold-bg)', color: 'var(--accent-gold)', borderRadius: '8px' }}><DollarSign size={18} /></span>
                    Promo Coupons Manager
                  </h3>

                  <div style={{ marginBottom: '16px' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                      <thead>
                        <tr style={{ borderBottom: '2px solid var(--border-muted)', textAlign: 'left' }}>
                          <th style={{ padding: '8px 4px', fontWeight: 800 }}>Code</th>
                          <th style={{ padding: '8px 4px', fontWeight: 800 }}>Discount</th>
                          <th style={{ padding: '8px 4px', fontWeight: 800, textAlign: 'right' }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {coupons.map((coupon, idx) => (
                          <tr key={idx} style={{ borderBottom: '1px solid var(--border-muted)' }}>
                            <td style={{ padding: '8px 4px', fontWeight: 800 }}>{coupon.code}</td>
                            <td style={{ padding: '8px 4px' }}>{coupon.discount}% off</td>
                            <td style={{ padding: '8px 4px', textAlign: 'right' }}>
                              <button 
                                onClick={() => {
                                  setCoupons(coupons.filter((_, i) => i !== idx));
                                  addToast(`Coupon Code ${coupon.code} deleted!`, 'warning');
                                }}
                                style={{ border: 'none', background: 'transparent', color: 'var(--danger)', cursor: 'pointer' }}
                              >
                                <Trash2 size={14} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Add Coupon Subform */}
                  <div style={{ background: '#f8fafc', padding: '12px', borderRadius: 'var(--radius-sm)', border: '1px dashed var(--border-muted)' }}>
                    <h4 style={{ fontSize: '0.78rem', fontWeight: 800, marginBottom: '8px' }}>Add Promotional Coupon</h4>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <input 
                        type="text" 
                        id="new-coupon-code"
                        placeholder="e.g. FLASH30" 
                        style={{ padding: '6px', border: '1px solid var(--border-muted)', borderRadius: 'var(--radius-sm)', flexGrow: 1, fontSize: '0.8rem', textTransform: 'uppercase' }}
                      />
                      <input 
                        type="number" 
                        id="new-coupon-discount"
                        placeholder="30" 
                        min="1"
                        max="90"
                        style={{ padding: '6px', border: '1px solid var(--border-muted)', borderRadius: 'var(--radius-sm)', width: '60px', fontSize: '0.8rem' }}
                      />
                      <button 
                        onClick={() => {
                          const codeEl = document.getElementById('new-coupon-code');
                          const discEl = document.getElementById('new-coupon-discount');
                          const codeVal = codeEl.value.trim().toUpperCase();
                          const discVal = parseInt(discEl.value);

                          if (!codeVal || isNaN(discVal)) {
                            addToast('Please enter both Coupon Code and Discount %!', 'error');
                            return;
                          }
                          if (coupons.some(c => c.code === codeVal)) {
                            addToast('Coupon code already exists!', 'error');
                            return;
                          }

                          setCoupons([...coupons, { code: codeVal, discount: discVal, description: `Extra ${discVal}% discount promo` }]);
                          addToast(`Coupon code ${codeVal} successfully registered!`, 'success');
                          codeEl.value = '';
                          discEl.value = '';
                        }}
                        style={{ padding: '6px 12px', border: 'none', background: 'var(--primary-navy)', color: 'white', borderRadius: 'var(--radius-sm)', fontWeight: 800, fontSize: '0.75rem', cursor: 'pointer' }}
                      >
                        ADD
                      </button>
                    </div>
                  </div>
                </div>

                {/* Flash Timer Settings */}
                <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--border-muted)', borderRadius: 'var(--radius-lg)', padding: '24px', boxShadow: 'var(--shadow-sm)' }}>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '16px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ display: 'inline-flex', padding: '6px', backgroundColor: 'var(--accent-gold-bg)', color: 'var(--accent-gold)', borderRadius: '8px' }}><RefreshCw size={18} /></span>
                    Flash Deals Countdown
                  </h3>

                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
                    Adjust the remaining hours and minutes for the "Flash Deals of the Day" countdown clock that displays on the home page.
                  </p>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '20px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <label style={{ fontSize: '0.78rem', fontWeight: 800 }}>Timer Hours:</label>
                      <input 
                        type="number" 
                        min="0"
                        max="99"
                        value={flashTimer.hours} 
                        onChange={(e) => setFlashTimer({
                          ...flashTimer,
                          hours: Math.max(0, parseInt(e.target.value) || 0)
                        })}
                        style={{ padding: '10px', border: '1px solid var(--border-muted)', borderRadius: 'var(--radius-sm)' }}
                      />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <label style={{ fontSize: '0.78rem', fontWeight: 800 }}>Timer Minutes:</label>
                      <input 
                        type="number" 
                        min="0"
                        max="59"
                        value={flashTimer.minutes} 
                        onChange={(e) => setFlashTimer({
                          ...flashTimer,
                          minutes: Math.max(0, Math.min(59, parseInt(e.target.value) || 0))
                        })}
                        style={{ padding: '10px', border: '1px solid var(--border-muted)', borderRadius: 'var(--radius-sm)' }}
                      />
                    </div>
                  </div>

                  <div style={{ padding: '14px', background: '#f8fafc', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-muted)', fontSize: '0.8rem', color: 'var(--text-sub)' }}>
                    <strong>Note:</strong> The timer ticks down live on the storefront homepage and automatically restarts when it hits zero to prevent client-side lockups.
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB 5: RBAC USER MANAGER */}
          {activeTab === 'rbac' && (
            <div style={{ animation: 'fadeIn 0.4s ease-out' }}>
              <h2 style={{ fontSize: '1.6rem', marginBottom: '20px', fontWeight: 800 }}>RBAC User Administration</h2>
              
              <div style={{ display: 'grid', gridTemplateColumns: '360px 1fr', gap: '24px', alignItems: 'start' }}>
                
                {/* Create User Card */}
                <div style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid var(--border-muted)',
                  borderRadius: 'var(--radius-sm)',
                  boxShadow: 'var(--shadow-sm)',
                  padding: '24px'
                }}>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <UserPlus size={18} style={{ color: 'var(--accent-gold)' }} /> Create System User
                  </h3>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
                    Register a new credential account directly into the database. The session of the logged-in Administrator will not be interrupted.
                  </p>

                  <form onSubmit={handleCreateUser} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <label style={{ fontSize: '0.75rem', fontWeight: 800 }}>Full Name *</label>
                      <input 
                        type="text" 
                        required 
                        placeholder="John Doe"
                        value={newUserForm.name}
                        onChange={(e) => setNewUserForm({ ...newUserForm, name: e.target.value })}
                        style={{ padding: '10px', border: '1px solid var(--border-muted)', borderRadius: 'var(--radius-xs)', outline: 'none', backgroundColor: 'var(--bg-app)', color: 'var(--text-main)', fontSize: '0.85rem' }}
                      />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <label style={{ fontSize: '0.75rem', fontWeight: 800 }}>Email Address *</label>
                      <input 
                        type="email" 
                        required 
                        placeholder="john.doe@estar.com"
                        value={newUserForm.email}
                        onChange={(e) => setNewUserForm({ ...newUserForm, email: e.target.value })}
                        style={{ padding: '10px', border: '1px solid var(--border-muted)', borderRadius: 'var(--radius-xs)', outline: 'none', backgroundColor: 'var(--bg-app)', color: 'var(--text-main)', fontSize: '0.85rem' }}
                      />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <label style={{ fontSize: '0.75rem', fontWeight: 800 }}>Password *</label>
                      <input 
                        type="password" 
                        required 
                        placeholder="Minimum 6 characters"
                        value={newUserForm.password}
                        onChange={(e) => setNewUserForm({ ...newUserForm, password: e.target.value })}
                        style={{ padding: '10px', border: '1px solid var(--border-muted)', borderRadius: 'var(--radius-xs)', outline: 'none', backgroundColor: 'var(--bg-app)', color: 'var(--text-main)', fontSize: '0.85rem' }}
                      />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <label style={{ fontSize: '0.75rem', fontWeight: 800 }}>Assigned RBAC Role *</label>
                      <select 
                        value={newUserForm.role}
                        onChange={(e) => setNewUserForm({ ...newUserForm, role: e.target.value })}
                        style={{ padding: '10px', border: '1px solid var(--border-muted)', borderRadius: 'var(--radius-xs)', outline: 'none', backgroundColor: 'var(--bg-app)', color: 'var(--text-main)', fontSize: '0.85rem', fontWeight: 700 }}
                      >
                        <option value="user">USER (Standard Storefront Customer)</option>
                        <option value="admin">ADMIN (Merchant Console Executive)</option>
                      </select>
                    </div>

                    <button 
                      type="submit" 
                      className="btn btn-primary" 
                      disabled={isCreatingUser}
                      style={{ width: '100%', padding: '12px', marginTop: '6px', fontSize: '0.85rem' }}
                    >
                      {isCreatingUser ? 'Registering Credential...' : 'REGISTER USER'}
                    </button>
                  </form>
                </div>

                {/* Users Directory Card */}
                <div style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid var(--border-muted)',
                  borderRadius: 'var(--radius-sm)',
                  boxShadow: 'var(--shadow-sm)',
                  padding: '24px',
                  minHeight: '400px'
                }}>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Users size={18} style={{ color: 'var(--accent-gold)' }} /> Systems Registry ({usersList.length})
                  </h3>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
                    View and govern permissions of active database accounts. Change role levels dynamically to test RBAC shields.
                  </p>

                  {loadingUsers ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '200px', gap: '12px' }}>
                      <div className="spinner" style={{ width: '32px', height: '32px', border: '3px solid var(--accent-gold-bg)', borderTop: '3px solid var(--accent-gold)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-sub)' }}>Fetching users from Firestore...</span>
                    </div>
                  ) : (
                    <div style={{ overflowX: 'auto' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', textAlign: 'left' }}>
                        <thead>
                          <tr style={{ borderBottom: '2px solid var(--border-muted)', color: 'var(--text-muted)', fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase' }}>
                            <th style={{ padding: '12px 8px' }}>User Details</th>
                            <th style={{ padding: '12px 8px' }}>Email Address</th>
                            <th style={{ padding: '12px 8px' }}>Assigned Privilege</th>
                            <th style={{ padding: '12px 8px', textAlign: 'center' }}>Admin Operations</th>
                          </tr>
                        </thead>
                        <tbody>
                          {usersList.map((usr) => (
                            <tr key={usr.id} style={{ borderBottom: '1px solid var(--border-muted)', transition: 'var(--transition-fast)' }}>
                              <td style={{ padding: '14px 8px' }}>
                                <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{usr.name}</div>
                                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>ID: {usr.id.substring(0, 8)}...</div>
                              </td>
                              <td style={{ padding: '14px 8px', color: 'var(--text-sub)' }}>{usr.email}</td>
                              <td style={{ padding: '14px 8px' }}>
                                <span style={{
                                  padding: '4px 10px',
                                  borderRadius: '20px',
                                  fontSize: '0.7rem',
                                  fontWeight: 800,
                                  textTransform: 'uppercase',
                                  backgroundColor: usr.role === 'admin' ? 'var(--accent-gold-bg)' : '#f1f5f9',
                                  color: usr.role === 'admin' ? 'var(--accent-gold)' : '#64748b',
                                  border: usr.role === 'admin' ? '1px solid var(--accent-gold)' : '1px solid #cbd5e1'
                                }}>
                                  {usr.role || 'user'}
                                </span>
                              </td>
                              <td style={{ padding: '14px 8px', textAlign: 'center' }}>
                                <button 
                                  onClick={() => handleToggleUserRole(usr.id, usr.role)}
                                  className="btn btn-outline"
                                  style={{
                                    padding: '6px 12px',
                                    fontSize: '0.75rem',
                                    borderColor: usr.role === 'admin' ? 'var(--danger)' : 'var(--accent-gold)',
                                    color: usr.role === 'admin' ? 'var(--danger)' : 'var(--accent-gold)',
                                    backgroundColor: 'transparent'
                                  }}
                                >
                                  {usr.role === 'admin' ? 'Demote to User' : 'Promote to Admin'}
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

              </div>
            </div>
          )}

        </section>
      </div>

      {/* Product Form Modal */}
      {isFormOpen && (
        <div className="modal-overlay" onClick={() => setIsFormOpen(false)}>
          <div className="modal-content" style={{ maxWidth: '580px' }} onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setIsFormOpen(false)}>
              <X size={18} />
            </button>

            <h2 style={{ padding: '24px 24px 0', fontSize: '1.25rem', fontWeight: 800 }}>
              {editingProduct ? 'Edit Existing Product Specifications' : 'Register New Catalog Product'}
            </h2>

            <form onSubmit={handleFormSubmit} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div className="form-group">
                <label style={{ fontSize: '0.78rem', fontWeight: 800 }}>Product Title *</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. DreamColor WiFi LED Controller"
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  style={{ padding: '10px', border: '1px solid var(--border-muted)', borderRadius: 'var(--radius-xs)', backgroundColor: 'var(--bg-app)', color: 'var(--text-main)', outline: 'none', marginTop: '4px' }}
                />
              </div>

              <div className="form-group">
                <label style={{ fontSize: '0.78rem', fontWeight: 800 }}>Description Details</label>
                <textarea 
                  rows="2"
                  placeholder="Summarize key spec metrics, highlights, features..."
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  style={{ padding: '10px', border: '1px solid var(--border-muted)', borderRadius: 'var(--radius-xs)', backgroundColor: 'var(--bg-app)', color: 'var(--text-main)', outline: 'none', fontFamily: 'var(--font-sans)', resize: 'none', marginTop: '4px' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div className="form-group">
                  <label style={{ fontSize: '0.78rem', fontWeight: 800 }}>Category Selector *</label>
                  <select 
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    style={{ padding: '10px', border: '1px solid var(--border-muted)', borderRadius: 'var(--radius-xs)', backgroundColor: 'var(--bg-app)', color: 'var(--text-main)', marginTop: '4px', fontWeight: 700 }}
                  >
                    {CATEGORIES.filter(c => c !== 'All').map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label style={{ fontSize: '0.78rem', fontWeight: 800 }}>Product Image</label>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginTop: '4px' }}>
                    {productForm.image ? (
                      <img 
                        src={productForm.image} 
                        alt="Preview" 
                        style={{ width: '42px', height: '42px', objectFit: 'contain', border: '1px solid var(--border-muted)', padding: '2px', borderRadius: '4px', backgroundColor: '#ffffff' }} 
                      />
                    ) : (
                      <div style={{ width: '42px', height: '42px', border: '1px dashed var(--border-muted)', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg-app)', color: 'var(--text-muted)' }}>
                        <ImageIcon size={18} />
                      </div>
                    )}
                    <label 
                      className="btn btn-outline btn-sm" 
                      style={{ 
                        margin: 0, 
                        flexGrow: 1, 
                        textAlign: 'center', 
                        cursor: 'pointer',
                        padding: '10px 14px',
                        fontSize: '0.8rem',
                        display: 'inline-flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <Upload size={14} /> CHOOSE REAL IMAGE
                      <input 
                        type="file" 
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={async (e) => {
                          const file = e.target.files[0];
                          if (file) {
                            try {
                              const compressed = await compressImage(file);
                              setProductForm({ ...productForm, image: compressed });
                              addToast("Image uploaded and optimized successfully!", "success");
                            } catch (err) {
                              console.error("Image processing error:", err);
                              addToast("Failed to process image.", "danger");
                            }
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* Product Gallery Section */}
              <div className="form-group">
                <label style={{ fontSize: '0.78rem', fontWeight: 800 }}>Product Gallery (Upload Multiple Images)</label>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '4px', alignItems: 'center' }}>
                  {productForm.images && productForm.images.map((img, idx) => (
                    <div key={idx} style={{ position: 'relative', width: '50px', height: '50px', border: '1px solid var(--border-muted)', borderRadius: '4px', padding: '2px', backgroundColor: '#ffffff' }}>
                      <img src={img} alt={`Gallery ${idx}`} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                      <button 
                        type="button" 
                        onClick={() => {
                          setProductForm({
                            ...productForm,
                            images: productForm.images.filter((_, i) => i !== idx)
                          });
                        }}
                        style={{
                          position: 'absolute',
                          top: '-6px',
                          right: '-6px',
                          backgroundColor: 'var(--danger)',
                          color: '#ffffff',
                          border: 'none',
                          borderRadius: '50%',
                          width: '16px',
                          height: '16px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          fontSize: '10px',
                          fontWeight: 'bold',
                          padding: 0
                        }}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  <label 
                    className="btn btn-outline btn-sm" 
                    style={{ 
                      margin: 0, 
                      width: '50px', 
                      height: '50px', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      cursor: 'pointer',
                      borderStyle: 'dashed',
                      borderRadius: '4px',
                      padding: 0
                    }}
                  >
                    <PlusCircle size={20} />
                    <input 
                      type="file" 
                      accept="image/*"
                      multiple
                      style={{ display: 'none' }}
                      onChange={async (e) => {
                        const files = Array.from(e.target.files);
                        if (files.length > 0) {
                          try {
                            const compressedList = await Promise.all(
                              files.map(file => compressImage(file))
                            );
                            setProductForm({
                              ...productForm,
                              images: [...(productForm.images || []), ...compressedList]
                            });
                            addToast(`Added ${files.length} image(s) to gallery!`, 'success');
                          } catch (err) {
                            console.error("Gallery processing error:", err);
                            addToast("Failed to process gallery image(s).", "danger");
                          }
                        }
                      }}
                    />
                  </label>
                </div>
              </div>


              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label style={{ fontSize: '0.78rem', fontWeight: 800 }}>Base Price (₹) *</label>
                  <input 
                    type="number" 
                    step="1"
                    min="1"
                    required
                    placeholder="3999"
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    style={{ padding: '10px', border: '1px solid var(--border-muted)', borderRadius: 'var(--radius-xs)', backgroundColor: 'var(--bg-app)', color: 'var(--text-main)', outline: 'none', marginTop: '4px' }}
                  />
                </div>
                <div className="form-group">
                  <label style={{ fontSize: '0.78rem', fontWeight: 800 }}>Offer (%)</label>
                  <input 
                    type="number" 
                    min="0"
                    max="90"
                    placeholder="20"
                    value={productForm.offer}
                    onChange={(e) => setProductForm({ ...productForm, offer: e.target.value })}
                    style={{ padding: '10px', border: '1px solid var(--border-muted)', borderRadius: 'var(--radius-xs)', backgroundColor: 'var(--bg-app)', color: 'var(--text-main)', outline: 'none', marginTop: '4px' }}
                  />
                </div>
                <div className="form-group">
                  <label style={{ fontSize: '0.78rem', fontWeight: 800 }}>Fulfillment Qty *</label>
                  <input 
                    type="number" 
                    min="0"
                    required
                    placeholder="15"
                    value={productForm.stock}
                    onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                    style={{ padding: '10px', border: '1px solid var(--border-muted)', borderRadius: 'var(--radius-xs)', backgroundColor: 'var(--bg-app)', color: 'var(--text-main)', outline: 'none', marginTop: '4px' }}
                  />
                </div>
              </div>

              <div className="form-group">
                <label style={{ fontSize: '0.78rem', fontWeight: 800 }}>Key Specifications / Features (Comma separated)</label>
                <input 
                  type="text" 
                  placeholder="Spec 1, Spec 2, Spec 3"
                  value={productForm.specs}
                  onChange={(e) => setProductForm({ ...productForm, specs: e.target.value })}
                  style={{ padding: '10px', border: '1px solid var(--border-muted)', borderRadius: 'var(--radius-xs)', backgroundColor: 'var(--bg-app)', color: 'var(--text-main)', outline: 'none', marginTop: '4px' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '16px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setIsFormOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">
                  {editingProduct ? 'SAVE CHANGES' : 'CREATE LISTING'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
