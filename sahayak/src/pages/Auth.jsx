import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Lottie from 'lottie-react';
import { authService } from '../services/authService';
import { Mail, Lock, User, ArrowRight } from 'lucide-react';
import '../styles/Auth.css';
import { useLanguage } from '../context/LanguageContext';

const LottieCustom = Lottie.default || Lottie;

export function Auth() {
  const { t } = useLanguage();
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

  const [notification, setNotification] = useState(null);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await authService.doLogin(loginData);
      // Persist session
      localStorage.setItem('sahayak_user', JSON.stringify(result.user));
      localStorage.setItem('sahayak_token', result.token);
      navigate('/dashboard');
    } catch (err) {
      setNotification({ type: 'error', message: err.message || 'Login failed' });
    } finally {
      setLoading(false);
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authService.doSignup(signupData);
      setIsRightPanelActive(false);
      setNotification({ type: 'success', message: t.auth.signupSuccess });
    } catch (err) {
      setNotification({ type: 'error', message: err.message || 'Signup failed' });
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
                <button type="button" className="w-12 h-12 rounded-full bg-white flex justify-center items-center hover:scale-105 transition-transform" onClick={async () => {
                  try {
                    await authService.doGoogleLogin();
                    navigate('/dashboard');
                  } catch (err) {
                    setNotification({ type: 'error', message: err.message });
                  }
                }}>
                  <img src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png" alt="Google" className="w-6 h-6" />
                </button>
                <button type="button" className="w-12 h-12 rounded-full bg-white flex justify-center items-center hover:scale-105 transition-transform" onClick={async () => {
                  try {
                    await authService.doGithubLogin();
                    navigate('/dashboard');
                  } catch (err) {
                    setNotification({ type: 'error', message: err.message });
                  }
                }}>
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
                {t.appName}
              </h1>
              <p className="text-black/80 font-bold text-lg mb-8">
                {t.auth.welcomeBack}
              </p>
              <button 
                onClick={() => setIsRightPanelActive(false)}
                className="border-2 border-black text-black px-10 py-3 rounded-lg font-bold text-lg hover:bg-black hover:text-[#ccff00] transition-all"
              >
                {t.auth.signInBtn}
              </button>
            </div>

            {/* Right Overlay Content (Shown when NOT active / signing in) */}
            <div className="auth-overlay-panel auth-overlay-right">
              <h1 className="text-4xl font-black uppercase tracking-tighter text-black mb-4" style={{ WebkitTextStroke: '0.5px currentColor' }}>
                {t.appName}
              </h1>
              <p className="text-black/80 font-bold text-lg mb-8">
                {t.auth.newHere}
              </p>
              <button 
                onClick={() => setIsRightPanelActive(true)}
                className="border-2 border-black text-black px-10 py-3 rounded-lg font-bold text-lg hover:bg-black hover:text-[#ccff00] transition-all"
              >
                {t.auth.signUpBtn}
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Notification Modal */}
      {notification && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm" onClick={() => setNotification(null)}>
          <div
            className={`p-8 rounded-2xl text-center max-w-sm w-full mx-4 border ${
              notification.type === 'success'
                ? 'bg-[#151515] border-green-500/50'
                : 'bg-[#151515] border-red-500/50'
            }`}
            onClick={e => e.stopPropagation()}
          >
            <h2 className={`text-2xl font-black mb-3 ${notification.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>
              {notification.type === 'success' ? '✅ SUCCESS' : '❌ ERROR'}
            </h2>
            <p className="text-gray-300 text-lg mb-6">{notification.message}</p>
            <button
              onClick={() => setNotification(null)}
              className="w-full py-3 rounded-lg font-bold text-black bg-[#ccff00] hover:bg-[#aacc00] transition-colors"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
