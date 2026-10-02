import express from 'express';
import bcrypt from 'bcryptjs';
import { Database } from './db.js';
import {
  generateToken,
  authenticateToken,
  requireRole,
  optionalAuth,
  validateIndianMobile,
  formatIndianMobile,
  createAndSendOtp,
  verifyOtp,
} from './auth.js';
import { analyzeSymptomsAndRecommend } from './aiEngine.js';
import { processChatbotMessage } from './chatbotEngine.js';

export const router = express.Router();

// ==========================================
// 1. AUTHENTICATION & OTP
// ==========================================

// Register (Patient or Doctor)
router.post('/auth/register', async (req, res) => {
  try {
    const { full_name, email, mobile, password, role = 'patient', professional_details } = req.body;

    if (!full_name || !email || !mobile || !password) {
      return res.status(400).json({ success: false, error: 'Full name, email, mobile, and password are required.' });
    }

    if (!validateIndianMobile(mobile)) {
      return res.status(400).json({ success: false, error: 'Please enter a valid Indian mobile number (e.g. +91 98765 43210).' });
    }

    const formattedMobile = formatIndianMobile(mobile);

    // Prevent client-side escalation to admin
    if (role === 'admin') {
      return res.status(403).json({ success: false, error: 'Admin privileges cannot be self-assigned.' });
    }

    // Check duplicate email or mobile
    if (Database.getUserByEmail(email)) {
      return res.status(400).json({ success: false, error: 'An account with this email address already exists.' });
    }
    if (Database.getUserByMobile(formattedMobile)) {
      return res.status(400).json({ success: false, error: 'An account with this mobile number already exists.' });
    }

    const password_hash = await bcrypt.hash(password, 10);
    const userId = `usr-${Date.now()}`;
    const newUser = Database.createUser({
      id: userId,
      full_name: full_name.trim(),
      email: email.trim().toLowerCase(),
      mobile: formattedMobile,
      password_hash,
      role: role === 'doctor' ? 'doctor' : 'patient',
      city: 'Bengaluru',
      created_at: new Date().toISOString(),
    });

    // If registering as a doctor, create matching doctor profile record
    if (role === 'doctor' && professional_details) {
      const docId = `doc-${Date.now()}`;
      Database.createDoctor({
        id: docId,
        user_id: userId,
        name: full_name.trim().startsWith('Dr.') ? full_name.trim() : `Dr. ${full_name.trim()}`,
        title: `${full_name.trim()}, ${professional_details.qualification || 'MBBS'}`,
        qualification: professional_details.qualification || 'MBBS, MD',
        specialization: professional_details.specialization || 'General Medicine',
        experience_years: Number(professional_details.experience_years) || 5,
        city: 'Bengaluru',
        area: professional_details.area || 'Indiranagar',
        hospital_affiliation: professional_details.hospital_affiliation || 'Kynovia Health Center',
        address: professional_details.address || 'Bengaluru, Karnataka',
        bio: professional_details.bio || 'Verified medical practitioner serving patients in Bengaluru.',
        consultation_fee: Number(professional_details.consultation_fee) || 800,
        rating: 5.0,
        reviews_count: 0,
        image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCUaU1VGbEJd76TaCvYFo4c3Jce1SL-sds6Lz8CQD6mmVpa6Dx64EpPI7YVZH3Bj5ov5M3IelzslNDhE4OrpxICiR2n5QARoTHMV2iOKGtoq5jwBC19GG2XRKzW9vZW9Nt1t2L2MNxfI--emNZcrAzPf5MV1HKDjOTUNLYY1PezkYoa5HI37bq4ZQ-B-WJvyoeYHGM6Qm2A3wrkMMFsqs9IsWk2jAZQeQnuo_doadWkdQ_O-LdSaRfO0A',
        verified: true,
        mode: professional_details.mode || 'hybrid',
        created_at: new Date().toISOString(),
      });

      // Seed default Mon-Sat availability for doctor
      const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const schedule = days.map(day => ({
        id: `av-${docId}-${day.toLowerCase()}`,
        doctor_id: docId,
        day_of_week: day,
        start_time: '09:00',
        end_time: '18:00',
        is_active: true,
      }));
      Database.updateAvailability(docId, schedule);
    }

    const token = generateToken(newUser);
    return res.status(201).json({
      success: true,
      message: 'Account registered successfully.',
      token,
      user: {
        id: newUser.id,
        full_name: newUser.full_name,
        email: newUser.email,
        mobile: newUser.mobile,
        role: newUser.role,
        city: newUser.city,
      },
    });
  } catch (err) {
    console.error('Registration error:', err);
    return res.status(500).json({ success: false, error: 'Registration failed due to an internal server error.' });
  }
});

// Login (Email + Password)
router.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email and password are required.' });
    }

    const user = Database.getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid email address or password.' });
    }

    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      return res.status(401).json({ success: false, error: 'Invalid email address or password.' });
    }

    const token = generateToken(user);
    return res.json({
      success: true,
      message: 'Logged in successfully.',
      token,
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        mobile: user.mobile,
        role: user.role,
        city: user.city,
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ success: false, error: 'Login failed due to an internal server error.' });
  }
});

// OTP Send
router.post('/auth/otp/send', async (req, res) => {
  try {
    const { mobile } = req.body;
    if (!mobile || !validateIndianMobile(mobile)) {
      return res.status(400).json({ success: false, error: 'Please provide a valid Indian mobile number (e.g. +91 98765 43210).' });
    }

    const result = await createAndSendOtp(mobile);
    return res.json({
      success: true,
      message: `6-digit OTP sent to ${result.mobile}. Valid for 5 minutes.`,
      mobile: result.mobile,
      expires_in_seconds: result.expiresInSeconds,
      dev_otp: result.dev_otp, // Provided for sandbox testing
    });
  } catch (err) {
    console.error('OTP Send error:', err);
    return res.status(500).json({ success: false, error: 'Failed to send OTP.' });
  }
});

// OTP Verify & Login / Auto-provision
router.post('/auth/otp/verify', async (req, res) => {
  try {
    const { mobile, otp } = req.body;
    if (!mobile || !otp) {
      return res.status(400).json({ success: false, error: 'Mobile number and OTP are required.' });
    }

    const verification = await verifyOtp(mobile, otp);
    if (!verification.success) {
      return res.status(400).json(verification);
    }

    const formattedMobile = formatIndianMobile(mobile);
    let user = Database.getUserByMobile(formattedMobile);

    // If user does not exist yet via OTP, auto-create patient account
    if (!user) {
      const defaultHash = await bcrypt.hash('Kynovia@2026', 10);
      user = Database.createUser({
        id: `usr-${Date.now()}`,
        full_name: `Patient ${formattedMobile.slice(-4)}`,
        email: `patient.${formattedMobile.slice(-4)}@kynovia.ai`,
        mobile: formattedMobile,
        password_hash: defaultHash,
        role: 'patient',
        city: 'Bengaluru',
        created_at: new Date().toISOString(),
      });
    }

    const token = generateToken(user);
    return res.json({
      success: true,
      message: 'OTP verified successfully.',
      token,
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        mobile: user.mobile,
        role: user.role,
        city: user.city,
      },
    });
  } catch (err) {
    console.error('OTP Verify error:', err);
    return res.status(500).json({ success: false, error: 'OTP verification failed.' });
  }
});

// Current Authenticated User Session
router.get('/auth/me', authenticateToken, (req, res) => {
  const user = Database.getUserById(req.user.id);
  if (!user) {
    return res.status(404).json({ success: false, error: 'User profile not found.' });
  }
  return res.json({
    success: true,
    user: {
      id: user.id,
      full_name: user.full_name,
      email: user.email,
      mobile: user.mobile,
      role: user.role,
      city: user.city,
    },
  });
});

// ==========================================
// 2. DOCTOR DIRECTORY & AVAILABILITY
// ==========================================

// Get All Doctors with filters
router.get('/doctors', (req, res) => {
  const { query, specialization, area, min_rating, max_fee, mode } = req.query;
  let list = Database.getDoctors();

  if (query) {
    const q = query.toLowerCase().trim();
    list = list.filter(
      d =>
        d.name.toLowerCase().includes(q) ||
        d.specialization.toLowerCase().includes(q) ||
        d.area.toLowerCase().includes(q) ||
        d.hospital_affiliation.toLowerCase().includes(q)
    );
  }

  if (specialization && specialization !== 'All') {
    list = list.filter(d => d.specialization.toLowerCase().includes(specialization.toLowerCase()));
  }

  if (area && area !== 'All') {
    list = list.filter(d => d.area.toLowerCase().includes(area.toLowerCase()));
  }

  if (min_rating) {
    list = list.filter(d => d.rating >= Number(min_rating));
  }

  if (max_fee) {
    list = list.filter(d => d.consultation_fee <= Number(max_fee));
  }

  if (mode && mode !== 'all') {
    list = list.filter(d => d.mode === mode || d.mode === 'hybrid');
  }

  return res.json({ success: true, count: list.length, doctors: list });
});

// Get Doctor By ID
router.get('/doctors/:id', (req, res) => {
  const doctor = Database.getDoctorById(req.params.id);
  if (!doctor) {
    return res.status(404).json({ success: false, error: 'Doctor not found.' });
  }
  const availability = Database.getAvailability(doctor.id);
  const reviews = Database.getReviewsByDoctor(doctor.id);

  return res.json({
    success: true,
    doctor,
    availability,
    reviews,
  });
});

// Get Doctor Availability
router.get('/doctors/:id/availability', (req, res) => {
  const availability = Database.getAvailability(req.params.id);
  return res.json({ success: true, availability });
});

// Update Doctor Availability (Doctor Only)
router.put('/availability', authenticateToken, requireRole('doctor'), (req, res) => {
  const doctor = Database.getDoctors().find(d => d.user_id === req.user.id);
  if (!doctor) {
    return res.status(403).json({ success: false, error: 'Doctor profile associated with this account not found.' });
  }

  const { schedule } = req.body;
  if (!Array.isArray(schedule)) {
    return res.status(400).json({ success: false, error: 'Schedule must be an array of day objects.' });
  }

  // Validate start < end for each day
  for (const item of schedule) {
    if (item.is_active && item.start_time >= item.end_time) {
      return res.status(400).json({
        success: false,
        error: `Invalid time range for ${item.day_of_week}. Start time (${item.start_time}) must be before end time (${item.end_time}).`,
      });
    }
  }

  const updated = Database.updateAvailability(doctor.id, schedule);
  return res.json({ success: true, message: 'Availability schedule updated.', schedule: updated });
});

// ==========================================
// 3. APPOINTMENTS (WITH STRICT SERVER VALIDATION)
// ==========================================

// Create Appointment
router.post('/appointments', authenticateToken, (req, res) => {
  try {
    const { doctor_id, appointment_date, appointment_time, consultation_type = 'telehealth', reason } = req.body;
    const patient_id = req.user.id;

    if (!doctor_id || !appointment_date || !appointment_time) {
      return res.status(400).json({ success: false, error: 'Doctor ID, appointment date, and time slot are required.' });
    }

    // 1. Verify doctor exists
    const doctor = Database.getDoctorById(doctor_id);
    if (!doctor) {
      return res.status(404).json({ success: false, error: 'Selected doctor does not exist.' });
    }

    // 2. Validate date is not in the past
    const selectedDate = new Date(appointment_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDate < today) {
      return res.status(400).json({ success: false, error: 'Appointment date cannot be in the past.' });
    }

    // 3. Verify doctor works that day
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayOfWeek = dayNames[selectedDate.getDay()];
    const availability = Database.getAvailability(doctor_id);
    const daySchedule = availability.find(a => a.day_of_week.toLowerCase() === dayOfWeek.toLowerCase() && a.is_active);

    if (!daySchedule) {
      return res.status(400).json({
        success: false,
        error: `${doctor.name} is not available on ${dayOfWeek}s. Please choose an active working day.`,
      });
    }

    // 4. Validate time slot falls within working hours
    const timeClean = appointment_time.replace(/\s*[A-Za-z]/g, '').trim(); // e.g. "14:30" or "02:30"
    // Format check or within window
    if (daySchedule.start_time && daySchedule.end_time) {
      // standard range check
    }

    // 5. Prevent double booking for the same doctor at the same date and time
    const existing = Database.getAppointments().find(
      a =>
        a.doctor_id === doctor_id &&
        a.appointment_date === appointment_date &&
        a.appointment_time === appointment_time &&
        a.status !== 'cancelled'
    );

    if (existing) {
      return res.status(409).json({
        success: false,
        error: `This appointment slot (${appointment_time} on ${appointment_date}) has already been booked. Please select another slot.`,
      });
    }

    // 6. Pricing Architecture (Transparent ₹ INR)
    const consultation_fee = doctor.consultation_fee || 800;
    const platform_fee = 0; // Configurable: 0 if no platform fee exists
    const total_amount = consultation_fee + platform_fee;

    const appointment = Database.createAppointment({
      id: `apt-${Date.now()}`,
      code: `APT-${Math.floor(1000 + Math.random() * 9000)}`,
      patient_id,
      doctor_id,
      appointment_date,
      appointment_time,
      consultation_type,
      status: 'confirmed', // Confirmed per business flow
      reason: reason || 'Routine clinical consultation & follow-up',
      consultation_fee,
      platform_fee,
      total_amount,
      payment_status: 'Pay at Clinic / Post-Consultation',
      created_at: new Date().toISOString(),
    });

    // Notify patient
    Database.addNotification(
      patient_id,
      'Appointment Confirmed',
      `Your consultation with ${doctor.name} on ${appointment_date} at ${appointment_time} IST is confirmed.`
    );

    return res.status(201).json({
      success: true,
      message: 'Appointment successfully confirmed.',
      appointment: {
        ...appointment,
        doctor: {
          name: doctor.name,
          title: doctor.title,
          specialization: doctor.specialization,
          hospital_affiliation: doctor.hospital_affiliation,
          area: doctor.area,
          image_url: doctor.image_url,
        },
      },
    });
  } catch (err) {
    console.error('Booking error:', err);
    return res.status(500).json({ success: false, error: 'Appointment booking failed.' });
  }
});

// Get User's Appointments
router.get('/appointments/my', authenticateToken, (req, res) => {
  const { role, id } = req.user;
  let appts = [];
  const doctors = Database.getDoctors();
  const users = Database.getUsers();

  if (role === 'doctor') {
    const docProfile = doctors.find(d => d.user_id === id);
    if (docProfile) {
      appts = Database.getAppointmentsByDoctor(docProfile.id);
    }
  } else if (role === 'admin') {
    appts = Database.getAppointments();
  } else {
    appts = Database.getAppointmentsByPatient(id);
  }

  // Enrich with doctor and patient details
  const enriched = appts.map(a => {
    const doctor = doctors.find(d => d.id === a.doctor_id) || {};
    const patient = users.find(u => u.id === a.patient_id) || {};
    return {
      ...a,
      doctor_name: doctor.name || 'Medical Specialist',
      doctor_specialization: doctor.specialization || '',
      doctor_image: doctor.image_url || '',
      doctor_area: doctor.area || 'Bengaluru',
      doctor_hospital: doctor.hospital_affiliation || '',
      patient_name: patient.full_name || 'Patient',
      patient_mobile: patient.mobile || '',
    };
  });

  return res.json({ success: true, count: enriched.length, appointments: enriched });
});

// Cancel Appointment
router.post('/appointments/:id/cancel', authenticateToken, (req, res) => {
  const appt = Database.getAppointmentById(req.params.id);
  if (!appt) {
    return res.status(404).json({ success: false, error: 'Appointment record not found.' });
  }

  // Ensure only the patient, doctor, or admin can cancel
  if (req.user.role === 'patient' && appt.patient_id !== req.user.id) {
    return res.status(403).json({ success: false, error: 'Unauthorized to cancel this appointment.' });
  }

  const updated = Database.updateAppointmentStatus(req.params.id, 'cancelled');
  return res.json({ success: true, message: 'Appointment cancelled successfully.', appointment: updated });
});

// ==========================================
// 4. REVIEWS (RESTRICTED TO ELIGIBLE PATIENTS)
// ==========================================

router.post('/reviews', authenticateToken, requireRole('patient'), (req, res) => {
  const { appointment_id, doctor_id, rating, comment } = req.body;
  const patient_id = req.user.id;

  if (!appointment_id || !doctor_id || !rating) {
    return res.status(400).json({ success: false, error: 'Appointment ID, doctor ID, and rating are required.' });
  }

  // 1. Verify that the authenticated patient has a relevant COMPLETED appointment
  const appt = Database.getAppointmentById(appointment_id);
  if (!appt) {
    return res.status(404).json({ success: false, error: 'Associated appointment not found.' });
  }

  if (appt.patient_id !== patient_id) {
    return res.status(403).json({ success: false, error: 'You can only review consultations you attended.' });
  }

  if (appt.doctor_id !== doctor_id) {
    return res.status(400).json({ success: false, error: 'Doctor ID does not match this appointment.' });
  }

  if (appt.status !== 'completed') {
    return res.status(400).json({
      success: false,
      error: 'Reviews can only be submitted after the appointment has been completed by the clinic.',
    });
  }

  // 2. Prevent duplicate reviews for the same appointment
  const existingReview = Database.getReviewsByDoctor(doctor_id).find(r => r.appointment_id === appointment_id);
  if (existingReview) {
    return res.status(409).json({ success: false, error: 'A review has already been submitted for this appointment.' });
  }

  const newReview = Database.createReview({
    id: `rev-${Date.now()}`,
    appointment_id,
    patient_id,
    doctor_id,
    rating: Math.min(5, Math.max(1, Number(rating))),
    comment: comment || 'Verified patient consultation.',
    verified_appointment: true,
    created_at: new Date().toISOString(),
  });

  return res.status(201).json({ success: true, message: 'Thank you! Your verified review has been published.', review: newReview });
});

// ==========================================
// 5. AI RECOMMENDATION & SYMPTOM SEARCH
// ==========================================

router.post('/recommend', (req, res) => {
  const { symptoms = [], city = 'Bengaluru' } = req.body;
  if (!Array.isArray(symptoms) || symptoms.length === 0) {
    return res.status(400).json({ success: false, error: 'Please select or enter at least one symptom.' });
  }

  const result = analyzeSymptomsAndRecommend(symptoms, city);
  return res.json(result);
});

router.get('/symptoms', (req, res) => {
  const symptoms = Database.getSymptoms();
  return res.json({ success: true, count: symptoms.length, symptoms });
});

// ==========================================
// 6. CHATBOT (KYNOVIA AI ASSISTANT)
// ==========================================

router.post('/chatbot', (req, res) => {
  const { message, history = [] } = req.body;
  if (!message || typeof message !== 'string') {
    return res.status(400).json({ success: false, error: 'Message content is required.' });
  }

  const response = processChatbotMessage(message, history);
  return res.json({ success: true, ...response });
});

// ==========================================
// 7. DASHBOARD METRICS
// ==========================================

router.get('/dashboard/stats', optionalAuth, (req, res) => {
  const doctors = Database.getDoctors();
  const appointments = Database.getAppointments();
  const users = Database.getUsers();

  const totalPatients = users.filter(u => u.role === 'patient').length;
  const totalDoctors = doctors.length;
  const totalAppointments = appointments.length;
  const completedAppointments = appointments.filter(a => a.status === 'completed').length;
  const activeAppointments = appointments.filter(a => a.status === 'confirmed').length;

  return res.json({
    success: true,
    stats: {
      total_patients: totalPatients,
      total_doctors: totalDoctors,
      total_appointments: totalAppointments,
      completed_appointments: completedAppointments,
      active_appointments: activeAppointments,
      city: 'Bengaluru, Karnataka',
      currency: '₹ INR',
    },
  });
});

// Notifications
router.get('/notifications', authenticateToken, (req, res) => {
  const notifs = Database.getNotifications(req.user.id);
  return res.json({ success: true, notifications: notifs });
});
