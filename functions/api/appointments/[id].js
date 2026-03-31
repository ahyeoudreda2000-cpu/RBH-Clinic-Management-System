import { ObjectId } from 'mongodb';
import { connectToDatabase } from '../../utils/db.js';

export const onRequestDelete = async (context) => {
    const { params, env } = context;
    const { id } = params;

    try {
        const db = await connectToDatabase(env);
        const appointmentsCollection = db.collection('appointments');
        await appointmentsCollection.deleteOne({ _id: new ObjectId(id) });
        return new Response(JSON.stringify({ message: 'Supprimé' }), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (err) {
        return new Response(JSON.stringify({ message: 'Erreur serveur', error: err.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
};

export const onRequestPut = async (context) => {
    const { params, request, env } = context;
    const { id } = params;

    try {
        const body = await request.json();
        const db = await connectToDatabase(env);
        const appointmentsCollection = db.collection('appointments');
        await appointmentsCollection.updateOne({ _id: new ObjectId(id) }, { "$set": body });
        return new Response(JSON.stringify({ message: 'Modifié', id }), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (err) {
        return new Response(JSON.stringify({ message: err.message }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
        });
    }
};
