import React, { useState } from 'react';
import { User, Mail, Lock, Phone, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: ''
    });
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation du numéro de téléphone Marocain (+212 ou 0)
        const phoneRegex = /^(?:\+212|0)[5-7]\d{8}$/;
        if (!phoneRegex.test(formData.phone.replace(/\s+/g, ''))) {
            setError("Le numéro de téléphone marocain n'est pas valide (ex: 06 12 34 56 78).");
            return;
        }

        try {
            const response = await fetch('/api/auth/register', {
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
                setError(data.message || 'Une erreur est survenue lors de l\'inscription.');
            }
        } catch (err) {
            setError('Erreur de connexion au serveur.');
        }
    };

    return (
        <div className="min-h-screen bg-cream flex items-center justify-center p-6 font-sans py-12">
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white max-w-lg w-full rounded-[2rem] shadow-sm border border-sage-light/20 p-8 sm:p-10"
            >
                <div className="text-center mb-8">
                    <h1 className="font-serif text-3xl font-bold text-sage-dark mb-2">Créer un compte</h1>
                    <p className="text-sage-light text-sm flex-wrap">Rejoignez la clinique RBH pour réserver et suivre vos consultations.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {error && (
                        <div className="bg-red-50 text-red-500 text-sm font-medium p-3 rounded-xl border border-red-100 text-center">
                            {error}
                        </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-sm font-bold text-sage-dark mb-2">Prénom</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-sage-light group-focus-within:text-sage transition-colors">
                                    <User className="w-4 h-4" />
                                </div>
                                <input
                                    type="text"
                                    required
                                    className="w-full pl-10 pr-4 py-3 bg-cream/30 border border-sage-light/30 rounded-2xl text-sage-dark placeholder-sage-light/50 focus:outline-none focus:ring-2 focus:ring-sage/50 focus:border-sage transition-all"
                                    placeholder="Prénom"
                                    value={formData.firstName}
                                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-sage-dark mb-2">Nom</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-sage-light group-focus-within:text-sage transition-colors">
                                    <User className="w-4 h-4" />
                                </div>
                                <input
                                    type="text"
                                    required
                                    className="w-full pl-10 pr-4 py-3 bg-cream/30 border border-sage-light/30 rounded-2xl text-sage-dark placeholder-sage-light/50 focus:outline-none focus:ring-2 focus:ring-sage/50 focus:border-sage transition-all"
                                    placeholder="Nom"
                                    value={formData.lastName}
                                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-sage-dark mb-2">Adresse e-mail</label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-sage-light group-focus-within:text-sage transition-colors">
                                <Mail className="w-5 h-5" />
                            </div>
                            <input
                                type="email"
                                required
                                className="w-full pl-11 pr-4 py-3 bg-cream/30 border border-sage-light/30 rounded-2xl text-sage-dark placeholder-sage-light/50 focus:outline-none focus:ring-2 focus:ring-sage/50 focus:border-sage transition-all"
                                placeholder="prenom.nom@exemple.com"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-sage-dark mb-2 flex items-center gap-1">
                            Téléphone <span className="text-[10px] uppercase text-sage-light font-bold bg-sage/10 px-2 py-0.5 rounded-full ml-1">Maroc</span>
                        </label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-sage-light group-focus-within:text-sage transition-colors">
                                <Phone className="w-5 h-5" />
                            </div>
                            <input
                                type="tel"
                                required
                                className="w-full pl-11 pr-4 py-3 bg-cream/30 border border-sage-light/30 rounded-2xl text-sage-dark placeholder-sage-light/50 focus:outline-none focus:ring-2 focus:ring-sage/50 focus:border-sage transition-all"
                                placeholder="06 XX XX XX XX"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-sage-dark mb-2">Mot de passe</label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-sage-light group-focus-within:text-sage transition-colors">
                                <Lock className="w-5 h-5" />
                            </div>
                            <input
                                type="password"
                                required
                                minLength="8"
                                className="w-full pl-11 pr-4 py-3 bg-cream/30 border border-sage-light/30 rounded-2xl text-sage-dark placeholder-sage-light/50 focus:outline-none focus:ring-2 focus:ring-sage/50 focus:border-sage transition-all"
                                placeholder="Créer un mot de passe sécurisé"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                        </div>
                        <p className="text-xs text-sage-light mt-2">Le mot de passe doit contenir au moins 8 caractères.</p>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-sage hover:bg-sage-dark text-white font-bold py-4 rounded-2xl shadow-sm flex justify-center items-center gap-2 transform hover:-translate-y-0.5 transition-all duration-200 mt-6 focus:outline-none focus:ring-2 focus:ring-sage focus:ring-offset-2"
                    >
                        S'inscrire <ArrowRight className="w-5 h-5" />
                    </button>
                </form>

                <p className="text-center mt-6 text-sm text-sage-light font-medium">
                    Vous avez déjà un compte ?{' '}
                    <a href="/login" className="text-sage-dark font-bold hover:underline hover:text-sage transition-colors focus:outline-none">Se connecter</a>
                </p>
            </motion.div>
        </div>
    );
};

export default Register;
