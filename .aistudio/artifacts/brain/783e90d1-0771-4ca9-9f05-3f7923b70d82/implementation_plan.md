# Kynovia AI Clinical Intelligence Platform

An authoritative, production-grade clinical intelligence and healthcare delivery platform matching the high-fidelity designs. The platform seamlessly bridges patient-facing digital health experiences with physician-grade decision support, featuring responsive desktop workstation and mobile app views, real-time biometric telemetry, interactive AI-powered symptom triaging with Gemini, verified specialist directory booking, appointment scheduling with visit preparation directives, and an encrypted telehealth video consultation suite.

## User Review & Critical Decisions

> [!IMPORTANT]
> The clarifying questions were completed with recommended clinical and architectural defaults:
> - **Unified Responsive Architecture**: Responsive layout supporting both high-density desktop clinical workstations and mobile tab navigation, complete with a quick device/viewport preview toggle.
> - **Live Gemini AI Clinical Triaging**: Gemini 3.8 Flash powers the clinical diagnostic copilot, generating probabilistic impressions, differential exclusion weights, and specialty routing with robust clinical fallbacks.
> - **Interactive Telehealth Video Suite**: An in-app WebRTC video consultation room with camera/mic controls, simulated doctor stream, real-time vitals HUD, and clinical note-taking.

---

## 1. Overview & Core Concept

- **What It Does**: Kynovia AI is an intelligent clinical decision-support and patient navigation ecosystem. It provides patients and clinicians with:
  1. A real-time health telemetry **Dashboard** with biometric status, medication regimens, and environmental trigger alerts (e.g. allergen spikes).
  2. A verified **Find Doctors Specialist Directory** with EHR-synchronized availability, filters, and immediate slot booking.
  3. A 4-stage **AI Health Triaging Engine** (FDA SaMD Class II protocol compliant UI) that collects symptoms, pain/duration context, synthesizes clinical impressions with Gemini reasoning, and matches specialized providers.
  4. An **Appointments & Clinical Visits** command center with an interactive calendar, telehealth launch pad, in-clinic campus navigation/parking validation, and pre-visit clinical preparation directives (fasting, insurance pre-authorization, copays).
  5. An encrypted **Telehealth Consultation Room** supporting interactive video consults, camera/mic testing, and clinical session summaries.
- **Target Audience / Persona**: Patients managing acute or chronic conditions, and clinical care coordinators conducting triage and tele-consultations.
- **Key Value**: Eliminates healthcare navigation friction by pairing automated clinical intelligence with instantaneous human provider access.

---

## 2. User Experience & Visual Design

### Key User Flows

1. **Dashboard & Telemetry Hub**:
   - Patient reviews live biometric stream (optimal 118/76 mmHg, 64 bpm, resting pulse sparkline).
   - Reviews immediate next visit (Dr. Eleanor Vance, Thursday Oct 24) with 1-click video consultation entry.
   - Checks Kynovia Diagnostic Copilot allergen alert (68 AQI, ragweed spike) and authorizes OTC regimen.
   - Quick portal access to Find Doctors, Symptom AI, In-Clinic Visits, and Health Vault.
   - Switches between "Patient" and "Doctor / Care Team" view modes.

2. **AI Health Triaging Flow**:
   - **Stage 1 (Symptom Intake)**: Interactive symptom tag list (Tension Headache, Neck Stiffness, Photophobia), searchable tag input, quick co-factor chips.
   - **Stage 2 (Context & Severity)**: 1–10 Numeric Pain Rating Scale (NRS) interactive slider, duration pills (<24h, 2-3d, 1w+), lifestyle trigger toggles (Screen Time, Poor Sleep, Dehydration).
   - **Stage 3 (Algorithmic Synthesis)**: Real-time Gemini inference generating primary probabilistic impression (*Tension-Type Cephalea with Cervicogenic Component*, 89% concordance), ICD-10 equivalent, evidence grade B+, differential diagnosis probabilities, and clinical reasoning.
   - **Stage 4 (Specialist Matching & Forwarding)**: Top matched physician (Dr. Elena Rostova, PhD, MD), 1-click telehealth booking, and option to generate & forward clinical summary to PCP.

3. **Find Doctors (Specialist Directory)**:
   - Full search bar with instant keyword matching across specialties, conditions, and doctor names.
   - Filter bar and drawer (Telehealth, In-Person, Hybrid; Cardiology, Neurology, Internal Medicine, Dermatology, Orthopedic; Same-day availability; Insurance networks).
   - Rich doctor cards with verified credentials, ratings, next available slots, and interactive slot selection with instant booking modals.

4. **Appointments & Clinical Coordinator**:
   - Status tabs: Upcoming (2), Pending (1), Completed (14), Cancelled (0).
   - Interactive calendar widget for October 2024 with status markers.
   - Actionable cards: Telehealth consultation room launcher, in-clinic visit with campus map navigation & parking validation, pending authorization tracker.
   - Pre-visit directives (Fasting blood draw reminder, insurance pre-authorization confirmation, copay breakdown).

5. **Telehealth Consultation Room**:
   - Encrypted room `#NV-4491-EDT` with camera preview, simulated physician video stream, audio waveform visualizer, session duration counter, pre-visit chart notes, and call controls (Mute, Camera, Screen Share, Chat, End Call).

### Visual Identity & Theme

- **Design Philosophy**: Executive Clinical Modernity. High-authority medical precision with surgical clarity.
- **Color Palette** (WCAG AAA compliant):
  - Canvas: Background `#F7F9FB`, Pure White cards `#FFFFFF`, Surface Muted `#F2F4F6`.
  - Primary Identity: Deep Navy `#001428` & Sapphire Container `#0F2942`.
  - Interactive Action: Clinical Cobalt `#0055C9` and vibrant `#036CFB`.
  - AI & Diagnostic Intelligence: Surgical Teal `#00A187` and `#7CF8DA`.
  - Clinical Alerts: Crimson `#BA1A1A` and Soft Error Container `#FFDAD6`.
- **Typography**:
  - Headings: `Manrope` (700 & 600 weight) for structural clinical authority.
  - Body & Tabular Data: `Hanken Grotesk` (400 & 600 weight) with `tabular-nums` for crisp telemetry readability.
- **Imagery**: High-resolution clinical physician portraits and hospital campus navigation assets with resilient fallback styling.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Responsive Dual-Shell Architecture (Desktop & Mobile)**:
  - *Chosen Approach*: Support both the full 1440px multi-column Clinical Desktop Workstation and the Mobile App Shell with thumb navigation bar, along with a top-bar device preview toggle so users can experience both screen designs shown in the source assets.
  - *Why*: The user provided designs for both mobile app frames (Image 2, 4, 6, 8) and desktop workstation layouts (Image 11, 13, 15, 17). Offering both gives full fidelity to every provided screen.
- **Decision 2: Hybrid Gemini AI with Verified Clinical Fallback**:
  - *Chosen Approach*: Call the `@google/genai` SDK on the backend server (`/api/triage`) with `gemini-3.8-flash` for dynamic clinical synthesis when symptoms change, while maintaining pre-loaded high-fidelity diagnostic records for instant loading and offline stability.
  - *Why*: Ensures zero latency on initial load while enabling genuine interactive AI reasoning when users enter custom symptoms.
- **Decision 3: Interactive State Persistence via Local Storage & Memory**:
  - *Chosen Approach*: Unified client-side reactive store for appointments, booked slots, reported symptoms, and patient profile data, persisted in `localStorage`.
  - *Why*: Booking a new appointment or modifying a date instantly updates the Dashboard, Calendar, and Visits tab across the entire app.

---

## 4. Technical Architecture & Data Strategy

### System Architecture & Component Hierarchy

```
┌────────────────────────────────────────────────────────────────────────┐
│                        Kynovia AI Application                          │
├────────────────────────────────────────────────────────────────────────┤
│  Top Navigation (Brand Wordmark, Portal Mode, Telemetry, 911, Profile)  │
├────────────────────────────────────────────────────────────────────────┤
│  View Router (Dashboard | Find Doctors | AI Health | Visits | Records) │
│  ┌───────────────────┬───────────────────┬──────────────────────────┐  │
│  │    Dashboard      │   Find Doctors    │    AI Health Triaging    │  │
│  │  - Telemetry KPI  │ - Search & Filter │  - 4-Stage Stepper       │  │
│  │  - Next Visit Hero│ - Doctor Cards    │  - NRS Pain & Triggers   │  │
│  │  - Copilot Alert  │ - Time Slot Book  │  - Live Gemini Synthesis │  │
│  │  - Care Portals   │ - Specialty Sheet │  - PCP Forwarding        │  │
│  ├───────────────────┴───────────────────┴──────────────────────────┤  │
│  │  Appointments & Visits                │ Telehealth Video Room    │  │
│  │  - Calendar Widget (Oct 2024)         │ - Encrypted Video Chamber│  │
│  │  - Upcoming / Pending / Completed     │ - Camera/Mic Controls    │  │
│  │  - Preparation Directives (Fasting/Rx)│ - Live Telemetry HUD     │  │
│  └───────────────────────────────────────┴──────────────────────────┘  │
├────────────────────────────────────────────────────────────────────────┤
│  Mobile Bottom Navigation (Home | Doctors | AI Health | Visits | Vault)│
├────────────────────────────────────────────────────────────────────────┤
│  Express API Server (`server.ts`): `/api/triage` (Gemini 3.8 Flash)    │
└────────────────────────────────────────────────────────────────────────┘
```

### Core Entities & State Model

```typescript
interface Doctor {
  id: string;
  name: string;
  title: string;
  specialty: string;
  rating: number;
  reviewsCount: number;
  experienceYears: number;
  imageUrl: string;
  location: string;
  mode: 'telehealth' | 'clinic' | 'hybrid';
  availableSlots: string[];
  badges: string[];
  aiMatchScore?: number;
}

interface Appointment {
  id: string;
  doctorId: string;
  doctor: Doctor;
  type: 'telehealth' | 'clinic';
  status: 'confirmed' | 'pending' | 'completed' | 'cancelled';
  dateString: string;
  timeSlot: string;
  facility?: string;
  preparationNotes?: string[];
  intakeCompleted: boolean;
}

interface TriageState {
  symptoms: Array<{ id: string; name: string; severity: 'Mild' | 'Moderate' | 'Severe' }>;
  painScore: number;
  duration: '< 24 Hours' | '2 - 3 Days' | '1 Week +';
  triggers: string[];
  synthesisResult: {
    impression: string;
    matchPercent: number;
    icd10: string;
    evidenceGrade: string;
    reasoning: string;
    differentialExclusions: Array<{ name: string; reason: string; prob: number }>;
    urgencyGrade: string;
    recommendedSpecialty: string;
  };
}
```

### Verification & Testing Plan

1. **Compilation Check**: Run `compile_applet` to ensure full TypeScript typing and build pass without warnings.
2. **Interactive Flow Testing**:
   - Navigation across all 5 views on both desktop and simulated mobile viewports.
   - Symptom addition/removal and real-time NRS slider responsiveness.
   - Gemini API triage generation and diagnostic report updates.
   - Doctor search by query and filtering by specialty/mode.
   - Appointment slot selection and booking modal with state synchronization.
   - Launching and ending the Telehealth consultation room.
   - Calendar date selection and tab filtering (Upcoming, Pending, Completed).
