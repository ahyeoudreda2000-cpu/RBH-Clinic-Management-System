import express from 'express';
import Appointment from '../models/Appointment.js';
import mongoose from 'mongoose';

const router = express.Router();

let localMockData = [
    { id: '1', name: "Fatima Zahra", date: "2026-03-28 10:00", city: "Casablanca", status: "Confirmé" },
    { id: '2', name: "Youssef Alaoui", date: "2026-03-29 14:30", city: "Rabat", status: "En attente" },
    { id: '3', name: "Amine Benali", date: "2026-03-30 09:15", city: "Marrakech", status: "Confirmé" }
];

// If Mongoose is not connected, use local memory mock (fallback)
const isConnected = () => mongoose.connection.readyState === 1;

// Get all appointments
router.get('/', async (req, res) => {
    if (!isConnected()) return res.json(localMockData);

    try {
        const appointments = await Appointment.find().sort({ createdAt: -1 });
        if (appointments.length === 0) {
            // Seed base data if empty
            const seedData = localMockData.map(app => ({ name: app.name, date: app.date, city: app.city, status: app.status }));
            await Appointment.insertMany(seedData);
            const newAppts = await Appointment.find().sort({ createdAt: -1 });
            return res.json(newAppts.map(app => ({ id: app._id.toString(), name: app.name, date: app.date, city: app.city, status: app.status })));
        }
        res.json(appointments.map(app => ({ id: app._id.toString(), name: app.name, date: app.date, city: app.city, status: app.status })));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update appointment
router.put('/:id', async (req, res) => {
    if (!isConnected()) {
        const idx = localMockData.findIndex(app => app.id === req.params.id);
        if (idx !== -1) {
            localMockData[idx] = { ...localMockData[idx], ...req.body };
            return res.json(localMockData[idx]);
        }
        return res.status(404).json({ message: 'Not found' });
    }

    try {
        const updated = await Appointment.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json({ id: updated._id.toString(), name: updated.name, date: updated.date, city: updated.city, status: updated.status });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete appointment
router.delete('/:id', async (req, res) => {
    if (!isConnected()) {
        localMockData = localMockData.filter(app => app.id !== req.params.id);
        return res.json({ message: 'Deleted' });
    }

    try {
        await Appointment.findByIdAndDelete(req.params.id);
        res.json({ message: 'Deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

// Create appointment
router.post('/', async (req, res) => {
    const { name, date, city } = req.body;

    if (!isConnected()) {
        const newAppt = { id: Date.now().toString(), name, date, city, status: 'En attente' };
        localMockData.unshift(newAppt);
        return res.status(201).json(newAppt);
    }

    try {
        const appointment = new Appointment({ name, date, city });
        await appointment.save();
        res.status(201).json({ id: appointment._id.toString(), name, date, city, status: appointment.status });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get user's own appointment
router.get('/my/:name', async (req, res) => {
    if (!isConnected()) {
        const myAppts = localMockData.filter(app => app.name.toLowerCase() === req.params.name.toLowerCase());
        return res.json(myAppts);
    }

    try {
        const appointments = await Appointment.find({
            name: { $regex: new RegExp(`^${req.params.name}$`, 'i') }
        }).sort({ createdAt: -1 });

        res.json(appointments.map(app => ({ id: app._id.toString(), name: app.name, date: app.date, city: app.city, status: app.status })));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
