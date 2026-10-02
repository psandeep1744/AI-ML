import React, { useState } from 'react';
import { PatientVitals } from '../types/clinical';

interface HealthVaultViewProps {
  vitals: PatientVitals;
}

export const HealthVaultView: React.FC<HealthVaultViewProps> = ({ vitals }) => {
  const [refillStatus, setRefillStatus] = useState<{ [id: string]: boolean }>({});

  const handleRefill = (medId: string, medName: string) => {
    setRefillStatus(prev => ({ ...prev, [medId]: true }));
    alert(`Refill requisition submitted for ${medName}. Sent to CVS Caremark / Kynovia Mail-Order with 1-day expedited dispatch.`);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-6">
      {/* Header Deck */}
      <section className="bg-white rounded-xl p-5 sm:p-6 border border-[#e0e3e5] shadow-xs flex flex-col gap-2">
        <div className="flex items-center justify-between text-xs text-[#43474d] flex-wrap gap-2">
          <div className="flex items-center gap-2 font-medium">
            <span>Health Vault</span>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span className="text-[#0055c9] font-bold">Decentralized EHR & Labs</span>
          </div>
          <span className="px-2.5 py-0.5 rounded bg-[#dae2ff] text-[#001946] text-[11px] font-bold">
            HIPAA & GDPR Validated
          </span>
        </div>

        <h1 className="font-headline font-bold text-2xl sm:text-3xl text-[#001428] tracking-tight">
          Clinical Health Vault & Diagnostic Records
        </h1>
        <p className="text-xs sm:text-sm text-[#43474d]">
          Consolidated electronic health records, continuous biometric telemetry archives, Quest/Labcorp diagnostic panels, and active pharmacy refill logistics.
        </p>
      </section>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Labs & Diagnostic Panels (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* Recent Lab Tests & Diagnostic Panels */}
          <div className="bg-white rounded-xl p-5 sm:p-6 border border-[#e0e3e5] shadow-xs flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#0055c9] text-[22px]">biotech</span>
                <h3 className="font-headline font-bold text-base text-[#001428]">
                  Verified Laboratory Panels
                </h3>
              </div>
              <button
                onClick={() => alert('Ordering new Quest Diagnostics or Labcorp home draw kit...')}
                className="px-3 py-1.5 rounded-lg bg-[#001428] text-white text-xs font-bold hover:bg-[#0f2942] transition-colors cursor-pointer"
              >
                + Order New Panel
              </button>
            </div>

            <div className="flex flex-col gap-3">
              {/* Panel 1 */}
              <div className="p-4 rounded-xl bg-[#f2f4f6] border border-[#e0e3e5] flex flex-col gap-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h4 className="font-headline font-bold text-sm text-[#001428]">
                      Comprehensive Lipid Biomarker Panel (Fasting)
                    </h4>
                    <span className="text-xs text-[#43474d]">Central Diagnostic Labs • Performed Today, 8:15 AM EDT</span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#7cf8da]/30 text-[#00a187] text-xs font-bold">
                    All Normal
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs pt-1">
                  <div className="bg-white p-2.5 rounded-lg border border-[#e0e3e5]">
                    <span className="text-[#43474d] text-[11px] block">Total Cholesterol</span>
                    <span className="font-headline font-bold text-sm text-[#001428]">172 mg/dL</span>
                    <span className="text-[10px] text-[#00a187]">Optimal (&lt;200)</span>
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border border-[#e0e3e5]">
                    <span className="text-[#43474d] text-[11px] block">HDL-C (Good)</span>
                    <span className="font-headline font-bold text-sm text-[#001428]">58 mg/dL</span>
                    <span className="text-[10px] text-[#00a187]">Protective (&gt;50)</span>
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border border-[#e0e3e5]">
                    <span className="text-[#43474d] text-[11px] block">LDL-C (Calculated)</span>
                    <span className="font-headline font-bold text-sm text-[#001428]">94 mg/dL</span>
                    <span className="text-[10px] text-[#00a187]">Optimal (&lt;100)</span>
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border border-[#e0e3e5]">
                    <span className="text-[#43474d] text-[11px] block">Triglycerides</span>
                    <span className="font-headline font-bold text-sm text-[#001428]">110 mg/dL</span>
                    <span className="text-[10px] text-[#00a187]">Normal (&lt;150)</span>
                  </div>
                </div>
              </div>

              {/* Panel 2 */}
              <div className="p-4 rounded-xl bg-[#f2f4f6] border border-[#e0e3e5] flex flex-col gap-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h4 className="font-headline font-bold text-sm text-[#001428]">
                      Complete Blood Count & Metabolic Panel (CMP-14)
                    </h4>
                    <span className="text-xs text-[#43474d]">Quest Diagnostics • Performed Sep 14, 2024</span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#7cf8da]/30 text-[#00a187] text-xs font-bold">
                    Verified Nominal
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs pt-1">
                  <div className="bg-white p-2.5 rounded-lg border border-[#e0e3e5]">
                    <span className="text-[#43474d] text-[11px] block">Fasting Glucose</span>
                    <span className="font-headline font-bold text-sm text-[#001428]">88 mg/dL</span>
                    <span className="text-[10px] text-[#00a187]">Normal (70-99)</span>
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border border-[#e0e3e5]">
                    <span className="text-[#43474d] text-[11px] block">eGFR (Kidney)</span>
                    <span className="font-headline font-bold text-sm text-[#001428]">&gt; 90 mL/min</span>
                    <span className="text-[10px] text-[#00a187]">Optimal</span>
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border border-[#e0e3e5]">
                    <span className="text-[#43474d] text-[11px] block">Hemoglobin A1c</span>
                    <span className="font-headline font-bold text-sm text-[#001428]">5.2%</span>
                    <span className="text-[10px] text-[#00a187]">Non-Diabetic</span>
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border border-[#e0e3e5]">
                    <span className="text-[#43474d] text-[11px] block">hs-CRP</span>
                    <span className="font-headline font-bold text-sm text-[#001428]">0.6 mg/L</span>
                    <span className="text-[10px] text-[#00a187]">Low Inflammation</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Continuous Telemetry Archives */}
          <div className="bg-white rounded-xl p-5 sm:p-6 border border-[#e0e3e5] shadow-xs flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#00a187] text-[22px]">sensors</span>
                <h3 className="font-headline font-bold text-base text-[#001428]">
                  Continuous Biometric Telemetry (72-Hour Loop)
                </h3>
              </div>
              <span className="text-xs text-[#00a187] font-semibold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#00a187] animate-pulse"></span>
                Active Patch Connected
              </span>
            </div>

            <div className="p-4 rounded-xl bg-[#f2f4f6] border border-[#e0e3e5] flex flex-col gap-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#001428]">Resting Pulse & Rhythm Concordance</span>
                <span className="text-[#43474d]">Average: 64 bpm • Max: 108 bpm • Min: 54 bpm</span>
              </div>

              {/* Simulated Heart Rhythm ECG Line */}
              <div className="w-full h-16 bg-[#001428] rounded-lg p-2 relative overflow-hidden flex items-center">
                <svg className="w-full h-full" viewBox="0 0 400 60" preserveAspectRatio="none" fill="none">
                  <path
                    d="M0,30 L80,30 L90,10 L100,50 L110,20 L120,30 L200,30 L210,10 L220,50 L230,20 L240,30 L320,30 L330,10 L340,50 L350,20 L360,30 L400,30"
                    stroke="#00a187"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <div className="absolute right-3 bottom-2 text-[10px] text-[#7cf8da] font-mono font-bold">
                  Telemetry Synced ({vitals.bloodPressure} mmHg)
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Medications & FHIR Records (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Active Medication Regimen */}
          <div className="bg-white rounded-xl p-5 border border-[#e0e3e5] shadow-xs flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="font-headline font-bold text-base text-[#001428]">Prescriptions</h3>
              <span className="px-2 py-0.5 rounded bg-[#ffdad6] text-[#ba1a1a] text-[10px] font-bold">
                1 REFILL DUE
              </span>
            </div>

            <div className="flex flex-col gap-3">
              {/* Med 1 */}
              <div className="p-3.5 rounded-xl bg-[#f2f4f6] border border-[#e0e3e5] flex flex-col gap-2">
                <div className="flex items-start justify-between">
                  <div>
                    <h5 className="font-headline font-bold text-sm text-[#001428]">Atorvastatin 20mg</h5>
                    <span className="text-xs text-[#43474d]">Oral Tablet • 1x Daily at Bedtime</span>
                  </div>
                  <span className="text-[11px] text-[#00a187] font-semibold">60 Days Left</span>
                </div>
                <span className="text-[11px] text-[#74777e]">Prescribed by Dr. Rajeshwar Sharma (Cardiology, Bengaluru)</span>
              </div>

              {/* Med 2 */}
              <div className="p-3.5 rounded-xl bg-[#f2f4f6] border border-[#ba1a1a]/30 flex flex-col gap-2">
                <div className="flex items-start justify-between">
                  <div>
                    <h5 className="font-headline font-bold text-sm text-[#001428]">Cetirizine 10mg</h5>
                    <span className="text-xs text-[#43474d]">Oral Tablet • Morning Seasonal Allergen</span>
                  </div>
                  <span className="text-[11px] text-[#ba1a1a] font-bold">Refill in 4d</span>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-[#74777e]">Rx #6692-004</span>
                  <button
                    onClick={() => handleRefill('cetirizine', 'Cetirizine 10mg')}
                    disabled={refillStatus['cetirizine']}
                    className="px-3 py-1 rounded bg-[#001428] text-white text-xs font-bold hover:bg-[#0f2942] transition-colors cursor-pointer disabled:bg-[#74777e]"
                  >
                    {refillStatus['cetirizine'] ? 'Refill Ordered ✓' : 'One-Click Refill'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* FHIR Ledger & Interoperability Node */}
          <div className="bg-white rounded-xl p-5 border border-[#e0e3e5] shadow-xs flex flex-col gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#0055c9] text-[20px]">account_tree</span>
              <h4 className="font-headline font-bold text-sm text-[#001428]">HL7/FHIR Data Ledger</h4>
            </div>
            <p className="text-[#43474d] leading-relaxed">
              Your medical chart synchronizes across Mass General, St. Jude Heart Institute, and Kynovia Virtual Network via interoperable FHIR R4 nodes.
            </p>
            <div className="p-3 bg-[#f2f4f6] rounded-lg flex flex-col gap-1 font-mono text-[11px] text-[#001428]">
              <div>NODE: <span className="font-bold">BOS-CENTRAL-04</span></div>
              <div>HASH: <span className="text-[#0055c9]">0x7F8B...E4A1</span></div>
              <div>ENCRYPTION: <span className="text-[#00a187]">AES-256 GCM</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
