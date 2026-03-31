import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { connectToDatabase } from '../../utils/db.js';

export const onRequestPost = async (context) => {
    const { request, env } = context;
    
    try {
        const body = await request.json();
        const { email, password } = body;

        // 1. Validation de base
        if (!email || !password) {
            return new Response(JSON.stringify({ message: 'Email et mot de passe requis.' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // --- SECTION SPECIALE ADMIN ---
        // On permet la connexion avec les identifiants par défaut fournis par l'utilisateur
        if (email === 'ADMIN' && password === 'RBH2026@project') {
            const payload = {
                user: { id: 'admin-id', role: 'admin' }
            };
            const token = jwt.sign(payload, env.JWT_SECRET || 'secret_key', { expiresIn: '7d' });
            return new Response(JSON.stringify({
                token,
                user: { firstName: 'Admin', lastName: 'RBH', email: 'ADMIN' },
                message: 'Connexion Admin réussie.'
            }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' }
            });
        }
        // ------------------------------

        // 2. Connexion à la base de données (pour les autres utilisateurs)
        const db = await connectToDatabase(env);
        const usersCollection = db.collection('users');

        // 3. Vérifier si l'utilisateur existe
        const user = await usersCollection.findOne({ email: email.toLowerCase() });
        if (!user) {
            return new Response(JSON.stringify({ message: 'Identifiants invalides.' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // 4. Comparaison du mot de passe
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return new Response(JSON.stringify({ message: 'Identifiants invalides.' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // 5. Génération du JWT
        const payload = {
            user: { id: user._id, role: user.role }
        };
        const token = jwt.sign(payload, env.JWT_SECRET || 'secret_key', { expiresIn: '7d' });

        return new Response(JSON.stringify({
            token,
            user: { firstName: user.firstName, lastName: user.lastName, email: user.email },
            message: 'Connexion réussie.'
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (err) {
        console.error('Erreur Login Function:', err.message);
        return new Response(JSON.stringify({ message: 'Erreur serveur', error: err.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
};
