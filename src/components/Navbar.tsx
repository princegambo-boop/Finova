import React, { useState } from 'react';
import { 
  Menu, 
  X, 
  User as UserIcon, 
  LogOut,
  ChevronDown,
  Search,
  SlidersHorizontal,
  Wallet,
  BookOpen,
  Calculator,
  Settings
} from 'lucide-react';
import { User } from '../types';
import { FinovaLogo } from './FinovaLogo';
import { FinovaAvatar } from './FinovaAvatar';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  onNavigateHome: () => void;
  currentUser: User | null;
  onOpenAuth: (mode: 'login' | 'signup') => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  onNavigateHome,
  currentUser,
  onOpenAuth,
  onLogout,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Center navigation links matching the reference design:
  // Dashboard, Invest, Convert, Calculate, Learn
  const navLinks = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'invest', label: 'Invest' },
    { id: 'convert', label: 'Convert' },
    { id: 'calculate', label: 'Calculate' },
    { id: 'learn', label: 'Learn' },
  ];

  const quickSearchItems = [
    { title: 'Portfolio Overview', tab: 'dashboard', desc: 'Real-time balances & asset allocation', icon: Wallet },
    { title: 'Invest & Portfolios', tab: 'invest', desc: 'Diversified index portfolios and wealth planning', icon: SlidersHorizontal },
    { title: 'Currency Converter', tab: 'convert', desc: 'Multi-currency live exchange estimates', icon: Wallet },
    { title: 'Compound Interest Calculator', tab: 'calculate', desc: 'Long-term wealth accumulation', icon: Calculator },
    { title: 'Financial Education', tab: 'learn', desc: 'Self-paced guides and masterclasses', icon: BookOpen },
  ];

  const filteredSearch = searchQuery.trim()
    ? quickSearchItems.filter(i => 
        i.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        i.desc.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : quickSearchItems;

  return (
    <header className="sticky top-0 z-50 bg-[#133320] text-white shadow-md border-b border-[#1A422B]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 sm:h-20">
          
          {/* FINOVA logo on the left */}
          <div id="navbar-brand-logo">
            <FinovaLogo 
              theme="dark-bg" 
              size="md" 
              onClick={onNavigateHome} 
            />
          </div>

          {/* Center Navigation Links (Pill Style from Reference) */}
          <nav id="navbar-center-links" className="hidden md:flex items-center gap-1.5 lg:gap-2 bg-[#0E2618]/60 p-1.5 rounded-full border border-white/10 backdrop-blur-xs">
            {navLinks.map((link) => {
              const isActive = currentTab === link.id;
              return (
                <button
                  key={link.id}
                  id={`nav-link-${link.id}`}
                  onClick={() => {
                    setCurrentTab(link.id);
                  }}
                  className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-[#659B5E] text-white font-semibold shadow-xs'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Right Side: Search Icon & User Avatar */}
          <div className="hidden md:flex items-center gap-4">
            
            {/* Search Icon button */}
            <div className="relative">
              <button
                id="navbar-search-btn"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                aria-label="Search tools"
                className="w-9 h-9 rounded-full hover:bg-white/10 flex items-center justify-center text-white/85 hover:text-white transition-colors"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Quick Search Palette */}
              {isSearchOpen && (
                <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-xl border border-[#E2E8F0] p-3 text-[#1E293B] z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="relative mb-2">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B]" />
                    <input
                      type="text"
                      placeholder="Search tools, calculators, courses..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      autoFocus
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-[#F8F9FA] border border-[#E2E8F0] focus:outline-hidden focus:border-[#659B5E] text-[#1E293B]"
                    />
                  </div>

                  <div className="space-y-1 max-h-60 overflow-y-auto">
                    {filteredSearch.map((item) => {
                      const ItemIcon = item.icon;
                      return (
                        <button
                          key={item.title}
                          onClick={() => {
                            setCurrentTab(item.tab);
                            setIsSearchOpen(false);
                            setSearchQuery('');
                          }}
                          className="w-full text-left p-2 rounded-xl hover:bg-[#F8F9FA] transition-colors flex items-start gap-2.5 group"
                        >
                          <div className="w-7 h-7 rounded-lg bg-[#E8F0EA] text-[#41603B] group-hover:bg-[#659B5E] group-hover:text-white flex items-center justify-center shrink-0 transition-colors">
                            <ItemIcon className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-xs font-semibold text-[#1E293B]">{item.title}</div>
                            <div className="text-[10px] text-[#64748B] line-clamp-1">{item.desc}</div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {currentUser ? (
              <div className="relative">
                <button
                  id="navbar-user-btn"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 p-1 rounded-full hover:ring-2 hover:ring-[#659B5E]/50 transition-all cursor-pointer"
                  aria-label="User account menu"
                >
                  <FinovaAvatar
                    user={currentUser}
                    size="sm"
                    showOnlineStatus={true}
                    bordered={true}
                  />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-3 w-60 bg-white rounded-2xl shadow-xl border border-[#E2E8F0] py-2 text-[#1E293B] z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="px-4 py-3 border-b border-[#E2E8F0] flex items-center gap-3">
                      <FinovaAvatar user={currentUser} size="sm" />
                      <div className="overflow-hidden">
                        <div className="font-semibold text-xs text-[#1E293B] truncate">{currentUser.name}</div>
                        <div className="text-[11px] text-[#64748B] truncate">{currentUser.email}</div>
                      </div>
                    </div>
                    
                    <button
                      id="navbar-profile-btn"
                      onClick={() => {
                        setCurrentTab('profile');
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2.5 text-xs hover:bg-[#F8FAFC] flex items-center gap-2.5 font-medium text-[#1E293B] cursor-pointer"
                    >
                      <UserIcon className="w-4 h-4 text-[#659B5E]" />
                      <span>Edit Profile & Avatar</span>
                    </button>

                    <button
                      id="navbar-user-dashboard-opt"
                      onClick={() => {
                        setCurrentTab('dashboard');
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2.5 text-xs hover:bg-[#F8FAFC] flex items-center gap-2.5 font-medium text-[#1E293B] cursor-pointer"
                    >
                      <Wallet className="w-4 h-4 text-[#659B5E]" />
                      <span>Financial Dashboard</span>
                    </button>

                    <div className="my-1 border-t border-[#F1F5F9]" />

                    <button
                      id="navbar-logout-btn"
                      onClick={() => {
                        onLogout();
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2.5 text-xs text-red-600 hover:bg-red-50 flex items-center gap-2.5 font-medium cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Log Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <button
                  id="navbar-login-btn"
                  onClick={() => onOpenAuth('login')}
                  className="px-4 py-2 text-sm font-medium text-white/90 hover:text-white transition-colors"
                >
                  Log In
                </button>

                <button
                  id="navbar-signup-btn"
                  onClick={() => onOpenAuth('signup')}
                  className="px-5 py-2 rounded-full bg-[#659B5E] text-white hover:bg-[#54844e] text-sm font-semibold shadow-2xs transition-all active:scale-95"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>

          {/* Mobile hamburger button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              id="navbar-mobile-toggle"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-white hover:bg-white/10"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div id="navbar-mobile-drawer" className="md:hidden bg-[#0F2819] border-t border-[#1B442C] px-4 pt-3 pb-6 space-y-3">
          <div className="space-y-1">
            {navLinks.map((link) => {
              const isActive = currentTab === link.id;
              return (
                <button
                  key={link.id}
                  id={`mobile-nav-${link.id}`}
                  onClick={() => {
                    setCurrentTab(link.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-[#659B5E] text-white font-semibold'
                      : 'text-white/80 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </div>

          <div className="pt-3 border-t border-white/10 flex flex-col gap-2">
            {currentUser ? (
              <>
                <button
                  onClick={() => {
                    setCurrentTab('profile');
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-2.5 text-sm text-white hover:bg-white/10 rounded-xl flex items-center gap-3 font-medium"
                >
                  <FinovaAvatar user={currentUser} size="xs" />
                  <span>Edit Profile & Avatar</span>
                </button>
                <button
                  onClick={() => {
                    onLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-2.5 text-sm text-red-300 hover:bg-white/10 rounded-xl flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log Out ({currentUser.name})</span>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    onOpenAuth('login');
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full py-2.5 text-center text-sm font-medium text-white hover:bg-white/10 rounded-xl"
                >
                  Log In
                </button>
                <button
                  onClick={() => {
                    onOpenAuth('signup');
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full py-2.5 text-center text-sm font-semibold text-white bg-[#659B5E] hover:bg-[#52824c] rounded-xl"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
