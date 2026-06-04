import React, { useState, useEffect } from 'react';
import { 
  LuArrowRight as ArrowRight, 
  LuLayoutGrid as Grid, 
  LuHeadphones as Headphones,
  LuShieldCheck as ShieldCheck, 
  LuHouse as HomeIcon, 
  LuGamepad2 as Gamepad2, 
  LuLaptop as Laptop,
  LuZap as Zap, 
  LuClock as Clock, 
  LuShoppingCart as ShoppingCart, 
  LuHeart as Heart, 
  LuStar as Star,
  LuChevronLeft as ChevronLeft,
  LuChevronRight as ChevronRight,
  LuShield as Shield,
  LuAward as Award,
  LuTruck as Truck,
  LuCircleHelp as HelpCircle
} from 'react-icons/lu';

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
  // Deal of the Day simulated timer
  const [timeLeft, setTimeLeft] = useState(() => {
    return flashTimer || { hours: 12, minutes: 39, seconds: 28 };
  });

  useEffect(() => {
    if (flashTimer) {
      setTimeLeft(flashTimer);
    }
  }, [flashTimer]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        clearInterval(timer);
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleToggleWishlist = (productId, e) => {
    if (e) e.stopPropagation();
    toggleWishlist(productId);
  };

  // Carousel Banner States
  const [activeSlide, setActiveSlide] = useState(0);
  const defaultCarouselSlides = [
    {
      title: "Smart Technology, Better Living.",
      subtitle: "Discover the latest smart gadgets, electronics, and smart home solutions.",
      tag: "NEW ARRIVALS",
      btnText: "Shop Now",
      img: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80"
    },
    {
      title: "Elevate Your Surveillance Setup",
      subtitle: "Professional CP Plus cameras & security hubs with zero latency monitoring.",
      tag: "SECURITY DEALS",
      btnText: "Explore Now",
      img: "https://images.unsplash.com/photo-1557862921-37829c790f19?auto=format&fit=crop&w=1200&q=80"
    }
  ];

  const slides = banners && banners.length > 0 ? banners : defaultCarouselSlides;

  useEffect(() => {
    const autoPlay = setInterval(() => {
      setActiveSlide(prev => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(autoPlay);
  }, [slides.length]);

  const handleNextSlide = () => {
    setActiveSlide((activeSlide + 1) % slides.length);
  };

  const handlePrevSlide = () => {
    setActiveSlide((activeSlide - 1 + slides.length) % slides.length);
  };

  // Get 5 Deals of the Day (high discount)
  const dealsOfTheDay = [...products]
    .sort((a, b) => b.offer - a.offer)
    .slice(0, 5);

  const categoriesList = [
    { name: 'All Categories', id: 'All', icon: <Grid size={16} /> },
    { name: 'Electronics', id: 'Electronics', icon: <Headphones size={16} /> },
    { name: 'Security Devices', id: 'Security Devices', icon: <ShieldCheck size={16} /> },
    { name: 'Smart Home', id: 'Smart home devices', icon: <HomeIcon size={16} /> },
    { name: 'Toys', id: 'Toys', icon: <Gamepad2 size={16} /> },
    { name: 'Computer Gadgets', id: 'Computer Gadgets', icon: <Laptop size={16} /> }
  ];

  const showcaseCategories = [
    { 
      name: 'Electronics', 
      id: 'Electronics', 
      productsCount: '120+ Products', 
      img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=300&q=80',
      gradient: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
      btnBg: '#3b82f6'
    },
    { 
      name: 'Security Devices', 
      id: 'Security Devices', 
      productsCount: '80+ Products', 
      img: 'https://images.unsplash.com/photo-1557862921-37829c790f19?auto=format&fit=crop&w=300&q=80',
      gradient: 'linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%)',
      btnBg: '#8b5cf6'
    },
    { 
      name: 'Smart Home', 
      id: 'Smart home devices', 
      productsCount: '150+ Products', 
      img: 'https://images.unsplash.com/photo-1550985616-10810253b84d?auto=format&fit=crop&w=300&q=80',
      gradient: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)',
      btnBg: '#f59e0b'
    },
    { 
      name: 'Toys', 
      id: 'Toys', 
      productsCount: '90+ Products', 
      img: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=300&q=80',
      gradient: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
      btnBg: '#10b981'
    },
    { 
      name: 'Computer Gadgets', 
      id: 'Computer Gadgets', 
      productsCount: '110+ Products', 
      img: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=300&q=80',
      gradient: 'linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%)',
      btnBg: '#ec4899'
    }
  ];

  const handleProductClick = (productId) => {
    setSelectedProductId(productId);
    setCurrentPage('product-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCategorySelect = (catId) => {
    setSelectedCategory(catId);
    setCurrentPage('shop');
    window.scrollTo({ top: 0 });
  };

  return (
    <div style={{ animation: 'fadeIn 0.4s ease-out', paddingBottom: '60px', backgroundColor: '#f3f4f6' }}>
      
      {/* 1. Category Navigation Pill Strip under Header */}
      <section style={{
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #e5e7eb',
        padding: '12px 0',
        position: 'sticky',
        top: '64px',
        zIndex: 99,
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.02)'
      }} className="category-corporate-strip">
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          width: '90%',
          display: 'flex',
          justifyContent: 'center',
          gap: '12px',
          overflowX: 'auto',
          scrollbarWidth: 'none'
        }}>
          {categoriesList.map((cat, idx) => (
            <button 
              key={idx} 
              onClick={() => handleCategorySelect(cat.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 18px',
                borderRadius: '10px',
                border: cat.id === 'All' ? '1px solid var(--accent-gold)' : '1px solid #e5e7eb',
                backgroundColor: '#ffffff',
                color: cat.id === 'All' ? 'var(--accent-gold)' : '#374151',
                fontSize: '0.85rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                whiteSpace: 'nowrap'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--accent-gold)';
                e.currentTarget.style.backgroundColor = 'rgba(217, 119, 6, 0.04)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = cat.id === 'All' ? 'var(--accent-gold)' : '#e5e7eb';
                e.currentTarget.style.backgroundColor = '#ffffff';
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', color: 'var(--accent-gold)' }}>{cat.icon}</span>
              <span>{cat.name}</span>
            </button>
          ))}
        </div>
      </section>

      <div style={{ maxWidth: '1400px', margin: '0 auto', width: '90%', marginTop: '24px' }}>
        
        {/* 2. Premium Cinematic Showcase Hero Banner */}
        <section style={{
          position: 'relative',
          height: '460px',
          borderRadius: '24px',
          overflow: 'hidden',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.08)',
          marginBottom: '30px',
          border: '1px solid rgba(255,255,255,0.1)',
          background: 'linear-gradient(135deg, #091e36 0%, #0d2c4f 100%)'
        }}>
          {slides.map((slide, idx) => (
            <div 
              key={idx} 
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                opacity: idx === activeSlide ? 1 : 0,
                visibility: idx === activeSlide ? 'visible' : 'hidden',
                pointerEvents: idx === activeSlide ? 'auto' : 'none',
                transform: idx === activeSlide ? 'translateX(0)' : (idx < activeSlide ? 'translateX(-40px)' : 'translateX(40px)'),
                transition: 'opacity 0.6s ease, transform 0.6s cubic-bezier(0.4, 0, 0.2, 1), visibility 0.6s ease',
                display: 'grid',
                gridTemplateColumns: '1.2fr 0.8fr',
                padding: '40px 60px',
                zIndex: idx === activeSlide ? 2 : 1,
                alignItems: 'center',
                background: 'transparent'
              }}
            >
              {/* Left Column Content */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', color: '#ffffff', zIndex: 10 }}>
                <span style={{
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: 'var(--accent-gold)',
                  fontWeight: 800,
                  fontSize: '0.7rem',
                  letterSpacing: '0.08em',
                  borderRadius: '6px',
                  padding: '4px 12px',
                  width: 'fit-content',
                  textTransform: 'uppercase',
                  background: 'rgba(255, 255, 255, 0.05)'
                }}>
                  ✦ {slide.tag}
                </span>
                
                <h1 style={{ 
                  fontSize: '3rem', 
                  fontWeight: 900, 
                  color: '#ffffff', 
                  lineHeight: '1.15',
                  letterSpacing: '-0.02em',
                  fontFamily: 'var(--font-display)'
                }}>
                  {slide.title.includes("Better Living") ? (
                    <>
                      Smart Technology,<br />
                      <span style={{ color: 'var(--accent-gold)' }}>Better Living.</span>
                    </>
                  ) : slide.title}
                </h1>
                
                <p style={{ fontSize: '1rem', color: '#93c5fd', lineHeight: '1.5', maxWidth: '480px' }}>
                  {slide.subtitle}
                </p>

                <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
                  <button 
                    className="btn" 
                    style={{ 
                      padding: '12px 28px',
                      borderRadius: '12px',
                      background: 'var(--accent-gold)',
                      color: '#ffffff',
                      border: 'none',
                      fontWeight: 800,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      cursor: 'pointer',
                      boxShadow: '0 4px 14px rgba(217, 119, 6, 0.3)'
                    }}
                    onClick={() => {
                      if (slide.tag.includes("SECURITY")) {
                        setSelectedCategory("Security Devices");
                      }
                      setCurrentPage('shop');
                    }}
                  >
                    {slide.btnText} <ArrowRight size={16} />
                  </button>
                  
                  <button 
                    className="btn" 
                    style={{ 
                      padding: '12px 24px',
                      borderRadius: '12px',
                      background: 'transparent',
                      color: '#ffffff',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      fontWeight: 800,
                      cursor: 'pointer'
                    }}
                    onClick={() => handleCategorySelect('All')}
                  >
                    Explore Categories
                  </button>
                </div>

                {/* Micro stats banner inside hero */}
                <div style={{ display: 'flex', gap: '24px', marginTop: '24px', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--accent-gold)' }}></div>
                    <span style={{ fontSize: '0.8rem', color: '#93c5fd', fontWeight: 600 }}><strong style={{ color: '#ffffff' }}>500+</strong> Products</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--accent-gold)' }}></div>
                    <span style={{ fontSize: '0.8rem', color: '#93c5fd', fontWeight: 600 }}><strong style={{ color: '#ffffff' }}>20K+</strong> Happy Customers</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--accent-gold)' }}></div>
                    <span style={{ fontSize: '0.8rem', color: '#93c5fd', fontWeight: 600 }}><strong style={{ color: '#ffffff' }}>100%</strong> Secure Shopping</span>
                  </div>
                </div>
              </div>

              {/* Right Column Podiums & Montage Graphic */}
              <div style={{ position: 'relative', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{
                  position: 'absolute',
                  width: '320px',
                  height: '320px',
                  background: 'radial-gradient(circle, rgba(59,130,246,0.15) 0%, rgba(0,0,0,0) 70%)',
                  zIndex: 1
                }}></div>
                <img 
                  src={slide.img} 
                  alt="" 
                  style={{ 
                    maxHeight: '340px',
                    maxWidth: '100%',
                    objectFit: 'contain',
                    zIndex: 2,
                    filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.3))',
                    borderRadius: '16px'
                  }} 
                />
              </div>
            </div>
          ))}

          {/* Elegant Carousel Left/Right Buttons */}
          <button 
            onClick={handlePrevSlide}
            style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)', color: '#ffffff', width: '42px', height: '42px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10, transition: 'all 0.2s' }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
          >
            <ChevronLeft size={20} />
          </button>
          
          <button 
            onClick={handleNextSlide}
            style={{ position: 'absolute', right: '20px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)', color: '#ffffff', width: '42px', height: '42px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10, transition: 'all 0.2s' }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
          >
            <ChevronRight size={20} />
          </button>

          {/* Indicator slider dots */}
          <div style={{ position: 'absolute', bottom: '24px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '8px', zIndex: 10 }}>
            {slides.map((_, idx) => (
              <span 
                key={idx}
                style={{
                  width: activeSlide === idx ? '24px' : '8px',
                  height: '8px',
                  borderRadius: '4px',
                  backgroundColor: activeSlide === idx ? 'var(--accent-gold)' : 'rgba(255, 255, 255, 0.4)',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }}
                onClick={() => setActiveSlide(idx)}
              />
            ))}
          </div>
        </section>

        {/* 3. Category Showcase Cards Grid */}
        <section style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px', marginBottom: '30px' }} className="categories-grid-showcase">
          {showcaseCategories.map((showcase, index) => (
            <div 
              key={index}
              onClick={() => handleCategorySelect(showcase.id)}
              style={{
                background: showcase.gradient,
                borderRadius: '20px',
                padding: '24px 20px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative',
                height: '180px',
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(0,0,0,0.01)',
                border: '1px solid rgba(0,0,0,0.02)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease'
              }}
              className="showcase-card"
            >
              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#1f2937', marginBottom: '2px' }}>{showcase.name}</h3>
                <span style={{ fontSize: '0.78rem', color: '#6b7280', fontWeight: 600 }}>{showcase.productsCount}</span>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 'auto' }}>
                <span style={{ 
                  width: '32px', 
                  height: '32px', 
                  borderRadius: '50%', 
                  backgroundColor: showcase.btnBg, 
                  color: '#ffffff', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  boxShadow: `0 4px 10px ${showcase.btnBg}33`
                }}>
                  <ArrowRight size={14} />
                </span>
                
                <img 
                  src={showcase.img} 
                  alt={showcase.name} 
                  style={{
                    width: '90px',
                    height: '90px',
                    objectFit: 'contain',
                    position: 'absolute',
                    right: '10px',
                    bottom: '10px',
                    filter: 'drop-shadow(0 8px 12px rgba(0,0,0,0.08))',
                    transition: 'transform 0.3s ease'
                  }}
                  className="showcase-card-img"
                />
              </div>
            </div>
          ))}
        </section>

        {/* 4. FLASH DEALS OF THE DAY (Executive Sleek Dark Mode Panel) */}
        <section style={{
          backgroundColor: '#070f1e',
          border: '1px solid #1e293b',
          borderRadius: '24px',
          marginBottom: '30px',
          boxShadow: '0 20px 30px rgba(0, 0, 0, 0.15)',
          overflow: 'hidden'
        }}>
          {/* Header block with Timer */}
          <div style={{
            padding: '24px 30px',
            borderBottom: '1px solid #1e293b',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Zap size={20} style={{ color: 'var(--accent-gold)' }} fill="var(--accent-gold)" />
                <h2 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#ffffff', fontFamily: 'var(--font-display)' }}>Flash Deals of the Day</h2>
              </div>
              
              {/* Countdown Timer */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: '#94a3b8' }}>
                <span>Ends in:</span>
                <div style={{ display: 'flex', gap: '4px' }}>
                  <span style={{
                    backgroundColor: '#111827',
                    color: 'var(--accent-gold)',
                    padding: '4px 8px',
                    borderRadius: '6px',
                    fontWeight: 900,
                    fontFamily: 'monospace'
                  }}>
                    {timeLeft.hours.toString().padStart(2, '0')}h
                  </span>
                  <span style={{ fontWeight: 900, color: '#334155' }}>:</span>
                  <span style={{
                    backgroundColor: '#111827',
                    color: 'var(--accent-gold)',
                    padding: '4px 8px',
                    borderRadius: '6px',
                    fontWeight: 900,
                    fontFamily: 'monospace'
                  }}>
                    {timeLeft.minutes.toString().padStart(2, '0')}m
                  </span>
                  <span style={{ fontWeight: 900, color: '#334155' }}>:</span>
                  <span style={{
                    backgroundColor: '#111827',
                    color: 'var(--accent-gold)',
                    padding: '4px 8px',
                    borderRadius: '6px',
                    fontWeight: 900,
                    fontFamily: 'monospace'
                  }}>
                    {timeLeft.seconds.toString().padStart(2, '0')}s
                  </span>
                </div>
              </div>
            </div>

            <button 
              className="btn" 
              onClick={() => setCurrentPage('shop')}
              style={{ 
                fontSize: '0.8rem',
                borderRadius: '8px',
                padding: '8px 18px',
                border: '1px solid #334155',
                background: 'transparent',
                color: '#ffffff',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              View All Deals <ArrowRight size={14} />
            </button>
          </div>

          {/* Deals horizontal row */}
          <div style={{
            display: 'flex',
            padding: '24px 30px',
            gap: '20px',
            overflowX: 'auto',
            scrollbarWidth: 'none'
          }}>
            {dealsOfTheDay.map(product => {
              const discountedPrice = product.price * (1 - (product.offer || 0) / 100);
              const isOutOfStock = product.stock <= 0;
              const isWishlisted = !!wishlist[product.id];
              return (
                <div 
                  key={product.id}
                  onClick={() => handleProductClick(product.id)}
                  style={{ 
                    minWidth: '220px', 
                    maxWidth: '220px', 
                    cursor: 'pointer', 
                    display: 'flex',
                    flexDirection: 'column',
                    backgroundColor: '#0b1320',
                    border: '1px solid #1e293b',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    padding: '0',
                    position: 'relative',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease'
                  }}
                  className="deal-product-card"
                >
                  {/* Top Discount tag */}
                  {product.offer > 0 && (
                    <span style={{
                      position: 'absolute',
                      top: '12px',
                      left: '12px',
                      backgroundColor: '#ff3f6c',
                      color: '#ffffff',
                      fontWeight: 900,
                      fontSize: '0.65rem',
                      padding: '3px 8px',
                      borderRadius: '4px',
                      zIndex: 10
                    }}>{product.offer}% OFF</span>
                  )}

                  {/* Top wishlist heart */}
                  <button 
                    onClick={(e) => handleToggleWishlist(product.id, e)}
                    style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      zIndex: 10
                    }}
                  >
                    <Heart 
                      size={16} 
                      fill={isWishlisted ? '#ff3f6c' : 'transparent'} 
                      stroke={isWishlisted ? '#ff3f6c' : '#ffffff'} 
                    />
                  </button>

                  {/* Inset Image Frame */}
                  <div style={{
                    backgroundColor: '#111827',
                    height: '180px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '12px'
                  }}>
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      style={{
                        maxWidth: '100%',
                        maxHeight: '100%',
                        objectFit: 'contain',
                        transition: 'transform 0.3s ease'
                      }}
                      className="product-card-zoom-img"
                    />
                  </div>

                  {/* Text details content */}
                  <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                    <h3 style={{ 
                      fontSize: '0.85rem', 
                      fontWeight: 700, 
                      height: '2.5em', 
                      lineClamp: 2, 
                      display: '-webkit-box', 
                      WebkitLineClamp: 2, 
                      WebkitBoxOrient: 'vertical', 
                      overflow: 'hidden', 
                      marginBottom: '10px',
                      color: '#cbd5e1',
                      lineHeight: '1.3'
                    }}>{product.name}</h3>

                    {/* Rating row */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '8px' }}>
                      <span style={{ color: 'var(--accent-gold)', display: 'flex', alignItems: 'center', gap: '2px', fontSize: '0.78rem', fontWeight: 800 }}>
                        ★ {product.rating}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                        ({product.reviewsCount})
                      </span>
                    </div>

                    {/* Price & Cart row */}
                    <div style={{ display: 'flex', alignItems: 'center', justifycontent: 'space-between', marginTop: 'auto' }}>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--accent-gold)' }}>
                          ₹{Math.round(discountedPrice).toLocaleString('en-IN')}
                        </span>
                        {product.offer > 0 && (
                          <span style={{ fontSize: '0.72rem', color: '#64748b', textDecoration: 'line-through' }}>
                            ₹{Math.round(product.price).toLocaleString('en-IN')}
                          </span>
                        )}
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(product);
                        }}
                        disabled={isOutOfStock}
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          border: 'none',
                          backgroundColor: 'var(--accent-gold)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: isOutOfStock ? 'not-allowed' : 'pointer',
                          color: '#ffffff',
                          padding: '0'
                        }}
                        className="deal-cart-btn"
                      >
                        <ShoppingCart size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 5. Feature Badges Strip (Value Propositions) */}
        <section style={{
          backgroundColor: '#ffffff',
          border: '1px solid #e5e7eb',
          borderRadius: '16px',
          padding: '24px 30px',
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '24px',
          marginBottom: '40px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.01)'
        }} className="proposition-strip">
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#fffbeb', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Truck size={20} style={{ color: '#d97706' }} />
            </div>
            <div>
              <h4 style={{ fontSize: '0.85rem', fontWeight: 800, color: '#111827' }}>Fast & Free Delivery</h4>
              <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>On orders above ₹499</span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <ShieldCheck size={20} style={{ color: '#2563eb' }} />
            </div>
            <div>
              <h4 style={{ fontSize: '0.85rem', fontWeight: 800, color: '#111827' }}>Secure Payment</h4>
              <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>100% protected checkout</span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Award size={20} style={{ color: '#16a34a' }} />
            </div>
            <div>
              <h4 style={{ fontSize: '0.85rem', fontWeight: 800, color: '#111827' }}>Original Products</h4>
              <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>100% authentic items</span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#fdf2f8', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <HelpCircle size={20} style={{ color: '#db2777' }} />
            </div>
            <div>
              <h4 style={{ fontSize: '0.85rem', fontWeight: 800, color: '#111827' }}>24/7 Customer Support</h4>
              <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>We are here to help</span>
            </div>
          </div>
        </section>

        {/* 6. TRENDING GADGETS SHOWROOM */}
        <section style={{ marginBottom: '40px' }}>
          <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--primary-navy)', fontFamily: 'var(--font-display)' }}>Trending This Week</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '2px' }}>Fully verified E-Star high-fidelity gadgets catalog</p>
            </div>
            <button 
              className="btn" 
              onClick={() => setCurrentPage('shop')}
              style={{
                fontSize: '0.8rem',
                borderRadius: '12px',
                padding: '8px 18px',
                border: '1px solid #cbd5e1',
                background: '#ffffff',
                color: '#374151',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              View All Products <ArrowRight size={14} />
            </button>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
            gap: '20px'
          }}>
            {products.slice(0, 8).map(product => {
              const finalPrice = product.price * (1 - (product.offer || 0) / 100);
              const isOutOfStock = product.stock <= 0;
              const isWishlisted = !!wishlist[product.id];
              return (
                <div 
                  key={product.id}
                  className="product-card"
                  onClick={() => handleProductClick(product.id)}
                  style={{ 
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    backgroundColor: '#ffffff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '20px',
                    overflow: 'hidden',
                    padding: '0',
                    position: 'relative',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease'
                  }}
                >
                  {/* Floating Heart Wishlist toggle */}
                  <button 
                    onClick={(e) => handleToggleWishlist(product.id, e)}
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
                      color: isWishlisted ? '#ef4444' : '#94a3b8',
                      transition: 'transform 0.2s ease',
                      zIndex: 10
                    }}
                    className="wishlist-heart-btn"
                  >
                    <Heart 
                      size={18} 
                      fill={isWishlisted ? '#ef4444' : 'transparent'} 
                      stroke={isWishlisted ? '#ef4444' : '#94a3b8'}
                    />
                  </button>
                  
                  {/* Soft-grey Inset Image Frame */}
                  <div style={{
                    backgroundColor: '#f9fafb',
                    height: '180px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '12px'
                  }} className="product-card-img-container">
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      style={{
                        maxWidth: '100%',
                        maxHeight: '100%',
                        objectFit: 'contain',
                        transition: 'transform 0.3s ease'
                      }}
                      className="product-card-zoom-img"
                    />
                  </div>

                  {/* Text details content */}
                  <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                    <span style={{ 
                      fontWeight: 800, 
                      color: 'var(--flipkart-blue)', 
                      textTransform: 'uppercase', 
                      fontSize: '0.68rem', 
                      letterSpacing: '0.05em',
                      marginBottom: '4px'
                    }}>{product.category}</span>
                    
                    <h3 style={{ 
                      fontSize: '0.88rem', 
                      fontWeight: 700, 
                      margin: '0 0 8px 0',
                      height: '2.5em', 
                      lineClamp: 2, 
                      display: '-webkit-box', 
                      WebkitLineClamp: 2, 
                      WebkitBoxOrient: 'vertical', 
                      overflow: 'hidden', 
                      color: '#1f2937',
                      lineHeight: '1.3'
                    }}>{product.name}</h3>

                    {/* Ratings chip row */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
                      <span style={{ 
                        backgroundColor: '#10b981', 
                        color: '#ffffff', 
                        padding: '2px 6px', 
                        fontWeight: 800, 
                        fontSize: '0.7rem', 
                        borderRadius: '4px', 
                        display: 'inline-flex', 
                        alignItems: 'center', 
                        gap: '2px' 
                      }}>
                        {product.rating} ★
                      </span>
                      <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 500 }}>
                        ({product.reviewsCount})
                      </span>
                    </div>

                    {/* Price and Add Action Row */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#111827' }}>
                          ₹{Math.round(finalPrice).toLocaleString('en-IN')}
                        </span>
                        {product.offer > 0 && (
                          <span style={{ fontSize: '0.75rem', color: '#94a3b8', textDecoration: 'line-through', fontWeight: 500 }}>
                            ₹{Math.round(product.price).toLocaleString('en-IN')}
                          </span>
                        )}
                      </div>

                      {/* Floating round shopping cart button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(product);
                        }}
                        disabled={isOutOfStock}
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          border: 'none',
                          backgroundColor: '#f3f4f6',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: isOutOfStock ? 'not-allowed' : 'pointer',
                          transition: 'all 0.2s ease',
                          color: '#1f2937',
                          padding: '0'
                        }}
                        className="home-cart-btn-circle"
                        title="Add to cart"
                      >
                        <ShoppingCart size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      <style>{`
        .showcase-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 20px rgba(0,0,0,0.06) !important;
        }
        .showcase-card:hover .showcase-card-img {
          transform: scale(1.08) translate(-4px, -4px);
        }
        .deal-product-card:hover {
          border-color: #334155 !important;
          transform: translateY(-4px);
          box-shadow: 0 12px 24px rgba(0,0,0,0.3) !important;
        }
        .deal-product-card:hover .product-card-zoom-img {
          transform: scale(1.08) !important;
        }
        .deal-cart-btn:hover {
          filter: brightness(1.1);
          transform: scale(1.08);
        }
        .product-card:hover {
          border-color: #cbd5e1 !important;
          transform: translateY(-4px);
          box-shadow: 0 12px 20px rgba(0,0,0,0.06) !important;
        }
        .product-card:hover .product-card-zoom-img {
          transform: scale(1.08) !important;
        }
        .home-cart-btn-circle:hover {
          background-color: var(--primary-navy) !important;
          color: #ffffff !important;
          border-color: var(--primary-navy) !important;
          transform: scale(1.08);
        }
        .wishlist-heart-btn:hover {
          transform: scale(1.15);
        }

        @media (max-width: 1024px) {
          .categories-grid-showcase {
            grid-template-columns: repeat(3, 1fr) !important;
          }
          .proposition-strip {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 16px !important;
          }
        }
        @media (max-width: 640px) {
          .categories-grid-showcase {
            grid-template-columns: 1fr 1fr !important;
          }
          .proposition-strip {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
