import React, { useState } from 'react';
import { Appointment, Doctor } from '../types/clinical';

interface AppointmentsViewProps {
  appointments: Appointment[];
  doctors: Doctor[];
  onJoinVideoRoom: (appointment: Appointment) => void;
  onBookNewConsultation: () => void;
  onRescheduleAppointment: (appointment: Appointment) => void;
  onCancelAppointment: (appointmentId: string) => void;
}

export const AppointmentsView: React.FC<AppointmentsViewProps> = ({
  appointments,
  onJoinVideoRoom,
  onBookNewConsultation,
  onRescheduleAppointment,
  onCancelAppointment,
}) => {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'pending' | 'completed' | 'cancelled'>('upcoming');
  const [selectedCalendarDay, setSelectedCalendarDay] = useState<number>(23);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);

  const upcomingAppointments = appointments.filter(a => a.status === 'confirmed');
  const pendingAppointments = appointments.filter(a => a.status === 'pending');
  const completedAppointments = appointments.filter(a => a.status === 'completed');
  const cancelledAppointments = appointments.filter(a => a.status === 'cancelled');

  const displayedList =
    activeTab === 'upcoming'
      ? upcomingAppointments
      : activeTab === 'pending'
      ? pendingAppointments
      : activeTab === 'completed'
      ? completedAppointments
      : cancelledAppointments;

  const handleSyncCalendar = () => {
    setSyncStatus('All scheduled consultations synced with device calendar.');
    setTimeout(() => setSyncStatus(null), 3000);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-6">
      {/* Top Command Deck */}
      <section className="bg-white rounded-xl p-5 sm:p-6 border border-[#e0e3e5] shadow-xs flex flex-col gap-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="font-headline font-bold text-2xl sm:text-3xl text-[#001428] tracking-tight">
                Appointments & Clinical Visits
              </h1>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#f2f4f6] text-[#43474d] text-xs font-semibold">
                <span className="material-symbols-outlined text-[14px] text-[#0055c9]">schedule</span>
                Eastern Daylight Time - EDT
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#43474d]">
              Coordinate specialized diagnostic consultations, manage provider bookings, and review visit preparation directives.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
            <button
              onClick={handleSyncCalendar}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#f2f4f6] hover:bg-[#e6e8ea] text-[#001428] text-xs font-bold transition-colors cursor-pointer border border-[#e0e3e5]"
            >
              <span className="material-symbols-outlined text-[18px] text-[#0055c9]">sync</span>
              <span>Sync External Calendar</span>
            </button>
            <button
              onClick={onBookNewConsultation}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#001428] text-white text-xs font-bold shadow-xs hover:bg-[#0f2942] transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">add_circle</span>
              <span>Book New Consultation</span>
            </button>
          </div>
        </div>

        {syncStatus && (
          <div className="p-2.5 rounded-lg bg-[#7cf8da]/20 border border-[#00a187]/40 text-[#002e25] text-xs font-semibold flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px] text-[#00a187]">check_circle</span>
            <span>{syncStatus}</span>
          </div>
        )}

        {/* Tab Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar pt-1">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'upcoming'
                ? 'bg-[#001428] text-white shadow-xs'
                : 'bg-[#f2f4f6] text-[#43474d] hover:bg-[#e6e8ea]'
            }`}
          >
            <span>Upcoming Consultations</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                activeTab === 'upcoming' ? 'bg-[#0055c9] text-white' : 'bg-[#e0e3e5] text-[#191c1e]'
              }`}
            >
              {upcomingAppointments.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('pending')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'pending'
                ? 'bg-[#001428] text-white shadow-xs'
                : 'bg-[#f2f4f6] text-[#43474d] hover:bg-[#e6e8ea]'
            }`}
          >
            <span>Pending Confirmation</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                activeTab === 'pending' ? 'bg-[#0055c9] text-white' : 'bg-[#e0e3e5] text-[#191c1e]'
              }`}
            >
              {pendingAppointments.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('completed')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'completed'
                ? 'bg-[#001428] text-white shadow-xs'
                : 'bg-[#f2f4f6] text-[#43474d] hover:bg-[#e6e8ea]'
            }`}
          >
            <span>Completed Visits & Discharge</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                activeTab === 'completed' ? 'bg-[#0055c9] text-white' : 'bg-[#e0e3e5] text-[#191c1e]'
              }`}
            >
              {completedAppointments.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('cancelled')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'cancelled'
                ? 'bg-[#001428] text-white shadow-xs'
                : 'bg-[#f2f4f6] text-[#43474d] hover:bg-[#e6e8ea]'
            }`}
          >
            <span>Cancelled</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                activeTab === 'cancelled' ? 'bg-[#0055c9] text-white' : 'bg-[#e0e3e5] text-[#191c1e]'
              }`}
            >
              {cancelledAppointments.length}
            </span>
          </button>
        </div>
      </section>

      {/* Main Grid: Left Appointment Cards + Right Calendar & Directives */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 lg:gap-8 items-start">
        {/* Left Column (8 cols on XL) */}
        <div className="xl:col-span-8 flex flex-col gap-6">
          {displayedList.length === 0 ? (
            <div className="bg-white rounded-xl p-12 border border-[#e0e3e5] shadow-xs text-center flex flex-col items-center justify-center gap-3">
              <div className="w-12 h-12 rounded-full bg-[#f2f4f6] flex items-center justify-center text-[#74777e]">
                <span className="material-symbols-outlined text-[24px]">event_busy</span>
              </div>
              <h3 className="font-headline font-bold text-base text-[#001428]">
                No Appointments in this tab
              </h3>
              <p className="text-xs text-[#43474d] max-w-sm">
                All scheduled consultations are currently active or logged under completed clinical records.
              </p>
              <button
                onClick={onBookNewConsultation}
                className="mt-2 px-4 py-2 rounded-lg bg-[#001428] text-white text-xs font-bold cursor-pointer"
              >
                Book New Consultation
              </button>
            </div>
          ) : (
            displayedList.map(appt => {
              const isTelehealth = appt.type === 'telehealth';
              const isPending = appt.status === 'pending';

              return (
                <article
                  key={appt.id}
                  className={`bg-white rounded-xl border border-[#e0e3e5] shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col gap-4 p-5 sm:p-6 ${
                    isPending ? 'border-l-4 border-l-[#0055c9]' : ''
                  }`}
                >
                  {/* Card Header Ribbons */}
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#43474d]">
                        {appt.code}
                      </span>
                      <span className="text-slate-300">•</span>
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-[#dae2ff] text-[#001946] text-[11px] font-bold">
                        <span className="material-symbols-outlined text-[13px]">
                          {isTelehealth ? 'videocam' : 'domain'}
                        </span>
                        {appt.typeLabel}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                          appt.status === 'confirmed'
                            ? 'bg-[#7cf8da]/20 text-[#00a187]'
                            : appt.status === 'pending'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {appt.status === 'confirmed' && <span className="w-1.5 h-1.5 rounded-full bg-[#00a187]"></span>}
                        {appt.status.toUpperCase()}
                      </span>
                    </div>

                    {appt.status === 'confirmed' && isTelehealth && (
                      <span className="text-[11px] font-bold text-[#0055c9] uppercase tracking-wider flex items-center gap-1">
                        <span className="material-symbols-outlined text-[15px]">priority_high</span>
                        Happening Soon
                      </span>
                    )}
                  </div>

                  {/* Doctor Info & Timing */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                    <div className="md:col-span-3 flex flex-col items-center sm:items-start text-center sm:text-left gap-1">
                      <div className="relative w-20 h-20 rounded-xl overflow-hidden shadow-xs border-2 border-white bg-slate-200">
                        <img
                          src={appt.doctorImage}
                          alt={appt.doctorName}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute bottom-0 right-0 p-0.5 bg-white rounded-full">
                          <span className="material-symbols-outlined text-[#0055c9] text-[15px] block">verified</span>
                        </div>
                      </div>
                      <span className="text-[10px] text-[#00a187] font-bold uppercase tracking-wider mt-1">
                        Board Certified
                      </span>
                    </div>

                    <div className="md:col-span-9 flex flex-col gap-1">
                      <h2 className="font-headline font-bold text-base sm:text-lg text-[#001428]">
                        {appt.doctorTitle}
                      </h2>
                      <p className="text-xs text-[#43474d]">{appt.doctorSpecialty}</p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                        <div className="flex items-center gap-2 text-xs font-bold text-[#001428]">
                          <span className="material-symbols-outlined text-[#0055c9] text-[18px]">event</span>
                          <span>{appt.dateDisplay}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs font-semibold text-[#0055c9]">
                          <span className="material-symbols-outlined text-[18px]">schedule</span>
                          <span>{appt.timeDisplay}</span>
                        </div>
                      </div>

                      {appt.facilityName && (
                        <div className="flex items-start gap-1.5 text-xs text-[#43474d] mt-1">
                          <span className="material-symbols-outlined text-[16px] text-[#74777e] mt-0.5">location_on</span>
                          <div>
                            <span className="font-bold text-[#191c1e]">{appt.facilityName}</span>
                            <span className="block text-[11px]">{appt.facilityAddress}</span>
                          </div>
                        </div>
                      )}

                      {/* Clinical Focus Tag */}
                      <div className="mt-2 inline-flex items-center gap-1.5 p-2 rounded-lg bg-[#f2f4f6] text-xs">
                        <span className="material-symbols-outlined text-[#00a187] text-[16px]">vital_signs</span>
                        <span className="font-semibold text-[#001428]">Clinical Focus:</span>
                        <span className="text-[#43474d] truncate">{appt.clinicalFocus}</span>
                      </div>
                    </div>
                  </div>

                  {/* Telehealth Room Direct Launcher */}
                  {isTelehealth && appt.status === 'confirmed' && (
                    <div className="p-4 rounded-xl bg-[#f2f4f6] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border border-[#e0e3e5]">
                      <div className="flex flex-col gap-0.5">
                        <div className="flex items-center gap-2 text-xs font-semibold text-[#00a187]">
                          <span className="material-symbols-outlined text-[16px]">check_circle</span>
                          <span>Audio & Video Test Passed • HIPAA 256-bit Encrypted</span>
                        </div>
                        <p className="text-[11px] text-[#43474d]">
                          Virtual room check-in opens 10 minutes prior to session start.
                        </p>
                      </div>
                      <button
                        onClick={() => onJoinVideoRoom(appt)}
                        className="shrink-0 flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-[#001428] text-white text-xs font-bold hover:bg-[#0f2942] transition-colors shadow-xs cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[18px]">videocam</span>
                        <span>Join Video Room</span>
                      </button>
                    </div>
                  )}

                  {/* In-Clinic Campus Navigation & Parking Snippet */}
                  {!isTelehealth && appt.parkingInfo && (
                    <div className="rounded-xl overflow-hidden border border-[#e0e3e5] bg-[#f2f4f6] flex flex-col">
                      <div className="p-2.5 bg-white border-b border-[#e0e3e5] flex flex-wrap items-center justify-between gap-2 text-xs">
                        <div className="flex items-center gap-1.5 text-[#001428] font-bold">
                          <span className="material-symbols-outlined text-[#0055c9] text-[16px]">local_parking</span>
                          <span>{appt.parkingInfo}</span>
                        </div>
                        <button
                          onClick={() => alert(`Launching turn-by-turn directions to ${appt.facilityAddress}`)}
                          className="text-xs text-[#0055c9] font-bold hover:underline flex items-center gap-0.5 cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[16px]">navigation</span>
                          <span>Get Directions</span>
                        </button>
                      </div>

                      {/* Map Image preview */}
                      <div className="w-full h-32 bg-slate-200 relative overflow-hidden bg-cover bg-center" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuA-bCCPVFnl8xlyqL2Fcd-7zHAWs0L8rZTbNI_SFORqHtHnsaNTYkE4Mbjdv1DAUBxoztymSpdbtt7x0_p8ZYYqVoX9acZdTe4ewG5hPwUtBGKE39njrm6xxKnrxqIkZdPoqnlZijgr0Tv5Iz2bQdULP8z7YyjbE-1Lwt1PeWIe4TljECptQy4nyiusF2-j6OpU3qM1hYD3k6dihWVmBRL6Hl2L65ZYzfnUfV3Bqsr0HNW5PcgNlHrSag')" }}>
                        <div className="absolute inset-0 bg-[#001428]/10"></div>
                        <div className="absolute bottom-2 left-2 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-lg text-xs font-bold text-[#001428] shadow-xs flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-[#0055c9] animate-ping"></span>
                          <span>Campus Navigation Active (Suite 402)</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Actions Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-[#e0e3e5]">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => alert(`Saved consultation to external calendar (.ics)`)}
                        className="px-3 py-1.5 rounded-lg bg-[#f2f4f6] text-[#001428] text-xs font-semibold hover:bg-[#e6e8ea] flex items-center gap-1 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[15px]">calendar_add_on</span>
                        <span>Add to Calendar</span>
                      </button>
                      <button
                        onClick={() => alert(`Pre-visit notes for ${appt.doctorName}: Review current medication intake and note any headache trigger timing.`)}
                        className="px-3 py-1.5 rounded-lg bg-[#f2f4f6] text-[#001428] text-xs font-semibold hover:bg-[#e6e8ea] flex items-center gap-1 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[15px]">description</span>
                        <span>Pre-visit Notes</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onRescheduleAppointment(appt)}
                        className="px-3 py-1.5 rounded-lg text-[#0055c9] text-xs font-bold hover:bg-[#f2f4f6] cursor-pointer"
                      >
                        Reschedule
                      </button>
                      {appt.status !== 'cancelled' && (
                        <button
                          onClick={() => {
                            if (confirm(`Are you sure you want to cancel appointment ${appt.code}?`)) {
                              onCancelAppointment(appt.id);
                            }
                          }}
                          className="px-3 py-1.5 rounded-lg text-[#ba1a1a] text-xs font-bold hover:bg-[#ffdad6]/40 cursor-pointer"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                </article>
              );
            })
          )}
        </div>

        {/* Right Column: Calendar Widget + Directives (4 cols on XL) */}
        <aside className="xl:col-span-4 flex flex-col gap-6">
          {/* Interactive October 2024 Calendar Widget */}
          <section className="bg-white rounded-xl p-5 border border-[#e0e3e5] shadow-xs flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-headline font-bold text-base text-[#001428]">October 2024</h4>
                <span className="text-xs text-[#43474d]">3 Scheduled Consultations</span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => alert('Viewing previous month (September 2024)')}
                  className="p-1 rounded-lg hover:bg-[#f2f4f6] text-[#74777e] cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                </button>
                <button
                  onClick={() => alert('Viewing next month (November 2024)')}
                  className="p-1 rounded-lg hover:bg-[#f2f4f6] text-[#74777e] cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                </button>
              </div>
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold text-[#74777e] py-1">
              <span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium">
              <span className="p-2 text-slate-300">29</span>
              <span className="p-2 text-slate-300">30</span>
              <span className="p-2 text-[#43474d]">1</span>
              <span className="p-2 text-[#43474d]">2</span>
              <span className="p-2 text-[#43474d]">3</span>
              <span className="p-2 text-[#43474d]">4</span>
              <span className="p-2 text-[#43474d]">5</span>
              <span className="p-2 text-[#43474d]">6</span>
              <span className="p-2 text-[#43474d]">7</span>
              <span className="p-2 text-[#43474d]">8</span>
              <span className="p-2 text-[#43474d]">9</span>
              <span className="p-2 text-[#43474d]">10</span>
              <span className="p-2 text-[#43474d]">11</span>
              <span className="p-2 text-[#43474d]">12</span>
              <span className="p-2 text-[#43474d]">13</span>
              <span className="p-2 text-[#43474d]">14</span>
              <span className="p-2 text-[#43474d]">15</span>
              <span className="p-2 text-[#43474d]">16</span>
              <span className="p-2 text-[#43474d]">17</span>
              <span className="p-2 text-[#43474d]">18</span>
              <span className="p-2 text-[#43474d]">19</span>
              <span className="p-2 text-[#43474d]">20</span>
              <span className="p-2 text-[#43474d]">21</span>
              <span className="p-2 text-[#43474d]">22</span>

              {/* Day 23: Highlighted Telehealth Appointment */}
              <button
                onClick={() => setSelectedCalendarDay(23)}
                className={`p-1.5 rounded-lg flex flex-col items-center justify-center font-bold cursor-pointer ${
                  selectedCalendarDay === 23
                    ? 'bg-[#001428] text-white shadow-xs'
                    : 'bg-[#dae2ff] text-[#001946]'
                }`}
              >
                <span>23</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#7cf8da]"></span>
              </button>

              <span className="p-2 text-[#43474d]">24</span>
              <span className="p-2 text-[#43474d]">25</span>
              <span className="p-2 text-[#43474d]">26</span>
              <span className="p-2 text-[#43474d]">27</span>

              {/* Day 28: Highlighted In-Clinic Visit */}
              <button
                onClick={() => setSelectedCalendarDay(28)}
                className={`p-1.5 rounded-lg flex flex-col items-center justify-center font-bold cursor-pointer ${
                  selectedCalendarDay === 28
                    ? 'bg-[#001428] text-white shadow-xs'
                    : 'bg-[#f2f4f6] text-[#001428]'
                }`}
              >
                <span>28</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#0055c9]"></span>
              </button>

              <span className="p-2 text-[#43474d]">29</span>
              <span className="p-2 text-[#43474d]">30</span>
              <span className="p-2 text-[#43474d]">31</span>
              <span className="p-2 text-slate-300">1</span>

              {/* Nov 2: Pending request */}
              <button
                onClick={() => setSelectedCalendarDay(2)}
                className={`p-1.5 rounded-lg flex flex-col items-center justify-center font-bold cursor-pointer ${
                  selectedCalendarDay === 2
                    ? 'bg-[#001428] text-white shadow-xs'
                    : 'bg-amber-100 text-amber-900'
                }`}
              >
                <span>2</span>
                <span className="w-1.5 h-1.5 rounded-full bg-amber-600"></span>
              </button>
            </div>

            {/* Schedule Density Legend */}
            <div className="pt-2 border-t border-[#e0e3e5] flex items-center justify-between text-[11px] text-[#43474d]">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#7cf8da]"></span>
                <span>Telehealth</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#0055c9]"></span>
                <span>In-Clinic</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-600"></span>
                <span>Pending</span>
              </div>
            </div>
          </section>

          {/* Clinical Visit Preparation Checklist Directives */}
          <section className="bg-white rounded-xl p-5 border border-[#e0e3e5] shadow-xs flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h4 className="font-headline font-bold text-sm text-[#001428]">Preparation Directives</h4>
              <span className="text-[10px] font-bold uppercase text-[#0055c9] tracking-wider">
                Pre-Visit Tasks
              </span>
            </div>

            <div className="space-y-2.5">
              {/* Directive 1: Fasting */}
              <div className="p-3 rounded-lg bg-[#f2f4f6] flex items-start gap-3 border border-[#e0e3e5]">
                <div className="p-1 rounded bg-[#ffdad6] text-[#ba1a1a] shrink-0 mt-0.5">
                  <span className="material-symbols-outlined text-[16px]">no_food</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-[#001428]">Fasting Blood Draw Required</span>
                  <span className="text-[11px] text-[#43474d] mt-0.5">
                    Fasting required 8 hours prior to Oct 28 exam. Water is permitted.
                  </span>
                </div>
              </div>

              {/* Directive 2: Insurance Pre-Auth */}
              <div className="p-3 rounded-lg bg-[#f2f4f6] flex items-start gap-3 border border-[#e0e3e5]">
                <div className="p-1 rounded bg-[#7cf8da]/30 text-[#00a187] shrink-0 mt-0.5">
                  <span className="material-symbols-outlined text-[16px]">verified</span>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#001428]">Insurance Pre-Authorization</span>
                    <span className="px-1.5 py-0.2 rounded bg-[#7cf8da]/30 text-[#00a187] text-[10px] font-bold uppercase">
                      Verified
                    </span>
                  </div>
                  <span className="text-[11px] text-[#43474d] mt-0.5">
                    Coverage approved through Blue Cross Blue Shield PPO.
                  </span>
                </div>
              </div>

              {/* Directive 3: Copay Breakdown */}
              <div className="p-3 rounded-lg bg-[#f2f4f6] flex items-start gap-3 border border-[#e0e3e5]">
                <div className="p-1 rounded bg-[#dae2ff] text-[#001946] shrink-0 mt-0.5">
                  <span className="material-symbols-outlined text-[16px]">payments</span>
                </div>
                <div className="flex flex-col w-full">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#001428]">Active Copay Summary</span>
                    <span className="font-headline font-bold text-sm text-[#001428]">$25.00</span>
                  </div>
                  <span className="text-[11px] text-[#43474d] mt-0.5">
                    Specialist Tier Copay • Auto-deduct on file
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* 24/7 Clinical Support Banner */}
          <section className="bg-[#0f2942] text-white rounded-xl p-5 shadow-sm flex flex-col gap-3 relative overflow-hidden">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#7cf8da] text-[22px]">contact_support</span>
              <h4 className="font-headline font-bold text-sm text-white">24/7 Clinical Support</h4>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Need urgent assistance, symptom reassessment, or sudden rescheduling? Speak with on-call Kynovia triage nurses anytime.
            </p>
            <div className="flex flex-col gap-2 pt-1">
              <a
                href="tel:18005550199"
                className="w-full py-2.5 px-3 rounded-lg bg-white text-[#001428] font-bold text-xs flex items-center justify-center gap-2 hover:bg-slate-100 transition-colors shadow-xs"
              >
                <span className="material-symbols-outlined text-[#0055c9] text-[18px]">call</span>
                <span>+1 (800) 555-0199</span>
              </a>
              <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-300">
                <span className="w-2 h-2 rounded-full bg-[#00a187] animate-pulse"></span>
                <span>Average queue wait time: &lt; 2 minutes</span>
              </div>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
};
