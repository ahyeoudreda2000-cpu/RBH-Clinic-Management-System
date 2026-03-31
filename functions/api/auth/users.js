import { connectToDatabase } from '../../utils/db.js';

export const onRequestGet = async (context) => {
    const { env } = context;
    try {
        const db = await connectToDatabase(env);
        const usersCollection = db.collection('users');
        const users = await usersCollection.find({}).sort({ createdAt: -1 }).project({ password: 0 }).toArray();
        
        return new Response(JSON.stringify(users), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (err) {
        return new Response(JSON.stringify({ message: err.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
};
