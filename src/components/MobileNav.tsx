import React from 'react';
import { ViewMode } from '../types/clinical';

interface MobileNavProps {
  currentView: ViewMode;
  onNavigate: (view: ViewMode) => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ currentView, onNavigate }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#ffffff]/95 backdrop-blur-xl border-t border-[#e0e3e5] shadow-[0_-1px_8px_rgba(0,0,0,0.04)] pb-[env(safe-area-inset-bottom,0px)]">
      <div className="h-16 max-w-md mx-auto px-2 flex items-center justify-around">
        <button
          onClick={() => onNavigate('dashboard')}
          className={`flex flex-col items-center justify-center min-w-[48px] min-h-[48px] w-14 transition-colors cursor-pointer ${
            currentView === 'dashboard'
              ? 'text-[#0055c9] font-bold'
              : 'text-[#43474d] hover:text-[#191c1e]'
          }`}
        >
          <span className="material-symbols-outlined text-[22px]">dashboard</span>
          <span className="text-[11px] mt-0.5 tracking-tight">Home</span>
        </button>

        <button
          onClick={() => onNavigate('find-doctors')}
          className={`flex flex-col items-center justify-center min-w-[48px] min-h-[48px] w-14 transition-colors cursor-pointer ${
            currentView === 'find-doctors'
              ? 'text-[#0055c9] font-bold'
              : 'text-[#43474d] hover:text-[#191c1e]'
          }`}
        >
          <span className="material-symbols-outlined text-[22px]">medical_services</span>
          <span className="text-[11px] mt-0.5 tracking-tight">Doctors</span>
        </button>

        <button
          onClick={() => onNavigate('ai-health')}
          className={`flex flex-col items-center justify-center min-w-[48px] min-h-[48px] w-14 transition-colors cursor-pointer relative ${
            currentView === 'ai-health'
              ? 'text-[#0055c9] font-bold'
              : 'text-[#43474d] hover:text-[#191c1e]'
          }`}
        >
          <div className="relative">
            <span className="material-symbols-outlined text-[22px]">psychology</span>
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#00a187] animate-pulse"></span>
          </div>
          <span className="text-[11px] mt-0.5 tracking-tight">AI Health</span>
        </button>

        <button
          onClick={() => onNavigate('appointments')}
          className={`flex flex-col items-center justify-center min-w-[48px] min-h-[48px] w-14 transition-colors cursor-pointer ${
            currentView === 'appointments'
              ? 'text-[#0055c9] font-bold'
              : 'text-[#43474d] hover:text-[#191c1e]'
          }`}
        >
          <span className="material-symbols-outlined text-[22px]">event_available</span>
          <span className="text-[11px] mt-0.5 tracking-tight">Visits</span>
        </button>

        <button
          onClick={() => onNavigate('health-records')}
          className={`flex flex-col items-center justify-center min-w-[48px] min-h-[48px] w-14 transition-colors cursor-pointer ${
            currentView === 'health-records'
              ? 'text-[#0055c9] font-bold'
              : 'text-[#43474d] hover:text-[#191c1e]'
          }`}
        >
          <span className="material-symbols-outlined text-[22px]">account_circle</span>
          <span className="text-[11px] mt-0.5 tracking-tight">Profile</span>
        </button>
      </div>
    </nav>
  );
};
