import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, CheckCircle2, AlertCircle, Loader2, AlertTriangle, ExternalLink } from 'lucide-react';
import { Footer } from './Footer';
import { FinovaLogo } from './FinovaLogo';
import { User } from '../types';
import { authService } from '../services/authService';

interface SignUpPageProps {
  onSuccessSignUp: (user: User) => void;
  onNavigateLogin: () => void;
  onNavigateHome: () => void;
  onNavigateTab: (tab: string) => void;
}

export const SignUpPage: React.FC<SignUpPageProps> = ({
  onSuccessSignUp,
  onNavigateLogin,
  onNavigateHome,
  onNavigateTab,
}) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [termsAccepted, setTermsAccepted] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [generalError, setGeneralError] = useState('');
  const [isProviderDisabled, setIsProviderDisabled] = useState(false);

  // Auto-redirect if an active Firebase session already exists
  useEffect(() => {
    const existingUser = authService.getCurrentUser();
    if (existingUser) {
      onSuccessSignUp(existingUser);
    }
  }, [onSuccessSignUp]);

  const handleGoogleSignUp = async () => {
    setIsLoading(true);
    setGeneralError('');
    setIsProviderDisabled(false);
    try {
      const authenticatedUser = await authService.signInWithGoogle();
      onSuccessSignUp(authenticatedUser);
    } catch (err: any) {
      if (err.code === 'auth/popup-closed-by-user') {
        setGeneralError('Google sign-up popup was closed before completing registration.');
      } else if (err.code === 'auth/popup-blocked') {
        setGeneralError('Sign-up popup was blocked by your browser. Please allow popups for this site.');
      } else {
        setGeneralError(err.message || 'Failed to sign up with Google');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoSignUp = () => {
    const userEmail = email.trim() || 'newmember@finova.internal';
    const userName = fullName.trim() || userEmail.split('@')[0];
    const demoUser: User = {
      id: 'usr_preview_' + Date.now(),
      name: userName,
      email: userEmail,
      role: 'Member',
      company: 'Personal Account',
    };
    onSuccessSignUp(demoUser);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError('');
    setIsProviderDisabled(false);
    const newErrors: Record<string, string> = {};

    if (!fullName.trim()) {
      newErrors.fullName = 'Full Name is required';
    }

    if (!email.trim()) {
      newErrors.email = 'Email Address is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Confirm Password is required';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!termsAccepted) {
      newErrors.terms = 'Please accept the Terms of Service to proceed';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    try {
      const newUser = await authService.signUpWithEmail(fullName.trim(), email.trim(), password);
      onSuccessSignUp(newUser);
    } catch (err: any) {
      if (err.code === 'auth/operation-not-allowed') {
        console.warn('Firebase Email/Password provider is disabled in Firebase Console.');
        setIsProviderDisabled(true);
      } else if (err.code === 'auth/email-already-in-use') {
        setGeneralError('An account with this email address already exists. Please log in instead.');
      } else if (err.code === 'auth/weak-password') {
        setGeneralError('Password is too weak. Please use at least 8 characters with a mix of letters and numbers.');
      } else {
        console.error('Email Sign-Up Error:', err);
        setGeneralError(err.message || 'Failed to create account. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-inter">
      {/* Main Split Screen Area */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12">
        
        {/* LEFT ~50%: Large full-height photographic image of professional woman using a laptop in an office */}
        <div className="hidden lg:block lg:col-span-6 relative bg-slate-900 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1400&q=85"
            alt="Professional woman using a laptop in an office"
            className="w-full h-full object-cover object-center opacity-90"
            referrerPolicy="no-referrer"
          />
          {/* Subtle dark gradient overlay for text legibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-end p-12 text-white">
            <div className="max-w-md space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold uppercase tracking-wider text-white">
                <span className="w-2 h-2 rounded-full bg-[#659B5E]"></span>
                FINANCIAL FREEDOM BEGINS HERE
              </div>
              <h2 className="font-heading font-bold text-3xl sm:text-4xl text-white leading-tight">
                Empowering your wealth journey with clarity and confidence.
              </h2>
              <p className="text-sm text-slate-200 leading-relaxed font-normal">
                Join over 45,000 smart savers and investors building real long-term security with Finova.
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT ~50%: White registration form area */}
        <div className="lg:col-span-6 flex flex-col justify-center px-6 sm:px-12 lg:px-16 xl:px-20 py-12 lg:py-16 bg-white">
          <div className="max-w-md w-full mx-auto space-y-8">
            
            {/* FINOVA logo at the top */}
            <div className="flex justify-center sm:justify-start">
              <FinovaLogo 
                theme="light-bg" 
                size="lg" 
                variant="standard"
                onClick={onNavigateHome} 
              />
            </div>

            {/* Large heading & Subtitle */}
            <div className="space-y-2">
              <h1 
                id="signup-main-heading"
                className="font-heading font-bold text-3xl sm:text-4xl text-[#1E293B] tracking-tight"
              >
                Create Your Account
              </h1>
              <p className="text-sm sm:text-base text-[#64748B]">
                Start your journey to financial freedom.
              </p>
            </div>

            {isProviderDisabled && (
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 space-y-3 shadow-2xs">
                <div className="flex items-start gap-2.5">
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <h4 className="font-semibold text-xs text-amber-950">Email/Password Provider Needs Enabling in Firebase Console</h4>
                    <p className="text-xs text-amber-800 leading-relaxed">
                      Google OAuth is active and ready. To use email and password registration, enable the <strong>Email/Password</strong> provider in your{' '}
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
                    onClick={handleGoogleSignUp}
                    className="px-3.5 py-1.5 rounded-lg bg-[#659B5E] hover:bg-[#52824c] text-white text-xs font-semibold transition-colors shadow-2xs"
                  >
                    Sign Up with Google Instead
                  </button>
                  <button
                    type="button"
                    onClick={handleDemoSignUp}
                    className="px-3.5 py-1.5 rounded-lg bg-white border border-amber-300 hover:bg-amber-100/50 text-amber-900 text-xs font-semibold transition-colors shadow-2xs"
                  >
                    Continue to Dashboard (Preview Mode)
                  </button>
                </div>
              </div>
            )}

            {generalError && (
              <div className="p-3.5 rounded-lg bg-red-50 border border-red-200 text-xs text-red-600 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                <span>{generalError}</span>
              </div>
            )}

            {/* Registration Form with fields in exact order:
                1. Full Name
                2. Email Address
                3. Password
                4. Confirm Password
            */}
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* 1. Full Name */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#1E293B] mb-1.5">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="signup-fullname"
                  type="text"
                  placeholder="Enter your full name"
                  value={fullName}
                  onChange={(e) => {
                    setFullName(e.target.value);
                    if (errors.fullName) setErrors(prev => ({ ...prev, fullName: '' }));
                  }}
                  className={`w-full px-4 py-3 rounded-lg border text-sm text-[#1E293B] placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#659B5E]/20 focus:border-[#659B5E] transition-all ${
                    errors.fullName ? 'border-red-400 bg-red-50/20' : 'border-[#CBD5E1] bg-white'
                  }`}
                />
                {errors.fullName && (
                  <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{errors.fullName}</span>
                  </p>
                )}
              </div>

              {/* 2. Email Address */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#1E293B] mb-1.5">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  id="signup-email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors(prev => ({ ...prev, email: '' }));
                  }}
                  className={`w-full px-4 py-3 rounded-lg border text-sm text-[#1E293B] placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#659B5E]/20 focus:border-[#659B5E] transition-all ${
                    errors.email ? 'border-red-400 bg-red-50/20' : 'border-[#CBD5E1] bg-white'
                  }`}
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{errors.email}</span>
                  </p>
                )}
              </div>

              {/* 3. Password */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#1E293B] mb-1.5">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    id="signup-password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="At least 8 characters"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errors.password) setErrors(prev => ({ ...prev, password: '' }));
                    }}
                    className={`w-full pl-4 pr-11 py-3 rounded-lg border text-sm text-[#1E293B] placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#659B5E]/20 focus:border-[#659B5E] transition-all ${
                      errors.password ? 'border-red-400 bg-red-50/20' : 'border-[#CBD5E1] bg-white'
                    }`}
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
                {errors.password && (
                  <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{errors.password}</span>
                  </p>
                )}
              </div>

              {/* 4. Confirm Password */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#1E293B] mb-1.5">
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    id="signup-confirm-password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Repeat your password"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      if (errors.confirmPassword) setErrors(prev => ({ ...prev, confirmPassword: '' }));
                    }}
                    className={`w-full pl-4 pr-11 py-3 rounded-lg border text-sm text-[#1E293B] placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#659B5E]/20 focus:border-[#659B5E] transition-all ${
                      errors.confirmPassword ? 'border-red-400 bg-red-50/20' : 'border-[#CBD5E1] bg-white'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 focus:outline-hidden"
                    aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{errors.confirmPassword}</span>
                  </p>
                )}
              </div>

              {/* Terms check */}
              <div className="flex items-start gap-2 pt-1">
                <input
                  id="signup-terms"
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="mt-1 rounded text-[#659B5E] focus:ring-[#659B5E] border-slate-300"
                />
                <label htmlFor="signup-terms" className="text-xs text-[#64748B] leading-relaxed">
                  I agree to Finova&apos;s <span className="text-[#659B5E] hover:underline cursor-pointer">Terms of Service</span> and <span className="text-[#659B5E] hover:underline cursor-pointer">Privacy Policy</span>.
                </label>
              </div>

              {/* Large green "Create Account" button */}
              <div className="pt-3">
                <button
                  id="signup-submit-btn"
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 px-6 rounded-lg bg-[#659B5E] hover:bg-[#52824c] disabled:opacity-70 text-white font-semibold text-sm shadow-sm transition-all duration-150 active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                  <span>{isLoading ? 'Creating Account...' : 'Create Account with Email'}</span>
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
              id="signup-google-btn"
              type="button"
              onClick={handleGoogleSignUp}
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
              <span>Sign up with Google</span>
            </button>

            {/* Under it: Already have an account? Log In */}
            <div className="text-center pt-2">
              <p className="text-sm text-[#64748B]">
                Already have an account?{' '}
                <button
                  id="signup-switch-to-login"
                  type="button"
                  onClick={onNavigateLogin}
                  className="text-[#659B5E] hover:text-[#41603B] font-semibold hover:underline transition-colors ml-1"
                >
                  Log In
                </button>
              </p>
            </div>

          </div>
        </div>

      </div>

      {/* SIGN-UP FOOTER: Dark navy footer matching landing page */}
      <Footer onNavigateTab={onNavigateTab} />
    </div>
  );
};
