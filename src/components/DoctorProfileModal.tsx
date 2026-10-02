import React from 'react';
import { Doctor } from '../types/clinical';

interface DoctorProfileModalProps {
  doctor: Doctor;
  onClose: () => void;
  onBook: (doctor: Doctor) => void;
}

export const DoctorProfileModal: React.FC<DoctorProfileModalProps> = ({
  doctor,
  onClose,
  onBook,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#001428]/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-[#e0e3e5] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-5 sm:p-6 bg-[#f2f4f6] border-b border-[#e0e3e5] flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative w-18 h-18 sm:w-20 sm:h-20 rounded-xl overflow-hidden shadow-xs border-2 border-white bg-slate-200 shrink-0">
              <img
                src={doctor.imageUrl}
                alt={doctor.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute bottom-0 right-0 p-0.5 bg-white rounded-full">
                <span className="material-symbols-outlined text-[#0055c9] text-[16px] block">verified</span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-headline font-bold text-lg sm:text-xl text-[#001428]">
                  {doctor.title}
                </h3>
              </div>
              <span className="text-xs font-bold text-[#0055c9] uppercase tracking-wider block mt-0.5">
                {doctor.specialty}
              </span>
              <p className="text-xs text-[#43474d] mt-1">{doctor.institution}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#74777e] hover:text-[#001428] cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex flex-col gap-5 text-xs text-[#191c1e]">
          {/* Key Metrics Strip */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 rounded-lg bg-[#f2f4f6] text-center">
              <span className="text-[11px] text-[#43474d] block font-semibold">Patient Rating</span>
              <span className="font-headline font-bold text-base text-[#001428] flex items-center justify-center gap-1 mt-0.5">
                <span className="material-symbols-outlined text-[16px] text-amber-500 fill">star</span>
                {doctor.rating}
              </span>
              <span className="text-[10px] text-[#74777e]">{doctor.reviewsCount} reviews</span>
            </div>

            <div className="p-3 rounded-lg bg-[#f2f4f6] text-center">
              <span className="text-[11px] text-[#43474d] block font-semibold">Experience</span>
              <span className="font-headline font-bold text-base text-[#001428] mt-0.5 block">
                {doctor.experienceYears} Years
              </span>
              <span className="text-[10px] text-[#74777e]">Board Certified</span>
            </div>

            <div className="p-3 rounded-lg bg-[#f2f4f6] text-center">
              <span className="text-[11px] text-[#43474d] block font-semibold">Next Available</span>
              <span className="font-headline font-bold text-sm text-[#00a187] mt-0.5 block truncate">
                {doctor.nextSlotLabel}
              </span>
              <span className="text-[10px] text-[#74777e]">{doctor.modeLabel}</span>
            </div>
          </div>

          {/* Clinical Bio */}
          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider text-[#43474d] mb-1">
              Clinical Background & Specialization
            </h4>
            <p className="text-xs sm:text-sm text-[#43474d] leading-relaxed">
              {doctor.bio}
            </p>
          </div>

          {/* Badges */}
          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider text-[#43474d] mb-2">
              Credentials & Clinical Focus
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {doctor.badges.map(b => (
                <span key={b} className="px-2.5 py-1 rounded-lg bg-[#f2f4f6] text-[#001428] text-xs font-semibold">
                  {b}
                </span>
              ))}
            </div>
          </div>

          {/* Accepted Insurance Networks */}
          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider text-[#43474d] mb-2">
              Accepted Insurance Networks
            </h4>
            <div className="flex flex-wrap gap-2">
              {doctor.acceptedInsurance.map(ins => (
                <span key={ins} className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#dae2ff] text-[#001946] text-xs font-semibold">
                  <span className="material-symbols-outlined text-[14px] text-[#0055c9]">check_circle</span>
                  {ins}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 bg-white border-t border-[#e0e3e5] flex items-center justify-between gap-3">
          <div className="text-xs text-[#43474d]">
            Next slot: <strong className="text-[#001428] font-bold">{doctor.nextSlotLabel}</strong>
          </div>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-[#f2f4f6] text-[#001428] text-xs font-semibold hover:bg-[#e6e8ea] cursor-pointer"
            >
              Close
            </button>
            <button
              onClick={() => {
                onClose();
                onBook(doctor);
              }}
              className="px-5 py-2 rounded-lg bg-[#001428] text-white text-xs font-bold hover:bg-[#0f2942] transition-colors cursor-pointer"
            >
              Book Consultation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
