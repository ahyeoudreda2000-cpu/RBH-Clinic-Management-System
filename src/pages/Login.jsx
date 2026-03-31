import React, { useState } from 'react';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.email || !formData.password) {
            setError('Veuillez remplir tous les champs.');
            return;
        }

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('isAuthenticated', 'true');
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                navigate('/booking');
                setError('');
            } else {
                setError(data.message || 'Identifiants invalides.');
            }
        } catch (err) {
            setError('Erreur de connexion au serveur.');
        }
    };

    return (
        <div className="min-h-screen bg-cream flex items-center justify-center p-6 font-sans">
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white max-w-md w-full rounded-[2rem] shadow-sm border border-sage-light/20 p-8 sm:p-10"
            >
                <div className="text-center mb-8">
                    <h1 className="font-serif text-3xl font-bold text-sage-dark mb-2">Bienvenue</h1>
                    <p className="text-sage-light text-sm">Connectez-vous à votre espace patient RBH pour gérer vos rendez-vous.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <div className="bg-red-50 text-red-500 text-sm font-medium p-3 rounded-xl border border-red-100 text-center">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-bold text-sage-dark mb-2" htmlFor="email">
                            Adresse e-mail
                        </label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-sage-light group-focus-within:text-sage transition-colors">
                                <Mail className="w-5 h-5" />
                            </div>
                            <input
                                id="email"
                                type="email"
                                required
                                className="w-full pl-11 pr-4 py-3.5 bg-cream/30 border border-sage-light/30 rounded-2xl text-sage-dark placeholder-sage-light/50 focus:outline-none focus:ring-2 focus:ring-sage/50 focus:border-sage transition-all"
                                placeholder="prenom.nom@exemple.com"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="block text-sm font-bold text-sage-dark" htmlFor="password">
                                Mot de passe
                            </label>
                            <a href="/forgot-password" className="text-xs text-sage font-bold hover:underline focus:outline-none">Oublié ?</a>
                        </div>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-sage-light group-focus-within:text-sage transition-colors">
                                <Lock className="w-5 h-5" />
                            </div>
                            <input
                                id="password"
                                type="password"
                                required
                                className="w-full pl-11 pr-4 py-3.5 bg-cream/30 border border-sage-light/30 rounded-2xl text-sage-dark placeholder-sage-light/50 focus:outline-none focus:ring-2 focus:ring-sage/50 focus:border-sage transition-all"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-sage hover:bg-sage-dark text-white font-bold py-4 rounded-2xl shadow-sm flex justify-center items-center gap-2 transform hover:-translate-y-0.5 transition-all duration-200 mt-2 focus:outline-none focus:ring-2 focus:ring-sage focus:ring-offset-2"
                    >
                        Se connecter <ArrowRight className="w-5 h-5" />
                    </button>
                </form>

                <p className="text-center mt-8 text-sm text-sage-light font-medium">
                    Vous n'avez pas encore de compte ?{' '}
                    <a href="/register" className="text-sage-dark font-bold hover:underline hover:text-sage transition-colors focus:outline-none">S'inscrire</a>
                </p>
            </motion.div>
        </div>
    );
};

export default Login;
