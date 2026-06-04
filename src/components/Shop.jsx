import React, { useState } from 'react';
import {
  LuStar as Star,
  LuSlidersHorizontal as Sliders,
  LuShoppingCart as ShoppingCart,
  LuArrowUpDown as ArrowUpDown,
  LuLayoutGrid as Grid,
  LuList as List,
  LuHeart as Heart,
  LuSearch as Search,
  LuX as X
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
  const [priceRange, setPriceRange] = useState(50000);
  const [minRating, setMinRating] = useState(0);
  const [hideOutOfStock, setHideOutOfStock] = useState(false);
  const [sortBy, setSortBy] = useState('popularity');
  const [layoutMode, setLayoutMode] = useState('grid');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const filteredProducts = products.filter(product => {
    const discountedPrice = product.price * (1 - (product.offer || 0) / 100);
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === 'All' ||
      (selectedCategory === 'Wishlist' ? !!wishlist[product.id] : product.category === selectedCategory);
    const matchesPrice = discountedPrice <= priceRange;
    const matchesRating = product.rating >= minRating;
    const matchesStock = !hideOutOfStock || product.stock > 0;
    return matchesSearch && matchesCategory && matchesPrice && matchesRating && matchesStock;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const pa = a.price * (1 - (a.offer || 0) / 100);
    const pb = b.price * (1 - (b.offer || 0) / 100);
    if (sortBy === 'price-low') return pa - pb;
    if (sortBy === 'price-high') return pb - pa;
    if (sortBy === 'rating') return b.rating - a.rating;
    return b.reviewsCount - a.reviewsCount;
  });

  const handleProductClick = (id) => {
    setSelectedProductId(id);
    setCurrentPage('product-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const wishlistCount = Object.values(wishlist).filter(Boolean).length;

  return (
    <div style={{ backgroundColor: '#f8fafc', fontFamily: 'var(--font-sans)', minHeight: '80vh' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '20px 24px 48px' }}>

        {/* Header row */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginBottom: 16, gap: 12, flexWrap: 'wrap'
        }}>
          <div>
            <h1 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a' }}>
              {selectedCategory === 'All' ? 'All Products' : selectedCategory}
            </h1>
            <p style={{ fontSize: '0.82rem', color: '#64748b', marginTop: 2 }}>
              Showing <strong>{sortedProducts.length}</strong> products
            </p>
          </div>

          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            {/* Search inline */}
            <div style={{
              display: 'flex', alignItems: 'center',
              background: '#fff', border: '1px solid #e2e8f0',
              borderRadius: 8, padding: '0 12px', gap: 8, height: 38
            }}>
              <Search size={15} style={{ color: '#94a3b8' }} />
              <input
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Search products..."
                style={{
                  border: 'none', outline: 'none', fontSize: '0.85rem',
                  color: '#0f172a', background: 'transparent', width: 200,
                  fontFamily: 'var(--font-sans)'
                }}
              />
              {searchTerm && (
                <button onClick={() => setSearchTerm('')} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#94a3b8' }}>
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              style={{
                padding: '8px 12px', border: '1px solid #e2e8f0',
                borderRadius: 8, background: '#fff', color: '#0f172a',
                fontSize: '0.85rem', fontFamily: 'var(--font-sans)',
                fontWeight: 600, cursor: 'pointer', outline: 'none', height: 38
              }}
            >
              <option value="popularity">Popularity</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Customer Rating</option>
            </select>

            {/* Grid/List toggle */}
            <div style={{
              display: 'flex', background: '#f1f5f9',
              borderRadius: 8, padding: 3, gap: 2
            }}>
              {[
                { mode: 'grid', icon: <Grid size={15} /> },
                { mode: 'list', icon: <List size={15} /> }
              ].map(({ mode, icon }) => (
                <button
                  key={mode}
                  onClick={() => setLayoutMode(mode)}
                  style={{
                    border: 'none', borderRadius: 6, width: 32, height: 32,
                    background: layoutMode === mode ? '#fff' : 'transparent',
                    color: layoutMode === mode ? '#2563eb' : '#64748b',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: layoutMode === mode ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
                  }}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main layout */}
        <div style={{ display: 'grid', gridTemplateColumns: sidebarOpen ? '240px 1fr' : '1fr', gap: 20 }}>

          {/* Sidebar */}
          {sidebarOpen && (
            <aside style={{
              background: '#fff', border: '1px solid #f1f5f9',
              borderRadius: 12, padding: 0, height: 'fit-content',
              boxShadow: '0 1px 4px rgba(0,0,0,0.04)'
            }}>
              <div style={{
                padding: '14px 18px',
                borderBottom: '1px solid #f1f5f9',
                fontWeight: 800, fontSize: '0.92rem', color: '#0f172a',
                display: 'flex', alignItems: 'center', gap: 8
              }}>
                <Sliders size={16} /> Filters
              </div>

              {/* Categories */}
              <div style={{ padding: '14px 18px', borderBottom: '1px solid #f1f5f9' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: '#64748b', marginBottom: 10, letterSpacing: '0.05em' }}>
                  Categories
                </div>
                {[...CATEGORIES, 'Wishlist'].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      width: '100%', padding: '8px 10px',
                      background: selectedCategory === cat
                        ? (cat === 'Wishlist' ? '#fef2f2' : '#eff6ff')
                        : 'transparent',
                      border: 'none', borderRadius: 7,
                      color: selectedCategory === cat
                        ? (cat === 'Wishlist' ? '#ef4444' : '#2563eb')
                        : '#374151',
                      fontWeight: selectedCategory === cat ? 700 : 500,
                      fontSize: '0.875rem', cursor: 'pointer', textAlign: 'left',
                      fontFamily: 'var(--font-sans)', transition: 'all 0.15s',
                      marginBottom: 2
                    }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      {cat === 'Wishlist' && <Heart size={13} fill={selectedCategory === 'Wishlist' ? '#ef4444' : 'none'} />}
                      {cat}
                    </span>
                    {cat === 'Wishlist' && wishlistCount > 0 && (
                      <span style={{
                        background: '#ef4444', color: '#fff',
                        fontSize: '0.65rem', fontWeight: 800,
                        padding: '1px 6px', borderRadius: 99
                      }}>{wishlistCount}</span>
                    )}
                  </button>
                ))}
              </div>

              {/* Price */}
              <div style={{ padding: '14px 18px', borderBottom: '1px solid #f1f5f9' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: '#64748b', letterSpacing: '0.05em' }}>Price</span>
                  <span style={{ fontWeight: 800, fontSize: '0.85rem', color: '#2563eb' }}>₹{priceRange.toLocaleString('en-IN')}</span>
                </div>
                <input
                  type="range" min={0} max={50000} step={500}
                  value={priceRange}
                  onChange={e => setPriceRange(parseInt(e.target.value))}
                  style={{ width: '100%', accentColor: '#2563eb' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#94a3b8', marginTop: 4 }}>
                  <span>₹0</span><span>₹50,000</span>
                </div>
              </div>

              {/* Rating */}
              <div style={{ padding: '14px 18px', borderBottom: '1px solid #f1f5f9' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: '#64748b', marginBottom: 10, letterSpacing: '0.05em' }}>
                  Rating
                </div>
                {[4.7, 4.5, 4.0, 0].map(r => (
                  <label key={r} style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    fontSize: '0.85rem', cursor: 'pointer', marginBottom: 8, color: '#374151'
                  }}>
                    <input
                      type="radio" name="rating"
                      checked={minRating === r}
                      onChange={() => setMinRating(r)}
                      style={{ accentColor: '#2563eb' }}
                    />
                    {r === 0 ? 'All Ratings' : `${r}★ & above`}
                  </label>
                ))}
              </div>

              {/* Availability */}
              <div style={{ padding: '14px 18px' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: '#64748b', marginBottom: 10, letterSpacing: '0.05em' }}>
                  Availability
                </div>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.85rem', cursor: 'pointer', color: '#374151' }}>
                  <input
                    type="checkbox"
                    checked={hideOutOfStock}
                    onChange={e => setHideOutOfStock(e.target.checked)}
                    style={{ accentColor: '#2563eb' }}
                  />
                  In Stock Only
                </label>
              </div>
            </aside>
          )}

          {/* Products */}
          <section>
            {sortedProducts.length === 0 ? (
              <div style={{
                textAlign: 'center', padding: '60px 20px',
                background: '#fff', borderRadius: 12,
                border: '1px solid #f1f5f9'
              }}>
                <div style={{ fontSize: '3rem', marginBottom: 12 }}>🔍</div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>No products found</h3>
                <p style={{ color: '#64748b', marginTop: 8, fontSize: '0.88rem' }}>Try adjusting your filters or search term.</p>
                <button
                  onClick={() => { setSelectedCategory('All'); setPriceRange(50000); setMinRating(0); setSearchTerm(''); }}
                  style={{
                    marginTop: 16, padding: '9px 20px',
                    background: '#2563eb', color: '#fff', border: 'none',
                    borderRadius: 8, fontWeight: 700, fontSize: '0.88rem',
                    cursor: 'pointer', fontFamily: 'var(--font-sans)'
                  }}
                >
                  Clear Filters
                </button>
              </div>
            ) : layoutMode === 'grid' ? (
              <div style={{
                display: 'grid',
                gridTemplateColumns: sidebarOpen
                  ? 'repeat(auto-fill, minmax(200px, 1fr))'
                  : 'repeat(auto-fill, minmax(220px, 1fr))',
                gap: 16
              }}>
                {sortedProducts.map(product => (
                  <ShopProductCard
                    key={product.id}
                    product={product}
                    wishlist={wishlist}
                    toggleWishlist={toggleWishlist}
                    addToCart={addToCart}
                    onClick={() => handleProductClick(product.id)}
                  />
                ))}
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {sortedProducts.map(product => {
                  const discountedPrice = Math.round(product.price * (1 - (product.offer || 0) / 100));
                  const isWishlisted = !!wishlist[product.id];
                  return (
                    <div
                      key={product.id}
                      style={{
                        display: 'grid', gridTemplateColumns: '180px 1fr',
                        background: '#fff', borderRadius: 12,
                        border: '1px solid #f1f5f9', overflow: 'hidden',
                        cursor: 'pointer', transition: 'box-shadow 0.2s',
                        boxShadow: '0 1px 4px rgba(0,0,0,0.04)'
                      }}
                      onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.08)'}
                      onMouseLeave={e => e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.04)'}
                    >
                      <div
                        onClick={() => handleProductClick(product.id)}
                        style={{
                          background: '#f8fafc', display: 'flex',
                          alignItems: 'center', justifyContent: 'center',
                          padding: 16, position: 'relative'
                        }}
                      >
                        {product.offer > 0 && (
                          <div style={{
                            position: 'absolute', top: 10, left: 10,
                            background: '#ef4444', color: '#fff',
                            fontSize: '0.68rem', fontWeight: 800,
                            padding: '2px 7px', borderRadius: 4
                          }}>{product.offer}% OFF</div>
                        )}
                        <img src={product.image} alt={product.name} style={{ maxWidth: '100%', maxHeight: 140, objectFit: 'contain' }} />
                      </div>
                      <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <div onClick={() => handleProductClick(product.id)}>
                          <div style={{ fontSize: '0.72rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', marginBottom: 6 }}>
                            {product.category}
                          </div>
                          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginBottom: 8, lineHeight: 1.4 }}>{product.name}</h3>
                          <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: 1.5, marginBottom: 10, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                            {product.description}
                          </p>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <span style={{ background: '#16a34a', color: '#fff', fontSize: '0.72rem', fontWeight: 800, padding: '2px 7px', borderRadius: 4, display: 'flex', alignItems: 'center', gap: 3 }}>
                              {product.rating} <Star size={10} fill="white" />
                            </span>
                            <span style={{ fontSize: '0.78rem', color: '#64748b' }}>({product.reviewsCount} reviews)</span>
                          </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 14, paddingTop: 14, borderTop: '1px solid #f1f5f9' }}>
                          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                            <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>₹{discountedPrice.toLocaleString('en-IN')}</span>
                            {product.offer > 0 && <span style={{ fontSize: '0.85rem', textDecoration: 'line-through', color: '#94a3b8' }}>₹{product.price.toLocaleString('en-IN')}</span>}
                          </div>
                          <div style={{ display: 'flex', gap: 8 }}>
                            <button
                              onClick={() => toggleWishlist(product.id)}
                              style={{
                                width: 36, height: 36, borderRadius: 8,
                                border: `1px solid ${isWishlisted ? '#fecaca' : '#e2e8f0'}`,
                                background: isWishlisted ? '#fef2f2' : '#fff',
                                color: isWishlisted ? '#ef4444' : '#64748b',
                                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
                              }}
                            >
                              <Heart size={15} fill={isWishlisted ? 'currentColor' : 'none'} />
                            </button>
                            <button
                              onClick={() => addToCart(product)}
                              disabled={product.stock === 0}
                              style={{
                                padding: '8px 16px', background: product.stock === 0 ? '#f1f5f9' : '#2563eb',
                                color: product.stock === 0 ? '#94a3b8' : '#fff',
                                border: 'none', borderRadius: 8, fontWeight: 700,
                                fontSize: '0.83rem', cursor: product.stock === 0 ? 'not-allowed' : 'pointer',
                                display: 'flex', alignItems: 'center', gap: 6,
                                fontFamily: 'var(--font-sans)'
                              }}
                            >
                              <ShoppingCart size={14} /> Add to Cart
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

function ShopProductCard({ product, wishlist, toggleWishlist, addToCart, onClick }) {
  const [hovered, setHovered] = useState(false);
  const discountedPrice = Math.round(product.price * (1 - (product.offer || 0) / 100));
  const isWishlisted = !!wishlist[product.id];
  const isOutOfStock = product.stock <= 0;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: '#fff', borderRadius: 12,
        border: '1px solid #f1f5f9', overflow: 'hidden',
        display: 'flex', flexDirection: 'column',
        transition: 'all 0.22s',
        boxShadow: hovered ? '0 8px 24px rgba(0,0,0,0.10)' : '0 1px 4px rgba(0,0,0,0.04)',
        transform: hovered ? 'translateY(-3px)' : 'none',
        position: 'relative', cursor: 'pointer'
      }}
    >
      {/* Image */}
      <div
        onClick={onClick}
        style={{
          height: 190, background: '#f8fafc',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: 16, position: 'relative'
        }}
      >
        {product.offer > 0 && (
          <div style={{
            position: 'absolute', top: 10, left: 10,
            background: '#ef4444', color: '#fff',
            fontSize: '0.68rem', fontWeight: 800,
            padding: '2px 7px', borderRadius: 4
          }}>{product.offer}% OFF</div>
        )}
        {isOutOfStock && (
          <div style={{
            position: 'absolute', top: product.offer > 0 ? 30 : 10, left: 10,
            background: '#6b7280', color: '#fff',
            fontSize: '0.68rem', fontWeight: 800,
            padding: '2px 7px', borderRadius: 4
          }}>OUT OF STOCK</div>
        )}
        <button
          onClick={e => { e.stopPropagation(); toggleWishlist(product.id); }}
          style={{
            position: 'absolute', top: 10, right: 10,
            width: 30, height: 30, borderRadius: '50%',
            background: isWishlisted ? '#fef2f2' : 'rgba(255,255,255,0.9)',
            border: `1px solid ${isWishlisted ? '#fecaca' : '#e2e8f0'}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: isWishlisted ? '#ef4444' : '#94a3b8',
            transition: 'all 0.18s'
          }}
        >
          <Heart size={14} fill={isWishlisted ? 'currentColor' : 'none'} />
        </button>
        <img
          src={product.image} alt={product.name}
          style={{
            maxWidth: '80%', maxHeight: '100%',
            objectFit: 'contain', transition: 'transform 0.3s',
            transform: hovered ? 'scale(1.06)' : 'scale(1)'
          }}
        />
      </div>

      {/* Details */}
      <div style={{ padding: '12px 14px', flexGrow: 1 }} onClick={onClick}>
        <div style={{ fontSize: '0.7rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', marginBottom: 4 }}>
          {product.category}
        </div>
        <div style={{
          fontSize: '0.88rem', fontWeight: 600, color: '#0f172a', lineHeight: 1.35,
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
          overflow: 'hidden', marginBottom: 8, height: '2.7em'
        }}>
          {product.name}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 8 }}>
          <span style={{
            background: '#16a34a', color: '#fff', fontSize: '0.7rem', fontWeight: 800,
            padding: '1px 6px', borderRadius: 4, display: 'flex', alignItems: 'center', gap: 2
          }}>
            {product.rating} <Star size={10} fill="white" />
          </span>
          <span style={{ fontSize: '0.72rem', color: '#64748b' }}>({product.reviewsCount})</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
          <span style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a' }}>
            ₹{discountedPrice.toLocaleString('en-IN')}
          </span>
          {product.offer > 0 && (
            <>
              <span style={{ fontSize: '0.78rem', textDecoration: 'line-through', color: '#94a3b8' }}>
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              <span style={{ fontSize: '0.78rem', color: '#16a34a', fontWeight: 700 }}>
                {product.offer}% off
              </span>
            </>
          )}
        </div>
      </div>

      {/* Cart button */}
      <div style={{ padding: '0 14px 14px' }}>
        <button
          onClick={e => { e.stopPropagation(); addToCart(product); }}
          disabled={isOutOfStock}
          style={{
            width: '100%', padding: '9px',
            background: isOutOfStock ? '#f1f5f9' : (hovered ? '#2563eb' : '#fff'),
            color: isOutOfStock ? '#94a3b8' : (hovered ? '#fff' : '#2563eb'),
            border: `1.5px solid ${isOutOfStock ? '#e2e8f0' : '#2563eb'}`,
            borderRadius: 8, fontWeight: 700, fontSize: '0.83rem',
            cursor: isOutOfStock ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            fontFamily: 'var(--font-sans)', transition: 'all 0.2s'
          }}
        >
          <ShoppingCart size={14} />
          {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
}
