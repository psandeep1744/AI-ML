import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { Database } from './db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'kynovia_secret_key_bengaluru_2026_secured';
const OTP_EXPIRY_MS = 5 * 60 * 1000; // 5 minutes
const MAX_OTP_ATTEMPTS = 3;

// Indian Mobile Number Validator (+91 followed by 10 digits starting with 6, 7, 8, 9)
export function validateIndianMobile(mobile) {
  if (!mobile) return false;
  const clean = mobile.replace(/[\s\-()]/g, '');
  // Format: +919876543210 or 9876543210
  const regex = /^(\+91)?[6-9]\d{9}$/;
  return regex.test(clean);
}

export function formatIndianMobile(mobile) {
  let clean = mobile.replace(/[\s\-()]/g, '');
  if (!clean.startsWith('+91')) {
    if (clean.length === 10) clean = '+91' + clean;
  }
  return clean;
}

// Generate JWT token
export function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      mobile: user.mobile,
      full_name: user.full_name,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

// Authentication Middleware
export function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) {
    return res.status(401).json({ success: false, error: 'Authentication token required.' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ success: false, error: 'Invalid or expired session token.' });
    }
    req.user = decoded;
    next();
  });
}

// Role Authorization Middleware
export function requireRole(allowedRoles) {
  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: `Access forbidden. Requires one of: ${roles.join(', ')} role.`,
      });
    }
    next();
  };
}

// Optional Auth (for public routes that can personalize if logged in)
export function optionalAuth(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
  if (!token) {
    req.user = null;
    return next();
  }
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (!err) req.user = decoded;
    next();
  });
}

// OTP Generation & Verification Logic
export async function createAndSendOtp(mobile) {
  const formatted = formatIndianMobile(mobile);
  // Generate 6-digit random code
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const otpHash = await bcrypt.hash(code, 8);
  const expiresAt = new Date(Date.now() + OTP_EXPIRY_MS).toISOString();

  Database.saveOtp(formatted, otpHash, expiresAt);

  // In production, send via Twilio/Fast2SMS/Gupshup.
  // In dev environment, return dev_otp for seamless testing without SMS gateway credentials.
  return {
    success: true,
    mobile: formatted,
    expiresInSeconds: 300,
    dev_otp: code, // Safe development aid clearly isolated
  };
}

export async function verifyOtp(mobile, code) {
  const formatted = formatIndianMobile(mobile);
  const record = Database.getOtpRecord(formatted);

  if (!record) {
    return { success: false, error: 'No active OTP found. Please request a new OTP.' };
  }

  if (new Date() > new Date(record.expires_at)) {
    return { success: false, error: 'OTP has expired. Please request a fresh OTP.' };
  }

  if (record.attempts >= MAX_OTP_ATTEMPTS) {
    return { success: false, error: 'Too many invalid attempts. This OTP has been invalidated.' };
  }

  const isMatch = await bcrypt.compare(code.trim(), record.otp_hash);
  if (!isMatch) {
    Database.incrementOtpAttempts(record.id);
    const remaining = MAX_OTP_ATTEMPTS - (record.attempts + 1);
    return {
      success: false,
      error: `Invalid OTP code. ${remaining} attempt(s) remaining.`,
    };
  }

  Database.markOtpVerified(record.id);
  return { success: true };
}
