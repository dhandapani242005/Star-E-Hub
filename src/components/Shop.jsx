import React, { useState } from 'react';
import { 
  LuStar as Star, 
  LuSearch as Search, 
  LuSlidersHorizontal as SlidersHorizontal, 
  LuShoppingBag as ShoppingBag,
  LuArrowUpDown as ArrowUpDown,
  LuLayoutGrid as Grid,
  LuList as List,
  LuEye as Eye,
  LuHeart as Heart
} from 'react-icons/lu';
import { CATEGORIES } from '../data/initialProducts';

export default function Shop({
  products,
  cart,
  addToCart,
  setCurrentPage,
  setSelectedProductId,
  selectedCategory = 'All',
  setSelectedCategory = () => {},
  wishlist = {},
  toggleWishlist = () => {}
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState(50000); // Max ₹50,000
  const [minRating, setMinRating] = useState(0);
  const [hideOutOfStock, setHideOutOfStock] = useState(false);
  const [sortBy, setSortBy] = useState('popularity'); // 'popularity', 'price-low', 'price-high', 'rating'
  const [layoutMode, setLayoutMode] = useState('grid'); // 'grid' or 'list'

  // Apply search, category, price, rating and stock filters
  const filteredProducts = products.filter(product => {
    const discountedPriceInr = product.price * (1 - (product.offer || 0) / 100);
    
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          product.description.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          product.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'All' || 
                            (selectedCategory === 'Wishlist' ? !!wishlist[product.id] : product.category === selectedCategory);
    const matchesPrice = discountedPriceInr <= priceRange;
    const matchesRating = product.rating >= minRating;
    const matchesStock = !hideOutOfStock || product.stock > 0;

    return matchesSearch && matchesCategory && matchesPrice && matchesRating && matchesStock;
  });

  // Apply sorting
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const priceA = a.price * (1 - (a.offer || 0) / 100);
    const priceB = b.price * (1 - (b.offer || 0) / 100);

    if (sortBy === 'price-low') return priceA - priceB;
    if (sortBy === 'price-high') return priceB - priceA;
    if (sortBy === 'rating') return b.rating - a.rating;
    return b.reviewsCount - a.reviewsCount;
  });

  const handleProductClick = (productId) => {
    setSelectedProductId(productId);
    setCurrentPage('product-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="main-content-layout" style={{ animation: 'fadeIn 0.4s ease-out', marginTop: '20px' }}>
      
      {/* Search and results header strip */}
      <section style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '14px 24px',
        backgroundColor: '#ffffff',
        border: '1px solid var(--border-muted)',
        borderRadius: 'var(--radius-sm)',
        marginBottom: '20px',
        boxShadow: 'var(--shadow-sm)',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)' }}>
          Showing <span style={{ color: 'var(--flipkart-blue)' }}>{sortedProducts.length}</span> gadgets in <span style={{ color: 'var(--accent-gold)', fontWeight: 800 }}>{selectedCategory}</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {/* Sorting Dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
            <ArrowUpDown size={14} style={{ color: 'var(--text-muted)' }} />
            <select
              style={{
                padding: '6px 12px',
                border: '1px solid var(--border-muted)',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: '#ffffff',
                color: 'var(--text-main)',
                fontFamily: 'var(--font-sans)',
                fontWeight: 700,
                outline: 'none'
              }}
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="popularity">Popularity</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Customer Rating</option>
            </select>
          </div>

          {/* Grid vs List Toggles */}
          <div style={{
            display: 'flex',
            backgroundColor: '#f0f0f0',
            borderRadius: 'var(--radius-sm)',
            padding: '2px'
          }}>
            <button
              onClick={() => setLayoutMode('grid')}
              style={{
                border: 'none',
                background: layoutMode === 'grid' ? '#ffffff' : 'transparent',
                color: layoutMode === 'grid' ? 'var(--primary-navy)' : 'var(--text-muted)',
                padding: '6px 10px',
                borderRadius: 'var(--radius-sm)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <Grid size={15} />
            </button>
            <button
              onClick={() => setLayoutMode('list')}
              style={{
                border: 'none',
                background: layoutMode === 'list' ? '#ffffff' : 'transparent',
                color: layoutMode === 'list' ? 'var(--primary-navy)' : 'var(--text-muted)',
                padding: '6px 10px',
                borderRadius: 'var(--radius-sm)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <List size={15} />
            </button>
          </div>
        </div>
      </section>

      {/* Catalog Main Layout */}
      <div className="shop-layout">
        {/* Left Side Filters Bar */}
        <aside className="filter-sidebar">
          <h3 className="sidebar-title">Filters</h3>

          {/* Category Section */}
          <div className="filter-section">
            <h4 className="filter-section-title">Categories</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {CATEGORIES.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  style={{
                    border: 'none',
                    background: 'transparent',
                    textAlign: 'left',
                    padding: '8px 10px',
                    fontFamily: 'var(--font-sans)',
                    fontSize: '0.85rem',
                    fontWeight: selectedCategory === category ? 800 : 500,
                    color: selectedCategory === category ? 'var(--flipkart-blue)' : 'var(--text-sub)',
                    cursor: 'pointer',
                    width: '100%',
                    borderRadius: 'var(--radius-xs)',
                    backgroundColor: selectedCategory === category ? '#f5f8ff' : 'transparent'
                  }}
                >
                  {category}
                </button>
              ))}

              {/* Premium Wishlist Filter Button */}
              <button
                onClick={() => setSelectedCategory('Wishlist')}
                style={{
                  border: 'none',
                  background: 'transparent',
                  textAlign: 'left',
                  padding: '8px 10px',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.85rem',
                  fontWeight: selectedCategory === 'Wishlist' ? 800 : 500,
                  color: selectedCategory === 'Wishlist' ? '#ff3f6c' : 'var(--text-sub)',
                  cursor: 'pointer',
                  width: '100%',
                  borderRadius: 'var(--radius-xs)',
                  backgroundColor: selectedCategory === 'Wishlist' ? 'rgba(255, 63, 108, 0.08)' : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <Heart size={14} fill={selectedCategory === 'Wishlist' ? '#ff3f6c' : 'transparent'} stroke={selectedCategory === 'Wishlist' ? '#ff3f6c' : 'currentColor'} />
                <span>My Wishlist</span>
                {Object.values(wishlist).filter(Boolean).length > 0 && (
                  <span style={{
                    marginLeft: 'auto',
                    backgroundColor: '#ff3f6c',
                    color: '#ffffff',
                    fontSize: '0.7rem',
                    fontWeight: 900,
                    padding: '2px 6px',
                    borderRadius: '10px'
                  }}>
                    {Object.values(wishlist).filter(Boolean).length}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Price Ceiling Range */}
          <div className="filter-section">
            <h4 className="filter-section-title" style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Price Ceiling</span>
              <span style={{ color: 'var(--primary-navy)', fontWeight: 800 }}>₹{priceRange.toLocaleString('en-IN')}</span>
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <input
                type="range"
                min="0"
                max="50000"
                step="500"
                value={priceRange}
                onChange={(e) => setPriceRange(parseInt(e.target.value))}
                style={{ accentColor: 'var(--primary-navy)', width: '100%' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                <span>₹0</span>
                <span>₹{priceRange.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Ratings checkboxes */}
          <div className="filter-section">
            <h4 className="filter-section-title">Ratings</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
              {[4.7, 4.5, 4.0].map((starVal) => (
                <label key={starVal} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="shop-rating"
                    checked={minRating === starVal}
                    onChange={() => setMinRating(minRating === starVal ? 0 : starVal)}
                    style={{ accentColor: 'var(--primary-navy)' }}
                  />
                  <span>{starVal}★ & above</span>
                </label>
              ))}
              {minRating > 0 && (
                <button 
                  onClick={() => setMinRating(0)}
                  style={{ border: 'none', background: 'transparent', color: 'var(--danger)', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', textAlign: 'left' }}
                >
                  Clear Rating
                </button>
              )}
            </div>
          </div>

          {/* Stock Filter */}
          <div className="filter-section">
            <h4 className="filter-section-title">Availability</h4>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.85rem' }}>
              <input
                type="checkbox"
                checked={hideOutOfStock}
                onChange={(e) => setHideOutOfStock(e.target.checked)}
                style={{ accentColor: 'var(--primary-navy)' }}
              />
              <span>Hide Out of Stock</span>
            </label>
          </div>
        </aside>

        {/* Right Side Products List */}
        <section>
          {sortedProducts.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '60px 20px',
              backgroundColor: '#ffffff',
              border: '1px solid var(--border-muted)',
              borderRadius: 'var(--radius-sm)',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <h3>No matching gadgets in inventory</h3>
              <p style={{ color: 'var(--text-muted)', marginTop: '8px', fontSize: '0.88rem' }}>Try relaxing your filter parameters.</p>
            </div>
          ) : (
            <div className={layoutMode === 'grid' ? 'products-grid' : 'list-products'}>
              {sortedProducts.map(product => {
                const discountedPrice = product.price * (1 - (product.offer || 0) / 100);
                const isOutOfStock = product.stock <= 0;

                if (layoutMode === 'grid') {
                  return (
                    <div 
                      key={product.id}
                      className="product-card"
                      onClick={() => handleProductClick(product.id)}
                      style={{ cursor: 'pointer', position: 'relative' }}
                    >
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleWishlist(product.id);
                        }}
                        style={{
                          position: 'absolute',
                          top: '12px',
                          right: '12px',
                          background: 'transparent',
                          border: 'none',
                          cursor: 'pointer',
                          padding: '0',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: !!wishlist[product.id] ? '#ef4444' : '#94a3b8',
                          transition: 'transform 0.2s ease',
                          zIndex: 10
                        }}
                        className="wishlist-heart-btn"
                      >
                        <Heart 
                          size={18} 
                          fill={!!wishlist[product.id] ? '#ef4444' : 'transparent'} 
                          stroke={!!wishlist[product.id] ? '#ef4444' : '#94a3b8'}
                        />
                      </button>

                      <div className="product-card-badge">
                        {product.offer > 0 && <span className="discount-badge-tag">{product.offer}% OFF</span>}
                        {isOutOfStock && <span className="out-of-stock-tag">SOLD OUT</span>}
                      </div>

                      <div className="product-card-img-box">
                        <img src={product.image} alt={product.name} />
                      </div>

                      <div className="product-card-details">
                        <span className="product-card-brand">{product.category}</span>
                        <h3 className="product-card-title">{product.name}</h3>

                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                          <span className="ratings-badge">
                            {product.rating} <Star size={10} fill="currentColor" />
                          </span>
                          <span className="ratings-count-text">({product.reviewsCount})</span>
                          <span className="assured-badge" style={{ marginLeft: 'auto' }}>
                            ★ Star Certified
                          </span>
                        </div>

                        <div className="product-card-price-row">
                          <span className="price-actual">₹{Math.round(discountedPrice).toLocaleString('en-IN')}</span>
                          {product.offer > 0 && <span className="price-crossed">₹{Math.round(product.price).toLocaleString('en-IN')}</span>}
                          
                          <button
                            className="btn btn-primary btn-sm btn-icon-only"
                            style={{ 
                              width: '32px', 
                              height: '32px', 
                              padding: 0, 
                              borderRadius: '50%',
                              marginLeft: 'auto',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                            onClick={(e) => { e.stopPropagation(); addToCart(product); }}
                            disabled={isOutOfStock}
                          >
                            <ShoppingBag size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                } else {
                  // LIST LAYOUT MODE
                  return (
                    <div 
                      key={product.id}
                      className="product-card"
                      onClick={() => handleProductClick(product.id)}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '200px 1fr',
                        gap: '20px',
                        marginBottom: '16px',
                        cursor: 'pointer',
                        padding: '16px',
                        flexDirection: 'row'
                      }}
                    >
                      <div className="product-card-img-box" style={{ height: '160px', padding: '10px', border: '1px solid #f0f0f0', borderRadius: 'var(--radius-sm)' }}>
                        <img src={product.image} alt="" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                        {product.offer > 0 && (
                          <span className="discount-badge-tag" style={{ position: 'absolute', top: '24px', left: '24px' }}>
                            {product.offer}% OFF
                          </span>
                        )}
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span className="product-card-brand">{product.category}</span>
                            <span className="assured-badge">★ Star Certified</span>
                          </div>
                          
                          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, margin: '6px 0 10px', color: 'var(--text-main)' }}>{product.name}</h3>
                          <p style={{ fontSize: '0.85rem', color: 'var(--text-sub)', marginBottom: '10px' }}>{product.description}</p>
                          
                          <div style={{ display: 'flex', alignItems: 'center' }}>
                            <span className="ratings-badge">
                              {product.rating} <Star size={10} fill="currentColor" />
                            </span>
                            <span className="ratings-count-text">({product.reviewsCount} customer reviews)</span>
                          </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '14px', borderTop: '1px solid #f0f0f0', paddingTop: '10px' }} onClick={e => e.stopPropagation()}>
                          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                            <span className="price-actual" style={{ fontSize: '1.3rem' }}>₹{Math.round(discountedPrice).toLocaleString('en-IN')}</span>
                            {product.offer > 0 && <span className="price-crossed" style={{ fontSize: '0.9rem' }}>₹{Math.round(product.price).toLocaleString('en-IN')}</span>}
                          </div>

                          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                            <button 
                              className="btn btn-secondary btn-sm" 
                              style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: '4px',
                                color: !!wishlist[product.id] ? '#ef4444' : 'inherit'
                              }}
                              onClick={() => toggleWishlist(product.id)}
                            >
                              <Heart size={13} fill={!!wishlist[product.id] ? '#ef4444' : 'transparent'} stroke={!!wishlist[product.id] ? '#ef4444' : 'currentColor'} />
                              <span>{!!wishlist[product.id] ? 'Wishlisted' : 'Wishlist'}</span>
                            </button>
                            <button className="btn btn-secondary btn-sm" onClick={() => handleProductClick(product.id)}>
                              <Eye size={13} /> View Specs
                            </button>
                            <button 
                              className="btn btn-primary btn-sm"
                              onClick={() => addToCart(product)}
                              disabled={isOutOfStock}
                            >
                              <ShoppingBag size={13} /> Add to Cart
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                }
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
