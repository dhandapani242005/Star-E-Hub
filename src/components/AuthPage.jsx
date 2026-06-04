import React, { useState } from 'react';
import { auth, db } from '../firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import {
  LuLock,
  LuMail,
  LuUser,
  LuEye,
  LuEyeOff,
  LuShieldCheck,
  LuTruck,
  LuTag
} from 'react-icons/lu';

export default function AuthPage({ onLoginSuccess, addToast }) {
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('user');

  const handleSignIn = async (e) => {
    e.preventDefault();
    if (!email || !password) { addToast('Please enter both email and password.', 'warning'); return; }
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const userDocRef = doc(db, 'users', user.uid);
      const userDocSnap = await getDoc(userDocRef);
      let userRole = 'user';
      let userName = user.email.split('@')[0];
      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        userRole = userData.role || 'user';
        userName = userData.name || userName;
      } else {
        await setDoc(userDocRef, { name: userName, email: user.email, role: 'user', createdAt: new Date().toISOString() });
      }
      addToast(`Welcome back, ${userName}!`, 'success');
      if (onLoginSuccess) onLoginSuccess({ uid: user.uid, email: user.email, name: userName, role: userRole });
    } catch (error) {
      let errMsg = 'Failed to sign in. Please verify your credentials.';
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') errMsg = 'Invalid email or password.';
      else if (error.code === 'auth/invalid-credential') errMsg = 'Invalid credentials. Please double-check.';
      addToast(errMsg, 'danger');
    } finally { setLoading(false); }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!email || !password || !name) { addToast('Please fill in all registration fields.', 'warning'); return; }
    if (password.length < 6) { addToast('Password must be at least 6 characters long.', 'warning'); return; }
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const userProfile = { uid: user.uid, name, email, role, createdAt: new Date().toISOString() };
      await setDoc(doc(db, 'users', user.uid), userProfile);
      addToast(`Account created! Welcome, ${name}!`, 'success');
      if (onLoginSuccess) onLoginSuccess({ uid: user.uid, email: user.email, name, role });
    } catch (error) {
      let errMsg = 'Registration failed. Please try again.';
      if (error.code === 'auth/email-already-in-use') errMsg = 'This email address is already in use.';
      else if (error.code === 'auth/invalid-email') errMsg = 'Invalid email format.';
      addToast(errMsg, 'danger');
    } finally { setLoading(false); }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const userDocRef = doc(db, 'users', user.uid);
      const userDocSnap = await getDoc(userDocRef);
      let userRole = 'user';
      let userName = user.displayName || user.email.split('@')[0];
      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        userRole = userData.role || 'user';
        userName = userData.name || userName;
      } else {
        await setDoc(userDocRef, { name: userName, email: user.email, role: 'user', createdAt: new Date().toISOString() });
      }
      addToast(`Logged in as ${userName} via Google!`, 'success');
      if (onLoginSuccess) onLoginSuccess({ uid: user.uid, email: user.email, name: userName, role: userRole });
    } catch (error) {
      addToast(`Google authentication failed: ${error.message}`, 'danger');
    } finally { setLoading(false); }
  };

  const handleQuickDemo = async (demoRole) => {
    setLoading(true);
    const demoEmail = demoRole === 'admin' ? 'admin@estar.com' : 'buyer@estar.com';
    const demoPass = 'estar123';
    const demoName = demoRole === 'admin' ? 'Executive Admin' : 'Store Customer';
    try {
      let userCredential;
      try {
        userCredential = await signInWithEmailAndPassword(auth, demoEmail, demoPass);
      } catch (signInErr) {
        if (['auth/user-not-found', 'auth/wrong-password', 'auth/invalid-credential'].includes(signInErr.code)) {
          userCredential = await createUserWithEmailAndPassword(auth, demoEmail, demoPass);
        } else throw signInErr;
      }
      const user = userCredential.user;
      await setDoc(doc(db, 'users', user.uid), { uid: user.uid, name: demoName, email: demoEmail, role: demoRole, createdAt: new Date().toISOString() });
      addToast(`Logged in as Demo ${demoRole.toUpperCase()}!`, 'success');
      if (onLoginSuccess) onLoginSuccess({ uid: user.uid, email: demoEmail, name: demoName, role: demoRole });
    } catch (error) {
      addToast(`Demo login error: ${error.message}`, 'danger');
    } finally { setLoading(false); }
  };

  const inp = {
    width: '100%', padding: '11px 14px 11px 42px',
    border: '1.5px solid #e2e8f0', borderRadius: 9,
    fontSize: '0.92rem', color: '#0f172a',
    outline: 'none', fontFamily: 'var(--font-sans)',
    background: '#fafbfc', transition: 'border-color 0.2s'
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex',
      alignItems: 'center', justifyContent: 'center',
      background: '#f8fafc', fontFamily: 'var(--font-sans)',
      padding: '24px 16px'
    }}>
      {/* Card */}
      <div style={{
        background: '#fff', borderRadius: 20,
        boxShadow: '0 8px 40px rgba(0,0,0,0.10)',
        display: 'grid', gridTemplateColumns: '1fr 1fr',
        maxWidth: 900, width: '100%', overflow: 'hidden'
      }}>
        {/* LEFT: Form */}
        <div style={{ padding: '48px 40px' }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32 }}>
            <div style={{
              width: 36, height: 36,
              background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
              borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <LuTag size={18} color="#fff" />
            </div>
            <span style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a' }}>
              E-<span style={{ color: '#2563eb' }}>Star</span>
            </span>
          </div>

          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', marginBottom: 8 }}>
            {isRegisterMode ? 'Create Account' : 'Welcome back!'}
          </h1>
          <p style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: 28, lineHeight: 1.5 }}>
            {isRegisterMode
              ? 'Register to start shopping with E-Star.'
              : 'Login to access your account and explore top tech products.'}
          </p>

          <form onSubmit={isRegisterMode ? handleSignUp : handleSignIn} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {isRegisterMode && (
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Full Name</label>
                <div style={{ position: 'relative' }}>
                  <LuUser size={16} style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                  <input type="text" placeholder="Enter your name" value={name} onChange={e => setName(e.target.value)} required style={inp}
                    onFocus={e => e.target.style.borderColor = '#2563eb'} onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
                </div>
              </div>
            )}

            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Email address</label>
              <div style={{ position: 'relative' }}>
                <LuMail size={16} style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input type="email" placeholder="Enter your email" value={email} onChange={e => setEmail(e.target.value)} required style={inp}
                  onFocus={e => e.target.style.borderColor = '#2563eb'} onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Password</label>
              <div style={{ position: 'relative' }}>
                <LuLock size={16} style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password} onChange={e => setPassword(e.target.value)} required
                  style={{ ...inp, paddingRight: 42 }}
                  onFocus={e => e.target.style.borderColor = '#2563eb'} onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} style={{
                  position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8'
                }}>
                  {showPassword ? <LuEyeOff size={16} /> : <LuEye size={16} />}
                </button>
              </div>
            </div>

            {isRegisterMode && (
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Account Role</label>
                <select value={role} onChange={e => setRole(e.target.value)} style={{
                  width: '100%', padding: '11px 14px', border: '1.5px solid #e2e8f0',
                  borderRadius: 9, fontSize: '0.92rem', color: '#0f172a',
                  fontFamily: 'var(--font-sans)', background: '#fafbfc', outline: 'none'
                }}>
                  <option value="user">Customer (User)</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>
            )}

            {!isRegisterMode && (
              <div style={{ textAlign: 'right', marginTop: -8 }}>
                <span style={{ fontSize: '0.85rem', color: '#2563eb', fontWeight: 600, cursor: 'pointer' }}>
                  Forgot password?
                </span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', padding: '13px',
                background: loading ? '#93c5fd' : '#2563eb',
                color: '#fff', border: 'none', borderRadius: 9,
                fontWeight: 700, fontSize: '0.95rem', cursor: loading ? 'not-allowed' : 'pointer',
                fontFamily: 'var(--font-sans)', transition: 'background 0.18s',
                marginTop: 4
              }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.background = '#1d4ed8'; }}
              onMouseLeave={e => { if (!loading) e.currentTarget.style.background = '#2563eb'; }}
            >
              {loading ? 'Processing...' : (isRegisterMode ? 'Create Account' : 'Login')}
            </button>
          </form>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '20px 0' }}>
            <div style={{ flex: 1, height: 1, background: '#e2e8f0' }} />
            <span style={{ fontSize: '0.82rem', color: '#94a3b8', fontWeight: 500 }}>or continue with</span>
            <div style={{ flex: 1, height: 1, background: '#e2e8f0' }} />
          </div>

          {/* Social Buttons */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <button
              onClick={handleGoogleSignIn}
              disabled={loading}
              style={{
                padding: '11px', border: '1.5px solid #e2e8f0', borderRadius: 9,
                background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center',
                justifyContent: 'center', gap: 10, fontWeight: 700, fontSize: '0.88rem',
                color: '#374151', fontFamily: 'var(--font-sans)', transition: 'all 0.18s'
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = '#2563eb'}
              onMouseLeave={e => e.currentTarget.style.borderColor = '#e2e8f0'}
            >
              {/* Google G */}
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google
            </button>

            {/* Quick Demo */}
            <button
              onClick={() => handleQuickDemo('user')}
              disabled={loading}
              style={{
                padding: '11px', border: '1.5px solid #e2e8f0', borderRadius: 9,
                background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center',
                justifyContent: 'center', gap: 8, fontWeight: 700, fontSize: '0.88rem',
                color: '#374151', fontFamily: 'var(--font-sans)', transition: 'all 0.18s'
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = '#2563eb'}
              onMouseLeave={e => e.currentTarget.style.borderColor = '#e2e8f0'}
            >
              ⚡ Demo Login
            </button>
          </div>

          {/* Switch mode */}
          <div style={{ textAlign: 'center', marginTop: 24, fontSize: '0.9rem', color: '#64748b' }}>
            {isRegisterMode ? "Already have an account? " : "Don't have an account? "}
            <span
              onClick={() => setIsRegisterMode(!isRegisterMode)}
              style={{ color: '#2563eb', fontWeight: 700, cursor: 'pointer' }}
            >
              {isRegisterMode ? 'Login' : 'Sign up'}
            </span>
          </div>

          {/* Trust badges */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginTop: 28, paddingTop: 20, borderTop: '1px solid #f1f5f9' }}>
            {[
              { icon: <LuShieldCheck size={16} />, label: 'Secure & Safe', sub: 'Your data is always protected' },
              { icon: <LuTruck size={16} />, label: 'Fast Delivery', sub: 'Get orders on time' },
              { icon: <LuTag size={16} />, label: 'Top Quality Products', sub: 'Best brands, best prices' }
            ].map(b => (
              <div key={b.label} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, maxWidth: 120 }}>
                <div style={{ color: '#2563eb', marginTop: 2, flexShrink: 0 }}>{b.icon}</div>
                <div>
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#0f172a' }}>{b.label}</div>
                  <div style={{ fontSize: '0.68rem', color: '#94a3b8', marginTop: 1, lineHeight: 1.3 }}>{b.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT: Product showcase */}
        <div style={{
          background: 'linear-gradient(160deg, #dbeafe 0%, #eff6ff 40%, #e0f2fe 100%)',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          padding: 48, position: 'relative', overflow: 'hidden'
        }}>
          {/* Decorative circles */}
          <div style={{
            position: 'absolute', top: -60, right: -60,
            width: 240, height: 240, borderRadius: '50%',
            background: 'rgba(37,99,235,0.07)'
          }} />
          <div style={{
            position: 'absolute', bottom: -40, left: -40,
            width: 180, height: 180, borderRadius: '50%',
            background: 'rgba(37,99,235,0.05)'
          }} />

          {/* Floating product images */}
          <div style={{ position: 'relative', width: '100%', height: 320, zIndex: 1 }}>
            {/* Headphones top */}
            <img
              src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=300&q=80"
              alt="headphones"
              style={{
                position: 'absolute', top: 0, right: 20,
                width: 160, height: 160, objectFit: 'contain',
                filter: 'drop-shadow(0 12px 24px rgba(0,0,0,0.15))',
                animation: 'floatA 4s ease-in-out infinite'
              }}
            />
            {/* Watch left */}
            <img
              src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=300&q=80"
              alt="watch"
              style={{
                position: 'absolute', bottom: 30, left: 10,
                width: 120, height: 120, objectFit: 'contain',
                filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.12))',
                animation: 'floatB 5s ease-in-out infinite'
              }}
            />
            {/* Camera center */}
            <img
              src="https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=300&q=80"
              alt="camera"
              style={{
                position: 'absolute', bottom: 20, right: 20,
                width: 110, height: 110, objectFit: 'contain',
                filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.12))',
                animation: 'floatC 6s ease-in-out infinite'
              }}
            />
            {/* Laptop large */}
            <img
              src="https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?auto=format&fit=crop&w=400&q=80"
              alt="laptop"
              style={{
                position: 'absolute', top: 90, left: 20,
                width: 200, height: 150, objectFit: 'contain',
                filter: 'drop-shadow(0 16px 32px rgba(0,0,0,0.12))'
              }}
            />
          </div>

          <div style={{ textAlign: 'center', marginTop: 24, zIndex: 1, position: 'relative' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1e40af', marginBottom: 6 }}>
              Everything Tech, One Platform
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#3b82f6', maxWidth: 260 }}>
              Premium electronics, smart gadgets, and security systems delivered to your door.
            </p>
          </div>

          {/* Admin demo button */}
          <button
            onClick={() => handleQuickDemo('admin')}
            disabled={loading}
            style={{
              marginTop: 20, padding: '8px 18px',
              background: 'rgba(255,255,255,0.8)', border: '1px solid #bfdbfe',
              borderRadius: 8, cursor: 'pointer', fontSize: '0.8rem',
              fontWeight: 700, color: '#2563eb', fontFamily: 'var(--font-sans)',
              zIndex: 1, position: 'relative'
            }}
          >
            🔐 Demo as Admin
          </button>
        </div>
      </div>

      <style>{`
        @keyframes floatA { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-12px); } }
        @keyframes floatB { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-8px); } }
        @keyframes floatC { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-10px); } }
        @media (max-width: 700px) {
          div[style*="gridTemplateColumns: 1fr 1fr"] { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
