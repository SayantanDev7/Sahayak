import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Lottie from 'lottie-react';
import { authService } from '../services/authService';
import { Mail, Lock, User, ArrowRight } from 'lucide-react';
import '../styles/Auth.css';

const LottieCustom = Lottie.default || Lottie;

export function Auth() {
  const navigate = useNavigate();
  const [isRightPanelActive, setIsRightPanelActive] = useState(false);
  const [blobData, setBlobData] = useState(null);

  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [signupData, setSignupData] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);

  // Fetch Lottie Blob animation from open source generic URL
  useEffect(() => {
    fetch('https://assets9.lottiefiles.com/packages/lf20_puciaact.json')
      .then(res => res.json())
      .then(data => setBlobData(data))
      .catch(err => console.error("Could not load Lottie", err));
  }, []);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authService.doLogin(loginData);
      navigate('/dashboard');
    } catch (err) {
      alert(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authService.doSignup(signupData);
      // Immediately switch to login or dashboard
      setIsRightPanelActive(false);
      alert('Signup successful! Please login.');
    } catch (err) {
      alert(err.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center font-sans px-4 py-20 relative z-10 text-white">
      {/* Background ambient Lottie blobs injected across the screen */}
      {blobData && (
        <>
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20 z-0">
            <LottieCustom animationData={blobData} loop={true} className="w-[80vw] h-[80vw] absolute -top-1/4 -left-1/4" />
            <LottieCustom animationData={blobData} loop={true} className="w-[80vw] h-[80vw] absolute -bottom-1/4 -right-1/4" />
          </div>
        </>
      )}

      <div className={`auth-container ${isRightPanelActive ? 'active' : ''}`} id="auth-container">
        
        {/* SIGN UP PANEL */}
        <div className="auth-form-container sign-up-container bg-[#151515] flex flex-col justify-center px-10 text-center">
          <h1 className="text-4xl font-black uppercase tracking-tighter text-white mb-6">Create Account</h1>
          <form onSubmit={handleSignupSubmit} className="flex flex-col items-center w-full space-y-4">
            <div className="flex items-center bg-black/50 border border-white/10 p-3 rounded-lg w-full focus-within:border-[#ccff00] transition-colors">
              <User className="text-gray-400 mr-3 w-5 h-5" />
              <input
                type="text"
                placeholder="Name"
                value={signupData.name}
                onChange={(e) => setSignupData({ ...signupData, name: e.target.value })}
                className="bg-transparent border-none outline-none text-white w-full"
                required
              />
            </div>
            <div className="flex items-center bg-black/50 border border-white/10 p-3 rounded-lg w-full focus-within:border-[#ccff00] transition-colors">
              <Mail className="text-gray-400 mr-3 w-5 h-5" />
              <input
                type="email"
                placeholder="Email"
                value={signupData.email}
                onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                className="bg-transparent border-none outline-none text-white w-full"
                required
              />
            </div>
            <div className="flex items-center bg-black/50 border border-white/10 p-3 rounded-lg w-full focus-within:border-[#ccff00] transition-colors">
              <Lock className="text-gray-400 mr-3 w-5 h-5" />
              <input
                type="password"
                placeholder="Password"
                value={signupData.password}
                onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                className="bg-transparent border-none outline-none text-white w-full"
                required
              />
            </div>
            <button 
              disabled={loading}
              className="mt-6 bg-[#ccff00] text-black w-full py-4 rounded-lg font-bold text-lg hover:bg-[#aacc00] transition-transform active:scale-95 flex items-center justify-center gap-2"
            >
              {loading ? 'Processing...' : 'Sign Up'} <ArrowRight className="w-5 h-5" />
            </button>
          </form>
        </div>

        {/* SIGN IN PANEL */}
        <div className="auth-form-container sign-in-container bg-[#151515] flex flex-col justify-center px-10 text-center">
          <h1 className="text-4xl font-black uppercase tracking-tighter text-white mb-6">Welcome Back</h1>
          <form onSubmit={handleLoginSubmit} className="flex flex-col items-center w-full space-y-4">
            <div className="flex items-center bg-black/50 border border-white/10 p-3 rounded-lg w-full focus-within:border-[#ccff00] transition-colors">
              <Mail className="text-gray-400 mr-3 w-5 h-5" />
              <input
                type="email"
                placeholder="Email"
                value={loginData.email}
                onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                className="bg-transparent border-none outline-none text-white w-full"
                required
              />
            </div>
            <div className="flex items-center bg-black/50 border border-white/10 p-3 rounded-lg w-full focus-within:border-[#ccff00] transition-colors">
              <Lock className="text-gray-400 mr-3 w-5 h-5" />
              <input
                type="password"
                placeholder="Password"
                value={loginData.password}
                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                className="bg-transparent border-none outline-none text-white w-full"
                required
              />
            </div>
            <a href="#" className="text-gray-400 text-sm mt-2 hover:text-white transition-colors self-end">Forgot your password?</a>
            <button 
              disabled={loading}
              className="mt-6 bg-[#ccff00] text-black w-full py-4 rounded-lg font-bold text-lg hover:bg-[#aacc00] transition-transform active:scale-95 flex items-center justify-center gap-2"
            >
              {loading ? 'Logging in...' : 'Sign In'} <ArrowRight className="w-5 h-5" />
            </button>
            <div className="w-full mt-6">
              <div className="flex items-center text-center mb-4 text-gray-500">
                <div className="flex-1 border-b border-white/10"></div>
                <span className="px-3 text-sm">OR</span>
                <div className="flex-1 border-b border-white/10"></div>
              </div>
              <div className="flex justify-center gap-4">
                <button type="button" className="w-12 h-12 rounded-full bg-white flex justify-center items-center hover:scale-105 transition-transform" onClick={() => window.location.href='/auth/google'}>
                  <img src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png" alt="Google" className="w-6 h-6" />
                </button>
                <button type="button" className="w-12 h-12 rounded-full bg-white flex justify-center items-center hover:scale-105 transition-transform" onClick={() => window.location.href='/auth/github'}>
                  <img src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png" alt="GitHub" className="w-6 h-6" />
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* OVERLAY for Animation Toggle */}
        <div className="auth-overlay-container">
          <div className="auth-overlay flex">
            {/* Left Overlay Content (Shown when active / signing up) */}
            <div className="auth-overlay-panel auth-overlay-left">
              <h1 className="text-4xl font-black uppercase tracking-tighter text-black mb-4" style={{ WebkitTextStroke: '0.5px currentColor' }}>
                SAHAYAK
              </h1>
              <p className="text-black/80 font-bold text-lg mb-8">
                Welcome back! Sarkari Suvidhaon se Judein and access your dashboard.
              </p>
              <button 
                onClick={() => setIsRightPanelActive(false)}
                className="border-2 border-black text-black px-10 py-3 rounded-lg font-bold text-lg hover:bg-black hover:text-[#ccff00] transition-all"
              >
                Sign In
              </button>
            </div>

            {/* Right Overlay Content (Shown when NOT active / signing in) */}
            <div className="auth-overlay-panel auth-overlay-right">
              <h1 className="text-4xl font-black uppercase tracking-tighter text-black mb-4" style={{ WebkitTextStroke: '0.5px currentColor' }}>
                SAHAYAK
              </h1>
              <p className="text-black/80 font-bold text-lg mb-8">
                New here? Sarkari Suvidhaon se Judein by creating a free account.
              </p>
              <button 
                onClick={() => setIsRightPanelActive(true)}
                className="border-2 border-black text-black px-10 py-3 rounded-lg font-bold text-lg hover:bg-black hover:text-[#ccff00] transition-all"
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
