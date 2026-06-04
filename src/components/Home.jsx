import React, { useState, useEffect } from 'react';
import {
  LuArrowRight as ArrowRight,
  LuShoppingCart as ShoppingCart,
  LuHeart as Heart,
  LuStar as Star,
  LuTruck as Truck,
  LuShieldCheck as ShieldCheck,
  LuRefreshCw as RefreshCw,
  LuHeadphones as Headphones,
  LuZap as Zap,
  LuChevronLeft as ChevronLeft,
  LuChevronRight as ChevronRight,
  LuMonitor as Monitor,
  LuCamera as Camera,
  LuHouse as HomeIcon,
  LuGamepad2 as Gamepad2,
  LuLaptop as Laptop,
  LuCpu as Cpu,
  LuCircleHelp as HelpCircle
} from 'react-icons/lu';

const FEATURES = [
  { icon: <Truck size={24} />, title: 'Free Shipping', sub: 'On orders over ₹999' },
  { icon: <ShieldCheck size={24} />, title: 'Secure Payment', sub: '100% secure payment' },
  { icon: <RefreshCw size={24} />, title: 'Easy Returns', sub: '30 days return policy' },
  { icon: <Headphones size={24} />, title: '24/7 Support', sub: 'Dedicated support' }
];

const CATEGORY_ICONS = [
  { label: 'Electronics', icon: <Monitor size={26} />, color: '#3b82f6', cat: 'Electronics' },
  { label: 'Security Devices', icon: <Camera size={26} />, color: '#8b5cf6', cat: 'Security Devices' },
  { label: 'Smart Home', icon: <HomeIcon size={26} />, color: '#f59e0b', cat: 'Smart home devices' },
  { label: 'Toys', icon: <Gamepad2 size={26} />, color: '#ef4444', cat: 'Toys' },
  { label: 'Computer Gadgets', icon: <Laptop size={26} />, color: '#10b981', cat: 'Computer Gadgets' },
];

const HERO_SLIDES = [
  {
    title: 'Smart Tech for',
    highlight: 'Smarter Living',
    sub: 'Explore the latest electronics, smart devices, and gadgets for your home & lifestyle.',
    btn: 'Shop Now',
    bg: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
    img: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?auto=format&fit=crop&w=900&q=80'
  },
  {
    title: 'Secure Your',
    highlight: 'Home & Business',
    sub: 'Professional CP Plus cameras and security systems with AI detection.',
    btn: 'Explore Now',
    bg: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
    img: 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=900&q=80'
  }
];

export default function Home({
  products,
  setCurrentPage,
  setSelectedProductId,
  setSelectedCategory = () => {},
  banners = [],
  flashTimer = { hours: 12, minutes: 39, seconds: 28 },
  addToCart,
  wishlist = {},
  toggleWishlist = () => {}
}) {
  const [activeSlide, setActiveSlide] = useState(0);
  const [timeLeft, setTimeLeft] = useState(flashTimer || { hours: 12, minutes: 39, seconds: 28 });

  const slides = banners && banners.length > 0 ? banners.map((b, i) => ({
    ...HERO_SLIDES[i % HERO_SLIDES.length],
    title: b.title || HERO_SLIDES[0].title,
    highlight: b.highlight || HERO_SLIDES[0].highlight,
    sub: b.subtitle || HERO_SLIDES[0].sub,
    img: b.img || HERO_SLIDES[0].img
  })) : HERO_SLIDES;

  useEffect(() => {
    if (flashTimer) setTimeLeft(flashTimer);
  }, [flashTimer]);

  useEffect(() => {
    const t = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        clearInterval(t);
        return prev;
      });
    }, 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const t = setInterval(() => {
      setActiveSlide(p => (p + 1) % slides.length);
    }, 5000);
    return () => clearInterval(t);
  }, [slides.length]);

  const goTo = (page, cat = null) => {
    if (cat) setSelectedCategory(cat);
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const topDeals = products.filter(p => p.offer >= 10).slice(0, 5);
  const newArrivals = products.slice(0, 6);

  const pad = n => String(n).padStart(2, '0');

  const addAndToast = (product) => {
    addToCart(product);
  };

  return (
    <div style={{ backgroundColor: '#f8fafc', fontFamily: 'var(--font-sans)' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>

        {/* HERO BANNER */}
        <div style={{
          position: 'relative',
          borderRadius: 16,
          overflow: 'hidden',
          margin: '20px 0',
          minHeight: 360,
          background: slides[activeSlide].bg || 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
          display: 'flex',
          alignItems: 'center',
          transition: 'background 0.6s ease'
        }}>
          {/* Left Text */}
          <div style={{ flex: 1, padding: '50px 60px', zIndex: 2, position: 'relative' }}>
            <h1 style={{
              fontSize: '2.6rem', fontWeight: 800,
              color: '#0f172a', lineHeight: 1.15,
              marginBottom: 0
            }}>
              {slides[activeSlide].title}<br />
              <span style={{ color: '#2563eb' }}>{slides[activeSlide].highlight}</span>
            </h1>
            <p style={{
              fontSize: '1rem', color: '#475569',
              margin: '18px 0 28px',
              maxWidth: 380, lineHeight: 1.6
            }}>
              {slides[activeSlide].sub}
            </p>
            <button
              onClick={() => goTo('shop')}
              style={{
                background: '#2563eb', color: '#fff',
                border: 'none', borderRadius: 8,
                padding: '13px 28px', fontWeight: 700,
                fontSize: '0.95rem', cursor: 'pointer',
                display: 'inline-flex', alignItems: 'center', gap: 8,
                fontFamily: 'var(--font-sans)',
                transition: 'background 0.18s'
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#1d4ed8'}
              onMouseLeave={e => e.currentTarget.style.background = '#2563eb'}
            >
              {slides[activeSlide].btn} <ArrowRight size={16} />
            </button>
          </div>

          {/* Right Product Image */}
          <div style={{ flex: 1, position: 'relative', height: 360, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img
              src={slides[activeSlide].img}
              alt="hero"
              style={{
                maxHeight: 320, maxWidth: '100%',
                objectFit: 'contain',
                filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.12))',
                transition: 'opacity 0.4s ease'
              }}
            />
          </div>

          {/* Dots */}
          <div style={{
            position: 'absolute', bottom: 18, left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex', gap: 8, zIndex: 3
          }}>
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveSlide(i)}
                style={{
                  width: i === activeSlide ? 24 : 8,
                  height: 8, border: 'none', borderRadius: 4,
                  background: i === activeSlide ? '#2563eb' : '#93c5fd',
                  cursor: 'pointer', padding: 0,
                  transition: 'all 0.25s'
                }}
              />
            ))}
          </div>

          {/* Arrows */}
          {[
            { dir: 'prev', style: { left: 14 }, onClick: () => setActiveSlide(p => (p - 1 + slides.length) % slides.length) },
            { dir: 'next', style: { right: 14 }, onClick: () => setActiveSlide(p => (p + 1) % slides.length) }
          ].map(({ dir, style, onClick }) => (
            <button
              key={dir}
              onClick={onClick}
              style={{
                position: 'absolute', top: '50%',
                transform: 'translateY(-50%)', ...style,
                width: 38, height: 38, borderRadius: '50%',
                background: 'rgba(255,255,255,0.9)',
                border: '1px solid #e2e8f0', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                zIndex: 3, boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}
            >
              {dir === 'prev' ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
            </button>
          ))}
        </div>

        {/* CATEGORY ICONS */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: 12,
          padding: '24px 32px',
          marginBottom: 20,
          boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
          border: '1px solid #f1f5f9'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-around',
            gap: 16,
            overflowX: 'auto',
            scrollbarWidth: 'none'
          }}>
            {CATEGORY_ICONS.map(cat => (
              <div
                key={cat.cat}
                onClick={() => { setSelectedCategory(cat.cat); goTo('shop'); }}
                style={{
                  display: 'flex', flexDirection: 'column',
                  alignItems: 'center', gap: 10,
                  cursor: 'pointer', flexShrink: 0,
                  padding: '8px 16px',
                  borderRadius: 10,
                  transition: 'all 0.2s'
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <div style={{
                  width: 64, height: 64, borderRadius: '50%',
                  backgroundColor: `${cat.color}15`,
                  border: `1.5px solid ${cat.color}30`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: cat.color, transition: 'all 0.2s'
                }}>
                  {cat.icon}
                </div>
                <span style={{
                  fontSize: '0.82rem', fontWeight: 600,
                  color: '#374151', textAlign: 'center',
                  maxWidth: 80, lineHeight: 1.3
                }}>
                  {cat.label}
                </span>
              </div>
            ))}
            <div
              onClick={() => goTo('shop')}
              style={{
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', gap: 10,
                cursor: 'pointer', flexShrink: 0,
                padding: '8px 16px', borderRadius: 10,
                transition: 'all 0.2s'
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <div style={{
                width: 64, height: 64, borderRadius: '50%',
                backgroundColor: '#64748b15',
                border: '1.5px solid #64748b30',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#64748b'
              }}>
                <HelpCircle size={26} />
              </div>
              <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#374151', textAlign: 'center', maxWidth: 80, lineHeight: 1.3 }}>
                More Categories
              </span>
            </div>
          </div>
        </div>

        {/* FEATURES BAR */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 16, marginBottom: 28
        }}>
          {FEATURES.map(f => (
            <div
              key={f.title}
              style={{
                backgroundColor: '#fff',
                borderRadius: 10,
                padding: '16px 20px',
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                border: '1px solid #f1f5f9',
                boxShadow: '0 1px 4px rgba(0,0,0,0.04)'
              }}
            >
              <div style={{ color: '#2563eb', flexShrink: 0 }}>{f.icon}</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0f172a' }}>{f.title}</div>
                <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: 2 }}>{f.sub}</div>
              </div>
            </div>
          ))}
        </div>

        {/* TOP DEALS */}
        {topDeals.length > 0 && (
          <section style={{ marginBottom: 32 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a' }}>Top Deals of the Day</h2>
                {/* Countdown timer */}
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  background: '#fef2f2', border: '1px solid #fecaca',
                  borderRadius: 8, padding: '4px 12px'
                }}>
                  <Zap size={13} style={{ color: '#ef4444' }} />
                  <span style={{ fontWeight: 800, fontSize: '0.85rem', color: '#ef4444', fontVariantNumeric: 'tabular-nums' }}>
                    {pad(timeLeft.hours)}:{pad(timeLeft.minutes)}:{pad(timeLeft.seconds)}
                  </span>
                </div>
              </div>
              <button
                onClick={() => goTo('shop')}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: '#2563eb', fontWeight: 700, fontSize: '0.88rem',
                  display: 'flex', alignItems: 'center', gap: 4,
                  fontFamily: 'var(--font-sans)'
                }}
              >
                View All Deals <ArrowRight size={15} />
              </button>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(5, 1fr)',
              gap: 14
            }}>
              {topDeals.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  wishlist={wishlist}
                  toggleWishlist={toggleWishlist}
                  addToCart={addAndToast}
                  onClick={() => { setSelectedProductId(product.id); goTo('product-detail'); }}
                />
              ))}
            </div>
          </section>
        )}

        {/* PROMO BANNERS */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr',
          gap: 16, marginBottom: 32
        }}>
          <div
            style={{
              background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
              borderRadius: 14, padding: '32px 36px',
              display: 'flex', alignItems: 'center', gap: 20,
              cursor: 'pointer', overflow: 'hidden', position: 'relative'
            }}
            onClick={() => { setSelectedCategory('Smart home devices'); goTo('shop'); }}
          >
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', marginBottom: 8 }}>
                Smart Home Made Simple
              </h3>
              <p style={{ fontSize: '0.88rem', color: '#475569', marginBottom: 18, lineHeight: 1.5 }}>
                Upgrade your home with smart and secure devices.
              </p>
              <button
                style={{
                  background: '#2563eb', color: '#fff', border: 'none',
                  borderRadius: 8, padding: '10px 20px',
                  fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer',
                  fontFamily: 'var(--font-sans)'
                }}
              >
                Shop Now
              </button>
            </div>
            <img
              src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=300&q=80"
              alt="smart home"
              style={{ width: 150, height: 130, objectFit: 'cover', borderRadius: 12 }}
            />
          </div>

          <div
            style={{
              background: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)',
              borderRadius: 14, padding: '32px 36px',
              display: 'flex', alignItems: 'center', gap: 20,
              cursor: 'pointer', overflow: 'hidden'
            }}
            onClick={() => { setSelectedCategory('Security Devices'); goTo('shop'); }}
          >
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', marginBottom: 8 }}>
                Secure Your Space
              </h3>
              <p style={{ fontSize: '0.88rem', color: '#475569', marginBottom: 18, lineHeight: 1.5 }}>
                CP Plus cameras — AI-powered detection.
              </p>
              <button
                style={{
                  background: '#f59e0b', color: '#fff', border: 'none',
                  borderRadius: 8, padding: '10px 20px',
                  fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer',
                  fontFamily: 'var(--font-sans)'
                }}
              >
                Shop Now
              </button>
            </div>
            <img
              src="https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=300&q=80"
              alt="security"
              style={{ width: 150, height: 130, objectFit: 'cover', borderRadius: 12 }}
            />
          </div>
        </div>

        {/* NEW ARRIVALS */}
        {newArrivals.length > 0 && (
          <section style={{ marginBottom: 48 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a' }}>New Arrivals</h2>
              <button
                onClick={() => goTo('shop')}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: '#2563eb', fontWeight: 700, fontSize: '0.88rem',
                  display: 'flex', alignItems: 'center', gap: 4,
                  fontFamily: 'var(--font-sans)'
                }}
              >
                View All <ArrowRight size={15} />
              </button>
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(6, 1fr)',
              gap: 14
            }}>
              {newArrivals.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  wishlist={wishlist}
                  toggleWishlist={toggleWishlist}
                  addToCart={addAndToast}
                  onClick={() => { setSelectedProductId(product.id); goTo('product-detail'); }}
                  compact
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

function ProductCard({ product, wishlist, toggleWishlist, addToCart, onClick, compact = false }) {
  const [hovered, setHovered] = useState(false);
  const discountedPrice = Math.round(product.price * (1 - (product.offer || 0) / 100));
  const isWishlisted = !!wishlist[product.id];

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: '#fff',
        borderRadius: 12,
        border: '1px solid #f1f5f9',
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'all 0.22s',
        boxShadow: hovered ? '0 8px 24px rgba(0,0,0,0.10)' : '0 1px 4px rgba(0,0,0,0.05)',
        transform: hovered ? 'translateY(-3px)' : 'none',
        position: 'relative'
      }}
    >
      {/* Image */}
      <div
        onClick={onClick}
        style={{
          height: compact ? 140 : 180,
          background: '#f8fafc',
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
          }}>
            {product.offer}% OFF
          </div>
        )}
        {product.stock === 0 && (
          <div style={{
            position: 'absolute', top: 10, left: 10,
            background: '#6b7280', color: '#fff',
            fontSize: '0.68rem', fontWeight: 800,
            padding: '2px 7px', borderRadius: 4
          }}>
            OUT OF STOCK
          </div>
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
          src={product.image}
          alt={product.name}
          style={{
            maxWidth: '80%', maxHeight: '100%',
            objectFit: 'contain',
            transition: 'transform 0.3s',
            transform: hovered ? 'scale(1.06)' : 'scale(1)'
          }}
        />
      </div>

      {/* Details */}
      <div style={{ padding: compact ? '10px 12px' : '14px 14px' }} onClick={onClick}>
        <div style={{
          fontSize: '0.7rem', fontWeight: 600, color: '#64748b',
          textTransform: 'uppercase', marginBottom: 4
        }}>
          {product.category}
        </div>
        <div style={{
          fontSize: compact ? '0.82rem' : '0.92rem',
          fontWeight: 600, color: '#0f172a',
          lineHeight: 1.35,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          marginBottom: 8,
          height: compact ? '2.7em' : '2.5em'
        }}>
          {product.name}
        </div>

        {/* Rating */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 8 }}>
          <div style={{
            background: '#16a34a', color: '#fff',
            fontSize: '0.7rem', fontWeight: 800,
            padding: '1px 6px', borderRadius: 4,
            display: 'flex', alignItems: 'center', gap: 2
          }}>
            {product.rating} <Star size={10} fill="white" />
          </div>
          <span style={{ fontSize: '0.72rem', color: '#64748b' }}>({product.reviewsCount})</span>
        </div>

        {/* Price */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
          <span style={{ fontSize: compact ? '0.95rem' : '1.05rem', fontWeight: 800, color: '#0f172a' }}>
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

      {/* Cart Button */}
      {!compact && (
        <div style={{ padding: '0 14px 14px' }}>
          <button
            onClick={e => { e.stopPropagation(); addToCart(product); }}
            disabled={product.stock === 0}
            style={{
              width: '100%', padding: '9px',
              background: product.stock === 0 ? '#f1f5f9' : (hovered ? '#2563eb' : '#fff'),
              color: product.stock === 0 ? '#94a3b8' : (hovered ? '#fff' : '#2563eb'),
              border: `1.5px solid ${product.stock === 0 ? '#e2e8f0' : '#2563eb'}`,
              borderRadius: 8, fontWeight: 700, fontSize: '0.83rem',
              cursor: product.stock === 0 ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              fontFamily: 'var(--font-sans)', transition: 'all 0.2s'
            }}
          >
            <ShoppingCart size={14} />
            {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </button>
        </div>
      )}
    </div>
  );
}
