import React, { useState } from 'react';
import { 
  LuStar as Star, 
  LuShoppingBag as ShoppingBag, 
  LuArrowLeft as ArrowLeft, 
  LuCheck as Check, 
  LuChevronDown as ChevronDown, 
  LuChevronUp as ChevronUp, 
  LuShieldCheck as ShieldCheck, 
  LuTruck as Truck, 
  LuAward as Award,
  LuPlus as Plus,
  LuPlay as Play
} from 'react-icons/lu';

export default function ProductDetail({
  productId,
  products,
  setProducts,
  addToCart,
  setCurrentPage,
  addToast
}) {
  const product = products.find(p => p.id === productId);
  
  if (!product) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 0' }}>
        <h2>Product Not Found</h2>
        <button className="btn btn-primary" style={{ marginTop: '20px' }} onClick={() => setCurrentPage('shop')}>
          Back to Catalog
        </button>
      </div>
    );
  }

  const [activeTab, setActiveTab] = useState('specs'); // 'specs', 'faq', 'reviews'
  const [faqOpen, setFaqOpen] = useState({ 0: true, 1: false, 2: false });
  const [activeThumb, setActiveThumb] = useState(0);

  // Review Form States
  const [reviewName, setReviewName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');

  // Initial Simulated Reviews
  const [reviewsList, setReviewsList] = useState([
    { name: 'Aarav Sharma', rating: 5, comment: 'Exceptional build quality! Truly a premium device. The automated features run like clockwork.', date: 'May 28, 2026' },
    { name: 'Priya Patel', rating: 4, comment: 'Highly reliable and useful gadget. The specifications list is very accurate. Super fast delivery.', date: 'May 18, 2026' }
  ]);

  const discountedPrice = product.price * (1 - (product.offer || 0) / 100);
  const isOutOfStock = product.stock <= 0;

  const toggleFaq = (idx) => {
    setFaqOpen({ ...faqOpen, [idx]: !faqOpen[idx] });
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!reviewName || !reviewComment) {
      addToast('Please fill in reviewer name and comments!', 'error');
      return;
    }

    const newReview = {
      name: reviewName,
      rating: reviewRating,
      comment: reviewComment,
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    };

    setReviewsList([newReview, ...reviewsList]);

    const newReviewsCount = product.reviewsCount + 1;
    const totalRatingSum = (product.rating * product.reviewsCount) + reviewRating;
    const newAverageRating = parseFloat((totalRatingSum / newReviewsCount).toFixed(1));

    setProducts(products.map(p => {
      if (p.id === product.id) {
        return {
          ...p,
          reviewsCount: newReviewsCount,
          rating: newAverageRating
        };
      }
      return p;
    }));

    setReviewName('');
    setReviewRating(5);
    setReviewComment('');
    addToast('Review submitted! Product ratings recalculated.', 'success');
  };

  const handleBuyNow = () => {
    addToCart(product);
    setCurrentPage('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const imageOptions = Array.isArray(product.images) && product.images.length > 0
    ? product.images
    : [
        product.image || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1504893524553-ac55fce698be?auto=format&fit=crop&w=600&q=80"
      ];

  return (
    <div className="main-content-layout" style={{ animation: 'fadeIn 0.5s ease-out', marginTop: '20px', paddingBottom: '60px' }}>
      
      {/* Back button */}
      <button 
        className="btn btn-secondary btn-sm" 
        style={{ marginBottom: '20px', textTransform: 'uppercase', fontWeight: 700 }}
        onClick={() => setCurrentPage('shop')}
      >
        <ArrowLeft size={14} /> Back to Catalog
      </button>

      {/* Flipkart detail grid split */}
      <div className="detail-page-container">
        {/* Left Side: Images Gallery & Sticky Buttons */}
        <div className="detail-gallery-side">
          <div className="detail-img-box">
            <img src={imageOptions[activeThumb]} alt={product.name} />
          </div>

          {/* Gallery Thumbnails */}
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
            {imageOptions.map((img, idx) => (
              <div 
                key={idx}
                style={{
                  width: '60px',
                  height: '60px',
                  border: activeThumb === idx ? '2px solid var(--accent-gold)' : '1px solid var(--border-muted)',
                  padding: '4px',
                  backgroundColor: '#ffffff',
                  cursor: 'pointer',
                  borderRadius: 'var(--radius-xs)'
                }}
                onClick={() => setActiveThumb(idx)}
              >
                <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              </div>
            ))}
          </div>

          {/* E-Star Action Buttons */}
          <div className="detail-action-buttons">
            <button
              className="btn btn-add-to-cart"
              style={{ fontSize: '1rem', padding: '16px', flex: 1, display: 'flex', gap: '8px', justifyContent: 'center', alignItems: 'center' }}
              disabled={isOutOfStock}
              onClick={() => addToCart(product)}
            >
              <ShoppingBag size={18} /> ADD TO CART
            </button>
            <button
              className="btn btn-buy-now"
              style={{ fontSize: '1rem', padding: '16px', flex: 1, display: 'flex', gap: '8px', justifyContent: 'center', alignItems: 'center' }}
              disabled={isOutOfStock}
              onClick={handleBuyNow}
            >
              <Play size={18} fill="currentColor" /> BUY NOW
            </button>
          </div>
        </div>

        {/* Right Side: Details Information */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--flipkart-blue)', fontWeight: 800, textTransform: 'uppercase' }}>
              {product.category}
            </span>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 700, margin: '6px 0 10px', lineHeight: '1.3' }}>
              {product.name}
            </h1>

            {/* Ratings and Reviews Strip */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span className="ratings-badge">
                {product.rating} <Star size={10} fill="currentColor" />
              </span>
              <span style={{ fontSize: '0.88rem', color: 'var(--text-muted)', fontWeight: 700 }}>
                {product.reviewsCount} Ratings & Reviews
              </span>
              
              <span className="assured-badge" style={{ marginLeft: '10px' }}>
                ★ Star Certified
              </span>
            </div>
          </div>

          {/* Pricing Box */}
          <div style={{
            borderBottom: '1px solid var(--border-muted)',
            paddingBottom: '16px',
            display: 'flex',
            alignItems: 'baseline',
            gap: '12px',
            flexWrap: 'wrap'
          }}>
             <span style={{ fontSize: '2rem', fontWeight: 800 }}>
              ₹{Math.round(discountedPrice).toLocaleString('en-IN')}
            </span>
            {product.offer > 0 && (
              <>
                <span style={{ fontSize: '1.1rem', textDecoration: 'line-through', color: 'var(--text-muted)' }}>
                  ₹{Math.round(product.price).toLocaleString('en-IN')}
                </span>
                <span style={{ color: 'var(--flipkart-green)', fontWeight: 800, fontSize: '1.1rem' }}>
                  {product.offer}% off
                </span>
              </>
            )}
          </div>

          {/* Product Description */}
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '8px' }}>Product Overview</h3>
            <p style={{ fontSize: '0.92rem', color: 'var(--text-sub)', lineHeight: '1.6' }}>{product.description}</p>
          </div>

          {/* Stock availability */}
          <div style={{
            padding: '14px 20px',
            backgroundColor: 'var(--bg-app)',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-muted)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--text-sub)' }}>
              Stock Availability:
            </span>
            <span style={{ fontWeight: 800, color: isOutOfStock ? 'var(--danger)' : 'var(--success)' }}>
              {isOutOfStock ? 'TEMPORARILY SOLD OUT' : `${product.stock} units left in stock`}
            </span>
          </div>

          {/* Warranties */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginTop: '10px' }}>
            <div style={{ padding: '14px', border: '1px solid var(--border-muted)', borderRadius: 'var(--radius-sm)', textAlign: 'center', backgroundColor: '#ffffff' }}>
              <ShieldCheck size={20} style={{ color: 'var(--primary-navy)', margin: '0 auto 6px' }} />
              <div style={{ fontSize: '0.75rem', fontWeight: 800 }}>2 Year Warranty</div>
            </div>
            <div style={{ padding: '14px', border: '1px solid var(--border-muted)', borderRadius: 'var(--radius-sm)', textAlign: 'center', backgroundColor: '#ffffff' }}>
              <Truck size={20} style={{ color: 'var(--primary-navy)', margin: '0 auto 6px' }} />
              <div style={{ fontSize: '0.75rem', fontWeight: 800 }}>Free Delivery</div>
            </div>
            <div style={{ padding: '14px', border: '1px solid var(--border-muted)', borderRadius: 'var(--radius-sm)', textAlign: 'center', backgroundColor: '#ffffff' }}>
              <Award size={20} style={{ color: 'var(--primary-navy)', margin: '0 auto 6px' }} />
              <div style={{ fontSize: '0.75rem', fontWeight: 800 }}>100% Secure SSL</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs list (Specs, FAQs, Reviews) */}
      <section className="tabs-wrapper" style={{ marginTop: '24px' }}>
        <div className="tabs-header">
          <button 
            className={`tab-btn ${activeTab === 'specs' ? 'active' : ''}`}
            onClick={() => setActiveTab('specs')}
          >
            Product Specifications
          </button>
          <button 
            className={`tab-btn ${activeTab === 'faq' ? 'active' : ''}`}
            onClick={() => setActiveTab('faq')}
          >
            Fulfillment FAQs
          </button>
          <button 
            className={`tab-btn ${activeTab === 'reviews' ? 'active' : ''}`}
            onClick={() => setActiveTab('reviews')}
          >
            Customer Reviews ({product.reviewsCount})
          </button>
        </div>

        <div className="tab-contents" style={{ marginTop: '20px' }}>
          {/* TAB 1: SPECS */}
          {activeTab === 'specs' && (
            <div style={{
              backgroundColor: '#ffffff',
              border: '1px solid var(--border-muted)',
              borderRadius: 'var(--radius-sm)',
              overflow: 'hidden'
            }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
                <tbody>
                  {product.specs && product.specs.map((spec, idx) => (
                    <tr key={idx} style={{ borderBottom: idx === product.specs.length - 1 ? 'none' : '1px solid var(--border-muted)' }}>
                      <td style={{ padding: '14px 24px', fontWeight: 800, color: 'var(--text-sub)', width: '30%', backgroundColor: 'var(--bg-app)' }}>Specification #{idx + 1}</td>
                      <td style={{ padding: '14px 24px', color: 'var(--text-main)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Check size={14} style={{ color: 'var(--success)' }} />
                          <span>{spec}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* TAB 2: FAQ */}
          {activeTab === 'faq' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { q: "Is shipping integrated directly with standard local carriers?", a: "Yes. Once checkout orders are placed, tracking logs will automatically trigger carrier APIs, projecting delivery updates directly on your dashboard account pages." },
                { q: "What protocols are guaranteed if hardware faults manifest?", a: "E-Star guarantees full cover for two consecutive years. Contact repair hubs directly or file return templates inside customer dashboard sheets." },
                { q: "Can custom coupon codes be adjusted under Admin systems?", a: "Absolutely. Active merchant consoles have direct capabilities to launch promotional campaigns and adjust individual product offer sliders immediately." }
              ].map((faq, idx) => (
                <div key={idx} style={{ padding: '16px 20px', backgroundColor: '#ffffff', border: '1px solid var(--border-muted)', borderRadius: 'var(--radius-sm)', cursor: 'pointer' }} onClick={() => toggleFaq(idx)}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ fontSize: '0.92rem', fontWeight: 800 }}>{faq.q}</h3>
                    {faqOpen[idx] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </div>
                  {faqOpen[idx] && (
                    <p style={{ marginTop: '10px', fontSize: '0.85rem', color: 'var(--text-sub)' }}>{faq.a}</p>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: REVIEWS */}
          {activeTab === 'reviews' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '30px' }}>
              {/* Reviews Feed */}
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '16px' }}>Feedback Ratings</h3>
                {reviewsList.length === 0 ? (
                  <p style={{ color: 'var(--text-muted)' }}>No customer feedbacks registered for this item yet.</p>
                ) : (
                  reviewsList.map((rev, idx) => (
                    <div key={idx} style={{ backgroundColor: '#ffffff', border: '1px solid var(--border-muted)', borderRadius: 'var(--radius-sm)', padding: '16px', marginBottom: '12px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span className="ratings-badge" style={{ fontSize: '0.7rem', padding: '1px 4px' }}>
                            {rev.rating} ★
                          </span>
                          <span style={{ fontWeight: 800, fontSize: '0.88rem' }}>{rev.name}</span>
                        </div>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{rev.date}</span>
                      </div>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-sub)', marginTop: '8px' }}>{rev.comment}</p>
                    </div>
                  ))
                )}
              </div>

              {/* Submit Feedback */}
              <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--border-muted)', borderRadius: 'var(--radius-sm)', padding: '20px', height: 'fit-content' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '16px' }}>Submit Your Rating</h3>
                
                <form onSubmit={handleReviewSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div className="form-group">
                    <label style={{ fontSize: '0.8rem', fontWeight: 800 }}>Your Name *</label>
                    <input 
                      type="text" 
                      required 
                      placeholder="e.g. Rahul Gupta"
                      style={{
                        padding: '8px 12px',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--border-muted)',
                        backgroundColor: 'var(--bg-app)',
                        color: 'var(--text-main)',
                        outline: 'none',
                        fontSize: '0.85rem',
                        marginTop: '4px'
                      }}
                      value={reviewName}
                      onChange={(e) => setReviewName(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label style={{ fontSize: '0.8rem', fontWeight: 800, display: 'block', marginBottom: '4px' }}>Your Rating *</label>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          size={18}
                          style={{
                            cursor: 'pointer',
                            color: star <= reviewRating ? 'var(--accent-gold)' : 'var(--text-muted)'
                          }}
                          fill={star <= reviewRating ? 'currentColor' : 'none'}
                          onClick={() => setReviewRating(star)}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="form-group">
                    <label style={{ fontSize: '0.8rem', fontWeight: 800 }}>Review Comments *</label>
                    <textarea 
                      rows="3" 
                      required
                      placeholder="Detail your hardware testing or specs experience..."
                      style={{
                        padding: '8px 12px',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--border-muted)',
                        backgroundColor: 'var(--bg-app)',
                        color: 'var(--text-main)',
                        outline: 'none',
                        fontFamily: 'var(--font-sans)',
                        fontSize: '0.85rem',
                        resize: 'none',
                        marginTop: '4px'
                      }}
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                    />
                  </div>

                  <button type="submit" className="btn btn-primary btn-sm" style={{ width: '100%', marginTop: '6px' }}>
                    <Plus size={14} /> Submit Feedback
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
