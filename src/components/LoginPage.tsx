import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, LogIn, AlertCircle, Loader2, AlertTriangle, ExternalLink } from 'lucide-react';
import { Footer } from './Footer';
import { FinovaLogo } from './FinovaLogo';
import { User } from '../types';
import { authService } from '../services/authService';

interface LoginPageProps {
  onSuccessLogin: (user: User) => void;
  onNavigateSignUp: () => void;
  onNavigateHome: () => void;
  onNavigateTab: (tab: string) => void;
  authNotice?: string;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onSuccessLogin,
  onNavigateSignUp,
  onNavigateHome,
  onNavigateTab,
  authNotice,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [isProviderDisabled, setIsProviderDisabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Auto-redirect if an active Firebase session already exists
  useEffect(() => {
    const existingUser = authService.getCurrentUser();
    if (existingUser) {
      onSuccessLogin(existingUser);
    }
  }, [onSuccessLogin]);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError('');
    setIsProviderDisabled(false);
    try {
      const authenticatedUser = await authService.signInWithGoogle();
      onSuccessLogin(authenticatedUser);
    } catch (err: any) {
      if (err.code === 'auth/popup-closed-by-user') {
        setError('Google sign-in popup was closed before completing authentication.');
      } else if (err.code === 'auth/popup-blocked') {
        setError('Sign-in popup was blocked by your browser. Please allow popups for this site.');
      } else {
        setError(err.message || 'Failed to sign in with Google');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoSignIn = () => {
    const userEmail = email.trim() || 'member@finova.internal';
    const demoUser: User = {
      id: 'usr_preview_' + Date.now(),
      name: userEmail.split('@')[0],
      email: userEmail,
      role: 'Member',
      company: 'Personal Account',
    };
    onSuccessLogin(demoUser);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setError('Please provide both email and password.');
      return;
    }

    setIsLoading(true);
    setError('');
    setIsProviderDisabled(false);
    try {
      const authenticatedUser = await authService.signInWithEmail(email.trim(), password);
      onSuccessLogin(authenticatedUser);
    } catch (err: any) {
      if (err.code === 'auth/operation-not-allowed') {
        console.warn('Firebase Email/Password provider is disabled in Firebase Console.');
        setIsProviderDisabled(true);
      } else if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
        console.warn('Email login failed: Invalid credentials.');
        setError('Invalid email or password. Please try again or use Google Sign-In.');
      } else if (err.code === 'auth/too-many-requests') {
        setError('Access temporarily disabled due to multiple failed login attempts. Please try again later.');
      } else {
        console.error('Email Login Error:', err);
        setError(err.message || 'Failed to log in. Please check your credentials.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-inter">
      {/* Main Split Screen */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12">
        
        {/* Left ~50%: Photo of professional woman using a laptop in office */}
        <div className="hidden lg:block lg:col-span-6 relative bg-slate-900 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=1400&q=85"
            alt="Professional woman in office with laptop"
            className="w-full h-full object-cover object-center opacity-90"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-end p-12 text-white">
            <div className="max-w-md space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold uppercase tracking-wider text-white">
                <span className="w-2 h-2 rounded-full bg-[#659B5E]"></span>
                FINANCIAL INTELLIGENCE
              </div>
              <h2 className="font-heading text-3xl sm:text-4xl text-white leading-tight font-bold">
                Welcome back to your financial command center.
              </h2>
              <p className="text-sm text-slate-200 leading-relaxed font-normal">
                Continuously track your cash balance, automated portfolio gains, and global currency transfers in real-time.
              </p>
            </div>
          </div>
        </div>

        {/* Right ~50%: White login form */}
        <div className="lg:col-span-6 flex flex-col justify-center px-6 sm:px-12 lg:px-16 xl:px-20 py-12 lg:py-16 bg-white">
          <div className="max-w-md w-full mx-auto space-y-8">
            
            {/* FINOVA Logo at top */}
            <div className="flex justify-center sm:justify-start">
              <FinovaLogo 
                theme="light-bg" 
                size="lg" 
                variant="standard"
                onClick={onNavigateHome} 
              />
            </div>

            {/* Heading & Subtitle */}
            <div className="space-y-2">
              <h1 
                id="login-main-heading"
                className="font-heading font-bold text-3xl sm:text-4xl text-[#1E293B] tracking-tight"
              >
                Welcome Back
              </h1>
              <p className="text-sm sm:text-base text-[#64748B]">
                Log in to access your dashboard, investments, and tools.
              </p>
            </div>

            {authNotice && !error && !isProviderDisabled && (
              <div className="p-3.5 rounded-lg bg-[#E8F0EA] border border-[#659B5E]/30 text-xs text-[#41603B] flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#659B5E] shrink-0"></span>
                <span className="font-medium">{authNotice}</span>
              </div>
            )}

            {isProviderDisabled && (
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 space-y-3 shadow-2xs">
                <div className="flex items-start gap-2.5">
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <h4 className="font-semibold text-xs text-amber-950">Email/Password Provider Needs Enabling in Firebase Console</h4>
                    <p className="text-xs text-amber-800 leading-relaxed">
                      Google OAuth is active and ready. To use email and password authentication, enable the <strong>Email/Password</strong> provider in your{' '}
                      <a
                        href="https://console.firebase.google.com/project/gen-lang-client-0361169076/authentication/providers"
                        target="_blank"
                        rel="noreferrer"
                        className="underline font-semibold text-amber-950 inline-flex items-center gap-0.5 hover:text-black"
                      >
                        Firebase Console <ExternalLink className="w-3 h-3 inline" />
                      </a>.
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-amber-200/60">
                  <button
                    type="button"
                    onClick={handleGoogleSignIn}
                    className="px-3.5 py-1.5 rounded-lg bg-[#659B5E] hover:bg-[#52824c] text-white text-xs font-semibold transition-colors shadow-2xs"
                  >
                    Sign In with Google Instead
                  </button>
                  <button
                    type="button"
                    onClick={handleDemoSignIn}
                    className="px-3.5 py-1.5 rounded-lg bg-white border border-amber-300 hover:bg-amber-100/50 text-amber-900 text-xs font-semibold transition-colors shadow-2xs"
                  >
                    Continue to Dashboard (Preview Mode)
                  </button>
                </div>
              </div>
            )}

            {error && (
              <div className="p-3.5 rounded-lg bg-red-50 border border-red-200 text-xs text-red-600 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Email Address */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#1E293B] mb-1.5">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-4 py-3 rounded-lg border border-[#CBD5E1] text-sm text-[#1E293B] placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#659B5E]/20 focus:border-[#659B5E] transition-all bg-white"
                  required
                />
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#1E293B]">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <a href="#forgot" onClick={(e) => e.preventDefault()} className="text-xs text-[#659B5E] hover:underline font-medium">
                    Forgot password?
                  </a>
                </div>
                <div className="relative">
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-4 pr-11 py-3 rounded-lg border border-[#CBD5E1] text-sm text-[#1E293B] placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#659B5E]/20 focus:border-[#659B5E] transition-all bg-white"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 focus:outline-hidden"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-2">
                  <input
                    id="login-remember"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded text-[#659B5E] focus:ring-[#659B5E] border-slate-300"
                  />
                  <label htmlFor="login-remember" className="text-xs text-[#64748B]">
                    Keep me logged in for 30 days
                  </label>
                </div>
              </div>

              {/* Large green "Log In" button */}
              <div className="pt-2">
                <button
                  id="login-submit-btn"
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 px-6 rounded-lg bg-[#659B5E] hover:bg-[#52824c] disabled:opacity-70 text-white font-semibold text-sm shadow-sm transition-all duration-150 active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogIn className="w-4 h-4" />}
                  <span>{isLoading ? 'Authenticating...' : 'Log In with Email'}</span>
                </button>
              </div>

            </form>

            {/* Divider */}
            <div className="relative flex py-1 items-center">
              <div className="grow border-t border-[#E2E8F0]"></div>
              <span className="shrink-0 mx-4 text-xs text-[#64748B] uppercase tracking-wider font-medium">Or continue with</span>
              <div className="grow border-t border-[#E2E8F0]"></div>
            </div>

            {/* Google Sign-in Button */}
            <button
              id="login-google-btn"
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-lg border border-[#CBD5E1] hover:border-[#659B5E] bg-white hover:bg-[#F8F9FA] text-[#1E293B] font-semibold text-sm shadow-2xs transition-all flex items-center justify-center gap-3 cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.36 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.36 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            {/* Under it: Don't have an account? Sign Up */}
            <div className="text-center pt-2">
              <p className="text-sm text-[#64748B]">
                Don&apos;t have an account?{' '}
                <button
                  id="login-switch-to-signup"
                  type="button"
                  onClick={onNavigateSignUp}
                  className="text-[#659B5E] hover:text-[#41603B] font-semibold hover:underline transition-colors ml-1"
                >
                  Sign Up
                </button>
              </p>
            </div>

          </div>
        </div>

      </div>

      {/* Matching dark navy footer */}
      <Footer onNavigateTab={onNavigateTab} />
    </div>
  );
};
