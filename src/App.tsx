import { useState, useEffect } from 'react';
import { ViewMode, UserRole, DeviceShell, Doctor, Appointment } from './types/clinical';
import {
  INITIAL_DOCTORS,
  INITIAL_APPOINTMENTS,
  INITIAL_VITALS,
  INITIAL_ACTIVITY_LOG,
  KYNOVIA_LOGO_URL,
} from './data/mockClinicalData';
import { Header } from './components/Header';
import { MobileNav } from './components/MobileNav';
import { DashboardView } from './views/DashboardView';
import { FindDoctorsView } from './views/FindDoctorsView';
import { AIHealthTriagingView } from './views/AIHealthTriagingView';
import { AppointmentsView } from './views/AppointmentsView';
import { HealthVaultView } from './views/HealthVaultView';
import { TelehealthRoomModal } from './views/TelehealthRoomModal';
import { DoctorProfileModal } from './components/DoctorProfileModal';
import { BookDoctorModal } from './components/BookDoctorModal';
import { EmergencyModal } from './components/EmergencyModal';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewMode>('dashboard');
  const [userRole, setUserRole] = useState<UserRole>('patient');
  const [deviceShell, setDeviceShell] = useState<DeviceShell>('responsive');
  const [doctors] = useState<Doctor[]>(INITIAL_DOCTORS);
  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    try {
      const saved = localStorage.getItem('kynovia_appointments');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_APPOINTMENTS;
  });
  const [vitals] = useState(INITIAL_VITALS);
  const [activityLog, setActivityLog] = useState(INITIAL_ACTIVITY_LOG);

  // Modals state
  const [activeTelehealthAppt, setActiveTelehealthAppt] = useState<Appointment | null>(null);
  const [bookingDoctor, setBookingDoctor] = useState<{ doctor: Doctor; slot?: string } | null>(null);
  const [profileDoctor, setProfileDoctor] = useState<Doctor | null>(null);
  const [emergencyModalOpen, setEmergencyModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync appointments to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('kynovia_appointments', JSON.stringify(appointments));
    } catch {
      // ignore
    }
  }, [appointments]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleBookDoctor = (doctor: Doctor, selectedSlot?: string) => {
    setBookingDoctor({ doctor, slot: selectedSlot });
  };

  const handleConfirmBooking = (newAppt: Appointment) => {
    setAppointments(prev => [newAppt, ...prev]);
    // Add to activity log
    setActivityLog(prev => [
      {
        id: `act-${Date.now()}`,
        title: `Appointment Confirmed (${newAppt.code})`,
        subtitle: `${newAppt.doctorName} • ${newAppt.timeDisplay}`,
        timestamp: 'Just now',
        icon: 'event_available',
        colorType: 'blue',
      },
      ...prev,
    ]);
    showToast(`Appointment confirmed with ${newAppt.doctorName} for ${newAppt.dateDisplay}.`);
  };

  const handleReschedule = (appt: Appointment) => {
    const doc = doctors.find(d => d.id === appt.doctorId) || doctors[0];
    setBookingDoctor({ doctor: doc });
  };

  const handleCancelAppointment = (apptId: string) => {
    setAppointments(prev =>
      prev.map(a => (a.id === apptId ? { ...a, status: 'cancelled' } : a))
    );
    showToast('Consultation cancelled. EHR schedule updated.');
  };

  const handleForwardSummaryToPCP = () => {
    showToast('Clinical synthesis summary encrypted & forwarded to Dr. Sunita Kulkarni (PCP).');
  };

  return (
    <div className="min-h-screen bg-[#f7f9fb] text-[#191c1e] flex flex-col antialiased selection:bg-[#0055c9] selection:text-white">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 bg-[#001428] text-white px-4 py-3 rounded-xl shadow-xl border border-[#0f2942] flex items-center gap-2.5 text-xs animate-in slide-in-from-top duration-200">
          <span className="material-symbols-outlined text-[#7cf8da] text-[18px]">verified</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Primary Top Header */}
      <Header
        currentView={currentView}
        onNavigate={setCurrentView}
        userRole={userRole}
        onToggleRole={() => {
          const next = userRole === 'patient' ? 'doctor' : 'patient';
          setUserRole(next);
          showToast(`Switched view to ${next.toUpperCase()} clinical context.`);
        }}
        deviceShell={deviceShell}
        onChangeDeviceShell={setDeviceShell}
        onEmergencyClick={() => setEmergencyModalOpen(true)}
        unreadNotifications={3}
      />

      {/* Main View Shell Container */}
      <div
        className={`flex-1 w-full pb-20 lg:pb-12 ${
          deviceShell === 'mobile'
            ? 'max-w-md mx-auto my-4 bg-white rounded-3xl shadow-2xl border-4 border-slate-800 overflow-hidden'
            : deviceShell === 'desktop'
            ? 'w-full max-w-[1440px] mx-auto'
            : 'w-full'
        }`}
      >
        {/* Render Active View */}
        {currentView === 'dashboard' && (
          <DashboardView
            onNavigate={setCurrentView}
            vitals={vitals}
            doctors={doctors}
            appointments={appointments}
            activityLog={activityLog}
            onBookDoctor={handleBookDoctor}
            onJoinVideoRoom={appt => setActiveTelehealthAppt(appt)}
            onShowDoctorProfile={doc => setProfileDoctor(doc)}
          />
        )}

        {currentView === 'find-doctors' && (
          <FindDoctorsView
            doctors={doctors}
            onBookDoctor={handleBookDoctor}
            onShowDoctorProfile={doc => setProfileDoctor(doc)}
          />
        )}

        {currentView === 'ai-health' && (
          <AIHealthTriagingView
            doctors={doctors}
            onBookDoctor={handleBookDoctor}
            onForwardSummaryToPCP={handleForwardSummaryToPCP}
          />
        )}

        {currentView === 'appointments' && (
          <AppointmentsView
            appointments={appointments}
            doctors={doctors}
            onJoinVideoRoom={appt => setActiveTelehealthAppt(appt)}
            onBookNewConsultation={() => setCurrentView('find-doctors')}
            onRescheduleAppointment={handleReschedule}
            onCancelAppointment={handleCancelAppointment}
          />
        )}

        {currentView === 'health-records' && <HealthVaultView vitals={vitals} />}
      </div>

      {/* Mobile Bottom Navigation (Shown on mobile screens or when Mobile Shell is active) */}
      <div className={deviceShell === 'mobile' ? 'block' : 'lg:hidden'}>
        <MobileNav currentView={currentView} onNavigate={setCurrentView} />
      </div>

      {/* Footer (Desktop Workstation View) */}
      <footer className="hidden lg:block w-full bg-white border-t border-[#e0e3e5] py-6 shadow-xs mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#43474d]">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1 px-2.5 py-0.5 rounded bg-[#f2f4f6] text-[#00a187] font-semibold text-[11px]">
              <span className="material-symbols-outlined text-[15px]">verified_user</span>
              <span>HIPAA & GDPR Validated</span>
            </div>
            <span>Kynovia Clinical Intelligence Platform is an evidence-informed clinical decision-support framework.</span>
          </div>

          <div className="flex items-center gap-4 shrink-0 font-medium">
            <span>© 2026 Kynovia Health Inc.</span>
            <span className="hover:underline cursor-pointer">Privacy Practices</span>
            <span className="hover:underline cursor-pointer">Security Safeguards</span>
            <span className="hover:underline cursor-pointer">HL7/FHIR Spec</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      {activeTelehealthAppt && (
        <TelehealthRoomModal
          appointment={activeTelehealthAppt}
          onClose={() => setActiveTelehealthAppt(null)}
        />
      )}

      {profileDoctor && (
        <DoctorProfileModal
          doctor={profileDoctor}
          onClose={() => setProfileDoctor(null)}
          onBook={doc => {
            setProfileDoctor(null);
            handleBookDoctor(doc);
          }}
        />
      )}

      {bookingDoctor && (
        <BookDoctorModal
          doctor={bookingDoctor.doctor}
          initialSlot={bookingDoctor.slot}
          onClose={() => setBookingDoctor(null)}
          onConfirmBooking={handleConfirmBooking}
        />
      )}

      {emergencyModalOpen && (
        <EmergencyModal onClose={() => setEmergencyModalOpen(false)} />
      )}
    </div>
  );
}
