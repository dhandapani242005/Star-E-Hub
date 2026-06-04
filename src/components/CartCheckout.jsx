import React, { useState } from 'react';
import { 
  LuShoppingBag as ShoppingBag, 
  LuTrash2 as Trash2, 
  LuArrowLeft as ArrowLeft, 
  LuArrowRight as ArrowRight, 
  LuCreditCard as CreditCard, 
  LuMapPin as MapPin, 
  LuCircleCheck as CheckCircle, 
  LuSparkles as Sparkles,
  LuLock as Lock,
  LuChevronRight as ChevronRight
} from 'react-icons/lu';

export default function CartCheckout({
  cart,
  setCart,
  products,
  onPlaceOrder,
  addToast,
  setCurrentPage,
  coupons = [],
  currentUser = null
}) {
  const [funnelStep, setFunnelStep] = useState(1); // 1: Cart, 2: Shipping, 3: Payment, 4: Success
  const [promoCode, setPromoCode] = useState('');
  const [couponDiscountPct, setCouponDiscountPct] = useState(0);
  const [successOrderInfo, setSuccessOrderInfo] = useState(null);

  // shipping Form State
  const [shippingForm, setShippingForm] = useState({
    name: 'Johnathan Doe',
    email: 'john.doe@gmail.com',
    phone: '+1 (555) 234-5678',
    address: '422 Smart Automation Blvd',
    city: 'Silicon Valley',
    state: 'CA',
    zip: '94025',
    paymentMethod: 'credit'
  });

  // Credit Card Interactive states
  const [cardForm, setCardForm] = useState({
    number: '•••• •••• •••• ••••',
    name: 'JOHNATHAN DOE',
    expiry: '12/30',
    cvv: '•••'
  });
  const [cardFlipped, setCardFlipped] = useState(false);

  // Cart quantity controls
  const updateQty = (productId, amount) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const cartItem = cart.find(item => item.id === productId);
    if (!cartItem) return;

    const newQty = cartItem.quantity + amount;

    if (newQty <= 0) {
      removeFromCart(productId);
      return;
    }

    if (newQty > product.stock) {
      addToast(`Only ${product.stock} units left in stock!`, 'warning');
      return;
    }

    setCart(cart.map(item => 
      item.id === productId 
        ? { ...item, quantity: newQty }
        : item
    ));
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId));
    addToast('Item removed from cart.', 'info');
  };

  // Pricing tallies
  const originalSubtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  const subtotal = cart.reduce((sum, item) => {
    const finalItemPrice = item.price * (1 - (item.offer || 0) / 100);
    return sum + (finalItemPrice * item.quantity);
  }, 0);

  const catalogDiscount = originalSubtotal - subtotal;
  const couponDiscountVal = subtotal * (couponDiscountPct / 100);
  const total = subtotal - couponDiscountVal;

  const handleApplyPromo = () => {
    const code = promoCode.trim().toUpperCase();
    const matchedCoupon = coupons.find(c => c.code.trim().toUpperCase() === code);
    if (matchedCoupon) {
      setCouponDiscountPct(matchedCoupon.discount);
      addToast(`Promo code applied! ${matchedCoupon.description} (${matchedCoupon.discount}% OFF)`, 'success');
    } else {
      const activeCouponsStr = coupons.map(c => c.code).join(' or ');
      addToast(`Invalid promo code. Try using ${activeCouponsStr || 'active coupons'}!`, 'error');
    }
  };

  const handleCheckoutSubmit = (e) => {
    e.preventDefault();

    const generatedTicket = Math.floor(100000 + Math.random() * 900000).toString();
    
    const checkoutReceipt = {
      id: generatedTicket,
      timestamp: new Date().toLocaleString(),
      status: 'Pending',
      customer: shippingForm,
      items: cart,
      subtotal,
      promoDiscount: couponDiscountVal,
      total,
      promoApplied: couponDiscountPct > 0 ? promoCode.toUpperCase() : null
    };

    onPlaceOrder(checkoutReceipt);
    
    setSuccessOrderInfo(checkoutReceipt);
    setCart([]);
    setFunnelStep(4);
    
    triggerConfetti();
  };

  const triggerConfetti = () => {
    const colors = ['#091E36', '#F2A900', '#388e3c', '#ff5722', '#2874f0'];
    for (let i = 0; i < 40; i++) {
      const piece = document.createElement('div');
      piece.classList.add('confetti-piece');
      piece.style.left = `${Math.random() * 100}vw`;
      piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      piece.style.animationDelay = `${Math.random() * 2}s`;
      piece.style.transform = `scale(${Math.random() * 1.2})`;
      document.body.appendChild(piece);
      
      setTimeout(() => piece.remove(), 4000);
    }
  };

  return (
    <div className="main-content-layout" style={{ paddingBottom: '60px', animation: 'fadeIn 0.5s ease-out', marginTop: '20px' }}>
      
      {/* Funnel Steps Indicator */}
      {funnelStep < 4 && (
        <section className="checkout-funnel-header" style={{ marginBottom: '30px' }}>
          <div className={`funnel-step ${funnelStep >= 1 ? 'completed' : ''} ${funnelStep === 1 ? 'active' : ''}`} onClick={() => setFunnelStep(1)}>
            <div className="funnel-step-circle">1</div>
            <span className="funnel-step-label">My Cart</span>
          </div>
          <div className={`funnel-step ${funnelStep >= 2 ? 'completed' : ''} ${funnelStep === 2 ? 'active' : ''}`}>
            <div className="funnel-step-circle">2</div>
            <span className="funnel-step-label">Delivery Target</span>
          </div>
          <div className={`funnel-step ${funnelStep >= 3 ? 'completed' : ''} ${funnelStep === 3 ? 'active' : ''}`}>
            <div className="funnel-step-circle">3</div>
            <span className="funnel-step-label">Secure Payment</span>
          </div>
        </section>
      )}

      {/* STEP 1: BASKET SUMMARY */}
      {funnelStep === 1 && (
        <div>
          {cart.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '60px 20px',
              backgroundColor: '#ffffff',
              border: '1px solid var(--border-muted)',
              borderRadius: 'var(--radius-sm)',
              boxShadow: 'var(--shadow-sm)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '16px'
            }}>
              <ShoppingBag size={60} style={{ color: 'var(--primary-navy)' }} />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Missing Cart items?</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>Browse our horizontal categories catalog to add premium devices.</p>
              <button className="btn btn-primary" onClick={() => setCurrentPage('shop')}>
                Explore Tech Catalog
              </button>
            </div>
          ) : (
            <div className="cart-layout">
              {/* Left Side: Items Panel */}
              <div className="cart-items-panel">
                <h3 className="cart-header-title">My Cart ({cart.length} items)</h3>
                
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {cart.map(item => {
                    const finalItemPrice = item.price * (1 - (item.offer || 0) / 100);
                    return (
                      <div 
                        key={item.id} 
                        style={{ 
                          display: 'flex', 
                          gap: '20px', 
                          alignItems: 'center', 
                          padding: '24px',
                          borderBottom: '1px solid var(--border-muted)'
                        }}
                      >
                        <img src={item.image} alt="" style={{ width: '80px', height: '80px', objectFit: 'contain', border: '1px solid #f0f0f0', padding: '6px', backgroundColor: '#ffffff', borderRadius: 'var(--radius-xs)' }} />
                        
                        <div style={{ flexGrow: 1 }}>
                          <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '4px' }}>{item.name}</h3>
                          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Category: {item.category}</span>
                          
                          <div style={{ display: 'flex', gap: '8px', alignItems: 'baseline', marginTop: '8px' }}>
                            <span style={{ fontWeight: 800, fontSize: '1.15rem' }}>₹{Math.round(finalItemPrice).toLocaleString('en-IN')}</span>
                            {item.offer > 0 && <span style={{ textDecoration: 'line-through', color: 'var(--text-muted)', fontSize: '0.85rem' }}>₹{Math.round(item.price).toLocaleString('en-IN')}</span>}
                            {item.offer > 0 && <span style={{ color: 'var(--flipkart-green)', fontWeight: 800, fontSize: '0.85rem' }}>{item.offer}% off</span>}
                          </div>
                        </div>

                        {/* Qty increment */}
                        <div style={{ display: 'flex', alignItems: 'center', background: '#f5f5f5', border: '1px solid var(--border-muted)', borderRadius: 'var(--radius-xs)' }}>
                          <button className="btn btn-sm" style={{ padding: '6px 12px', border: 'none', background: 'transparent', color: 'var(--text-main)' }} onClick={() => updateQty(item.id, -1)}>-</button>
                          <span style={{ width: '32px', textAlign: 'center', fontWeight: 800, fontSize: '0.9rem' }}>{item.quantity}</span>
                          <button className="btn btn-sm" style={{ padding: '6px 12px', border: 'none', background: 'transparent', color: 'var(--text-main)' }} onClick={() => updateQty(item.id, 1)}>+</button>
                        </div>

                        <button 
                          className="btn btn-danger btn-sm btn-icon-only" 
                          style={{ width: '36px', height: '36px', borderRadius: 'var(--radius-sm)' }} 
                          onClick={() => removeFromCart(item.id)}
                          title="Remove item"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right Side: Flipkart Price Details */}
              <div className="price-details-card">
                <h3 className="price-details-title">Price Details</h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', padding: '16px 0', borderBottom: '1px dashed var(--border-muted)' }}>
                  <div className="price-row-item">
                    <span>Price ({cart.reduce((sum, i) => sum + i.quantity, 0)} items)</span>
                    <span>₹{Math.round(originalSubtotal).toLocaleString('en-IN')}</span>
                  </div>
                  
                  {catalogDiscount > 0 && (
                    <div className="price-row-item" style={{ color: 'var(--flipkart-green)' }}>
                      <span>Discount</span>
                      <span>-₹{Math.round(catalogDiscount).toLocaleString('en-IN')}</span>
                    </div>
                  )}

                  {/* Promo Input */}
                  <div style={{ display: 'flex', gap: '8px', padding: '8px 24px' }}>
                    <input 
                      type="text" 
                      placeholder="Enter promo coupon code"
                      style={{
                        flexGrow: 1,
                        padding: '8px 12px',
                        borderRadius: 'var(--radius-xs)',
                        border: '1px solid var(--border-muted)',
                        backgroundColor: 'var(--bg-app)',
                        color: 'var(--text-main)',
                        outline: 'none',
                        fontSize: '0.85rem'
                      }}
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                    />
                    <button className="btn btn-secondary btn-sm" onClick={handleApplyPromo}>Apply</button>
                  </div>

                  {/* Recommended Active Coupons */}
                  {coupons.length > 0 && (
                    <div style={{ padding: '8px 24px' }}>
                      <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.02em' }}>Available Promo Coupons:</div>
                      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px', scrollbarWidth: 'none' }}>
                        {coupons.map((c) => (
                          <div 
                            key={c.code}
                            onClick={() => {
                              setPromoCode(c.code);
                              setCouponDiscountPct(c.discount);
                              addToast(`Promo code applied! ${c.description} (${c.discount}% OFF)`, 'success');
                            }}
                            style={{
                              border: '1.5px dashed var(--accent-gold)',
                              borderRadius: 'var(--radius-xs)',
                              padding: '6px 12px',
                              backgroundColor: 'var(--accent-gold-bg)',
                              cursor: 'pointer',
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              minWidth: '100px',
                              transition: 'var(--transition-fast)',
                              userSelect: 'none'
                            }}
                          >
                            <span style={{ fontSize: '0.78rem', fontWeight: 900, color: 'var(--primary-navy)' }}>{c.code}</span>
                            <span style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-muted)', marginTop: '2px' }}>{c.discount}% OFF</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {couponDiscountPct > 0 && (
                    <div className="price-row-item" style={{ color: 'var(--flipkart-green)' }}>
                      <span>Coupon discount ({couponDiscountPct}%)</span>
                      <span>-₹{Math.round(couponDiscountVal).toLocaleString('en-IN')}</span>
                    </div>
                  )}

                  <div className="price-row-item">
                    <span>Delivery Charges</span>
                    <span style={{ color: 'var(--flipkart-green)', fontWeight: 800 }}>FREE</span>
                  </div>
                </div>

                <div className="price-row-item" style={{ fontSize: '1.2rem', fontWeight: 800, padding: '24px', borderBottom: '1px dashed var(--border-muted)' }}>
                  <span>Total Amount</span>
                  <span style={{ color: 'var(--primary-navy)' }}>₹{Math.round(total).toLocaleString('en-IN')}</span>
                </div>

                {catalogDiscount + couponDiscountVal > 0 && (
                  <div style={{ padding: '16px 24px', color: 'var(--flipkart-green)', fontWeight: 800, fontSize: '0.88rem', backgroundColor: 'var(--flipkart-green-bg)', textAlign: 'center' }}>
                    You will save ₹{Math.round(catalogDiscount + couponDiscountVal).toLocaleString('en-IN')} on this order!
                  </div>
                )}

                <div style={{ padding: '24px' }}>
                  <button 
                    className="btn btn-primary" 
                    style={{ width: '100%', padding: '16px', fontSize: '1rem', backgroundColor: '#fb641b', borderColor: '#fb641b' }}
                    onClick={() => {
                      if (!currentUser) {
                        addToast('Please Sign In to proceed with checkout.', 'warning');
                        setCurrentPage('auth');
                      } else {
                        setFunnelStep(2);
                      }
                    }}
                  >
                    PLACE ORDER <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* STEP 2: DELIVERY DETAILS */}
      {funnelStep === 2 && (
        <div style={{ maxWidth: '640px', margin: '0 auto' }}>
          <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--border-muted)', borderRadius: 'var(--radius-sm)', padding: '30px', boxShadow: 'var(--shadow-sm)' }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MapPin size={22} style={{ color: 'var(--primary-navy)' }} /> FULFILLMENT TARGET
            </h2>
            
            {currentUser && currentUser.addresses && currentUser.addresses.length > 0 && (
              <div style={{ marginBottom: '20px', padding: '16px', border: '1.5px dashed var(--accent-gold)', borderRadius: '8px', backgroundColor: 'var(--accent-gold-bg)' }}>
                <label style={{ fontSize: '0.82rem', fontWeight: 900, color: 'var(--primary-navy)', display: 'block', marginBottom: '8px' }}>
                  SELECT A SAVED DESTINATION
                </label>
                <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '6px', scrollbarWidth: 'none' }}>
                  {currentUser.addresses.map((addr) => (
                    <button
                      key={addr.id}
                      type="button"
                      onClick={() => {
                        setShippingForm({
                          name: addr.name,
                          email: currentUser.email,
                          phone: addr.phone,
                          address: addr.address,
                          city: addr.city,
                          state: addr.state,
                          zip: addr.zip,
                          paymentMethod: 'credit'
                        });
                        addToast(`Loaded destination: ${addr.name} ✦`, 'success');
                      }}
                      style={{
                        padding: '10px 14px',
                        border: '1px solid var(--border-muted)',
                        borderRadius: '8px',
                        backgroundColor: '#ffffff',
                        textAlign: 'left',
                        cursor: 'pointer',
                        minWidth: '180px',
                        flexShrink: 0
                      }}
                    >
                      <div style={{ fontWeight: 800, fontSize: '0.8rem' }}>{addr.name}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-sub)', marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {addr.address}, {addr.city}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <form onSubmit={(e) => { e.preventDefault(); setFunnelStep(3); }} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="form-group">
                <label style={{ fontSize: '0.8rem', fontWeight: 800 }}>Full Name *</label>
                <input 
                  type="text" 
                  required 
                  value={shippingForm.name} 
                  onChange={(e) => setShippingForm({ ...shippingForm, name: e.target.value })}
                  style={{ padding: '12px', border: '1px solid var(--border-muted)', borderRadius: 'var(--radius-xs)', backgroundColor: 'var(--bg-app)', color: 'var(--text-main)', outline: 'none', marginTop: '4px' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label style={{ fontSize: '0.8rem', fontWeight: 800 }}>Email Address *</label>
                  <input 
                    type="email" 
                    required 
                    value={shippingForm.email} 
                    onChange={(e) => setShippingForm({ ...shippingForm, email: e.target.value })}
                    style={{ padding: '12px', border: '1px solid var(--border-muted)', borderRadius: 'var(--radius-xs)', backgroundColor: 'var(--bg-app)', color: 'var(--text-main)', outline: 'none', marginTop: '4px' }}
                  />
                </div>
                <div className="form-group">
                  <label style={{ fontSize: '0.8rem', fontWeight: 800 }}>Contact Phone *</label>
                  <input 
                    type="tel" 
                    required 
                    value={shippingForm.phone} 
                    onChange={(e) => setShippingForm({ ...shippingForm, phone: e.target.value })}
                    style={{ padding: '12px', border: '1px solid var(--border-muted)', borderRadius: 'var(--radius-xs)', backgroundColor: 'var(--bg-app)', color: 'var(--text-main)', outline: 'none', marginTop: '4px' }}
                  />
                </div>
              </div>

              <div className="form-group">
                <label style={{ fontSize: '0.8rem', fontWeight: 800 }}>Street Address *</label>
                <input 
                  type="text" 
                  required 
                  value={shippingForm.address} 
                  onChange={(e) => setShippingForm({ ...shippingForm, address: e.target.value })}
                  style={{ padding: '12px', border: '1px solid var(--border-muted)', borderRadius: 'var(--radius-xs)', backgroundColor: 'var(--bg-app)', color: 'var(--text-main)', outline: 'none', marginTop: '4px' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label style={{ fontSize: '0.8rem', fontWeight: 800 }}>City *</label>
                  <input 
                    type="text" 
                    required 
                    value={shippingForm.city} 
                    onChange={(e) => setShippingForm({ ...shippingForm, city: e.target.value })}
                    style={{ padding: '12px', border: '1px solid var(--border-muted)', borderRadius: 'var(--radius-xs)', backgroundColor: 'var(--bg-app)', color: 'var(--text-main)', outline: 'none', marginTop: '4px' }}
                  />
                </div>
                <div className="form-group">
                  <label style={{ fontSize: '0.8rem', fontWeight: 800 }}>State *</label>
                  <input 
                    type="text" 
                    required 
                    value={shippingForm.state} 
                    onChange={(e) => setShippingForm({ ...shippingForm, state: e.target.value })}
                    style={{ padding: '12px', border: '1px solid var(--border-muted)', borderRadius: 'var(--radius-xs)', backgroundColor: 'var(--bg-app)', color: 'var(--text-main)', outline: 'none', marginTop: '4px' }}
                  />
                </div>
                <div className="form-group">
                  <label style={{ fontSize: '0.8rem', fontWeight: 800 }}>ZIP Code *</label>
                  <input 
                    type="text" 
                    required 
                    value={shippingForm.zip} 
                    onChange={(e) => setShippingForm({ ...shippingForm, zip: e.target.value })}
                    style={{ padding: '12px', border: '1px solid var(--border-muted)', borderRadius: 'var(--radius-xs)', backgroundColor: 'var(--bg-app)', color: 'var(--text-main)', outline: 'none', marginTop: '4px' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setFunnelStep(1)}>
                  <ArrowLeft size={16} /> Back to Cart
                </button>
                <button type="submit" className="btn btn-primary" style={{ backgroundColor: '#fb641b', borderColor: '#fb641b' }}>
                  Proceed to Payment <ArrowRight size={16} />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* STEP 3: PAYMENT GATEWAY CARD FLIP */}
      {funnelStep === 3 && (
        <div style={{ maxWidth: '640px', margin: '0 auto' }}>
          <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--border-muted)', borderRadius: 'var(--radius-sm)', padding: '30px', boxShadow: 'var(--shadow-sm)' }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CreditCard size={22} style={{ color: 'var(--primary-navy)' }} /> SECURE GATEWAY
            </h2>

            {currentUser && currentUser.paymentDetails && currentUser.paymentDetails.length > 0 && (
              <div style={{ marginBottom: '20px', padding: '16px', border: '1.5px dashed var(--accent-gold)', borderRadius: '8px', backgroundColor: 'var(--accent-gold-bg)' }}>
                <label style={{ fontSize: '0.82rem', fontWeight: 900, color: 'var(--primary-navy)', display: 'block', marginBottom: '8px' }}>
                  PAY WITH SAVED CARD
                </label>
                <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '6px', scrollbarWidth: 'none' }}>
                  {currentUser.paymentDetails.map((card) => (
                    <button
                      key={card.id}
                      type="button"
                      onClick={() => {
                        setCardForm({
                          number: card.cardNumber,
                          name: card.cardHolder,
                          expiry: card.expiry,
                          cvv: '•••'
                        });
                        addToast(`Loaded payment card: ${card.cardType} ✦`, 'success');
                      }}
                      style={{
                        padding: '10px 14px',
                        border: '1px solid var(--border-muted)',
                        borderRadius: '8px',
                        backgroundColor: '#ffffff',
                        textAlign: 'left',
                        cursor: 'pointer',
                        minWidth: '180px',
                        flexShrink: 0
                      }}
                    >
                      <div style={{ fontWeight: 800, fontSize: '0.8rem' }}>{card.cardType} Secure</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-sub)', marginTop: '2px' }}>
                        {card.cardNumber}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Credit Card Flip */}
            <div className={`credit-card-flip-container ${cardFlipped ? 'flipped' : ''}`}>
              <div className="credit-card-inner">
                {/* FRONT */}
                <div className="credit-card-front">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--accent-gold)' }}>E-STAR SECURE</div>
                    <span style={{ fontSize: '0.65rem', border: '1px solid var(--accent-gold)', padding: '1px 5px', color: 'var(--accent-gold)', borderRadius: '3px' }}>SANDBOX</span>
                  </div>
                  
                  <div style={{ fontSize: '1.3rem', fontWeight: 700, letterSpacing: '0.12em', margin: '20px 0 10px', fontFamily: 'monospace' }}>
                    {cardForm.number}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <div>
                      <div style={{ fontSize: '0.5rem', color: 'rgba(255,255,255,0.6)' }}>CARDHOLDER</div>
                      <div style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase' }}>{cardForm.name || 'YOUR NAME HERE'}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.5rem', color: 'rgba(255,255,255,0.6)' }}>EXPIRES</div>
                      <div style={{ fontSize: '0.8rem', fontWeight: 700 }}>{cardForm.expiry || 'MM/YY'}</div>
                    </div>
                  </div>
                </div>

                {/* BACK */}
                <div className="credit-card-back">
                  <div className="credit-card-magnetic-strip"></div>
                  
                  <div style={{ textAlign: 'right', marginTop: '10px' }}>
                    <div style={{ fontSize: '0.5rem', color: 'rgba(255,255,255,0.6)', marginRight: '6px' }}>SECURE CVV</div>
                    <div style={{
                      background: 'white',
                      color: 'black',
                      padding: '4px 8px',
                      borderRadius: '3px',
                      fontWeight: 800,
                      fontFamily: 'monospace',
                      display: 'inline-block',
                      width: '50px',
                      textAlign: 'center',
                      marginTop: '4px'
                    }}>
                      {cardForm.cvv}
                    </div>
                  </div>

                  <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.4)', textAlign: 'center' }}>
                    Automated sandbox terminal. No real currency is processed.
                  </div>
                </div>
              </div>
            </div>

            {/* inputs */}
            <form onSubmit={handleCheckoutSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="form-group">
                <label style={{ fontSize: '0.8rem', fontWeight: 800 }}>Card Number</label>
                <input 
                  type="text" 
                  required 
                  maxLength="19"
                  placeholder="e.g. 4111 2222 3333 4444"
                  style={{ padding: '12px', border: '1px solid var(--border-muted)', borderRadius: 'var(--radius-xs)', backgroundColor: 'var(--bg-app)', color: 'var(--text-main)', outline: 'none', fontFamily: 'monospace', marginTop: '4px' }}
                  onFocus={() => setCardFlipped(false)}
                  onChange={(e) => setCardForm({ ...cardForm, number: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label style={{ fontSize: '0.8rem', fontWeight: 800 }}>Cardholder Name</label>
                <input 
                  type="text" 
                  required 
                  placeholder="e.g. RAHUL SHARMA"
                  style={{ padding: '12px', border: '1px solid var(--border-muted)', borderRadius: 'var(--radius-xs)', backgroundColor: 'var(--bg-app)', color: 'var(--text-main)', outline: 'none', marginTop: '4px' }}
                  onFocus={() => setCardFlipped(false)}
                  onChange={(e) => setCardForm({ ...cardForm, name: e.target.value.toUpperCase() })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label style={{ fontSize: '0.8rem', fontWeight: 800 }}>Expiration Date</label>
                  <input 
                    type="text" 
                    required 
                    maxLength="5"
                    placeholder="MM/YY"
                    style={{ padding: '12px', border: '1px solid var(--border-muted)', borderRadius: 'var(--radius-xs)', backgroundColor: 'var(--bg-app)', color: 'var(--text-main)', outline: 'none', marginTop: '4px' }}
                    onFocus={() => setCardFlipped(false)}
                    onChange={(e) => setCardForm({ ...cardForm, expiry: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label style={{ fontSize: '0.8rem', fontWeight: 800 }}>CVV Code</label>
                  <input 
                    type="password" 
                    required 
                    maxLength="3"
                    placeholder="123"
                    style={{ padding: '12px', border: '1px solid var(--border-muted)', borderRadius: 'var(--radius-xs)', backgroundColor: 'var(--bg-app)', color: 'var(--text-main)', outline: 'none', fontFamily: 'monospace', marginTop: '4px' }}
                    onFocus={() => setCardFlipped(true)}
                    onBlur={() => setCardFlipped(false)}
                    onChange={(e) => setCardForm({ ...cardForm, cvv: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setFunnelStep(2)}>
                  <ArrowLeft size={16} /> Back
                </button>
                <button type="submit" className="btn btn-primary" style={{ gap: '6px', backgroundColor: '#fb641b', borderColor: '#fb641b' }}>
                  <Lock size={14} /> Pay ₹{Math.round(total).toLocaleString('en-IN')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* STEP 4: SUCCESS */}
      {funnelStep === 4 && successOrderInfo && (
        <div style={{ maxWidth: '600px', margin: '40px auto' }}>
          <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--border-muted)', borderRadius: 'var(--radius-sm)', padding: '50px 30px', boxShadow: 'var(--shadow-sm)', textAlign: 'center' }}>
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              backgroundColor: 'var(--success-bg)',
              color: 'var(--success)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px'
            }}>
              <CheckCircle size={32} />
            </div>

            <span style={{ fontSize: '0.8rem', color: 'var(--success)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Order Complete</span>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800, margin: '8px 0 12px' }}>Order Placed Successfully!</h1>
            
            <p style={{ color: 'var(--text-sub)', fontSize: '0.9rem', marginBottom: '24px' }}>
              Your express sandbox checkout order has been validated. Delivery details are routed directly to your tracking dashboard.
            </p>

            {/* Receipt details */}
            <div style={{
              backgroundColor: 'var(--bg-app)',
              border: '1px dashed var(--border-muted)',
              borderRadius: 'var(--radius-sm)',
              padding: '20px',
              textAlign: 'left',
              fontSize: '0.88rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
              marginBottom: '30px'
            }}>
              <div>Ticket Reference: <span style={{ fontWeight: 800, color: 'var(--primary-navy)' }}>#{successOrderInfo.id}</span></div>
              <div>Date Stamp: <span style={{ fontWeight: 700 }}>{successOrderInfo.timestamp}</span></div>
              <div>Total Amount paid: <span style={{ fontWeight: 800 }}>₹{Math.round(successOrderInfo.total).toLocaleString('en-IN')}</span></div>
              <div style={{ borderTop: '1px solid var(--border-muted)', marginTop: '8px', paddingTop: '8px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Fulfillment Target: {successOrderInfo.customer.address}, {successOrderInfo.customer.city}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button className="btn btn-secondary" style={{ flexGrow: 1 }} onClick={() => { setCurrentPage('account'); window.scrollTo({ top: 0 }); }}>
                Track Order
              </button>
              <button className="btn btn-primary" style={{ flexGrow: 1 }} onClick={() => { setCurrentPage('shop'); window.scrollTo({ top: 0 }); }}>
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
