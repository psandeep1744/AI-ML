import React, { useState, useMemo } from 'react';
import { Doctor } from '../types/clinical';

interface FindDoctorsViewProps {
  doctors: Doctor[];
  onBookDoctor: (doctor: Doctor, selectedSlot?: string) => void;
  onShowDoctorProfile: (doctor: Doctor) => void;
}

export const FindDoctorsView: React.FC<FindDoctorsViewProps> = ({
  doctors,
  onBookDoctor,
  onShowDoctorProfile,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('All');
  const [selectedMode, setSelectedMode] = useState<'all' | 'telehealth' | 'clinic'>('all');
  const [onlyAvailableToday, setOnlyAvailableToday] = useState(false);
  const [bookmarkedDoctorIds, setBookmarkedDoctorIds] = useState<Set<string>>(new Set());
  const [selectedDoctorSlots, setSelectedDoctorSlots] = useState<{ [doctorId: string]: string }>({});
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [selectedInsurances, setSelectedInsurances] = useState<string[]>([
    'Medicare Parts A & B',
    'Blue Cross Blue Shield',
  ]);

  const toggleBookmark = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setBookmarkedDoctorIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSelectSlot = (doctorId: string, slotLabel: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedDoctorSlots(prev => ({ ...prev, [doctorId]: slotLabel }));
  };

  const filteredDoctors = useMemo(() => {
    return doctors.filter(doc => {
      const query = searchQuery.toLowerCase().trim();
      const matchesQuery =
        !query ||
        doc.name.toLowerCase().includes(query) ||
        doc.specialty.toLowerCase().includes(query) ||
        (doc.subspecialty && doc.subspecialty.toLowerCase().includes(query)) ||
        doc.badges.some(b => b.toLowerCase().includes(query));

      const matchesSpecialty =
        selectedSpecialty === 'All' ||
        doc.specialty.toLowerCase().includes(selectedSpecialty.toLowerCase());

      const matchesMode =
        selectedMode === 'all' ||
        doc.mode === selectedMode ||
        doc.mode === 'hybrid';

      const matchesToday = !onlyAvailableToday || doc.isTodayAvailable;

      return matchesQuery && matchesSpecialty && matchesMode && matchesToday;
    });
  }, [doctors, searchQuery, selectedSpecialty, selectedMode, onlyAvailableToday]);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-6">
      {/* Search Header Banner */}
      <section className="bg-white rounded-xl p-5 sm:p-6 border border-[#e0e3e5] shadow-xs flex flex-col gap-4">
        {/* Breadcrumb & FHIR Status */}
        <div className="flex items-center justify-between text-xs text-[#43474d] flex-wrap gap-2">
          <div className="flex items-center gap-1.5 font-medium">
            <span>Clinical Network</span>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span className="text-[#0055c9] font-bold">Specialist Directory</span>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span className="text-[#191c1e]">Physician Matching</span>
          </div>
          <div className="flex items-center gap-2 px-2.5 py-0.5 rounded bg-[#f2f4f6] text-[11px] font-semibold text-[#43474d]">
            <span className="w-2 h-2 rounded-full bg-[#00a187] animate-pulse"></span>
            <span>HL7/FHIR Node: <strong className="text-[#001428]">BOS-CENTRAL-04</strong></span>
          </div>
        </div>

        <div>
          <h1 className="font-headline font-bold text-2xl sm:text-3xl text-[#001428] tracking-tight">
            Find Verified Clinical Specialists & Physicians
          </h1>
          <p className="font-body text-xs sm:text-sm text-[#43474d] mt-1">
            Instant booking with real-time EHR synchronization across 240+ board-certified providers and tertiary care facilities.
          </p>
        </div>

        {/* Search Engine Bar */}
        <div className="p-2 sm:p-3 rounded-xl bg-[#f2f4f6] border border-[#e0e3e5]/80">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
            {/* Condition / Specialty Input */}
            <div className="md:col-span-6 lg:col-span-5 bg-white rounded-lg p-2.5 border border-[#e0e3e5] shadow-xs flex items-center gap-3">
              <span className="material-symbols-outlined text-[#0055c9] text-[22px]">stethoscope</span>
              <div className="flex flex-col flex-1 min-w-0">
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#43474d]">
                  Specialty or Condition
                </label>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search Arrhythmia, Migraine, Cardiology, Rajeshwar Sharma..."
                  className="w-full bg-transparent text-xs sm:text-sm text-[#191c1e] placeholder:text-[#74777e] focus:outline-none truncate"
                />
              </div>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="p-1 text-[#74777e] hover:text-[#001428] cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">close</span>
                </button>
              )}
            </div>

            {/* Location Selector */}
            <div className="md:col-span-3 lg:col-span-4 bg-white rounded-lg p-2.5 border border-[#e0e3e5] shadow-xs flex items-center gap-3">
              <span className="material-symbols-outlined text-[#0055c9] text-[22px]">distance</span>
              <div className="flex flex-col flex-1 min-w-0">
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#43474d]">
                  Location or Portal
                </label>
                <span className="text-xs sm:text-sm text-[#191c1e] font-semibold truncate">
                  Boston, MA & Virtual Telehealth
                </span>
              </div>
              <span className="material-symbols-outlined text-[#74777e] text-[18px]">near_me</span>
            </div>

            {/* Quick Action Button */}
            <div className="md:col-span-3 lg:col-span-3 flex gap-2">
              <button
                onClick={() => setFilterDrawerOpen(true)}
                className="lg:hidden flex-1 h-[46px] bg-white border border-[#e0e3e5] text-[#001428] font-bold text-xs rounded-lg flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">tune</span>
                <span>Filters</span>
              </button>
              <button
                onClick={() => {}}
                className="flex-1 h-[46px] bg-[#001428] hover:bg-[#0f2942] text-white font-bold text-xs sm:text-sm rounded-lg flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">search</span>
                <span>Search</span>
              </button>
            </div>
          </div>
        </div>

        {/* Quick Filter Horizontal Pills Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          <button
            onClick={() => setFilterDrawerOpen(true)}
            className="shrink-0 flex items-center gap-1.5 bg-[#001428] text-white px-3 py-1.5 rounded-lg text-xs font-semibold shadow-xs cursor-pointer"
          >
            <span className="material-symbols-outlined text-[15px]">tune</span>
            <span>Filters</span>
          </button>
          <button
            onClick={() => {
              setSelectedSpecialty('All');
              setSelectedMode('all');
              setOnlyAvailableToday(false);
            }}
            className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              selectedSpecialty === 'All' && selectedMode === 'all' && !onlyAvailableToday
                ? 'bg-[#0055c9] text-white shadow-xs'
                : 'bg-[#f2f4f6] text-[#43474d] hover:bg-[#e6e8ea]'
            }`}
          >
            All Specialties
          </button>
          <button
            onClick={() => setSelectedSpecialty('Neurology')}
            className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              selectedSpecialty === 'Neurology'
                ? 'bg-[#0055c9] text-white shadow-xs'
                : 'bg-[#f2f4f6] text-[#43474d] hover:bg-[#e6e8ea]'
            }`}
          >
            Neurology
          </button>
          <button
            onClick={() => setSelectedSpecialty('Cardiovascular')}
            className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              selectedSpecialty === 'Cardiovascular'
                ? 'bg-[#0055c9] text-white shadow-xs'
                : 'bg-[#f2f4f6] text-[#43474d] hover:bg-[#e6e8ea]'
            }`}
          >
            Cardiology
          </button>
          <button
            onClick={() => setSelectedSpecialty('Dermatology')}
            className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              selectedSpecialty === 'Dermatology'
                ? 'bg-[#0055c9] text-white shadow-xs'
                : 'bg-[#f2f4f6] text-[#43474d] hover:bg-[#e6e8ea]'
            }`}
          >
            Dermatology
          </button>
          <button
            onClick={() => setSelectedMode(prev => (prev === 'telehealth' ? 'all' : 'telehealth'))}
            className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1 ${
              selectedMode === 'telehealth'
                ? 'bg-[#00a187] text-white shadow-xs'
                : 'bg-[#f2f4f6] text-[#43474d] hover:bg-[#e6e8ea]'
            }`}
          >
            <span className="material-symbols-outlined text-[14px]">videocam</span>
            Telehealth
          </button>
          <button
            onClick={() => setOnlyAvailableToday(prev => !prev)}
            className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1 ${
              onlyAvailableToday
                ? 'bg-[#0055c9] text-white shadow-xs'
                : 'bg-[#f2f4f6] text-[#43474d] hover:bg-[#e6e8ea]'
            }`}
          >
            <span className="material-symbols-outlined text-[14px]">bolt</span>
            Available Today
          </button>
        </div>
      </section>

      {/* Main Grid: Sidebar Filters (desktop) + Doctor Cards List */}
      <div className="grid grid-cols-12 gap-6 lg:gap-8 items-start">
        {/* Desktop Sidebar Filters (col-span-3) */}
        <aside className="hidden lg:flex lg:col-span-4 xl:col-span-3 flex-col gap-4 sticky top-24">
          <div className="bg-white rounded-xl border border-[#e0e3e5] shadow-xs overflow-hidden">
            <div className="p-4 bg-[#f2f4f6] border-b border-[#e0e3e5] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#0055c9] text-[20px]">tune</span>
                <h3 className="font-headline font-bold text-sm text-[#001428]">Filter Directory</h3>
              </div>
              <button
                onClick={() => {
                  setSelectedSpecialty('All');
                  setSelectedMode('all');
                  setOnlyAvailableToday(false);
                  setSearchQuery('');
                }}
                className="text-xs text-[#0055c9] font-semibold hover:underline cursor-pointer"
              >
                Reset All
              </button>
            </div>

            <div className="p-4 flex flex-col gap-5 text-xs text-[#191c1e]">
              {/* Consultation Mode */}
              <div className="flex flex-col gap-2">
                <span className="font-bold text-[11px] uppercase tracking-wider text-[#43474d]">
                  Consultation Mode
                </span>
                <div className="flex flex-col gap-1.5">
                  <label className="flex items-center justify-between p-2 rounded-lg hover:bg-[#f2f4f6] cursor-pointer">
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="mode"
                        checked={selectedMode === 'all'}
                        onChange={() => setSelectedMode('all')}
                        className="text-[#0055c9] accent-[#0055c9]"
                      />
                      <span>All Modes</span>
                    </div>
                  </label>
                  <label className="flex items-center justify-between p-2 rounded-lg hover:bg-[#f2f4f6] cursor-pointer">
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="mode"
                        checked={selectedMode === 'telehealth'}
                        onChange={() => setSelectedMode('telehealth')}
                        className="text-[#0055c9] accent-[#0055c9]"
                      />
                      <span>Telehealth Video</span>
                    </div>
                    <span className="material-symbols-outlined text-[16px] text-[#00a187]">videocam</span>
                  </label>
                  <label className="flex items-center justify-between p-2 rounded-lg hover:bg-[#f2f4f6] cursor-pointer">
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="mode"
                        checked={selectedMode === 'clinic'}
                        onChange={() => setSelectedMode('clinic')}
                        className="text-[#0055c9] accent-[#0055c9]"
                      />
                      <span>In-Person Clinic Visit</span>
                    </div>
                    <span className="material-symbols-outlined text-[16px] text-[#74777e]">domain</span>
                  </label>
                </div>
              </div>

              {/* Medical Specialties */}
              <div className="flex flex-col gap-2 pt-2 border-t border-[#e0e3e5]">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[11px] uppercase tracking-wider text-[#43474d]">
                    Medical Specialties
                  </span>
                  <span className="px-1.5 py-0.5 bg-[#dae2ff] text-[#001946] text-[10px] rounded font-bold">
                    6 Depts
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  {[
                    { label: 'All Specialties', val: 'All', count: 18 },
                    { label: 'Cardiovascular Medicine', val: 'Cardiovascular', count: 8 },
                    { label: 'Adult & Neurosciences', val: 'Neurology', count: 5 },
                    { label: 'Internal Medicine', val: 'Internal', count: 12 },
                    { label: 'Dermatology & Phototherapy', val: 'Dermatology', count: 4 },
                    { label: 'Orthopedic Surgery', val: 'Orthopedic', count: 3 },
                  ].map(item => (
                    <button
                      key={item.val}
                      onClick={() => setSelectedSpecialty(item.val)}
                      className={`flex items-center justify-between p-2 rounded-lg text-left transition-colors cursor-pointer ${
                        selectedSpecialty === item.val
                          ? 'bg-[#f2f4f6] font-bold text-[#0055c9]'
                          : 'hover:bg-[#f2f4f6]/60 text-[#43474d]'
                      }`}
                    >
                      <span className="truncate">{item.label}</span>
                      <span className="text-[11px] opacity-75">{item.count}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Availability Window */}
              <div className="flex flex-col gap-2 pt-2 border-t border-[#e0e3e5]">
                <span className="font-bold text-[11px] uppercase tracking-wider text-[#43474d]">
                  Availability Window
                </span>
                <label className="flex items-center justify-between p-2 rounded-lg hover:bg-[#f2f4f6] cursor-pointer">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={onlyAvailableToday}
                      onChange={e => setOnlyAvailableToday(e.target.checked)}
                      className="rounded text-[#0055c9] accent-[#0055c9]"
                    />
                    <span className="font-semibold">Available Today</span>
                  </div>
                  <span className="w-2 h-2 rounded-full bg-[#00a187]"></span>
                </label>
              </div>

              {/* Accepted Insurance Networks */}
              <div className="flex flex-col gap-2 pt-2 border-t border-[#e0e3e5]">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[11px] uppercase tracking-wider text-[#43474d]">
                    Accepted Insurance
                  </span>
                  <span className="material-symbols-outlined text-[14px] text-[#00a187]">verified</span>
                </div>
                {['Blue Cross Blue Shield', 'Medicare Parts A & B', 'Aetna Premier Health', 'UnitedHealthcare Choice'].map(
                  ins => (
                    <label key={ins} className="flex items-center gap-2 p-1.5 rounded hover:bg-[#f2f4f6] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedInsurances.includes(ins)}
                        onChange={() => {
                          setSelectedInsurances(prev =>
                            prev.includes(ins) ? prev.filter(i => i !== ins) : [...prev, ins]
                          );
                        }}
                        className="rounded text-[#0055c9] accent-[#0055c9]"
                      />
                      <span className="text-xs truncate">{ins}</span>
                    </label>
                  )
                )}
              </div>
            </div>
          </div>

          {/* AI Symptom Screener Prompt */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-[#f2f4f6] to-[#dae2ff]/30 border border-[#e0e3e5] shadow-xs flex flex-col gap-2">
            <div className="flex items-center gap-2 text-[#001428] font-bold text-xs">
              <span className="material-symbols-outlined text-[#0055c9] text-[20px]">smart_toy</span>
              <span>Need Immediate Triage?</span>
            </div>
            <p className="text-xs text-[#43474d] leading-relaxed">
              Our AI diagnostic assistant reviews your telemetry records to match urgent slots within 30 minutes.
            </p>
            <a
              href="#triage"
              onClick={e => {
                e.preventDefault();
                alert('Redirecting to AI Symptom Triaging module...');
              }}
              className="text-xs text-[#0055c9] font-bold uppercase tracking-wider hover:underline flex items-center gap-1 mt-1"
            >
              <span>Launch AI Symptom Screener</span>
              <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </a>
          </div>
        </aside>

        {/* Doctor Results Column (col-span-12 lg:col-span-8 xl:col-span-9) */}
        <main className="col-span-12 lg:col-span-8 xl:col-span-9 flex flex-col gap-4 sm:gap-6">
          {/* Header Count & Sorting Bar */}
          <div className="bg-white rounded-xl p-4 border border-[#e0e3e5] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#00a187] animate-pulse"></span>
              <span className="font-headline font-bold text-base text-[#001428]">
                {filteredDoctors.length} Verified Specialists Available
              </span>
              <span className="px-2 py-0.5 rounded-full bg-[#f2f4f6] text-[#43474d] text-xs font-semibold">
                Instant EHR Match
              </span>
            </div>

            <div className="flex items-center gap-3 self-end sm:self-auto text-xs">
              <div className="flex items-center gap-1.5 bg-[#f2f4f6] px-3 py-1.5 rounded-lg border border-[#e0e3e5]">
                <span className="text-[#43474d] uppercase font-semibold text-[10px]">Sort:</span>
                <select className="bg-transparent font-semibold text-[#001428] focus:outline-none cursor-pointer">
                  <option>Best AI Match & Immediate Availability</option>
                  <option>Highest Patient Ratings (5.0 → 4.0)</option>
                  <option>Years of Practice Experience</option>
                  <option>Earliest Telehealth Access</option>
                </select>
              </div>
            </div>
          </div>

          {/* List of Doctor Cards */}
          <div className="flex flex-col gap-4 sm:gap-6">
            {filteredDoctors.map(doctor => {
              const isBookmarked = bookmarkedDoctorIds.has(doctor.id);
              const activeSlot = selectedDoctorSlots[doctor.id] || doctor.availableSlots[0]?.label;

              return (
                <article
                  key={doctor.id}
                  className="bg-white rounded-xl border border-[#e0e3e5] shadow-xs hover:shadow-md transition-all p-5 sm:p-6 flex flex-col gap-4 relative overflow-hidden group"
                >
                  {/* AI Recommendation Banner (if applicable) */}
                  {doctor.aiMatchScore && (
                    <div className="flex items-center justify-between bg-[#0f2942] text-white px-3 py-1.5 rounded-lg text-xs">
                      <div className="flex items-center gap-1.5 font-medium">
                        <span className="material-symbols-outlined text-[16px] text-[#7cf8da]">neurology</span>
                        <span className="text-[#7cf8da] font-bold">{doctor.aiMatchScore}% Match</span>
                        <span className="text-slate-300">• AI Triage Recommended</span>
                      </div>
                      <span className="material-symbols-outlined text-[#7cf8da] text-[15px]">auto_awesome</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">
                    {/* Doctor Info & Avatar */}
                    <div className="xl:col-span-7 flex flex-col sm:flex-row gap-4 items-start">
                      <div className="relative shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden shadow-xs border-2 border-white bg-slate-200">
                        <img
                          src={doctor.imageUrl}
                          alt={doctor.name}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute bottom-1 right-1 p-0.5 bg-white rounded-full shadow-xs">
                          <span className="material-symbols-outlined text-[#0055c9] text-[16px] block">verified</span>
                        </div>
                      </div>

                      <div className="flex flex-col flex-1 min-w-0 gap-1">
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="font-headline font-bold text-lg sm:text-xl text-[#001428] truncate">
                            {doctor.title}
                          </h3>
                          <button
                            onClick={e => toggleBookmark(doctor.id, e)}
                            aria-label="Bookmark doctor"
                            className="text-[#74777e] hover:text-[#0055c9] transition-colors p-1 cursor-pointer"
                          >
                            <span
                              className={`material-symbols-outlined text-[20px] ${
                                isBookmarked ? 'text-[#0055c9] fill' : ''
                              }`}
                            >
                              bookmark
                            </span>
                          </button>
                        </div>

                        <span className="text-xs font-bold uppercase tracking-wider text-[#0055c9]">
                          {doctor.specialty}
                        </span>

                        <div className="flex flex-wrap items-center gap-2 text-xs text-[#43474d] mt-0.5">
                          <div className="flex items-center text-[#001428] font-bold">
                            <span className="material-symbols-outlined text-[16px] text-amber-500 fill mr-0.5">
                              star
                            </span>
                            <span>{doctor.rating}</span>
                          </div>
                          <span>•</span>
                          <span>{doctor.reviewsCount} reviews</span>
                          <span>•</span>
                          <span>{doctor.experienceYears} yrs exp</span>
                        </div>

                        <p className="text-xs text-[#43474d] flex items-center gap-1 mt-0.5 truncate">
                          <span className="material-symbols-outlined text-[15px] text-[#74777e]">domain</span>
                          <span>{doctor.institution}</span>
                        </p>

                        {/* Badges */}
                        <div className="flex flex-wrap gap-1.5 pt-1.5">
                          {doctor.badges.map(b => (
                            <span
                              key={b}
                              className="px-2 py-0.5 rounded bg-[#f2f4f6] text-[#43474d] text-[11px] font-semibold"
                            >
                              {b}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Right: Booking Slots & Quick Actions (xl:col-span-5) */}
                    <div className="xl:col-span-5 bg-[#f2f4f6] rounded-xl p-4 flex flex-col gap-3 w-full border border-[#e0e3e5]">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold uppercase text-[#43474d] tracking-wider flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-[#00a187]"></span>
                          Next Slot: {doctor.nextSlotLabel}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-white text-[#001428] text-[11px] font-bold shadow-xs">
                          {doctor.modeLabel}
                        </span>
                      </div>

                      {/* Interactive Time Slot Pills */}
                      <div className="grid grid-cols-2 gap-2">
                        {doctor.availableSlots.map(slot => {
                          const isSelected = activeSlot === slot.label;
                          return (
                            <button
                              key={slot.id}
                              onClick={e => handleSelectSlot(doctor.id, slot.label, e)}
                              className={`py-1.5 px-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer ${
                                isSelected
                                  ? 'bg-[#001428] text-white'
                                  : 'bg-white text-[#191c1e] hover:bg-slate-50'
                              }`}
                            >
                              <span className="material-symbols-outlined text-[14px]">
                                {slot.type === 'video' ? 'videocam' : 'domain'}
                              </span>
                              <span className="truncate">{slot.label}</span>
                            </button>
                          );
                        })}
                      </div>

                      {/* Action Buttons */}
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <button
                          onClick={() => onShowDoctorProfile(doctor)}
                          className="h-9 rounded-lg bg-white border border-[#e0e3e5] text-[#001428] text-xs font-bold hover:bg-slate-50 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[16px]">visibility</span>
                          <span>Profile</span>
                        </button>
                        <button
                          onClick={() => onBookDoctor(doctor, activeSlot)}
                          className="h-9 rounded-lg bg-[#001428] text-white text-xs font-bold hover:bg-[#0f2942] transition-colors flex items-center justify-center gap-1 shadow-xs cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[16px]">calendar_today</span>
                          <span>Book Slot</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {/* Synchronizing Regional Network Simulated Status Banner */}
          <div className="bg-white rounded-xl p-5 border-2 border-dashed border-[#e0e3e5] shadow-xs flex flex-col gap-3">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 font-semibold text-[#001428]">
                <span className="material-symbols-outlined text-[18px] text-[#00a187] animate-spin">sync</span>
                <span>Synchronizing Regional Tertiary Hospital Network...</span>
              </div>
              <span className="text-[11px] text-[#43474d]">Federated FHIR Query in Progress (85%)</span>
            </div>
            <div className="w-full bg-[#f2f4f6] rounded-full h-1.5 overflow-hidden">
              <div className="bg-[#00a187] h-full rounded-full transition-all duration-500" style={{ width: '85%' }}></div>
            </div>
          </div>

          {/* Clean Pagination Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <span className="text-xs text-[#43474d]">
              Displaying {filteredDoctors.length} of {doctors.length} available licensed providers.
            </span>
            <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-[#e0e3e5] shadow-xs text-xs">
              <button disabled className="px-3 py-1.5 rounded-lg text-[#74777e] opacity-50 cursor-not-allowed">
                Previous
              </button>
              <button className="w-8 h-8 rounded-lg bg-[#001428] text-white font-bold flex items-center justify-center">
                1
              </button>
              <button className="w-8 h-8 rounded-lg hover:bg-[#f2f4f6] text-[#191c1e] font-semibold flex items-center justify-center transition-colors">
                2
              </button>
              <button className="w-8 h-8 rounded-lg hover:bg-[#f2f4f6] text-[#191c1e] font-semibold flex items-center justify-center transition-colors">
                3
              </button>
              <button className="px-3 py-1.5 rounded-lg text-[#0055c9] font-bold hover:bg-[#f2f4f6] transition-colors">
                Next →
              </button>
            </div>
          </div>
        </main>
      </div>

      {/* Mobile Offcanvas Filter Drawer */}
      {filterDrawerOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end bg-[#001428]/40 backdrop-blur-xs">
          <div
            className="absolute inset-0"
            onClick={() => setFilterDrawerOpen(false)}
          ></div>
          <div className="relative bg-white rounded-t-2xl shadow-xl max-h-[85vh] flex flex-col overflow-hidden">
            <div className="p-4 bg-[#f2f4f6] border-b border-[#e0e3e5] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#0055c9] text-[20px]">tune</span>
                <h3 className="font-headline font-bold text-base text-[#001428]">Provider Filters</h3>
              </div>
              <button
                onClick={() => setFilterDrawerOpen(false)}
                className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#43474d] hover:text-[#001428] cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <div className="p-5 overflow-y-auto flex flex-col gap-5 text-sm">
              <div>
                <span className="font-bold text-xs uppercase text-[#43474d] tracking-wider block mb-2">
                  Consultation Mode
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setSelectedMode('telehealth')}
                    className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 border ${
                      selectedMode === 'telehealth'
                        ? 'bg-[#001428] text-white border-[#001428]'
                        : 'bg-white text-[#191c1e] border-[#e0e3e5]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px]">videocam</span> Telehealth
                  </button>
                  <button
                    onClick={() => setSelectedMode('clinic')}
                    className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 border ${
                      selectedMode === 'clinic'
                        ? 'bg-[#001428] text-white border-[#001428]'
                        : 'bg-white text-[#191c1e] border-[#e0e3e5]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px]">domain</span> In-Clinic
                  </button>
                </div>
              </div>

              <div>
                <span className="font-bold text-xs uppercase text-[#43474d] tracking-wider block mb-2">
                  Specialties
                </span>
                <div className="flex flex-wrap gap-2">
                  {['All', 'Neurology', 'Cardiovascular', 'Dermatology', 'Orthopedic', 'Internal'].map(s => (
                    <button
                      key={s}
                      onClick={() => setSelectedSpecialty(s)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                        selectedSpecialty === s
                          ? 'bg-[#0055c9] text-white shadow-xs'
                          : 'bg-[#f2f4f6] text-[#43474d]'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 bg-white border-t border-[#e0e3e5] flex gap-3">
              <button
                onClick={() => {
                  setSelectedSpecialty('All');
                  setSelectedMode('all');
                  setOnlyAvailableToday(false);
                }}
                className="w-1/3 py-2.5 rounded-lg bg-[#f2f4f6] text-[#001428] text-xs font-bold cursor-pointer"
              >
                Reset
              </button>
              <button
                onClick={() => setFilterDrawerOpen(false)}
                className="w-2/3 py-2.5 rounded-lg bg-[#001428] text-white text-xs font-bold cursor-pointer"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
