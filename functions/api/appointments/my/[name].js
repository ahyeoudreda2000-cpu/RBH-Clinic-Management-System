import { connectToDatabase } from '../../../utils/db.js';

export const onRequestGet = async (context) => {
    const { params, env } = context;
    const { name } = params;

    try {
        const db = await connectToDatabase(env);
        const appointmentsCollection = db.collection('appointments');
        const appointments = await appointmentsCollection.find({
            name: { "$regex": `^${decodeURIComponent(name)}$`, "$options": "i" }
        }).sort({ createdAt: -1 }).toArray();

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
