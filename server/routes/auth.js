import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

// POST /api/auth/register
router.post('/register', async (req, res) => {
    try {
        const { firstName, lastName, email, phone, password } = req.body;

        // Check if user already exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'Un utilisateur avec cet email existe déjà.' });
        }

        // Create user
        user = new User({
            firstName,
            lastName,
            email,
            phone,
            password
        });

        await user.save();

        // Generate JWT
        const payload = {
            user: {
                id: user.id,
                role: user.role
            }
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET || 'secret_key', {
            expiresIn: '7d'
        });

        res.status(201).json({
            token,
            user: { firstName, lastName, email },
            message: 'Inscription réussie.'
        });
    } catch (err) {
        console.error('Erreur lors de l\'inscription:', err.message);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Identifiants invalides.' });
        }

        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Identifiants invalides.' });
        }

        // Generate JWT
        const payload = {
            user: {
                id: user.id,
                role: user.role
            }
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET || 'secret_key', {
            expiresIn: '7d'
        });

        res.json({
            token,
            user: { firstName: user.firstName, lastName: user.lastName, email: user.email },
            message: 'Connexion réussie.'
        });
    } catch (err) {
        console.error('Erreur lors de la connexion:', err.message);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

// GET /api/auth/users
router.get('/users', async (req, res) => {
    try {
        const users = await User.find({}).select('-password').sort({ createdAt: -1 });
        res.json(users);
    } catch (err) {
        console.error('Erreur lors de la récupération des utilisateurs:', err.message);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

export default router;
