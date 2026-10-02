export type ViewMode = 'dashboard' | 'find-doctors' | 'ai-health' | 'appointments' | 'health-records';
export type UserRole = 'patient' | 'doctor';
export type DeviceShell = 'responsive' | 'mobile' | 'desktop';

export interface Doctor {
  id: string;
  name: string;
  title: string;
  credentials?: string;
  specialty: string;
  subspecialty?: string;
  rating: number;
  reviewsCount: number;
  experienceYears: number;
  imageUrl: string;
  location: string;
  institution: string;
  mode: 'telehealth' | 'clinic' | 'hybrid';
  modeLabel: string;
  nextSlotLabel: string;
  isTodayAvailable: boolean;
  availableSlots: Array<{
    id: string;
    label: string;
    type: 'video' | 'in-person';
    time: string;
  }>;
  badges: string[];
  bio?: string;
  acceptedInsurance: string[];
  aiMatchScore?: number;
  aiMatchReason?: string;
}

export interface Appointment {
  id: string;
  code: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialty: string;
  doctorTitle: string;
  doctorImage: string;
  type: 'telehealth' | 'clinic';
  typeLabel: string;
  status: 'confirmed' | 'pending' | 'completed' | 'cancelled';
  dateDisplay: string;
  timeDisplay: string;
  facilityName?: string;
  facilityAddress?: string;
  parkingInfo?: string;
  clinicalFocus: string;
  roomVerified?: boolean;
  intakeCompleted: boolean;
  meetingUrl?: string;
  copay?: string;
}

export interface SymptomItem {
  id: string;
  name: string;
  severity: 'Mild' | 'Moderate' | 'Severe';
  category?: string;
}

export interface TriagingSynthesis {
  impression: string;
  matchPercent: number;
  icd10: string;
  evidenceGrade: string;
  cohortBasis: string;
  primaryDrivers: string;
  clinicalReasoning: string;
  differentialExclusions: Array<{
    name: string;
    reason: string;
    prob: number;
  }>;
  urgencyGrade: string;
  recommendedSpecialty: string;
  matchedDoctorId?: string;
}

export interface PatientVitals {
  bloodPressure: string;
  restingHeartRate: number;
  status: 'STABLE' | 'ELEVATED' | 'CRITICAL';
  biometricSource: string;
  lastSynced: string;
  airQualityIndex: number;
  airQualityLabel: string;
  environmentalRiskNotice: string;
}

export interface ActivityItem {
  id: string;
  title: string;
  subtitle: string;
  timestamp: string;
  icon: string;
  colorType: 'teal' | 'blue' | 'neutral';
}
