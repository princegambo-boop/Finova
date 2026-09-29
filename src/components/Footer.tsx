import React from 'react';
import { FinovaLogo } from './FinovaLogo';

interface FooterProps {
  onNavigateTab?: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigateTab }) => {
  return (
    <footer id="finova-global-footer" className="bg-[#0B1A12] text-white pt-14 pb-12 border-t border-[#1B3624]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Grid: Brand Column + 3 Navigation Columns */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-[#1B3624]">
          
          {/* Brand Column (Col 5) */}
          <div className="md:col-span-5 space-y-4">
            <FinovaLogo theme="dark-bg" size="md" />

            <p className="text-sm text-[#94A3B8] max-w-sm leading-relaxed font-inter">
              Smarter tools. Better decisions. A stronger financial you.
            </p>

            <p className="text-xs text-[#64748B] pt-2">
              Empowering individuals with intuitive budgeting, guided investing, transparent currency conversion, and practical wealth education.
            </p>
          </div>

          {/* 3 Link Columns (Col 7) */}
          <div className="md:col-span-7 grid grid-cols-3 gap-6 sm:gap-8">
            
            {/* PLATFORM column */}
            <div>
              <h4 className="text-xs font-semibold tracking-wider text-white mb-4 uppercase">
                Platform
              </h4>
              <ul className="space-y-2.5 text-xs sm:text-sm text-[#94A3B8]">
                <li>
                  <button 
                    onClick={() => onNavigateTab?.('dashboard')}
                    className="hover:text-white transition-colors text-left"
                  >
                    Dashboard
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => onNavigateTab?.('invest')}
                    className="hover:text-white transition-colors text-left"
                  >
                    Invest
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => onNavigateTab?.('convert')}
                    className="hover:text-white transition-colors text-left"
                  >
                    Convert
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => onNavigateTab?.('calculate')}
                    className="hover:text-white transition-colors text-left"
                  >
                    Calculate
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => onNavigateTab?.('learn')}
                    className="hover:text-white transition-colors text-left"
                  >
                    Learn
                  </button>
                </li>
              </ul>
            </div>

            {/* EDUCATION column */}
            <div>
              <h4 className="text-xs font-semibold tracking-wider text-white mb-4 uppercase">
                Education
              </h4>
              <ul className="space-y-2.5 text-xs sm:text-sm text-[#94A3B8]">
                <li>
                  <button 
                    onClick={() => onNavigateTab?.('learn')}
                    className="hover:text-white transition-colors text-left"
                  >
                    Academy Courses
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => onNavigateTab?.('learn')}
                    className="hover:text-white transition-colors text-left"
                  >
                    Financial Glossary
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => onNavigateTab?.('learn')}
                    className="hover:text-white transition-colors text-left"
                  >
                    Video Tutorials
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => onNavigateTab?.('learn')}
                    className="hover:text-white transition-colors text-left"
                  >
                    Community Forum
                  </button>
                </li>
              </ul>
            </div>

            {/* COMPANY column */}
            <div>
              <h4 className="text-xs font-semibold tracking-wider text-white mb-4 uppercase">
                Company
              </h4>
              <ul className="space-y-2.5 text-xs sm:text-sm text-[#94A3B8]">
                <li>
                  <button 
                    onClick={() => onNavigateTab?.('landing')}
                    className="hover:text-white transition-colors text-left"
                  >
                    About Us
                  </button>
                </li>
                <li>
                  <a href="#careers" onClick={(e) => e.preventDefault()} className="hover:text-white transition-colors">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#press" onClick={(e) => e.preventDefault()} className="hover:text-white transition-colors">
                    Press Kit
                  </a>
                </li>
                <li>
                  <a href="#security" onClick={(e) => e.preventDefault()} className="hover:text-white transition-colors">
                    Security
                  </a>
                </li>
              </ul>
            </div>

          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#64748B] font-inter">
          <p>© 2026 FINOVA Technologies Inc. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <button onClick={() => onNavigateTab?.('landing')} className="hover:text-[#94A3B8] transition-colors">
              Privacy Policy
            </button>
            <button onClick={() => onNavigateTab?.('landing')} className="hover:text-[#94A3B8] transition-colors">
              Terms of Service
            </button>
            <button onClick={() => onNavigateTab?.('landing')} className="hover:text-[#94A3B8] transition-colors">
              Disclosures
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
