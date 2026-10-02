import express from 'express';
import path from 'path';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { router as apiRouter } from './backend/routes.js';
import { initDatabase } from './backend/db.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static frontend assets from public/ directory
app.use(express.static(path.join(__dirname, 'public')));

// Mount REST API
app.use('/api', apiRouter);

// Initialize Relational Database
await initDatabase();

// Route all primary HTML views
app.get('/doctors', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/doctors.html'));
});

app.get('/recommend', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/recommend.html'));
});

app.get('/appointments', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/appointments.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/login.html'));
});

app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/register.html'));
});

app.get('/doctor-dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/doctor-dashboard.html'));
});

app.get('/admin-dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/admin-dashboard.html'));
});

// Root catch-all serves public/index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

// Start Express Server on port 3000
app.listen(PORT, '0.0.0.0', () => {
  console.log(`[Kynovia AI] Server initialized and listening on http://0.0.0.0:${PORT}`);
  console.log(`[Kynovia AI] Primary operational hub: Bengaluru, Karnataka, India (₹ INR)`);
});
