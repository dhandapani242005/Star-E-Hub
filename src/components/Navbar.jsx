import React, { useState } from 'react';
import { 
  LuShoppingBag as ShoppingBag, 
  LuSun as Sun, 
  LuMoon as Moon, 
  LuHouse as Home, 
  LuLayoutGrid as Grid, 
  LuUser as User, 
  LuLock as Lock,
  LuMenu as Menu,
  LuX as X,
  LuSearch as Search,
  LuSparkles as Sparkles,
  LuHeart as Heart
} from 'react-icons/lu';

// Premium high-fidelity vector recreation of the corporate E-Star Logo!
export function LogoIcon() {
  return (
    <svg width="38" height="38" viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ transition: 'transform 0.3s ease' }}>
      {/* Sparkles top left */}
      <path d="M170 120 L175 105 L180 120 L195 125 L180 130 L175 145 L170 130 L155 125 Z" fill="#F2A900" />
      <path d="M140 180 L143 170 L146 180 L156 183 L146 186 L143 196 L140 186 L130 183 Z" fill="#F2A900" />
      
      {/* Shopping Cart handle and base (Navy Blue / White) */}
      <path d="M90 170 H150 L200 320 H340 L380 180 H170" stroke="currentColor" strokeWidth="24" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="220" cy="380" r="32" fill="currentColor" />
      <circle cx="320" cy="380" r="32" fill="currentColor" />
      
      {/* Shopping Bag main body */}
      <path d="M210 160 H350 C370 160 380 170 380 190 V320 C380 340 370 350 350 350 H210 C190 350 180 340 180 320 V190 C180 170 190 160 210 160 Z" fill="currentColor" />
      {/* Handle of bag */}
      <path d="M245 160 V130 C245 105 265 85 290 85 C315 85 335 105 335 130 V160" stroke="currentColor" strokeWidth="18" fill="none" strokeLinecap="round" />
      
      {/* Gold swoosh crescent wrapping around the bag */}
      <path d="M120 330 C210 380 370 360 420 180 C380 280 250 330 120 330 Z" fill="#F2A900" />
  
      {/* Gold Star inside the bag */}
      <path d="M280 200 L292 225 L320 229 L300 249 L305 277 L280 264 L255 277 L260 249 L240 229 L268 225 Z" fill="#FFFFFF" stroke="#F2A900" strokeWidth="8" strokeLinejoin="round" />
    </svg>
  );
}

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

  const handleNav = (page) => {
    if (page === 'wishlist') {
      setSelectedCategory('Wishlist');
      setCurrentPage('shop');
    } else {
      setCurrentPage(page);
    }
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navItems = [
    { id: 'home', label: 'Home', icon: <Home size={15} /> },
    { id: 'shop', label: 'Catalog', icon: <Grid size={15} /> },
    { id: 'wishlist', label: 'Wishlist', icon: <Heart size={15} /> },
    { id: 'cart', label: 'Cart', icon: <ShoppingBag size={15} /> },
  ];

  if (currentUser) {
    navItems.push({ id: 'account', label: currentUser.name || 'Account', icon: <User size={15} /> });
    if (currentUser.role === 'admin') {
      navItems.push({ id: 'admin', label: 'Console', icon: <Lock size={15} /> });
    }
  } else {
    navItems.push({ id: 'auth', label: 'Sign In', icon: <User size={15} /> });
  }

  return (
    <header className="site-header-corporate">
      <div className="header-corporate-inner">
        {/* Left Segment: Premium Corporate Logo & Brand Identity */}
        <div className="logo-corporate-container" onClick={() => handleNav('home')}>
          <LogoIcon />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span className="logo-corporate-title">
              E-<span style={{ color: 'var(--accent-gold)' }}>Star</span>
            </span>
            <span className="logo-corporate-tagline">
              Elite <span style={{ color: 'var(--accent-gold)', fontWeight: 800 }}>Smart Store ✦</span>
            </span>
          </div>
        </div>

        {/* Center Segment: Professional Search Engine Bar */}
        <div className="search-corporate-container">
          <input
            type="text"
            className="search-corporate-input"
            placeholder="Search for smart appliances, electronics, toys & gadgets..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              if (currentPage !== 'shop') {
                setCurrentPage('shop');
              }
            }}
          />
          <button className="search-corporate-btn" aria-label="Perform search">
            <Search size={16} />
          </button>
        </div>

        {/* Right Segment: Sleek Corporate Actions */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ul className="nav-corporate-links">
            {navItems.map((item) => {
              const isActive = currentPage === item.id || (item.id === 'cart' && currentPage === 'checkout');
              return (
                <li key={item.id}>
                  <div
                    className={`nav-corporate-link ${isActive ? 'active' : ''}`}
                    onClick={() => handleNav(item.id)}
                  >
                    <span style={{ display: 'flex', alignItems: 'center' }}>{item.icon}</span>
                    <span>{item.label}</span>
                    
                    {item.id === 'cart' && cartCount > 0 && (
                      <span className="cart-badge-corporate">
                        {cartCount}
                      </span>
                    )}

                    {item.id === 'wishlist' && wishlistCount > 0 && (
                      <span className="cart-badge-corporate" style={{ backgroundColor: '#ff3f6c', color: '#ffffff' }}>
                        {wishlistCount}
                      </span>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>

          {/* Premium Metallic Theme Switcher */}
          <button
            className="theme-corporate-btn"
            onClick={toggleDarkMode}
            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle theme color"
          >
            {darkMode ? <Sun size={15} style={{ color: 'var(--accent-gold)' }} /> : <Moon size={15} />}
          </button>

          {currentUser && (
            <button
              onClick={onLogout}
              className="theme-corporate-btn"
              style={{
                marginLeft: '8px',
                color: 'var(--accent-gold)',
                borderColor: 'var(--accent-gold)',
                fontSize: '0.75rem',
                fontWeight: 800,
                padding: '6px 12px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer'
              }}
              title="Logout session"
            >
              <Lock size={12} />
              Logout
            </button>
          )}

          {/* Mobile responsive toggle */}
          <button 
            className="mobile-corporate-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation drawer"
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </nav>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-corporate-drawer">
          {navItems.map((item) => {
            const isActive = currentPage === item.id || (item.id === 'cart' && currentPage === 'checkout');
            return (
              <div
                key={item.id}
                className={`mobile-drawer-link-corporate ${isActive ? 'active' : ''}`}
                onClick={() => handleNav(item.id)}
              >
                {item.icon}
                <span>{item.label}</span>
                {item.id === 'cart' && cartCount > 0 && (
                  <span className="mobile-cart-badge-corporate">{cartCount}</span>
                )}
                {item.id === 'wishlist' && wishlistCount > 0 && (
                  <span className="mobile-cart-badge-corporate" style={{ backgroundColor: '#ff3f6c', color: '#ffffff' }}>{wishlistCount}</span>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Elite Corporate Design Stylesheet */}
      <style>{`
        .site-header-corporate {
          position: sticky;
          top: 0;
          z-index: 1000;
          width: 100%;
          background-color: var(--primary-navy);
          border-bottom: 2px solid var(--accent-gold);
          box-shadow: var(--shadow-md);
          color: #ffffff;
          padding: 12px 0;
        }

        body.dark-theme .site-header-corporate {
          background-color: #0b1320;
          border-bottom-color: var(--accent-gold);
        }

        .header-corporate-inner {
          max-width: 1400px;
          margin: 0 auto;
          width: 90%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 30px;
        }

        /* Logo styling */
        .logo-corporate-container {
          display: flex;
          align-items: center;
          gap: 12px;
          cursor: pointer;
          user-select: none;
        }

        .logo-corporate-container:hover svg {
          transform: scale(1.04);
        }

        .logo-corporate-title {
          font-size: 1.55rem;
          font-weight: 900;
          letter-spacing: -0.01em;
          font-family: var(--font-display);
          line-height: 1;
        }

        .logo-corporate-tagline {
          font-size: 0.68rem;
          font-weight: 700;
          color: #cbd5e1;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          line-height: 1.2;
          margin-top: 2px;
        }

        /* Center Professional Search Bar */
        .search-corporate-container {
          display: flex;
          align-items: center;
          background-color: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: var(--radius-xs);
          padding: 0 0 0 16px;
          flex-grow: 1;
          max-width: 580px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
          overflow: hidden;
        }

        .search-corporate-input {
          border: none;
          background: transparent;
          color: #0f172a;
          font-size: 0.85rem;
          font-weight: 600;
          outline: none;
          width: 100%;
          padding: 10px 0;
        }

        .search-corporate-input::placeholder {
          color: #94a3b8;
        }

        .search-corporate-btn {
          border: none;
          background-color: var(--accent-gold);
          color: var(--primary-navy);
          width: 44px;
          height: 38px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: var(--transition-fast);
        }

        .search-corporate-btn:hover {
          background-color: var(--accent-gold-hover);
        }

        /* Right Nav links list */
        .nav-corporate-links {
          display: flex;
          align-items: center;
          gap: 4px;
          list-style: none;
          margin: 0;
          padding: 0;
        }

        .nav-corporate-link {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          border-radius: var(--radius-xs);
          font-size: 0.9rem;
          font-weight: 750;
          color: #f1f5f9;
          cursor: pointer;
          transition: var(--transition-fast);
          position: relative;
        }

        .nav-corporate-link:hover {
          color: var(--accent-gold);
          background-color: rgba(255, 255, 255, 0.05);
        }

        .nav-corporate-link.active {
          color: var(--accent-gold);
          background-color: rgba(255, 255, 255, 0.08);
        }

        /* Cart count badge styling */
        .cart-badge-corporate {
          background-color: var(--accent-gold);
          color: var(--primary-navy);
          font-size: 0.7rem;
          font-weight: 900;
          border-radius: 50%;
          width: 17px;
          height: 17px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          margin-left: 4px;
        }

        /* Theme button */
        .theme-corporate-btn {
          width: 34px;
          height: 34px;
          border-radius: var(--radius-xs);
          border: 1px solid rgba(255, 255, 255, 0.15);
          background: rgba(255, 255, 255, 0.05);
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: var(--transition-fast);
        }

        .theme-corporate-btn:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: rgba(255, 255, 255, 0.3);
        }

        /* Mobile drawer toggle */
        .mobile-corporate-toggle {
          display: none;
          width: 36px;
          height: 36px;
          border-radius: var(--radius-xs);
          border: none;
          background: rgba(255, 255, 255, 0.08);
          color: #ffffff;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        /* Mobile Drawer style */
        .mobile-corporate-drawer {
          display: none;
          flex-direction: column;
          gap: 4px;
          background-color: var(--primary-navy);
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          padding: 12px 5%;
        }

        .mobile-drawer-link-corporate {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 14px;
          border-radius: var(--radius-xs);
          font-size: 0.9rem;
          font-weight: 700;
          color: #cbd5e1;
          cursor: pointer;
        }

        .mobile-drawer-link-corporate.active, .mobile-drawer-link-corporate:hover {
          background-color: rgba(255, 255, 255, 0.08);
          color: var(--accent-gold);
        }

        .mobile-cart-badge-corporate {
          background-color: var(--accent-gold);
          color: var(--primary-navy);
          font-size: 0.7rem;
          font-weight: 900;
          border-radius: 50%;
          width: 18px;
          height: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-left: auto;
        }

        /* Responsive rules */
        @media (max-width: 1024px) {
          .nav-corporate-links {
            display: none !important;
          }
          .mobile-corporate-toggle {
            display: flex !important;
          }
          .mobile-corporate-drawer {
            display: flex !important;
          }
          .search-corporate-container {
            max-width: 320px;
          }
        }

        @media (max-width: 640px) {
          .search-corporate-container {
            display: none;
          }
        }
      `}</style>
    </header>
  );
}
