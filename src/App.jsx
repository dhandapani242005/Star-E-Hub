import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Shop from './components/Shop';
import ProductDetail from './components/ProductDetail';
import CartCheckout from './components/CartCheckout';
import CustomerAccount from './components/CustomerAccount';
import AdminPortal from './components/AdminPortal';
import { initialProducts, defaultProducts } from './data/initialProducts';
import { LuSparkles, LuX, LuShieldAlert } from 'react-icons/lu';
import { db, auth } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, onSnapshot, doc, setDoc, deleteDoc, getDoc, query, where } from 'firebase/firestore';
import AuthPage from './components/AuthPage';

function App() {
  // ----------------------------------------------------
  // 1. Dark Mode State & Initialization
  // ----------------------------------------------------
  const [darkMode, setDarkMode] = useState(() => {
    const localTheme = localStorage.getItem('e-star-theme');
    if (localTheme) {
      return localTheme === 'dark';
    }
    return false; // Default to Light theme
  });

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-theme');
      localStorage.setItem('e-star-theme', 'dark');
    } else {
      document.body.classList.remove('dark-theme');
      localStorage.setItem('e-star-theme', 'light');
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // ----------------------------------------------------
  // Custom notification Toast system (moved up)
  // ----------------------------------------------------
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'info') => {
    const id = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    setToasts((prevToasts) => [...prevToasts, { id, message, type }]);
    
    // Auto-remove after 4 seconds
    setTimeout(() => {
      setToasts((prevToasts) => prevToasts.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts((prevToasts) => prevToasts.filter((t) => t.id !== id));
  };

  // ----------------------------------------------------
  // Authentication & RBAC User State
  // ----------------------------------------------------
  const [currentUser, setCurrentUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setAuthLoading(true);
      if (user) {
        try {
          const userDocRef = doc(db, 'users', user.uid);
          const userDocSnap = await getDoc(userDocRef);
          if (userDocSnap.exists()) {
            const data = userDocSnap.data();
            setCurrentUser({
              uid: user.uid,
              email: user.email,
              name: data.name || user.email.split('@')[0],
              role: data.role || 'user',
              phone: data.phone || '',
              city: data.city || '',
              addresses: data.addresses || [],
              paymentDetails: data.paymentDetails || [],
              createdAt: data.createdAt || new Date().toISOString()
            });
          } else {
            const profile = {
              uid: user.uid,
              name: user.email.split('@')[0],
              email: user.email,
              role: 'user',
              phone: '',
              city: '',
              addresses: [],
              paymentDetails: [],
              createdAt: new Date().toISOString()
            };
            await setDoc(userDocRef, profile);
            setCurrentUser(profile);
          }
        } catch (err) {
          console.error("Error fetching user profile:", err);
          setCurrentUser({
            uid: user.uid,
            email: user.email,
            name: user.email.split('@')[0],
            role: 'user',
            phone: '',
            city: '',
            addresses: [],
            paymentDetails: [],
            createdAt: new Date().toISOString()
          });
        }
      } else {
        setCurrentUser(null);
      }
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setCurrentUser(null);
      setCurrentPage('home');
      addToast('Successfully logged out.', 'success');
    } catch (err) {
      addToast('Failed to log out.', 'danger');
    }
  };

  const handleUpdateProfile = async (updatedFields) => {
    if (!currentUser) return;
    try {
      const userDocRef = doc(db, 'users', currentUser.uid);
      await setDoc(userDocRef, updatedFields, { merge: true });
      
      setCurrentUser(prev => ({
        ...prev,
        ...updatedFields
      }));
      addToast('Profile updated successfully! ✦', 'success');
    } catch (err) {
      console.error("Error updating profile:", err);
      addToast('Failed to update profile details.', 'danger');
    }
  };

  // ----------------------------------------------------
  // 2. Core Inventory State (Persisted in Firestore)
  // ----------------------------------------------------
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  // Sync products with Firestore
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'products'), (snapshot) => {
      const fetched = [];
      snapshot.forEach((doc) => {
        fetched.push({ id: doc.id, ...doc.data() });
      });
      setProducts(fetched);
      setLoadingProducts(false);
    }, (error) => {
      console.error("Firestore sync error:", error);
      setLoadingProducts(false);
    });

    return () => unsubscribe();
  }, []);

  const handleSetProducts = async (value) => {
    let nextProducts;
    if (typeof value === 'function') {
      nextProducts = value(products);
    } else {
      nextProducts = value;
    }

    // Optimistically update the state
    setProducts(nextProducts);

    try {
      const prevMap = new Map(products.map(p => [p.id, p]));
      const nextMap = new Map(nextProducts.map(p => [p.id, p]));

      // 1. Detect deletions
      for (const [id, prev] of prevMap.entries()) {
        if (!nextMap.has(id)) {
          await deleteDoc(doc(db, 'products', id));
        }
      }

      // 2. Detect additions & updates
      for (const [id, next] of nextMap.entries()) {
        const prev = prevMap.get(id);
        if (!prev || JSON.stringify(prev) !== JSON.stringify(next)) {
          await setDoc(doc(db, 'products', id), next);
        }
      }
    } catch (e) {
      console.error("Firestore write error:", e);
      addToast("Failed to sync change to cloud database.", "warning");
    }
  };

  const seedDefaultCatalog = async () => {
    setLoadingProducts(true);
    try {
      for (const product of defaultProducts) {
        await setDoc(doc(db, 'products', product.id), product);
      }
      addToast("Successfully seeded the default product catalog in the cloud!", "success");
    } catch (err) {
      console.error("Error seeding default catalog:", err);
      addToast("Failed to seed default catalog.", "danger");
    } finally {
      setLoadingProducts(false);
    }
  };

  // ----------------------------------------------------
  // 3. Cart & Transactions State (Persisted in LocalStorage)
  // ----------------------------------------------------
  const [cart, setCart] = useState(() => {
    const guestCart = localStorage.getItem('guest-cart') || localStorage.getItem('e-star-cart');
    let loadedCart = guestCart ? JSON.parse(guestCart) : [];
    localStorage.removeItem('e-star-cart'); // Remove legacy key to prevent pollution
    if (loadedCart.length > 0 && loadedCart.some(item => item.price < 1000)) {
      loadedCart = loadedCart.map(item => ({
        ...item,
        price: item.price * 80
      }));
    }
    // Ensure unique IDs in cart
    const seenCartIds = new Set();
    const uniqueCart = [];
    loadedCart.forEach(item => {
      let finalId = item.id;
      if (!finalId || seenCartIds.has(finalId)) {
        finalId = `${item.id || 'item'}-${Math.floor(Math.random() * 1000000)}`;
      }
      seenCartIds.add(finalId);
      uniqueCart.push({ ...item, id: finalId });
    });
    return uniqueCart;
  });

  // Auto-save Cart changes to Firestore & LocalStorage
  useEffect(() => {
    if (currentUser) {
      const userDocRef = doc(db, 'user_data', currentUser.uid);
      getDoc(userDocRef).then((docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (JSON.stringify(data.cart) !== JSON.stringify(cart)) {
            setDoc(userDocRef, { cart }, { merge: true }).catch(err => console.error("Cart sync error:", err));
          }
        } else {
          setDoc(userDocRef, { cart }, { merge: true }).catch(err => console.error("Cart init error:", err));
        }
      });
    } else {
      localStorage.setItem('guest-cart', JSON.stringify(cart));
    }
  }, [cart, currentUser]);

  const [orders, setOrders] = useState(() => {
    const guestOrders = localStorage.getItem('guest-orders') || localStorage.getItem('e-star-orders');
    let loadedOrders = guestOrders ? JSON.parse(guestOrders) : [];
    localStorage.removeItem('e-star-orders'); // Remove legacy key to prevent pollution
    if (loadedOrders.length > 0 && loadedOrders.some(order => order.total < 1000)) {
      loadedOrders = loadedOrders.map(order => ({
        ...order,
        total: order.total * 80,
        items: order.items.map(item => ({
          ...item,
          price: item.price * 80
        }))
      }));
    }
    // Ensure all orders and order items have completely unique IDs
    const seenOrderIds = new Set();
    const uniqueOrders = [];
    loadedOrders.forEach(order => {
      let finalOrderId = order.id;
      if (!finalOrderId || seenOrderIds.has(finalOrderId)) {
        finalOrderId = `order-${Date.now()}-${Math.floor(Math.random() * 1000000)}`;
      }
      seenOrderIds.add(finalOrderId);

      const seenItemIds = new Set();
      const uniqueItems = [];
      (order.items || []).forEach(item => {
        let finalItemId = item.id;
        if (!finalItemId || seenItemIds.has(finalItemId)) {
          finalItemId = `${item.id || 'item'}-${Math.floor(Math.random() * 1000000)}`;
        }
        seenItemIds.add(finalItemId);
        uniqueItems.push({ ...item, id: finalItemId });
      });

      uniqueOrders.push({ ...order, id: finalOrderId, items: uniqueItems });
    });
    return uniqueOrders;
  });

  // Guest orders local storage backup
  useEffect(() => {
    if (!currentUser) {
      localStorage.setItem('guest-orders', JSON.stringify(orders));
    }
  }, [orders, currentUser]);

  // ----------------------------------------------------
  // 4. Dynamic CMS Storefront Customizer State (Saved in LocalStorage)
  // ----------------------------------------------------
  const [banners, setBanners] = useState(() => {
    const localBanners = localStorage.getItem('e-star-banners');
    const defaultBanners = [
      {
        title: "CP Plus Advanced Surveillance Systems",
        subtitle: "Premium 4MP Dome & Bullet Cameras, 4/6 Channel DVRs & Solar AI Security",
        tag: "OFFICIAL CP-PLUS PARTNER",
        btnText: "EXPLORE SURVEILLANCE RANGE",
        img: "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=1200&q=80"
      },
      {
        title: "Smart Home Revolution",
        subtitle: "Up to 50% Off on Voice Hubs, DreamColor LEDs & Smart Valves",
        tag: "BIG TECH SALE",
        btnText: "SHOP GADGETS NOW",
        img: "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=1200&q=80"
      },
      {
        title: "Residential Defenses & AI Security",
        subtitle: "Protect Your Premises with Biometric Latches & Night-Vision Cameras",
        tag: "SAFETY GUARANTEED",
        btnText: "UPGRADE SECURITY",
        img: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80"
      },
      {
        title: "High Performance STEM & Computer Gear",
        subtitle: "Split Mechanical Keyboards, Dual Buggies & STEM Robotics Kit",
        tag: "CREATIVE LEARNING",
        btnText: "EXPLORE ACCESSORIES",
        img: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80"
      }
    ];

    if (localBanners) {
      try {
        const parsed = JSON.parse(localBanners);
        const filtered = parsed.filter(b => !b.title.includes("CP Plus"));
        return [defaultBanners[0], ...filtered];
      } catch (e) {
        return defaultBanners;
      }
    }
    return defaultBanners;
  });

  useEffect(() => {
    localStorage.setItem('e-star-banners', JSON.stringify(banners));
  }, [banners]);

  const [coupons, setCoupons] = useState(() => {
    const localCoupons = localStorage.getItem('e-star-coupons');
    if (localCoupons) return JSON.parse(localCoupons);
    return [
      { code: 'STAR10', discount: 10, description: 'Extra 10% off storewide' },
      { code: 'WELCOME5', discount: 5, description: 'Welcome 5% discount' }
    ];
  });

  useEffect(() => {
    localStorage.setItem('e-star-coupons', JSON.stringify(coupons));
  }, [coupons]);

  const [brandingColors, setBrandingColors] = useState(() => {
    const localBranding = localStorage.getItem('e-star-branding');
    if (localBranding) return JSON.parse(localBranding);
    return {
      primaryNavy: '#091E36',
      primaryNavyLight: '#0d2c4f',
      accentGold: '#F2A900',
      accentGoldHover: '#d49300',
      accentGoldBg: 'rgba(242, 169, 0, 0.08)'
    };
  });

  useEffect(() => {
    localStorage.setItem('e-star-branding', JSON.stringify(brandingColors));
    // Apply real-time custom branding color tokens dynamically!
    const root = document.documentElement;
    root.style.setProperty('--primary-navy', brandingColors.primaryNavy);
    root.style.setProperty('--primary-navy-light', brandingColors.primaryNavyLight || '#0d2c4f');
    root.style.setProperty('--accent-gold', brandingColors.accentGold);
    root.style.setProperty('--accent-gold-hover', brandingColors.accentGoldHover || '#d49300');
    root.style.setProperty('--accent-gold-bg', brandingColors.accentGoldBg || 'rgba(242, 169, 0, 0.08)');
  }, [brandingColors]);

  const [flashTimer, setFlashTimer] = useState(() => {
    const localTimer = localStorage.getItem('e-star-flash-timer');
    if (localTimer) return JSON.parse(localTimer);
    return { hours: 12, minutes: 42, seconds: 19 };
  });

  useEffect(() => {
    localStorage.setItem('e-star-flash-timer', JSON.stringify(flashTimer));
  }, [flashTimer]);

  // ----------------------------------------------------
  // 5. Pro Multi-Page Routing & Search States
  // ----------------------------------------------------
  const [currentPage, setCurrentPage] = useState('home'); // 'home', 'shop', 'product-detail', 'cart', 'checkout', 'account', 'admin'
  const [selectedProductId, setSelectedProductId] = useState(null);
  
  const [wishlist, setWishlist] = useState(() => {
    const guestWishlist = localStorage.getItem('guest-wishlist') || localStorage.getItem('e-star-wishlist');
    localStorage.removeItem('e-star-wishlist'); // Remove legacy key to prevent pollution
    return guestWishlist ? JSON.parse(guestWishlist) : {};
  });

  // Auto-save Wishlist changes to Firestore & LocalStorage
  useEffect(() => {
    if (currentUser) {
      const userDocRef = doc(db, 'user_data', currentUser.uid);
      getDoc(userDocRef).then((docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (JSON.stringify(data.wishlist) !== JSON.stringify(wishlist)) {
            setDoc(userDocRef, { wishlist }, { merge: true }).catch(err => console.error("Wishlist sync error:", err));
          }
        } else {
          setDoc(userDocRef, { wishlist }, { merge: true }).catch(err => console.error("Wishlist init error:", err));
        }
      });
    } else {
      localStorage.setItem('guest-wishlist', JSON.stringify(wishlist));
    }
  }, [wishlist, currentUser]);

  // Sync user-specific Cart, Wishlist, and Orders from Firestore upon Login/Logout
  useEffect(() => {
    if (!currentUser) {
      const guestCart = localStorage.getItem('guest-cart');
      const guestWishlist = localStorage.getItem('guest-wishlist');
      const guestOrders = localStorage.getItem('guest-orders');
      setCart(guestCart ? JSON.parse(guestCart) : []);
      setWishlist(guestWishlist ? JSON.parse(guestWishlist) : {});
      setOrders(guestOrders ? JSON.parse(guestOrders) : []);
      return;
    }

    // 1. Fetch user data (Cart & Wishlist)
    const userDocRef = doc(db, 'user_data', currentUser.uid);
    const unsubscribeUser = onSnapshot(userDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.cart !== undefined) {
          setCart(prev => JSON.stringify(prev) !== JSON.stringify(data.cart) ? data.cart : prev);
        }
        if (data.wishlist !== undefined) {
          setWishlist(prev => JSON.stringify(prev) !== JSON.stringify(data.wishlist) ? data.wishlist : prev);
        }
      } else {
        // Seeding database with current guest data on first user login
        const guestCart = localStorage.getItem('guest-cart');
        const guestWishlist = localStorage.getItem('guest-wishlist');
        const initialCart = guestCart ? JSON.parse(guestCart) : [];
        const initialWishlist = guestWishlist ? JSON.parse(guestWishlist) : {};

        setDoc(userDocRef, {
          cart: initialCart,
          wishlist: initialWishlist,
          email: currentUser.email,
          updatedAt: new Date().toISOString()
        }).catch(err => console.error("Error creating user data:", err));
      }
    }, (err) => {
      console.error("User data snapshot error:", err);
    });

    // 2. Fetch/listen to Orders based on role (Admin sees all, User sees own)
    let q;
    if (currentUser.role === 'admin') {
      q = query(collection(db, 'orders'));
    } else {
      q = query(collection(db, 'orders'), where('userId', '==', currentUser.uid));
    }

    const unsubscribeOrders = onSnapshot(q, (snapshot) => {
      const fetched = [];
      snapshot.forEach((doc) => {
        fetched.push({ id: doc.id, ...doc.data() });
      });
      fetched.sort((a, b) => new Date(b.createdAt || b.timestamp) - new Date(a.createdAt || a.timestamp));
      setOrders(fetched);
    }, (err) => {
      console.error("Orders sync error:", err);
    });

    return () => {
      unsubscribeUser();
      unsubscribeOrders();
    };
  }, [currentUser]);

  const toggleWishlist = (productId) => {
    setWishlist(prev => {
      const isCurrentlyWishlisted = !!prev[productId];
      const updated = { ...prev, [productId]: !isCurrentlyWishlisted };
      if (!isCurrentlyWishlisted) {
        addToast('Product added to Wishlist! ✦', 'success');
      } else {
        addToast('Product removed from Wishlist.', 'info');
      }
      return updated;
    });
  };

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Add to cart helper wired globally
  const handleAddToCart = (product) => {
    if (product.stock <= 0) {
      addToast('Sorry, this product is currently out of stock!', 'warning');
      return;
    }

    const existingCartItem = cart.find(item => item.id === product.id);
    const currentQtyInCart = existingCartItem ? existingCartItem.quantity : 0;

    if (currentQtyInCart >= product.stock) {
      addToast(`Only ${product.stock} units available in stock!`, 'warning');
      return;
    }

    if (existingCartItem) {
      setCart(cart.map(item => 
        item.id === product.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
    
    addToast(`${product.name} added to your cart!`, 'success');
  };

  // ----------------------------------------------------
  // 7. Checkout Order Placed Stock deductions
  // ----------------------------------------------------
  const handlePlaceOrder = async (orderDetails) => {
    const orderWithUser = {
      ...orderDetails,
      userId: currentUser ? currentUser.uid : 'guest',
      createdAt: new Date().toISOString()
    };

    try {
      // Save order to global Firestore orders collection
      await setDoc(doc(db, 'orders', orderDetails.id), orderWithUser);
      
      // For guest, also update state & local storage
      if (!currentUser) {
        const updatedOrders = [orderWithUser, ...orders];
        setOrders(updatedOrders);
        localStorage.setItem('e-star-orders', JSON.stringify(updatedOrders));
      }
    } catch (err) {
      console.error("Error saving order:", err);
      addToast("Failed to save order transaction to cloud.", "danger");
    }

    // DEDUCT QUANTITIES FROM LIVE INVENTORY AUTOMATICALLY!
    setProducts(prevProducts => {
      return prevProducts.map(inventoryItem => {
        const cartItemMatch = orderDetails.items.find(ci => ci.id === inventoryItem.id);
        if (cartItemMatch) {
          const updatedStock = Math.max(0, inventoryItem.stock - cartItemMatch.quantity);
          
          // Trigger stock alerts
          if (updatedStock === 0) {
            setTimeout(() => {
              addToast(`Alert: ${inventoryItem.name} is now completely Out of Stock!`, 'warning');
            }, 600);
          } else if (updatedStock <= 5) {
            setTimeout(() => {
              addToast(`Alert: ${inventoryItem.name} is running critically low (${updatedStock} units left)!`, 'warning');
            }, 600);
          }

          return { ...inventoryItem, stock: updatedStock };
        }
        return inventoryItem;
      });
    });

    addToast(`Order #${orderDetails.id} placed successfully! Thank you for shopping.`, 'success');
  };

  // ----------------------------------------------------
  // Render Active Screen Component
  // ----------------------------------------------------
  const renderPage = () => {
    if (authLoading) {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: '16px' }}>
          <div className="spinner" style={{
            width: '50px',
            height: '50px',
            border: '5px solid var(--accent-gold-bg)',
            borderTop: '5px solid var(--accent-gold)',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
          <p style={{ color: 'var(--text-sub)', fontWeight: 700 }}>Verifying credentials and security tokens...</p>
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      );
    }

    if (loadingProducts) {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: '16px' }}>
          <div className="spinner" style={{
            width: '50px',
            height: '50px',
            border: '5px solid var(--accent-gold-bg)',
            borderTop: '5px solid var(--accent-gold)',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
          <p style={{ color: 'var(--text-sub)', fontWeight: 700 }}>Synchronizing with E-Star Cloud Database...</p>
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      );
    }

    switch (currentPage) {
      case 'auth':
        return (
          <AuthPage
            onLoginSuccess={(user) => {
              setCurrentUser(user);
              setCurrentPage('home');
            }}
            addToast={addToast}
          />
        );
      case 'home':
        return (
          <Home
            products={products}
            setCurrentPage={setCurrentPage}
            setSelectedProductId={setSelectedProductId}
            setSelectedCategory={setSelectedCategory}
            banners={banners}
            flashTimer={flashTimer}
            addToCart={handleAddToCart}
            wishlist={wishlist}
            toggleWishlist={toggleWishlist}
          />
        );
      case 'shop':
        return (
          <Shop
            products={products}
            cart={cart}
            addToCart={handleAddToCart}
            setCurrentPage={setCurrentPage}
            setSelectedProductId={setSelectedProductId}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            wishlist={wishlist}
            toggleWishlist={toggleWishlist}
          />
        );
      case 'product-detail':
        return (
          <ProductDetail
            productId={selectedProductId}
            products={products}
            setProducts={handleSetProducts}
            addToCart={handleAddToCart}
            setCurrentPage={setCurrentPage}
            addToast={addToast}
          />
        );
      case 'cart':
      case 'checkout':
        return (
          <CartCheckout
            cart={cart}
            setCart={setCart}
            products={products}
            onPlaceOrder={handlePlaceOrder}
            addToast={addToast}
            setCurrentPage={setCurrentPage}
            coupons={coupons}
            currentUser={currentUser}
          />
        );
      case 'account':
        if (!currentUser) {
          return (
            <AuthPage
              onLoginSuccess={(user) => {
                setCurrentUser(user);
                setCurrentPage('account');
              }}
              addToast={addToast}
            />
          );
        }
        return (
          <CustomerAccount
            orders={orders}
            setCurrentPage={setCurrentPage}
            currentUser={currentUser}
            onUpdateProfile={handleUpdateProfile}
          />
        );
      case 'admin':
        if (!currentUser) {
          return (
            <AuthPage
              onLoginSuccess={(user) => {
                setCurrentUser(user);
                if (user.role === 'admin') {
                  setCurrentPage('admin');
                } else {
                  setCurrentPage('home');
                }
              }}
              addToast={addToast}
            />
          );
        }
        if (currentUser.role !== 'admin') {
          return (
            <div style={{ textAlign: 'center', padding: '100px 20px', maxWidth: '500px', margin: '0 auto', animation: 'fadeIn 0.5s ease-out' }}>
              <LuShieldAlert size={64} style={{ color: '#ef4444', marginBottom: '20px' }} />
              <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Access Denied</h2>
              <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>
                This console is restricted to E-Star Merchant Executives. Your account role ({currentUser.role}) does not possess elevated console privileges.
              </p>
              <button className="btn btn-primary" style={{ marginTop: '24px' }} onClick={() => setCurrentPage('home')}>
                Return to Storefront
              </button>
            </div>
          );
        }
        return (
          <AdminPortal
            products={products}
            setProducts={handleSetProducts}
            orders={orders}
            setOrders={setOrders}
            addToast={addToast}
            banners={banners}
            setBanners={setBanners}
            coupons={coupons}
            setCoupons={setCoupons}
            brandingColors={brandingColors}
            setBrandingColors={setBrandingColors}
            flashTimer={flashTimer}
            setFlashTimer={setFlashTimer}
            seedDefaultCatalog={seedDefaultCatalog}
          />
        );
      default:
        return (
          <Home
            products={products}
            setCurrentPage={setCurrentPage}
            setSelectedProductId={setSelectedProductId}
            setSelectedCategory={setSelectedCategory}
            banners={banners}
            flashTimer={flashTimer}
            addToCart={handleAddToCart}
          />
        );
    }
  };

  return (
    <div className="app-container">
      {/* 1. Flipkart-style Top Brand Bar */}
      <Navbar
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        wishlistCount={Object.values(wishlist).filter(Boolean).length}
        setSelectedCategory={setSelectedCategory}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      {/* 2. Page Router segment */}
      <div style={{ flexGrow: 1 }}>
        {renderPage()}
      </div>

      {/* 3. Global Floating Toasts */}
      <div className="toast-container">
        {toasts.map((toast) => (
          <div key={toast.id} className={`toast toast-${toast.type}`} onClick={() => removeToast(toast.id)}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <LuSparkles size={16} />
              <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>{toast.message}</span>
            </div>
            <LuX size={14} style={{ marginLeft: 'auto', cursor: 'pointer', opacity: 0.7 }} />
          </div>
        ))}
      </div>

      {/* 4. Flipkart-style professional footer */}
      <footer style={{
        marginTop: '60px',
        borderTop: '1px solid var(--border-muted)',
        padding: '40px 0',
        textAlign: 'center',
        backgroundColor: 'var(--primary-navy)',
        color: '#ffffff'
      }}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          <div style={{ display: 'inline-flex', width: '28px', height: '28px', backgroundColor: 'var(--accent-gold)', color: 'var(--primary-navy)', alignItems: 'center', justifyContent: 'center', fontWeight: 900, borderRadius: '4px' }}>E</div>
          <span className="logo-text" style={{ fontSize: '1.3rem', color: '#ffffff' }}>
            E-<span style={{ color: 'var(--accent-gold)' }}>Star</span> Store
          </span>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap', fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '16px' }}>
          <span style={{ cursor: 'pointer' }} onClick={() => { setCurrentPage('home'); window.scrollTo({top:0}); }}>Home</span> • 
          <span style={{ cursor: 'pointer' }} onClick={() => { setCurrentPage('shop'); setSelectedCategory('All'); window.scrollTo({top:0}); }}>Catalog Directory</span> • 
          <span style={{ cursor: 'pointer' }} onClick={() => { setCurrentPage('cart'); window.scrollTo({top:0}); }}>Cart Basket</span> • 
          <span style={{ cursor: 'pointer' }} onClick={() => { setCurrentPage('account'); window.scrollTo({top:0}); }}>My SuperCoins</span> • 
          <span style={{ cursor: 'pointer' }} onClick={() => { setCurrentPage('admin'); window.scrollTo({top:0}); }}>Merchant Console</span>
        </div>

        <p style={{ fontSize: '0.8rem', color: '#9ca3af' }}>
          © {new Date().getFullYear()} E-Star E-Commerce Ltd. Flipkart Navy & Gold custom sandbox platform. Built completely in React JS.
        </p>
      </footer>
    </div>
  );
}

export default App;
