import { connectToDatabase } from '../../utils/db.js';

export const onRequestGet = async (context) => {
    const { env } = context;
    try {
        const db = await connectToDatabase(env);
        const appointmentsCollection = db.collection('appointments');
        const appointments = await appointmentsCollection.find({}).sort({ createdAt: -1 }).toArray();
        
        // Formattage pour correspondre au frontend
        const formatted = appointments.map(app => ({
            id: app._id,
            name: app.name,
            date: app.date,
            city: app.city,
            status: app.status
        }));
        
        return new Response(JSON.stringify(formatted), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (err) {
        return new Response(JSON.stringify({ message: err.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
};

export const onRequestPost = async (context) => {
    const { request, env } = context;
    try {
        const body = await request.json();
        const { name, date, city } = body;

        if (!name || !date || !city) {
            return new Response(JSON.stringify({ message: 'Tous les champs sont requis.' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const db = await connectToDatabase(env);
        const appointmentsCollection = db.collection('appointments');

        const newAppointment = {
            name,
            date,
            city,
            status: 'En attente',
            createdAt: new Date()
        };

        const result = await appointmentsCollection.insertOne(newAppointment);
        
        return new Response(JSON.stringify({
            id: result.insertedId,
            ...newAppointment
        }), {
            status: 201,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (err) {
        return new Response(JSON.stringify({ message: err.message }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
        });
    }
};
