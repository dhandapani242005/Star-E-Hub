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
  LuChevronRight,
  LuShieldAlert,
  LuShield,
  LuShieldCheck,
  LuTag,
  LuTruck,
  LuEye,
  LuEyeOff,
  LuFacebook
} from 'react-icons/lu';

export default function AuthPage({ onLoginSuccess, addToast }) {
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Form input states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('user'); // defaults to 'user'

  const handleSignIn = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      addToast('Please enter both email and password.', 'warning');
      return;
    }

    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Retrieve user role from Firestore
      const userDocRef = doc(db, 'users', user.uid);
      const userDocSnap = await getDoc(userDocRef);
      
      let userRole = 'user';
      let userName = user.email.split('@')[0];

      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        userRole = userData.role || 'user';
        userName = userData.name || userName;
      } else {
        await setDoc(userDocRef, {
          name: userName,
          email: user.email,
          role: 'user',
          createdAt: new Date().toISOString()
        });
      }

      addToast(`Welcome back, ${userName}! Logged in as ${userRole === 'admin' ? 'Administrator' : 'Customer'}.`, 'success');
      if (onLoginSuccess) {
        onLoginSuccess({
          uid: user.uid,
          email: user.email,
          name: userName,
          role: userRole
        });
      }
    } catch (error) {
      console.error("Sign in error:", error);
      let errMsg = 'Failed to sign in. Please verify your credentials.';
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        errMsg = 'Invalid email or password.';
      } else if (error.code === 'auth/invalid-credential') {
        errMsg = 'Invalid credentials. Please double-check.';
      }
      addToast(errMsg, 'danger');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!email || !password || !name) {
      addToast('Please fill in all registration fields.', 'warning');
      return;
    }
    if (password.length < 6) {
      addToast('Password must be at least 6 characters long.', 'warning');
      return;
    }

    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Save user profile & role to Firestore
      const userProfile = {
        uid: user.uid,
        name: name,
        email: email,
        role: role,
        createdAt: new Date().toISOString()
      };

      await setDoc(doc(db, 'users', user.uid), userProfile);
      addToast(`Account created successfully! Logged in as ${role === 'admin' ? 'Administrator' : 'Customer'}.`, 'success');
      
      if (onLoginSuccess) {
        onLoginSuccess({
          uid: user.uid,
          email: user.email,
          name: name,
          role: role
        });
      }
    } catch (error) {
      console.error("Sign up error:", error);
      let errMsg = 'Registration failed. Please try again.';
      if (error.code === 'auth/email-already-in-use') {
        errMsg = 'This email address is already in use.';
      } else if (error.code === 'auth/invalid-email') {
        errMsg = 'Invalid email format.';
      }
      addToast(errMsg, 'danger');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Verify or initialize their profile and role in Firestore
      const userDocRef = doc(db, 'users', user.uid);
      const userDocSnap = await getDoc(userDocRef);

      let userRole = 'user';
      let userName = user.displayName || user.email.split('@')[0];

      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        userRole = userData.role || 'user';
        userName = userData.name || userName;
      } else {
        // Initialize new Google user as 'user' role
        await setDoc(userDocRef, {
          name: userName,
          email: user.email,
          role: 'user',
          createdAt: new Date().toISOString()
        });
      }

      addToast(`Logged in successfully via Google as ${userName}!`, 'success');
      if (onLoginSuccess) {
        onLoginSuccess({
          uid: user.uid,
          email: user.email,
          name: userName,
          role: userRole
        });
      }
    } catch (error) {
      console.error("Google sign in error:", error);
      addToast(`Google authentication failed: ${error.message}`, 'danger');
    } finally {
      setLoading(false);
    }
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
        if (signInErr.code === 'auth/user-not-found' || signInErr.code === 'auth/wrong-password' || signInErr.code === 'auth/invalid-credential') {
          userCredential = await createUserWithEmailAndPassword(auth, demoEmail, demoPass);
        } else {
          throw signInErr;
        }
      }

      const user = userCredential.user;

      const userProfile = {
        uid: user.uid,
        name: demoName,
        email: demoEmail,
        role: demoRole,
        createdAt: new Date().toISOString()
      };
      await setDoc(doc(db, 'users', user.uid), userProfile);

      addToast(`Logged in successfully as Demo ${demoRole.toUpperCase()}!`, 'success');
      if (onLoginSuccess) {
        onLoginSuccess({
          uid: user.uid,
          email: demoEmail,
          name: demoName,
          role: demoRole
        });
      }
    } catch (error) {
      console.error("Demo login failed:", error);
      addToast(`Demo login error: ${error.message}`, 'danger');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-root">
      {/* Decorative background shapes */}
      <div className="bg-shape-yellow" />
      <div className="bg-shape-blue" />
      <div className="bg-pattern-dots" />

      <style>{`
        .auth-page-root {
          min-height: 100vh;
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: #f8fafc;
          position: relative;
          overflow: hidden;
          font-family: var(--font-sans);
          padding: 40px 20px;
        }
        .bg-shape-yellow {
          position: absolute;
          top: -150px;
          left: -150px;
          width: 420px;
          height: 420px;
          border-radius: 50%;
          background: #facc15;
          filter: blur(80px);
          opacity: 0.85;
          z-index: 0;
        }
        .bg-shape-blue {
          position: absolute;
          bottom: -150px;
          right: -150px;
          width: 550px;
          height: 550px;
          border-radius: 50%;
          background: #2563eb;
          filter: blur(100px);
          opacity: 0.9;
          z-index: 0;
        }
        .bg-pattern-dots {
          position: absolute;
          top: 15%;
          left: 45%;
          width: 120px;
          height: 120px;
          background-image: radial-gradient(#cbd5e1 2px, transparent 2px);
          background-size: 16px 16px;
          opacity: 0.6;
          z-index: 0;
        }
        .auth-container-grid {
          display: grid;
          grid-template-columns: 1fr 1.05fr;
          width: 100%;
          max-width: 1120px;
          background: transparent;
          z-index: 1;
          gap: 60px;
          align-items: center;
          padding: 0 10px;
        }
        @media (max-width: 900px) {
          .auth-container-grid {
            grid-template-columns: 1fr;
            gap: 40px;
            max-width: 500px;
          }
          .left-welcome-panel {
            display: none !important;
          }
        }
        .left-welcome-panel {
          display: flex;
          flex-direction: column;
          gap: 28px;
          text-align: left;
        }
        .trusted-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: #2563eb;
          font-size: 0.8rem;
          font-weight: 800;
          letter-spacing: 1px;
          text-transform: uppercase;
        }
        .welcome-heading {
          font-size: 3rem;
          font-weight: 800;
          line-height: 1.15;
          color: #0f172a;
          letter-spacing: -1px;
        }
        .welcome-heading span.highlight {
          color: #2563eb;
        }
        .welcome-subtitle {
          font-size: 1.05rem;
          color: #475569;
          line-height: 1.6;
        }
        .feature-list {
          display: flex;
          flex-direction: column;
          gap: 24px;
          margin-top: 12px;
        }
        .feature-item {
          display: flex;
          align-items: flex-start;
          gap: 16px;
        }
        .feature-icon-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 48px;
          height: 48px;
          border-radius: 50%;
          flex-shrink: 0;
        }
        .feature-icon-wrapper.secure {
          background-color: #fef08a;
          color: #854d0e;
        }
        .feature-icon-wrapper.deals {
          background-color: #dbeafe;
          color: #1e40af;
        }
        .feature-icon-wrapper.delivery {
          background-color: #e0f2fe;
          color: #0369a1;
        }
        .feature-title {
          font-size: 1.05rem;
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 4px;
        }
        .feature-description {
          font-size: 0.88rem;
          color: #64748b;
        }
        .white-auth-card {
          width: 100%;
          max-width: 480px;
          background: #ffffff;
          border-radius: 24px;
          padding: 48px 40px;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 10px 10px -5px rgba(0, 0, 0, 0.02), 0 0 0 1px rgba(0, 0, 0, 0.03);
          display: flex;
          flex-direction: column;
          position: relative;
        }
        .card-top-shield {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 64px;
          height: 64px;
          border-radius: 16px;
          border: 2px solid #2563eb;
          color: #2563eb;
          background-color: #eff6ff;
          margin: 0 auto 24px auto;
        }
        .card-title {
          font-size: 1.8rem;
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 8px;
          text-align: center;
          letter-spacing: -0.5px;
        }
        .card-subtitle {
          font-size: 0.95rem;
          color: #64748b;
          margin-bottom: 32px;
          text-align: center;
        }
        .form-input-label {
          font-size: 0.82rem;
          font-weight: 700;
          color: #2563eb;
          display: block;
          margin-bottom: 8px;
          text-align: left;
        }
        .form-input-container {
          position: relative;
          width: 100%;
          margin-bottom: 20px;
        }
        .form-input-field {
          width: 100%;
          padding: 14px 16px 14px 46px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          color: #0f172a;
          outline: none;
          font-size: 0.95rem;
          transition: all 0.2s ease;
        }
        .form-input-field:focus {
          border-color: #2563eb;
          background: #ffffff;
          box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1);
        }
        .form-input-icon {
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          color: #94a3b8;
          transition: color 0.2s;
        }
        .form-input-field:focus + .form-input-icon {
          color: #2563eb;
        }
        .eye-toggle-btn {
          position: absolute;
          right: 16px;
          top: 50%;
          transform: translateY(-50%);
          color: #94a3b8;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
          display: flex;
          align-items: center;
        }
        .eye-toggle-btn:hover {
          color: #2563eb;
        }
        .forgot-link-wrapper {
          display: flex;
          justify-content: flex-end;
          margin-top: -12px;
          margin-bottom: 24px;
        }
        .forgot-link {
          font-size: 0.85rem;
          color: #2563eb;
          font-weight: 700;
          text-decoration: none;
          transition: color 0.2s;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
        }
        .forgot-link:hover {
          color: #1d4ed8;
          text-decoration: underline;
        }
        .submit-blue-btn {
          width: 100%;
          padding: 14px;
          background-color: #2563eb;
          color: #ffffff;
          font-weight: 700;
          font-size: 1rem;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        .submit-blue-btn:hover:not(:disabled) {
          background-color: #1d4ed8;
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2);
        }
        .submit-blue-btn:active:not(:disabled) {
          transform: scale(0.98);
        }
        .submit-blue-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .divider-wrapper {
          display: flex;
          align-items: center;
          width: 100%;
          margin: 28px 0;
          color: #e2e8f0;
        }
        .divider-line {
          flex: 1;
          height: 1px;
          background-color: currentColor;
        }
        .divider-text {
          padding: 0 16px;
          font-size: 0.72rem;
          font-weight: 800;
          color: #94a3b8;
          letter-spacing: 1px;
          text-transform: uppercase;
        }
        .social-demo-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          width: 100%;
        }
        .social-demo-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 12px;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          font-size: 0.9rem;
          font-weight: 700;
          color: #475569;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .social-demo-btn:hover {
          background: #f8fafc;
          border-color: #cbd5e1;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }
        .footer-switch-text {
          margin-top: 28px;
          font-size: 0.9rem;
          color: #64748b;
          text-align: center;
        }
        .footer-switch-link {
          color: #2563eb;
          font-weight: 700;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
          margin-left: 4px;
          transition: color 0.2s;
        }
        .footer-switch-link:hover {
          color: #1d4ed8;
          text-decoration: underline;
        }
      `}</style>

      <div className="auth-container-grid">
        {/* Left column (Welcome Panel) */}
        <div className="left-welcome-panel">
          <div className="trusted-badge">
            <LuShieldCheck size={18} />
            <span>Secure & Trusted</span>
          </div>
          <h1 className="welcome-heading">
            Welcome Back!<br />
            Sign in to continue <span className="highlight">shopping</span>
          </h1>
          <p className="welcome-subtitle">
            Access your account to manage orders, track deliveries and enjoy exclusive offers.
          </p>
          
          <div className="feature-list">
            <div className="feature-item">
              <div className="feature-icon-wrapper secure">
                <LuLock size={20} />
              </div>
              <div>
                <h3 className="feature-title">Secure Login</h3>
                <p className="feature-description">Your data is encrypted and protected</p>
              </div>
            </div>

            <div className="feature-item">
              <div className="feature-icon-wrapper deals">
                <LuTag size={20} />
              </div>
              <div>
                <h3 className="feature-title">Best Deals</h3>
                <p className="feature-description">Access exclusive member discounts</p>
              </div>
            </div>

            <div className="feature-item">
              <div className="feature-icon-wrapper delivery">
                <LuTruck size={20} />
              </div>
              <div>
                <h3 className="feature-title">Fast Delivery</h3>
                <p className="feature-description">Track orders and get fast delivery</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right column (Card Form Panel) */}
        <div className="right-card-panel">
          <div className="white-auth-card">
            <div className="card-top-shield" style={{ position: 'relative' }}>
              <LuShield size={32} />
              <LuLock size={14} style={{ position: 'absolute', top: '53%', left: '50%', transform: 'translate(-50%, -50%)', color: '#f5b002' }} />
            </div>

            <h2 className="card-title">
              {isRegisterMode ? 'Sign up for an account' : 'Sign in to your account'}
            </h2>
            <p className="card-subtitle">
              {isRegisterMode ? 'Create a secure credentials profile' : 'Enter your credentials to access your account'}
            </p>

            <form onSubmit={isRegisterMode ? handleSignUp : handleSignIn}>
              {isRegisterMode && (
                <div>
                  <label className="form-input-label">Full Name</label>
                  <div className="form-input-container">
                    <input
                      type="text"
                      placeholder="e.g. John Doe"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      required
                      className="form-input-field"
                    />
                    <LuUser className="form-input-icon" size={18} />
                  </div>
                </div>
              )}

              <label className="form-input-label">Email Address</label>
              <div className="form-input-container">
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  className="form-input-field"
                />
                <LuMail className="form-input-icon" size={18} />
              </div>

              <label className="form-input-label">Password</label>
              <div className="form-input-container">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  className="form-input-field"
                />
                <LuLock className="form-input-icon" size={18} />
                <button
                  type="button"
                  className="eye-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <LuEyeOff size={18} /> : <LuEye size={18} />}
                </button>
              </div>

              {!isRegisterMode && (
                <div className="forgot-link-wrapper">
                  <button
                    type="button"
                    onClick={() => addToast('Password reset link sent to your email.', 'info')}
                    className="forgot-link"
                  >
                    Forgot Password?
                  </button>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="submit-blue-btn"
              >
                <span>{loading ? 'Processing...' : (isRegisterMode ? 'Sign Up' : 'Sign In')}</span>
                <LuChevronRight size={18} />
              </button>
            </form>

            <div className="divider-wrapper">
              <div className="divider-line" />
              <span className="divider-text">Or Continue With</span>
              <div className="divider-line" />
            </div>

            <div className="social-demo-grid">
              <button
                type="button"
                className="social-demo-btn"
                onClick={handleGoogleSignIn}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" style={{ marginRight: '4px' }}>
                  <path fill="#EA4335" d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.187 4.114-3.524 0-6.38-2.856-6.38-6.38s2.856-6.38 6.38-6.38c1.63 0 3.116.61 4.257 1.62l3.2-3.2C19.314 2.227 15.99 1 12.24 1 5.756 1 .5 6.256.5 12.74s5.256 11.74 11.74 11.74c6.8 0 11.74-4.782 11.74-11.74 0-.78-.07-1.54-.2-2.285H12.24z"/>
                </svg>
                <span>Google</span>
              </button>

              <button
                type="button"
                className="social-demo-btn"
                onClick={() => handleQuickDemo('user')}
                style={{ color: '#1877F2' }}
              >
                <LuFacebook size={18} style={{ marginRight: '4px', fill: '#1877F2', color: '#ffffff' }} />
                <span style={{ color: '#475569' }}>Facebook</span>
              </button>
            </div>

            {/* Quick Demo Access Bar for Developer Testing */}
            <div style={{ marginTop: '24px', display: 'flex', gap: '8px', justifyContent: 'center', fontSize: '0.8rem', color: '#94a3b8', borderTop: '1px dashed #e2e8f0', paddingTop: '16px' }}>
              <span>Demo Login:</span>
              <button type="button" onClick={() => handleQuickDemo('admin')} style={{ background: 'none', border: 'none', color: '#2563eb', fontWeight: 700, cursor: 'pointer', padding: 0 }}>Admin Role</button>
              <span>•</span>
              <button type="button" onClick={() => handleQuickDemo('user')} style={{ background: 'none', border: 'none', color: '#2563eb', fontWeight: 700, cursor: 'pointer', padding: 0 }}>User Role</button>
            </div>

            <div className="footer-switch-text">
              <span>{isRegisterMode ? 'Already have an account?' : "Don't have an account?"}</span>
              <button
                type="button"
                className="footer-switch-link"
                onClick={() => setIsRegisterMode(!isRegisterMode)}
              >
                {isRegisterMode ? 'Sign In' : 'Create Account'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
