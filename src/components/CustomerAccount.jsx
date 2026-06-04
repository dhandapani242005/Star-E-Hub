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
  LuStar as Star
} from 'react-icons/lu';

export default function CustomerAccount({
  orders,
  setCurrentPage,
  currentUser = null
}) {
  const [selectedOrderIndex, setSelectedOrderIndex] = useState(0);

  // Profile Simulated Info
  const customerInfo = {
    name: currentUser ? currentUser.name : 'Guest User',
    email: currentUser ? currentUser.email : 'guest@estar.com',
    phone: '+91 98765 43210',
    city: 'Mumbai, India',
    joined: currentUser?.createdAt ? new Date(currentUser.createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }) : 'Jun 2026'
  };

  // Loyalty calculations based on completed transaction totals
  const totalSpent = orders.reduce((sum, order) => sum + order.total, 0);
  const loyaltyPoints = Math.round(totalSpent); // 1 point per $

  let tier = 'Bronze Elite';
  let tierColor = '#b45309'; // amber
  if (loyaltyPoints >= 1000) {
    tier = 'Platinum Ultimate';
    tierColor = 'var(--flipkart-blue)'; // blue
  } else if (loyaltyPoints >= 500) {
    tier = 'Gold Executive';
    tierColor = 'var(--accent-gold)'; // yellow
  } else if (loyaltyPoints >= 200) {
    tier = 'Silver Premium';
    tierColor = '#64748b'; // slate
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

      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '20px' }}>
        {/* Left Side Profile & Loyalty */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Profile Card */}
          <div style={{
            backgroundColor: '#ffffff',
            border: '1px solid var(--border-muted)',
            borderRadius: 'var(--radius-sm)',
            overflow: 'hidden',
            boxShadow: 'var(--shadow-sm)'
          }}>
            {/* Header info */}
            <div style={{
              padding: '24px',
              textAlign: 'center',
              backgroundColor: 'var(--primary-navy)',
              color: '#ffffff',
              borderBottom: '1px solid var(--border-muted)'
            }}>
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                backgroundColor: 'var(--accent-gold)',
                color: 'var(--primary-navy)',
                fontSize: '1.6rem',
                fontWeight: 900,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 12px',
                border: '2px solid #ffffff'
              }}>
                {customerInfo.name.charAt(0).toUpperCase()}
              </div>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff', marginBottom: '6px' }}>{customerInfo.name}</h2>
              
              <span className="assured-badge" style={{ fontSize: '0.65rem' }}>
                ✦ E-Star Plus Member
              </span>
            </div>

            {/* Profile fields */}
            <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.85rem', color: 'var(--text-sub)' }}>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <Mail size={15} style={{ color: 'var(--text-muted)' }} />
                <span>{customerInfo.email}</span>
              </div>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <Phone size={15} style={{ color: 'var(--text-muted)' }} />
                <span>{customerInfo.phone}</span>
              </div>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <MapPin size={15} style={{ color: 'var(--text-muted)' }} />
                <span>{customerInfo.city}</span>
              </div>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', borderTop: '1px solid var(--border-muted)', paddingTop: '12px', marginTop: '4px' }}>
                <Award size={15} style={{ color: 'var(--accent-gold)' }} />
                <span>Access Privilege: <strong style={{ color: 'var(--accent-gold)', textTransform: 'uppercase' }}>{currentUser?.role || 'Guest'}</strong></span>
              </div>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', borderTop: '1px solid var(--border-muted)', paddingTop: '12px', marginTop: '4px', fontSize: '0.78rem' }}>
                <Clock size={14} style={{ color: 'var(--text-muted)' }} />
                <span>Customer since {customerInfo.joined}</span>
              </div>
            </div>
          </div>

          {/* Flipkart Plus SuperCoins Card */}
          <div style={{
            backgroundColor: '#ffffff',
            border: '1px solid var(--border-muted)',
            borderRadius: 'var(--radius-sm)',
            padding: '20px',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <h3 style={{ fontSize: '0.9rem', fontWeight: 800, marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
              <TrendingUp size={16} style={{ color: 'var(--accent-gold)' }} /> Rewards Center
            </h3>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '12px 0' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: 'var(--accent-gold-bg)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent-gold)'
              }}>
                <Star size={16} fill="currentColor" />
              </div>
              <div>
                <div style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--primary-navy)', lineHeight: '1' }}>
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

        {/* Right Side Order Tracking Panel */}
        <section>
          {orders.length === 0 ? (
            <div style={{
              backgroundColor: '#ffffff',
              border: '1px solid var(--border-muted)',
              borderRadius: 'var(--radius-sm)',
              padding: '60px 20px',
              boxShadow: 'var(--shadow-sm)',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '16px'
            }}>
              <PackageCheck size={50} style={{ color: 'var(--text-muted)' }} />
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>No transaction logs recorded</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', maxWidth: '400px' }}>Place an express purchase to see carrier tracking timeline nodes updates.</p>
              <button className="btn btn-primary btn-sm" onClick={() => setCurrentPage('shop')}>
                Explore Catalog
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              {/* Order selector bar if multiple exist */}
              {orders.length > 1 && (
                <div style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid var(--border-muted)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '12px 20px',
                  display: 'flex',
                  gap: '8px',
                  overflowX: 'auto',
                  scrollbarWidth: 'none',
                  boxShadow: 'var(--shadow-sm)'
                }}>
                  {orders.map((order, idx) => (
                    <button
                      key={order.id}
                      onClick={() => setSelectedOrderIndex(idx)}
                      style={{
                        border: '1px solid var(--border-muted)',
                        background: selectedOrderIndex === idx ? 'var(--primary-navy)' : '#ffffff',
                        color: selectedOrderIndex === idx ? '#ffffff' : 'var(--text-main)',
                        padding: '6px 14px',
                        borderRadius: 'var(--radius-xs)',
                        fontFamily: 'var(--font-sans)',
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

              {/* Order Details Panel */}
              {selectedOrder && (
                <div style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid var(--border-muted)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '30px',
                  boxShadow: 'var(--shadow-sm)'
                }}>
                  
                  {/* Status header */}
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
                      borderRadius: 'var(--radius-xs)',
                      border: '1px solid rgba(56, 142, 60, 0.2)'
                    }}>
                      STATUS: {selectedOrder.status.toUpperCase()}
                    </div>
                  </div>

                  {/* Horizontal Timeline Tracker */}
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
                        {/* Connecting track line */}
                        <div style={{
                          position: 'absolute',
                          top: '12px',
                          left: '40px',
                          right: '40px',
                          height: '4px',
                          backgroundColor: '#e0e0e0',
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

                        {/* Nodes */}
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
                              border: node.done ? '2px solid var(--flipkart-green)' : '2px solid #bdbdbd',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: node.done ? '#ffffff' : '#9e9e9e',
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

                  {/* Summary grid */}
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
                        borderTop: '1px solid #f0f0f0',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '6px',
                        fontSize: '0.85rem',
                        alignItems: 'flex-end'
                      }}>
                        <div>Subtotal: ₹{Math.round(selectedOrder.subtotal).toLocaleString('en-IN')}</div>
                        {selectedOrder.promoDiscount > 0 && (
                          <div style={{ color: 'var(--flipkart-green)', fontWeight: 700 }}>
                            Coupon applied ({selectedOrder.promoApplied}): -₹{Math.round(selectedOrder.promoDiscount).toLocaleString('en-IN')}
                          </div>
                        )}
                        <div style={{ fontWeight: 800, fontSize: '1.1rem', marginTop: '6px', color: 'var(--primary-navy)' }}>
                          Total Amount Paid: ₹{Math.round(selectedOrder.total).toLocaleString('en-IN')}
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
        </section>
      </div>
    </div>
  );
}
