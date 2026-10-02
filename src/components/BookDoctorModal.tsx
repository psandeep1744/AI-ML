import React, { useState } from 'react';
import { Doctor, Appointment } from '../types/clinical';

interface BookDoctorModalProps {
  doctor: Doctor;
  initialSlot?: string;
  onClose: () => void;
  onConfirmBooking: (newAppointment: Appointment) => void;
}

export const BookDoctorModal: React.FC<BookDoctorModalProps> = ({
  doctor,
  initialSlot,
  onClose,
  onConfirmBooking,
}) => {
  const [selectedSlot, setSelectedSlot] = useState(
    initialSlot || doctor.availableSlots[0]?.label || 'Today 2:30 PM'
  );
  const [consultType, setConsultType] = useState<'telehealth' | 'clinic'>(
    doctor.mode === 'clinic' ? 'clinic' : 'telehealth'
  );
  const [reason, setReason] = useState('Routine clinical review & symptom triaging follow-up');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    setTimeout(() => {
      const isTelehealth = consultType === 'telehealth';
      const newAppt: Appointment = {
        id: `apt-${Date.now().toString().slice(-4)}`,
        code: `APT-${Math.floor(1000 + Math.random() * 9000)}`,
        doctorId: doctor.id,
        doctorName: doctor.name,
        doctorTitle: doctor.title,
        doctorSpecialty: doctor.specialty,
        doctorImage: doctor.imageUrl,
        type: consultType,
        typeLabel: isTelehealth ? 'Telehealth Video Consultation' : 'In-Clinic Specialist Exam',
        status: 'confirmed',
        dateDisplay: selectedSlot.includes('Today')
          ? 'Today, Oct 22, 2024'
          : selectedSlot.includes('Tomorrow')
          ? 'Tomorrow, Oct 23, 2024'
          : selectedSlot,
        timeDisplay: `${selectedSlot} (45 mins)`,
        clinicalFocus: reason,
        roomVerified: isTelehealth,
        intakeCompleted: true,
        copay: '$25.00',
        facilityName: !isTelehealth ? doctor.institution : undefined,
        facilityAddress: !isTelehealth ? '350 Longwood Ave, Boston MA' : undefined,
      };

      onConfirmBooking(newAppt);
      setSubmitting(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#001428]/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl border border-[#e0e3e5] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-5 bg-[#f2f4f6] border-b border-[#e0e3e5] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={doctor.imageUrl}
              alt={doctor.name}
              className="w-12 h-12 rounded-lg object-cover border border-white"
              referrerPolicy="no-referrer"
            />
            <div>
              <span className="text-[11px] font-bold uppercase text-[#0055c9] tracking-wider block">
                Book Consultation
              </span>
              <h3 className="font-headline font-bold text-base text-[#001428]">{doctor.name}</h3>
              <span className="text-xs text-[#43474d]">{doctor.specialty}</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#74777e] hover:text-[#001428] cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4 text-xs text-[#191c1e]">
          {/* Consultation Mode */}
          <div>
            <label className="font-bold text-xs uppercase text-[#43474d] tracking-wider block mb-1.5">
              Consultation Mode
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setConsultType('telehealth')}
                className={`py-2.5 px-3 rounded-lg font-bold flex items-center justify-center gap-2 border transition-colors cursor-pointer ${
                  consultType === 'telehealth'
                    ? 'bg-[#001428] text-white border-[#001428]'
                    : 'bg-[#f2f4f6] text-[#43474d] border-[#e0e3e5]'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">videocam</span>
                <span>Telehealth Video</span>
              </button>
              <button
                type="button"
                onClick={() => setConsultType('clinic')}
                className={`py-2.5 px-3 rounded-lg font-bold flex items-center justify-center gap-2 border transition-colors cursor-pointer ${
                  consultType === 'clinic'
                    ? 'bg-[#001428] text-white border-[#001428]'
                    : 'bg-[#f2f4f6] text-[#43474d] border-[#e0e3e5]'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">domain</span>
                <span>In-Clinic Visit</span>
              </button>
            </div>
          </div>

          {/* Available Slots */}
          <div>
            <label className="font-bold text-xs uppercase text-[#43474d] tracking-wider block mb-1.5">
              Select Time Slot
            </label>
            <div className="grid grid-cols-2 gap-2">
              {doctor.availableSlots.map(slot => (
                <button
                  key={slot.id}
                  type="button"
                  onClick={() => setSelectedSlot(slot.label)}
                  className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                    selectedSlot === slot.label
                      ? 'bg-[#0055c9] text-white border-[#0055c9] shadow-xs'
                      : 'bg-[#f2f4f6] text-[#191c1e] border-[#e0e3e5] hover:bg-[#e6e8ea]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[14px]">
                    {slot.type === 'video' ? 'videocam' : 'domain'}
                  </span>
                  <span className="truncate">{slot.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Reason / Clinical Intake Note */}
          <div>
            <label className="font-bold text-xs uppercase text-[#43474d] tracking-wider block mb-1.5">
              Reason for Consultation & Symptoms
            </label>
            <textarea
              rows={2}
              value={reason}
              onChange={e => setReason(e.target.value)}
              className="w-full bg-[#f2f4f6] rounded-lg p-2.5 text-xs text-[#191c1e] border border-[#e0e3e5] focus:outline-none focus:ring-1 focus:ring-[#0055c9]"
              placeholder="E.g. Recurrent tension headache, medication review..."
            />
          </div>

          {/* Insurance & Copay Confirmation */}
          <div className="p-3 rounded-lg bg-[#f2f4f6] border border-[#e0e3e5] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#00a187] text-[18px]">verified</span>
              <div>
                <span className="font-bold text-[#001428] block">Blue Cross Blue Shield</span>
                <span className="text-[11px] text-[#43474d]">In-Network Copay: $25.00</span>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded bg-white text-[11px] font-bold text-[#00a187] border border-[#e0e3e5]">
              Pre-Authorized
            </span>
          </div>

          {/* Footer Submit */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#e0e3e5]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-[#f2f4f6] text-[#001428] font-bold hover:bg-[#e6e8ea] cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 rounded-lg bg-[#001428] text-white font-bold hover:bg-[#0f2942] transition-colors shadow-xs cursor-pointer disabled:bg-[#74777e]"
            >
              {submitting ? 'Confirming with EHR...' : 'Confirm Appointment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
