import React, { useState } from 'react';
import { SymptomItem, TriagingSynthesis, Doctor } from '../types/clinical';
import { DEFAULT_TRIAGE_SYNTHESIS } from '../data/mockClinicalData';
import { runClinicalTriage } from '../services/geminiTriage';

interface AIHealthTriagingViewProps {
  doctors: Doctor[];
  onBookDoctor: (doctor: Doctor) => void;
  onForwardSummaryToPCP: (synthesis: TriagingSynthesis) => void;
}

export const AIHealthTriagingView: React.FC<AIHealthTriagingViewProps> = ({
  doctors,
  onBookDoctor,
  onForwardSummaryToPCP,
}) => {
  const [symptoms, setSymptoms] = useState<SymptomItem[]>([
    { id: 'sym-1', name: 'Tension Headache', severity: 'Moderate' },
    { id: 'sym-2', name: 'Neck Stiffness', severity: 'Mild' },
    { id: 'sym-3', name: 'Photophobia / Light Sensitivity', severity: 'Mild' },
  ]);
  const [newSymptomText, setNewSymptomText] = useState('');
  const [painScore, setPainScore] = useState<number>(6);
  const [duration, setDuration] = useState<'< 24 Hours' | '2 - 3 Days' | '1 Week +'>('2 - 3 Days');
  const [triggers, setTriggers] = useState<string[]>([
    'High Screen Time (>9h)',
    'Poor Sleep (<5 hrs)',
    'Dehydration Indicator',
  ]);
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [synthesis, setSynthesis] = useState<TriagingSynthesis>(DEFAULT_TRIAGE_SYNTHESIS);
  const [savedToJournal, setSavedToJournal] = useState(false);

  // Matched physician
  const matchedDoctor =
    doctors.find(d => d.id === synthesis.matchedDoctorId) ||
    doctors.find(d => d.id === 'doc-elena-rostova') ||
    doctors[0];

  const handleAddSymptom = (name: string) => {
    if (!name.trim()) return;
    if (symptoms.some(s => s.name.toLowerCase() === name.trim().toLowerCase())) return;
    setSymptoms(prev => [
      ...prev,
      { id: `sym-${Date.now()}`, name: name.trim(), severity: 'Moderate' },
    ]);
    setNewSymptomText('');
  };

  const handleRemoveSymptom = (id: string) => {
    setSymptoms(prev => prev.filter(s => s.id !== id));
  };

  const toggleTrigger = (trigger: string) => {
    setTriggers(prev =>
      prev.includes(trigger) ? prev.filter(t => t !== trigger) : [...prev, trigger]
    );
  };

  const executeLiveAnalysis = async () => {
    setIsSynthesizing(true);
    try {
      const result = await runClinicalTriage({
        symptoms: symptoms.map(s => s.name),
        painScore,
        duration,
        triggers,
      });
      setSynthesis(result);
    } catch {
      // Handled in service
    } finally {
      setIsSynthesizing(false);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-6">
      {/* Regulatory & Clinical Advisory Banner */}
      <div className="bg-[#ffdad6]/40 rounded-xl p-4 sm:p-5 border border-[#ba1a1a]/20 shadow-xs flex items-start gap-4">
        <div className="w-9 h-9 rounded-lg bg-[#ba1a1a] text-white flex items-center justify-center shrink-0 mt-0.5">
          <span className="material-symbols-outlined text-[20px]">warning</span>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-headline font-bold text-sm sm:text-base text-[#93000a]">
              Clinical Advisory Notice & Regulatory Bounds
            </span>
            <span className="px-2 py-0.5 rounded bg-[#ba1a1a] text-white text-[10px] font-bold uppercase tracking-wider">
              Investigational Protocol
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#43474d] mt-1 leading-relaxed">
            Kynovia AI Clinical Triaging System provides evidence-informed clinical guidance and probabilistic triaging assistance under FDA SaMD Class II evaluation frameworks. This does <strong className="text-[#191c1e] font-semibold">NOT</strong> constitute a definitive medical diagnosis. If you are experiencing acute, sudden thunderclap headache, focal neurological deficits, or life-threatening symptoms, immediately dial <strong className="text-[#ba1a1a] font-bold">911</strong> or dispatch emergency care.
          </p>
        </div>
        <div className="hidden lg:flex items-center gap-1.5 shrink-0 px-3 py-1.5 rounded-lg bg-white border border-[#e0e3e5] text-xs font-semibold text-[#191c1e]">
          <span className="material-symbols-outlined text-[#00a187] text-[16px]">verified</span>
          <span>SaMD Protocol v4.28</span>
        </div>
      </div>

      {/* 4-Stage Stepper Header */}
      <div className="bg-white rounded-xl p-4 border border-[#e0e3e5] shadow-xs">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4">
          {/* Step 1 */}
          <div className="flex items-center gap-2.5 p-2 rounded-lg bg-[#f2f4f6]/80">
            <div className="w-8 h-8 rounded-full bg-[#00a187] text-white flex items-center justify-center font-bold text-xs shrink-0">
              <span className="material-symbols-outlined text-[16px]">check</span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[10px] uppercase font-bold text-[#00a187] tracking-wider leading-none">
                Stage 01
              </span>
              <span className="text-xs font-bold text-[#191c1e] truncate mt-0.5">Symptom Intake</span>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex items-center gap-2.5 p-2 rounded-lg bg-[#f2f4f6]/80">
            <div className="w-8 h-8 rounded-full bg-[#00a187] text-white flex items-center justify-center font-bold text-xs shrink-0">
              <span className="material-symbols-outlined text-[16px]">check</span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[10px] uppercase font-bold text-[#00a187] tracking-wider leading-none">
                Stage 02
              </span>
              <span className="text-xs font-bold text-[#191c1e] truncate mt-0.5">Context & Severity</span>
            </div>
          </div>

          {/* Step 3 (Active) */}
          <div className="flex items-center gap-2.5 p-2 rounded-lg bg-[#0f2942] text-white shadow-xs">
            <div className="relative w-8 h-8 rounded-full bg-[#0055c9] text-white flex items-center justify-center font-bold text-xs shrink-0">
              <span className={`material-symbols-outlined text-[16px] ${isSynthesizing ? 'animate-spin' : ''}`}>
                sync
              </span>
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#7cf8da] animate-ping"></span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[10px] uppercase font-bold text-[#7cf8da] tracking-wider leading-none">
                Stage 03 • Processing
              </span>
              <span className="text-xs font-bold text-white truncate mt-0.5">Algorithmic Synthesis</span>
            </div>
          </div>

          {/* Step 4 */}
          <div className="flex items-center gap-2.5 p-2 rounded-lg bg-[#f2f4f6]/50 opacity-80">
            <div className="w-8 h-8 rounded-full bg-[#e6e8ea] text-[#43474d] flex items-center justify-center font-bold text-xs shrink-0">
              4
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[10px] uppercase font-bold text-[#43474d] tracking-wider leading-none">
                Stage 04
              </span>
              <span className="text-xs font-semibold text-[#43474d] truncate mt-0.5">Specialist Match</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Two-Column Triage Deck */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 lg:gap-8 items-start">
        {/* LEFT COLUMN: Patient Intake Context Inputs (5 cols) */}
        <div className="xl:col-span-5 flex flex-col gap-6">
          {/* Module 1: Reported Symptoms */}
          <div className="bg-white rounded-xl p-5 border border-[#e0e3e5] shadow-xs flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#0055c9] text-[20px]">bubble_chart</span>
                <h2 className="font-headline font-bold text-base text-[#001428]">Reported Symptoms</h2>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-[#7cf8da]/20 text-[#00a187] text-[11px] font-bold">
                {symptoms.length} Active
              </span>
            </div>

            <p className="text-xs text-[#43474d]">
              Primary phenotypic markers identified via automated clinical intake questionnaire.
            </p>

            {/* Active Symptom Tags */}
            <div className="flex flex-wrap gap-2">
              {symptoms.map(s => (
                <div
                  key={s.id}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#f2f4f6] text-[#191c1e] text-xs font-medium border border-[#e0e3e5] shadow-2xs"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0055c9]"></span>
                  <span>{s.name}</span>
                  <span className="text-[10px] text-[#74777e]">({s.severity})</span>
                  <button
                    onClick={() => handleRemoveSymptom(s.id)}
                    aria-label={`Remove ${s.name}`}
                    className="ml-1 hover:text-[#ba1a1a] transition-colors flex items-center cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[15px]">close</span>
                  </button>
                </div>
              ))}
            </div>

            {/* Add Custom Symptom Input */}
            <div className="flex flex-col gap-2 pt-1">
              <form
                onSubmit={e => {
                  e.preventDefault();
                  handleAddSymptom(newSymptomText);
                }}
                className="relative flex items-center bg-[#f2f4f6] rounded-lg px-3 py-1.5 border border-[#e0e3e5]"
              >
                <span className="material-symbols-outlined text-[#74777e] text-[18px] mr-2">add</span>
                <input
                  type="text"
                  value={newSymptomText}
                  onChange={e => setNewSymptomText(e.target.value)}
                  placeholder="Add another symptom (e.g. Dizziness, Nausea)..."
                  className="bg-transparent w-full text-xs sm:text-sm text-[#191c1e] placeholder:text-[#74777e] focus:outline-none"
                />
                {newSymptomText && (
                  <button
                    type="submit"
                    className="text-xs text-[#0055c9] font-bold px-2 py-0.5 rounded bg-white border border-[#e0e3e5] shadow-xs cursor-pointer"
                  >
                    Add
                  </button>
                )}
              </form>

              {/* Quick Suggestion Chips */}
              <div className="flex items-center gap-1.5 flex-wrap pt-1 text-xs">
                <span className="text-[#74777e] text-[11px]">Quick add:</span>
                {['Dizziness', 'Mild Nausea', 'Fatigue', 'Jaw Clenching', 'Ocular Strain'].map(chip => (
                  <button
                    key={chip}
                    type="button"
                    onClick={() => handleAddSymptom(chip)}
                    className="px-2 py-0.5 rounded bg-[#f2f4f6] text-[#43474d] hover:bg-[#e6e8ea] hover:text-[#001428] text-[11px] font-medium transition-colors cursor-pointer"
                  >
                    + {chip}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Module 2: Severity, Duration & Lifestyle Context */}
          <div className="bg-white rounded-xl p-5 border border-[#e0e3e5] shadow-xs flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#0055c9] text-[20px]">tune</span>
                <h2 className="font-headline font-bold text-base text-[#001428]">Severity & Context</h2>
              </div>
              <span className="text-xs text-[#43474d] font-semibold">Validated NRS</span>
            </div>

            {/* Pain Scale (NRS) Slider */}
            <div className="flex flex-col gap-2 bg-[#f2f4f6] p-3.5 rounded-xl border border-[#e0e3e5]">
              <div className="flex justify-between items-center">
                <label htmlFor="painSlider" className="text-xs font-bold text-[#191c1e]">
                  Numeric Pain Rating Scale (NRS)
                </label>
                <span className="font-headline font-bold text-base text-[#0055c9]">
                  {painScore} <span className="text-xs text-[#43474d] font-normal">/ 10</span>
                  <span className="ml-1 text-[11px] font-bold px-1.5 py-0.5 rounded bg-white border border-[#e0e3e5]">
                    {painScore >= 7 ? 'Severe' : painScore >= 4 ? 'Moderate' : 'Mild'}
                  </span>
                </span>
              </div>
              <input
                id="painSlider"
                type="range"
                min="1"
                max="10"
                value={painScore}
                onChange={e => setPainScore(Number(e.target.value))}
                className="w-full h-2 bg-[#e0e3e5] rounded-lg appearance-none cursor-pointer accent-[#0055c9]"
              />
              <div className="flex justify-between text-[11px] text-[#74777e] px-1 font-medium">
                <span>1 (Mild)</span>
                <span>5 (Moderate)</span>
                <span>10 (Debilitating)</span>
              </div>
            </div>

            {/* Duration Pills */}
            <div className="flex flex-col gap-2">
              <span className="text-xs font-bold text-[#191c1e]">Symptom Duration</span>
              <div className="grid grid-cols-3 gap-2">
                {(['< 24 Hours', '2 - 3 Days', '1 Week +'] as const).map(d => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDuration(d)}
                    className={`py-2 px-1 text-center rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      duration === d
                        ? 'bg-[#001428] text-white shadow-xs font-bold'
                        : 'bg-[#f2f4f6] text-[#43474d] hover:bg-[#e6e8ea]'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            {/* Lifestyle Co-Factors & Triggers */}
            <div className="flex flex-col gap-2">
              <span className="text-xs font-bold text-[#191c1e]">Associated Context Factors & Triggers</span>
              <div className="flex flex-wrap gap-2">
                {[
                  'High Screen Time (>9h)',
                  'Poor Sleep (<5 hrs)',
                  'Dehydration Indicator',
                  'Caffeine Withdrawal',
                  'Physical Exertion',
                  'Ergonomic Posture Deficit',
                ].map(trig => {
                  const isActive = triggers.includes(trig);
                  return (
                    <button
                      key={trig}
                      type="button"
                      onClick={() => toggleTrigger(trig)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                        isActive
                          ? 'bg-[#dae2ff] text-[#001946]'
                          : 'bg-[#f2f4f6] text-[#43474d] hover:bg-[#e6e8ea]'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[15px]">
                        {isActive ? 'check' : 'add'}
                      </span>
                      <span>{trig}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Re-Analyze CTA Button */}
            <button
              onClick={executeLiveAnalysis}
              disabled={isSynthesizing}
              className="w-full h-11 rounded-lg bg-[#001428] hover:bg-[#0f2942] text-white font-headline text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-xs transition-all active:scale-[0.99] cursor-pointer disabled:bg-[#74777e]"
            >
              <span className="material-symbols-outlined text-[18px] text-[#7cf8da]">
                {isSynthesizing ? 'progress_activity' : 'auto_awesome'}
              </span>
              <span>{isSynthesizing ? 'Synthesizing Diagnostic Models...' : 'Re-Run Live Clinical Synthesis'}</span>
            </button>
          </div>

          {/* Module 3: Synced Patient EHR Profile Record */}
          <div className="bg-white rounded-xl p-5 border border-[#e0e3e5] shadow-xs flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#00a187] text-[20px]">folder_shared</span>
                <h3 className="font-headline font-bold text-sm text-[#001428]">EHR Integrated History</h3>
              </div>
              <span className="text-[11px] px-2 py-0.5 rounded bg-[#7cf8da]/20 text-[#00a187] font-bold">
                Synced Live
              </span>
            </div>

            <div className="space-y-2 text-xs text-[#191c1e]">
              <div className="flex items-start gap-2">
                <span className="material-symbols-outlined text-[#00a187] text-[16px] shrink-0 mt-0.5">check_circle</span>
                <span><strong className="font-semibold">Vascular Status:</strong> No personal or familial history of cerebral aneurysms.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="material-symbols-outlined text-[#00a187] text-[16px] shrink-0 mt-0.5">check_circle</span>
                <span><strong className="font-semibold">Baseline Hemodynamics:</strong> Normotensive (Last verified BP 118/76 mmHg, Resting HR 64 bpm).</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="material-symbols-outlined text-[#74777e] text-[16px] shrink-0 mt-0.5">info</span>
                <span><strong className="font-semibold">Allergies:</strong> Seasonal allergic rhinitis. No active anticoagulation therapy.</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: AI Synthesis & Doctor Match (7 cols) */}
        <div className="xl:col-span-7 flex flex-col gap-6">
          {/* Live Clinical Triaging Synthesis Card */}
          <div className="bg-white rounded-xl p-5 sm:p-6 border border-[#00a187]/40 shadow-md relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#00a187] via-[#036cfb] to-[#00a187]"></div>

            <div className="flex flex-col gap-4">
              {/* Header Status */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pt-1">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#7cf8da]/20 text-[#002e25] rounded-full">
                    <span className="w-2 h-2 rounded-full bg-[#00a187] animate-pulse"></span>
                    <span className="text-[11px] uppercase font-bold text-[#00a187] tracking-wider">
                      Live Clinical Triaging Synthesis
                    </span>
                  </div>
                  <span className="text-[11px] text-[#43474d] bg-[#f2f4f6] px-2 py-0.5 rounded">
                    Latency: 142ms
                  </span>
                </div>
                <div className="flex items-center gap-1 text-xs font-bold text-[#0055c9]">
                  <span className="material-symbols-outlined text-[16px]">psychology</span>
                  <span>NeuroBio 4.2 Engine</span>
                </div>
              </div>

              {/* Impression Category */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-bold uppercase text-[#43474d] tracking-wider">
                    Primary Probabilistic Impression
                  </span>
                  <span className="font-headline font-bold text-base text-[#00a187]">
                    {synthesis.matchPercent}% Match
                  </span>
                </div>
                <h1 className="font-headline font-bold text-xl sm:text-2xl text-[#001428] leading-snug">
                  {synthesis.impression}
                </h1>
                <div className="flex items-center gap-2 text-xs text-[#43474d] mt-1.5 flex-wrap">
                  <span className="px-2 py-0.5 rounded bg-[#f2f4f6] font-semibold text-[#001428]">
                    {synthesis.icd10}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-[#f2f4f6] font-semibold text-[#00a187]">
                    {synthesis.evidenceGrade}
                  </span>
                  <span className="text-[11px]">{synthesis.cohortBasis}</span>
                </div>
              </div>

              {/* Algorithmic Confidence Bar */}
              <div className="bg-[#f2f4f6] p-3 rounded-lg flex flex-col gap-1.5 border border-[#e0e3e5]">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-[#43474d] font-medium">Algorithmic Confidence Assessment</span>
                  <span className="font-bold text-[#00a187]">
                    High Clinical Concordance ({synthesis.matchPercent}%)
                  </span>
                </div>
                <div className="w-full bg-[#e6e8ea] rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-[#00a187] to-[#036cfb] h-full rounded-full transition-all duration-700"
                    style={{ width: `${synthesis.matchPercent}%` }}
                  ></div>
                </div>
              </div>

              {/* Clinical Reasoning & Phenotypic Drivers */}
              <div className="bg-[#f2f4f6] rounded-xl p-4 flex flex-col gap-2 border border-[#e0e3e5]">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#001428]">
                  <span className="material-symbols-outlined text-[16px] text-[#0055c9]">psychology_alt</span>
                  <span>Clinical Reasoning & Phenotypic Drivers</span>
                </div>
                <p className="text-xs sm:text-sm text-[#43474d] leading-relaxed">
                  <strong className="text-[#191c1e] font-semibold">Primary Attribution:</strong> {synthesis.clinicalReasoning}
                </p>

                {/* Differential Diagnostic Exclusions */}
                <div className="mt-2 pt-2 border-t border-[#e0e3e5] space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#43474d] block">
                    Differential Diagnostic Exclusion Weights:
                  </span>
                  {synthesis.differentialExclusions.map((diff, idx) => (
                    <div key={idx} className="flex items-start justify-between gap-2 text-xs">
                      <div className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[16px] text-[#74777e]">
                          remove_circle_outline
                        </span>
                        <span className="font-semibold text-[#191c1e]">{diff.name}</span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[11px] text-[#74777e] hidden sm:inline">{diff.reason}</span>
                        <span className="px-2 py-0.5 rounded bg-white border border-[#e0e3e5] text-[11px] font-bold text-[#191c1e]">
                          {diff.prob}% Prob
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Urgency & Specialty Pair */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="p-3.5 rounded-lg bg-[#f2f4f6] flex items-start gap-3 border border-[#e0e3e5]">
                  <div className="w-8 h-8 rounded-lg bg-[#0055c9] text-white flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[18px]">schedule</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase text-[#43474d] tracking-wider block">
                      Triage Urgency Grade
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-[#191c1e] mt-0.5 block">
                      {synthesis.urgencyGrade}
                    </span>
                    <span className="text-[11px] text-[#74777e]">Non-emergency ambulatory follow-up</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-lg bg-[#f2f4f6] flex items-start gap-3 border border-[#e0e3e5]">
                  <div className="w-8 h-8 rounded-lg bg-[#0f2942] text-white flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[18px]">medical_services</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase text-[#43474d] tracking-wider block">
                      Recommended Specialty
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-[#0055c9] mt-0.5 block">
                      {synthesis.recommendedSpecialty}
                    </span>
                    <span className="text-[11px] text-[#74777e]">Targeted specialist consultation</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Matched Clinical Specialist Card */}
          {matchedDoctor && (
            <div className="bg-white rounded-xl p-5 border border-[#e0e3e5] shadow-xs flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#0055c9] text-[20px]">person_check</span>
                  <h3 className="font-headline font-bold text-sm sm:text-base text-[#001428]">
                    Top Matched Clinical Specialist
                  </h3>
                </div>
                <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#dae2ff] text-[#001946] text-xs font-bold">
                  <span className="material-symbols-outlined text-[14px]">auto_awesome</span>
                  <span>98% Match for Cephalea Profile</span>
                </span>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-xl bg-[#f2f4f6] border border-[#e0e3e5]">
                <div className="relative shrink-0 w-16 h-16 rounded-full overflow-hidden shadow-xs border-2 border-white bg-slate-200">
                  <img
                    src={matchedDoctor.imageUrl}
                    alt={matchedDoctor.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-[#00a187] border-2 border-white"></div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-headline font-bold text-base text-[#001428] truncate">
                      {matchedDoctor.title}
                    </h4>
                    <span className="px-2 py-0.5 rounded bg-white text-[11px] font-bold text-[#43474d] border border-[#e0e3e5]">
                      Board Certified
                    </span>
                  </div>
                  <p className="text-xs text-[#43474d] truncate mt-0.5">{matchedDoctor.specialty}</p>

                  <div className="flex items-center gap-3 mt-1.5 text-xs flex-wrap">
                    <span className="text-[#00a187] font-bold flex items-center gap-1">
                      <span className="material-symbols-outlined text-[15px]">event_available</span>
                      {matchedDoctor.nextSlotLabel}
                    </span>
                    <span className="text-[#43474d] flex items-center gap-1">
                      <span className="material-symbols-outlined text-[15px]">videocam</span>
                      Telehealth Video Ready
                    </span>
                    <span className="text-[#001428] font-semibold flex items-center gap-0.5">
                      <span className="material-symbols-outlined text-[14px] text-amber-500 fill">star</span>
                      {matchedDoctor.rating}
                    </span>
                  </div>
                </div>

                <div className="flex sm:flex-col gap-2 w-full sm:w-auto shrink-0">
                  <button
                    onClick={() => onBookDoctor(matchedDoctor)}
                    className="flex-1 sm:flex-none px-4 py-2 rounded-lg bg-[#0055c9] text-white text-xs font-bold hover:bg-[#036cfb] transition-colors shadow-xs cursor-pointer text-center"
                  >
                    Book Instant Telehealth
                  </button>
                  <button
                    onClick={() => onBookDoctor(matchedDoctor)}
                    className="flex-1 sm:flex-none px-4 py-2 rounded-lg bg-white border border-[#e0e3e5] text-[#001428] text-xs font-semibold hover:bg-slate-50 transition-colors cursor-pointer text-center"
                  >
                    Doctor Profile
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Action CTAs Stack */}
          <div className="bg-white rounded-xl p-5 border border-[#e0e3e5] shadow-xs flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <button
                onClick={() => onForwardSummaryToPCP(synthesis)}
                className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-[#001428] hover:bg-[#0f2942] text-white font-headline text-xs sm:text-sm font-bold shadow-xs transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px] text-[#7cf8da]">send_time_extension</span>
                <span>Generate Full Summary & Forward to PCP</span>
              </button>

              <button
                onClick={() => {
                  setSavedToJournal(true);
                  setTimeout(() => setSavedToJournal(false), 2500);
                }}
                className={`flex items-center justify-center gap-1.5 px-4 py-3 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                  savedToJournal
                    ? 'bg-[#7cf8da]/30 border-[#00a187] text-[#002e25]'
                    : 'bg-[#f2f4f6] border-[#e0e3e5] text-[#001428] hover:bg-[#e6e8ea]'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">
                  {savedToJournal ? 'check' : 'bookmark_add'}
                </span>
                <span>{savedToJournal ? 'Saved to Health Journal!' : 'Save to Health Journal'}</span>
              </button>
            </div>

            {/* Cryptographic Compliance Footnote */}
            <div className="pt-2 border-t border-[#e0e3e5] flex flex-wrap items-center justify-between gap-2 text-[11px] text-[#43474d]">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[#00a187] text-[15px]">lock</span>
                <span>Cryptographic Patient Hash: <code className="font-mono text-[#001428] font-bold">0x7F8B...E4A1</code></span>
              </div>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00a187]"></span> AES-256 Validated
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00a187]"></span> BAA Attached
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00a187]"></span> Audit Trail #2026-0881
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
