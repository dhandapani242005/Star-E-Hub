import React, { useState } from 'react';
import { 
  LuUser as User, 
  LuMapPin as MapPin, 
  LuMail as Mail, 
  LuPhone as Phone, 
  LuPackageCheck as PackageCheck, 
  LuClock as Clock, 
  LuTrendingUp as TrendingUp,
  LuAward as Award,
  LuChevronRight as ChevronRight,
  LuShieldAlert as ShieldAlert,
  LuStar as Star,
  LuCreditCard as CreditCard,
  LuTrash2 as Trash,
  LuPlus as Plus
} from 'react-icons/lu';

export default function CustomerAccount({
  orders,
  setCurrentPage,
  currentUser = null,
  onUpdateProfile
}) {
  const [activeTab, setActiveTab] = useState('orders'); // 'orders', 'profile', 'addresses', 'payments'
  const [selectedOrderIndex, setSelectedOrderIndex] = useState(0);

  // Profile Form States
  const [profileName, setProfileName] = useState(currentUser?.name || '');
  const [profilePhone, setProfilePhone] = useState(currentUser?.phone || '');
  const [profileCity, setProfileCity] = useState(currentUser?.city || '');

  // Address Form State
  const [addressForm, setAddressForm] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: ''
  });

  // Credit Card Form State
  const [cardForm, setCardForm] = useState({
    cardHolder: '',
    cardNumber: '',
    expiry: '',
    cardType: 'Visa'
  });

  const handleUpdateInfo = (e) => {
    e.preventDefault();
    if (onUpdateProfile) {
      onUpdateProfile({
        name: profileName,
        phone: profilePhone,
        city: profileCity
      });
    }
  };

  const handleAddAddress = (e) => {
    e.preventDefault();
    if (!addressForm.address || !addressForm.city || !addressForm.name) return;
    
    const updated = [
      ...(currentUser?.addresses || []),
      { ...addressForm, id: `addr-${Date.now()}` }
    ];

    if (onUpdateProfile) {
      onUpdateProfile({ addresses: updated });
    }

    setAddressForm({
      name: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      zip: ''
    });
  };

  const handleDeleteAddress = (id) => {
    const updated = (currentUser?.addresses || []).filter(item => item.id !== id);
    if (onUpdateProfile) {
      onUpdateProfile({ addresses: updated });
    }
  };

  const handleAddCard = (e) => {
    e.preventDefault();
    if (!cardForm.cardNumber || !cardForm.expiry) return;

    // Mask card digits for security
    const trimmed = cardForm.cardNumber.replace(/\s?/g, '');
    const masked = `•••• •••• •••• ${trimmed.slice(-4)}`;

    const updated = [
      ...(currentUser?.paymentDetails || []),
      { ...cardForm, cardNumber: masked, id: `card-${Date.now()}` }
    ];

    if (onUpdateProfile) {
      onUpdateProfile({ paymentDetails: updated });
    }

    setCardForm({
      cardHolder: '',
      cardNumber: '',
      expiry: '',
      cardType: 'Visa'
    });
  };

  const handleDeleteCard = (id) => {
    const updated = (currentUser?.paymentDetails || []).filter(item => item.id !== id);
    if (onUpdateProfile) {
      onUpdateProfile({ paymentDetails: updated });
    }
  };

  // Loyalty calculations based on completed transaction totals
  const totalSpent = orders.reduce((sum, order) => sum + order.total, 0);
  const loyaltyPoints = Math.round(totalSpent / 10); // 1 point per 10 INR

  let tier = 'Bronze Elite';
  let tierColor = '#b45309';
  if (loyaltyPoints >= 5000) {
    tier = 'Platinum Ultimate';
    tierColor = '#2563eb';
  } else if (loyaltyPoints >= 2000) {
    tier = 'Gold Executive';
    tierColor = '#2563eb';
  } else if (loyaltyPoints >= 500) {
    tier = 'Silver Premium';
    tierColor = '#64748b';
  }

  // Get active tracking timeline nodes
  const getTimelineStatus = (status) => {
    const statuses = ['Pending', 'Processing', 'Shipped', 'Delivered'];
    const activeIndex = statuses.indexOf(status);
    return {
      pending: activeIndex >= 0,
      processing: activeIndex >= 1,
      shipped: activeIndex >= 2,
      delivered: activeIndex >= 3
    };
  };

  const selectedOrder = orders[selectedOrderIndex];

  return (
    <div className="main-content-layout" style={{ animation: 'fadeIn 0.5s ease-out', paddingBottom: '60px', marginTop: '20px' }}>
      <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '20px' }}>My Account</h1>

      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '30px' }}>
        {/* Left Side Profile & Navigation Links */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Profile Card */}
          <div style={{
            backgroundColor: '#ffffff',
            border: '1px solid var(--border-muted)',
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <div style={{
              padding: '24px',
              textAlign: 'center',
              background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
              color: '#ffffff'
            }}>
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255,255,255,0.25)',
                color: '#ffffff',
                fontSize: '1.6rem',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 12px',
                border: '2px solid rgba(255,255,255,0.5)'
              }}>
                {(currentUser?.name || 'G').charAt(0).toUpperCase()}
              </div>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff', marginBottom: '6px' }}>
                {currentUser?.name || 'Guest User'}
              </h2>
              <span style={{ fontSize: '0.65rem', backgroundColor: 'rgba(255,255,255,0.2)', color: '#ffffff', padding: '2px 10px', borderRadius: '99px', fontWeight: 700, border: '1px solid rgba(255,255,255,0.35)' }}>
                ✦ E-STAR MEMBER
              </span>
            </div>

            {/* Profile fields preview */}
            <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.85rem', color: 'var(--text-sub)' }}>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <Mail size={15} style={{ color: 'var(--text-muted)' }} />
                <span>{currentUser?.email || 'guest@estar.com'}</span>
              </div>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <Phone size={15} style={{ color: 'var(--text-muted)' }} />
                <span>{currentUser?.phone || 'No phone set'}</span>
              </div>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <MapPin size={15} style={{ color: 'var(--text-muted)' }} />
                <span>{currentUser?.city || 'No city set'}</span>
              </div>
            </div>
          </div>

          {/* Account Tabs Selection Menu */}
          <div style={{
            backgroundColor: '#ffffff',
            border: '1px solid var(--border-muted)',
            borderRadius: '12px',
            padding: '8px',
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px'
          }}>
            {[
              { id: 'orders', label: 'My Orders', icon: <PackageCheck size={18} /> },
              { id: 'profile', label: 'Profile Information', icon: <User size={18} /> },
              { id: 'addresses', label: 'Manage Addresses', icon: <MapPin size={18} /> },
              { id: 'payments', label: 'Payment Methods', icon: <CreditCard size={18} /> }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  width: '100%',
                  border: 'none',
                  borderRadius: '8px',
                  background: activeTab === tab.id ? 'rgba(37, 99, 235, 0.08)' : 'transparent',
                  color: activeTab === tab.id ? '#2563eb' : 'var(--text-main)',
                  fontWeight: activeTab === tab.id ? 800 : 600,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s ease'
                }}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Rewards SuperCoins Card */}
          <div style={{
            backgroundColor: '#ffffff',
            border: '1px solid var(--border-muted)',
            borderRadius: '12px',
            padding: '20px',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <h3 style={{ fontSize: '0.85rem', fontWeight: 800, marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
              <TrendingUp size={16} style={{ color: '#2563eb' }} /> Rewards Center
            </h3>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '12px 0' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: 'rgba(212, 163, 89, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#f59e0b'
              }}>
                <Star size={16} fill="currentColor" />
              </div>
              <div>
                <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#0f172a', lineHeight: '1' }}>
                  {loyaltyPoints}
                </div>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>SuperCoins Earned</div>
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--border-muted)', paddingTop: '10px', marginTop: '10px', fontSize: '0.78rem' }}>
              <div>Active Tier Level: <span style={{ fontWeight: 800, color: tierColor }}>{tier}</span></div>
              <p style={{ color: 'var(--text-muted)', marginTop: '4px' }}>Coins accumulate with every sandbox transaction completed.</p>
            </div>
          </div>
        </aside>

        {/* Right Side Switch Panel */}
        <section style={{ backgroundColor: '#ffffff', border: '1px solid var(--border-muted)', borderRadius: '12px', padding: '30px', boxShadow: 'var(--shadow-sm)', minHeight: '400px' }}>
          
          {/* TAB 1: MY ORDERS */}
          {activeTab === 'orders' && (
            <div>
              {orders.length === 0 ? (
                <div style={{
                  padding: '60px 20px',
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '16px'
                }}>
                  <PackageCheck size={50} style={{ color: 'var(--text-muted)' }} />
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>No transaction logs recorded</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', maxWidth: '400px' }}>Place an express purchase to see carrier tracking timeline updates.</p>
                  <button className="btn btn-primary btn-sm" onClick={() => setCurrentPage('shop')}>
                    Explore Catalog
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  
                  {/* Order selector bar */}
                  {orders.length > 1 && (
                    <div style={{
                      display: 'flex',
                      gap: '8px',
                      overflowX: 'auto',
                      scrollbarWidth: 'none',
                      borderBottom: '1px solid var(--border-muted)',
                      paddingBottom: '12px'
                    }}>
                      {orders.map((order, idx) => (
                        <button
                          key={order.id}
                          onClick={() => { setSelectedOrderIndex(idx); }}
                          style={{
                            border: selectedOrderIndex === idx ? '1px solid #2563eb' : '1px solid var(--border-muted)',
                            background: selectedOrderIndex === idx ? 'rgba(37, 99, 235, 0.05)' : '#ffffff',
                            color: selectedOrderIndex === idx ? '#2563eb' : 'var(--text-main)',
                            padding: '6px 14px',
                            borderRadius: '8px',
                            fontSize: '0.8rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          Order #{order.id}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Order Tracking & Status */}
                  {selectedOrder && (
                    <div>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        borderBottom: '1px solid var(--border-muted)',
                        paddingBottom: '16px',
                        marginBottom: '24px',
                        flexWrap: 'wrap',
                        gap: '12px'
                      }}>
                        <div>
                          <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Order ID: #{selectedOrder.id}</h3>
                          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Date: {selectedOrder.timestamp}</span>
                        </div>

                        <div style={{
                          backgroundColor: 'var(--flipkart-green-bg)',
                          color: 'var(--flipkart-green)',
                          fontWeight: 800,
                          fontSize: '0.85rem',
                          padding: '6px 14px',
                          borderRadius: '6px',
                          border: '1px solid rgba(56, 142, 60, 0.2)'
                        }}>
                          STATUS: {selectedOrder.status.toUpperCase()}
                        </div>
                      </div>

                      {/* Timeline */}
                      <h4 style={{ fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '24px' }}>
                        Delivery Timeline
                      </h4>

                      {(() => {
                        const statusVal = getTimelineStatus(selectedOrder.status);
                        return (
                          <div className="tracking-timeline" style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            position: 'relative',
                            marginBottom: '40px',
                            padding: '0 10px'
                          }}>
                            <div style={{
                              position: 'absolute',
                              top: '12px',
                              left: '40px',
                              right: '40px',
                              height: '4px',
                              backgroundColor: '#e2e8f0',
                              zIndex: 1
                            }}>
                              <div style={{
                                height: '100%',
                                backgroundColor: 'var(--flipkart-green)',
                                width: selectedOrder.status === 'Pending' ? '0%' :
                                       selectedOrder.status === 'Processing' ? '33.3%' :
                                       selectedOrder.status === 'Shipped' ? '66.6%' : '100%',
                                transition: 'width 0.4s ease'
                              }} />
                            </div>

                            {[
                              { id: 'pending', label: 'Ordered', done: statusVal.pending },
                              { id: 'processing', label: 'Processing', done: statusVal.processing },
                              { id: 'shipped', label: 'Shipped', done: statusVal.shipped },
                              { id: 'delivered', label: 'Delivered', done: statusVal.delivered }
                            ].map((node) => (
                              <div key={node.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 2, position: 'relative', width: '80px' }}>
                                <div style={{
                                  width: '28px',
                                  height: '28px',
                                  borderRadius: '50%',
                                  backgroundColor: node.done ? 'var(--flipkart-green)' : '#ffffff',
                                  border: node.done ? '2px solid var(--flipkart-green)' : '2px solid #cbd5e1',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  color: node.done ? '#ffffff' : '#94a3b8',
                                  fontSize: '0.72rem',
                                  fontWeight: 900
                                }}>
                                  {node.done ? '✓' : ''}
                                </div>
                                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: node.done ? 'var(--text-main)' : 'var(--text-muted)', marginTop: '8px', textAlign: 'center' }}>
                                  {node.label}
                                </span>
                              </div>
                            ))}
                          </div>
                        );
                      })()}

                      {/* Items details */}
                      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '30px', borderTop: '1px solid var(--border-muted)', paddingTop: '24px' }}>
                        <div>
                          <h4 style={{ fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '14px' }}>
                            Item Details
                          </h4>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {selectedOrder.items.map(item => {
                              const itemPrice = item.price * (1 - (item.offer || 0) / 100);
                              return (
                                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem' }}>
                                  <span style={{ color: 'var(--text-sub)' }}>{item.quantity}x {item.name}</span>
                                  <span style={{ fontWeight: 700 }}>₹{Math.round(itemPrice * item.quantity).toLocaleString('en-IN')}</span>
                                </div>
                              );
                            })}
                          </div>

                          <div style={{
                            marginTop: '16px',
                            paddingTop: '12px',
                            borderTop: '1px solid #f1f5f9',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '6px',
                            fontSize: '0.85rem',
                            alignItems: 'flex-end'
                          }}>
                            <div>Subtotal: ₹{Math.round(selectedOrder.subtotal).toLocaleString('en-IN')}</div>
                            {selectedOrder.promoDiscount > 0 && (
                              <div style={{ color: 'var(--flipkart-green)', fontWeight: 700 }}>
                                Coupon discount: -₹{Math.round(selectedOrder.promoDiscount).toLocaleString('en-IN')}
                              </div>
                            )}
                            <div style={{ fontWeight: 800, fontSize: '1.1rem', marginTop: '6px', color: '#0f172a' }}>
                              Total Paid: ₹{Math.round(selectedOrder.total).toLocaleString('en-IN')}
                            </div>
                          </div>
                        </div>

                        <div style={{ borderLeft: '1px solid var(--border-muted)', paddingLeft: '24px' }}>
                          <h4 style={{ fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '14px' }}>
                            Fulfillment Address
                          </h4>
                          <div style={{ fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            <div style={{ fontWeight: 800 }}>{selectedOrder.customer.name}</div>
                            <div>Email: {selectedOrder.customer.email}</div>
                            <div>Phone: {selectedOrder.customer.phone}</div>
                            <div style={{ marginTop: '10px', color: 'var(--text-sub)', lineHeight: '1.4' }}>
                              {selectedOrder.customer.address}, {selectedOrder.customer.city}, {selectedOrder.customer.state} {selectedOrder.customer.zip}
                            </div>
                          </div>
                        </div>
                      </div>

                    </div>
                  )}

                </div>
              )}
            </div>
          )}

          {/* TAB 2: PROFILE INFORMATION */}
          {activeTab === 'profile' && (
            <div>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '8px' }}>Profile Details</h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '24px' }}>Keep your account contact information up to date.</p>

              <form onSubmit={handleUpdateInfo} style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '500px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 800, color: '#2563eb' }}>Full Name</label>
                  <input
                    type="text"
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    required
                    style={{ padding: '12px', border: '1px solid var(--border-muted)', borderRadius: '8px', outline: 'none' }}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 800, color: '#2563eb' }}>Contact Phone</label>
                  <input
                    type="tel"
                    placeholder="e.g. +91 98765 43210"
                    value={profilePhone}
                    onChange={(e) => setProfilePhone(e.target.value)}
                    style={{ padding: '12px', border: '1px solid var(--border-muted)', borderRadius: '8px', outline: 'none' }}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 800, color: '#2563eb' }}>Current City</label>
                  <input
                    type="text"
                    placeholder="e.g. Mumbai, India"
                    value={profileCity}
                    onChange={(e) => setProfileCity(e.target.value)}
                    style={{ padding: '12px', border: '1px solid var(--border-muted)', borderRadius: '8px', outline: 'none' }}
                  />
                </div>

                <button type="submit" className="btn btn-primary" style={{ padding: '12px', alignSelf: 'flex-start', minWidth: '150px' }}>
                  Save Profile
                </button>
              </form>
            </div>
          )}

          {/* TAB 3: MANAGE ADDRESSES */}
          {activeTab === 'addresses' && (
            <div>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '8px' }}>Saved Delivery Addresses</h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '24px' }}>Add and manage shipping destinations for faster checkouts.</p>

              {/* Saved Address list */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
                {(currentUser?.addresses || []).length === 0 ? (
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', italic: 'true' }}>No shipping addresses saved yet.</p>
                ) : (
                  (currentUser.addresses).map(addr => (
                    <div
                      key={addr.id}
                      style={{
                        padding: '16px 20px',
                        border: '1px solid var(--border-muted)',
                        borderRadius: '10px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#0f172a', marginBottom: '4px' }}>{addr.name}</div>
                        <div style={{ fontSize: '0.82rem', color: 'var(--text-sub)', marginBottom: '2px' }}>Phone: {addr.phone}</div>
                        <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                          {addr.address}, {addr.city}, {addr.state} {addr.zip}
                        </div>
                      </div>

                      <button
                        onClick={() => handleDeleteAddress(addr.id)}
                        style={{
                          border: 'none',
                          background: 'rgba(239, 68, 68, 0.08)',
                          color: '#ef4444',
                          width: '36px',
                          height: '36px',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <Trash size={16} />
                      </button>
                    </div>
                  ))
                )}
              </div>

              {/* Add address form */}
              <div style={{ borderTop: '1px solid var(--border-muted)', paddingTop: '24px' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Plus size={18} /> Add New Address
                </h3>

                <form onSubmit={handleAddAddress} style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '600px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontSize: '0.8rem', fontWeight: 800 }}>Full Name *</label>
                      <input
                        type="text"
                        required
                        value={addressForm.name}
                        onChange={e => setAddressForm({ ...addressForm, name: e.target.value })}
                        style={{ padding: '10px', border: '1px solid var(--border-muted)', borderRadius: '8px', outline: 'none' }}
                      />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontSize: '0.8rem', fontWeight: 800 }}>Contact Phone *</label>
                      <input
                        type="tel"
                        required
                        value={addressForm.phone}
                        onChange={e => setAddressForm({ ...addressForm, phone: e.target.value })}
                        style={{ padding: '10px', border: '1px solid var(--border-muted)', borderRadius: '8px', outline: 'none' }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: 800 }}>Street Address *</label>
                    <input
                      type="text"
                      required
                      value={addressForm.address}
                      onChange={e => setAddressForm({ ...addressForm, address: e.target.value })}
                      style={{ padding: '10px', border: '1px solid var(--border-muted)', borderRadius: '8px', outline: 'none' }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr 1fr', gap: '16px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontSize: '0.8rem', fontWeight: 800 }}>City *</label>
                      <input
                        type="text"
                        required
                        value={addressForm.city}
                        onChange={e => setAddressForm({ ...addressForm, city: e.target.value })}
                        style={{ padding: '10px', border: '1px solid var(--border-muted)', borderRadius: '8px', outline: 'none' }}
                      />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontSize: '0.8rem', fontWeight: 800 }}>State *</label>
                      <input
                        type="text"
                        required
                        value={addressForm.state}
                        onChange={e => setAddressForm({ ...addressForm, state: e.target.value })}
                        style={{ padding: '10px', border: '1px solid var(--border-muted)', borderRadius: '8px', outline: 'none' }}
                      />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontSize: '0.8rem', fontWeight: 800 }}>ZIP Code *</label>
                      <input
                        type="text"
                        required
                        value={addressForm.zip}
                        onChange={e => setAddressForm({ ...addressForm, zip: e.target.value })}
                        style={{ padding: '10px', border: '1px solid var(--border-muted)', borderRadius: '8px', outline: 'none' }}
                      />
                    </div>
                  </div>

                  <button type="submit" className="btn btn-primary" style={{ padding: '12px', alignSelf: 'flex-start', minWidth: '150px' }}>
                    Add Destination
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* TAB 4: SECURE PAYMENT CARDS */}
          {activeTab === 'payments' && (
            <div>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '8px' }}>Saved Payment Cards</h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '24px' }}>Save simulated credit or debit cards for checkout automation.</p>

              {/* Cards grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px', marginBottom: '32px' }}>
                {(currentUser?.paymentDetails || []).length === 0 ? (
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', italic: 'true' }}>No cards registered yet.</p>
                ) : (
                  (currentUser.paymentDetails).map(card => (
                    <div
                      key={card.id}
                      style={{
                        padding: '20px',
                        background: 'linear-gradient(135deg, #1e40af 0%, #2563eb 100%)',
                        color: '#ffffff',
                        borderRadius: '12px',
                        boxShadow: '0 8px 24px rgba(37,99,235,0.3)',
                        position: 'relative',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        height: '160px'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                          <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'rgba(255,255,255,0.85)' }}>{card.cardType.toUpperCase()} SECURE</div>
                          <span style={{ fontSize: '0.55rem', border: '1px solid rgba(255,255,255,0.4)', padding: '1px 4px', color: 'rgba(255,255,255,0.7)', borderRadius: '3px', marginTop: '2px', display: 'inline-block' }}>CARD PROFILE</span>
                        </div>

                        <button
                          onClick={() => handleDeleteCard(card.id)}
                          style={{
                            border: 'none',
                            background: 'rgba(255, 255, 255, 0.1)',
                            color: '#ffffff',
                            width: '28px',
                            height: '28px',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <Trash size={14} />
                        </button>
                      </div>

                      <div style={{ fontSize: '1.25rem', fontFamily: 'monospace', letterSpacing: '0.08em', margin: '14px 0 6px' }}>
                        {card.cardNumber}
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem' }}>
                        <div>
                          <div style={{ fontSize: '0.5rem', color: 'rgba(255,255,255,0.5)' }}>CARDHOLDER</div>
                          <div style={{ fontWeight: 700, textTransform: 'uppercase' }}>{card.cardHolder || 'JOHNATHAN DOE'}</div>
                        </div>
                        <div>
                          <div style={{ fontSize: '0.5rem', color: 'rgba(255,255,255,0.5)' }}>EXPIRES</div>
                          <div style={{ fontWeight: 700 }}>{card.expiry}</div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Add card form */}
              <div style={{ borderTop: '1px solid var(--border-muted)', paddingTop: '24px' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Plus size={18} /> Register Payment Card
                </h3>

                <form onSubmit={handleAddCard} style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '400px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: 800 }}>Cardholder Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. John Doe"
                      value={cardForm.cardHolder}
                      onChange={e => setCardForm({ ...cardForm, cardHolder: e.target.value })}
                      style={{ padding: '10px', border: '1px solid var(--border-muted)', borderRadius: '8px', outline: 'none' }}
                    />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: 800 }}>Card Number *</label>
                    <input
                      type="text"
                      required
                      maxLength="19"
                      placeholder="4111 2222 3333 4444"
                      value={cardForm.cardNumber}
                      onChange={e => setCardForm({ ...cardForm, cardNumber: e.target.value })}
                      style={{ padding: '10px', border: '1px solid var(--border-muted)', borderRadius: '8px', outline: 'none' }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontSize: '0.8rem', fontWeight: 800 }}>Expiry (MM/YY) *</label>
                      <input
                        type="text"
                        required
                        maxLength="5"
                        placeholder="12/28"
                        value={cardForm.expiry}
                        onChange={e => setCardForm({ ...cardForm, expiry: e.target.value })}
                        style={{ padding: '10px', border: '1px solid var(--border-muted)', borderRadius: '8px', outline: 'none' }}
                      />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontSize: '0.8rem', fontWeight: 800 }}>Card Brand *</label>
                      <select
                        value={cardForm.cardType}
                        onChange={e => setCardForm({ ...cardForm, cardType: e.target.value })}
                        style={{ padding: '10px', border: '1px solid var(--border-muted)', borderRadius: '8px', outline: 'none', background: '#ffffff' }}
                      >
                        <option value="Visa">Visa</option>
                        <option value="Mastercard">Mastercard</option>
                        <option value="Rupay">RuPay</option>
                        <option value="Amex">American Express</option>
                      </select>
                    </div>
                  </div>

                  <button type="submit" className="btn btn-primary" style={{ padding: '12px', alignSelf: 'flex-start', minWidth: '150px' }}>
                    Register Card
                  </button>
                </form>
              </div>
            </div>
          )}

        </section>
      </div>
    </div>
  );
}
