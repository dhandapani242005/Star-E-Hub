import React, { useState } from 'react';
import {
  LuShoppingCart as ShoppingCart,
  LuUser as User,
  LuLock as Lock,
  LuMenu as Menu,
  LuX as X,
  LuSearch as Search,
  LuHeart as Heart,
  LuTruck as Truck,
  LuHeadphones as Support,
  LuChevronDown as ChevronDown,
  LuLayoutGrid as Grid,
  LuHouse as Home,
  LuTag as Tag
} from 'react-icons/lu';

export function LogoIcon() {
  return (
    <div style={{
      width: 36, height: 36,
      background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
      borderRadius: 8,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      boxShadow: '0 2px 8px rgba(37,99,235,0.3)'
    }}>
      <ShoppingCart size={20} color="#fff" />
    </div>
  );
}

const NAV_LINKS = [
  { id: 'home', label: 'Home' },
  { id: 'shop', label: 'Shop' },
];

export default function Navbar({
  currentPage,
  setCurrentPage,
  cartCount,
  darkMode,
  toggleDarkMode,
  searchTerm = '',
  setSearchTerm = () => {},
  wishlistCount = 0,
  setSelectedCategory = () => {},
  currentUser = null,
  onLogout = () => {}
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdown, setUserDropdown] = useState(false);

  const handleNav = (page) => {
    setCurrentPage(page);
    setMobileMenuOpen(false);
    setUserDropdown(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleWishlistNav = () => {
    setSelectedCategory('Wishlist');
    setCurrentPage('shop');
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Top Info Bar */}
      <div style={{
        backgroundColor: '#1e40af',
        color: '#bfdbfe',
        fontSize: '0.78rem',
        fontFamily: 'var(--font-sans)',
        padding: '7px 0'
      }}>
        <div style={{
          maxWidth: 1280,
          margin: '0 auto',
          padding: '0 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span>Welcome to E-Star — Your one-stop tech store!</span>
          <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
            <span style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
              <Truck size={12} /> Track Order
            </span>
            <span style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}
              onClick={handleWishlistNav}
            >
              <Heart size={12} /> Wishlist
            </span>
            <span style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
              <Support size={12} /> Support
            </span>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header style={{
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #e2e8f0',
        boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        fontFamily: 'var(--font-sans)'
      }}>
        <div style={{
          maxWidth: 1280,
          margin: '0 auto',
          padding: '0 24px',
          display: 'flex',
          alignItems: 'center',
          gap: 24,
          height: 68
        }}>
          {/* Logo */}
          <div
            onClick={() => handleNav('home')}
            style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', flexShrink: 0 }}
          >
            <LogoIcon />
            <span style={{
              fontSize: '1.35rem',
              fontWeight: 800,
              color: '#0f172a',
              letterSpacing: '-0.02em'
            }}>
              E-<span style={{ color: '#2563eb' }}>Star</span>
            </span>
          </div>

          {/* Search Bar */}
          <div style={{
            flex: 1,
            maxWidth: 520,
            display: 'flex',
            alignItems: 'center',
            background: '#f8fafc',
            border: '1.5px solid #e2e8f0',
            borderRadius: 8,
            overflow: 'hidden',
            transition: 'border-color 0.2s'
          }}
          onFocus={e => e.currentTarget.style.borderColor = '#2563eb'}
          onBlur={e => e.currentTarget.style.borderColor = '#e2e8f0'}
          >
            <input
              type="text"
              placeholder="Search for products, categories..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                if (currentPage !== 'shop') setCurrentPage('shop');
              }}
              style={{
                flex: 1,
                padding: '10px 14px',
                border: 'none',
                background: 'transparent',
                fontSize: '0.9rem',
                color: '#0f172a',
                outline: 'none',
                fontFamily: 'var(--font-sans)'
              }}
            />
            <button
              style={{
                background: '#2563eb',
                border: 'none',
                padding: '0 18px',
                height: 44,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                transition: 'background 0.2s'
              }}
              onClick={() => { if (currentPage !== 'shop') setCurrentPage('shop'); }}
              onMouseEnter={e => e.currentTarget.style.background = '#1d4ed8'}
              onMouseLeave={e => e.currentTarget.style.background = '#2563eb'}
            >
              <Search size={17} />
            </button>
          </div>

          {/* Right Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 'auto', flexShrink: 0 }}>
            {/* Account */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setUserDropdown(!userDropdown)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '8px 14px',
                  borderRadius: 8, border: '1px solid #e2e8f0',
                  background: '#fff', cursor: 'pointer',
                  fontSize: '0.85rem', fontWeight: 600, color: '#0f172a',
                  fontFamily: 'var(--font-sans)',
                  transition: 'all 0.18s'
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#2563eb'; e.currentTarget.style.color = '#2563eb'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.color = '#0f172a'; }}
              >
                <User size={16} />
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 500, lineHeight: 1 }}>
                    {currentUser ? 'Hello,' : 'Login / Signup'}
                  </div>
                  <div style={{ fontWeight: 700, fontSize: '0.85rem', lineHeight: 1.2 }}>
                    {currentUser ? (currentUser.name?.split(' ')[0] || 'Account') : 'My Account'}
                  </div>
                </div>
                <ChevronDown size={13} />
              </button>

              {/* Dropdown */}
              {userDropdown && (
                <div style={{
                  position: 'absolute', top: '110%', right: 0,
                  background: '#fff', border: '1px solid #e2e8f0',
                  borderRadius: 10, boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
                  minWidth: 180, zIndex: 200, padding: 8, animation: 'fadeIn 0.15s ease'
                }}>
                  {currentUser ? (
                    <>
                      <button onClick={() => handleNav('account')} style={dropdownBtnStyle}>
                        <User size={14} /> My Account
                      </button>
                      {currentUser.role === 'admin' && (
                        <button onClick={() => handleNav('admin')} style={dropdownBtnStyle}>
                          <Lock size={14} /> Admin Console
                        </button>
                      )}
                      <div style={{ borderTop: '1px solid #f1f5f9', margin: '6px 0' }} />
                      <button onClick={() => { onLogout(); setUserDropdown(false); }} style={{ ...dropdownBtnStyle, color: '#ef4444' }}>
                        <Lock size={14} /> Sign Out
                      </button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => handleNav('auth')} style={dropdownBtnStyle}>
                        <User size={14} /> Login / Register
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Wishlist */}
            <button
              onClick={handleWishlistNav}
              style={{
                position: 'relative', background: '#fff',
                border: '1px solid #e2e8f0', borderRadius: 8,
                width: 42, height: 42, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#64748b', transition: 'all 0.18s'
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#ef4444'; e.currentTarget.style.color = '#ef4444'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.color = '#64748b'; }}
            >
              <Heart size={18} />
              {wishlistCount > 0 && (
                <span style={{
                  position: 'absolute', top: -6, right: -6,
                  background: '#ef4444', color: '#fff',
                  fontSize: '0.65rem', fontWeight: 800,
                  borderRadius: '50%', width: 18, height: 18,
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>{wishlistCount}</span>
              )}
            </button>

            {/* Cart */}
            <button
              onClick={() => handleNav('cart')}
              style={{
                position: 'relative', background: '#2563eb',
                border: 'none', borderRadius: 8,
                padding: '0 16px', height: 42, cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 8,
                color: '#fff', fontWeight: 700, fontSize: '0.88rem',
                fontFamily: 'var(--font-sans)', transition: 'background 0.18s'
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#1d4ed8'}
              onMouseLeave={e => e.currentTarget.style.background = '#2563eb'}
            >
              <ShoppingCart size={17} />
              <span>My Cart</span>
              <span style={{
                background: '#fff', color: '#2563eb',
                fontSize: '0.72rem', fontWeight: 900,
                borderRadius: '50%', width: 20, height: 20,
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>{cartCount}</span>
            </button>

            {/* Mobile Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{
                display: 'none', alignItems: 'center', justifyContent: 'center',
                width: 40, height: 40, border: '1px solid #e2e8f0',
                borderRadius: 8, background: '#fff', cursor: 'pointer',
                color: '#374151'
              }}
              className="mobile-nav-toggle"
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Category Nav Bar */}
        <div style={{
          borderTop: '1px solid #f1f5f9',
          backgroundColor: '#fff'
        }}>
          <div style={{
            maxWidth: 1280, margin: '0 auto', padding: '0 24px',
            display: 'flex', alignItems: 'center', gap: 4,
            overflowX: 'auto', scrollbarWidth: 'none'
          }}>
            {/* All Categories pill */}
            <button
              onClick={() => { setSelectedCategory('All'); handleNav('shop'); }}
              style={{
                display: 'flex', alignItems: 'center', gap: 7,
                background: '#2563eb', color: '#fff',
                border: 'none', borderRadius: 6,
                padding: '9px 16px', fontWeight: 700,
                fontSize: '0.85rem', cursor: 'pointer',
                fontFamily: 'var(--font-sans)', whiteSpace: 'nowrap',
                flexShrink: 0
              }}
            >
              <Grid size={15} /> All Categories
            </button>

            {[
              { id: 'home', label: 'Home' },
              { id: 'shop', label: 'Shop' },
              { id: 'deals', label: 'Deals' },
              { id: 'new', label: 'New Arrivals' },
              { id: 'account', label: 'My Account' },
            ].map(link => (
              <button
                key={link.id}
                onClick={() => {
                  if (link.id === 'deals') { setSelectedCategory('All'); handleNav('shop'); }
                  else if (link.id === 'new') { setSelectedCategory('All'); handleNav('shop'); }
                  else handleNav(link.id);
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: '10px 14px',
                  fontSize: '0.88rem',
                  fontWeight: (currentPage === link.id) ? 700 : 500,
                  color: currentPage === link.id ? '#2563eb' : '#374151',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-sans)',
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                  borderBottom: currentPage === link.id ? '2px solid #2563eb' : '2px solid transparent',
                  transition: 'all 0.18s'
                }}
                onMouseEnter={e => { if (currentPage !== link.id) e.currentTarget.style.color = '#2563eb'; }}
                onMouseLeave={e => { if (currentPage !== link.id) e.currentTarget.style.color = '#374151'; }}
              >
                {link.label}
              </button>
            ))}
          </div>
        </div>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div style={{
            padding: '12px 24px', borderTop: '1px solid #f1f5f9',
            display: 'flex', flexDirection: 'column', gap: 4
          }}>
            {[
              { id: 'home', label: 'Home' },
              { id: 'shop', label: 'Shop' },
              { id: 'cart', label: `Cart (${cartCount})` },
              { id: 'account', label: currentUser ? 'My Account' : 'Login' },
              ...(currentUser?.role === 'admin' ? [{ id: 'admin', label: 'Admin Console' }] : [])
            ].map(item => (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                style={{
                  padding: '11px 14px', textAlign: 'left',
                  background: currentPage === item.id ? '#eff6ff' : 'transparent',
                  color: currentPage === item.id ? '#2563eb' : '#374151',
                  border: 'none', borderRadius: 8, fontWeight: 600,
                  fontSize: '0.9rem', cursor: 'pointer',
                  fontFamily: 'var(--font-sans)'
                }}
              >
                {item.label}
              </button>
            ))}
          </div>
        )}
      </header>

      <style>{`
        @media (max-width: 768px) {
          .mobile-nav-toggle { display: flex !important; }
        }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </>
  );
}

const dropdownBtnStyle = {
  display: 'flex', alignItems: 'center', gap: 10,
  padding: '9px 12px', width: '100%',
  background: 'none', border: 'none',
  borderRadius: 6, cursor: 'pointer',
  fontSize: '0.88rem', fontWeight: 600,
  color: '#374151', fontFamily: 'var(--font-sans)',
  transition: 'background 0.15s'
};
