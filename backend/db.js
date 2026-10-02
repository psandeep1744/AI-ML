import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, '../data');
const DB_FILE = path.join(DATA_DIR, 'kynovia_db.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

let db = {
  users: [],
  doctors: [],
  availability: [],
  appointments: [],
  reviews: [],
  symptoms: [],
  otp_verifications: [],
  notifications: [],
};

// Seed database if empty or missing
export async function initDatabase() {
  if (fs.existsSync(DB_FILE)) {
    try {
      const content = fs.readFileSync(DB_FILE, 'utf-8');
      db = JSON.parse(content);
      // Ensure all arrays exist
      db.users = db.users || [];
      db.doctors = db.doctors || [];
      db.availability = db.availability || [];
      db.appointments = db.appointments || [];
      db.reviews = db.reviews || [];
      db.symptoms = db.symptoms || [];
      db.otp_verifications = db.otp_verifications || [];
      db.notifications = db.notifications || [];
      if (db.doctors.length > 0) {
        return;
      }
    } catch {
      // Re-seed if corrupted
    }
  }

  const defaultPasswordHash = await bcrypt.hash('Kynovia@2026', 10);

  // Seed Users
  const userPatient = {
    id: 'usr-patient-1',
    full_name: 'Rahul Sharma',
    email: 'patient@kynovia.ai',
    mobile: '+919876543210',
    password_hash: defaultPasswordHash,
    role: 'patient',
    city: 'Bengaluru',
    created_at: new Date().toISOString(),
  };

  const userDoctor = {
    id: 'usr-doctor-1',
    full_name: 'Dr. Rajeshwar Sharma',
    email: 'rajeshwar.sharma@kynovia.ai',
    mobile: '+919876543211',
    password_hash: defaultPasswordHash,
    role: 'doctor',
    city: 'Bengaluru',
    created_at: new Date().toISOString(),
  };

  const userAdmin = {
    id: 'usr-admin-1',
    full_name: 'Kynovia Medical Admin',
    email: 'admin@kynovia.ai',
    mobile: '+919876543212',
    password_hash: defaultPasswordHash,
    role: 'admin',
    city: 'Bengaluru',
    created_at: new Date().toISOString(),
  };

  db.users = [userPatient, userDoctor, userAdmin];

  // Seed Doctors (Bengaluru, Karnataka, India - Verified Indian Physicians)
  db.doctors = [
    {
      id: 'doc-rajeshwar-sharma',
      user_id: 'usr-doctor-1',
      name: 'Dr. Rajeshwar Sharma',
      title: 'Dr. Rajeshwar Sharma, MD, DM, FACC',
      qualification: 'MD, DM, FACC • Senior Interventional Cardiology',
      specialization: 'Cardiovascular Medicine',
      experience_years: 17,
      city: 'Bengaluru',
      area: 'Indiranagar',
      hospital_affiliation: 'Manipal Heart Institute & Kynovia Indiranagar',
      address: '100 Feet Rd, HAL 2nd Stage, Indiranagar, Bengaluru, Karnataka 560038',
      bio: 'Senior interventional cardiologist with 17+ years experience in acute coronary interventions, cardiac rhythm tele-monitoring, and preventive lipidology.',
      consultation_fee: 900,
      rating: 4.95,
      reviews_count: 248,
      image_url: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=600&auto=format&fit=crop&q=80',
      verified: true,
      mode: 'hybrid',
      created_at: new Date().toISOString(),
    },
    {
      id: 'doc-priya-nambiar',
      user_id: 'usr-doctor-2',
      name: 'Dr. Priya V. Nambiar',
      title: 'Dr. Priya V. Nambiar, MD, DM',
      qualification: 'MD, DM (Neurology) • Chief of Headache & Stroke Care',
      specialization: 'Adult & Pediatric Neurology',
      experience_years: 14,
      city: 'Bengaluru',
      area: 'Koramangala',
      hospital_affiliation: 'Aster CMI & Kynovia Telehealth Hub',
      address: '80 Feet Rd, 4th Block, Koramangala, Bengaluru, Karnataka 560034',
      bio: 'Leading neurologist specializing in chronic migraine management, neurovascular screening, and autonomic nervous system disorders.',
      consultation_fee: 1100,
      rating: 4.98,
      reviews_count: 184,
      image_url: 'https://images.unsplash.com/photo-1594824813634-8c8f000bc59a?w=600&auto=format&fit=crop&q=80',
      verified: true,
      mode: 'telehealth',
      created_at: new Date().toISOString(),
    },
    {
      id: 'doc-anand-krishnamurthy',
      user_id: 'usr-doctor-3',
      name: 'Dr. Anand Krishnamurthy',
      title: 'Dr. Anand Krishnamurthy, MD, FICP',
      qualification: 'MD, FICP • Consultant Physician & Diabetologist',
      specialization: 'Internal Medicine',
      experience_years: 21,
      city: 'Bengaluru',
      area: 'Whitefield',
      hospital_affiliation: 'Columbia Asia & Kynovia Diagnostic Pavilion',
      address: 'ITPL Main Rd, Whitefield, Bengaluru, Karnataka 560066',
      bio: 'Renowned physician with extensive clinical expertise in metabolic syndromic balance, diabetes control, and preventive lifestyle medicine.',
      consultation_fee: 700,
      rating: 4.88,
      reviews_count: 320,
      image_url: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=600&auto=format&fit=crop&q=80',
      verified: true,
      mode: 'clinic',
      created_at: new Date().toISOString(),
    },
    {
      id: 'doc-sunita-kulkarni',
      user_id: 'usr-doctor-4',
      name: 'Dr. Sunita Kulkarni',
      title: 'Dr. Sunita Kulkarni, MD, DNB',
      qualification: 'MD, DNB • Senior Consultant Pediatric & Adult Neurology',
      specialization: 'Adult & Pediatric Neurology',
      experience_years: 16,
      city: 'Bengaluru',
      area: 'Lavelle Road',
      hospital_affiliation: 'Apollo Super Specialty Hospital & Kynovia Lab',
      address: 'Lavelle Road, Shanthala Nagar, Ashok Nagar, Bengaluru, Karnataka 560001',
      bio: 'Dedicated neurophysiologist focusing on headache syndromes, vertigo, epilepsy evaluation, and continuous patient telemetry monitoring.',
      consultation_fee: 1400,
      rating: 4.96,
      reviews_count: 196,
      image_url: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=600&auto=format&fit=crop&q=80',
      verified: true,
      mode: 'hybrid',
      created_at: new Date().toISOString(),
    },
    {
      id: 'doc-kavitha-ramanathan',
      user_id: 'usr-doctor-5',
      name: 'Dr. Kavitha Ramanathan',
      title: 'Dr. Kavitha Ramanathan, MD, DVD',
      qualification: 'MD, DVD • Dermatologist & Trichology Specialist',
      specialization: 'Dermatology & Oncology',
      experience_years: 12,
      city: 'Bengaluru',
      area: 'Jayanagar',
      hospital_affiliation: 'Fortis Hospital & Kynovia Cutaneous Center',
      address: '9th Main Rd, 4th Block, Jayanagar, Bengaluru, Karnataka 560011',
      bio: 'Consultant dermatologist specializing in chronic dermatoses, allergy patch profiling, and clinical aesthetic dermatology.',
      consultation_fee: 800,
      rating: 4.92,
      reviews_count: 158,
      image_url: 'https://images.unsplash.com/photo-1651008376811-b90baee60c1f?w=600&auto=format&fit=crop&q=80',
      verified: true,
      mode: 'hybrid',
      created_at: new Date().toISOString(),
    },
    {
      id: 'doc-vikramaditya-reddy',
      user_id: 'usr-doctor-6',
      name: 'Dr. Vikramaditya Reddy',
      title: 'Dr. Vikramaditya Reddy, MS, MCh, FACS',
      qualification: 'MS, MCh, FACS • Chief Orthopedic & Spine Surgeon',
      specialization: 'Orthopedic Surgery',
      experience_years: 22,
      city: 'Bengaluru',
      area: 'HSR Layout',
      hospital_affiliation: 'Sakra World Hospital & Narayana Health',
      address: '27th Main Rd, Sector 1, HSR Layout, Bengaluru, Karnataka 560102',
      bio: 'Chief reconstructive orthopedic surgeon specializing in robotic joint preservation, spine biomechanics, and sports rehabilitation.',
      consultation_fee: 1000,
      rating: 4.94,
      reviews_count: 380,
      image_url: 'https://images.unsplash.com/photo-1622902046580-2b47f47f5471?w=600&auto=format&fit=crop&q=80',
      verified: true,
      mode: 'clinic',
      created_at: new Date().toISOString(),
    },
  ];

  // Seed Availability for each doctor (Mon-Sat, 09:00 - 18:00)
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  db.availability = [];
  for (const doc of db.doctors) {
    for (const day of days) {
      db.availability.push({
        id: `av-${doc.id}-${day.toLowerCase()}`,
        doctor_id: doc.id,
        day_of_week: day,
        start_time: '09:00',
        end_time: '18:00',
        is_active: true,
      });
    }
  }

  // Seed Symptoms for Content-Based AI Matching
  db.symptoms = [
    { id: 'sym-1', name: 'Chest Pain', specialization: 'Cardiovascular Medicine', severity_weight: 0.9, category: 'Cardiac' },
    { id: 'sym-2', name: 'Heart Palpitations', specialization: 'Cardiovascular Medicine', severity_weight: 0.8, category: 'Cardiac' },
    { id: 'sym-3', name: 'Shortness of Breath', specialization: 'Cardiovascular Medicine', severity_weight: 0.85, category: 'Cardiopulmonary' },
    { id: 'sym-4', name: 'Tension Headache', specialization: 'Adult & Pediatric Neurology', severity_weight: 0.6, category: 'Neurological' },
    { id: 'sym-5', name: 'Neck Stiffness', specialization: 'Adult & Pediatric Neurology', severity_weight: 0.65, category: 'Neurological' },
    { id: 'sym-6', name: 'Photophobia / Light Sensitivity', specialization: 'Adult & Pediatric Neurology', severity_weight: 0.7, category: 'Neurological' },
    { id: 'sym-7', name: 'Dizziness', specialization: 'Adult & Pediatric Neurology', severity_weight: 0.65, category: 'Neurological' },
    { id: 'sym-8', name: 'Migraine', specialization: 'Adult & Pediatric Neurology', severity_weight: 0.75, category: 'Neurological' },
    { id: 'sym-9', name: 'Skin Rash', specialization: 'Dermatology & Oncology', severity_weight: 0.5, category: 'Dermatological' },
    { id: 'sym-10', name: 'Itching / Hives', specialization: 'Dermatology & Oncology', severity_weight: 0.5, category: 'Dermatological' },
    { id: 'sym-11', name: 'Acne / Lesions', specialization: 'Dermatology & Oncology', severity_weight: 0.4, category: 'Dermatological' },
    { id: 'sym-12', name: 'Joint Pain', specialization: 'Orthopedic Surgery', severity_weight: 0.7, category: 'Musculoskeletal' },
    { id: 'sym-13', name: 'Knee Swelling', specialization: 'Orthopedic Surgery', severity_weight: 0.75, category: 'Musculoskeletal' },
    { id: 'sym-14', name: 'Back Stiffness', specialization: 'Orthopedic Surgery', severity_weight: 0.65, category: 'Musculoskeletal' },
    { id: 'sym-15', name: 'Chronic Fatigue', specialization: 'Internal Medicine', severity_weight: 0.6, category: 'Systemic' },
    { id: 'sym-16', name: 'Unexplained Weight Loss', specialization: 'Internal Medicine', severity_weight: 0.75, category: 'Systemic' },
    { id: 'sym-17', name: 'High Blood Sugar Symptoms', specialization: 'Internal Medicine', severity_weight: 0.8, category: 'Endocrine' },
  ];

  // Seed initial Appointments
  db.appointments = [
    {
      id: 'apt-8421',
      code: 'APT-8421',
      patient_id: 'usr-patient-1',
      doctor_id: 'doc-rajeshwar-sharma',
      appointment_date: '2026-10-03',
      appointment_time: '14:30',
      consultation_type: 'telehealth',
      status: 'confirmed',
      reason: 'AI ECG Screened • Routine Rhythm & Holter Telemetry Follow-up',
      consultation_fee: 900,
      platform_fee: 0,
      total_amount: 900,
      payment_status: 'Pay at Clinic / Post-Consultation',
      created_at: new Date().toISOString(),
    },
    {
      id: 'apt-7910',
      code: 'APT-7910',
      patient_id: 'usr-patient-1',
      doctor_id: 'doc-priya-nambiar',
      appointment_date: '2026-10-08',
      appointment_time: '10:00',
      consultation_type: 'clinic',
      status: 'confirmed',
      reason: 'MRI Follow-up & Cervicogenic Tension Synthesis',
      consultation_fee: 1100,
      platform_fee: 0,
      total_amount: 1100,
      payment_status: 'Pay at Clinic',
      created_at: new Date().toISOString(),
    },
    {
      id: 'apt-9042',
      code: 'APT-9042',
      patient_id: 'usr-patient-1',
      doctor_id: 'doc-vikramaditya-reddy',
      appointment_date: '2026-11-02',
      appointment_time: '09:30',
      consultation_type: 'clinic',
      status: 'pending',
      reason: 'Orthopedic joint consultation & postural spine ergonomics',
      consultation_fee: 1000,
      platform_fee: 0,
      total_amount: 1000,
      payment_status: 'Pending Clinic Review',
      created_at: new Date().toISOString(),
    },
    {
      id: 'apt-6612',
      code: 'APT-6612',
      patient_id: 'usr-patient-1',
      doctor_id: 'doc-rajeshwar-sharma',
      appointment_date: '2026-09-14',
      appointment_time: '11:00',
      consultation_type: 'clinic',
      status: 'completed',
      reason: 'Annual comprehensive cardiac risk assessment',
      consultation_fee: 900,
      platform_fee: 0,
      total_amount: 900,
      payment_status: 'Paid',
      created_at: '2026-09-14T05:30:00.000Z',
    },
  ];

  // Seed initial reviews
  db.reviews = [
    {
      id: 'rev-1',
      appointment_id: 'apt-6612',
      patient_id: 'usr-patient-1',
      doctor_id: 'doc-rajeshwar-sharma',
      rating: 5,
      comment: 'Excellent cardiology consultation. Dr. Rajeshwar Sharma reviewed my wearable ECG telemetry thoroughly and suggested dietary adjustments with immense care.',
      verified_appointment: true,
      created_at: '2026-09-15T10:00:00.000Z',
    },
  ];

  // Seed notifications
  db.notifications = [
    {
      id: 'notif-1',
      user_id: 'usr-patient-1',
      title: 'Appointment Confirmed',
      message: 'Your Telehealth consultation with Dr. Rajeshwar Sharma on Oct 03 at 2:30 PM IST is confirmed.',
      is_read: false,
      created_at: new Date().toISOString(),
    },
    {
      id: 'notif-2',
      user_id: 'usr-patient-1',
      title: 'Prescription Refill Approved',
      message: 'Medication regimen approved by Dr. Sunita Kulkarni. Dispatched for Bengaluru delivery.',
      is_read: false,
      created_at: new Date().toISOString(),
    },
  ];

  saveDatabase();
}

export function saveDatabase() {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving database:', err);
  }
}

// Database query helpers simulating relational tables with parameters
export const Database = {
  getUsers: () => db.users,
  getUserById: (id) => db.users.find(u => u.id === id),
  getUserByEmail: (email) => db.users.find(u => u.email.toLowerCase() === email.toLowerCase()),
  getUserByMobile: (mobile) => db.users.find(u => u.mobile.replace(/\s+/g, '') === mobile.replace(/\s+/g, '')),
  createUser: (userData) => {
    db.users.push(userData);
    saveDatabase();
    return userData;
  },

  getDoctors: () => db.doctors,
  getDoctorById: (id) => db.doctors.find(d => d.id === id),
  createDoctor: (doctorData) => {
    db.doctors.push(doctorData);
    saveDatabase();
    return doctorData;
  },
  updateDoctorRating: (doctorId) => {
    const docReviews = db.reviews.filter(r => r.doctor_id === doctorId);
    if (docReviews.length > 0) {
      const avg = docReviews.reduce((sum, r) => sum + r.rating, 0) / docReviews.length;
      const doc = db.doctors.find(d => d.id === doctorId);
      if (doc) {
        doc.rating = Number(avg.toFixed(1));
        doc.reviews_count = docReviews.length;
        saveDatabase();
      }
    }
  },

  getAvailability: (doctorId) => db.availability.filter(a => a.doctor_id === doctorId),
  updateAvailability: (doctorId, newSchedule) => {
    db.availability = db.availability.filter(a => a.doctor_id !== doctorId);
    db.availability.push(...newSchedule);
    saveDatabase();
    return newSchedule;
  },

  getAppointments: () => db.appointments,
  getAppointmentById: (id) => db.appointments.find(a => a.id === id),
  getAppointmentsByPatient: (patientId) => db.appointments.filter(a => a.patient_id === patientId),
  getAppointmentsByDoctor: (doctorId) => db.appointments.filter(a => a.doctor_id === doctorId),
  createAppointment: (appointmentData) => {
    db.appointments.unshift(appointmentData);
    saveDatabase();
    return appointmentData;
  },
  updateAppointmentStatus: (id, status) => {
    const appt = db.appointments.find(a => a.id === id);
    if (appt) {
      appt.status = status;
      saveDatabase();
      return appt;
    }
    return null;
  },

  getReviewsByDoctor: (doctorId) => db.reviews.filter(r => r.doctor_id === doctorId),
  createReview: (reviewData) => {
    db.reviews.unshift(reviewData);
    Database.updateDoctorRating(reviewData.doctor_id);
    saveDatabase();
    return reviewData;
  },

  getSymptoms: () => db.symptoms,
  getSymptomsByNames: (names) => {
    const lower = names.map(n => n.toLowerCase());
    return db.symptoms.filter(s => lower.includes(s.name.toLowerCase()));
  },

  // OTP Management
  saveOtp: (mobile, otpHash, expiresAt) => {
    // Invalidate prior unverified OTPs for this mobile
    db.otp_verifications = db.otp_verifications.filter(o => o.mobile !== mobile || o.verified);
    const otpRecord = {
      id: `otp-${Date.now()}`,
      mobile,
      otp_hash: otpHash,
      expires_at: expiresAt,
      attempts: 0,
      verified: false,
      created_at: new Date().toISOString(),
    };
    db.otp_verifications.push(otpRecord);
    saveDatabase();
    return otpRecord;
  },
  getOtpRecord: (mobile) => {
    return db.otp_verifications
      .filter(o => o.mobile === mobile && !o.verified)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))[0];
  },
  incrementOtpAttempts: (id) => {
    const rec = db.otp_verifications.find(o => o.id === id);
    if (rec) {
      rec.attempts += 1;
      saveDatabase();
    }
  },
  markOtpVerified: (id) => {
    const rec = db.otp_verifications.find(o => o.id === id);
    if (rec) {
      rec.verified = true;
      saveDatabase();
    }
  },

  getNotifications: (userId) => db.notifications.filter(n => n.user_id === userId),
  addNotification: (userId, title, message) => {
    const notif = {
      id: `notif-${Date.now()}`,
      user_id: userId,
      title,
      message,
      is_read: false,
      created_at: new Date().toISOString(),
    };
    db.notifications.unshift(notif);
    saveDatabase();
    return notif;
  },
};
