import React, { useState } from 'react';
import { 
  LuStar as Star, 
  LuShoppingBag as ShoppingBag, 
  LuEye as Eye, 
  LuCheck as Check, 
  LuX as X, 
  LuTrash2 as Trash2, 
  LuArrowRight as ArrowRight,
  LuShieldCheck as ShieldCheck,
  LuTrendingDown as TrendingDown
} from 'react-icons/lu';
import { CATEGORIES } from '../data/initialProducts';

export default function Storefront({
  products,
  cart,
  setCart,
  searchTerm,
  addToast,
  onPlaceOrder
}) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedProduct, setSelectedProduct] = useState(null); // For product details modal
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [activeDiscount, setActiveDiscount] = useState(0); // Extra % off from promo code
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  
  // Checkout Form State
  const [checkoutForm, setCheckoutForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zip: '',
    paymentMethod: 'credit'
  });

  // Filter products based on search term and selected category
  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Add item to cart
  const addToCart = (product) => {
    if (product.stock <= 0) {
      addToast('Sorry, this product is currently out of stock!', 'warning');
      return;
    }

    const existingCartItem = cart.find(item => item.id === product.id);
    const currentQtyInCart = existingCartItem ? existingCartItem.quantity : 0;

    if (currentQtyInCart >= product.stock) {
      addToast(`Only ${product.stock} units available in stock!`, 'warning');
      return;
    }

    if (existingCartItem) {
      setCart(cart.map(item => 
        item.id === product.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
    
    addToast(`${product.name} added to your cart!`, 'success');
  };

  // Update item quantity in cart
  const updateCartQty = (productId, newQty) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    if (newQty <= 0) {
      removeFromCart(productId);
      return;
    }

    if (newQty > product.stock) {
      addToast(`Only ${product.stock} units available in stock!`, 'warning');
      return;
    }

    setCart(cart.map(item => 
      item.id === productId 
        ? { ...item, quantity: newQty }
        : item
    ));
  };

  // Remove item from cart
  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId));
    addToast('Item removed from cart.', 'info');
  };

  // Calculate prices
  const subtotal = cart.reduce((sum, item) => {
    const discountedPrice = item.price * (1 - (item.offer || 0) / 100);
    return sum + (discountedPrice * item.quantity);
  }, 0);

  const promoDiscountVal = subtotal * (activeDiscount / 100);
  const total = subtotal - promoDiscountVal;

  // Apply promo codes
  const applyPromo = () => {
    const code = promoCode.trim().toUpperCase();
    if (code === 'STAR10') {
      setActiveDiscount(10);
      addToast('Promo code applied! Extra 10% off your order.', 'success');
    } else if (code === 'WELCOME5') {
      setActiveDiscount(5);
      addToast('Promo code applied! Extra 5% off your order.', 'success');
    } else if (code !== '') {
      addToast('Invalid promo code. Try STAR10 or WELCOME5!', 'error');
    }
  };

  // Handle Checkout submission
  const handleCheckoutSubmit = (e) => {
    e.preventDefault();
    if (!checkoutForm.name || !checkoutForm.email || !checkoutForm.address || !checkoutForm.phone) {
      addToast('Please fill out all required shipping fields!', 'error');
      return;
    }

    // Call parent handler to log order and update stock
    onPlaceOrder({
      customer: checkoutForm,
      items: cart,
      subtotal,
      promoDiscount: promoDiscountVal,
      total,
      promoApplied: activeDiscount > 0 ? promoCode.toUpperCase() : null
    });

    // Clear cart and checkout form
    setCart([]);
    setIsCheckoutOpen(false);
    setIsCartOpen(false);
    setPromoCode('');
    setActiveDiscount(0);
    setCheckoutForm({
      name: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      zip: '',
      paymentMethod: 'credit'
    });
    addToast('Order placed successfully! Thank you for shopping.', 'success');
  };

  return (
    <main style={{ paddingBottom: '60px' }}>
      {/* Dynamic Glowing Hero Banner */}
      <section className="hero-banner">
        <div className="hero-content">
          <span className="offer-campaign-badge">Summer Campaign Live</span>
          <h1 className="hero-title">
            Automated <span className="text-gradient">Next-Gen</span> Smart Devices
          </h1>
          <p className="hero-subtitle">
            Upgrade your life with ultra-premium smart home gadgets, military-grade security equipment, electronics, and educational toys.
          </p>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button className="btn btn-primary" onClick={() => setSelectedCategory('All')}>
              Explore Catalog <ArrowRight size={16} />
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
              <ShieldCheck size={18} className="text-gradient" />
              <span>Full Local Store Automation</span>
            </div>
          </div>
        </div>
        <div className="hero-visual">
          <div className="floating-badge-sales">
            <TrendingDown size={22} className="text-gradient" />
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>DISCOUNT CAMPAIGN</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800 }}>STAR10 Active</div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Horizontal Bar */}
      <section className="category-scroller-container">
        <h2 style={{ fontSize: '1.4rem', marginBottom: '16px', fontWeight: 700 }}>Browse Categories</h2>
        <div className="category-list">
          {CATEGORIES.map(category => (
            <button
              key={category}
              className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      {/* Products Grid */}
      <section>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>
            {selectedCategory} Products <span style={{ fontSize: '1.1rem', color: 'var(--text-muted)', fontWeight: 400 }}>({filteredProducts.length} items found)</span>
          </h2>
        </div>

        {filteredProducts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
            <ShoppingBag size={48} style={{ marginBottom: '16px', color: 'var(--text-muted)' }} />
            <h3>No products found matching your search.</h3>
            <p style={{ marginTop: '8px' }}>Try switching categories or searching other keywords.</p>
          </div>
        ) : (
          <div className="products-grid">
            {filteredProducts.map(product => {
              const discountPrice = product.price * (1 - (product.offer || 0) / 100);
              const isOutOfStock = product.stock <= 0;

              return (
                <div key={product.id} className="product-card">
                  {/* Badges Overlay */}
                  <div className="card-badge-top">
                    {product.offer > 0 && (
                      <span className="discount-badge">-{product.offer}% OFF</span>
                    )}
                    {isOutOfStock && (
                      <span className="stock-badge-out">OUT OF STOCK</span>
                    )}
                  </div>

                  {/* Product Image */}
                  <div className="product-image-container">
                    <img src={product.image} alt={product.name} loading="lazy" />
                    <div className="quick-details-overlay">
                      <button 
                        className="btn btn-secondary btn-sm"
                        onClick={() => setSelectedProduct(product)}
                        title="Quick View Specifications"
                      >
                        <Eye size={14} /> Quick View
                      </button>
                    </div>
                  </div>

                  {/* Info Box */}
                  <div className="product-info">
                    <div className="product-meta">
                      <span className="product-category">{product.category}</span>
                      <span className="product-rating">
                        <Star size={14} fill="currentColor" /> {product.rating} <span>({product.reviewsCount})</span>
                      </span>
                    </div>

                    <h3 className="product-name" title={product.name}>{product.name}</h3>
                    <p className="product-desc" title={product.description}>{product.description}</p>

                    <div className="product-footer">
                      <div className="price-box">
                        {product.offer > 0 && (
                          <span className="original-price">₹{Math.round(product.price).toLocaleString('en-IN')}</span>
                        )}
                        <span className="current-price">₹{Math.round(discountPrice).toLocaleString('en-IN')}</span>
                      </div>

                      <button
                        className={`btn ${isOutOfStock ? 'btn-secondary' : 'btn-primary'} btn-sm`}
                        onClick={() => addToCart(product)}
                        disabled={isOutOfStock}
                        title={isOutOfStock ? 'Out of stock' : 'Add item to shopping cart'}
                      >
                        <ShoppingBag size={14} /> 
                        {isOutOfStock ? 'Sold Out' : 'Add to Cart'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Slide-out Cart Sidebar */}
      <div className={`cart-overlay ${isCartOpen ? 'open' : ''}`} onClick={() => setIsCartOpen(false)}>
        <div className="cart-sidebar" onClick={(e) => e.stopPropagation()}>
          <div className="cart-header">
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.3rem' }}>
              <ShoppingBag className="text-gradient" /> Your Cart 
              <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>({cart.length} unique items)</span>
            </h2>
            <button className="modal-close-btn" onClick={() => setIsCartOpen(false)}>
              <X size={18} />
            </button>
          </div>

          <div className="cart-body">
            {cart.length === 0 ? (
              <div className="cart-empty">
                <ShoppingBag size={48} style={{ opacity: 0.5 }} />
                <h3>Your shopping cart is empty</h3>
                <p style={{ textAlign: 'center', fontSize: '0.85rem' }}>Add some premium items to get started!</p>
                <button className="btn btn-secondary btn-sm" onClick={() => setIsCartOpen(false)}>
                  Continue Shopping
                </button>
              </div>
            ) : (
              <div className="cart-items-list">
                {cart.map(item => {
                  const finalItemPrice = item.price * (1 - (item.offer || 0) / 100);
                  return (
                    <div key={item.id} className="cart-item">
                      <img src={item.image} alt={item.name} className="cart-item-img" />
                      <div className="cart-item-details">
                        <div>
                          <div className="cart-item-category">{item.category}</div>
                          <h4 className="cart-item-name" title={item.name}>{item.name}</h4>
                        </div>
                        <div className="cart-item-price-row">
                          <div className="cart-item-qty">
                            <button onClick={() => updateCartQty(item.id, item.quantity - 1)}>-</button>
                            <span>{item.quantity}</span>
                            <button onClick={() => updateCartQty(item.id, item.quantity + 1)}>+</button>
                          </div>
                          <span className="cart-item-price">₹{Math.round(finalItemPrice * item.quantity).toLocaleString('en-IN')}</span>
                        </div>
                      </div>
                      <span className="cart-item-remove" onClick={() => removeFromCart(item.id)}>
                        <Trash2 size={16} />
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {cart.length > 0 && (
            <div className="cart-footer">
              {/* Promo Code Input */}
              <div className="cart-discount-input">
                <input
                  type="text"
                  placeholder="Enter Code (STAR10 / WELCOME5)"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                />
                <button className="btn btn-secondary btn-sm" onClick={applyPromo}>
                  Apply
                </button>
              </div>

              {/* Breakdown */}
              <div className="cart-summary-row">
                <span>Subtotal (after specs discount):</span>
                <span>₹{Math.round(subtotal).toLocaleString('en-IN')}</span>
              </div>
              {activeDiscount > 0 && (
                <div className="cart-summary-row" style={{ color: 'var(--success)' }}>
                  <span>Promo Discount ({activeDiscount}%):</span>
                  <span>-₹{Math.round(promoDiscountVal).toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="cart-summary-total">
                <span>Total Due:</span>
                <span className="text-gradient">₹{Math.round(total).toLocaleString('en-IN')}</span>
              </div>

              <button
                className="btn btn-primary"
                style={{ width: '100%', marginTop: '20px', padding: '12px' }}
                onClick={() => setIsCheckoutOpen(true)}
              >
                Proceed to Checkout <ArrowRight size={16} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="modal-overlay" onClick={() => setSelectedProduct(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setSelectedProduct(null)}>
              <X size={18} />
            </button>
            
            <div className="detail-grid">
              <div className="detail-img-box">
                <img src={selectedProduct.image} alt={selectedProduct.name} />
              </div>
              <div className="detail-info">
                <span className="detail-category-badge">{selectedProduct.category}</span>
                <h2 className="detail-title">{selectedProduct.name}</h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                  <span style={{ display: 'flex', alignItems: 'center', color: 'var(--warning)', fontWeight: 600, fontSize: '0.9rem' }}>
                    <Star size={16} fill="currentColor" style={{ marginRight: '4px' }} />
                    {selectedProduct.rating}
                  </span>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>• {selectedProduct.reviewsCount} customer reviews</span>
                </div>
                
                <p className="detail-desc">{selectedProduct.description}</p>
                
                <div className="detail-specs-box">
                  <h3 className="detail-specs-title">Technical Specifications</h3>
                  <ul className="detail-specs-list">
                    {selectedProduct.specs && selectedProduct.specs.map((spec, idx) => (
                      <li key={idx}>
                        <Check size={14} /> <span>{spec}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="detail-actions-footer">
                  <div className="detail-price-box">
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                      <span style={{ fontSize: '1.8rem', fontWeight: 800 }}>
                        ₹{Math.round(selectedProduct.price * (1 - (selectedProduct.offer || 0) / 100)).toLocaleString('en-IN')}
                      </span>
                      {selectedProduct.offer > 0 && (
                        <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                          ₹{Math.round(selectedProduct.price).toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>
                    <span className={`detail-stock-status ${selectedProduct.stock > 0 ? 'text-success' : 'text-danger'}`} style={{ color: selectedProduct.stock > 0 ? 'var(--success)' : 'var(--danger)' }}>
                      {selectedProduct.stock > 0 ? `In Stock (${selectedProduct.stock} units left)` : 'Out of Stock'}
                    </span>
                  </div>

                  <button
                    className="btn btn-primary"
                    disabled={selectedProduct.stock <= 0}
                    onClick={() => {
                      addToCart(selectedProduct);
                      setSelectedProduct(null);
                    }}
                  >
                    <ShoppingBag size={16} /> Add To Shopping Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Checkout Modal */}
      {isCheckoutOpen && (
        <div className="modal-overlay" onClick={() => setIsCheckoutOpen(false)}>
          <div className="modal-content checkout-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setIsCheckoutOpen(false)}>
              <X size={18} />
            </button>
            <h2 style={{ marginBottom: '24px', fontSize: '1.6rem' }} className="text-gradient">Secure Express Checkout</h2>

            <form onSubmit={handleCheckoutSubmit} className="checkout-grid">
              {/* Shipping Details */}
              <div className="checkout-form-section">
                <h3 style={{ fontSize: '1.1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>1. Customer & Shipping Info</h3>
                
                <div className="form-group">
                  <label htmlFor="name">Full Name *</label>
                  <input
                    type="text"
                    id="name"
                    required
                    placeholder="John Doe"
                    value={checkoutForm.name}
                    onChange={(e) => setCheckoutForm({ ...checkoutForm, name: e.target.value })}
                  />
                </div>

                <div className="form-group-row">
                  <div className="form-group">
                    <label htmlFor="email">Email Address *</label>
                    <input
                      type="email"
                      id="email"
                      required
                      placeholder="john@example.com"
                      value={checkoutForm.email}
                      onChange={(e) => setCheckoutForm({ ...checkoutForm, email: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="phone">Phone Number *</label>
                    <input
                      type="tel"
                      id="phone"
                      required
                      placeholder="+1 (555) 000-1234"
                      value={checkoutForm.phone}
                      onChange={(e) => setCheckoutForm({ ...checkoutForm, phone: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="address">Delivery Street Address *</label>
                  <input
                    type="text"
                    id="address"
                    required
                    placeholder="123 Smart Street, Cyber Hub"
                    value={checkoutForm.address}
                    onChange={(e) => setCheckoutForm({ ...checkoutForm, address: e.target.value })}
                  />
                </div>

                <div className="form-group-row">
                  <div className="form-group">
                    <label htmlFor="city">City *</label>
                    <input
                      type="text"
                      id="city"
                      required
                      placeholder="Techopolis"
                      value={checkoutForm.city}
                      onChange={(e) => setCheckoutForm({ ...checkoutForm, city: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="zip">ZIP / Postal Code *</label>
                    <input
                      type="text"
                      id="zip"
                      required
                      placeholder="10001"
                      value={checkoutForm.zip}
                      onChange={(e) => setCheckoutForm({ ...checkoutForm, zip: e.target.value })}
                    />
                  </div>
                </div>

                <h3 style={{ fontSize: '1.1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px', marginTop: '12px' }}>2. Payment Simulated Method</h3>
                <div className="form-group">
                  <select
                    value={checkoutForm.paymentMethod}
                    onChange={(e) => setCheckoutForm({ ...checkoutForm, paymentMethod: e.target.value })}
                  >
                    <option value="credit">Credit / Debit Card (Simulated)</option>
                    <option value="paypal">PayPal Gateway (Simulated)</option>
                    <option value="cod">Cash on Delivery (Simulated)</option>
                  </select>
                </div>
              </div>

              {/* Order Items Summary Panel */}
              <div className="checkout-order-summary">
                <h3 style={{ fontSize: '1.1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>Order Items</h3>
                <div className="checkout-summary-items">
                  {cart.map(item => {
                    const finalItemPrice = item.price * (1 - (item.offer || 0) / 100);
                    return (
                      <div key={item.id} className="checkout-summary-item">
                        <span style={{ fontWeight: 600, display: 'block', maxWidth: '70%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {item.quantity}x {item.name}
                        </span>
                        <span style={{ color: 'var(--text-secondary)' }}>
                          ₹{Math.round(finalItemPrice * item.quantity).toLocaleString('en-IN')}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.9rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Subtotal:</span>
                    <span>₹{Math.round(subtotal).toLocaleString('en-IN')}</span>
                  </div>
                  {activeDiscount > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--success)' }}>
                      <span>Promo Discount ({activeDiscount}%):</span>
                      <span>-₹{Math.round(promoDiscountVal).toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem', fontWeight: 800, borderTop: '1px solid var(--border-color)', paddingTop: '8px', marginTop: '4px' }}>
                    <span>Total:</span>
                    <span>₹{Math.round(total).toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ width: '100%', marginTop: '20px', padding: '12px' }}
                >
                  Confirm & Place Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
