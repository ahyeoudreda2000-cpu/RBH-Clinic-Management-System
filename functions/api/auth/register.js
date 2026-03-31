import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { connectToDatabase } from '../../utils/db.js';

export const onRequestPost = async (context) => {
    const { request, env } = context;
    
    try {
        const body = await request.json();
        const { firstName, lastName, email, phone, password } = body;

        // 1. Validation de base
        if (!firstName || !lastName || !email || !phone || !password) {
            return new Response(JSON.stringify({ message: 'Tous les champs sont requis.' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // 2. Connexion à la base de données
        const db = await connectToDatabase(env);
        const usersCollection = db.collection('users');

        // 3. Vérifier si l'utilisateur existe déjà
        const existingUser = await usersCollection.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return new Response(JSON.stringify({ message: 'Un utilisateur avec cet email existe déjà.' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // 4. Hachage du mot de passe
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 5. Création de l'utilisateur
        const newUser = {
            firstName,
            lastName,
            email: email.toLowerCase(),
            phone,
            password: hashedPassword,
            role: 'patient',
            createdAt: new Date()
        };

        const result = await usersCollection.insertOne(newUser);

        // 6. Génération du JWT
        const payload = {
            user: {
                id: result.insertedId,
                role: 'patient'
            }
        };

        const token = jwt.sign(payload, env.JWT_SECRET || 'secret_key', {
            expiresIn: '7d'
        });

        return new Response(JSON.stringify({
            token,
            user: { firstName, lastName, email },
            message: 'Inscription réussie.'
        }), {
            status: 201,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (err) {
        console.error('Erreur Register Function:', err.message);
        return new Response(JSON.stringify({ message: 'Erreur serveur', error: err.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
};
