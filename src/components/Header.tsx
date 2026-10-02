import React from 'react';
import { ViewMode, UserRole, DeviceShell } from '../types/clinical';
import { KYNOVIA_LOGO_URL } from '../data/mockClinicalData';

interface HeaderProps {
  currentView: ViewMode;
  onNavigate: (view: ViewMode) => void;
  userRole: UserRole;
  onToggleRole: () => void;
  deviceShell: DeviceShell;
  onChangeDeviceShell: (shell: DeviceShell) => void;
  onEmergencyClick: () => void;
  unreadNotifications: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onNavigate,
  userRole,
  onToggleRole,
  deviceShell,
  onChangeDeviceShell,
  onEmergencyClick,
  unreadNotifications,
}) => {
  return (
    <header className="sticky top-0 z-50 w-full bg-[#ffffff]/95 backdrop-blur-md border-b border-[#e0e3e5] shadow-[0_1px_4px_rgba(15,41,66,0.04)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-2 sm:gap-4">
        {/* Brand Zone */}
        <div className="flex items-center gap-3 sm:gap-6 min-w-0">
          <button
            onClick={() => onNavigate('dashboard')}
            className="flex items-center gap-2.5 text-left focus:outline-none group cursor-pointer"
          >
            <img
              src={KYNOVIA_LOGO_URL}
              alt="Kynovia AI Healthcare Logo"
              className="h-8 sm:h-9 w-auto object-contain shrink-0 group-hover:scale-105 transition-transform"
            />
            <div className="flex flex-col min-w-0">
              <span className="font-headline font-bold text-base sm:text-lg text-[#001428] leading-tight tracking-tight truncate">
                Kynovia
              </span>
              <span className="font-body text-[10px] sm:text-[11px] font-semibold text-[#00a187] uppercase tracking-wider leading-none">
                Clinical AI
              </span>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2 text-[13px] font-semibold">
            <button
              onClick={() => onNavigate('dashboard')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                currentView === 'dashboard'
                  ? 'bg-[#f2f4f6] text-[#0f2942] font-bold shadow-xs'
                  : 'text-[#43474d] hover:text-[#191c1e] hover:bg-[#f2f4f6]/60'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => onNavigate('find-doctors')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                currentView === 'find-doctors'
                  ? 'bg-[#f2f4f6] text-[#0f2942] font-bold shadow-xs'
                  : 'text-[#43474d] hover:text-[#191c1e] hover:bg-[#f2f4f6]/60'
              }`}
            >
              Find Doctors
            </button>
            <button
              onClick={() => onNavigate('appointments')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                currentView === 'appointments'
                  ? 'bg-[#f2f4f6] text-[#0f2942] font-bold shadow-xs'
                  : 'text-[#43474d] hover:text-[#191c1e] hover:bg-[#f2f4f6]/60'
              }`}
            >
              Appointments
            </button>
            <button
              onClick={() => onNavigate('ai-health')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                currentView === 'ai-health'
                  ? 'bg-[#f2f4f6] text-[#00a187] font-bold shadow-xs'
                  : 'text-[#43474d] hover:text-[#00a187] hover:bg-[#f2f4f6]/60'
              }`}
            >
              <span className="material-symbols-outlined text-[16px] text-[#00a187]">neurology</span>
              AI Health Triaging
            </button>
            <button
              onClick={() => onNavigate('health-records')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                currentView === 'health-records'
                  ? 'bg-[#f2f4f6] text-[#0f2942] font-bold shadow-xs'
                  : 'text-[#43474d] hover:text-[#191c1e] hover:bg-[#f2f4f6]/60'
              }`}
            >
              Health Records
            </button>
          </nav>
        </div>

        {/* Right Zone Controls & Indicators */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Viewport Preview Mode Switcher (Allows testing both Desktop Workstation & Mobile App layouts) */}
          <div className="hidden sm:inline-flex items-center bg-[#f2f4f6] p-0.5 rounded-lg border border-[#e0e3e5]/70 text-xs">
            <button
              onClick={() => onChangeDeviceShell('responsive')}
              title="Responsive Auto-Fitting Layout"
              className={`px-2 py-1 rounded font-medium transition-all cursor-pointer flex items-center gap-1 ${
                deviceShell === 'responsive'
                  ? 'bg-white text-[#0f2942] shadow-xs font-semibold'
                  : 'text-[#43474d] hover:text-[#191c1e]'
              }`}
            >
              <span className="material-symbols-outlined text-[14px]">devices</span>
              <span className="hidden xl:inline">Auto</span>
            </button>
            <button
              onClick={() => onChangeDeviceShell('desktop')}
              title="Desktop Workstation Layout (1440px wide)"
              className={`px-2 py-1 rounded font-medium transition-all cursor-pointer flex items-center gap-1 ${
                deviceShell === 'desktop'
                  ? 'bg-white text-[#0f2942] shadow-xs font-semibold'
                  : 'text-[#43474d] hover:text-[#191c1e]'
              }`}
            >
              <span className="material-symbols-outlined text-[14px]">desktop_windows</span>
              <span className="hidden xl:inline">Desktop</span>
            </button>
            <button
              onClick={() => onChangeDeviceShell('mobile')}
              title="Mobile Tab Layout"
              className={`px-2 py-1 rounded font-medium transition-all cursor-pointer flex items-center gap-1 ${
                deviceShell === 'mobile'
                  ? 'bg-white text-[#0f2942] shadow-xs font-semibold'
                  : 'text-[#43474d] hover:text-[#191c1e]'
              }`}
            >
              <span className="material-symbols-outlined text-[14px]">smartphone</span>
              <span className="hidden xl:inline">Mobile</span>
            </button>
          </div>

          {/* Telemetry Active Status Indicator */}
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#f2f4f6] text-[11px] font-semibold text-[#43474d]">
            <span className="w-2 h-2 rounded-full bg-[#00a187] animate-pulse"></span>
            <span className="truncate">Telemetry Active</span>
          </div>

          {/* Emergency 911 Shortcut Button */}
          <button
            onClick={onEmergencyClick}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#ffdad6] text-[#ba1a1a] hover:bg-[#ba1a1a] hover:text-white transition-colors text-[11px] font-bold uppercase tracking-wider cursor-pointer"
            title="Emergency Medical Assistance"
          >
            <span className="material-symbols-outlined text-[15px]">emergency</span>
            <span className="hidden sm:inline">Emergency 112</span>
          </button>

          {/* Notifications Button */}
          <button
            onClick={() => alert('Notifications:\n• Lipid panel results synced from Central Labs, Bengaluru.\n• Dr. Sunita Kulkarni confirmed Thursday 10:30 AM video consultation.\n• Air quality alert: High oak pollen detected in Bengaluru area.')}
            aria-label="Notifications"
            className="relative p-2 rounded-lg text-[#43474d] hover:text-[#001428] hover:bg-[#f2f4f6] transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">notifications</span>
            {unreadNotifications > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#ba1a1a] rounded-full"></span>
            )}
          </button>

          {/* Role Switcher Pill (Patient vs Doctor) */}
          <div className="inline-flex items-center bg-[#f2f4f6] p-0.5 rounded-full">
            <button
              onClick={onToggleRole}
              className={`px-2.5 py-1 text-[11px] font-semibold rounded-full transition-all cursor-pointer ${
                userRole === 'patient'
                  ? 'bg-white text-[#001428] shadow-xs'
                  : 'text-[#43474d] hover:text-[#001428]'
              }`}
            >
              Patient
            </button>
            <button
              onClick={onToggleRole}
              className={`px-2.5 py-1 text-[11px] font-semibold rounded-full transition-all cursor-pointer flex items-center gap-0.5 ${
                userRole === 'doctor'
                  ? 'bg-[#001428] text-white shadow-xs'
                  : 'text-[#43474d] hover:text-[#001428]'
              }`}
            >
              <span>Doctor</span>
              <span className="material-symbols-outlined text-[13px]">swap_horiz</span>
            </button>
          </div>

          {/* Patient Account Profile Lockup */}
          <div className="flex items-center gap-2 pl-1 border-l border-[#e0e3e5]">
            <div className="w-8 h-8 rounded-full bg-[#001428] text-white flex items-center justify-center font-bold text-xs">
              <span className="material-symbols-outlined text-[18px]">person</span>
            </div>
            <div className="hidden 2xl:flex flex-col text-left">
              <span className="text-[12px] font-bold text-[#191c1e] leading-tight">Alexander Wright</span>
              <span className="text-[10px] text-[#43474d]">#KY-8821</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
