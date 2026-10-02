import React, { useState } from 'react';
import { ViewMode, Doctor, Appointment, PatientVitals, ActivityItem } from '../types/clinical';

interface DashboardViewProps {
  onNavigate: (view: ViewMode) => void;
  vitals: PatientVitals;
  doctors: Doctor[];
  appointments: Appointment[];
  activityLog: ActivityItem[];
  onBookDoctor: (doctor: Doctor) => void;
  onJoinVideoRoom: (appointment: Appointment) => void;
  onShowDoctorProfile: (doctor: Doctor) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onNavigate,
  vitals,
  doctors,
  appointments,
  activityLog,
  onBookDoctor,
  onJoinVideoRoom,
  onShowDoctorProfile,
}) => {
  const [otcAuthorized, setOtcAuthorized] = useState(false);
  const [prescriptionRefillRequested, setPrescriptionRefillRequested] = useState(false);

  // Find next scheduled upcoming appointment
  const nextAppointment = appointments.find(a => a.status === 'confirmed') || appointments[0];

  return (
    <div className="w-full flex flex-col gap-6 sm:gap-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Patient Greeting & Status Header */}
      <section className="flex flex-col gap-4">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#43474d] flex-wrap">
              <span className="uppercase tracking-wider">Patient Portal</span>
              <span>•</span>
              <span className="text-[#001428]">ID: #KY-8821</span>
              <span>•</span>
              <span className="flex items-center gap-1.5 text-[#00a187]">
                <span className="w-2 h-2 rounded-full bg-[#00a187] animate-pulse"></span>
                Biometric Stream Live
              </span>
            </div>
            <h1 className="font-headline font-bold text-2xl sm:text-3xl lg:text-4xl text-[#001428] tracking-tight">
              Good morning, Alexander Wright
            </h1>
            <p className="font-body text-xs sm:text-sm text-[#43474d] flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-[#00a187]">verified</span>
              <span>{vitals.biometricSource} • All vitals normal • Synced {vitals.lastSynced}</span>
            </p>
          </div>

          <div className="flex items-center gap-2.5 self-start lg:self-auto flex-wrap">
            <button
              onClick={() => alert('Exporting encrypted clinical health report (PDF with HL7/FHIR cryptographic signature)...')}
              className="flex items-center gap-2 px-3.5 py-2 bg-white text-[#191c1e] font-semibold text-xs rounded-lg border border-[#e0e3e5] shadow-xs hover:bg-[#f2f4f6] transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px] text-[#0055c9]">download</span>
              <span>Export PDF Health Summary</span>
            </button>
            <button
              onClick={() => onNavigate('ai-health')}
              className="flex items-center gap-2 px-3.5 py-2 bg-[#001428] text-white font-semibold text-xs rounded-lg shadow-sm hover:bg-[#0f2942] transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px] text-[#7cf8da]">neurology</span>
              <span>Urgent Triage Request</span>
            </button>
          </div>
        </div>

        {/* 4-KPI Telemetry Summary Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Vitals Biometrics */}
          <div className="bg-white rounded-xl p-4 border border-[#e0e3e5] shadow-xs flex flex-col justify-between gap-3">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-semibold text-[#43474d] uppercase tracking-wider block">
                  Vitals Biometrics
                </span>
                <span className="font-headline font-bold text-lg text-[#001428] mt-0.5 block">
                  Optimal Range
                </span>
              </div>
              <span className="px-2 py-0.5 rounded bg-[#f2f4f6] text-[#00a187] text-[11px] font-bold">
                STABLE
              </span>
            </div>

            <div className="flex items-baseline justify-between mt-1">
              <div>
                <span className="font-headline font-bold text-2xl text-[#001428]">{vitals.bloodPressure}</span>
                <span className="text-xs text-[#43474d] ml-1">mmHg</span>
              </div>
              <div className="text-right">
                <span className="font-headline font-bold text-lg text-[#001428]">{vitals.restingHeartRate}</span>
                <span className="text-[11px] text-[#43474d] ml-0.5">bpm (Resting)</span>
              </div>
            </div>

            {/* Micro SVG Pulse Sparkline */}
            <div className="w-full pt-1">
              <svg className="w-full h-7 overflow-visible" viewBox="0 0 100 24" preserveAspectRatio="none" fill="none">
                <defs>
                  <linearGradient id="vitalGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#00a187" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#00a187" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path
                  d="M0,16 Q15,10 30,14 T60,6 T80,15 T100,10"
                  stroke="#00a187"
                  strokeWidth="2"
                  strokeLinecap="round"
                  vectorEffect="non-scaling-stroke"
                />
                <path
                  d="M0,16 Q15,10 30,14 T60,6 T80,15 T100,10 L100,24 L0,24 Z"
                  fill="url(#vitalGrad)"
                />
                <circle cx="100" cy="10" r="2.5" fill="#00a187" />
              </svg>
            </div>
          </div>

          {/* Card 2: Next Telehealth Visit */}
          <div className="bg-white rounded-xl p-4 border border-[#e0e3e5] shadow-xs flex flex-col justify-between gap-3">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-semibold text-[#43474d] uppercase tracking-wider block">
                  Next Telehealth
                </span>
                <span className="font-headline font-bold text-lg text-[#001428] mt-0.5 truncate block">
                  Dr. Sunita Kulkarni
                </span>
              </div>
              <span className="px-2 py-0.5 rounded bg-[#dae2ff] text-[#00419e] text-[11px] font-bold">
                IN 2 DAYS
              </span>
            </div>

            <div className="flex flex-col gap-0.5">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-[#001428]">
                <span className="material-symbols-outlined text-[16px] text-[#0055c9]">calendar_today</span>
                <span>Thursday, Oct 24 • 10:30 AM IST</span>
              </div>
              <span className="text-xs text-[#43474d] truncate">Neurology • Lavelle Road & Virtual Hub</span>
            </div>

            <div className="w-full bg-[#f2f4f6] rounded-lg p-1.5 flex items-center justify-between">
              <span className="text-[11px] text-[#43474d] flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px] text-[#00a187]">videocam</span>
                Virtual Room Ready
              </span>
              <button
                onClick={() => nextAppointment && onJoinVideoRoom(nextAppointment)}
                className="text-[11px] text-[#0055c9] font-bold hover:underline cursor-pointer"
              >
                Join Video Call
              </button>
            </div>
          </div>

          {/* Card 3: Active Medication Regimen */}
          <div className="bg-white rounded-xl p-4 border border-[#e0e3e5] shadow-xs flex flex-col justify-between gap-3">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-semibold text-[#43474d] uppercase tracking-wider block">
                  Medication Regimen
                </span>
                <span className="font-headline font-bold text-lg text-[#001428] mt-0.5 block">
                  3 Active Prescriptions
                </span>
              </div>
              <span className="px-2 py-0.5 rounded bg-[#ffdad6] text-[#ba1a1a] text-[11px] font-bold">
                1 REFILL DUE
              </span>
            </div>

            <div className="flex flex-col gap-1 text-xs">
              <div className="flex items-center justify-between text-[#191c1e]">
                <span className="font-semibold truncate">Atorvastatin 20mg</span>
                <span className="text-[#43474d]">Daily (Night)</span>
              </div>
              <div className="flex items-center justify-between text-[#191c1e]">
                <span className="truncate">Cetirizine 10mg</span>
                <span className="text-[#ba1a1a] font-bold">Refill in 4d</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <div className="w-3/4 bg-[#e6e8ea] rounded-full h-1.5 overflow-hidden">
                <div className="bg-[#0055c9] h-full rounded-full" style={{ width: '75%' }}></div>
              </div>
              <button
                onClick={() => {
                  setPrescriptionRefillRequested(true);
                  alert('Refill requested for Cetirizine 10mg. Prescription sent to Central Mail-Order Pharmacy for next-day dispatch.');
                }}
                disabled={prescriptionRefillRequested}
                className="text-[11px] text-[#0055c9] font-bold hover:underline cursor-pointer disabled:text-[#74777e]"
              >
                {prescriptionRefillRequested ? 'Refilled ✓' : 'Refill Now'}
              </button>
            </div>
          </div>

          {/* Card 4: AI Diagnostic Risk */}
          <div className="bg-white rounded-xl p-4 border border-[#e0e3e5] shadow-xs flex flex-col justify-between gap-3 relative overflow-hidden">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-semibold text-[#43474d] uppercase tracking-wider block">
                  AI Diagnostic Risk
                </span>
                <span className="font-headline font-bold text-lg text-[#001428] mt-0.5 block">
                  Low Risk Flag
                </span>
              </div>
              <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-[#f2f4f6] text-[#00a187] text-[11px] font-bold">
                <span className="material-symbols-outlined text-[13px]">auto_awesome</span>
                94% CONF
              </span>
            </div>

            <div className="flex flex-col gap-0.5">
              <span className="text-xs font-bold text-[#191c1e]">Seasonal Pollen Advisory</span>
              <p className="text-xs text-[#43474d] line-clamp-2">
                Mild bronchial sensitivity noted in regional micro-index (Grass Pollen: High).
              </p>
            </div>

            <div className="flex items-center gap-1.5 text-[11px] text-[#43474d]">
              <span className="material-symbols-outlined text-[15px] text-[#00a187]">verified</span>
              <span>Reviewed by Clinical Copilot</span>
            </div>
          </div>
        </div>
      </section>

      {/* Two-Column Main Hub */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: Featured Consultation Hero + Copilot + Portals (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-6 sm:gap-8">
          {/* Prominent Upcoming Consultation Hero Card */}
          {nextAppointment && (
            <div className="bg-white rounded-xl border border-[#e0e3e5] shadow-sm p-5 sm:p-6 flex flex-col gap-4 relative overflow-hidden">
              <div className="h-1.5 absolute top-0 left-0 right-0 bg-gradient-to-r from-[#00a187] via-[#0055c9] to-[#0f2942]"></div>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded bg-[#dae2ff] text-[#001946] text-[11px] font-bold tracking-wider uppercase">
                    Primary Telehealth Session
                  </span>
                  <span className="text-[11px] text-[#43474d] flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-[#00a187]"></span>
                    Room Verified • 1080p WebRTC
                  </span>
                </div>
                <div className="text-[11px] text-[#43474d]">
                  Appt Ref: <span className="font-semibold text-[#001428]">{nextAppointment.code}</span>
                </div>
              </div>

              {/* Specialist Details & Time */}
              <div className="bg-[#f2f4f6] rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="relative w-16 h-16 rounded-full overflow-hidden shrink-0 shadow-xs border-2 border-white bg-slate-200">
                    <img
                      src={nextAppointment.doctorImage}
                      alt={nextAppointment.doctorName}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute bottom-0 right-0 p-0.5 bg-white rounded-full">
                      <span className="material-symbols-outlined text-[#0055c9] text-[16px] block">verified</span>
                    </div>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <h3 className="font-headline font-bold text-lg text-[#001428] truncate">
                      {nextAppointment.doctorTitle}
                    </h3>
                    <span className="text-xs font-medium text-[#43474d] truncate">
                      {nextAppointment.doctorSpecialty}
                    </span>
                    <span className="text-[11px] text-[#00a187] font-semibold mt-0.5 flex items-center gap-1">
                      <span className="material-symbols-outlined text-[13px]">vital_signs</span>
                      {nextAppointment.clinicalFocus}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col md:text-right shrink-0 bg-white md:bg-transparent p-3 md:p-0 rounded-lg w-full md:w-auto border md:border-0 border-[#e0e3e5]">
                  <span className="text-[11px] uppercase tracking-wider text-[#43474d] font-semibold">Scheduled Slot</span>
                  <span className="font-headline font-bold text-base text-[#001428]">{nextAppointment.dateDisplay}</span>
                  <span className="text-xs text-[#0055c9] font-bold">{nextAppointment.timeDisplay}</span>
                </div>
              </div>

              {/* Pre-flight Technical & Clinical Checks */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-[#f2f4f6] rounded-lg p-3 flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-[20px] text-[#00a187]">videocam</span>
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-[#001428]">Camera & Audio</span>
                    <span className="text-[11px] text-[#43474d]">Hardware Verified</span>
                  </div>
                </div>
                <div className="bg-[#f2f4f6] rounded-lg p-3 flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-[20px] text-[#00a187]">lock</span>
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-[#001428]">Encryption</span>
                    <span className="text-[11px] text-[#43474d]">End-to-End HIPAA</span>
                  </div>
                </div>
                <div className="bg-[#f2f4f6] rounded-lg p-3 flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-[20px] text-[#0055c9]">assignment_turned_in</span>
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-[#001428]">Pre-Visit Intake</span>
                    <span className="text-[11px] text-[#43474d]">Completed (3 records)</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
                <button
                  onClick={() => onJoinVideoRoom(nextAppointment)}
                  className="flex-1 flex items-center justify-center gap-2.5 px-6 py-3 rounded-lg bg-[#001428] text-white font-headline font-bold text-sm shadow-sm hover:bg-[#0f2942] active:scale-[0.99] transition-all cursor-pointer"
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-[#7cf8da] animate-ping"></span>
                  <span className="material-symbols-outlined text-[18px]">videocam</span>
                  <span>Join Video Consultation Room</span>
                </button>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => alert(`Rescheduling dialog for ${nextAppointment.code}. Select a new available slot in the Appointments coordinator.`)}
                    className="px-4 py-2.5 bg-[#f2f4f6] text-[#001428] font-semibold text-xs rounded-lg hover:bg-[#e6e8ea] transition-colors cursor-pointer"
                  >
                    Reschedule
                  </button>
                  <button
                    onClick={() => alert(`Downloaded iCal (.ics) invitation for ${nextAppointment.doctorName} on ${nextAppointment.dateDisplay}.`)}
                    className="p-2.5 bg-[#f2f4f6] text-[#43474d] hover:text-[#001428] rounded-lg hover:bg-[#e6e8ea] transition-colors cursor-pointer"
                    title="Add to Calendar"
                  >
                    <span className="material-symbols-outlined text-[18px]">calendar_add_on</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Kynovia Copilot 4.2 Environmental & Diagnostic Alert */}
          <div className="bg-white rounded-xl border border-[#e0e3e5] shadow-xs p-5 sm:p-6 flex flex-col gap-4 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-[#00a187]"></div>
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#002e25] text-[#7cf8da] flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">neurology</span>
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase text-[#00a187] tracking-wider block">
                    Kynovia Copilot 4.2
                  </span>
                  <h3 className="font-headline font-bold text-base text-[#001428]">
                    Diagnostic Synthesis & Environmental Triggers
                  </h3>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-[#f2f4f6] text-[#43474d] text-xs font-medium">
                Updated 20 mins ago
              </span>
            </div>

            {/* Environmental Banner */}
            <div className="bg-[#f2f4f6] rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex flex-col gap-1 max-w-xl">
                <div className="flex items-center gap-2 text-[#ba1a1a] font-bold text-xs">
                  <span className="material-symbols-outlined text-[18px]">warning</span>
                  <span>Seasonal Pollen Spike Detected • Greater Boston Area</span>
                </div>
                <p className="text-xs sm:text-sm text-[#43474d] leading-relaxed">
                  Atmospheric sensor correlation indicates ragweed/tree pollen counts exceeding 180 grains/m³. Your historical telemetry reflects a 35% decrease in peak expiratory flow during analogous weather patterns.
                </p>
              </div>
              <div className="shrink-0 bg-white rounded-lg p-3 border border-[#e0e3e5] flex flex-col items-center justify-center min-w-[120px]">
                <span className="text-[11px] text-[#43474d] uppercase font-semibold">Air Quality Index</span>
                <span className="font-headline font-bold text-2xl text-[#001428]">{vitals.airQualityIndex} AQI</span>
                <span className="text-[11px] text-[#ba1a1a] font-semibold">{vitals.airQualityLabel}</span>
              </div>
            </div>

            {/* Recommendations & Oversight */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
              <div className="p-4 rounded-lg bg-[#f2f4f6] flex flex-col justify-between gap-3">
                <div>
                  <span className="text-[11px] font-bold uppercase text-[#43474d] tracking-wider block mb-1">
                    Recommended AI Regimen
                  </span>
                  <p className="text-xs text-[#191c1e] leading-relaxed">
                    Pre-emptive morning administration of <strong>Cetirizine 10mg</strong> with hypertonic saline nasal irrigation. Maintain HEPA indoor filtration at level 2.
                  </p>
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => {
                      setOtcAuthorized(true);
                      alert('Cetirizine 10mg morning regimen approved and logged into medication schedule.');
                    }}
                    disabled={otcAuthorized}
                    className="px-3.5 py-1.5 rounded-lg bg-[#001428] text-white text-xs font-semibold hover:bg-[#0f2942] transition-colors cursor-pointer disabled:bg-[#74777e]"
                  >
                    {otcAuthorized ? 'Regimen Authorized ✓' : 'Authorize OTC Regimen'}
                  </button>
                  <button
                    onClick={() => alert('Clinical Cochrane review: prophylactic second-generation H1 antagonists reduce reactive headache episodes by 41% during seasonal atmospheric allergen peaks.')}
                    className="text-xs text-[#0055c9] hover:underline font-medium cursor-pointer"
                  >
                    Clinical Evidence
                  </button>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-[#f2f4f6] flex flex-col justify-between gap-3">
                <div>
                  <span className="text-[11px] font-bold uppercase text-[#43474d] tracking-wider block mb-1">
                    Physician Oversight Note
                  </span>
                  <p className="text-xs text-[#191c1e] leading-relaxed">
                    Dr. Vance's neurology team has received an automated flag to evaluate any associated tension headache patterns during your Thursday session.
                  </p>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-[#00a187] font-semibold pt-1">
                  <span className="material-symbols-outlined text-[16px]">check_circle</span>
                  <span>Flag queued to pre-consult dossier</span>
                </div>
              </div>
            </div>
          </div>

          {/* Care Portals (4-Tile Quick Access Grid) */}
          <section className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h3 className="font-headline font-bold text-lg text-[#001428]">Care Portals</h3>
              <span className="text-xs text-[#43474d] font-medium">Instant Access</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Tile 1: Find Doctors */}
              <div
                onClick={() => onNavigate('find-doctors')}
                className="bg-white rounded-xl p-4 sm:p-5 border border-[#e0e3e5] shadow-xs hover:shadow-md transition-all cursor-pointer flex items-start gap-4 group"
              >
                <div className="w-11 h-11 rounded-lg bg-[#dae2ff] text-[#001946] flex items-center justify-center shrink-0 group-hover:bg-[#0055c9] group-hover:text-white transition-colors">
                  <span className="material-symbols-outlined text-[22px]">stethoscope</span>
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-headline font-bold text-base text-[#001428] group-hover:text-[#0055c9] transition-colors">
                    Find Specialist Doctors
                  </span>
                  <p className="text-xs text-[#43474d] mt-1 line-clamp-1">
                    240+ Board-certified physicians ready for virtual or in-clinic consults.
                  </p>
                  <span className="text-xs text-[#0055c9] font-bold mt-2 flex items-center gap-1">
                    Browse Directory <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                  </span>
                </div>
              </div>

              {/* Tile 2: AI Symptom Triaging */}
              <div
                onClick={() => onNavigate('ai-health')}
                className="bg-white rounded-xl p-4 sm:p-5 border border-[#e0e3e5] shadow-xs hover:shadow-md transition-all cursor-pointer flex items-start gap-4 group relative overflow-hidden"
              >
                <div className="absolute top-2.5 right-2.5 flex items-center gap-1 px-1.5 py-0.5 bg-[#7cf8da]/20 text-[#002e25] rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00a187] animate-ping"></span>
                  <span className="text-[10px] uppercase font-bold tracking-wider">Live AI</span>
                </div>
                <div className="w-11 h-11 rounded-lg bg-[#dae2ff] text-[#0055c9] flex items-center justify-center shrink-0 group-hover:bg-[#0055c9] group-hover:text-white transition-colors">
                  <span className="material-symbols-outlined text-[22px]">psychology</span>
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-headline font-bold text-base text-[#001428] group-hover:text-[#0055c9] transition-colors">
                    AI Symptom Triaging
                  </span>
                  <p className="text-xs text-[#43474d] mt-1 line-clamp-1">
                    Interactive clinical diagnostic assistant based on peer-reviewed triage models.
                  </p>
                  <span className="text-xs text-[#0055c9] font-bold mt-2 flex items-center gap-1">
                    Start Symptom Check <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                  </span>
                </div>
              </div>

              {/* Tile 3: Book Clinic Visit */}
              <div
                onClick={() => onNavigate('appointments')}
                className="bg-white rounded-xl p-4 sm:p-5 border border-[#e0e3e5] shadow-xs hover:shadow-md transition-all cursor-pointer flex items-start gap-4 group"
              >
                <div className="w-11 h-11 rounded-lg bg-[#f2f4f6] text-[#001428] flex items-center justify-center shrink-0 group-hover:bg-[#001428] group-hover:text-white transition-colors">
                  <span className="material-symbols-outlined text-[22px]">domain</span>
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-headline font-bold text-base text-[#001428] group-hover:text-[#0055c9] transition-colors">
                    In-Clinic & Visits
                  </span>
                  <p className="text-xs text-[#43474d] mt-1 line-clamp-1">
                    Manage appointments, campus navigation, and pre-visit directives.
                  </p>
                  <span className="text-xs text-[#0055c9] font-bold mt-2 flex items-center gap-1">
                    View Schedule <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                  </span>
                </div>
              </div>

              {/* Tile 4: Health Vault & Records */}
              <div
                onClick={() => onNavigate('health-records')}
                className="bg-white rounded-xl p-4 sm:p-5 border border-[#e0e3e5] shadow-xs hover:shadow-md transition-all cursor-pointer flex items-start gap-4 group"
              >
                <div className="w-11 h-11 rounded-lg bg-[#f2f4f6] text-[#001428] flex items-center justify-center shrink-0 group-hover:bg-[#001428] group-hover:text-white transition-colors">
                  <span className="material-symbols-outlined text-[22px]">clinical_notes</span>
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-headline font-bold text-base text-[#001428] group-hover:text-[#0055c9] transition-colors">
                    Health Vault & EHR
                  </span>
                  <p className="text-xs text-[#43474d] mt-1 line-clamp-1">
                    HIPAA-compliant decentralized records, labs, and telemetry logs.
                  </p>
                  <span className="text-xs text-[#0055c9] font-bold mt-2 flex items-center gap-1">
                    Access Vault <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                  </span>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* RIGHT COLUMN: Recommended Doctors + Clinical Audit + Emergency (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-6 sm:gap-8">
          {/* Top Recommended Specialists */}
          <div className="bg-white rounded-xl border border-[#e0e3e5] shadow-xs p-5 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase text-[#43474d] tracking-wider block">
                  Tailored Provider Match
                </span>
                <h3 className="font-headline font-bold text-base text-[#001428]">Recommended Doctors</h3>
              </div>
              <button
                onClick={() => onNavigate('find-doctors')}
                className="text-xs text-[#0055c9] font-bold hover:underline cursor-pointer flex items-center gap-0.5"
              >
                View All <span className="material-symbols-outlined text-[14px]">chevron_right</span>
              </button>
            </div>

            <div className="flex flex-col gap-3">
              {doctors.slice(0, 3).map(doctor => (
                <div
                  key={doctor.id}
                  className="bg-[#f2f4f6] rounded-xl p-3.5 flex flex-col gap-2.5 hover:shadow-xs transition-shadow"
                >
                  <div className="flex items-start gap-3">
                    <img
                      src={doctor.imageUrl}
                      alt={doctor.name}
                      className="w-12 h-12 rounded-lg object-cover shrink-0 border border-white bg-slate-200"
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex flex-col min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-headline font-bold text-sm text-[#001428] truncate">
                          {doctor.name}
                        </span>
                        <span className="flex items-center gap-0.5 text-xs font-bold text-[#001428]">
                          <span className="material-symbols-outlined text-[14px] text-amber-500 fill">star</span>
                          {doctor.rating}
                        </span>
                      </div>
                      <span className="text-xs text-[#43474d] truncate">{doctor.specialty}</span>
                      <span className="text-[11px] text-[#00a187] font-semibold mt-0.5 truncate">
                        {doctor.nextSlotLabel}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1 border-t border-[#e0e3e5]/60">
                    <button
                      onClick={() => onShowDoctorProfile(doctor)}
                      className="h-8 rounded-lg bg-white text-[#191c1e] text-xs font-semibold hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      Profile
                    </button>
                    <button
                      onClick={() => onBookDoctor(doctor)}
                      className="h-8 rounded-lg bg-[#001428] text-white text-xs font-semibold hover:bg-[#0f2942] transition-colors cursor-pointer"
                    >
                      Book Visit
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity & Clinical Audit Log */}
          <div className="bg-white rounded-xl border border-[#e0e3e5] shadow-xs p-5 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="font-headline font-bold text-base text-[#001428]">Recent Activity</h3>
              <span className="text-xs text-[#43474d]">Last 7 Days</span>
            </div>

            <div className="flex flex-col divide-y divide-[#e0e3e5]">
              {activityLog.map(item => (
                <div key={item.id} className="py-2.5 first:pt-0 last:pb-0 flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2.5 min-w-0">
                    <div
                      className={`w-2 h-2 rounded-full shrink-0 mt-1.5 ${
                        item.colorType === 'teal'
                          ? 'bg-[#00a187]'
                          : item.colorType === 'blue'
                          ? 'bg-[#0055c9]'
                          : 'bg-[#c3c6ce]'
                      }`}
                    ></div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-bold text-[#001428] truncate">{item.title}</span>
                      <span className="text-[11px] text-[#43474d] truncate">{item.subtitle}</span>
                    </div>
                  </div>
                  <span className="text-[11px] text-[#43474d] shrink-0 font-medium">{item.timestamp}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => onNavigate('health-records')}
              className="text-xs text-[#0055c9] font-bold text-center hover:underline pt-1 cursor-pointer"
            >
              View Complete Clinical History (48 events)
            </button>
          </div>

          {/* Emergency & Nurse Line Assistance */}
          <div className="bg-white rounded-xl border border-[#e0e3e5] shadow-xs p-5 flex flex-col gap-3">
            <div className="flex items-center gap-2 text-[#ba1a1a]">
              <span className="material-symbols-outlined text-[20px]">emergency</span>
              <h4 className="font-headline font-bold text-sm text-[#001428]">Emergency & Nurse Line</h4>
            </div>
            <p className="text-xs text-[#43474d] leading-relaxed">
              If you experience sudden acute chest discomfort or severe neurological deficit, access immediate dispatch or our 24/7 clinical nurse line.
            </p>
            <div className="flex flex-col gap-2 pt-1">
              <a
                href="tel:18005550199"
                className="w-full flex items-center justify-between p-3 bg-[#f2f4f6] rounded-lg hover:bg-[#e6e8ea] transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px] text-[#0055c9]">support_agent</span>
                  <span className="text-xs font-bold text-[#001428]">24/7 On-Call Nurse</span>
                </div>
                <span className="text-xs font-bold text-[#0055c9]">1-800-555-0199</span>
              </a>
              <div className="w-full flex items-center justify-between p-3 bg-[#f2f4f6] rounded-lg text-xs">
                <div className="flex items-center gap-2 text-[#191c1e]">
                  <span className="material-symbols-outlined text-[18px] text-[#43474d]">local_hospital</span>
                  <span>Nearest ER: Memorial Center (1.4 mi)</span>
                </div>
                <span className="text-[#00a187] font-bold">Wait &lt; 8m</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
