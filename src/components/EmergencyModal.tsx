import React from 'react';

interface EmergencyModalProps {
  onClose: () => void;
}

export const EmergencyModal: React.FC<EmergencyModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#001428]/70 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-[#ffdad6] overflow-hidden flex flex-col">
        {/* Urgent Header */}
        <div className="p-5 bg-[#ffdad6] border-b border-[#ba1a1a]/20 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#ba1a1a] text-white flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[24px]">emergency</span>
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase text-[#93000a] tracking-wider block">
                Immediate Clinical Assistance
              </span>
              <h3 className="font-headline font-bold text-lg text-[#93000a]">Emergency & Nurse Line</h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/80 hover:bg-white text-[#93000a] flex items-center justify-center cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="p-5 flex flex-col gap-4 text-xs text-[#191c1e]">
          <div className="p-3 rounded-lg bg-[#ffdad6]/40 border border-[#ba1a1a]/20 text-[#93000a] leading-relaxed">
            <strong>If you are experiencing any of the following acute symptoms, immediately call 911:</strong>
            <ul className="list-disc pl-4 mt-1.5 space-y-1">
              <li>Sudden severe chest pressure, tightness, or pain radiating to jaw/arm</li>
              <li>Sudden numbness, facial droop, or weakness on one side of the body</li>
              <li>Acute sudden &ldquo;thunderclap&rdquo; headache of maximal intensity</li>
              <li>Severe respiratory distress or inability to catch breath</li>
            </ul>
          </div>

          {/* 911 Immediate Action Button */}
          <a
            href="tel:911"
            className="w-full py-3.5 px-4 rounded-xl bg-[#ba1a1a] hover:bg-red-700 text-white font-headline font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.99] text-center"
          >
            <span className="material-symbols-outlined text-[20px]">call</span>
            <span>Call 911 Immediately</span>
          </a>

          {/* 24/7 Clinical Nurse Triage Line */}
          <div className="p-3.5 rounded-xl bg-[#f2f4f6] border border-[#e0e3e5] flex flex-col gap-2">
            <span className="font-bold text-[#001428] uppercase tracking-wider text-[11px]">
              For Non-Life Threatening Urgent Guidance:
            </span>
            <a
              href="tel:18005550199"
              className="w-full py-2.5 px-3 rounded-lg bg-white border border-[#e0e3e5] hover:bg-slate-50 text-[#0055c9] font-bold flex items-center justify-between transition-colors shadow-xs"
            >
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">support_agent</span>
                <span>24/7 On-Call Triage Nurse</span>
              </div>
              <span>1-800-555-0199</span>
            </a>
          </div>

          {/* Nearest Emergency Department */}
          <div className="p-3 rounded-xl bg-[#f2f4f6] border border-[#e0e3e5] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-[#0055c9] text-[20px]">local_hospital</span>
              <div>
                <span className="font-bold text-[#001428] block">Memorial Medical Center (ER)</span>
                <span className="text-[11px] text-[#43474d]">1.4 miles away • 350 Longwood Ave, Boston</span>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded bg-[#7cf8da]/30 text-[#00a187] font-bold text-[11px]">
              Wait &lt; 8m
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-white border-t border-[#e0e3e5] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-[#f2f4f6] text-[#001428] text-xs font-bold hover:bg-[#e6e8ea] cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
};
