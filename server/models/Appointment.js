import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    date: { type: String, required: true },
    city: { type: String, required: true },
    status: { type: String, default: 'En attente' }
}, { timestamps: true });

export default mongoose.model('Appointment', appointmentSchema);
