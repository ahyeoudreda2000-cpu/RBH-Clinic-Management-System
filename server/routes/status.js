import express from 'express';
import mongoose from 'mongoose';
const router = express.Router();

// Mock active users tracking
let activeUsers = 12;

router.get('/active-users', (req, res) => {
    const activeUsersMap = req.app.get('activeUsersMap');
    let visitors = 0;
    let patients = 0;

    if (activeUsersMap) {
        for (const data of activeUsersMap.values()) {
            if (data.type === 'patient') patients++;
            else visitors++;
        }
    }

    res.json({ visitors, patients });
});

router.get('/db-status', (req, res) => {
    const states = ['disconnected', 'connected', 'connecting', 'disconnecting'];
    const state = mongoose.connection.readyState;
    res.status(200).json({
        status: states[state] || 'unknown',
        readyState: state,
        timestamp: new Date().toISOString()
    });
});

export default router;
