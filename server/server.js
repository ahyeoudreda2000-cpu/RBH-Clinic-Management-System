import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import appointmentRoutes from './routes/appointments.js';
import statusRoutes from './routes/status.js';
import authRoutes from './routes/auth.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Real-time Active Users Tracking
const activeUsersMap = new Map();
const SESSION_TIMEOUT = 30 * 1000; // 30 seconds

app.use((req, res, next) => {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const authHeader = req.headers['authorization'] || '';
    const isPatient = authHeader.startsWith('Bearer ');

    activeUsersMap.set(ip, {
        lastSeen: Date.now(),
        type: isPatient ? 'patient' : 'visitor'
    });
    next();
});

// Cleanup inactive users every 10 seconds for higher reactivity
setInterval(() => {
    const now = Date.now();
    for (const [ip, data] of activeUsersMap.entries()) {
        if (now - data.lastSeen > SESSION_TIMEOUT) {
            activeUsersMap.delete(ip);
        }
    }
}, 10000);

// Export for routes
app.set('activeUsersMap', activeUsersMap);


// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/rbh-clinic';
mongoose.connect(MONGO_URI)
    .then(() => console.log('✅ Connected to MongoDB'))
    .catch(err => {
        console.error('❌ MongoDB connection error:', err.message);
        console.log('⚠️ Running in mock mode due to DB connection failure (or pending DB setup).');
    });

// Routes
app.use('/api/appointments', appointmentRoutes);
app.use('/api/status', statusRoutes);
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
